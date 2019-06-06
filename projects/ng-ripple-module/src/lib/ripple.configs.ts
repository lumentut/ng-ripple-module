/**
 * @license
 * Copyright (c) 2018 Yohanes Oktavianus Lumentut All Rights Reserved.
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
  RIPPLE_TAP_LIMIT
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
  splashOpacity: 1,
  tapLimit: RIPPLE_TAP_LIMIT
};

export const GLOBAL_RIPPLE_CONFIGS = new InjectionToken<RippleConfigs>('global-ripple-configs');
