/**
 * @license
 * Copyright (c) 2018 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import {
  style,
  animate,
  AnimationBuilder,
  AnimationPlayer,
  AnimationAnimateMetadata
} from '@angular/animations';

import {
  RIPPLE_TO_CENTER_TRANSFORM
} from './ripple.constants';

export interface RippleTransition {
  fill: string;
  splash: string;
  fade: string;
}

export class RippleAnimation {

  private _transition: RippleTransition

  constructor(
    private element: HTMLElement,
    private builder: AnimationBuilder
  ){}

  set transition(val: RippleTransition) {
    this._transition = val;
  }

  get transition(): RippleTransition {
    return this._transition;
  } 

  animationPlayerFactory(animation: any[]) {
    return this.builder.build(animation).create(this.element);
  }

  get fade(): AnimationAnimateMetadata {
    return animate(this.transition.fade, style({ opacity: 0 }));
  }

  splashToCenter(transition: string): AnimationAnimateMetadata {
    return animate( transition, style({
      opacity: 1, 
      transform: RIPPLE_TO_CENTER_TRANSFORM 
    }));
  }


  fill(tx: number, ty: number): AnimationPlayer {

    const showInTouchCoordinate = style({
      opacity: 1,
      transform: `translate3d(${tx}px, ${ty}px, 0) scale(0)`,
    });

    const centering = animate(this.transition.fill, style({
      opacity: 1,
      transform: RIPPLE_TO_CENTER_TRANSFORM
    }));

    const player = this.animationPlayerFactory([showInTouchCoordinate, centering]);

    return player;
  }

  translate(tx: number, ty: number, scale: number): AnimationPlayer {

    const translation = style({
      transition: '0s',
      transform: `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`
    });

    const centering = animate(this.transition.fill, style({
      transform: RIPPLE_TO_CENTER_TRANSFORM
    }));

    const player = this.animationPlayerFactory([translation, centering]);

    return player;
  }

  get splash(): AnimationPlayer {
    const splashToCenter = this.splashToCenter(this.transition.splash);
    const player = this.animationPlayerFactory([splashToCenter, this.fade]);
    return player;
  }

  get fadeout(): AnimationPlayer {
    const player = this.animationPlayerFactory([this.fade]);
    return player;
  }
}