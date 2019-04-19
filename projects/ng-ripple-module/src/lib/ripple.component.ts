/**
 * @license
 * Copyright (c) 2019 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import {
  Component,
  AfterViewInit,
  Inject,
  ElementRef,
  Renderer2
} from '@angular/core';

import {
  AnimationPlayer,
  AnimationBuilder
} from '@angular/animations';

import {
  RIPPLE_CORE_CONFIGS,
  RippleCoreConfigs
} from './ripple.configs';

import { BackgroundComponent } from './ripple-bg.component';
import { RippleAnimation } from './ripple.animation';
import { RippleHost } from './ripple.host';

import { Coordinate, RippleStyle } from './ripple';

export interface RippleColor {
  rippleDefaultColor?: string;
  backgroundDefaultColor?: string;
  rippleLightColor?: string;
  backgroundLightColor?: string;
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
  fillPlayer: AnimationPlayer;
  splashPlayer: AnimationPlayer;
  fadeoutPlayer: AnimationPlayer;
  translatePlayers = [];
  parentRect: ClientRect;
  center: Coordinate;

  dragable: boolean;
  tapLimit: number;
  diameter: number;

  private _animation: RippleAnimation;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    protected builder: AnimationBuilder,
    private background: BackgroundComponent,
    private host: RippleHost,
    @Inject(RIPPLE_CORE_CONFIGS) public configs: RippleCoreConfigs
  ) {
    this.element = this.elRef.nativeElement;
    this.renderer.setStyle(this.element, 'background', this.configs.rippleBgColor);
    this.tapLimit = this.configs.tapLimit;
  }

  ngAfterViewInit() {
    this.setCoreSize();
  }

  get rect(): ClientRect {
    return this.element.getBoundingClientRect();
  }

  get properties(): RippleStyle {
    return {
      width: this.host.diameter,
      height: this.host.diameter,
      marginLeft: this.host.marginRef.left,
      marginTop: this.host.marginRef.top
    };
  }

  private setCoreSize() {
    for(const key in this.properties) {
      if(this.properties[key]) {
        this.renderer.setStyle(this.element, key, `${this.properties[key]}px`);
      }
    }
  }

  get animation(): RippleAnimation {
    if(this._animation) {
      return this._animation;
    }
    return this._animation = new RippleAnimation(this.element, this.builder, this.configs);
  }

  pointerEventCoordinateIsInHostArea(event: TouchEvent | MouseEvent): boolean {
    if(this.host.isRound) {
      return this.pointerEventStillInCircleArea(event);
    }
    return this.pointerEventStillInRectangleArea(event);
  }

  private pointer(event: any) {
    return event.changedTouches ? event.changedTouches[0] : event;
  }

  pointerEventStillInCircleArea(event: TouchEvent | MouseEvent): boolean {
    const center = this.host.center,
          pointerEvent = this.pointer(event),
          dx = pointerEvent.clientX - center.x,
          dy = pointerEvent.clientY - center.y,
          eventRadiusSq = dx*dx + dy*dy;
    return eventRadiusSq < this.host.radiusSquare;
  }

  pointerEventStillInRectangleArea(event: TouchEvent | MouseEvent): boolean {
    const center = this.host.center,
          rect = this.host.rect,
          pointerEvent = this.pointer(event),
          halfW = rect.width/2, halfH = rect.height/2,
          minX = center.x - halfW, maxX = center.x + halfW,
          minY = center.y - halfH, maxY = center.y + halfH,
          isInRangeX = minX < pointerEvent.clientX && pointerEvent.clientX < maxX,
          isInRangeY = minY < pointerEvent.clientY && pointerEvent.clientY < maxY;
    return isInRangeX && isInRangeY;
  }

  outerPointStillInHostRadius(event: TouchEvent | MouseEvent): boolean {
    const center = this.host.center,
          pointerEvent = this.pointer(event),
          dx = pointerEvent.clientX - center.x,
          dy = pointerEvent.clientY - center.y,
          eventRadiusSq = dx*dx + dy*dy,
          maxRadius = this.host.radius - 0.5*this.rect.width,
          maxRadiusSq = maxRadius*maxRadius;
    return eventRadiusSq < maxRadiusSq;
  }

  fill(event: TouchEvent | MouseEvent) {

    this.background.fadein();
    this.dragable = true;

    let tx = 0, ty = 0;

    if(!this.configs.centered) {
      const center = this.host.center;
      const pointerEvent = this.pointer(event);
      tx = pointerEvent.clientX - center.x;
      ty = pointerEvent.clientY - center.y;
    }

    this.fillPlayer = this.animation.fill(tx, ty);
    this.fillPlayer.play();
  }

  get currentScale(): number {
    return this.rect.width/this.host.diameter;
  }

  translate(event: any) {

    if(this.configs.centered) {
      return;
    }

    const center = this.host.center;
    const pointerEvent = event.changedTouches ? event.changedTouches[0] : event;

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
