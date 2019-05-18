/**
 * @license
 * Copyright (c) 2019 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';
import { RippleDirective } from './ripple.directive';
import { CoreComponent } from './ripple-core.component';
import { BackgroundComponent } from './ripple-bg.component';

// import { Subject, Subscription } from 'rxjs';

// const _windowDispatcher = new Subject();
// const _windowResize = evt => _windowDispatcher.next(evt);

// window.addEventListener("resize", _windowResize);

// export function WindowSensor({
//     event = "onWindowResize",
//     destroyer = "ngOnDestroy"
//   } = {}) {
//   return function(constructor) {
//     const subscription = new Subscription();
//     subscription.add(_windowDispatcher.subscribe((evt) => constructor.prototype[event](evt)));
//     const original = constructor.prototype[destroyer];
//     constructor.prototype[destroyer] = function () {
//       subscription.unsubscribe();
//       original && typeof original === 'function' && original.apply(this, arguments);
//     }
//   }
// }

@NgModule({
  entryComponents: [
    CoreComponent,
    BackgroundComponent
  ],
  declarations: [
    CoreComponent,
    BackgroundComponent,
    RippleDirective
  ],
  providers: [],
  imports: [],
  exports: [
    CoreComponent,
    BackgroundComponent,
    RippleDirective
  ]
})
export class NgRippleModule {}
