/**
 * @license
 * Copyright (c) 2018 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import {
  Directive,
  OnInit,
  AfterViewInit,
  OnDestroy,
  NgZone,
  HostBinding,
  ElementRef,
  ChangeDetectorRef,
  ComponentFactoryResolver,
  ApplicationRef,
  ComponentRef,
  Injector,
  Input,
  Output,
  Inject,
  InjectionToken,
  Optional,
  EventEmitter
} from '@angular/core';

import {
  RippleConfigs,
  RippleCoreConfigs,
  RippleBgConfigs,
  GLOBAL_RIPPLE_CONFIGS,
  DEFAULT_RIPPLE_CONFIGS,
  RIPPLE_CORE_CONFIGS,
  RIPPLE_BG_CONFIGS
} from './ripple.configs';

import {
  RippleColor,
  RippleComponent
} from './ripple.component';

import {
  BackgroundComponent
} from './ripple-bg.component';

import {
  RippleEmitters,
  RippleEventHandler
} from './ripple.event.handler';

import {
  RippleMotionTracker
} from './ripple.motion.tracker';

import {
  RippleTransition
} from './ripple.animation';


export enum RippleCmpRefs {
  RIPPLE = 'rippleCmpRef',
  BACKGROUND = 'backgroundCmpRef'
}

export function enforceStyleRecalculation(element: HTMLElement) {
  window.getComputedStyle(element).getPropertyValue('opacity');
}

@Directive({ selector: '[ripple]' })
export class RippleDirective implements AfterViewInit, OnDestroy {

  element: HTMLElement;
  rippleCmpRef: ComponentRef<any>;
  backgroundCmpRef: ComponentRef<any>;
  eventHandler: RippleEventHandler;
  configs: RippleConfigs;

  private _children: any[];
  private _eventHandler: RippleEventHandler;
  private _motionTracker: RippleMotionTracker;

  @HostBinding('style.display') display: string = 'block';
  @HostBinding('style.overflow') overflow: string = 'hidden';
  @HostBinding('style.cursor') cursor: string = 'pointer';
  @HostBinding('class.activated') activated: boolean;
  @HostBinding('style.width') width: string;

  @Input()
  set light(val: boolean) { this.configs.light = true; }

  @Input('centered-ripple')
  set centered(val: boolean) { this._centered = true; }
  private _centered: boolean;

  @Input('fixed-ripple')
  set fixed(val: boolean) { this._fixed = true; }
  private _fixed: boolean;

  @Input('rippleBgColor')
  set rippleColor(color: string) { this._rippleBgColor = color; }
  private _rippleBgColor: string;

  @Input('activeBgColor')
  set activeBgColor(color: string) { this._activeBgColor = color; }
  private _activeBgColor: string;

  @Input('fillTransition')
  set fillTransition(value: string) { this._fillTransition = value; }
  private _fillTransition: string;

  @Input('splashTransition')
  set splashTransition(value: string) { this._splashTransition = value; }
  private _splashTransition: string;

  @Input('fadeTransition')
  set fadeTransition(value: string) { this._fadeTransition = value; }
  private _fadeTransition: string;

  @Input('bgFadeTransition')
  set bgFadeTransition(value: string) { this._bgFadeTransition = value; }
  private _bgFadeTransition: string;

  @Input('tapLimit')
  set tapLimit(value: number) { this._tapLimit = value; }
  private _tapLimit: number;

  @Input('splashOpacity')
  set splashOpacity(value: number) { this._splashOpacity = value; }
  private _splashOpacity: number;

  @Output() rtap: EventEmitter<any> = new EventEmitter();
  @Output() rpress: EventEmitter<any> = new EventEmitter();
  @Output() rpressup: EventEmitter<any> = new EventEmitter();
  @Output() rclick: EventEmitter<any> = new EventEmitter();

  constructor(
    private elRef: ElementRef,
    public cfr: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private ngZone: NgZone,
    @Optional() @Inject(GLOBAL_RIPPLE_CONFIGS) customConfigs: RippleConfigs
  ) {
    this.element = this.elRef.nativeElement;
    this.configs = { ...DEFAULT_RIPPLE_CONFIGS, ...customConfigs };
  }

  ngAfterViewInit() {
    this.appendChildren([this.background.element, this.ripple.element]);
    this.background.eventTrigger.subscribe(() => this.eventHandler.emitCurrentEvent);
    this.eventHandler = this.rippleEventHandler;
    this.recalculateStyle();
  }

  ngOnDestroy() {
    this.rippleCmpRef.destroy();
    this.background.prepareToBeDestroyed();
    this.background.eventTrigger.unsubscribe();
    this.backgroundCmpRef.destroy();
    this.eventHandler.removePointerDownListener();
  }

  rerunChangesDetection() {
    this.rippleCmpRef.changeDetectorRef.detectChanges();
    this.backgroundCmpRef.changeDetectorRef.detectChanges();
  }

  private appendChildren(elements: any[]) {
    this._children = elements;
    this._children.forEach(element => this.element.appendChild(element));
    this.rerunChangesDetection();
  }

  get _rippleColor(): string {
    return this.configs.light ? this.configs.rippleLightBgColor : this.configs.rippleDefaultBgColor;
  }

  get rippleCoreConfigs(): RippleCoreConfigs {
    return {
      centered: this._centered || this.configs.centered,
      fixed: this._fixed || this.configs.fixed,
      rippleBgColor: this._rippleBgColor || this._rippleColor,
      fillTransition: this._fillTransition || this.configs.fillTransition,
      splashTransition: this._splashTransition || this.configs.splashTransition,
      fadeTransition: this._fadeTransition || this.configs.fadeTransition,
      splashOpacity: this._splashOpacity || this.configs.splashOpacity,
      tapLimit: this._tapLimit || this.configs.tapLimit
    };
  }

  get rippleInjector(): Injector {
    return Injector.create({ providers: [
      { provide: RIPPLE_CORE_CONFIGS, useValue: this.rippleCoreConfigs },
      { provide: BackgroundComponent, useValue: this.background }
    ]});
  }

  get ripple(): RippleComponent {
    if(!this.rippleCmpRef) {
      this.createComponentRef(this.rippleInjector, RippleComponent, RippleCmpRefs.RIPPLE);
    }
    return this.rippleCmpRef.instance;
  }

  get _backgroundColor(): string {
    return this.configs.light ? this.configs.activeLightBgColor : this.configs.activeDefaultBgColor;
  }

  get rippleBgConfigs(): RippleBgConfigs {
    return {
      backgroundColor: this._activeBgColor || this._backgroundColor,
      fadeTransition: this._bgFadeTransition || this.configs.bgFadeTransition
    };
  }

  get backgroundInjector(): Injector {
    return Injector.create({ providers: [{ provide: RIPPLE_BG_CONFIGS, useValue: this.rippleBgConfigs }] });
  }

  get background(): BackgroundComponent {
    if(!this.backgroundCmpRef) {
      this.createComponentRef(this.backgroundInjector, BackgroundComponent, RippleCmpRefs.BACKGROUND);
    }
    return this.backgroundCmpRef.instance;
  }

  private createComponentRef(injector: Injector, Component: any, cmpRefName: string) {
    this[`${cmpRefName}`] = this.cfr.resolveComponentFactory(Component).create(injector);
    this.appRef.attachView(this[`${cmpRefName}`].hostView);
  }

  private recalculateStyle() {
    this._children.forEach(element => enforceStyleRecalculation(element));
  }

  get emitters(): RippleEmitters {
    return {
      rtap: this.rtap,
      rpress: this.rpress,
      rpressup: this.rpressup,
      rclick: this.rclick
    };
  }

  get motionTracker(): RippleMotionTracker {
    if(this._motionTracker) return this._motionTracker;
    return this._motionTracker = new RippleMotionTracker();
  }

  get rippleEventHandler(): RippleEventHandler {
    if(this._eventHandler) return this._eventHandler;
    return this._eventHandler = new RippleEventHandler(
      this.element,
      this.ripple,
      this.emitters,
      this.motionTracker,
      this.ngZone
    );
  }
}
