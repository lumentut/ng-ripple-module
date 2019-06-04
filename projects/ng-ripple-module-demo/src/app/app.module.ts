import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgRippleModule } from '@ng-ripple-module/ng-ripple.module';

import { AppComponent } from './app.component';
import { MdlFlatBtnComponent } from './buttons/mdl.flat.btn.component';
import { MdlRaisedBtnComponent } from './buttons/mdl.raised.btn.component';
import { MdlColoredBtnComponent } from './buttons/mdl.colored.btn.component';
import { MdlTitleCardComponent } from './cards/mdl.title.card';

@NgModule({
  declarations: [
    AppComponent,
    MdlColoredBtnComponent,
    MdlFlatBtnComponent,
    MdlRaisedBtnComponent,
    MdlTitleCardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgRippleModule
  ],
  exports: [
    MdlColoredBtnComponent,
    MdlFlatBtnComponent,
    MdlRaisedBtnComponent,
    MdlTitleCardComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
