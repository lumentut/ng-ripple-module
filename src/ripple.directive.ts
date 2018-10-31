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

import { RippleComponent } from './ripple.component';
import { BackgroundComponent } from './ripple-bg.component';

import { 
  RippleGestures,
  RippleEmitters
} from './ripple.gestures';

import {
  RIPPLE_LIGHT_BGCOLOR,
  RIPPLE_LIGHT_ACTIVE_BGCOLOR
} from './ripple.constants'

export enum RippleCmpRefs {
  RIPPLE = 'rippleCmpRef',
  BACKGROUND = 'backgroundCmpRef'
}

export function enforceStyleRecalculation(element: HTMLElement) {
  window.getComputedStyle(element).getPropertyValue('opacity');
}

@Directive({ selector: '[ripple]' })
export class RippleDirective {

  element: HTMLElement
  rippleCmpRef: ComponentRef<any>
  backgroundCmpRef: ComponentRef<any>
  gestures: RippleGestures

  private _children: any[]
  private _rippleGestures: RippleGestures

  @HostBinding('style.display') display: string = 'block';
  @HostBinding('style.overflow') overflow: string = 'hidden';
  @HostBinding('style.cursor') cursor: string = 'pointer';
  @HostBinding('class.activated') activated: boolean = false;
  @HostBinding('style.width') width: string

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

  @Input('tapLimit')
  set tapLimit(value: number) {
    this.ripple.tapLimit = value;
  }

  @Output() rtap: EventEmitter<any> = new EventEmitter();
  @Output() rpress: EventEmitter<any> = new EventEmitter();
  @Output() rpressup: EventEmitter<any> = new EventEmitter(); 
  @Output() rclick: EventEmitter<any> = new EventEmitter();

  constructor(
    private elRef: ElementRef,
    public cfr: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
    private ngZone: NgZone
  ){
    this.element = this.elRef.nativeElement;
  }

  ngAfterViewInit() {
    this.appendChildren([this.background.element,this.ripple.element]);
    this.background.eventTrigger.subscribe(() => this.gestures.emitCurrentEvent);
    this.ripple.background = this.background;
    this.gestures = this.rippleGestures;
    this.recalculateStyle;
  }

  ngOnDestroy() {
    this.rippleCmpRef.destroy();
    this.background.eventTrigger.unsubscribe();
    this.backgroundCmpRef.destroy();
    if(this.gestures) this.gestures.triggers.forEach((fn, type) => this.element.removeEventListener(type, fn));
  }

  appendChildren(elements: any[]){
    this._children = elements;
    this._children.forEach(element => this.element.appendChild(element))
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
    this._children.forEach(element => enforceStyleRecalculation(element));
    return;
  }

  get emitters(): RippleEmitters {
    return {
      rtap: this.rtap,
      rpress: this.rpress,
      rpressup: this.rpressup,
      rclick: this.rclick
    }
  }

  get rippleGestures(): RippleGestures {

    if(this._rippleGestures) return this._rippleGestures;

    this._rippleGestures = new RippleGestures(
      this.element,
      this.ripple,
      this.emitters,
      this.ngZone
    );

    return this._rippleGestures;
  }
}