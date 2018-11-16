/**
 * @license
 * Copyright (c) 2018 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import {
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

import {
  pointer
} from './ripple.event.handler';

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
      will-change: transform, opacity;
    }`
  ]
})
export class RippleComponent implements AfterViewInit {

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

  private _isInCircleArea: boolean;
  private _center: Coordinate;
  private _diameter: number;
  private _parentRadiusSq: number;
  private _animation: RippleAnimation;
  private _parentRect: ClientRect;
  private _rect: ClientRect;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    public builder: AnimationBuilder
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

  set diameter(val: number) {
    this._diameter = val;
  }

  get diameter(): number {
    return this._diameter;
  }

  calculateDiameter(rect: ClientRect) {
    if(this.isInCircleArea) return this.diameter = rect.width;
    this.diameter = Math.sqrt(rect.width*rect.width + rect.height*rect.height);
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

  initialSetup() {
    this.parentRect = this.parentElement.getBoundingClientRect();
    this.calculateDiameter(this.parentRect);
    this.defineIsInCircleOrNot();
    this.updateDimensions();
  }

  ngAfterViewInit() {
    this.parentElement = this.element.parentNode as HTMLElement;
    this.animation.transition = this.transition;
    this.initialSetup();
  }

  updateDimensions() {
    for(const key in this.properties) {
      if(this.properties[key]) {
        this.renderer.setStyle(this.element, key, `${this.properties[key]}px`);
      }
    }
  }

  cachingRectAndCenter() {
    this.rect = this.element.getBoundingClientRect();
    this.parentRect = this.parentElement.getBoundingClientRect();
    this.center = this.centerCoordinate(this.parentRect);
  }

  set rect(val: ClientRect) {
    this._rect = val;
  }

  get rect(): ClientRect {
    return this._rect;
  }

  set parentRect(val: ClientRect) {
    this._parentRect = val;
  }

  get parentRect(): ClientRect {
    return this._parentRect;
  }

  get parentStyle(): CSSStyleDeclaration {
    return getComputedStyle(this.parentElement);
  }

  get isInCircleArea(): boolean {
    return this._isInCircleArea;
  }

  defineIsInCircleOrNot() {
    const rect = this.parentRect, style = this.parentStyle;
    this._isInCircleArea = (rect.width === rect.height && style.borderRadius === '50%');
  }

  get center(): Coordinate {
    return this._center;
  }

  set center(val: Coordinate) {
    this._center = val;
  }

  centerCoordinate(rect: ClientRect): Coordinate {
    return {
      x: rect.left + (rect.width/2),
      y: rect.top + (rect.height/2),
    };
  }

  pointerEventIsInHostArea(event: TouchEvent | MouseEvent): boolean {
    if(this.isInCircleArea) return this.pointerEventStillInCircleArea(event);
    return this.pointerEventStillInRectangleArea(event);
  }

  private get parentRadius(): number {
    return this.parentRect.width/2;
  }

  private get parentRadiusSq(): number {
    if(this._parentRadiusSq) return this._parentRadiusSq;
    this._parentRadiusSq = this.parentRadius*this.parentRadius;
    return this._parentRadiusSq;
  }

  pointerEventStillInCircleArea(event: TouchEvent | MouseEvent): boolean {
    const center = this.center,
          pointerEvent = pointer(event),
          dx = pointerEvent.clientX - center.x,
          dy = pointerEvent.clientY - center.y,
          touchRadiusSq = dx*dx + dy*dy;
    return touchRadiusSq < this.parentRadiusSq;
  }

  pointerEventStillInRectangleArea(event: TouchEvent | MouseEvent): boolean {
    const center = this.center,
          rect = this.parentRect,
          pointerEvent = pointer(event),
          touchX = pointerEvent.clientX, touchY = pointerEvent.clientY,
          halfW = rect.width/2, halfH = rect.height/2,
          minX = center.x - halfW, maxX = center.x + halfW,
          minY = center.y - halfH, maxY = center.y + halfH,
          isInRangeX = minX < touchX && touchX < maxX,
          isInRangeY = minY < touchY && touchY < maxY;
    return isInRangeX && isInRangeY;
  }

  outerPointStillInHostRadius(event: TouchEvent | MouseEvent): boolean {
    this.rect = this.element.getBoundingClientRect();
    const center = this.center,
          pointerEvent = pointer(event),
          dx = pointerEvent.clientX - center.x,
          dy = pointerEvent.clientY - center.y,
          touchRadiusSq = dx*dx + dy*dy,
          maxRadius = this.parentRadius - 0.5*this.rect.width,
          maxRadiusSq = maxRadius*maxRadius;
    return touchRadiusSq < maxRadiusSq;
  }

  get currentScale(): number {
    return this.rect.width/this.diameter;
  }

  translate(event: TouchEvent | MouseEvent) {

    if(this.centered) return;

    const center = this.center;
    const pointerEvent = pointer(event);

    const translatePlayer = this.animation.translate(
      pointerEvent.clientX - center.x,
      pointerEvent.clientY - center.y,
      this.currentScale
    );

    this.translatePlayers.push(translatePlayer);

    const index = this.translatePlayers.indexOf(translatePlayer);

    if(index > 0) {
      this.translatePlayers[index-1].destroy();
      this.translatePlayers.splice(index-1, 1);
    }

    translatePlayer.play();
  }

  fill(event: TouchEvent | MouseEvent) {

    this.cachingRectAndCenter();
    this.calculateDiameter(this.parentRect);
    this.updateDimensions();
    this.background.fadein();
    this.dragable = true;

    let tx = 0, ty = 0;

    if(!this.centered) {
      const center = this.center;
      const pointerEvent = pointer(event);
      tx = pointerEvent.clientX - center.x;
      ty = pointerEvent.clientY - center.y;
    }

    this.fillPlayer = this.animation.fill(tx, ty);
    this.fillPlayer.play();
  }

  private cleanTranslatePlayerThenFadeout() {
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
