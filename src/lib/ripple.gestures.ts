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

import { RippleComponent, touch } from './ripple.component';
import { RippleEvent } from './ripple.event';

import {
  RIPPLE_REPEATING_EVENT_LIMIT
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

export enum MobileListeners {
  TOUCHMOVE = 'touchmove',
  TOUCHEND = 'touchend'
}

export enum DesktopListeners {
  MOUSEMOVE = 'mousemove',
  MOUSEUP = 'mouseup',
  MOUSELEAVE = 'mouseleave'
}

export enum InitialListener {
  MOBILE = 'touchstart',
  DESKTOP = 'mousedown'
}

export enum TouchClients {
  CLIENT_X = 'clientX',
  CLIENT_Y = 'clientY'
}

export const ACTIVATED_CLASS = 'activated';

// https://stackoverflow.com/questions/3514784
export function _isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export class RippleGestures {

  touchstartTimeStamp: number = 0;
  touchendTimeStamp: number = 0;

  _isMobile: boolean;
  isPressing: boolean;
  emptyEvent: boolean;

  lastEvent: Events;
  lastEventTimestamp: number;
  lastClientX: number = 0;
  lastClientY: number = 0;

  registeredEvents = new Map<string, any>();

  _listeners: Map<string, Function>;

  constructor(
    private element: HTMLElement,
    private ripple: RippleComponent,
    private emitters: RippleEmitters,
    private ngZone: NgZone
  ) {
    this.initListener();
    this.registerEvents();
  }

  get initialListener(): InitialListener {
    return this.isMobile ? InitialListener.MOBILE : InitialListener.DESKTOP;
  }

  private initListener() {
    this.ngZone.runOutsideAngular(() => {
      const listener = this.initialListener;
      this.element.addEventListener(listener, this[`on${listener}`], false);
    });
  }

  removeInitialListener() {
    this.element.removeEventListener(
      this.initialListener,
      this[`on${this.initialListener}`]
    );
  }

  get isMobile(): boolean {
    if(this._isMobile) return this._isMobile;
    return this._isMobile = _isMobile();
  }

  get supportedListeners(): Map<string, any> {
    const listeners = this.isMobile ? MobileListeners : DesktopListeners;
    const supported = new Map<string, any>();
    for(const i in listeners) {
      if(this[`on${listeners[i]}`]) {
        supported.set(listeners[i], this[`on${listeners[i]}`]);
      }
    }
    return supported;
  }

  get listeners(): any {
    if(!this._listeners) this._listeners = this.supportedListeners;
    return this._listeners;
  }

  private addListeners() {
    this.ngZone.runOutsideAngular(() => {
      this.listeners.forEach((fn, type) => this.element.addEventListener(type, fn, false));
    });
  }

  private removeListeners() {
    this.listeners.forEach((fn, type) => this.element.removeEventListener(type, fn));
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

  get touchDuration(): number {
    return this.touchendTimeStamp - this.touchstartTimeStamp;
  }

  get tapOrClickEvent(): any {
    return this.isMobile ? Events.TAP : Events.CLICK;
  }

  get currentEvent(): Events {
    if(this.touchDuration <= this.ripple.tapLimit) return this.tapOrClickEvent;
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

  get isIdleRipple(): boolean {
    return this.ripple.currentScale === 1;
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

  private onmousedown = (event: any) => {
    this.ontouchstart(event as TouchEvent);
  }

  private onmouseup = (event: any) => {
    this.ontouchend(event as TouchEvent);
  }

  private onmousemove = (event: any) => {
    if(!this.isPressing) return;
    this.ontouchmove(event as TouchEvent);
  }

  private onmouseleave = (event: any) => {
    if(!this.isPressing) return;
    this.rippleNoEventSplash();
  }

  private ontouchstart = (event: any) => {
    if(this.isPressing) return;
    this.touchstartTimeStamp = event.timeStamp;
    this.addListeners();
    this.activate();
    if(!this.ripple.fixed) event.preventDefault();
    return this.ripple.fill(event);
  }

  set lastCoordinateEvent(event: TouchEvent) {
    const clients = { lastClientX: TouchClients.CLIENT_X, lastClientY: TouchClients.CLIENT_Y};
    for(const coordinate in clients) {
      if(touch(event)[clients[coordinate]]) {
        this[coordinate] = Math.floor(touch(event)[clients[coordinate]]);
      }
    }
  }

  private isRepeatingX(event: any) {
    return this.lastClientX === Math.floor(touch(event).clientX);
  }

  private isRepeatingY(event: any) {
    return this.lastClientY === Math.floor(touch(event).clientY);
  }

  isRepeatingCoordinate(event: TouchEvent): boolean {
    const isRepeating = this.isRepeatingX(event) && this.isRepeatingY(event);
    this.lastCoordinateEvent = event;
    return isRepeating;
  }

  private ontouchmove = (event: TouchEvent) => {
    if(this.isRepeatingCoordinate(event)) return;
    if(!this.ripple.dragable) return this.isPressing = false;
    if(!this.ripple.touchEventIsInHostArea(event) || this.ripple.fixed) return this.rippleNoEventSplash();
    if(this.ripple.outerPointStillInHostRadius(event)) this.ripple.translate(event);
  }

  private ontouchend = (event: any) => {
    this.removeListeners();
    this.touchendTimeStamp = event.timeStamp;
    if(!this.isPressing || this.emptyEvent) return;
    if(this.isIdleRipple) return this.rippleFadeout();
    return this.rippleSplash();
  }
}
