/**
 * @license
 * Copyright (c) 2019 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import { Coordinate } from './ripple';
import { Subject } from 'rxjs';

export class RippleHost {

  rect: ClientRect;
  center: Coordinate;
  width: number;
  height: number;
  top: number;
  left: number;
  radius: number;
  radiusSquare: number;
  borderRadius: string;
  diameter: number;
  marginRef: any;
  onResize: Subject<any> = new Subject();

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
    this.onResize.next();
  }

  getDiameter(): number {
    return Math.hypot(this.rect.width, this.rect.height);
  }

  get isRound(): boolean {
    return this.borderRadius === '50%' && this.rect.width === this.rect.height;
  }

  getCenter(): Coordinate {
    return {
      x: this.rect.left + (0.5*this.rect.width),
      y: this.rect.top + (0.5*this.rect.height),
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
