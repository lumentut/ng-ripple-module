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

import {
  RIPPLE_LIGHT_BGCOLOR,
  RIPPLE_LIGHT_ACTIVE_BGCOLOR
} from '@ng-ripple-module/ripple.constants';

import { RippleDirective } from '@ng-ripple-module/ripple.directive';

@Component({
  template: `<a href="#" ripple light centered-ripple fixed-ripple immediate-event></a>`,
  styles: [
    `:host a {
      width: 250px;
      height: 250px;
      border-radius: 50%;
      position: relative;
    }`
  ]
})
class RippleLightTestComponent {
  constructor(public elRef: ElementRef) {}
}

describe('T01 - Directive: Light, Centered, Fixed & Immediate Event Ripple Test', () => {

  let fixture: ComponentFixture<RippleLightTestComponent>;
  let directiveEl: DebugElement;
  let directive: RippleDirective;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        RippleLightTestComponent
      ],
      imports: [
        BrowserAnimationsModule,
        NgRippleModule
      ],
      providers: []
    }).compileComponents();

    fixture = TestBed.createComponent(RippleLightTestComponent);
    directiveEl = fixture.debugElement.query(By.directive(RippleDirective));
    directive = directiveEl.injector.get(RippleDirective);

    fixture.detectChanges();

  }));

  it('passing light ripple', () => {
    expect(directive.configs.light).toBeTruthy();
    expect(directive.ripple.configs.base.light).toBeTruthy();

    expect(directive.ripple.configs.rippleCore.rippleBgColor).toEqual(RIPPLE_LIGHT_BGCOLOR);
    expect(directive.ripple.core.configs.rippleBgColor).toEqual(RIPPLE_LIGHT_BGCOLOR);

    expect(directive.ripple.configs.rippleBackground.backgroundColor).toEqual(RIPPLE_LIGHT_ACTIVE_BGCOLOR);
    expect(directive.ripple.background.configs.backgroundColor).toEqual(RIPPLE_LIGHT_ACTIVE_BGCOLOR);
  });

  it('passing centered ripple', () => {
    expect(directive.ripple.core.configs.centered).toBeTruthy();
  });

  it('passing fixed ripple', () => {
    expect(directive.ripple.core.configs.fixed).toBeTruthy();
  });

  it('passing immediate event ripple', () => {
    expect(directive.configs.delayEvent).toBeFalsy();
  });
});
