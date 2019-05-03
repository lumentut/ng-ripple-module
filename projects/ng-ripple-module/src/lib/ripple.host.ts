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
  center: Coordinate;
  radius: number;
  radiusSquare: number;
  borderRadius: string;
  diameter: number;
  marginRef: any;

  constructor(public element: HTMLElement) {
    this.borderRadius = getComputedStyle(this.element).borderRadius;
    this.calculateProperties();
  }

  calculateProperties() {
    this.rect = this.element.getBoundingClientRect();
    this.radius = this.getRadius();
    this.radiusSquare = this.radius*this.radius;
    this.diameter = this.getDiameter();
    this.center = this.getCenter();
    this.marginRef = this.getMarginRef();
  }

  getDiameter(): number {
    const rect = this.rect;
    return Math.sqrt(rect.width*rect.width + rect.height*rect.height);
  }

  get isRound(): boolean {
    const rect = this.rect;
    return this.borderRadius === '50%' && rect.width === rect.height;
  }

  getCenter(): Coordinate {
    const rect = this.rect;
    return {
      x: rect.left + (rect.width/2),
      y: rect.top + (rect.height/2),
    };
  }

  getRadius(): number {
    return this.rect.width/2;
  }

  getMarginRef() {
    return {
      top: (this.rect.height - this.diameter)/2,
      left: (this.rect.width - this.diameter)/2
    };
  }
}
