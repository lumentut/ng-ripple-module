import { Component } from '@angular/core';
import { RippleConfigs, RIPPLE_CUSTOM_CONFIGS } from '@ng-ripple-module/ripple.configs';

const configs: RippleConfigs = {
  backgroundColor: 'rgba(0,0,0,0.05)',
  splashOpacity: 0.8
};

@Component({
  selector: 'mdl-flat-btn',
  template: `
    <button ripple class="mdl-button"
      navlink="https://github.com/yohaneslumentut/ng-ripple-module"
      (rtap)="onClick($event)"
      (rclick)="onClick($event)">
      <img src="assets/GitHub-Mark-32px.png"> GitHub
      <ng-content></ng-content>
    </button>`,
  styles: [
    `:host img {
      width: 20px;
    }`,
    `:host button {
      text-transform: none;
      font-size: 12px;
    }`
  ],
  providers: [
    {provide: RIPPLE_CUSTOM_CONFIGS, useValue: configs}
  ]
})
export class MdlFlatBtnComponent {
  onClick(event: any) {
    window.location.href = event.navLink;
  }
}
