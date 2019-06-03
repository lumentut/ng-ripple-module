import { ElementRef, EventEmitter, HostBinding, Input, Output, Optional } from '@angular/core';
import { Ripple } from './ripple';
import { RippleConfigs } from './ripple.configs';
import { RippleFactory } from './ripple.factory';

enum InputConfigs {
  FIXED = 'fixed',
  COLOR = 'backgroundColor',
  OPACITY = 'splashOpacity'
}

export class RippleEffect {

  configs: RippleConfigs;
  inputConfigs = {};
  ripple: Ripple;

  @HostBinding('style.cursor') cursor = 'pointer';
  @HostBinding('style.display') display = 'block';
  @HostBinding('style.overflow') overflow = 'hidden';

  @Output() rclick: EventEmitter<any> = new EventEmitter();
  @Output() rpress: EventEmitter<any> = new EventEmitter();
  @Output() rpressup: EventEmitter<any> = new EventEmitter();
  @Output() rtap: EventEmitter<any> = new EventEmitter();

  @Input('fixed')
  set fixedRipple(val: boolean) {
    this.inputConfigs[InputConfigs.FIXED] = true;
  }

  @Input('rippleColor')
  set rippleColor(val: string) {
    this.inputConfigs[InputConfigs.COLOR] = val;
  }

  @Input('splashOpacity')
  set splashOpacity(val: number) {
    this.inputConfigs[InputConfigs.OPACITY] = val;
  }

  constructor(
    public elRef: ElementRef,
    public rippleFactory: RippleFactory,
    public customConfigs: RippleConfigs = null
  ) {}

  initialize() {
    this.configs = { ...this.customConfigs, ...this.inputConfigs };
    this.ripple = this.rippleFactory.create(
      this.elRef.nativeElement,
      this.configs
    );
  }

  subscribe() {
    this.ripple.subscribeEmitter(this);
  }

  destroy() {
    if (this.ripple) {
      this.ripple.destroy();
    }
  }
}
