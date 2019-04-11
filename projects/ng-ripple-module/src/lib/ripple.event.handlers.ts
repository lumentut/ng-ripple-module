import { NgZone, EventEmitter, Injectable, OnDestroy } from '@angular/core';

export interface RippleEmitters {
  rtap: EventEmitter<any>;
  rpress: EventEmitter<any>;
  rpressup: EventEmitter<any>;
  rclick: EventEmitter<any>;
}

export enum Events {
  TAP = 'rtap',
  PRESS = 'rpress',
  PRESSUP = 'rpressup',
  CLICK = 'rclick'
}

export enum MobileActionTypes {
  TOUCHMOVE = 'touchmove',
  TOUCHEND = 'touchend'
}

export enum DesktopActionTypes {
  MOUSEMOVE = 'mousemove',
  MOUSEUP = 'mouseup',
  MOUSELEAVE = 'mouseleave'
}

export enum PointerDownAction {
  MOBILE = 'touchstart',
  DESKTOP = 'mousedown'
}

export const ACTIVATED_CLASS = 'activated';

export interface PointerEvent {
  clientX: number;
  clientY: number;
  timeStamp: number;
  type: 'touchstart' | 'touchmove' | 'touchend' | 'mousedown' | 'mousemove' | 'mouseup' | 'mouseleave';
}

export function pointer(event: any): PointerEvent {
  const ev = event.changedTouches ? event.changedTouches[0] : event;
  return {
    clientX: ev.clientX,
    clientY: ev.clientY,
    timeStamp: event.timeStamp,
    type: event.type
  };
}

export function mobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function capitalize(val: string): string {
  return val.charAt(0).toUpperCase() + val.slice(1);
}

export const eventHandlers = {
  mouse: {
    onmousemove: 'onPointerMove',
    onmouseup: 'onPointerUp',
    onmouseleave: 'onPointerLeave'
  },
  touch: {
    ontouchmove: 'onPointerMove',
    ontouchend: 'onPointerUp'
  }
}

@Injectable()
export class RippleEventHandler implements OnDestroy {

  element: HTMLElement;
  pointerType: 'mouse' | 'touch';

  handlers: any;

  constructor(
    private ngZone: NgZone
  ) {}

  ngOnDestroy() {
    this.stopListenToPointerDown();
  }

  loadElement(element: HTMLElement) {
    this.element = element;
    this.listenToPointerDown()
  }

  private listenToPointerDown() {
    this.ngZone.runOutsideAngular(() => {
      this.element.addEventListener('pointerdown', this.onPointerDown, false);
    });
  }

  private stopListenToPointerDown() {
    this.ngZone.runOutsideAngular(() => {
      this.element.removeEventListener('pointerdown', this.onPointerDown);
    })
  }

  get mouseHandler(): any {
    return {
      onmousemove: this.onPointerMove,
      onmouseup: this.onPointerUp,
      onmouseleave: this.onPointerLeave
    };
  }

  get touchHandler(): any {
    return {
      ontouchmove: this.onPointerMove,
      ontouchend: this.onPointerUp
    }
  }

  private addListeners = () => {
    // this.handlers = eventHandlers[this.pointerType];
    let handlers = this.mouseHandler;
    for (let action in handlers) {
      console.log(action)
      // this.ngZone.runOutsideAngular(() => {
      //   this.element.addEventListener(action, this[eventHandlers[this.pointerType][action]], false);
      // });
    }
  }

  private removeListeners() {
    for (let action in this.handlers) {
      this.ngZone.runOutsideAngular(() => {
        this.element.removeEventListener(action, this[eventHandlers[this.pointerType][action]]);
      })
    }
  }

  private onPointerDown = (event: any) => {
    this.pointerType = event.pointerType;
    this.addListeners();
  }

  private onPointerMove = (event: TouchEvent | MouseEvent) => {
    console.log(event)
  }

  private onPointerUp = (event: TouchEvent | MouseEvent) => {
    this.removeListeners();
  }

  private onPointerLeave = (event: MouseEvent) => {
    
  }
}