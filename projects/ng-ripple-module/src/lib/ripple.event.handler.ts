/**
 * @license
 * Copyright (c) 2019 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import { EventEmitter } from '@angular/core';
import { Ripple } from './ripple';
import { RippleEvent } from './ripple.event';

import { RIPPLE_REPEATING_EVENT_LIMIT } from './ripple.constants';

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

export interface RipplePointerEvent {
  clientX: number;
  clientY: number;
  timeStamp: number;
  type: 'pointerdown' | 'touchmove' | 'touchend' | 'mousemove' | 'mouseup' | 'mouseleave';
}

export class RippleEventHandler {

  element: HTMLElement;
  lastEvent: Events;
  lastEventTimestamp: number;
  registeredEvents = new Map<string, any>();
  pressTimeout: any;

  constructor(
    public ripple: Ripple,
    private emitters: RippleEmitters
  ) {
    this.element = this.ripple.element;
    this.events.forEach(event => this.registeredEvents.set(event[0] as string, event[1] as any));
    this.ripple.pressPublisher.subscribe(() => this.emitEvent(Events.PRESS));
  }

  private get events(): any[] {
    return [
      [Events.TAP, this.emitters.rtap],
      [Events.PRESS, this.emitters.rpress],
      [Events.PRESSUP, this.emitters.rpressup],
      [Events.CLICK, this.emitters.rclick]
    ];
  }

  onDestroy() {
    this.ripple.pressPublisher.unsubscribe();
  }

  get pointerEvent(): any {
    return {
      touchstart: Events.TAP,
      mousedown: Events.CLICK
    };
  }

  get currentEvent(): Events {
    if(this.ripple.tracker.duration <= this.ripple.core.tapLimit) {
      return this.pointerEvent[this.ripple.pointer];
    }
    return Events.PRESSUP;
  }

  set lastEventName(eventName: Events) {
    this.lastEventTimestamp = (new Date()).getTime();
    this.lastEvent = eventName;
  }

  get event(): RippleEvent {
    return new RippleEvent(this.element, this.ripple.host.center, this.lastEvent);
  }

  emitEvent(eventName: Events) {
    this.lastEventName = eventName;
    this.registeredEvents.get(eventName).emit(this.event);
  }

  get lastEventTimespan() {
    return (new Date()).getTime() - this.lastEventTimestamp;
  }

  get isFastEvent(): boolean {
    return this.lastEventTimespan < RIPPLE_REPEATING_EVENT_LIMIT;
  }

  get isRepeatingEvent(): boolean {
    return this.currentEvent === this.lastEvent;
  }

  emitCurrentEvent() {
    if(this.isFastEvent && this.isRepeatingEvent) {
      return;
    }
    return this.emitEvent(this.currentEvent);
  }
}
