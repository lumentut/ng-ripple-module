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
  CLICK = 'click',
}

export class RippleGestures {

  touchstartTimeStamp: number = 0
  touchendTimeStamp: number = 0

  isPressing: boolean
  emptyEvent: boolean

  lastEvent: Events
  lastEventTimestamp: number

  registeredEvents = new Map<string, any>();

  private _triggers: Map<string, Function>

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
    return typeof window.orientation !== 'undefined'
  }

  get supportedTriggers(): Map<string, Function> {
    const supported = this.isMobile ? MobileTriggers : DesktopTriggers;
    const triggers = new Map<string, Function>();
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

  get currentEvent(): any {
    if(this.touchDuration <= this.ripple.tapLimit) return Events.TAP;
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

  get emitClickEvent() {
    this.lastEventName = Events.CLICK;
    if(!this.emptyEvent) this.registeredEvents.get(Events.CLICK).emit(this.event);
    return;
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

  private ontouchstart = (event: TouchEvent) => {
    if(!this.ripple.fixed) event.preventDefault();
    this.touchstartTimeStamp = event.timeStamp;
    this.activate();
    return this.ripple.fill(event);
  }

  private get rippleSplash(){
    this.deactivate();
    return this.ripple.splash();
  }

  private get rippleNoEventSplash(){
    this.emptyEvent = true;
    return this.rippleSplash;
  }

  private ontouchmove = (event: TouchEvent) => {
    if(!this.ripple.dragable) return this.isPressing = false;
    if(!this.ripple.touchEventIsInHostArea(event) || this.ripple.fixed) return this.rippleNoEventSplash;
    if(this.ripple.outerPointStillInHostRadius(event)) return this.ripple.translate(event);
  }

  private ontouchend = (event: TouchEvent) => {
    this.touchendTimeStamp = event.timeStamp;
    if(!this.isPressing || this.emptyEvent) return;
    return this.rippleSplash
  }

  private onclick = (event: MouseEvent) => {
    event.preventDefault();
    setTimeout(()=> this.emitClickEvent, this.ripple.clickEmitDelay)
    return this.ripple.fillAndSplash(event);
  }
}