/**
 * @license
 * Copyright (c) 2018 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import {
  NgZone,
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  Renderer2,
  Input,
  HostBinding
} from '@angular/core';

import {
  AnimationPlayer,
  AnimationBuilder
} from '@angular/animations';

import {
  RIPPLE_FILL_TRANSITION,
  RIPPLE_SPLASH_TRANSITION,
  RIPPLE_FADE_TRANSITION,
  RIPPLE_DEFAULT_BGCOLOR,
  RIPPLE_TAP_LIMIT
} from './ripple.constants';

import {
  BackgroundComponent
} from './ripple-bg.component';

import {
  RippleAnimation,
  RippleTransition
} from './ripple.animation';

export interface RippleStyle {
  width?: number;
  height?: number;
  marginLeft?: number;
  marginTop?: number;
  background?: string;
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface Margin {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

export function touch(event: TouchEvent): any {
  return event.changedTouches ? event.changedTouches[0] : event;
}

@Component({
  selector: 'ripple-core',
  template: `<ng-content></ng-content>`,
  styles: [
    `:host {
      top: 0;
      left: 0;
      display: block;
      position: absolute;
      border-radius: 50%;
      opacity: 0;
    }`
  ]
})
export class RippleComponent implements AfterViewInit, OnDestroy {

  element: HTMLElement;
  parentElement: HTMLElement;

  background: BackgroundComponent;

  dragable: boolean;

  fillPlayer: AnimationPlayer;
  splashPlayer: AnimationPlayer;
  fadeoutPlayer: AnimationPlayer;
  translatePlayers = [];

  tapLimit: number = RIPPLE_TAP_LIMIT;

  @HostBinding('style.background')
  color: string = RIPPLE_DEFAULT_BGCOLOR;

  @Input() centered: boolean;
  @Input() fixed: boolean;
  @Input() fillTransition: string;
  @Input() splashTransition: string;
  @Input() fadeTransition: string;

  private _diameter: number;
  private _parentRadiusSq: number;
  private _animation: RippleAnimation;
  private _parentRect: ClientRect;
  private _parentStyle: CSSStyleDeclaration;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    public builder: AnimationBuilder,
    private ngZone: NgZone
  ) {
    this.element = this.elRef.nativeElement;
  }

  get animation(): RippleAnimation {
    if(this._animation) return this._animation;
    return this._animation = new RippleAnimation(this.element, this.builder);
  }

  get transition(): RippleTransition {
    return {
      fill: this.fillTransition || RIPPLE_FILL_TRANSITION,
      splash: this.splashTransition || RIPPLE_SPLASH_TRANSITION,
      fade: this.fadeTransition || RIPPLE_FADE_TRANSITION
    };
  }

  get parentDiameter(): number {
    const rect = this.parentRect;
    if(this.isInCircleArea) return rect.width;
    return Math.sqrt((rect.width*rect.width) + (rect.height*rect.height));
  }

  get diameter(): number {
    return this._diameter;
  }

  get margin(): Margin {
    if(this.isInCircleArea) return {top: 0, left: 0};
    const diameter = this.diameter;
    return {
      top: (this.parentRect.height - diameter)/2,
      left: (this.parentRect.width - diameter)/2
    };
  }

  get properties(): RippleStyle {

    const diameter = this.diameter, margin = this.margin;

    return {
      width: diameter,
      height: diameter,
      marginLeft: margin.left,
      marginTop: margin.top,
      background: this.color
    };
  }

  ngAfterViewInit() {
    this.parentElement = this.element.parentNode as HTMLElement;
    this.animation.transition = this.transition;
    this.cachingParentRectAndStyles();
    this.updateDimensions();
  }

  ngOnDestroy() {
    this.fillPlayer=null;
    this.splashPlayer =null;
    this.translatePlayers=null;
    this.fadeoutPlayer=null;
  }

  updateDimensions() {
    for(const key in this.properties) {
      if(this.properties[key]) {
        this.renderer.setStyle(this.element, key, `${this.properties[key]}px`);
      }
    }
  }

  cachingParentRectAndStyles() {
    this._parentRect = this.parentElement.getBoundingClientRect();
    this._parentStyle = getComputedStyle(this.parentElement);
    this._diameter = this.parentDiameter;
  }

  get parentRect(): ClientRect {
    return this._parentRect;
  }

  get parentStyle(): CSSStyleDeclaration {
    return this._parentStyle;
  }

  get isInCircleArea(): boolean {
    const rect = this.parentRect, style = this.parentStyle;
    return (rect.width === rect.height && style.borderRadius === '50%');
  }

  get center(): Coordinate {
    const rect =  this.parentRect;
    return {
      x: rect.left + (rect.width/2),
      y: rect.top + (rect.height/2),
    };
  }

  touchEventIsInHostArea(event: TouchEvent): boolean {
    if(this.isInCircleArea) return this.touchEventStillInCircleArea(event);
    return this.touchEventStillInRectangleArea(event);
  }

  get parentRadius(): number {
    return this.parentRect.width/2;
  }

  get parentRadiusSq(): number {
    if(this._parentRadiusSq) return this._parentRadiusSq;
    this._parentRadiusSq = this.parentRadius*this.parentRadius;
    return this._parentRadiusSq;
  }

  touchEventStillInCircleArea(event: TouchEvent): boolean {
    const center = this.center,
          touchevent = touch(event),
          dx = touchevent.clientX - center.x,
          dy = touchevent.clientY - center.y,
          touchRadiusSq = dx*dx + dy*dy;
    return touchRadiusSq < this.parentRadiusSq;
  }

  touchEventStillInRectangleArea(event: TouchEvent): boolean {
    const center = this.center,
          rect = this.parentRect,
          touchevent = touch(event),
          touchX = touchevent.clientX, touchY = touchevent.clientY,
          halfW = rect.width/2, halfH = rect.height/2,
          minX = center.x - halfW, maxX = center.x + halfW,
          minY = center.y - halfH, maxY = center.y + halfH,
          isInRangeX = minX < touchX && touchX < maxX,
          isInRangeY = minY < touchY && touchY < maxY;
    return isInRangeX && isInRangeY;
  }

  outerPointStillInHostRadius(event: TouchEvent): boolean {
    const center = this.center,
          touchevent = touch(event),
          dx = touchevent.clientX - center.x,
          dy = touchevent.clientY - center.y,
          touchRadiusSq = dx*dx + dy*dy,
          rippleRect = this.element.getBoundingClientRect(),
          maxRadius = this.parentRadius - 0.5*rippleRect.width,
          maxRadiusSq = maxRadius*maxRadius;
    return touchRadiusSq < maxRadiusSq;
  }

  get currentScale(): number {
    const rect = this.element.getBoundingClientRect();
    return rect.width/this.diameter;
  }

  translate(event: TouchEvent) {

    if(this.centered) return;

    const center = this.center;
    const touchevent = touch(event);

    const translatePlayer = this.animation.translate(
      touchevent.clientX - center.x,
      touchevent.clientY - center.y,
      this.currentScale
    );

    this.translatePlayers.push(translatePlayer);

    this.ngZone.runOutsideAngular(() => {
      translatePlayer.onDone(() => translatePlayer.destroy());
      translatePlayer.play();
    });
  }

  fill(event: TouchEvent) {

    this.cachingParentRectAndStyles();
    this.updateDimensions();
    this.background.fadein();
    this.dragable = true;

    let tx = 0, ty = 0;

    if(!this.centered) {
      const center = this.center;
      const touchevent = touch(event);
      tx = touchevent.clientX - center.x;
      ty = touchevent.clientY - center.y;
    }

    this.fillPlayer = this.animation.fill(tx, ty);
    this.fillPlayer.play();
  }

  cleanTranslatePlayerThenFadeout() {
    this.translatePlayers.length = 0;
    this.background.fadeout();
  }

  splash() {
    this.dragable = false;
    this.splashPlayer = this.animation.splash;
    this.splashPlayer.onStart(() => this.fillPlayer.destroy());

    this.splashPlayer.onDone(() => {
      this.splashPlayer.destroy();
      this.cleanTranslatePlayerThenFadeout();
    });

    this.splashPlayer.play();
  }

  fadeout() {
    this.dragable = false;
    this.fadeoutPlayer = this.animation.fadeout;
    this.fadeoutPlayer.onStart(() => this.fillPlayer.destroy());

    this.fadeoutPlayer.onDone(() => {
      this.fadeoutPlayer.destroy();
      this.cleanTranslatePlayerThenFadeout();
    });

    this.fadeoutPlayer.play();
  }
}
