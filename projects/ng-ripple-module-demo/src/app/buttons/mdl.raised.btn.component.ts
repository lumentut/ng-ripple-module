import { Component } from '@angular/core';
// import { RippleConfigs, GLOBAL_RIPPLE_CONFIGS } from 'ng-ripple-module';
import { RippleConfigs, GLOBAL_RIPPLE_CONFIGS } from '../../../../ng-ripple-module/src/lib/ripple.configs';

const configs: RippleConfigs = {
  rippleDefaultBgColor: 'rgba(0,0,0,0.07)',
  activeDefaultBgColor: 'rgba(0,0,0,0.03)',
  splashOpacity: 0.9
};

@Component({
  selector: 'mdl-raised-btn',
  template: `
    <button ripple class="mdl-button mdl-button--raised">
      <ng-content></ng-content>
    </button>`
  ,
  styles: [
    `:host button {
      font-weight: bold;
      width: 90px;
    }`
  ],
  providers: [
    {provide: GLOBAL_RIPPLE_CONFIGS, useValue: configs}
  ]
})
export class MdlRaisedBtnComponent {}