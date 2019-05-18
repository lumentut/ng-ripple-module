/**
 * @license
 * Copyright (c) 2019 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import { DEFAULT_RIPPLE_CONFIGS, RippleConfigs } from './ripple.configs';
import { Ripple } from './ripple';

const RIPPLE_ATTRIBUTES = ['light', 'centered-ripple', 'fixed-ripple'];
const RIPPLE_INPUTS = [
  'rippleBgColor', 'activeBgColor', 'fillTransition',
  'splashTransition', 'fadeTransition', 'bgFadeTransition',
  'tapLimit', 'splashOpacity', 'activeClass'
];

export function RippleEffect() {
  return function _RippleEffect<T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {

      public configs: RippleConfigs;
      public element: HTMLElement;
      public ripple: Ripple;
      public trigger: string = 'onpointerdown' in window ? 'pointerdown' : 'fallback';

      public applyToOriginalMethod(context: any, args: any, name: string) {
        const method = constructor.prototype[name];
        if (method && typeof method === 'function') {
          method.apply(context, args);
        }
      }

      public validateDependencies() {
        const elRef = this['elRef'], ripple = this['ripple'];
        if(!elRef || !ripple) {
          throw new Error(`${constructor.name} is depends on elRef: ElementRef, ripple: Ripple`);
        }
      }

      public get attributesAndInputConfigs() {
        const INPUT_KEYS = {}, configs = {};
        RIPPLE_INPUTS.forEach(input => INPUT_KEYS[input.toLowerCase()] = input);
        Array.prototype.slice.call(this.element.attributes).forEach(function(attr: any) {
          if (RIPPLE_ATTRIBUTES.includes(attr.name)) { 
            configs[attr.name.split('-')[0]] = true;
          } else if (attr.name in INPUT_KEYS) {
            configs[INPUT_KEYS[attr.name]] = Number(attr.value) || attr.value;
          } else if (attr.name === 'immediate-event') {
            configs['delayEvent'] = false;
          }
        });
        return configs;
      }

      public ngAfterViewInit() {
        this.validateDependencies();
        this.element = this['elRef'].nativeElement;
        this.configs = { ...DEFAULT_RIPPLE_CONFIGS, ...this.configs, ...this.attributesAndInputConfigs };
        this.ripple.initialize(this.element, this.configs);
        this.applyToOriginalMethod(this, arguments, 'ngAfterViewInit');
      }

      public ngOnDestroy() {
        this.ripple.destroy();
        this.applyToOriginalMethod(this, arguments, 'ngOnDestroy');
      }
    }
  }
}