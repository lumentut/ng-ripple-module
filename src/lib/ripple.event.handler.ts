/**
 * @license
 * Copyright (c) 2018 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import {
  NgZone,
  EventEmitter
} from '@angular/core';

import {
  RippleComponent
} from './ripple.component';

import {
  RippleEvent
} from './ripple.event';

import {
  RippleMotionTracker
} from './ripple.motion.tracker';

import {
  RIPPLE_REPEATING_EVENT_LIMIT,
  RIPPLE_VELOCITY_TRESHOLD,
  RIPPLE_IDLE_SCALE
} from './ripple.constants';

export interface RippleEmitters {
  rtap: EventEmitter<any>;
  rpress: EventEmitter<any>;
  rpressup: EventEmitter<any>;
  rclick: EventEmitter<any>;
}

export enum Events {
  TAP = 'rtap',
  PRESS = 'rpress',
  PRESSUP = 'rpressup',
  CLICK = 'rclick'
}

export enum MobileActionTypes {
  TOUCHMOVE = 'touchmove',
  TOUCHEND = 'touchend'
}

export enum DesktopActionTypes {
  MOUSEMOVE = 'mousemove',
  MOUSEUP = 'mouseup',
  MOUSELEAVE = 'mouseleave'
}

export enum PointerDownAction {
  MOBILE = 'touchstart',
  DESKTOP = 'mousedown'
}

export enum TouchClients {
  CLIENT_X = 'clientX',
  CLIENT_Y = 'clientY'
}

export const ACTIVATED_CLASS = 'activated';

export interface PointerEvent {
  clientX: number;
  clientY: number;
  timeStamp: number;
  type: 'touchstart' | 'touchmove' | 'touchend' | 'mousedown' | 'mousemove' | 'mouseup' | 'mouseleave';
}

export function pointer(event: any): PointerEvent {
  const ev = event.changedTouches ? event.changedTouches[0] : event;
  return {
    clientX: ev.clientX,
    clientY: ev.clientY,
    timeStamp: event.timeStamp,
    type: event.type
  };
}

export function mobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function capitalize(val: string): string {
  return val.charAt(0).toUpperCase() + val.slice(1);
}

export const MobileEventHandlers = {
  ontouchmove: 'onPointerMove',
  ontouchend: 'onPointerUp'
};

export const DesktopEventHandlers = {
  onmousemove: 'onPointerMove',
  onmouseup: 'onPointerUp',
  onmouseleave: 'onPointerLeave'
};

export class RippleEventHandler {

  _isMobileDevice: boolean;
  isPressing: boolean;
  emptyEvent: boolean;

  lastEvent: Events;
  lastEventTimestamp: number;

  registeredEvents = new Map<string, any>();

  _actionTypes: Map<string, Function>;

  constructor(
    private element: HTMLElement,
    private ripple: RippleComponent,
    private emitters: RippleEmitters,
    protected motionTracker: RippleMotionTracker,
    private ngZone: NgZone
  ) {
    this.initPointerDownListener();
    this.registerEvents();
  }

  get pointerDownAction(): PointerDownAction {
    return this.isMobileDevice ? PointerDownAction.MOBILE : PointerDownAction.DESKTOP;
  }

  initPointerDownListener() {
    this.ngZone.runOutsideAngular(() => {
      this.element.addEventListener(this.pointerDownAction, this.onPointerDown, false);
    });
  }

  removePointerDownListener() {
    this.element.removeEventListener(this.pointerDownAction, this[`on${this.pointerDownAction}`]);
  }

  get isMobileDevice(): boolean {
    if(this._isMobileDevice) return this._isMobileDevice;
    return this._isMobileDevice = mobileDevice();
  }

  get supportedActionTypes(): Map<string, any> {
    const actionTypes = this.isMobileDevice ? MobileActionTypes : DesktopActionTypes,
          handlers = this.isMobileDevice ? MobileEventHandlers : DesktopEventHandlers,
          supported = new Map<string, any>();
    for(const i in actionTypes) {
      if(actionTypes[i]) {
        supported.set(actionTypes[i], this[handlers[`on${actionTypes[i]}`]]);
      }
    }
    return supported;
  }

  get actionTypes(): any {
    if(!this._actionTypes) this._actionTypes = this.supportedActionTypes;
    return this._actionTypes;
  }

  private addListeners() {
    this.ngZone.runOutsideAngular(() => {
      this.actionTypes.forEach((fn, type) => this.element.addEventListener(type, fn, false));
    });
  }

  private removeListeners() {
    this.actionTypes.forEach((fn, type) => this.element.removeEventListener(type, fn));
  }

  private registerEvents() {
    const events = [
      [Events.TAP, this.emitters.rtap],
      [Events.PRESS, this.emitters.rpress],
      [Events.PRESSUP, this.emitters.rpressup],
      [Events.CLICK, this.emitters.rclick]
    ];
    events.forEach(event => this.registeredEvents.set(<string>event[0], <any>event[1]));
  }

  get tapOrClickEvent(): any {
    return this.isMobileDevice ? Events.TAP : Events.CLICK;
  }

  get currentEvent(): Events {
    if(this.motionTracker.duration <= this.ripple.tapLimit) return this.tapOrClickEvent;
    return Events.PRESSUP;
  }

  get lastEventTimespan() {
    return (new Date).getTime() - this.lastEventTimestamp;
  }

  get isFastEvent(): boolean {
    return this.lastEventTimespan < RIPPLE_REPEATING_EVENT_LIMIT;
  }

  get isRepeatingEvent(): boolean {
    return this.currentEvent === this.lastEvent;
  }

  get emitCurrentEvent() {
    if(this.isFastEvent && this.isRepeatingEvent) return;
    return this.emitEvent(this.currentEvent);
  }

  set lastEventName(eventName: Events) {
    this.lastEventTimestamp = (new Date).getTime();
    this.lastEvent = eventName;
  }

  get event(): RippleEvent {
    return new RippleEvent(this.element, this.ripple.center, this.lastEvent);
  }

  emitEvent(eventName: Events) {
    this.lastEventName = eventName;
    if(!this.emptyEvent) {
      this.ngZone.runOutsideAngular(() => {
        this.registeredEvents.get(eventName).emit(this.event);
      });
    }
  }

  watchPressEvent() {
    setTimeout(() => {
      if(this.isPressing) this.emitEvent(Events.PRESS);
    }, this.ripple.tapLimit);
  }

  activate() {
    this.isPressing = true;
    this.emptyEvent = false;
    this.element.classList.add(ACTIVATED_CLASS);
    this.ngZone.runOutsideAngular(() => this.watchPressEvent());
  }

  deactivate() {
    this.element.classList.remove(ACTIVATED_CLASS);
    this.isPressing = false;
  }

  rippleSplash() {
    this.deactivate();
    this.ripple.splash();
  }

  rippleNoEventSplash() {
    this.emptyEvent = true;
    this.rippleSplash();
  }

  rippleFadeout() {
    this.deactivate();
    this.ripple.fadeout();
  }

  get isSmallVelocity(): boolean {
    return this.motionTracker.velocity < RIPPLE_VELOCITY_TRESHOLD;
  }

  get isPressupPhase(): boolean {
    return this.currentEvent === Events.PRESSUP;
  }

  get isIdleRipple(): boolean {
    return this.ripple.currentScale === RIPPLE_IDLE_SCALE;
  }

  private onPointerDown = (event: TouchEvent | MouseEvent) => {
    if(this.isPressing) return;
    this.activate();
    this.addListeners();
    this.motionTracker.reset().track(event);
    if(!this.ripple.fixed) event.preventDefault();
    return this.ripple.fill(event);
  }

  private onPointerMove = (event: TouchEvent | MouseEvent) => {
    this.motionTracker.track(event);
    if(!this.ripple.fixed && this.isSmallVelocity) return;
    if(!this.ripple.dragable) return this.isPressing = false;
    if(!this.ripple.pointerEventIsInHostArea(event) || this.ripple.fixed) return this.rippleNoEventSplash();
    if(this.ripple.outerPointStillInHostRadius(event)) this.ripple.translate(event);
  }

  private onPointerUp = (event: TouchEvent | MouseEvent) => {
    this.removeListeners();
    this.motionTracker.track(event);
    if(!this.isPressing || this.emptyEvent) return;
    if(this.isIdleRipple && this.isPressupPhase) return this.rippleFadeout();
    return this.rippleSplash();
  }

  private onPointerLeave = (event: MouseEvent) => {
    if(!this.isPressing) return;
    this.rippleNoEventSplash();
  }
}
