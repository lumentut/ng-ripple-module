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
  RIPPLE_DEFAULT_ACTIVE_BGCOLOR
} from './ripple.constants';

@Component({
  selector: 'background',
  template: `<ng-content></ng-content>`,
  styles: [
    `:host {
      top: 0;
      left: 0;
      display: block;
      position: absolute;
      border-radius: inherit;
      opacity: 0;
    }`
  ]
})
export class BackgroundComponent {

  element: HTMLElement
  parentElement: HTMLElement

  duration: number = 350;
  
  @HostBinding('style.background')
  color: string = RIPPLE_DEFAULT_ACTIVE_BGCOLOR

  @HostBinding('style.width') width: string
  @HostBinding('style.height') height: string

  @Output() eventTrigger: EventEmitter<any> = new EventEmitter();

  constructor(
    private elRef: ElementRef,
    private builder: AnimationBuilder
  ){
    this.element = this.elRef.nativeElement;
  }

  ngOnInit() {
    this.parentElement = this.element.parentNode as HTMLElement
    this.updateDimensions
  }

  get updateDimensions(){
    const parentRect = this.parentElement.getBoundingClientRect()
    this.width = `${parentRect.width}px`;
    this.height = `${parentRect.height}px`;
    return;
  }

  private animationPlayerFactory(animation: any[]) {
    return this.builder.build(animation).create(this.element);
  }

  private get fadeinPlayer(): AnimationPlayer {
    return this.animationPlayerFactory([
      animate(`${this.duration}ms ease-in-out`, keyframes([
        style({ opacity: 0 }), style({ opacity: 1 })
      ]))
    ]);
  }

  private get fadeoutPlayer(): AnimationPlayer {
    return this.animationPlayerFactory([
      animate(`${this.duration}ms ease-in-out`, keyframes([
        style({ opacity: 1 }), style({ opacity: 0 })
      ]))
    ]);
  }

  get fadein() {
    this.fadeinPlayer.play();
    return;
  }

  get fadeout() {
    this.fadeoutPlayer.play();
    setTimeout(() => this.eventTrigger.emit(), this.duration);
    return;
  }
}