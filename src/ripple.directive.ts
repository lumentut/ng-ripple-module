/**
 * @license
 * Copyright (c) 2018 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import { 
  Directive,
  NgZone,
  HostBinding,
  ElementRef,
  ComponentFactoryResolver,
  ApplicationRef,
  ComponentRef,
  Injector,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { RippleEvent } from './ripple.event';
import { RippleComponent } from './ripple.component';
import { BackgroundComponent } from './ripple-bg.component';

import {
  RIPPLE_LIGHT_BGCOLOR,
  RIPPLE_LIGHT_ACTIVE_BGCOLOR,
  RIPPLE_REPEATING_EVENT_LIMIT,
  RIPPLE_CLICK_EMIT_DELAY,
  RIPPLE_TAP_LIMIT
} from './ripple.constants'

export enum RippleCmpRefs {
  RIPPLE = 'rippleCmpRef',
  BACKGROUND = 'backgroundCmpRef'
}

export enum Events {
  TAP = 'rtap', 
  PRESS = 'rpress',
  PRESSUP = 'rpressup',
  CLICK = 'rclick'
}

export enum Triggers {
  TOUCHSTART = 'touchstart',
  TOUCHMOVE = 'touchmove',
  TOUCHEND = 'touchend',
  CLICK = 'click',
}

export const BasicEvents = [Events.TAP, Events.PRESS];

export function enforceStyleRecalculation(element: HTMLElement) {
  window.getComputedStyle(element).getPropertyValue('opacity');
}

@Directive({ selector: '[ripple]' })
export class RippleDirective {

  element: HTMLElement
  rippleCmpRef: ComponentRef<any>
  backgroundCmpRef: ComponentRef<any>

  touchstartTimeStamp: number = 0
  touchendTimeStamp: number = 0

  pressTimeout: any
  isPressing: boolean

  lastEvent: Events
  lastEventTimestamp: number

  registeredEvents = new Map<string, any>();

  private _triggers: Map<string, Function>
  private _clickEmitDelay: string = RIPPLE_CLICK_EMIT_DELAY;
  private _tapLimit: number = RIPPLE_TAP_LIMIT;

  @HostBinding('style.display') display: string = 'block';
  @HostBinding('style.overflow') overflow: string = 'hidden';
  @HostBinding('class.activated') activated: boolean

  @Input()
  set light(val: boolean) {
    this.ripple.color = RIPPLE_LIGHT_BGCOLOR;
    this.background.color = RIPPLE_LIGHT_ACTIVE_BGCOLOR;
  }

  @Input('centered-ripple')
  set centered(val: boolean) {
    this.ripple.centered = true;
  }

  @Input('fixed-ripple')
  set fixed(val: boolean) {
    this.ripple.fixed = true;
  }

  @Input('rippleBgColor')
  set rippleColor(color: string) {
    this.ripple.color = color;
  }

  @Input('activeBgColor')
  set activeBgColor(color: string) {
    this.background.color = color;
  }

  @Input('fillTransition')
  set fillTransition(value: string) {
    this.ripple.fillTransition = value;
  }

  @Input('splashTransition')
  set splashTransition(value: string) {
    this.ripple.splashTransition = value;
  }

  @Input('fadeTransition')
  set fadeTransition(value: string) {
    this.ripple.fadeTransition = value;
  }

  @Input('clickEmitDelay')
  set clickEmitDelay(value: string) {
    this._clickEmitDelay = value;
  }

  get clickEmitDelay():string {
    return this._clickEmitDelay;
  }

  @Input('tapLimit')
  set tapLimit(value: number) {
    this._tapLimit = value;
  }

  get tapLimit():number {
    return this._tapLimit;
  }

  @Output() rtap: EventEmitter<any> = new EventEmitter();
  @Output() rpress: EventEmitter<any> = new EventEmitter();
  @Output() rpressup: EventEmitter<any> = new EventEmitter(); 
  @Output() rclick: EventEmitter<any> = new EventEmitter();

  constructor(
    private elRef: ElementRef,
    private cfr: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
    private ngZone: NgZone
  ){
    this.element = this.elRef.nativeElement;
    this.registerTriggers;
  }

  ngAfterViewInit() {
    this.appendChildren([this.background.element,this.ripple.element]);
    this.background.eventTrigger.subscribe(() => this.triggerEvent);
    this.ripple.background = this.background;
    this.recalculateStyle;
    this.registerEvents;
  }

  get triggers(): any {
    if(this._triggers) return this._triggers;
    const _triggers = new Map<string, Function>();
    for(let i in Triggers) _triggers.set(Triggers[i], this[`on${Triggers[i]}`])
    return this._triggers = _triggers;
  }

  get registerTriggers() {
    return this.ngZone.runOutsideAngular(() => {
      this.triggers.forEach((fn, type) => 
        this.element.addEventListener(type, fn, false)
      );
    });
  }

  ngOnDestroy() {
    this.background.eventTrigger.unsubscribe();
    this.triggers.forEach((fn, type) => this.element.removeEventListener(type, fn));
  }

  appendChildren(elements: any[]){
    elements.forEach(element => this.element.appendChild(element))
  }

  get registerEvents() {
    const events = [
      [Events.TAP, this.rtap],
      [Events.PRESS, this.rpress],
      [Events.PRESSUP, this.rpressup],
      [Events.CLICK, this.rclick]
    ];
    events.forEach(event => this.registeredEvents.set(<string>event[0], <any>event[1]));
    return;
  }

  get ripple(): RippleComponent {
    if(!this.rippleCmpRef) this.createComponentRef(RippleComponent, RippleCmpRefs.RIPPLE);
    return this.rippleCmpRef.instance;
  }

  get background(): BackgroundComponent {
    if(!this.backgroundCmpRef) this.createComponentRef(BackgroundComponent, RippleCmpRefs.BACKGROUND);
    return this.backgroundCmpRef.instance;
  }

  createComponentRef(Component: any, cmpRefName: string) {
    this[`${cmpRefName}`] = this.cfr.resolveComponentFactory(Component).create(this.injector);
    this.appRef.attachView(this[`${cmpRefName}`].hostView);
  }

  get recalculateStyle() {
    enforceStyleRecalculation(this.ripple.element)
    enforceStyleRecalculation(this.background.element)
    return;
  }

  get touchDuration(): number {
    return this.touchendTimeStamp - this.touchstartTimeStamp;
  }

  get currentEvent(): any {
    if(this.touchDuration <= this.tapLimit) return Events.TAP;
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

  get triggerEvent() {
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
    this.registeredEvents.get(eventName).emit(this.event);
  }

  get emitClickEvent() {
    this.lastEventName = Events.CLICK;
    this.registeredEvents.get(Events.CLICK).emit(this.event);
    return;
  }

  get watchPressEvent() {
    this.pressTimeout = setTimeout(() => {
      if(this.isPressing) this.emitEvent(Events.PRESS);
    }, this.tapLimit);
    return;
  }

  private ontouchstart = (event: TouchEvent) => {
    event.preventDefault();
    this.touchstartTimeStamp = event.timeStamp;
    this.isPressing = true;
    this.watchPressEvent;
    this.ripple.fill(event);
    this.activated = true;
  }

  private get rippleSplash(){
    this.isPressing = false;
    this.activated = false;
    return this.ripple.splash();
  }

  private ontouchmove = (event: TouchEvent) => {
    if(!this.ripple.dragable) return;
    if(!this.ripple.touchEventIsInHostArea(event)) return this.rippleSplash;
    if(this.ripple.outerPointStillInHostRadius(event)) return this.ripple.translate(event);
  }

  private ontouchend = (event: TouchEvent) => {
    this.touchendTimeStamp = event.timeStamp;
    if(!this.isPressing) return;
    return this.rippleSplash
  }

  private onclick = (event: MouseEvent) => {
    event.preventDefault();
    setTimeout(()=> this.emitClickEvent, this.clickEmitDelay)
    return this.ripple.fillAndSplash(event);
  }
}