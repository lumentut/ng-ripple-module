import {
  Component,
  ElementRef,
  DebugElement
} from '@angular/core';

import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';

import {
  async,
  TestBed ,
  ComponentFixture
} from '@angular/core/testing';

import { By } from '@angular/platform-browser';

import { NgRippleModule } from '@ng-ripple-module/ng-ripple.module';
import { RippleDirective } from '@ng-ripple-module/ripple.directive';
import { DEFAULT_RIPPLE_CONFIGS, GLOBAL_RIPPLE_CONFIGS, RippleConfigs } from '@ng-ripple-module/ripple.configs';


const configs: RippleConfigs = {
  fixed: true,
  centered: true,
  light: true,
  rippleDefaultBgColor: 'grey',
  activeDefaultBgColor: 'grey',
  rippleLightBgColor: 'white',
  activeLightBgColor: 'white',
  fillTransition: '0ms',
  splashTransition: '0ms',
  fadeTransition: '0ms',
  bgFadeTransition: '0ms',
  splashOpacity: 0,
  tapLimit: 100,
  activeClass: 'actcls',
  eventIncluded: false,
  delayEvent: false,
  delayValue: 100,
  dismountingTimeout: 300
};

@Component({
  template: `<a href="#" ripple></a>`,
  styles: [
    `:host a {
      width: 250px;
      height: 250px;
      border-radius: 50%;
      position: relative;
    }`
  ],
  providers: [
    {provide: GLOBAL_RIPPLE_CONFIGS, useValue: configs}
  ]
})
class RippleTestComponent {
  constructor(public elRef: ElementRef) {}
}

describe('T09 - Custom configuration test', () => {

  let fixture: ComponentFixture<RippleTestComponent>;
  let directiveEl: DebugElement;
  let directive: RippleDirective;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        RippleTestComponent
      ],
      imports: [
        BrowserAnimationsModule,
        NgRippleModule
      ],
      providers: []
    }).compileComponents();

    fixture = TestBed.createComponent(RippleTestComponent);
    directiveEl = fixture.debugElement.query(By.directive(RippleDirective));
    directive = directiveEl.injector.get(RippleDirective);

    fixture.detectChanges();

  }));

  it('receive all custom configs properties', () => {
    for (const key in configs) {
      if (directive.configs[key]) {
        expect(directive.configs[key]).toEqual(configs[key]);
        expect(directive.configs[key] === DEFAULT_RIPPLE_CONFIGS[key]).toBeFalsy();
      }
    }
  });

  it('passing custom configs to ripple component', () => {
    const cfg = directive.ripple.core.rippleCoreConfigs;
    for (const key in cfg) {
      if (key !== 'rippleBgColor') {
        expect(directive.ripple.core.configs[key]).toEqual(cfg[key]);
        expect(directive.ripple.core.configs[key] === DEFAULT_RIPPLE_CONFIGS[key]).toBeFalsy();
      }
    }
  });

  it('passing custom configs to background component', () => {
    expect(directive.ripple.core.background.configs.fadeTransition).toEqual(configs.bgFadeTransition);
    expect(directive.ripple.core.background.configs.fadeTransition === DEFAULT_RIPPLE_CONFIGS.bgFadeTransition).toBeFalsy();
  });
});
