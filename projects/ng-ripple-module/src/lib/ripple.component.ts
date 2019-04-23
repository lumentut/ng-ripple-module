import { ElementRef, Component } from '@angular/core';

import { RippleHost } from './ripple.host';

export enum RippleState {
  MOUNTED = 'mounted',
  DISMOUNTED = 'dismounted'
}

@Component({
  template: `<ng-content></ng-content>`
})
export class RippleComponent {

  element: HTMLElement;
  hostElement: HTMLElement;
  state: RippleState;
  fadeinPlayer: any;
  fadeoutPlayer: any;

  constructor(
    private elRef: ElementRef,
    public host: RippleHost
  ) {
    this.element = this.elRef.nativeElement;
    this.hostElement = this.element.parentNode as HTMLElement;
  }
}
