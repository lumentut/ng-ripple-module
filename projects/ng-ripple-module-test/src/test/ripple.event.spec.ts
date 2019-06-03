import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement, ElementRef } from '@angular/core';
import { BrowserModule, By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgRippleModule } from '@ng-ripple-module/ng-ripple.module';
import { Ripple } from '@ng-ripple-module/ripple';
import { Coordinate } from '@ng-ripple-module/ripple.coordinate';
import { RippleEvent } from '@ng-ripple-module/ripple.event';
import { RippleHost } from '@ng-ripple-module/ripple.host';
import { RippleDirective } from '@ng-ripple-module/ripple.directive';

@Component({
  template: `<div ripple navlink="/test">RIPPLE EVENT TEST</div>`,
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
class TestRippleEventComponent {
  constructor(public elRef: ElementRef) {}
}

describe('RippleEvent', () => {
  let fixture: ComponentFixture<TestRippleEventComponent>;
  let directiveEl: DebugElement;
  let directive: RippleDirective;
  let event: RippleEvent;
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
        TestRippleEventComponent
      ]
    });
    fixture = TestBed.createComponent(TestRippleEventComponent);
    directiveEl = fixture.debugElement.query(By.directive(RippleDirective));
    directive = directiveEl.injector.get(RippleDirective);
    fixture.detectChanges();
    ripple = directive.ripple;
    host = ripple.core.host;
    host.recalculate();
    fixture.detectChanges();
  });

  it('should create correct event', () => {
    expect(host).not.toBeUndefined();

    const coordinate: Coordinate = { x: 100, y: 100 };
    const delay = 0;
    const element: HTMLElement = host.element;
    const type = 'rtap';

    event = new RippleEvent(element, coordinate, delay, type);

    expect(event.target).toEqual(element);
    expect(event.type).toEqual(type);
    expect(event.timestamp).not.toBeUndefined();
    expect(event.clientX).toEqual(coordinate.x);
    expect(event.clientY).toEqual(coordinate.y);
    expect(event.clientRect).not.toBeUndefined();
    expect(event.navLink).toEqual('/test');
    expect(event.delay).toEqual(delay);
  });
});
