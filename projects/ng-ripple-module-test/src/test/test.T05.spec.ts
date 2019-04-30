import {
  Component,
  ElementRef,
  DebugElement
} from '@angular/core';

import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';

import {
  fakeAsync,
  tick,
  async,
  TestBed ,
  ComponentFixture
} from '@angular/core/testing';

import { By } from '@angular/platform-browser';

import { NgRippleModule } from '@ng-ripple-module/ng-ripple.module';
import { RippleDirective } from '@ng-ripple-module/ripple.directive';

import {
  Touch,
  Mouse,
  RipplePointerListener,
  POINTERDOWN_LISTENER
} from '@ng-ripple-module/ripple.strategy';

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

describe('T05 - Directive listen to Fallback Tap, Click, Press, and Press Up test', () => {

  let fixture: ComponentFixture<RippleTestComponent>;
  let directiveEl: DebugElement;
  let directive: RippleDirective;
  let listener: RipplePointerListener;
  let splashMillis: string;
  let splashDuration: number;
  let delayValue: number;
  let fallBack: string;
  let touchEvent: any;
  let mouseEvent: any;

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
    splashMillis = directive.configs.splashTransition.replace(/ .*/, '');
    splashDuration = splashMillis.match(/\d+/g).map(Number)[0];
    delayValue = directive.configs.delayValue;
    fallBack = 'fallback';
    fixture.detectChanges();

    directive.ripple.listenerType = fallBack;
    listener = new RipplePointerListener(directive.ripple);

    touchEvent = {
      pointerType: 'touchstart',
      clientX: 0,
      clientY: 0
    };

    mouseEvent = {
      pointerType: 'mousedown',
      clientX: 0,
      clientY: 0
    };

  }));

  it('recognize pointerdown fallback', () => {
    expect(listener.pointerdownEvents).toEqual(POINTERDOWN_LISTENER[fallBack]);
  });

  it('listen to touch action', () => {
    listener.onPointerDown(touchEvent);
    expect(listener.strategy.listeners[0][0]).toEqual(Touch.MOVE);
    expect(listener.strategy.listeners[1][0]).toEqual(Touch.END);
  });

  it('listen to mouse action', () => {
    listener.onPointerDown(mouseEvent);
    expect(listener.strategy.listeners[0][0]).toEqual(Mouse.MOVE);
    expect(listener.strategy.listeners[1][0]).toEqual(Mouse.UP);
    expect(listener.strategy.listeners[2][0]).toEqual(Mouse.LEAVE);
  });

  it('passing emit delay value', () => {
    expect(directive.emitDelayValue).toBe(delayValue);
  });

  it('emit tap event', fakeAsync((): void => {
    spyOn(directive.rtap, 'emit');
    listener.onPointerDown(touchEvent);
    listener.context.ngZone.run(() => listener.strategy.onTouchEnd());
    tick(delayValue + splashDuration);
    expect(directive.rtap.emit).toHaveBeenCalled();
  }));

  it('emit press event', fakeAsync((): void => {
    spyOn(directive.rpress, 'emit');
    listener.onPointerDown(touchEvent);
    tick(listener.context.core.tapLimit);
    expect(directive.rpress.emit).toHaveBeenCalled();
  }));

  it('emit pressup event', fakeAsync((): void => {
    spyOn(directive.rpressup, 'emit');
    listener.onPointerDown(touchEvent);
    listener.strategy.isPressing = true;
    listener.context.ngZone.run(() => listener.strategy.onTouchEnd());
    tick(delayValue + splashDuration);
    expect(directive.rpressup.emit).toHaveBeenCalled();
  }));

  it('emit click event', fakeAsync((): void => {
    spyOn(directive.rclick, 'emit');
    listener.onPointerDown(mouseEvent);
    listener.context.ngZone.run(() => listener.strategy.onMouseUp());
    tick(delayValue + splashDuration);
    expect(directive.rclick.emit).toHaveBeenCalled();
  }));
});
