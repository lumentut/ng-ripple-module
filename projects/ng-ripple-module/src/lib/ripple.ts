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
import { RippleMotionTracker } from './ripple.tracker';
import { PointerStrategy, PointerDownListener } from './ripple.strategy';

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

export const POINTER = {
  mouse: 'mouse',
  touch: 'touch',
  mousedown: 'mouse',
  touchstart: 'touch'
};

export class Ripple {

  host: RippleHost;
  coreRect: ClientRect;
  backgroundRect: ClientRect;
  coreCmpRef: ComponentRef<any>;
  backgroundCmpRef: ComponentRef<any>;
  configs: RippleComponentConfigs;
  pointerdownListener: PointerDownListener;
  state: RippleState;

  strategy: any;
  pointer: string;
  reAnimate: boolean;
  dismountTimeout: any;

  tracker = new RippleMotionTracker();
  pressPublisher = new Subject<any>();

  constructor(
    public ngZone: NgZone,
    public element: HTMLElement,
    private cfr: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private baseConfigs: RippleConfigs
  ) {
    this.host = new RippleHost(element);
    this.configs = new RippleComponentConfigs(this.baseConfigs);
    this.pointerdownListener = new PointerDownListener(this);
    this.init();
  }

  private get componentRefs(): any[] {
    return [this.coreCmpRef, this.backgroundCmpRef];
  }

  private init() {
    this.backgroundCmpRef = this.cfr.resolveComponentFactory(BackgroundComponent).create(this.backgroundInjector);
    this.coreCmpRef = this.cfr.resolveComponentFactory(CoreComponent).create(this.coreInjector);
    this.componentRefs.forEach(cmpRef => this.appRef.attachView(cmpRef.hostView));
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
    this.pointerdownListener.remove();
  }

  get isMounted(): boolean {
    return this.element.contains(this.core.element) || this.element.contains(this.background.element);
  }

  onPointerDown = (event: any) => {
    this.pointer = POINTER[event.pointerType || event.type];
    this.strategy = new PointerStrategy(this);
    this.strategy.attachListeners();
    this.tracker.startTrack(event);
    this.activate();
    this.mountElement();
    this.core.fill(event);
  }

  activate() {
    this.element.classList.add(this.core.configs.activeClass);
  }

  deactivate() {
    this.element.classList.remove(this.core.configs.activeClass);
  }
}
