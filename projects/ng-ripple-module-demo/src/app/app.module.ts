import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgRippleModule } from '../../../ng-ripple-module/src/lib/ng-ripple.module';
import { RippleConfigs, GLOBAL_RIPPLE_CONFIGS } from '../../../ng-ripple-module/src/lib/ripple.configs';

import { AppComponent } from './app.component';
import { MdlFlatBtnComponent } from './buttons/mdl.flat.btn.component';
import { MdlRaisedBtnComponent } from './buttons/mdl.raised.btn.component';
import { CardMdlightComponent } from './cards/mdlight/card-mdlight.component';
import { MdlColoredBtnComponent } from './buttons/mdl.colored.btn.component';

const configs: RippleConfigs = {
  rippleDefaultBgColor: 'rgba(0,0,0,0.05)',
  activeDefaultBgColor: 'rgba(0,0,0,0.02)',
  rippleLightBgColor: 'rgba(255,255,255, 0.2)',
  splashOpacity: 0.2
};

@NgModule({
  declarations: [
    AppComponent,
    MdlFlatBtnComponent,
    MdlRaisedBtnComponent,
    MdlColoredBtnComponent,
    CardMdlightComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgRippleModule
  ],
  providers: [
    {provide: GLOBAL_RIPPLE_CONFIGS, useValue: configs}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
