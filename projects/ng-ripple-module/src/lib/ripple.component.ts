import { ElementRef, Component } from '@angular/core';

import { RippleHost } from './ripple.host';

export enum RippleState {
  MOUNTED = 'mounted',
  DISMOUNTED = 'dismounted'
}

@Component({})
export class RippleComponent {

  element: HTMLElement;
  parentElement: HTMLElement;
  state: RippleState;
  fadeinPlayer: any;
  fadeoutPlayer: any;

  constructor(
    private elRef: ElementRef,
    public host: RippleHost
  ) {
    this.element = this.elRef.nativeElement;
    this.parentElement = this.element.parentNode as HTMLElement;
  }
}
