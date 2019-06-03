import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgRippleModule } from '@ng-ripple-module/ng-ripple.module';

import { AppComponent } from './app.component';
import { MdlFlatBtnComponent } from './buttons/mdl.flat.btn.component';
import { MdlRaisedBtnComponent } from './buttons/mdl.raised.btn.component';
import { MdlColoredBtnComponent } from './buttons/mdl.colored.btn.component';

@NgModule({
  declarations: [
    AppComponent,
    MdlFlatBtnComponent,
    MdlRaisedBtnComponent,
    MdlColoredBtnComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgRippleModule
  ],
  exports: [
    MdlFlatBtnComponent,
    MdlRaisedBtnComponent,
    MdlColoredBtnComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
