/**
 * @license
 * Copyright (c) 2019 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import {
  NgZone,
  Injector,
  ComponentRef,
  ApplicationRef,
  ComponentFactoryResolver,
  Injectable
} from '@angular/core';

import { Subject } from 'rxjs';

import {
  RippleConfigs,
  RippleComponentConfigs,
  RIPPLE_BG_CONFIGS,
  RIPPLE_CORE_CONFIGS,
} from './ripple.configs';

import { RippleHost } from './ripple.host';
import { BackgroundComponent } from './ripple-bg.component';
import { CoreComponent } from './ripple-core.component';
import { RippleListener } from './ripple.strategy';

export interface Coordinate {
  x: number;
  y: number;
}

export interface Margin {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

export interface RippleStyle {
  width?: number;
  height?: number;
  marginLeft?: number;
  marginTop?: number;
  background?: string;
}

export enum ComponentReference {
  BACKGROUND = 'backgroundCmpRef',
  CORE = 'coreCmpRef'
}

@Injectable()
export class Ripple {

  host: RippleHost;
  coreCmpRef: ComponentRef<any>;
  backgroundCmpRef: ComponentRef<any>;
  configs: RippleComponentConfigs;
  listener: RippleListener;
  componentRefs = [];

  pointer: string;
  trigger: string;
  dismountTimeout: any;

  pressPublisher = new Subject<any>();
  pressupPublisher = new Subject<any>();
  tapPublisher = new Subject<any>();
  clickPublisher = new Subject<any>();

  constructor(
    public ngZone: NgZone,
    private cfr: ComponentFactoryResolver,
    private appRef: ApplicationRef
  ) {
    this.trigger = 'onpointerdown' in window ? 'pointerdown' : 'fallback';
  }

  initialize(element: HTMLElement, configs: RippleConfigs) {
    this.host = new RippleHost(element);
    this.configs = new RippleComponentConfigs(configs);
    this.listener = new RippleListener(this);
    this.createComponentRefs();
  }

  get haveBackground(): boolean {
    return this.configs.base.backgroundIncluded;
  }

  private createComponentRef(cmpRef: string, component: any, injector: Injector) {
    this[cmpRef] = this.cfr.resolveComponentFactory(component).create(injector);
    this.appRef.attachView(this[cmpRef].hostView);
    this[cmpRef].changeDetectorRef.detach();
    this.componentRefs.push(this[cmpRef]);
  }

  private createComponentRefs() {
    if(this.haveBackground) {
      this.createComponentRef(ComponentReference.BACKGROUND, BackgroundComponent, this.backgroundInjector);
    }
    this.createComponentRef(ComponentReference.CORE, CoreComponent, this.coreInjector);
  }

  private get backgroundInjector(): Injector {
    return Injector.create({
      providers: [{ provide: RIPPLE_BG_CONFIGS, useValue: this.configs.rippleBackground }]
    });
  }

  get background() {
    return this.backgroundCmpRef.instance;
  }

  private get coreInjector(): Injector {
    const providers = [
      { provide: RIPPLE_CORE_CONFIGS, useValue: this.configs.rippleCore },
      { provide: RippleHost, useValue: this.host },
    ];

    const backgroundProvider = [];
    if(this.haveBackground) {
      backgroundProvider.push({ provide: BackgroundComponent, useValue: this.background });
    }
    return Injector.create({ providers: [...providers, ...backgroundProvider] });
  }

  get core() {
    return this.coreCmpRef.instance;
  }

  get isMounted(): boolean {
    return this.host.element.contains(this.core.element);
  }

  mountElement() {
    if(!this.isMounted) {
      clearTimeout(this.dismountTimeout);
      this.coreCmpRef.instance.resize();
      this.componentRefs.forEach(cmpRef => {
        this.host.element.appendChild(cmpRef.instance.element);
      });
      this.activate();
    }
  }

  dismountElement() {
    this.componentRefs.forEach(cmpRef => {
      if(cmpRef.instance.element.parentNode === this.host.element) {
        this.host.element.removeChild(cmpRef.instance.element);
      }
    });
  }

  prepareForDismounting() {
    this.deactivate();
    this.dismountTimeout = setTimeout(() => {
      this.dismountElement();
    }, this.configs.dismountTimeoutDuration);
  }

  onDestroy() {
    clearTimeout(this.dismountTimeout);
    this.coreCmpRef.destroy();
    if(this.haveBackground) { this.backgroundCmpRef.destroy(); }
    this.listener.destroy();
  }

  activate() {
    this.host.element.classList.add(this.core.configs.activeClass);
  }

  deactivate() {
    this.host.element.classList.remove(this.core.configs.activeClass);
  }
}
