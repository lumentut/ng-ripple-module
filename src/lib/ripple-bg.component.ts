/**
 * @license
 * Copyright (c) 2018 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  Output,
  HostBinding,
  EventEmitter
} from '@angular/core';

import {
  style,
  animate,
  keyframes,
  AnimationBuilder,
  AnimationPlayer
} from '@angular/animations';

import {
  RIPPLE_BG_FADE_TRANSITION,
  RIPPLE_SPLASH_TRANSITION,
  RIPPLE_DEFAULT_ACTIVE_BGCOLOR
} from './ripple.constants';

import {
  _isMobile,
  RippleGestures
} from './ripple.gestures';

@Component({
  selector: 'ripple-bg',
  template: `<ng-content></ng-content>`,
  styles: [
    `:host {
      top: 0;
      left: 0;
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      opacity: 0;
    }`
  ]
})
export class BackgroundComponent implements OnInit, OnDestroy {

  element: HTMLElement;
  parentElement: HTMLElement;

  gestures: RippleGestures;

  _fadeinPlayer: AnimationPlayer;
  _fadeoutPlayer: AnimationPlayer;

  _isMobile: boolean;

  @HostBinding('style.background')
  color: string = RIPPLE_DEFAULT_ACTIVE_BGCOLOR;

  @Output() eventTrigger: EventEmitter<any> = new EventEmitter();

  constructor(
    private elRef: ElementRef,
    private builder: AnimationBuilder
  ) {
    this.element = this.elRef.nativeElement;
  }

  ngOnInit() {
    this.parentElement = this.element.parentNode as HTMLElement;
  }

  ngOnDestroy() {
    if(this._fadeinPlayer) this._fadeinPlayer.destroy();
    if(this._fadeoutPlayer) this._fadeoutPlayer.destroy();
  }

  get isMobile(): boolean {
    if(this._isMobile) return this._isMobile;
    return this._isMobile = _isMobile();
  }

  get parentRect(): ClientRect {
    return this.parentElement.getBoundingClientRect();
  }

  private animationPlayerFactory(animation: any[]) {
    return this.builder.build(animation).create(this.element);
  }

  get fadeinPlayer(): AnimationPlayer {
    return this.animationPlayerFactory([
      animate(RIPPLE_BG_FADE_TRANSITION, keyframes([
        style({ opacity: 0 }), style({ opacity: 1 })
      ]))
    ]);
  }

  get fadeoutPlayer(): AnimationPlayer {
    return this.animationPlayerFactory([
      animate(RIPPLE_SPLASH_TRANSITION, style({ opacity: 0 }))
    ]);
  }

  fadein() {
    this._fadeinPlayer = this.fadeinPlayer;
    this._fadeinPlayer.play();
  }

  fadeout() {
    this._fadeoutPlayer = this.fadeoutPlayer;
    this._fadeoutPlayer.play();
    this.eventTrigger.emit();
  }
}
