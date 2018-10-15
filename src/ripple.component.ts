/**
 * @license
 * Copyright (c) 2018 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import { 
  Component,
  ElementRef,
  Renderer2,
  Input,
  HostBinding,
  ChangeDetectionStrategy
} from '@angular/core';

import {
  style,
  animate,
  keyframes,
  AnimationBuilder,
  AnimationPlayer
} from '@angular/animations';

import {
  RIPPLE_TO_CENTER_TRANSFORM,
  RIPPLE_FILL_TRANSITION,
  RIPPLE_SPLASH_TRANSITION,
  RIPPLE_FADE_TRANSITION,
  RIPPLE_DARK_BGCOLOR,
  RIPPLE_CLICK_FILL_AND_SPLASH
} from './ripple.constants';

import { 
  BackgroundComponent,
  BackgroundStates
} from './ripple-bg.component';

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
  return event.changedTouches[0];
}

@Component({
  selector: 'ripple',
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RippleComponent {

  element: HTMLElement
  parentElement: HTMLElement

  rect: ClientRect
  parentRect: ClientRect

  background: BackgroundComponent

  dragable: boolean

  animationPlayer: AnimationPlayer

  @HostBinding('style.background')
  color: string = RIPPLE_DARK_BGCOLOR

  @Input()
  centered: boolean = false

  @Input()
  fixed: boolean = false

  @Input()
  fillTransition: string = RIPPLE_FILL_TRANSITION

  @Input()
  splashTransition: string = RIPPLE_SPLASH_TRANSITION

  @Input()
  fadeTransition: string = RIPPLE_FADE_TRANSITION

  @Input()
  clickAndSplashTransition: string = RIPPLE_CLICK_FILL_AND_SPLASH

  private _parentRadiusSq: number

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private builder: AnimationBuilder
  ){
    this.element = this.elRef.nativeElement; 
  }

  get diameter(): number {
    const rect = this.parentRect;
    if(this.isInCircleArea) return rect.width;
    return Math.sqrt((rect.width*rect.width) + (rect.height*rect.height));
  }

  get margin(): Margin {
    if(this.isInCircleArea) return {top: 0, left: 0};
    return {
      top: (this.parentRect.height - this.diameter)/2,
      left: (this.parentRect.width - this.diameter)/2
    }
  }

  get properties(): RippleStyle {
    return {
      width: this.diameter,
      height: this.diameter,
      marginLeft: this.margin.left,
      marginTop: this.margin.top,
      background: this.color
    }
  }

  ngAfterViewInit() {
    this.parentElement = this.element.parentNode as HTMLElement;
    this.parentRect = this.parentElement.getBoundingClientRect();
    for(let key in this.properties) {
      this.renderer.setStyle(this.element, key, `${this.properties[key]}px`);
    }
  }

  ngOnDestroy() {
    if(this.animationPlayer) this.animationPlayer.destroy();
  }

  get isInCircleArea(): boolean {
    const rect = this.parentRect, 
          style = getComputedStyle(this.parentElement);
    return (rect.width === rect.height && style.borderRadius === '50%');
  }

  get center(): Coordinate {
    return this.currentCoordinate(this.parentElement);
  }

  get position(): Coordinate {
    return this.currentCoordinate(this.element);
  }

  private currentCoordinate(element: HTMLElement): Coordinate {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left + (rect.width/2),
      y: rect.top + (rect.height/2),
    }
  }

  touchEventIsInHostArea(event: TouchEvent): boolean {
    if(this.isInCircleArea) return this.touchEventStillInCircleArea(event);
    return this.touchEventStillInRectangleArea(event);
  }

  get parentRadiusSq(): number {
    if(this._parentRadiusSq) return this._parentRadiusSq;
    const radius = this.parentRect.width/2;
    this._parentRadiusSq = radius*radius;
    return this._parentRadiusSq;
  }

  private touchEventStillInCircleArea(event: TouchEvent): boolean {
    const dx = touch(event).clientX - this.center.x,
          dy = touch(event).clientY - this.center.y,
          touchRadiusSq = dx*dx + dy*dy;
    return touchRadiusSq < this.parentRadiusSq;
  }

  private touchEventStillInRectangleArea(event: TouchEvent): boolean {
    const rect = this.parentRect,
          touchX = touch(event).clientX, touchY = touch(event).clientY,
          isInRangeX = rect.left < touchX && touchX < rect.right,
          isInRangeY = rect.top < touchY && touchY < rect.bottom;
    return isInRangeX && isInRangeY;
  }

  outerPointStillInHostRadius(event: TouchEvent): boolean {
    const rippleRect = this.element.getBoundingClientRect(),
          dx = touch(event).clientX - this.center.x,
          dy = touch(event).clientY - this.center.y,
          touchRadiusSq = dx*dx + dy*dy,
          maxRadius = 0.5*this.parentRect.width - 0.5*rippleRect.width,
          maxRadiusSq = maxRadius*maxRadius;
    return touchRadiusSq < maxRadiusSq;
  }

  translate(event: TouchEvent) {

    if(this.centered) return;
    if(this.fixed) return this.splash();

    this.animationPlayer = this.translateAnimation(
      touch(event).clientX - this.center.x,
      touch(event).clientY - this.center.y
    );
  
    this.animationPlayer.play();
  }

  splash() {
    this.animationPlayer = this.splashAnimation;
    this.animationPlayer.play();
    this.background.state = BackgroundStates.FADEOUT;
    this.dragable = false;
  }

  fill(event: TouchEvent) {

    this.animationPlayer = this.fillAnimation(
      touch(event).clientX - this.center.x,
      touch(event).clientY - this.center.y
    );

    this.animationPlayer.play();
    this.background.state = BackgroundStates.FADEIN;
    this.dragable = true;
  }

  fillAndSplash(event: MouseEvent) {
    this.animationPlayer = this.fillAndSplashAnimation(
      event.clientX - this.center.x,
      event.clientY - this.center.y
    );
    this.animationPlayer.play();
  }

  private animationPlayerFactory(animation: any[]) {
    return this.builder.build(animation).create(this.element);
  }

  private fillAndSplashAnimation(tx: number, ty:number): AnimationPlayer {

    const showInTouchCoordinate = style({
      opacity: 1,
      transform: `translate3d(${tx}px, ${ty}px, 0) scale(0)`
    });

    const splashToCenter = animate(
      this.clickAndSplashTransition,
      style({
        willChange: `transform`,
        transform: RIPPLE_TO_CENTER_TRANSFORM
      })
    );

    const fade = animate(
      this.fadeTransition, 
      style({ opacity: 0 })
    );

    const player = this.animationPlayerFactory([
      showInTouchCoordinate,
      splashToCenter,
      fade
    ]);

    return player;
  }

  private fillAnimation(dx: number, dy: number): AnimationPlayer {

    const tx = this.centered ? 0 : dx;
    const ty = this.centered ? 0 : dy;

    const showInTouchCoordinate = style({
      opacity: 1,
      transform: `translate3d(${tx}px, ${ty}px, 0) scale(0)`
    });

    const centering = style({
      willChange: `transform`,
      transform: RIPPLE_TO_CENTER_TRANSFORM,
    })

    const fillKeyframes = animate(
      this.fillTransition,
      keyframes([
        showInTouchCoordinate,
        centering
      ])
    );

    const player = this.animationPlayerFactory([fillKeyframes]);

    return player;
  }

  private get splashAnimation(): AnimationPlayer {

    const splashToCenter = animate(this.splashTransition, style({
      willChange: `transform`,
      transform: RIPPLE_TO_CENTER_TRANSFORM
    }));

    const fade = animate( this.fadeTransition, style({ opacity: 0 }));
    const player = this.animationPlayerFactory([splashToCenter, fade]);

    return player;
  }

  private get currentScale(): number {
    const rect = this.element.getBoundingClientRect();
    return rect.width/this.diameter;
  }

  private translateAnimation(tx: number, ty: number): AnimationPlayer {

    const translation = style({
      willChange: 'off',
      transition: '0ms linear',
      transform: `translate3d(${tx}px, ${ty}px, 0) scale(${this.currentScale})`
    });

    const centering = animate(this.fillTransition, style({
      transform: RIPPLE_TO_CENTER_TRANSFORM
    }));

    const player = this.animationPlayerFactory([translation, centering]);

    return player;
  }
}