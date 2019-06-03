import {
  AfterViewInit,
  Directive,
  ElementRef,
  Inject,
  OnDestroy,
  Optional
} from '@angular/core';

import { RippleConfigs, RIPPLE_CUSTOM_CONFIGS } from './ripple.configs';
import { RippleEffect } from './ripple.effect';
import { RippleFactory } from './ripple.factory';

@Directive({
  selector: '[ripple]'
})
export class RippleDirective extends RippleEffect implements AfterViewInit, OnDestroy {

  constructor(
    elRef: ElementRef,
    rippleFactory: RippleFactory,
    @Optional() @Inject(RIPPLE_CUSTOM_CONFIGS) public customConfigs: RippleConfigs
  ) {
    super(elRef, rippleFactory, customConfigs);
  }

  ngAfterViewInit() {
    super.initialize();
    super.subscribe();
  }

  ngOnDestroy() {
    super.destroy();
  }
}
