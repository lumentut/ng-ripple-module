/**
 * @license
 * Copyright (c) 2019 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';
import { RippleDirective } from './ripple.directive';
import { RippleComponent } from './ripple.component';
import { CoreComponent } from './ripple-core.component';
import { BackgroundComponent } from './ripple-bg.component';

@NgModule({
  entryComponents: [
    RippleComponent,
    CoreComponent,
    BackgroundComponent
  ],
  declarations: [
    RippleComponent,
    CoreComponent,
    BackgroundComponent,
    RippleDirective
  ],
  providers: [],
  imports: [],
  exports: [
    RippleComponent,
    CoreComponent,
    BackgroundComponent,
    RippleDirective
  ]
})
export class NgRippleModule {}
