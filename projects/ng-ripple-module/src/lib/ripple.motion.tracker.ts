/**
 * @license
 * Copyright (c) 2018 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import {
  pointer,
  capitalize
} from './ripple.event.handler';

export enum PointerActionTypes {
  DOWN = 'Down',
  MOVE = 'Move',
  UP = 'Up'
}

export const MOTION_TRACKER_COMMON_PROPS = [
  'TimeStamp',
  'ClientX',
  'ClientY',
  'Type'
];

export class RippleMotionTracker {

  pointerDownTimeStamp: number;
  pointerDownClientX: number;
  pointerDownClientY: number;
  pointerDownType: string;

  pointerMoveTimeStamp: number;
  pointerMoveClientX: number;
  pointerMoveClientY: number;
  pointerMoveType: string;

  pointerUpTimeStamp: number;
  pointerUpClientX: number;
  pointerUpClientY: number;
  pointerUpType: string;

  constructor() {}

  track(event: TouchEvent | MouseEvent) {

    const pointerEvent = pointer(event);
    const type = pointerEvent.type;

    let pointerType: string;

    if(/start|down/i.test(type)) pointerType = PointerActionTypes.DOWN;
    if(/move/i.test(type)) pointerType = PointerActionTypes.MOVE;
    if(/end|up/i.test(type)) pointerType = PointerActionTypes.UP;

    for(const key of Object.keys(pointerEvent)) {
      if(pointerEvent[key]) {
        this[`pointer${pointerType}${capitalize(key)}`] = pointerEvent[key];
      }
    }
  }

  reset(): this {
    const types = [PointerActionTypes.DOWN, PointerActionTypes.MOVE, PointerActionTypes.UP];
    types.forEach(type => {
      MOTION_TRACKER_COMMON_PROPS.forEach(prop => {
        this[`pointer${type}${prop}`] = undefined;
      });
    });
    return this;
  }

  get duration(): number {
    return this.pointerUpTimeStamp - this.pointerDownTimeStamp;
  }

  get velocityX(): number {
    const deltaX = this.pointerMoveClientX - this.pointerDownClientX;
    const deltaT = this.pointerMoveTimeStamp - this.pointerDownTimeStamp;
    return Math.abs((deltaX/deltaT)*100);
  }

  get velocityY(): number {
    const deltaY = this.pointerMoveClientY - this.pointerDownClientY;
    const deltaT = this.pointerMoveTimeStamp - this.pointerDownTimeStamp;
    return Math.abs((deltaY/deltaT)*100);
  }

  get velocity(): number {
    return (this.velocityX + this.velocityY)/2;
  }
}
