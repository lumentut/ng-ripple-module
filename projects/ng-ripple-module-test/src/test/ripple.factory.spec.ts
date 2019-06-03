import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AfterViewInit, Component, DebugElement, ElementRef } from '@angular/core';
import { BrowserModule, By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgRippleModule } from '@ng-ripple-module/ng-ripple.module';
import { Ripple } from '@ng-ripple-module/ripple';
import { RippleConfigs, RIPPLE_GLOBAL_CONFIGS } from '@ng-ripple-module/ripple.configs';
import { RippleDirective } from '@ng-ripple-module/ripple.directive';
import { RippleFactory } from '@ng-ripple-module/ripple.factory';

const TEST_DEFAULT_BGCOLOR = 'rgba(0,0,0,0.1)';
const TEST_FADE_TRANSITION = '100ms linear';
const TEST_FILL_TRANSITION = '900ms linear';
const TEST_SPLASH_OPACITY = 0.5;
const TEST_SPLASH_TRANSITION = '150ms cubic-bezier(0.3,0.05,0.3,1)';
const TEST_TAP_LIMIT = 200;

const globalConfigs: RippleConfigs = {
  backgroundColor: TEST_DEFAULT_BGCOLOR,
  delayValue: 1,
  fadeTransition: TEST_FADE_TRANSITION,
  fillTransition: TEST_FILL_TRANSITION,
  fixed: true,
  light: true,
  splashTransition: TEST_SPLASH_TRANSITION,
  splashOpacity: TEST_SPLASH_OPACITY,
  tapLimit: TEST_TAP_LIMIT,
};

@Component({
  template: `<div>RIPPLE FACTORY TEST</div>`,
  styles: [
    `:host div {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      top: 100;
      left: 100;
    }`
  ]
})
class TestRippleFactoryComponent implements AfterViewInit {

  ripple: Ripple;

  constructor(
    public elRef: ElementRef,
    public rippleFactory: RippleFactory
  ) {}

  ngAfterViewInit() {
    const element = this.elRef.nativeElement;
    this.ripple = this.rippleFactory.create(element);
  }
}

describe('RippleFactory:', () => {
  let component: TestRippleFactoryComponent;
  let fixture: ComponentFixture<TestRippleFactoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        NgRippleModule
      ],
      declarations: [
        TestRippleFactoryComponent
      ]
    });
    fixture = TestBed.createComponent(TestRippleFactoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create ripple instance', () => {
    expect(component.ripple).not.toBeUndefined();
  });

});

@Component({
  template: `<div ripple> FACTORY - GLOBAL CONFIGS TEST </div>`,
  styles: [
    `:host div {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      top: 100;
      left: 100;
    }`
  ]
})
class TestRippleGlobalConfigComponent {
  constructor(public elRef: ElementRef) {}
}

describe('RippleFactoryGlobalConfigs:', () => {
  let fixture: ComponentFixture<TestRippleGlobalConfigComponent>;
  let directiveEl: DebugElement;
  let directive: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        NgRippleModule
      ],
      declarations: [
        TestRippleGlobalConfigComponent
      ],
      providers: [{provide: RIPPLE_GLOBAL_CONFIGS, useValue: globalConfigs}]
    });
    fixture = TestBed.createComponent(TestRippleGlobalConfigComponent);
    directiveEl = fixture.debugElement.query(By.directive(RippleDirective));
    directive = directiveEl.injector.get(RippleDirective);
    fixture.detectChanges();
  });

  it('should have global configs', () => {
    expect(directive.ripple).not.toBeUndefined();
    expect(directive.ripple.configs).not.toBeUndefined();
    const configs: any = directive.ripple.configs;
    expect(configs.backgroundColor).toEqual(TEST_DEFAULT_BGCOLOR);
    expect(configs.splashOpacity).toEqual(TEST_SPLASH_OPACITY);
    expect(configs.delayValue).toEqual(1);
    expect(configs.fadeTransition).toEqual(TEST_FADE_TRANSITION);
    expect(configs.fillTransition).toEqual(TEST_FILL_TRANSITION);
    expect(configs.fixed).toBeTruthy();
    expect(configs.light).toBeTruthy();
    expect(configs.splashTransition).toEqual(TEST_SPLASH_TRANSITION);
    expect(configs.splashOpacity).toEqual(TEST_SPLASH_OPACITY);
    expect(configs.tapLimit).toEqual(TEST_TAP_LIMIT);
  });
});
