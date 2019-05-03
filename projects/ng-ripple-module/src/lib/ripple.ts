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
  ComponentFactoryResolver
} from '@angular/core';

import { Subject } from 'rxjs';

import {
  RippleConfigs,
  RippleComponentConfigs,
  RIPPLE_BG_CONFIGS,
  RIPPLE_CORE_CONFIGS,
} from './ripple.configs';

import { RIPPLE_DISMOUNTING_TIMEOUT } from './ripple.constants';

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

export class Ripple {

  host: RippleHost;
  coreCmpRef: ComponentRef<any>;
  backgroundCmpRef: ComponentRef<any>;
  configs: RippleComponentConfigs;
  listener: RippleListener;
  componentsReference: any[];

  pointer: string;
  trigger: string;
  dismountTimeout: any;

  pressPublisher = new Subject<any>();
  pressupPublisher = new Subject<any>();
  tapPublisher = new Subject<any>();
  clickPublisher = new Subject<any>();

  constructor(
    public ngZone: NgZone,
    public element: HTMLElement,
    private cfr: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private baseConfigs: RippleConfigs
  ) {
    this.host = new RippleHost(element);
    this.configs = new RippleComponentConfigs(this.baseConfigs);
    this.trigger = 'onpointerdown' in window ? 'pointerdown' : 'fallback';
    this.listener = new RippleListener(this);
    this.createComponentRefs();
  }

  get haveBackground(): boolean {
    return this.baseConfigs.backgroundIncluded;
  }

  private get componentsRef(): any[] {
    return this.componentsReference;
  }

  private createComponentRef(cmpRef: string, component: any, injector: Injector) {
    this[cmpRef] = this.cfr.resolveComponentFactory(component).create(injector);
    this.appRef.attachView(this[cmpRef].hostView);
    this[cmpRef].changeDetectorRef.detach();
  }

  private createComponentRefs() {
    if(this.haveBackground) {
      this.createComponentRef(ComponentReference.BACKGROUND, BackgroundComponent, this.backgroundInjector);
    }
    this.createComponentRef(ComponentReference.CORE, CoreComponent, this.coreInjector);
    this.createComponentsReference();
  }

  private createComponentsReference() {
    this.componentsReference = [this.coreCmpRef];
    if(this.haveBackground) {
      this.componentsReference.push(this.backgroundCmpRef);
    }
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
    return this.element.contains(this.core.element);
  }

  mountElement() {
    if(!this.isMounted) {
      clearTimeout(this.dismountTimeout);
      this.coreCmpRef.instance.resize();
      this.componentsRef.forEach(cmpRef => {
        this.element.appendChild(cmpRef.instance.element);
      });
      this.activate();
    }
  }

  dismountElement() {
    this.componentsRef.forEach(cmpRef => {
      if(cmpRef.instance.element.parentNode === this.element) {
        this.element.removeChild(cmpRef.instance.element);
      }
    });
  }

  prepareForDismounting() {
    this.deactivate();
    this.dismountTimeout = setTimeout(() => {
      this.ngZone.runOutsideAngular(() => this.dismountElement());
    }, RIPPLE_DISMOUNTING_TIMEOUT);
  }

  onDestroy() {
    this.coreCmpRef.destroy();
    if(this.haveBackground) { this.backgroundCmpRef.destroy(); }
    this.listener.stopListening(this.listener.listeners);
  }

  activate() {
    this.element.classList.add(this.core.configs.activeClass);
  }

  deactivate() {
    this.element.classList.remove(this.core.configs.activeClass);
  }
}
