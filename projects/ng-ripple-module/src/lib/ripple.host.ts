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
    const rect = this.element.getBoundingClientRect();
    const { width, height, top, left } = rect;

    if(this.rect && width === this.rect.width && height === this.rect.height &&
      top === this.rect.top && left === this.rect.left) {
      return;
    }

    this.rect = rect;
    this.radius = this.getRadius();
    this.radiusSquare = this.radius*this.radius;
    this.diameter = this.getDiameter();
    this.center = this.getCenter();
    this.marginRef = this.getMarginRef();
  }

  getDiameter(): number {
    return Math.hypot(this.rect.width, this.rect.height);
  }

  get isRound(): boolean {
    const rect = this.rect;
    return this.borderRadius === '50%' && rect.width === rect.height;
  }

  getCenter(): Coordinate {
    const rect = this.rect;
    return {
      x: rect.left + (0.5*rect.width),
      y: rect.top + (0.5*rect.height),
    };
  }

  getRadius(): number {
    return 0.5*this.rect.width;
  }

  getMarginRef() {
    return {
      top: 0.5*(this.rect.height - this.diameter),
      left: 0.5*(this.rect.width - this.diameter)
    };
  }
}
