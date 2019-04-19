/**
 * @license
 * Copyright (c) 2019 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import { EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
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
  subscriptions: Subscription[] = [];

  constructor(
    public ripple: Ripple,
    private emitters: RippleEmitters
  ) {
    this.element = this.ripple.element;
    this.registerEvents();
    this.subscribe();
  }

  private subscribe() {
    this.subscriptions.push(this.ripple.background.animationEnd.subscribe(this.onAnimationEnd));
    this.subscriptions.push(this.ripple.watchPress.subscribe(this.watchPressEvent));
  }

  private unsubscribe() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private registerEvents() {
    const events = [
      [Events.TAP, this.emitters.rtap],
      [Events.PRESS, this.emitters.rpress],
      [Events.PRESSUP, this.emitters.rpressup],
      [Events.CLICK, this.emitters.rclick]
    ];
    events.forEach(event => this.registeredEvents.set(event[0] as string, event[1] as any));
  }

  onDestroy() {
    this.unsubscribe();
  }

  onAnimationEnd = () => {
    this.ripple.dismountElement();
    if(this.ripple.strategy.emitEvent) {
      this.emitCurrentEvent();
    }
  }

  get pointerEvent(): any {
    return {
      touch: Events.TAP,
      mouse: Events.CLICK
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

  watchPressEvent = () => {
    setTimeout(() => {
      if(this.ripple.isPressing) {
        this.emitEvent(Events.PRESS);
      }
    }, this.ripple.core.tapLimit);
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
