/**
 * @license
 * Copyright (c) 2019 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import { Coordinate } from './ripple';

export function centerCoordinate(rect: ClientRect): Coordinate {
  return {
    x: rect.left + (rect.width/2),
    y: rect.top + (rect.height/2),
  };
}

export class RippleHost {

  rect: ClientRect;
  style: CSSStyleDeclaration;
  diameter: number;
  isRound: boolean;
  radiusSquare: number;

  constructor(public element: HTMLElement) {
    this.rect = this.element.getBoundingClientRect();
    this.style = getComputedStyle(this.element);
    this.isRound = this.getIsRound();
    this.diameter = this.getCalculatedDiagonal();
    this.radiusSquare = this.radius*this.radius;
  }

  private getCalculatedDiagonal(): number {
    return Math.sqrt(this.rect.width*this.rect.width + this.rect.height*this.rect.height);
  }

  private getIsRound(): boolean {
    return this.style.borderRadius === '50%';
  }

  get center(): Coordinate {
    const rect = this.element.getBoundingClientRect();
    return centerCoordinate(rect);
  }

  get radius(): number {
    return this.rect.width/2;
  }

  get marginRef() {
    if(this.isRound) {
      return {top: 0, left: 0};
    }
    return {
      top: (this.rect.height - this.diameter)/2,
      left: (this.rect.width - this.diameter)/2
    };
  }
}
