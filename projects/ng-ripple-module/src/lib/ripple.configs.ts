/**
 * @license
 * Copyright (c) 2019 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import {
  InjectionToken
} from '@angular/core';

import {
  RIPPLE_DEFAULT_BGCOLOR,
  RIPPLE_DEFAULT_ACTIVE_BGCOLOR,
  RIPPLE_LIGHT_BGCOLOR,
  RIPPLE_LIGHT_ACTIVE_BGCOLOR,
  RIPPLE_FILL_TRANSITION,
  RIPPLE_SPLASH_TRANSITION,
  RIPPLE_FADE_TRANSITION,
  RIPPLE_BG_FADE_TRANSITION,
  RIPPLE_TAP_LIMIT,
  RIPPLE_ACTIVE_CLASS,
  RIPPLE_EVENT_DELAY_VALUE,
  RIPPLE_SPLASH_OPACITY,
  RIPPLE_DISMOUNTING_TIMEOUT
} from './ripple.constants';

export interface RippleCoreConfigs {
  centered: boolean;
  fixed: boolean;
  rippleBgColor: string;
  fillTransition: string;
  splashTransition: string;
  fadeTransition: string;
  splashOpacity: number;
  tapLimit: number;
  activeClass: string;
  backgroundIncluded: boolean;
}

export const RIPPLE_CORE_CONFIGS = new InjectionToken<RippleCoreConfigs>('ripple-core-configs');

export interface RippleBgConfigs {
  backgroundColor: string;
  fadeTransition: string;
}

export const RIPPLE_BG_CONFIGS = new InjectionToken<RippleBgConfigs>('ripple-bg-configs');

export interface RippleConfigs {
  fixed?: boolean;
  centered?: boolean;
  light?: boolean;
  rippleDefaultBgColor?: string;
  activeDefaultBgColor?: string;
  rippleLightBgColor?: string;
  activeLightBgColor?: string;
  fillTransition?: string;
  splashTransition?: string;
  fadeTransition?: string;
  bgFadeTransition?: string;
  splashOpacity?: number;
  tapLimit?: number;
  activeClass?: string;
  eventIncluded?: boolean;
  delayEvent?: boolean;
  delayValue?: number;
  backgroundIncluded?: boolean;
  dismountingTimeout?: number;
}

export const DEFAULT_RIPPLE_CONFIGS = {
  fixed: false,
  centered: false,
  light: false,
  rippleDefaultBgColor: RIPPLE_DEFAULT_BGCOLOR,
  activeDefaultBgColor: RIPPLE_DEFAULT_ACTIVE_BGCOLOR,
  rippleLightBgColor: RIPPLE_LIGHT_BGCOLOR,
  activeLightBgColor: RIPPLE_LIGHT_ACTIVE_BGCOLOR,
  fillTransition: RIPPLE_FILL_TRANSITION,
  splashTransition: RIPPLE_SPLASH_TRANSITION,
  fadeTransition: RIPPLE_FADE_TRANSITION,
  bgFadeTransition: RIPPLE_BG_FADE_TRANSITION,
  splashOpacity: RIPPLE_SPLASH_OPACITY,
  tapLimit: RIPPLE_TAP_LIMIT,
  activeClass: RIPPLE_ACTIVE_CLASS,
  eventIncluded: true,
  delayEvent: true,
  delayValue: RIPPLE_EVENT_DELAY_VALUE,
  backgroundIncluded: true,
  dismountingTimeout: RIPPLE_DISMOUNTING_TIMEOUT
};

export const GLOBAL_RIPPLE_CONFIGS = new InjectionToken<RippleConfigs>('global-ripple-configs');

export function getDuration(transition: string) {
  const ms = transition.replace(/ .*/, '');
  return {
    millis: ms,
    duration: ms.match(/\d+/g).map(Number)[0]
  };
}

export class RippleComponentConfigs {

  constructor(public base: RippleConfigs) {}

  get coreColor(): string {
    return this.base.light ? this.base.rippleLightBgColor : this.base.rippleDefaultBgColor;
  }

  get rippleCore(): RippleCoreConfigs {
    return {
      centered: this.base.centered,
      fixed: this.base.fixed,
      rippleBgColor: this.coreColor,
      fillTransition: this.base.fillTransition,
      splashTransition: this.base.splashTransition,
      fadeTransition: this.base.fadeTransition,
      splashOpacity: this.base.splashOpacity,
      tapLimit: this.base.tapLimit,
      activeClass: this.base.activeClass,
      backgroundIncluded: this.base.backgroundIncluded
    };
  }

  get backgroundColor(): string {
    return this.base.light ? this.base.activeLightBgColor : this.base.activeDefaultBgColor;
  }

  get rippleBackground(): RippleBgConfigs {
    return {
      backgroundColor: this.backgroundColor,
      fadeTransition: this.base.bgFadeTransition
    };
  }

  get isSilent(): boolean {
    return !this.base.eventIncluded;
  }

  private getDuration(transition: string): number {
    return transition.replace(/ .*/, '').match(/\d+/g).map(Number)[0];
  }

  get splashDuration(): number {
    return this.getDuration(this.base.splashTransition);
  }

  get fadeDuration(): number {
    return this.base.backgroundIncluded ? this.getDuration(this.base.fadeTransition) : 0;
  }

  get calculatedDismountTimeout() {
    return (this.splashDuration + this.fadeDuration)*1.5;
  }

  get dismountTimeoutDuration(): number {
    return this.base.dismountingTimeout ? this.base.dismountingTimeout : this.calculatedDismountTimeout;
  }
}
