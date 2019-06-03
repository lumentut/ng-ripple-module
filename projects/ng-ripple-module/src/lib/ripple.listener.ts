import { Injectable } from '@angular/core';
import { RippleEvent, RipplePublisher } from './ripple.event';

export type Listener = [string, (event: TouchEvent | MouseEvent) => any];

@Injectable()
export class RippleListener {
  invoke(action: string, element: HTMLElement, listeners: Listener[]) {
    listeners.forEach(listener => {
      const event = listener[0]; const handler = listener[1];
      element[action](event, handler);
    });
  }

  startListening(element: HTMLElement, listeners: Listener[]) {
    this.invoke('addEventListener', element, listeners);
  }

  stopListening(element: HTMLElement, listeners: Listener[]) {
    this.invoke('removeEventListener', element, listeners);
  }
}

export enum Events {
  TAP = 'rtap',
  PRESS = 'rpress',
  PRESSUP = 'rpressup',
  CLICK = 'rclick'
}

export class MouseListener {

  event: (event: Events) => RippleEvent;
  onEnd: (event: MouseEvent) => any;
  onMove: (event: MouseEvent) => any;
  publisher: RipplePublisher;

  constructor(context: any) {
    const { publisher, hostElement, listener } = context;
    this.event = context.event;
    this.onEnd = context.onPointerEnd;
    this.onMove = context.onPointerMove;
    this.publisher = publisher;
    listener.startListening(hostElement, this.listeners);
  }

  get listeners(): Listener[] {
    return [
      ['mousemove', this.onMouseMove],
      ['mouseup', this.onMouseUp],
      ['mouseleave', this.onMouseLeave]
    ];
  }

  onMouseMove = (event: MouseEvent) => {
    this.onMove(event);
  }

  onMouseUp = (event: MouseEvent) => {
    const clickEvent = this.event(Events.CLICK);
    this.publisher.dispatch(clickEvent);
    this.onEnd(event);
  }

  onMouseLeave = (event: MouseEvent) => {
    this.onEnd(event);
  }
}

export class TouchListener {

  event: (event: Events) => RippleEvent;
  isPressing: boolean;
  onEnd: (event: TouchEvent) => any;
  onMove: (event: TouchEvent) => any;
  pressTimeout: any;
  publisher: RipplePublisher;
  tapLimit: number;

  constructor(context: any) {
    const { configs, publisher, hostElement, listener } = context;
    this.event = context.event;
    this.onEnd = context.onPointerEnd;
    this.onMove = context.onPointerMove;
    this.publisher = publisher;
    this.tapLimit = configs.tapLimit;
    this.setPressTimeout();
    listener.startListening(hostElement, this.listeners);
  }

  get listeners(): Listener[] {
    return [
      ['touchmove', this.onTouchMove],
      ['touchend', this.onTouchEnd]
    ];
  }

  setPressTimeout() {
    clearTimeout(this.pressTimeout);
    this.pressTimeout = setTimeout(() => {
      const pressEvent = this.event(Events.PRESS);
      this.publisher.dispatch(pressEvent);
      this.isPressing = true;
    }, this.tapLimit);
  }

  onTouchMove = (event: TouchEvent) => {
    this.onMove(event);
  }

  get touchendEvent() {
    return this.isPressing ? Events.PRESSUP : Events.TAP;
  }

  onTouchEnd = (event: TouchEvent) => {
    clearTimeout(this.pressTimeout);
    const pressupEvent = this.event(this.touchendEvent);
    this.publisher.dispatch(pressupEvent);
    this.onEnd(event);
  }
}

export const POINTER_LISTENER: any  = {
  mouse: MouseListener,
  touch: TouchListener
};

export class PointerListener {
  listeners: Listener[];
  constructor(context: any) {
    return new POINTER_LISTENER[context.contact.input](context);
  }
}
