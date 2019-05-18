/**
 * @license
 * Copyright (c) 2019 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import { Ripple, Coordinate } from './ripple';
import { Subject } from 'rxjs';

export class RippleEvent {

  target: HTMLElement;
  type: string;
  timestamp: number;
  clientX: number;
  clientY: number;
  clientRect: ClientRect;
  navLink: string;
  delay: number;

  constructor(
    element: HTMLElement,
    coordinate: Coordinate,
    delay: number,
    type: string
  ) {
    this.target= element;
    this.type = type;
    this.timestamp = (new Date()).getTime();
    this.clientX = coordinate.x;
    this.clientY = coordinate.y;
    this.clientRect = element.getBoundingClientRect();
    this.navLink = element.getAttribute('navlink');
    this.delay = delay;
  }
}

export class RipplePublisher extends Subject<RippleEvent> {

  constructor(private ripple: Ripple) {
    super();
  }

  delay:any = (ms:number) => new Promise(_ => setTimeout(_, ms))

  dispatch(event: RippleEvent) {
    this.delay(event.delay).then(() => this.next(event));
  }

  subscribeEmitter(context: any) {
    this.ripple.subscriptions.add(this.subscribe((event: RippleEvent) => {
      if(!context[event.type]) { return; }
      context[event.type].emit(event);
    }));
  }
}
