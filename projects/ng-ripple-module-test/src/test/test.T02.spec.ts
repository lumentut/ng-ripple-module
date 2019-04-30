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

const rippleBgColor = 'white';
const activeBgColor = 'grey';
const fillTransition = '150ms';
const splashTransition = '50ms cubic-bezier(0.1,0.2,0.3,0.4)';
const fadeTransition = '150ms';
const bgFadeTransition = '105ms';
const tapLimit = 400;
const splashOpacity = 0.5;
const activeClass = 'foo';

@Component({
  template: `<a href="#" ripple
    rippleBgColor="{{ rippleBgColor }}"
    activeBgColor="{{ activeBgColor }}"
    fillTransition="{{ fillTransition }}"
    splashTransition="{{ splashTransition }}"
    fadeTransition="{{ fadeTransition }}"
    bgFadeTransition="{{ bgFadeTransition }}"
    tapLimit="{{ tapLimit }}"
    splashOpacity="{{ splashOpacity }}"
    activeClass="{{ activeClass }}">
  </a>`
  ,
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

  rippleBgColor = rippleBgColor;
  activeBgColor = activeBgColor;
  fillTransition = fillTransition;
  splashTransition = splashTransition;
  fadeTransition = fadeTransition;
  bgFadeTransition = bgFadeTransition;
  tapLimit = tapLimit;
  splashOpacity = splashOpacity;
  activeClass = activeClass;

  constructor(public elRef: ElementRef) {}
}

describe('T02 - Directive: Color, Transition, Tap Limit, Opacity and Active Class', () => {

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

  it('passing rippleBgColor', () => {
    expect(directive.ripple.core.configs.rippleBgColor).toEqual(rippleBgColor);
  });

  it('passing activeBgColor', () => {
    expect(directive.ripple.background.configs.backgroundColor).toEqual(activeBgColor);
  });

  it('passing fillTransition', () => {
    expect(directive.ripple.core.configs.fillTransition).toEqual(fillTransition);
  });

  it('passing splashTransition', () => {
    expect(directive.ripple.core.configs.splashTransition).toEqual(splashTransition);
  });

  it('passing fadeTransition', () => {
    expect(directive.ripple.core.configs.fadeTransition).toEqual(fadeTransition);
  });

  it('passing bgFadeTransition', () => {
    expect(directive.ripple.background.configs.fadeTransition).toEqual(bgFadeTransition);
  });

  it('passing tapLimit', () => {
    expect(directive.ripple.core.configs.tapLimit).toEqual(`${tapLimit}`);
  });

  it('passing splashOpacity', () => {
    expect(directive.ripple.core.configs.splashOpacity).toEqual(`${splashOpacity}`);
  });

  it('passing activeClass', () => {
    expect(directive.ripple.core.configs.activeClass).toEqual(activeClass);
  });

});
