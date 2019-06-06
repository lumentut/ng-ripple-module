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
  Input,
  Inject,
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
  RippleBgConfigs,
  RIPPLE_BG_CONFIGS
} from './ripple.configs';

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
export class BackgroundComponent implements OnDestroy {

  element: HTMLElement;
  parentElement: HTMLElement;

  _fadeinPlayer: AnimationPlayer;
  _fadeoutPlayer: AnimationPlayer;

  _isDestroying: boolean;

  @HostBinding('style.background') color: string;

  fadeTransition: string;

  @Output() eventTrigger: EventEmitter<any> = new EventEmitter();

  constructor(
    private elRef: ElementRef,
    private builder: AnimationBuilder,
    @Inject(RIPPLE_BG_CONFIGS) public configs: RippleBgConfigs,
  ) {
    this.element = this.elRef.nativeElement;
    this.parentElement = this.element.parentNode as HTMLElement;
    this.color = this.configs.backgroundColor;
    this.fadeTransition = this.configs.fadeTransition;
  }

  ngOnDestroy() {
    if(this._fadeinPlayer) this._fadeinPlayer.destroy();
    if(this._fadeoutPlayer) this._fadeoutPlayer.destroy();
  }

  prepareToBeDestroyed() {
    this._isDestroying = true;
  }

  get parentRect(): ClientRect {
    return this.parentElement.getBoundingClientRect();
  }

  private animationPlayerFactory(animation: any[]) {
    return this.builder.build(animation).create(this.element);
  }

  get fadeinPlayer(): AnimationPlayer {
    return this.animationPlayerFactory([
      animate(this.fadeTransition, keyframes([
        style({ opacity: 0 }), style({ opacity: 1 })
      ]))
    ]);
  }

  get fadeoutPlayer(): AnimationPlayer {
    return this.animationPlayerFactory([
      animate(this.fadeTransition, style({ opacity: 0 }))
    ]);
  }

  fadein() {
    this._fadeinPlayer = this.fadeinPlayer;
    this._fadeinPlayer.play();
  }

  fadeout() {
    if(this._isDestroying) return;
    this._fadeoutPlayer = this.fadeoutPlayer;
    this._fadeoutPlayer.play();
    this.eventTrigger.emit();
  }
}
