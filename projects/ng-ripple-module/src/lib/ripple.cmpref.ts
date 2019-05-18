/**
 * @license
 * Copyright (c) 2019 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import { Injector, ComponentRef } from '@angular/core';
import { RippleHost } from './ripple.host';
import { BackgroundComponent } from './ripple-bg.component';
import { CoreComponent } from './ripple-core.component';
import { RIPPLE_BG_CONFIGS, RIPPLE_CORE_CONFIGS } from './ripple.configs';

export class RippleCmpRef {

  background: ComponentRef<any>;
  core: ComponentRef<any>;
  references = [];

  constructor(private ripple: any) {
    this.background = this._background;
    this.core = this._core;
    this.references = [this.core];
    if(this.ripple.configs.base.backgroundIncluded) {
      this.references.push(this.background);
    }
  }

  private getComponentRef(component: any, injector: Injector) {
    const { cfr, appRef} = this.ripple;
    const cmpRef = cfr.resolveComponentFactory(component).create(injector);
    appRef.attachView(cmpRef.hostView);
    cmpRef.changeDetectorRef.detach();
    return cmpRef;
  }

  private get backgroundInjector(): Injector {
    return Injector.create({
      providers: [{ provide: RIPPLE_BG_CONFIGS, useValue: this.ripple.configs.rippleBackground }]
    });
  }

  private get _background(): ComponentRef<any> {
    return this.getComponentRef(BackgroundComponent, this.backgroundInjector);
  }

  private get backgroundProvider(): any[] {
    return [{ provide: BackgroundComponent, useValue: this.background.instance }];
  }

  private get coreProviders(): any[] {
    return [
      { provide: RIPPLE_CORE_CONFIGS, useValue: this.ripple.configs.rippleCore },
      { provide: RippleHost, useValue: this.ripple.host },
    ];
  }

  private get coreInjector(): Injector {
    return Injector.create({ providers: [...this.coreProviders, ...this.backgroundProvider] });
  }

  private get _core(): ComponentRef<any> {
    return this.getComponentRef(CoreComponent, this.coreInjector);
  }

  destroy() {
    this.background.destroy();
    this.core.destroy();
  }
}