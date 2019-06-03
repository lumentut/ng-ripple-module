import { Component, DebugElement, ElementRef } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { async, TestBed , ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { NgRippleModule } from '@ng-ripple-module/ng-ripple.module';
import { RippleDirective } from '@ng-ripple-module/ripple.directive';
import { RippleAnimation } from '@ng-ripple-module/ripple.animation';

@Component({
  template: `<a href="#" ripple></a>`,
  styles: [
    `:host a {
      width: 250px;
      height: 250px;
      border-radius: 50%;
      position: relative;
    }`
  ]
})
class RippleTestComponent {
  constructor(public elRef: ElementRef) {}
}

describe('RippleAnimation', () => {

  let fixture: ComponentFixture<RippleTestComponent>;
  let directiveEl: DebugElement;
  let directive: RippleDirective;
  let animation: RippleAnimation;

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
    animation = directive.ripple.core.animation;
  }));

  it('have fill animation', () => {
    expect(animation.fill(100, 100)).toBeTruthy();
  });

  it('have translate animation', () => {
    expect(animation.translate(10, 10, 0.5)).toBeTruthy();
  });

  it('have splash animation', () => {
    expect(animation.splash).toBeTruthy();
  });

  it('have fade animation', () => {
    expect(animation.fade).toBeTruthy();
  });
});
