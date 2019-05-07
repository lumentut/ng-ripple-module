/**
 * @license
 * Copyright (c) 2019 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import {
  Input,
  Output,
  EventEmitter,
  Directive,
  NgZone,
  ElementRef,
  Inject,
  Optional,
  HostBinding,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import {
  RippleConfigs,
  GLOBAL_RIPPLE_CONFIGS,
  DEFAULT_RIPPLE_CONFIGS,
} from './ripple.configs';

import { Ripple } from './ripple';
import { RippleEvent } from './ripple.event';
import { RipplePublisher } from './ripple.strategy';

export interface RippleEmitter {
  publisher: string;
  output: EventEmitter<any>;
  delay: number;
}

export abstract class RippleIO implements AfterViewInit, OnDestroy {

  subscriptions: Subscription = new Subscription();

  @Output() rtap: EventEmitter<any> = new EventEmitter();
  @Output() rpress: EventEmitter<any> = new EventEmitter();
  @Output() rpressup: EventEmitter<any> = new EventEmitter();
  @Output() rclick: EventEmitter<any> = new EventEmitter();

  abstract element: HTMLElement;
  abstract ngAfterViewInit(): void;
  abstract ngOnDestroy(): void;

  @Input('light')
  set light(val: boolean) { this.configs.light = true; }

  @Input('centered-ripple')
  set centered(val: boolean) { this.configs.centered = true; }

  @Input('fixed-ripple')
  set fixed(val: boolean) { this.configs.fixed = true; }

  @Input('immediate-event')
  set immediateEvent(val: boolean) { this.configs.delayEvent = false; }

  @Input('rippleBgColor')
  set rippleBgColor(val: string) { this.configs.rippleDefaultBgColor = val; }

  @Input('activeBgColor')
  set activeBgColor(val: string) { this.configs.activeDefaultBgColor = val; }

  @Input('fillTransition')
  set fillTransition(val: string) { this.configs.fillTransition = val; }

  @Input('splashTransition')
  set splashTransition(val: string) { this.configs.splashTransition = val; }

  @Input('fadeTransition')
  set fadeTransition(val: string) { this.configs.fadeTransition = val; }

  @Input('bgFadeTransition')
  set bgFadeTransition(val: string) { this.configs.bgFadeTransition = val; }

  @Input('tapLimit')
  set tapLimit(val: number) { this.configs.tapLimit = val; }

  @Input('splashOpacity')
  set splashOpacity(val: number) { this.configs.splashOpacity = val; }

  @Input('activeClass')
  set activeClass(val: string) { this.configs.activeClass = val; }

  constructor(
    public ngZone: NgZone,
    public ripple: Ripple,
    public configs: RippleConfigs,
  ) {}

  subscribeToRippleEvents(emitters: RippleEmitter[]) {
    if(!this.configs.eventIncluded) { return; }
    emitters.forEach(emitter => {
      this.subscriptions.add(this.ripple[emitter.publisher]
        .pipe(delay(emitter.delay)).subscribe((event: RippleEvent) => {
          this.ngZone.runOutsideAngular(() => emitter.output.emit(event));
      }));
    });
  }

  get emitDelayValue(): number {
    return this.configs.delayEvent ? this.configs.delayValue : 0;
  }
}

@Directive({
  selector: '[ripple], [ng-ripple]',
  providers: [Ripple]
})
export class RippleDirective extends RippleIO implements AfterViewInit, OnDestroy {

  element: HTMLElement;

  @HostBinding('style.position') position: string = 'relative';
  @HostBinding('style.display') display: string = 'block';
  @HostBinding('style.overflow') overflow: string = 'hidden';
  @HostBinding('style.cursor') cursor: string = 'pointer';

  constructor(
    elRef: ElementRef,
    ngZone: NgZone,
    ripple: Ripple,
    @Optional() @Inject(GLOBAL_RIPPLE_CONFIGS) customConfigs: RippleConfigs
  ) {
    super(ngZone, ripple, { ...DEFAULT_RIPPLE_CONFIGS, ...customConfigs });
    this.element = elRef.nativeElement;
  }

  ngAfterViewInit() {
    this.ripple.initialize(this.element, this.configs);
    this.subscribeToRippleEvents(this.emitters);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.ripple.onDestroy();
  }

  get emitters(): RippleEmitter[] {
    return [
      { publisher: RipplePublisher.CLICK, output: this.rclick, delay: this.emitDelayValue },
      { publisher: RipplePublisher.TAP, output: this.rtap, delay: this.emitDelayValue },
      { publisher: RipplePublisher.PRESS, output: this.rpress, delay: 0 },
      { publisher: RipplePublisher.PRESSUP, output : this.rpressup, delay: 0 }
    ];
  }
}
