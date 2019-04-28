import { ElementRef, Component } from '@angular/core';
import { AnimationPlayer } from '@angular/animations';
import { RippleHost } from './ripple.host';

@Component({
  template: `<ng-content></ng-content>`
})
export class RippleComponent {

  element: HTMLElement;
  animationPlayer: AnimationPlayer;

  constructor(
    private elRef: ElementRef,
    public host: RippleHost
  ) {
    this.element = this.elRef.nativeElement;
  }
}
