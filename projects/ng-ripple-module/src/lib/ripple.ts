/**
 * @license
 * Copyright (c) 2019 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import {
  NgZone,
  ApplicationRef,
  ComponentFactoryResolver,
  Injectable
} from '@angular/core';

import { Subscription } from 'rxjs';

import {
  RippleConfigs,
  RippleComponentConfigs
} from './ripple.configs';

import { RippleHost } from './ripple.host';
import { RippleListener } from './ripple.strategy';
import { RipplePublisher } from './ripple.event';
import { RippleCmpRef } from './ripple.cmpref';

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

@Injectable()
export class Ripple {

  host: RippleHost;
  configs: RippleComponentConfigs;
  publisher: RipplePublisher;
  listener: RippleListener;
  componentRef: RippleCmpRef;

  pointer: string;
  trigger: string;
  dismountTimeout: any;

  subscriptions = new Subscription();

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
    this.componentRef = new RippleCmpRef(this);
  }

  subscribeEmitter(context: any) {
    if(!this.publisher) {
      this.publisher = new RipplePublisher(this);
    }
    this.publisher.subscribeEmitter(context);
  }

  get background() {
    return this.componentRef.background.instance;
  }

  get core() {
    return this.componentRef.core.instance;
  }

  get isMounted(): boolean {
    return this.host.element.contains(this.core.element);
  }

  mountElement() {
    if(!this.isMounted) {
      clearTimeout(this.dismountTimeout);
      this.componentRef.references.forEach(cmpRef => {
        this.host.element.appendChild(cmpRef.instance.element);
      });
      this.activate();
    }
  }

  dismountElement() {
    this.componentRef.references.forEach(cmpRef => {
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

  destroy() {
    clearTimeout(this.dismountTimeout);
    this.componentRef.destroy();
    this.subscriptions.unsubscribe();
    this.listener.destroy();
  }

  activate() {
    this.host.element.classList.add(this.core.configs.activeClass);
  }

  deactivate() {
    this.host.element.classList.remove(this.core.configs.activeClass);
  }
}
