/**
 * @license
 * Copyright (c) 2019 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import { Coordinate } from './ripple';

export class RippleHost {

  rect: ClientRect;
  style: CSSStyleDeclaration;
  radiusSquare: number;

  constructor(public element: HTMLElement) {
    this.computeRectAndStyle();
  }

  computeRectAndStyle() {
    this.rect = this.element.getBoundingClientRect();
    this.radiusSquare = this.radius*this.radius;
    this.style = getComputedStyle(this.element);
  }

  get diameter(): number {
    const rect = this.rect;
    return Math.sqrt(rect.width*rect.width + rect.height*rect.height);
  }

  get isRound(): boolean {
    const rect = this.rect;
    return this.style.borderRadius === '50%' && rect.width === rect.height;
  }

  get center(): Coordinate {
    const rect = this.rect;
    return {
      x: rect.left + (rect.width/2),
      y: rect.top + (rect.height/2),
    };
  }

  get radius(): number {
    return this.rect.width/2;
  }

  get marginRef() {
    return {
      top: (this.rect.height - this.diameter)/2,
      left: (this.rect.width - this.diameter)/2
    };
  }
}
