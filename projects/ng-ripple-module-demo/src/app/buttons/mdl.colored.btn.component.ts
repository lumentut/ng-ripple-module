import { Component } from '@angular/core';
// import { RippleConfigs, GLOBAL_RIPPLE_CONFIGS } from 'ng-ripple-module';
import { RippleConfigs, GLOBAL_RIPPLE_CONFIGS } from '../../../../ng-ripple-module/src/lib/ripple.configs';

const configs: RippleConfigs = {
  rippleLightBgColor: 'rgba(255,255,255, 0.2)',
  splashOpacity: 0.5
};

@Component({
  selector: 'mdl-colored-btn',
  template: `
    <button ripple light class="mdl-button mdl-button--raised">
      <ng-content></ng-content>
    </button>`
  ,
  styles: [
    `:host button {
      background: #4a8bfc;
      color: #fff;
      font-weight: bold;
      width: 90px;
    }`,
    `:host button:hover {
      background: #4a8bfc;
    }`
  ],
  providers: [
    {provide: GLOBAL_RIPPLE_CONFIGS, useValue: configs}
  ]
})
export class MdlColoredBtnComponent {}