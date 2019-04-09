import { Component } from '@angular/core';
// import { RippleConfigs, GLOBAL_RIPPLE_CONFIGS } from 'ng-ripple-module';
import { RippleConfigs, GLOBAL_RIPPLE_CONFIGS } from '../../../../ng-ripple-module/src/lib/ripple.configs';

const configs: RippleConfigs = {
  rippleDefaultBgColor: 'rgba(0,0,0,0.05)',
  activeDefaultBgColor: 'rgba(0,0,0,0.07)',
  splashOpacity: 0.9
};

@Component({
  selector: 'mdl-flat-btn',
  template: `
    <button ripple class="mdl-button">
      <ng-content></ng-content>
    </button>`
  ,
  providers: [
    {provide: GLOBAL_RIPPLE_CONFIGS, useValue: configs}
  ]
})
export class MdlFlatBtnComponent {}