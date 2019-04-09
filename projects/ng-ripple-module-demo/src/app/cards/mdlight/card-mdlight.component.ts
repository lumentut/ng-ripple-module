import { Component } from '@angular/core';
// import { RippleConfigs, GLOBAL_RIPPLE_CONFIGS } from 'ng-ripple-module';
import { RippleConfigs, GLOBAL_RIPPLE_CONFIGS } from '../../../../../ng-ripple-module/src/lib/ripple.configs';

const configs: RippleConfigs = {
  activeDefaultBgColor: 'rgba(0,0,0,0.02)'
};

@Component({
  selector: 'card-mdlight',
  templateUrl: './card-mdlight.component.html',
  providers: [
    {provide: GLOBAL_RIPPLE_CONFIGS, useValue: configs}
  ]
})
export class CardMdlightComponent {
  title = 'Angular'
}