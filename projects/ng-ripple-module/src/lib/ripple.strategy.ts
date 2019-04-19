/**
 * @license
 * Copyright (c) 2019 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import { RippleEventHandler } from './ripple.event.handler';

export type DeviceListener = [string, (event: TouchEvent | MouseEvent) => any];

export interface DeviceStrategy {
  listeners: DeviceListener[];
  event: string;
  context: RippleEventHandler;
  attachListeners(): void;
  detachListeners(): void;
}

export interface PointerStrategy {
  mouse: MouseStrategy;
  touch: TouchStrategy;
}

export class RippleListener {

  element: HTMLElement;
  listeners: DeviceListener[];

  constructor(public context: RippleEventHandler) {}

  execute(action: string) {
    this.listeners.forEach((item) => {
      const type = item[0]; const handler = item[1];
      this.element[action](type, handler, false);
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
    if(!this.context.ripple.core.pointerEventCoordinateIsInHostArea(event)) {
      return this.splashAndDetach();
    }
    if(this.context.ripple.core.outerPointStillInHostRadius(event)) {
      return this.context.ripple.core.translate(event);
    }
    return;
  }

  onEnd(event: any) {
    this.context.tracker.trackUp(event);
    this.context.deactivate();
    this.splashAndDetach();
  }

  splashAndDetach() {
    this.context.ripple.core.splash();
    this.detachListeners();
  }
}

export class MouseStrategy extends RippleListener {

  constructor(context: RippleEventHandler) {
    super(context);
    this.element = context.element;
  }

  get listeners(): DeviceListener[] {
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
    this.onEnd(event);
  }
}

export class TouchStrategy extends RippleListener {

  constructor(context: RippleEventHandler) {
    super(context);
    this.element = context.element;
  }

  get listeners(): DeviceListener[] {
    return [
      ['touchmove', this.onTouchMove],
      ['touchend', this.onTouchEnd]
    ];
  }

  onTouchMove = (event: TouchEvent) => {
    this.onMove(event);
  }

  onTouchEnd = (event: TouchEvent) => {
    this.onEnd(event);
  }
}
