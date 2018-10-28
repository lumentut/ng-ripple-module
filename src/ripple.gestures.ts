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

import { RippleComponent } from './ripple.component';
import { RippleEvent } from './ripple.event';

import {
  RIPPLE_REPEATING_EVENT_LIMIT
} from './ripple.constants'

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

export enum MobileTriggers {
  TOUCHSTART = 'touchstart',
  TOUCHMOVE = 'touchmove',
  TOUCHEND = 'touchend'
}

export enum DesktopTriggers {
  MOUSEDOWN = 'mousedown',
  MOUSEMOVE = 'mousemove',
  MOUSEUP = 'mouseup'
}

export class RippleGestures {

  touchstartTimeStamp: number = 0
  touchendTimeStamp: number = 0

  _isMobile: boolean
  isPressing: boolean
  emptyEvent: boolean

  lastEvent: Events
  lastEventTimestamp: number

  registeredEvents = new Map<string, any>();

  _triggers: Map<string, Function>

  constructor(
    private element: HTMLElement,
    private ripple: RippleComponent,
    private emitters: RippleEmitters,
    private ngZone: NgZone
  ){
    this.listenToTriggers;
    this.registerEvents;
  }
  
  get isMobile(): boolean {
    if(this._isMobile) return this._isMobile;
    return typeof window.orientation !== 'undefined'
  }

  get supportedTriggers(): Map<string, any> {
    const supported = this.isMobile ? MobileTriggers : DesktopTriggers;
    const triggers = new Map<string, any>();
    for(let i in supported) triggers.set(supported[i], this[`on${supported[i]}`])
    return triggers;
  }

  get triggers(): any {
    if(!this._triggers) this._triggers = this.supportedTriggers;
    return this._triggers;
  }

  get listenToTriggers() {
    return this.ngZone.runOutsideAngular(() => {
      this.triggers.forEach((fn, type) => 
        this.element.addEventListener(type, fn, false)
      );
    });
  }

  get registerEvents() {
    const events = [
      [Events.TAP, this.emitters.rtap],
      [Events.PRESS, this.emitters.rpress],
      [Events.PRESSUP, this.emitters.rpressup],
      [Events.CLICK, this.emitters.rclick]
    ];
    events.forEach(event => this.registeredEvents.set(<string>event[0], <any>event[1]));
    return;
  }

  get touchDuration(): number {
    return this.touchendTimeStamp - this.touchstartTimeStamp;
  }

  get tapOrClickEvent(): any {
    return this.isMobile ? Events.TAP : Events.CLICK;
  }

  get currentEvent(): any {
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
    return this.currentEvent == this.lastEvent;
  }

  get emitCurrentEvent() {
    if(this.isFastEvent && this.isRepeatingEvent) return;
    return this.emitEvent(this.currentEvent);
  }

  set lastEventName(eventName: Events) {
    const date = new Date;
    this.lastEventTimestamp = date.getTime();
    this.lastEvent = eventName;
  }

  get event(): RippleEvent {
    return new RippleEvent(this.element, this.ripple.center, this.lastEvent);
  }

  emitEvent(eventName: Events) {
    this.lastEventName = eventName;
    if(!this.emptyEvent) this.registeredEvents.get(eventName).emit(this.event);
  }

  get watchPressEvent() {
    this.emptyEvent = false;
    return setTimeout(() => {
      if(this.isPressing) this.emitEvent(Events.PRESS);
    }, this.ripple.tapLimit);
  }

  activate() {
    this.isPressing = true;
    this.element.classList.add('activated');
    this.watchPressEvent;
  }

  deactivate() {
    this.element.classList.remove('activated');
    this.isPressing = false;
  }

  private get rippleSplash(){
    this.deactivate();
    return this.ripple.splash();
  }

  private get rippleNoEventSplash(){
    this.emptyEvent = true;
    return this.rippleSplash;
  }

  private onmousedown = (event: any) => {
    this.ontouchstart(event as TouchEvent)
  }

  private onmouseup = (event: any) => {
    this.ontouchend(event as TouchEvent)
  }

  private onmousemove = (event: any) => {
    if(this.isPressing) this.ontouchmove(event as TouchEvent)
  }

  private ontouchstart = (event: any) => {
    if(this.isPressing) return;
    if(!this.ripple.fixed) event.preventDefault();
    this.touchstartTimeStamp = event.timeStamp;
    this.activate();
    return this.ripple.fill(event);
  }

  private isValidEvent(event: TouchEvent): boolean {
    return this.ripple.outerPointStillInHostRadius(event) && this.ripple.touchEventIsInHostArea(event)
  }

  private ontouchmove = (event: TouchEvent) => {
    if(!this.ripple.dragable) return this.isPressing = false;
    if(!this.isValidEvent(event) || this.ripple.fixed) return this.rippleNoEventSplash;
    return this.ripple.translate(event);
  }

  private ontouchend = (event: any) => {
    this.touchendTimeStamp = event.timeStamp;
    if(!this.isPressing || this.emptyEvent) return;
    return this.rippleSplash
  }
}