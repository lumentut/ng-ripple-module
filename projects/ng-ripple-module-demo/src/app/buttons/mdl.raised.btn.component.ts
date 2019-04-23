import { Component, ViewChild } from '@angular/core';
import { RippleDirective } from '@ng-ripple-module/ripple.directive';
import { RippleConfigs, GLOBAL_RIPPLE_CONFIGS } from '@ng-ripple-module/ripple.configs';

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
export class MdlRaisedBtnComponent {

  @ViewChild(RippleDirective) rippleDirective: RippleDirective;

  constructor(){
    console.log(this)
  }
}