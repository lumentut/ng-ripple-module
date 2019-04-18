import {
  Injector,
  ComponentRef,
  ApplicationRef,
  ComponentFactoryResolver
} from '@angular/core';

import {
  RippleConfigs,
  RippleComponentConfigs,
  RIPPLE_BG_CONFIGS,
  RIPPLE_CORE_CONFIGS
} from './ripple.configs';

import { RippleHost } from './ripple.host';
import { BackgroundComponent } from './ripple-bg.component';
import { RippleComponent } from './ripple.component';
import { RippleEmitters } from '../lib/ripple.event.handler';

export interface Coordinate {
  x: number;
  y: number;
}

export interface Margin {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

export interface RippleStyle {
  width?: number;
  height?: number;
  marginLeft?: number;
  marginTop?: number;
  background?: string;
}

export enum RippleCmpRefs {
  RIPPLE = 'coreCmpRef',
  BACKGROUND = 'backgroundCmpRef'
}

export class Ripple {

  host: RippleHost;
  coreRect: ClientRect;
  backgroundRect: ClientRect;
  coreCmpRef: ComponentRef<any>;
  backgroundCmpRef: ComponentRef<any>;

  configs: RippleComponentConfigs;

  constructor(
    public element: HTMLElement,
    private cfr: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private baseConfigs: RippleConfigs,
    private emitters: RippleEmitters
  ) {
    this.host = new RippleHost(element);
    this.configs = new RippleComponentConfigs(this.baseConfigs);
    this.createComponentRef(this.backgroundInjector, BackgroundComponent, RippleCmpRefs.BACKGROUND);
    this.createComponentRef(this.coreInjector, RippleComponent, RippleCmpRefs.RIPPLE);
  }

  private createComponentRef(injector: Injector, component: any, cmpRefName: string) {
    this[`${cmpRefName}`] = this.cfr.resolveComponentFactory(component).create(injector);
    this.appRef.attachView(this[`${cmpRefName}`].hostView);
  }

  get backgroundInjector(): Injector {
    return Injector.create({
      providers: [{ provide: RIPPLE_BG_CONFIGS, useValue: this.configs.rippleBackground }]
    });
  }

  get background() {
    return this.backgroundCmpRef.instance;
  }

  get coreInjector(): Injector {
    return Injector.create({ providers: [
      { provide: RIPPLE_CORE_CONFIGS, useValue: this.configs.rippleCore },
      { provide: BackgroundComponent, useValue: this.background },
      { provide: RippleHost, useValue: this.host }
    ]});
  }

  get core() {
    return this.coreCmpRef.instance;
  }

  get componentRefs(): any[] {
    return [this.coreCmpRef, this.backgroundCmpRef];
  }

  mountElement() {
    this.componentRefs.forEach(cmpRef => {
      this.element.appendChild(cmpRef.instance.element);
    });
  }

  dismountElement() {
    this.componentRefs.forEach(cmpRef => {
      this.element.removeChild(cmpRef.instance.element);
    });
  }

  onDestroy() {
    this.coreCmpRef.destroy();
    this.backgroundCmpRef.destroy();
  }
}
