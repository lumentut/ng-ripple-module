import { AfterViewInit, Component, ElementRef, HostBinding, OnDestroy } from '@angular/core';
import { Ripple } from '@ng-ripple-module/ripple';
import { RippleEffect } from '@ng-ripple-module/ripple.effect';
import { RippleFactory } from '@ng-ripple-module/ripple.factory';

@Component({
  selector: 'mdl-raised-btn',
  template: `<ng-content></ng-content>`,
  styles: [
    `:host {
      color: black;
      font-weight: bold;
    }`
  ]
})
export class MdlRaisedBtnComponent extends RippleEffect implements AfterViewInit, OnDestroy {

  @HostBinding('class.mdl-button') button = true;
  @HostBinding('class.mdl-button--raised') raisedBtn = true;

  ripple: Ripple;

  constructor(
    elRef: ElementRef,
    rippleFactory: RippleFactory
  ) {
    super(elRef, rippleFactory);
  }

  ngAfterViewInit() {
    super.initialize();
    super.subscribe();
  }

  ngOnDestroy() {
    super.destroy();
  }
}
