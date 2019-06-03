import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Inject,
  Injectable,
  Injector,
  NgZone,
  Optional
} from '@angular/core';

import { Ripple } from './ripple';
import { RippleComponent } from './ripple.component';
import { RippleConfigs, RIPPLE_CONFIGS, RIPPLE_CORE_CONFIGS, RIPPLE_GLOBAL_CONFIGS } from './ripple.configs';
import { RippleHost } from './ripple.host';
import { RippleListener } from './ripple.listener';

@Injectable()
export class RippleFactory {

  configs: any;

  constructor(
    private appRef: ApplicationRef,
    private cfr: ComponentFactoryResolver,
    private listener: RippleListener,
    private ngZone: NgZone,
    @Optional() @Inject(RIPPLE_GLOBAL_CONFIGS) private globalConfigs: RippleConfigs
  ) {}

  private componentRef(configs: RippleConfigs, host: RippleHost ): ComponentRef<any> {
    const injector = Injector.create({ providers: [
      { provide: RIPPLE_CORE_CONFIGS, useValue: configs },
      { provide: RippleHost, useValue: host }
    ]});

    const componentRef = this.cfr.resolveComponentFactory(RippleComponent).create(injector);
    this.appRef.attachView(componentRef.hostView);
    componentRef.changeDetectorRef.detach();

    return componentRef;
  }

  create(hostElement: HTMLElement, inputConfigs?: RippleConfigs): Ripple {
    const configs = { ...RIPPLE_CONFIGS, ...this.globalConfigs, ...inputConfigs };
    const host = new RippleHost(hostElement);
    const componentRef = this.componentRef(configs, host);
    const { ngZone, listener } = this;

    return new Ripple(
      componentRef,
      configs,
      hostElement,
      listener,
      ngZone,
    );
  }
}
