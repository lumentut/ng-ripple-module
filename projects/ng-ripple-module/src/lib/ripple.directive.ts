/**
 * @license
 * Copyright (c) 2019 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import {
  Output,
  EventEmitter,
  Directive,
  ElementRef,
  Inject,
  Optional,
  HostBinding,
  AfterViewInit
} from '@angular/core';

import { RippleConfigs, GLOBAL_RIPPLE_CONFIGS } from './ripple.configs';
import { Ripple } from './ripple';
import { RippleEffect } from './ripple.decorator';

export interface RippleEmitter {
  publisher: string;
  output: EventEmitter<any>;
  delay: number;
}

@Directive({
  selector: '[ripple]',
  providers: [Ripple]
})
@RippleEffect()
export class RippleDirective implements AfterViewInit {

  configs: RippleConfigs;

  @HostBinding('style.position') position: string = 'relative';
  @HostBinding('style.display') display: string = 'block';
  @HostBinding('style.overflow') overflow: string = 'hidden';
  @HostBinding('style.cursor') cursor: string = 'pointer';

  @Output() rtap: EventEmitter<any> = new EventEmitter();
  @Output() rpress: EventEmitter<any> = new EventEmitter();
  @Output() rpressup: EventEmitter<any> = new EventEmitter();
  @Output() rclick: EventEmitter<any> = new EventEmitter();

  constructor(
    private elRef: ElementRef,
    public ripple: Ripple,
    @Optional() @Inject(GLOBAL_RIPPLE_CONFIGS) customConfigs: RippleConfigs
  ) {
    this.configs = customConfigs;
  }

  ngAfterViewInit() {
    this.ripple.subscribeEmitter(this);
  }
}
