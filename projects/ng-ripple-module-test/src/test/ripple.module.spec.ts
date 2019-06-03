import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement, ElementRef } from '@angular/core';
import { BrowserModule, By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgRippleModule } from '@ng-ripple-module/ng-ripple.module';
import { RippleDirective } from '@ng-ripple-module/ripple.directive';

@Component({
  template: `<div ripple>MODULE TEST</div>`,
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
class TestRippleModuleComponent {
  constructor(public elRef: ElementRef) {}
}

describe('RippleModule:', () => {
  let component: TestRippleModuleComponent;
  let fixture: ComponentFixture<TestRippleModuleComponent>;
  let directiveEl: DebugElement;
  let directive: RippleDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        NgRippleModule
      ],
      declarations: [
        TestRippleModuleComponent
      ]
    });
    fixture = TestBed.createComponent(TestRippleModuleComponent);
    component = fixture.componentInstance;
    directiveEl = fixture.debugElement.query(By.directive(RippleDirective));
    directive = directiveEl.injector.get(RippleDirective);
  });

  it('should works', () => {
    expect(component).toBeTruthy();
    expect(directiveEl).not.toBeNull();
    expect(directive).not.toBeNull();
  });
});
