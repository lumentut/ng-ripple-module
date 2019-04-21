/**
 * @license
 * Copyright (c) 2019 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import { Ripple } from './ripple';

export type PointerListener = [string, (event: TouchEvent | MouseEvent) => any];

export class RippleListener {

  listeners: PointerListener[];
  emitEvent: boolean = true;

  constructor(public context: any) {
    clearTimeout(this.context.dismountTimeout);
  }

  execute(action: string) {
    this.listeners.forEach((item) => {
      const type = item[0]; const handler = item[1];
      this.context.element[action](type, handler);
    });
  }

  attachListeners() {
    this.execute('addEventListener');
  }

  detachListeners() {
    this.execute('removeEventListener');
  }

  onMove(event: any) {
    this.context.tracker.trackMove(event);
    if(!this.context.core.pointerEventCoordinateIsInHostArea(event)) {
      return this.splash();
    }
    if(this.context.core.outerPointStillInHostRadius(event)) {
      return this.context.core.translate(event);
    }
    return;
  }

  onEnd(event: any) {
    this.detachListeners();
    this.context.prepareForDismounting();
    this.context.tracker.trackUp(event);
    this.splash();
  }

  splash() {
    this.context.deactivate();
    this.context.core.splash();
  }
}

export class MouseStrategy extends RippleListener {

  constructor(public context: Ripple) {
    super(context);
  }

  get listeners(): PointerListener[] {
    return [
      ['mousemove', this.onMouseMove],
      ['mouseup', this.onMouseUp],
      ['mouseleave', this.onMouseLeave]
    ];
  }

  onMouseMove = (event: MouseEvent) => {
    this.onMove(event);
  }

  onMouseUp = (event: MouseEvent) => {
    this.onEnd(event);
  }

  onMouseLeave = (event: MouseEvent) => {
    this.emitEvent = false;
    this.onEnd(event);
  }
}

export class TouchStrategy extends RippleListener {

  pressTimeout: any;

  constructor(public context: Ripple) {
    super(context);
    this.setPressTimeout();
  }

  get listeners(): PointerListener[] {
    return [
      ['touchmove', this.onTouchMove],
      ['touchend', this.onTouchEnd]
    ];
  }

  setPressTimeout() {
    clearTimeout(this.pressTimeout);
    this.pressTimeout = setTimeout(() => {
      this.context.ngZone.runOutsideAngular(() => this.context.pressPublisher.next());
    }, this.context.core.tapLimit);
  }

  onTouchMove = (event: TouchEvent) => {
    this.onMove(event);
  }

  onTouchEnd = (event: TouchEvent) => {
    clearTimeout(this.pressTimeout);
    this.onEnd(event);
  }
}

export const POINTER_STRATEGY: any  = {
  mouse: MouseStrategy,
  touch: TouchStrategy
};

export class PointerStrategy {
  constructor(context: Ripple) {
    return new POINTER_STRATEGY[context.pointer](context);
  }
}

export const POINTERDOWN: any = {
  pointerdown: ['pointerdown'],
  fallback: ['touchstart', 'mousedown']
};

export class PointerDownListener {

  pointerdownEvents: any[];

  constructor(private context: Ripple) {
    const event = 'onpointerdown' in window ? 'pointerdown' : 'fallback';
    this.pointerdownEvents = POINTERDOWN[event];
    this.init();
  }

  init() {
    this.context.ngZone.runOutsideAngular(() => {
      this.pointerdownEvents.forEach((event) => {
        this.context.element.addEventListener(event, this.context.onPointerDown);
      });
    });
  }

  remove() {
    this.context.ngZone.runOutsideAngular(() => {
      this.pointerdownEvents.forEach((event) => {
        this.context.element.removeEventListener(event, this.context.onPointerDown);
      });
    });
  }
}
