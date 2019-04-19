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
import { BackgroundComponent } from './ripple-bg.component';
import { RippleComponent } from './ripple.component';
import { RippleMotionTracker } from './ripple.tracker';

import {
  PointerStrategy,
  MouseStrategy,
  TouchStrategy
} from './ripple.strategy';

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

export enum RippleCmpRefs {
  RIPPLE = 'coreCmpRef',
  BACKGROUND = 'backgroundCmpRef'
}

export class Ripple {

  host: RippleHost;
  coreRect: ClientRect;
  backgroundRect: ClientRect;
  coreCmpRef: ComponentRef<any>;
  backgroundCmpRef: ComponentRef<any>;

  configs: RippleComponentConfigs;
  tracker: RippleMotionTracker;

  strategy: any;
  pointer: string;
  isPressing: boolean;

  watchPress = new Subject<any>();

  constructor(
    public ngZone: NgZone,
    public element: HTMLElement,
    private cfr: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private baseConfigs: RippleConfigs
  ) {
    this.host = new RippleHost(element);
    this.configs = new RippleComponentConfigs(this.baseConfigs);
    this.tracker = new RippleMotionTracker();
    this.createComponentRef(this.backgroundInjector, BackgroundComponent, RippleCmpRefs.BACKGROUND);
    this.createComponentRef(this.coreInjector, RippleComponent, RippleCmpRefs.RIPPLE);
    this.initPointerDownListener();
  }

  private createComponentRef(injector: Injector, component: any, cmpRefName: string) {
    this[`${cmpRefName}`] = this.cfr.resolveComponentFactory(component).create(injector);
    this.appRef.attachView(this[`${cmpRefName}`].hostView);
  }

  get backgroundInjector(): Injector {
    return Injector.create({
      providers: [{ provide: RIPPLE_BG_CONFIGS, useValue: this.configs.rippleBackground }]
    });
  }

  get background() {
    return this.backgroundCmpRef.instance;
  }

  get coreInjector(): Injector {
    return Injector.create({ providers: [
      { provide: RIPPLE_CORE_CONFIGS, useValue: this.configs.rippleCore },
      { provide: BackgroundComponent, useValue: this.background },
      { provide: RippleHost, useValue: this.host }
    ]});
  }

  get core() {
    return this.coreCmpRef.instance;
  }

  mountElement() {
    [this.coreCmpRef, this.backgroundCmpRef].forEach(cmpRef => {
      this.element.appendChild(cmpRef.instance.element);
    });
  }

  dismountElement() {
    [this.coreCmpRef, this.backgroundCmpRef].forEach(cmpRef => {
      this.element.removeChild(cmpRef.instance.element);
    });
  }

  onDestroy() {
    this.coreCmpRef.destroy();
    this.backgroundCmpRef.destroy();
    this.removePointerDownListener();
  }

  initPointerDownListener() {
    this.ngZone.runOutsideAngular(() => {
      this.element.addEventListener('pointerdown', this.onPointerDown, false);
    });
  }

  removePointerDownListener() {
    this.ngZone.runOutsideAngular(() => {
      this.element.removeEventListener('pointerdown', this.onPointerDown);
    });
  }

  onPointerDown = (event: PointerEvent) => {
    this.pointer = event.pointerType;
    this.tracker.startTrack(event);
    this.mountElement();
    this.strategy = new PointerStrategy(this);
    this.strategy.attachListeners();
    this.core.fill(event);
    this.activate();
  }

  activate() {
    this.isPressing = true;
    this.element.classList.add(this.core.configs.activeClass);
    this.ngZone.runOutsideAngular(() => this.watchPress.next());
  }

  deactivate() {
    this.element.classList.remove(this.core.configs.activeClass);
    this.isPressing = false;
  }
}
