import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement, ElementRef } from '@angular/core';
import { BrowserModule, By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgRippleModule } from '@ng-ripple-module/ng-ripple.module';
import { Ripple } from '@ng-ripple-module/ripple';
import { RippleHost } from '@ng-ripple-module/ripple.host';
import { RippleDirective } from '@ng-ripple-module/ripple.directive';

@Component({
  template: `<div ripple>CIRCLE TEST</div>`,
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
class TestRippleHostCircleComponent {
  constructor(public elRef: ElementRef) {}
}

@Component({
  template: `<div ripple>RECTANGLE TEST</div>`,
  styles: [
    `:host div {
      width: 100px;
      height: 60px;
      border-radius: 5px;
      top: 100;
      left: 100;
    }`
  ]
})
class TestRippleHostRectangleComponent {
  constructor(public elRef: ElementRef) {}
}

describe('RippleHost - Circle Element:', () => {
  let fixture: ComponentFixture<TestRippleHostCircleComponent>;
  let directiveEl: DebugElement;
  let directive: RippleDirective;
  let host: RippleHost;
  let ripple: Ripple;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        NgRippleModule
      ],
      declarations: [
        TestRippleHostCircleComponent
      ]
    });
    fixture = TestBed.createComponent(TestRippleHostCircleComponent);
    directiveEl = fixture.debugElement.query(By.directive(RippleDirective));
    directive = directiveEl.injector.get(RippleDirective);
    fixture.detectChanges();
    ripple = directive.ripple;
    host = ripple.core.host;
    host.recalculate();
    fixture.detectChanges();
  });

  it('should create host instance', () => {
    expect(host).not.toBeUndefined();
  });

  it('should detect round shape', () => {
    expect(host.isRound).toBeTruthy();
  });

  it('should detect diameter', (    ) => {
    const { width, height } = host.element.getBoundingClientRect();
    const diameter = Math.hypot(width, height);
    expect(host.diameter).toEqual(diameter);
  });

  it('should detect center', () => {
    const { left, top, width, height } = host.element.getBoundingClientRect();
    expect(host.center.x).toEqual(left + (0.5 * width));
    expect(host.center.y).toEqual(top + (0.5 * height));
  });

  it('should detect radius', () => {
    const { width } = host.element.getBoundingClientRect();
    const radius = 0.5 * width;
    expect(host.radius).toEqual(radius);
    expect(host.radiusSquare).toEqual(radius * radius);
  });

  it('should detect margin', () => {
    const { width, height } = host.element.getBoundingClientRect();
    const diameter = Math.hypot(width, height);
    const top = 0.5 * (height - diameter);
    const left = 0.5 * (width - diameter);
    expect(host.margin.top).toEqual(top);
    expect(host.margin.left).toEqual(left);
  });
});

describe('RippleHost - Rectangle Element:', () => {
  let fixture: ComponentFixture<TestRippleHostRectangleComponent>;
  let directiveEl: DebugElement;
  let directive: RippleDirective;
  let host: RippleHost;
  let ripple: Ripple;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        NgRippleModule
      ],
      declarations: [
        TestRippleHostRectangleComponent
      ]
    });
    fixture = TestBed.createComponent(TestRippleHostRectangleComponent);
    directiveEl = fixture.debugElement.query(By.directive(RippleDirective));
    directive = directiveEl.injector.get(RippleDirective);
    fixture.detectChanges();
    ripple = directive.ripple;
    host = ripple.core.host;
    host.recalculate();
    fixture.detectChanges();
  });

  it('should create host instance', () => {
    expect(host).not.toBeUndefined();
  });

  it('should detect rectangle shape', () => {
    expect(host.isRound).toBeFalsy();
  });

  it('should detect diameter', () => {
    const { width, height } = host.element.getBoundingClientRect();
    const diameter = Math.hypot(width, height);
    expect(host.diameter).toEqual(diameter);
  });

  it('should detect center', () => {
    const { left, top, width, height } = host.element.getBoundingClientRect();
    expect(host.center.x).toEqual(left + (0.5 * width));
    expect(host.center.y).toEqual(top + (0.5 * height));
  });

  it('should detect radius', () => {
    const { width } = host.element.getBoundingClientRect();
    const radius = 0.5 * width;
    expect(host.radius).toEqual(radius);
    expect(host.radiusSquare).toEqual(radius * radius);
  });

  it('should detect margin', () => {
    const { width, height } = host.element.getBoundingClientRect();
    const diameter = Math.hypot(width, height);
    const top = 0.5 * (height - diameter);
    const left = 0.5 * (width - diameter);
    expect(host.margin.top).toEqual(top);
    expect(host.margin.left).toEqual(left);
  });
});
