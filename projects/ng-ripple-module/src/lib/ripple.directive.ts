/**
 * @license
 * Copyright (c) 2018 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import {
  Directive,
  AfterViewInit,
  OnDestroy,
  NgZone,
  HostBinding,
  ElementRef,
  ComponentFactoryResolver,
  ApplicationRef,
  ComponentRef,
  Input,
  Output,
  Inject,
  Optional,
  Renderer2,
  EventEmitter
} from '@angular/core';

import {
  RippleConfigs,
  RippleComponentConfigs,
  GLOBAL_RIPPLE_CONFIGS,
  DEFAULT_RIPPLE_CONFIGS,
} from './ripple.configs';

import {
  RippleEmitters,
  RippleEventHandler
} from './ripple.event.handler';

import { RippleMotionTracker } from './ripple.tracker';

import { Ripple } from './ripple';

export function enforceStyleRecalculation(element: HTMLElement) {
  window.getComputedStyle(element).getPropertyValue('opacity');
}

@Directive({ selector: '[ripple]' })
export class RippleDirective implements AfterViewInit, OnDestroy {

  element: HTMLElement;
  eventHandler: RippleEventHandler;
  configs: RippleConfigs;
  cmpConfigs: RippleComponentConfigs;
  children: any[];
  ripple: Ripple;
  coreCmpRef: ComponentRef<any>;
  backgroundCmpRef: ComponentRef<any>;

  @HostBinding('style.display') display: string = 'block';
  @HostBinding('style.overflow') overflow: string = 'hidden';
  @HostBinding('style.cursor') cursor: string = 'pointer';
  @HostBinding('style.width') width: string;
  @HostBinding('class.activated') activated: boolean;

  @Input('light')
  set light(val: boolean) { this.configs.light = true; }

  @Input('centered-ripple')
  set centered(val: boolean) { this.configs.centered = true; }

  @Input('fixed-ripple')
  set fixed(val: boolean) { this.configs.fixed = true; }

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

  @Output() rtap: EventEmitter<any> = new EventEmitter();
  @Output() rpress: EventEmitter<any> = new EventEmitter();
  @Output() rpressup: EventEmitter<any> = new EventEmitter();
  @Output() rclick: EventEmitter<any> = new EventEmitter();

  constructor(
    private elRef: ElementRef,
    public cfr: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    public renderer: Renderer2,
    private ngZone: NgZone,
    @Optional() @Inject(GLOBAL_RIPPLE_CONFIGS) customConfigs: RippleConfigs
  ) {
    this.element = this.elRef.nativeElement;
    this.configs = { ...DEFAULT_RIPPLE_CONFIGS, ...customConfigs };
  }

  ngAfterViewInit() {
    this.ripple = new Ripple(
      this.element,
      this.cfr,
      this.appRef ,
      this.configs,
      this.emitters
    );

    this.eventHandler = new RippleEventHandler(
      this.ripple,
      this.emitters,
      this.ngZone
    );
  }

  ngOnDestroy() {
    this.ripple.onDestroy();
    this.eventHandler.onDestroy();
  }

  get emitters(): RippleEmitters {
    return {
      rtap: this.rtap,
      rpress: this.rpress,
      rpressup: this.rpressup,
      rclick: this.rclick
    };
  }
}
