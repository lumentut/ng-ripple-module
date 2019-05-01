/**
 * @license
 * Copyright (c) 2019 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import { Ripple } from './ripple';
import { RippleEvent } from './ripple.event';

export function getContact(event: any) {
  const evt = event.changedTouches ? event.changedTouches[0] : event;
  return {
    point: { x: evt.clientX, y: evt.clientY },
    input: (event.pointerType || event.type).slice(0,5)
  };
}

export type PointerListener = [string, (event: TouchEvent | MouseEvent) => any];

export enum RipplePublisher {
  CLICK = 'clickPublisher',
  TAP = 'tapPublisher',
  PRESS = 'pressPublisher',
  PRESSUP = 'pressupPublisher'
}

export enum Events {
  TAP = 'rtap',
  PRESS = 'rpress',
  PRESSUP = 'rpressup',
  CLICK = 'rclick'
}

export class RipplePointerListener {

  ripple: Ripple;
  listeners: PointerListener[];
  publishCurrentEvent: () => void;
  isSilent: boolean;

  constructor(public context: RippleListener) {
    this.ripple = this.context.ripple;
    this.isSilent = this.ripple.configs.isSilent;
    clearTimeout(this.context.ripple.dismountTimeout);
  }

  event(name: Events): RippleEvent {
    return new RippleEvent(this.context.element, this.ripple.host.center, name);
  }

  onMove(event: any) {
    const coordinate = getContact(event).point;
    if(!this.ripple.core.centerCoordinateStillIsInHostArea(coordinate) ||
      this.ripple.core.configs.fixed) {
      return this.onEnd();
    }
    if(this.ripple.core.outerPointCoordinateStillInHostRadius(coordinate)) {
      return this.ripple.core.translateTo(coordinate);
    }
  }

  onEnd() {
    this.context.stopListening(this.listeners);
    this.ripple.prepareForDismounting();
    this.ripple.core.splash();
  }
}

export enum Mouse { MOVE = 'mousemove', UP = 'mouseup', LEAVE = 'mouseleave' }

export class MouseStrategy extends RipplePointerListener {

  constructor(public context: RippleListener) {
    super(context);
    this.context.startListening(this.listeners);
  }

  get listeners(): PointerListener[] {
    return [
      [Mouse.MOVE, this.onMouseMove],
      [Mouse.UP, this.onMouseUp],
      [Mouse.LEAVE, this.onMouseLeave]
    ];
  }

  onMouseMove = (event: MouseEvent) => {
    this.ripple.ngZone.runOutsideAngular(() => this.onMove(event));
  }

  publishCurrentEvent = () => {
    this.ripple.clickPublisher.next(this.event(Events.CLICK));
  }

  onMouseUp = () => {
    this.onEnd();
    if(!this.isSilent) {
      this.ripple.ngZone.runOutsideAngular(() => {
        this.publishCurrentEvent();
      });
    }
  }

  onMouseLeave = () => this.onEnd();
}

export enum Touch { MOVE = 'touchmove', END = 'touchend' }

export class TouchStrategy extends RipplePointerListener {

  pressTimeout: any;
  isPressing: boolean;

  constructor(public context: RippleListener) {
    super(context);
    this.context.startListening(this.listeners);
    if(!this.isSilent) {
      this.ripple.ngZone.runOutsideAngular(() => {
        this.setPressTimeout();
      });
    }
  }

  get listeners(): PointerListener[] {
    return [
      [Touch.MOVE, this.onTouchMove],
      [Touch.END, this.onTouchEnd]
    ];
  }

  setPressTimeout() {
    clearTimeout(this.pressTimeout);
    this.pressTimeout = setTimeout(() => {
      this.isPressing = true;
      this.ripple.pressPublisher.next(this.event(Events.PRESS));
    }, this.ripple.core.tapLimit);
  }

  onTouchMove = (event: TouchEvent) => {
    this.ripple.ngZone.runOutsideAngular(() => this.onMove(event));
  }

  publishCurrentEvent = () => {
    clearTimeout(this.pressTimeout);
    if(this.isPressing) {
      return this.ripple[RipplePublisher.PRESSUP].next(this.event(Events.PRESSUP));
    }
    this.ripple[RipplePublisher.TAP].next(this.event(Events.TAP));
  }

  onTouchEnd = () => {
    this.onEnd();
    if(!this.isSilent) {
      this.ripple.ngZone.runOutsideAngular(() => {
        this.publishCurrentEvent();
      });
    }
  }
}

export const POINTER_STRATEGY: any  = {
  mouse: MouseStrategy,
  touch: TouchStrategy
};

export class PointerStrategy {
  constructor(context: RippleListener) {
    return new POINTER_STRATEGY[context.contact.input](context);
  }
}

export const POINTERDOWN_EVENTS: any = {
  pointerdown: ['pointerdown'],
  fallback: ['touchstart', 'mousedown']
};

export class RippleListener {

  element: HTMLElement;
  strategy: any;
  listeners = [];
  contact: any;

  constructor(public ripple: Ripple) {
    this.element = ripple.element;
    this.initialize();
  }

  initialize() {
    POINTERDOWN_EVENTS[this.ripple.trigger].forEach((event: string) => {
      this.listeners.push([event, this.onPointerDown]);
    });
    this.startListening(this.listeners);
  }

  private execute(action: string, listeners: PointerListener[]) {
    this.ripple.ngZone.runOutsideAngular(() => {
      listeners.forEach(listener => {
        const event = listener[0]; const handler = listener[1];
        this.element[action](event, handler, false);
      });
    });
  }

  startListening(listeners: PointerListener[]) {
    this.execute('addEventListener', listeners);
  }

  stopListening(listeners: PointerListener[]) {
    this.execute('removeEventListener', listeners);
  }

  onPointerDown = (event: any) => {
    this.contact = getContact(event);
    this.strategy = new PointerStrategy(this);
    this.ripple.mountElement();
    this.ripple.core.fillAt(this.contact.point);
  }
}
