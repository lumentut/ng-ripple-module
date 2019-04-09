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
  Inject,
  ElementRef,
  Renderer2,
  HostBinding
} from '@angular/core';

import {
  AnimationPlayer,
  AnimationBuilder
} from '@angular/animations';

import {
  RIPPLE_CORE_CONFIGS,
  RippleCoreConfigs
} from './ripple.configs';

import {
  BackgroundComponent
} from './ripple-bg.component';

import {
  RippleAnimation
} from './ripple.animation';

import {
  pointer
} from './ripple.event.handler';

export interface RippleColor {
  rippleDefaultColor?: string;
  backgroundDefaultColor?: string;
  rippleLightColor?: string;
  backgroundLightColor?: string;
}

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

  dragable: boolean;

  fillPlayer: AnimationPlayer;
  splashPlayer: AnimationPlayer;
  fadeoutPlayer: AnimationPlayer;
  translatePlayers = [];

  tapLimit: number;

  diameter: number;
  rect: ClientRect;
  parentRect: ClientRect;
  center: Coordinate;

  @HostBinding('style.background') color: string;

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
    protected builder: AnimationBuilder,
    private background: BackgroundComponent,
    @Inject(RIPPLE_CORE_CONFIGS) public configs: RippleCoreConfigs
  ) {
    this.element = this.elRef.nativeElement;
    this.color = this.configs.rippleBgColor;
    this.tapLimit = this.configs.tapLimit;
  }

  get animation(): RippleAnimation {
    if(this._animation) return this._animation;
    return this._animation = new RippleAnimation(this.element, this.builder, this.configs);
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
      marginTop: margin.top
    };
  }

  ngAfterViewInit() {
    this.parentElement = this.element.parentNode as HTMLElement;
    this.parentRect = this.parentElement.getBoundingClientRect();
    this.initialSetup();
  }

  initialSetup() {
    this.calculateDiameter(this.parentRect);
    this.defineIsInCircleOrNot();
    this.updateDimensions();
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

  centerCoordinate(rect: ClientRect): Coordinate {
    return {
      x: rect.left + (rect.width/2),
      y: rect.top + (rect.height/2),
    };
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
          eventRadiusSq = dx*dx + dy*dy;
    return eventRadiusSq < this.parentRadiusSq;
  }

  pointerEventStillInRectangleArea(event: TouchEvent | MouseEvent): boolean {
    const center = this.center,
          rect = this.parentRect,
          pointerEvent = pointer(event),
          halfW = rect.width/2, halfH = rect.height/2,
          minX = center.x - halfW, maxX = center.x + halfW,
          minY = center.y - halfH, maxY = center.y + halfH,
          isInRangeX = minX < pointerEvent.clientX && pointerEvent.clientX < maxX,
          isInRangeY = minY < pointerEvent.clientY && pointerEvent.clientY < maxY;
    return isInRangeX && isInRangeY;
  }

  outerPointStillInHostRadius(event: TouchEvent | MouseEvent): boolean {
    this.rect = this.element.getBoundingClientRect();
    const center = this.center,
          pointerEvent = pointer(event),
          dx = pointerEvent.clientX - center.x,
          dy = pointerEvent.clientY - center.y,
          eventRadiusSq = dx*dx + dy*dy,
          maxRadius = this.parentRadius - 0.5*this.rect.width,
          maxRadiusSq = maxRadius*maxRadius;
    return eventRadiusSq < maxRadiusSq;
  }

  fill(event: TouchEvent | MouseEvent) {

    this.cachingRectAndCenter();
    this.calculateDiameter(this.parentRect);
    this.updateDimensions();
    this.background.fadein();
    this.dragable = true;

    let tx = 0, ty = 0;

    if(!this.configs.centered) {
      const center = this.center;
      const pointerEvent = pointer(event);
      tx = pointerEvent.clientX - center.x;
      ty = pointerEvent.clientY - center.y;
    }

    this.fillPlayer = this.animation.fill(tx, ty);
    this.fillPlayer.play();
  }

  get currentScale(): number {
    return this.rect.width/this.diameter;
  }

  translate(event: TouchEvent | MouseEvent) {

    if(this.configs.centered) return;

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

  splash = () => this.endFillBy('splash');

  fadeout = () => this.endFillBy('fadeout');

  private endFillBy(type: string) {

    const player = `${type}Player`;

    this.dragable = false;
    this[player] = this.animation[type];
    this[player].onStart(() => this.fillPlayer.destroy());

    this[player].onDone(() => {
      this[player].destroy();
      this.translatePlayers.length = 0;
      this.background.fadeout();
    });

    this[player].play();
  }
}
