/**
 * @license
 * Copyright (c) 2018 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';
import { RippleDirective } from './ripple.directive';
import { RippleComponent } from './ripple.component';
import { BackgroundComponent } from './ripple-bg.component';

@NgModule({
  entryComponents: [
    RippleComponent,
    BackgroundComponent
  ],
  declarations: [
    RippleComponent,
    BackgroundComponent,
    RippleDirective
  ],
  providers: [],
  imports: [],
  exports: [
    RippleComponent,
    BackgroundComponent,
    RippleDirective
  ]
})
export class NgRippleModule {}