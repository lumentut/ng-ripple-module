import { AfterViewInit, Component, ElementRef, HostBinding, Inject, OnDestroy, Optional } from '@angular/core';
import { RippleEffect } from '@ng-ripple-module/ripple.effect';
import { RippleFactory } from '@ng-ripple-module/ripple.factory';
import { RippleConfigs, RIPPLE_CUSTOM_CONFIGS } from '@ng-ripple-module/ripple.configs';

const configs: RippleConfigs = {
  backgroundColor: 'rgba(0,0,0,0.06)'
};

@Component({
  selector: 'mdl-card-title',
  template: `<ng-content></ng-content>`,
  providers: [
    { provide: RIPPLE_CUSTOM_CONFIGS, useValue: configs }
  ]
})
export class MdlTitleCardComponent extends RippleEffect implements AfterViewInit, OnDestroy {

  @HostBinding('class.noselection') noselection = true;
  @HostBinding('class.relative') relative = true;
  @HostBinding('class.mdl-card__title') cardTitle = true;
  @HostBinding('class.mdl-card--expand') cardExpand = true;

  constructor(
    elRef: ElementRef,
    rippleFactory: RippleFactory,
    @Optional() @Inject(RIPPLE_CUSTOM_CONFIGS) customConfigs: RippleConfigs
  ) {
    super(elRef, rippleFactory, customConfigs);
  }

  ngAfterViewInit() {
    this.initialize();
    this.subscribe();
  }

  ngOnDestroy() {
    this.destroy();
  }
}
