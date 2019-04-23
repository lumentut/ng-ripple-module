import { Component, ViewChild } from '@angular/core';
import { RippleDirective } from '@ng-ripple-module/ripple.directive';
import { RippleConfigs, GLOBAL_RIPPLE_CONFIGS } from '@ng-ripple-module/ripple.configs';

const configs: RippleConfigs = {
  rippleLightBgColor: 'rgba(255,255,255, 0.2)',
  splashOpacity: 0.5
};

@Component({
  selector: 'mdl-colored-btn',
  template: `
    <button ripple light class="mdl-button mdl-button--raised mdl-button--accent">
      Button
    </button>`
  ,
  styles: [
    `:host button {
      color: #fff;
      font-weight: bold;
      width: 90px;
    }`
  ],
  providers: [
    {provide: GLOBAL_RIPPLE_CONFIGS, useValue: configs}
  ]
})
export class MdlColoredBtnComponent {
  
  @ViewChild(RippleDirective) rippleDirective: RippleDirective;

  constructor(){
    console.log(this)
  }
}