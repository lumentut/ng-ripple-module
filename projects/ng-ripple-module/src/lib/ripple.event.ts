/**
 * @license
 * Copyright (c) 2018 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import { Coordinate } from './ripple.component';

export class RippleEvent {

  target: HTMLElement;
  type: string;
  timestamp: number;
  clientX: number;
  clientY: number;
  clientRect: ClientRect;
  navLink: string;

  constructor(
    element: HTMLElement,
    coordinate: Coordinate,
    eventType: string
  ) {
    this.target= element;
    this.type = eventType;
    this.timestamp = (new Date()).getTime();
    this.clientX = coordinate.x;
    this.clientY = coordinate.y;
    this.clientRect = element.getBoundingClientRect();
    this.navLink = element.getAttribute('navlink');
  }
}
