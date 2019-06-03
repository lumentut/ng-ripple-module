import { InjectionToken } from '@angular/core';

const RIPPLE_ACTIVE_CLASS = 'activate';
const RIPPLE_DEFAULT_ACTIVE_BGCOLOR =  'rgba(0,0,0,0.05)';
const RIPPLE_DEFAULT_BGCOLOR = 'rgba(0,0,0,0.07)';
const RIPPLE_FADE_TRANSITION = '90ms linear';
const RIPPLE_FILL_TRANSITION = '750ms linear';
const RIPPLE_LIGHT_ACTIVE_BGCOLOR = 'rgba(255,255,255,0.2)';
const RIPPLE_LIGHT_BGCOLOR = 'rgba(255,255,255, 0.25)';
const RIPPLE_SCALE_INCREASER = 0.01;
const RIPPLE_SPLASH_TRANSITION = '150ms cubic-bezier(0.2,0.05,0.2,1)';
const RIPPLE_SPLASH_OPACITY = 0.7;
const RIPPLE_TAP_LIMIT = 600;
const RIPPLE_TO_CENTER_TRANSFORM = 'translate3d(0px, 0px, 0) scale(1)';
const RIPPLE_TRANSLATE_TIMEOUT = 15;

export interface RippleConfigs {
  backgroundColor?: string;
  delayValue?: number;
  fadeTransition?: string;
  fillTransition?: string;
  fixed?: boolean;
  light?: boolean;
  splashTransition?: string;
  splashOpacity?: number;
  tapLimit?: number;
}

export const RIPPLE_CONFIGS: RippleConfigs = {
  backgroundColor: RIPPLE_DEFAULT_BGCOLOR,
  delayValue: 0,
  fadeTransition: RIPPLE_FADE_TRANSITION,
  fillTransition: RIPPLE_FILL_TRANSITION,
  fixed: false,
  light: false,
  splashTransition: RIPPLE_SPLASH_TRANSITION,
  splashOpacity: RIPPLE_SPLASH_OPACITY,
  tapLimit: RIPPLE_TAP_LIMIT,
};

export const RIPPLE_CORE_CONFIGS = new InjectionToken<RippleConfigs>('ripple-core-configs');
export const RIPPLE_CUSTOM_CONFIGS = new InjectionToken<RippleConfigs>('ripple-custom-configs');
export const RIPPLE_GLOBAL_CONFIGS = new InjectionToken<RippleConfigs>('ripple-global-configs');

export {
  RIPPLE_ACTIVE_CLASS,
  RIPPLE_DEFAULT_ACTIVE_BGCOLOR,
  RIPPLE_DEFAULT_BGCOLOR,
  RIPPLE_FADE_TRANSITION,
  RIPPLE_FILL_TRANSITION,
  RIPPLE_LIGHT_ACTIVE_BGCOLOR,
  RIPPLE_LIGHT_BGCOLOR,
  RIPPLE_SCALE_INCREASER,
  RIPPLE_SPLASH_TRANSITION,
  RIPPLE_SPLASH_OPACITY,
  RIPPLE_TAP_LIMIT,
  RIPPLE_TO_CENTER_TRANSFORM,
  RIPPLE_TRANSLATE_TIMEOUT
};
