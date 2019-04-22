/**
 * @license
 * Copyright (c) 2019 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import {
  NgZone,
  Component,
  AfterViewInit,
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

  element: HTMLElement;
  parentElement: HTMLElement;
  animation: RippleAnimation;
  fillPlayer: AnimationPlayer;
  splashPlayer: AnimationPlayer;
  translatePlayers = [];
  parentRect: ClientRect;
  center: Coordinate;

  dragable: boolean;
  tapLimit: number;
  diameter: number;

  eventEmitter = new Subject<any>();

  constructor(
    elRef: ElementRef,
    host: RippleHost,
    private renderer: Renderer2,
    protected builder: AnimationBuilder,
    private background: BackgroundComponent,
    @Inject(RIPPLE_CORE_CONFIGS) public configs: RippleCoreConfigs
  ) {
    super(elRef, host);
    this.renderer.setStyle(this.element, 'background', this.configs.rippleBgColor);
    this.tapLimit = this.configs.tapLimit;
    this.animation = new RippleAnimation(this.element, this.builder, this.configs);
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

    let tx = 0, ty = 0;
    if(!this.configs.centered) {
      const center = this.host.center;
      const evt = this.pointer(event);
      tx = evt.clientX - center.x;
      ty = evt.clientY - center.y;
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
    const evt = event.changedTouches ? event.changedTouches[0] : event;

    const translatePlayer = this.animation.translate(
      evt.clientX - center.x,
      evt.clientY - center.y,
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

  splash = () => this.endFillBy(EndFillBy.SPLASH);

  fadeout = () => this.endFillBy(EndFillBy.FADEOUT);

  private endFillBy(type: string) {

    const player = `${type}Player`;
    this[player] = this.animation[type];

    this[player].onStart(() => {
      this.translatePlayers.length = 0;
      this.fillPlayer.reset();
    });

    this[player].onDone(() => {
      this.eventEmitter.next();
      this.background.fadeinPlayer.reset();
      this.background.fadeout();
      this[player].reset();
    });

    this[player].play();
  }
}
