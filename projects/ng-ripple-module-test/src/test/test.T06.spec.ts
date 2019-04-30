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

describe('T06 - Core & Background Component have required animation test', () => {

  let fixture: ComponentFixture<RippleTestComponent>;
  let directiveEl: DebugElement;
  let directive: RippleDirective;
  let coreAnimation: RippleAnimation;

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
    coreAnimation = directive.ripple.core.animation;
  }));

  it('have fill animation', () => {
    expect(coreAnimation.fill(100, 100)).toBeTruthy();
  });

  it('have translate animation', () => {
    expect(coreAnimation.translate(10, 10, 0.5)).toBeTruthy();
  });

  it('have splash animation', () => {
    expect(coreAnimation.splash).toBeTruthy();
  });

  it('have fadeout animation', () => {
    expect(coreAnimation.fadeout).toBeTruthy();
  });

  it('have background fadein animation', () => {
    expect(directive.ripple.core.background.fadeinAnimationPlayer).toBeTruthy();
  });

  it('have background fadeout animation', () => {
    expect(directive.ripple.core.background.fadeoutAnimationPlayer).toBeTruthy();
  });
});
