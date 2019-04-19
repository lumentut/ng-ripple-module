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

  constructor(public context: any) {}

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
      return this.splashAndDetach();
    }
    if(this.context.core.outerPointStillInHostRadius(event)) {
      return this.context.core.translate(event);
    }
    return;
  }

  onEnd(event: any) {
    this.context.tracker.trackUp(event);
    this.context.deactivate();
    this.splashAndDetach();
  }

  splashAndDetach() {
    this.context.core.splash();
    this.detachListeners();
  }
}

export class MouseStrategy extends RippleListener {

  constructor(context: Ripple) {
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

  constructor(context: Ripple) {
    super(context);
  }

  get listeners(): PointerListener[] {
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

export const POINTER_STRATEGY: any  = {
  mouse: MouseStrategy,
  touch: TouchStrategy
};

export class PointerStrategy extends RippleListener {
  constructor(context: Ripple) {
    super(context);
    return new POINTER_STRATEGY[context.pointer](context);
  }
}
