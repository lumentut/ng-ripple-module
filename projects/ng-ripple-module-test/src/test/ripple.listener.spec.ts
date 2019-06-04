import { fakeAsync, TestBed, tick, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement, ElementRef } from '@angular/core';
import { BrowserModule, By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgRippleModule } from '@ng-ripple-module/ng-ripple.module';
import { Ripple } from '@ng-ripple-module/ripple';
import { RippleDirective } from '@ng-ripple-module/ripple.directive';
import { RippleHost } from '@ng-ripple-module/ripple.host';
import { RippleListener } from '@ng-ripple-module/ripple.listener';
import { RippleConfigs } from '@ng-ripple-module/ripple.configs';

const TEST_COLOR = 'rgba(0,0,0,0.08)';
const TEST_OPACITY = 0.5;

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
class TestRippleListenerComponent {

  color = TEST_COLOR;
  opacity = TEST_OPACITY;

  constructor(public elRef: ElementRef) {}

  onTap(event: any) {}
  onPress(event: any) {}
  onPressup(event: any) {}
  onClick(event: any) {}
}

describe('RippleListener:', () => {
  let component: TestRippleListenerComponent;
  let configs: RippleConfigs;
  let delay: number;
  let directiveEl: DebugElement;
  let directive: any;
  let fixture: ComponentFixture<TestRippleListenerComponent>;
  let host: RippleHost;
  let listener: RippleListener;
  let ripple: Ripple;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        NgRippleModule
      ],
      declarations: [
        TestRippleListenerComponent
      ]
    });
    fixture = TestBed.createComponent(TestRippleListenerComponent);
    component = fixture.componentInstance;
    directiveEl = fixture.debugElement.query(By.directive(RippleDirective));
    directive = directiveEl.injector.get(RippleDirective);
    fixture.detectChanges();

    ripple = directive.ripple;
    host = ripple.core.host;
    listener = ripple.listener;
    configs = ripple.configs;
    delay = configs.splashTransition.match(/\d+/g).map(Number)[0];
  });

  it('should available', () => {
    expect(component).toBeTruthy();
    expect(directiveEl).not.toBeNull();
    expect(directive).not.toBeNull();
    expect(ripple).not.toBeUndefined();
    expect(listener).not.toBeUndefined();
  });

  it('should listen to fallback event', () => {
    ripple.trigger = ripple.fallbackEvent;
    ripple.initialize();
    expect(ripple.core.host).not.toBeUndefined();
    expect(ripple.listener).not.toBeUndefined();
    expect(ripple.core.styles).not.toBeUndefined();
    expect(ripple.core.element).not.toBeUndefined();
    expect(host.element).not.toBeUndefined();

    const touch = new Touch({
      identifier: Date.now(),
      target: host.element
    });

    spyOn(ripple, 'onPointerMove');
    spyOn(ripple, 'onPointerEnd');

    const touchStart = new TouchEvent('touchstart', {
      touches: [touch],
      changedTouches: [touch]
    });

    host.element.dispatchEvent(touchStart);
    expect(ripple.contact.input).toBe('touch');

    const touchMove = new TouchEvent('touchmove', {
      touches: [touch],
      changedTouches: [touch]
    });

    host.element.dispatchEvent(touchMove);
    expect(ripple.onPointerMove).toHaveBeenCalled();

    const touchEnd = new TouchEvent('touchend', {
      touches: [touch],
      changedTouches: [touch]
    });

    host.element.dispatchEvent(touchEnd);
    expect(ripple.onPointerEnd).toHaveBeenCalled();

    const mouseDown = new MouseEvent('mousedown');
    host.element.dispatchEvent(mouseDown);
    expect(ripple.contact.input).toBe('mouse');

    const mouseMove = new MouseEvent('mousemove');
    host.element.dispatchEvent(mouseMove);
    expect(ripple.onPointerMove).toHaveBeenCalledTimes(2);

    const mouseUp = new MouseEvent('mouseup');
    host.element.dispatchEvent(mouseUp);
    expect(ripple.onPointerEnd).toHaveBeenCalledTimes(2);

    const mouseLeave = new MouseEvent('mouseleave');
    host.element.dispatchEvent(mouseLeave);
    expect(ripple.onPointerEnd).toHaveBeenCalledTimes(3);
  });

  it('should listen to pointerdown event', () => {
    ripple.trigger = ripple.pointerdownEvent;
    ripple.initialize();
    expect(ripple.core.host).not.toBeUndefined();
    expect(ripple.listener).not.toBeUndefined();
    expect(ripple.core.styles).not.toBeUndefined();
    expect(ripple.core.element).not.toBeUndefined();
    expect(host.element).not.toBeUndefined();

    const touchEvent = new PointerEvent('pointerdown', {pointerType: 'touch'});
    host.element.dispatchEvent(touchEvent);
    expect(ripple.contact.input).toBe('touch');

    const mouseEvent = new PointerEvent('pointerdown', {pointerType: 'mouse'});
    host.element.dispatchEvent(mouseEvent);
    expect(ripple.contact.input).toBe('mouse');
  });

  it('should listen to tap event', fakeAsync((): void => {
    ripple.trigger = ripple.fallbackEvent;
    ripple.initialize();
    expect(host.element).not.toBeUndefined();

    const touch = new Touch({
      identifier: Date.now(),
      target: host.element
    });

    const touchStart = new TouchEvent('touchstart', {
      touches: [touch],
      changedTouches: [touch]
    });

    const touchEnd = new TouchEvent('touchend', {
      touches: [touch],
      changedTouches: [touch]
    });

    spyOn(directive.rtap, 'emit');

    host.element.dispatchEvent(touchStart);
    tick(ripple.pointer.tapLimit - 1);
    host.element.dispatchEvent(touchEnd);
    tick(delay);
    expect(directive.rtap.emit).toHaveBeenCalled();
  }));

  it('should listen to press event', fakeAsync((): void => {
    ripple.trigger = ripple.fallbackEvent;
    ripple.initialize();
    expect(host.element).not.toBeUndefined();

    const touch = new Touch({
      identifier: Date.now(),
      target: host.element
    });

    const touchStart = new TouchEvent('touchstart', {
      touches: [touch],
      changedTouches: [touch]
    });

    spyOn(directive.rpress, 'emit');

    host.element.dispatchEvent(touchStart);
    tick(ripple.pointer.tapLimit);
    expect(directive.rpress.emit).toHaveBeenCalled();
  }));

  it('should listen to pressup event', fakeAsync((): void => {
    ripple.trigger = ripple.fallbackEvent;
    ripple.initialize();
    expect(host.element).not.toBeUndefined();

    const touch = new Touch({
      identifier: Date.now(),
      target: host.element
    });

    const touchStart = new TouchEvent('touchstart', {
      touches: [touch],
      changedTouches: [touch]
    });

    const touchEnd = new TouchEvent('touchend', {
      touches: [touch],
      changedTouches: [touch]
    });

    spyOn(directive.rpressup, 'emit');

    host.element.dispatchEvent(touchStart);
    tick(ripple.pointer.tapLimit);
    host.element.dispatchEvent(touchEnd);
    tick(delay);
    expect(directive.rpressup.emit).toHaveBeenCalled();
  }));

  it('should listen to click event', fakeAsync((): void => {
    ripple.trigger = ripple.fallbackEvent;
    ripple.initialize();
    expect(host.element).not.toBeUndefined();

    spyOn(directive.rclick, 'emit');

    const mouseDown = new MouseEvent('mousedown');
    const mouseUp = new MouseEvent('mouseup');

    host.element.dispatchEvent(mouseDown);
    tick(300);
    host.element.dispatchEvent(mouseUp);
    tick(delay);
    expect(directive.rclick.emit).toHaveBeenCalled();
  }));
});
