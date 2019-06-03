import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement, ElementRef } from '@angular/core';
import { BrowserModule, By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgRippleModule } from '@ng-ripple-module/ng-ripple.module';
import { RippleConfigs, RIPPLE_CUSTOM_CONFIGS } from '@ng-ripple-module/ripple.configs';
import { RippleDirective } from '@ng-ripple-module/ripple.directive';

const TEST_COLOR = 'rgba(0,0,0,0.08)';
const TEST_DEFAULT_BGCOLOR = 'rgba(0,0,0,0.1)';
const TEST_FADE_TRANSITION = '100ms linear';
const TEST_FILL_TRANSITION = '900ms linear';
const TEST_OPACITY = 0.5;
const TEST_SPLASH_OPACITY = 0.5;
const TEST_SPLASH_TRANSITION = '150ms cubic-bezier(0.3,0.05,0.3,1)';
const TEST_TAP_LIMIT = 700;

const customConfigs: RippleConfigs = {
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
  template: `<div ripple
    [rippleColor]="color"
    [splashOpacity]="opacity"
    (rtap)="onTap($event)"
    (rpress)="onPress($event)"
    (rpressup)="onPressup($event)"
    (rclick)="onClick($event)"
    fixed
    >
    DIRECTIVE TEST
  </div>`,
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
class TestRippleDirectiveComponent {

  color = TEST_COLOR;
  opacity = TEST_OPACITY;

  constructor(public elRef: ElementRef) {}

  onTap(event: any) {}
  onPress(event: any) {}
  onPressup(event: any) {}
  onClick(event: any) {}
}

describe('RippleDirective:', () => {
  let component: TestRippleDirectiveComponent;
  let fixture: ComponentFixture<TestRippleDirectiveComponent>;
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
        TestRippleDirectiveComponent
      ]
    });
    fixture = TestBed.createComponent(TestRippleDirectiveComponent);
    component = fixture.componentInstance;
    directiveEl = fixture.debugElement.query(By.directive(RippleDirective));
    directive = directiveEl.injector.get(RippleDirective);
    fixture.detectChanges();
  });

  it('should have element reference', () => {
    expect(directive.elRef.nativeElement).not.toBeUndefined();
  });

  it('should have ripple factory', () => {
    expect(directive.rippleFactory).not.toBeUndefined();
  });

  it('should have ripple intance', () => {
    expect(directive.ripple).not.toBeUndefined();
  });

  it('should bind attribute and input', () => {
    expect(directive.configs).not.toBeUndefined();
    const configs: any = directive.configs;
    expect(configs.backgroundColor).toEqual(TEST_COLOR);
    expect(configs.splashOpacity).toEqual(TEST_OPACITY);
    expect(configs.fixed).toBeTruthy();
  });

  it('should have event emitter', () => {
    spyOn(component, 'onTap');
    directive.rtap.emit();
    expect(component.onTap).toHaveBeenCalledTimes(1);
    spyOn(component, 'onPress');
    directive.rpress.emit();
    expect(component.onPress).toHaveBeenCalledTimes(1);
    spyOn(component, 'onPressup');
    directive.rpressup.emit();
    expect(component.onPressup).toHaveBeenCalledTimes(1);
    spyOn(component, 'onClick');
    directive.rclick.emit();
    expect(component.onClick).toHaveBeenCalledTimes(1);
  });
});

@Component({
  template: `<div ripple [rippleColor]="color"> DIRECTIVE - CUSTOM CONFIGS TEST </div>`,
  styles: [
    `:host div {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      top: 100;
      left: 100;
    }`
  ],
  providers: [{provide: RIPPLE_CUSTOM_CONFIGS, useValue: customConfigs}]
})
class TestRippleCustomConfigComponent {
  color = TEST_COLOR;
  constructor(public elRef: ElementRef) {}
}

describe('RippleDirectiveCustomConfigs:', () => {
  let fixture: ComponentFixture<TestRippleCustomConfigComponent>;
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
        TestRippleCustomConfigComponent
      ]
    });
    fixture = TestBed.createComponent(TestRippleCustomConfigComponent);
    directiveEl = fixture.debugElement.query(By.directive(RippleDirective));
    directive = directiveEl.injector.get(RippleDirective);
    fixture.detectChanges();
  });

  it('should capture input config first then custom configs', () => {
    expect(directive.ripple).not.toBeUndefined();
    expect(directive.ripple.configs).not.toBeUndefined();
    const configs: any = directive.ripple.configs;
    expect(configs.backgroundColor).toEqual(TEST_COLOR);
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
