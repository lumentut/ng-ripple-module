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
  RIPPLE_CORE_CONFIGS
} from './ripple.configs';

import { RippleHost } from './ripple.host';
import { RippleState } from './ripple.component';
import { BackgroundComponent } from './ripple-bg.component';
import { CoreComponent } from './ripple-core.component';
import { RipplePointerListener } from './ripple.strategy';

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

export class Ripple {

  host: RippleHost;
  coreCmpRef: ComponentRef<any>;
  backgroundCmpRef: ComponentRef<any>;
  configs: RippleComponentConfigs;
  listener: RipplePointerListener;
  state: RippleState;

  pointer: string;
  listenerType: string;
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
    this.listenerType = 'onpointerdown' in window ? 'pointerdown' : 'fallback';
    this.listener = new RipplePointerListener(this);
    this.createComponentRef();
  }

  private get componentRefs(): any[] {
    return [this.coreCmpRef, this.backgroundCmpRef];
  }

  private createComponentRef() {
    this.backgroundCmpRef = this.cfr.resolveComponentFactory(BackgroundComponent).create(this.backgroundInjector);
    this.coreCmpRef = this.cfr.resolveComponentFactory(CoreComponent).create(this.coreInjector);
    this.componentRefs.forEach(cmpRef => {
      this.appRef.attachView(cmpRef.hostView);
      cmpRef.changeDetectorRef.detach();
    });
  }

  private get backgroundInjector(): Injector {
    return Injector.create({
      providers: [
        { provide: RIPPLE_BG_CONFIGS, useValue: this.configs.rippleBackground },
        { provide: RippleHost, useValue: this.host },
    ]});
  }

  get background() {
    return this.backgroundCmpRef.instance;
  }

  private get coreInjector(): Injector {
    return Injector.create({ providers: [
      { provide: RIPPLE_CORE_CONFIGS, useValue: this.configs.rippleCore },
      { provide: BackgroundComponent, useValue: this.background },
      { provide: RippleHost, useValue: this.host },
    ]});
  }

  get core() {
    return this.coreCmpRef.instance;
  }

  get isMounted(): boolean {
    return this.element.contains(this.core.element) || this.element.contains(this.background.element);
  }

  mountElement() {
    if(!this.isMounted) {
      this.componentRefs.forEach(cmpRef => {
        this.element.appendChild(cmpRef.instance.element);
      });
    }
  }

  dismountElement() {
    this.componentRefs.forEach(cmpRef => {
      if(cmpRef.instance.element.parentNode === this.element) {
        this.element.removeChild(cmpRef.instance.element);
      }
    });
  }

  prepareForDismounting() {
    this.dismountTimeout = setTimeout(() => {
      this.ngZone.runOutsideAngular(() => this.dismountElement());
    }, this.background.fadeDuration + 250);
  }

  onDestroy() {
    this.coreCmpRef.destroy();
    this.backgroundCmpRef.destroy();
    this.listener.stopListening();
  }

  activate() {
    this.element.classList.add(this.core.configs.activeClass);
  }

  deactivate() {
    this.element.classList.remove(this.core.configs.activeClass);
  }
}
