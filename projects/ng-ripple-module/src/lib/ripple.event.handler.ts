/**
 * @license
 * Copyright (c) 2019 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import { NgZone, EventEmitter } from '@angular/core';
import { Ripple } from './ripple';
import { RippleMotionTracker } from './ripple.tracker';
import { RippleEvent } from './ripple.event';

import {
  PointerStrategy,
  MouseStrategy,
  TouchStrategy
} from './ripple.strategy';

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

  pointer: string;
  element: HTMLElement;
  isPressing: boolean;
  emptyEvent: boolean;
  lastEvent: Events;
  lastEventTimestamp: number;
  registeredEvents = new Map<string, any>();
  _actionTypes: Map<string, () => void>;
  strategy: MouseStrategy | TouchStrategy;
  tracker: RippleMotionTracker;

  constructor(
    public ripple: Ripple,
    private emitters: RippleEmitters,
    private ngZone: NgZone
  ) {
    this.element = this.ripple.element;
    this.tracker = new RippleMotionTracker();
    this.initPointerDownListener();
    this.registerEvents();
    this.ripple.background.onAnimationEnd.subscribe(this.onAnimationEnd);
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
    this.ripple.background.onAnimationEnd.unsubscribe(this.onAnimationEnd);
    this.removePointerDownListener();
  }

  onAnimationEnd = () => {
    this.ripple.dismountElement();
    this.emitCurrentEvent();
  }

  initPointerDownListener() {
    this.ngZone.runOutsideAngular(() => {
      this.element.addEventListener('pointerdown', this.onPointerDown, false);
    });
  }

  removePointerDownListener() {
    this.ngZone.runOutsideAngular(() => {
      this.element.removeEventListener('pointerdown', this.onPointerDown);
    });
  }

  onPointerDown = (event: PointerEvent) => {
    this.pointer = event.pointerType;
    this.tracker.startTrack(event);
    this.ripple.mountElement();
    this.strategy = new PointerStrategy[this.pointer](this);
    this.strategy.attachListeners();
    this.ripple.core.fill(event);
    this.activate();
  }

  activate() {
    this.isPressing = true;
    this.emptyEvent = false;
    this.element.classList.add(this.ripple.core.configs.activeClass);
    this.ngZone.runOutsideAngular(() => this.watchPressEvent());
  }

  deactivate() {
    this.element.classList.remove(this.ripple.core.configs.activeClass);
    this.isPressing = false;
  }

  get pointerEvent(): any {
    return {
      touch: Events.TAP,
      mouse: Events.CLICK
    }
  }

  get currentEvent(): Events {
    if(this.tracker.duration <= this.ripple.core.tapLimit) {
      return this.pointerEvent[this.pointer];
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
    if(!this.emptyEvent) {
      this.ngZone.run(() => {
        this.registeredEvents.get(eventName).emit(this.event);
      });
    }
  }

  watchPressEvent() {
    setTimeout(() => {
      if(this.isPressing) this.emitEvent(Events.PRESS);
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

  emitCurrentEvent = () => {
    if(this.isFastEvent && this.isRepeatingEvent) return;
    return this.emitEvent(this.currentEvent);
  }
}
