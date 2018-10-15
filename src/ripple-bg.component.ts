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
  trigger,
  state,
  transition
} from '@angular/animations';

import {
  RIPPLE_DARK_ACTIVE_BGCOLOR,
} from './ripple.constants';

export enum BackgroundStates {
  FADEIN = 'fadein',
  FADEOUT = 'fadeout'
}

@Component({
  selector: 'background',
  template: `<ng-content></ng-content>`,
  animations: [
    trigger('state',[
      state('fadein', style({ opacity: 1 })),
      state('fadeout', style({ opacity: 0 })),
      transition('fadein <=> fadeout', animate('350ms'))
    ])
  ],
  styles: [
    `:host {
      width: 100%;
      height: 100%;
      opacity: 0;
      display: block;
    }`
  ],
  host: {'(@state.done)' : 'trigger($event)'}
})
export class BackgroundComponent {

  element: HTMLElement

  @HostBinding('@state') state: string
  
  @HostBinding('style.background')
  color: string = RIPPLE_DARK_ACTIVE_BGCOLOR

  @Output() eventTrigger: EventEmitter<any> = new EventEmitter();

  constructor( private elRef: ElementRef ){
    this.element = this.elRef.nativeElement;
  }

  trigger(event: TouchEvent) {
    if((<any>event).toState == 'fadeout') this.eventTrigger.emit(event);
  }
}