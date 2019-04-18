/**
 * @license
 * Copyright (c) 2018 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

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

  type: string;

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

  startTrack(event: PointerEvent) {
    this.type = event.pointerType;
    this.track(PointerActionTypes.DOWN, event);
  }

  trackMove(event: TouchEvent | MouseEvent) {
    this.track(PointerActionTypes.MOVE, event);
  }

  trackUp(event: TouchEvent | MouseEvent) {
    this.track(PointerActionTypes.UP, event);
  }

  private track(action: PointerActionTypes, event: any) {
    
    const pointerEvent = event.changedTouches ? event.changedTouches[0] : event;

    const eventDetails: any = {
      ClientX: pointerEvent.clientX,
      ClientY: pointerEvent.clientY,
      TimeStamp: pointerEvent.timeStamp | event.timeStamp,
      Type: pointerEvent.type | event.type | event.pointerType
    };

    for(let key of Object.keys(eventDetails)) {
      if(eventDetails[key]) {
        this[`pointer${action}${key}`] = eventDetails[key];
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

  log(): string {
    return `duration: ${this.duration}\nvelocity: ${this.avgMovementVelocity}\ntype: ${this.type}`;
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

  get avgMovementVelocity(): number {
    return (this.velocityX + this.velocityY)/2;
  }
}
