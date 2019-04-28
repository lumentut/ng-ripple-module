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
  Optional,
  Inject,
  ElementRef,
  Renderer2
} from '@angular/core';

import { Subject } from 'rxjs';

import {
  AnimationPlayer,
  AnimationBuilder,
} from '@angular/animations';

import {
  RIPPLE_CORE_CONFIGS,
  RippleCoreConfigs
} from './ripple.configs';

import { RIPPLE_SCALE_INCREASER } from './ripple.constants';
import { RippleComponent } from './ripple.component';
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

export enum EndFillBy {
  SPLASH = 'splash',
  FADEOUT = 'fadeout'
}

export enum HostType {
  ROUND = 'round',
  RECTANGLE = 'rectangle'
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
export class CoreComponent extends RippleComponent implements AfterViewInit {

  animation: RippleAnimation;
  fillPlayer: AnimationPlayer;
  splashPlayer: AnimationPlayer;
  translatePlayer: AnimationPlayer;
  center: Coordinate;

  hostType: string;
  dragable: boolean;
  tapLimit: number;
  diameter: number;
  scale: number;

  eventEmitter = new Subject<any>();

  constructor(
    elRef: ElementRef,
    host: RippleHost,
    private renderer: Renderer2,
    protected builder: AnimationBuilder,
    @Optional() private background: BackgroundComponent,
    @Inject(RIPPLE_CORE_CONFIGS) public configs: RippleCoreConfigs
  ) {
    super(elRef, host);
    this.renderer.setStyle(this.element, 'background', this.configs.rippleBgColor);
    this.tapLimit = this.configs.tapLimit;
    this.animation = new RippleAnimation(this.element, this.builder, this.configs);
    this.hostType = host.isRound ? HostType.ROUND : HostType.RECTANGLE;
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

  centerCoordinateStillIsInHostArea(coord: Coordinate): boolean {
    if(this.host.isRound) {
      return this.coordinateCenterStillInCircleArea(coord);
    }
    return this.coordinateCenterStillInRectangleArea(coord);
  }

  private coordinateFromHostCenterSq(coord: Coordinate) {
    const dx = coord.x - this.host.center.x,
          dy = coord.y - this.host.center.y;
    return dx*dx + dy*dy;
  }

  coordinateCenterStillInCircleArea(coord: Coordinate): boolean {
    return this.coordinateFromHostCenterSq(coord) < this.host.radiusSquare;
  }

  coordinateCenterStillInRectangleArea(coord: Coordinate): boolean {
    const rect = this.host.rect,
          isInRangeX = rect.left < coord.x && coord.x < rect.right,
          isInRangeY = rect.top < coord.y && coord.y < rect.bottom;
    return isInRangeX && isInRangeY;
  }

  outerPointCoordinateStillInHostRadius(coord: Coordinate): boolean {
    const contactPointFromCenterSq = this.coordinateFromHostCenterSq(coord),
          maxContactPointFromCenter = this.host.radius - 0.5*this.rect.width,
          maxContactPointFromCenterSq = maxContactPointFromCenter*maxContactPointFromCenter;
    return contactPointFromCenterSq < maxContactPointFromCenterSq;
  }

  fillAt(coord: Coordinate) {

    if(this.background) { this.background.fadein(); }

    let tx = 0, ty = 0;
    if(!this.configs.centered) {
      const center = this.host.center;
      tx = coord.x - center.x;
      ty = coord.y - center.y;
    }

    this.fillPlayer = this.animation.fill(tx, ty);
    this.fillPlayer.play();
  }

  get currentScale(): number {
    return this.rect.width/this.host.diameter;
  }

  translateTo(coord: Coordinate) {

    if(!this.scale) { this.scale = this.currentScale; }
    if(this.configs.centered) { return; }

    const center = this.host.center;
    const scale = this.scale;

    this.scale = scale + RIPPLE_SCALE_INCREASER;

    this.translatePlayer = this.animation.translate(
      coord.x - center.x,
      coord.y - center.y,
      scale
    );

    this.translatePlayer.play();
  }

  splash = () => this.endFillBy(EndFillBy.SPLASH);

  fadeout = () => this.endFillBy(EndFillBy.FADEOUT);

  private endFillBy(type: string) {

    const player = `${type}Player`;

    this[player] = this.animation[type];
    this[player].onStart(() => this.fillPlayer=null);

    this[player].onDone(() => {
      this.eventEmitter.next();
      if(this.background) {
        this.background.fadeinPlayer=null;
        this.background.fadeout();
      }
      this[player]=null;
    });

    this[player].play();
  }
}
