import { NgModule } from '@angular/core';
import { RippleComponent } from './ripple.component';
import { RippleDirective } from './ripple.directive';
import { RippleFactory } from './ripple.factory';
import { RippleListener } from './ripple.listener';

@NgModule({
  entryComponents: [
    RippleComponent
  ],
  declarations: [
    RippleComponent,
    RippleDirective
  ],
  imports: [
  ],
  exports: [
    RippleComponent,
    RippleDirective
  ],
  providers: [RippleFactory, RippleListener]
})
export class NgRippleModule { }
