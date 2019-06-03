import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, ElementRef, DebugElement } from '@angular/core';
import { BrowserModule, By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgRippleModule } from '@ng-ripple-module/ng-ripple.module';
import { Ripple } from '@ng-ripple-module/ripple';
import { RippleDirective } from '@ng-ripple-module/ripple.directive';
import { RippleHost } from '@ng-ripple-module/ripple.host';

@Component({
  template: `<div ripple>RIPPLE</div>`,
  styles: [
    `:host div {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      position: relative;
      left: 100px;
      top: 100px;
    }`
  ]
})
class TestRippleRoundComponent {
  constructor(public elRef: ElementRef) {}
}

describe('RippleCoordinate - Round Host:', () => {
  let fixture: ComponentFixture<TestRippleRoundComponent>;
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
        TestRippleRoundComponent
      ]
    });
    fixture = TestBed.createComponent(TestRippleRoundComponent);
    directiveEl = fixture.debugElement.query(By.directive(RippleDirective));
    directive = directiveEl.injector.get(RippleDirective);
    fixture.detectChanges();
    ripple = directive.ripple;
    host = ripple.core.host;
    host.recalculate();
    fixture.detectChanges();
  });

  it('detect round shaped host', () => {
    expect(host.isRound).toBeTruthy();
  });

  it('detect contact point outside/inside round host correctly', () => {

    const { rect, center } = host;
    const { core } = ripple;
    const { coordinate } = core;

    const angle = 45;
    const x = Math.cos(angle * Math.PI / 180) * rect.width / 2;
    const y = Math.sin(angle * Math.PI / 180) * rect.width / 2;

    // Contact point at Q1 (4.30)
    const coordInsideQ1 = { x: center.x + x - 1, y: center.y + y - 1 };
    expect(coordinate.centerStillIsInHostArea(coordInsideQ1)).toBeTruthy();

    const coordOutsideQ1 = { x: center.x + x, y: center.y + y };
    expect(coordinate.centerStillIsInHostArea(coordOutsideQ1)).toBeFalsy();

    // Contact point at Q2 (7.30)
    const coordInsideQ2 = { x: center.x - x, y: center.y + y - 1};
    expect(coordinate.centerStillIsInHostArea(coordInsideQ2)).toBeTruthy();

    const coordOutsideQ2 = { x: center.x - x - 1, y: center.y + y };
    expect(coordinate.centerStillIsInHostArea(coordOutsideQ2)).toBeFalsy();

    // Contact point at Q3 (10.30)
    const coordInsideQ3 = { x: center.x - x, y: center.y - y + 1 };
    expect(coordinate.centerStillIsInHostArea(coordInsideQ3)).toBeTruthy();

    const coordOutsideQ3 = { x: center.x - x - 1, y: center.y - y };
    expect(coordinate.centerStillIsInHostArea(coordOutsideQ3)).toBeFalsy();

    // Contact point at Q4 (1.30)
    const coordInsideQ4 = { x: center.x + x - 1, y: center.y - y + 1 };
    expect(coordinate.centerStillIsInHostArea(coordInsideQ4)).toBeTruthy();

    const coordOutsideQ4 = { x: center.x + x, y: center.y - y };
    expect(coordinate.centerStillIsInHostArea(coordOutsideQ4)).toBeFalsy();
  });

  it('detect outer point correctly', () => {
    const { center, rect } = host;
    const { core } = ripple;
    const { coordinate } = core;

    const element = ripple.core.element;
    core.renderer.setStyle(element, 'width', '50px');
    core.renderer.setStyle(element, 'height', '50px');

    let coordLeft = { x: center.x - 24, y: center.y };
    expect(coordinate.outerPointStillInHostRadius(coordLeft)).toBeTruthy();

    coordLeft = { x: center.x - 25, y: center.y };
    expect(coordinate.outerPointStillInHostRadius(coordLeft)).toBeFalsy();

    let coordRight = { x: center.x + 24, y: center.y };
    expect(coordinate.outerPointStillInHostRadius(coordRight)).toBeTruthy();

    coordRight = { x: center.x + 25, y: center.y };
    expect(coordinate.outerPointStillInHostRadius(coordRight)).toBeFalsy();

    let coordTop = { x: center.x, y: center.y - 24 };
    expect(coordinate.outerPointStillInHostRadius(coordTop)).toBeTruthy();

    coordTop = { x: center.x, y: center.y - 25 };
    expect(coordinate.outerPointStillInHostRadius(coordTop)).toBeFalsy();

    let coordBottom = { x: center.x, y: center.y + 24 };
    expect(coordinate.outerPointStillInHostRadius(coordBottom)).toBeTruthy();

    coordBottom = { x: center.x, y: center.y + 25 };
    expect(coordinate.outerPointStillInHostRadius(coordBottom)).toBeFalsy();

    const angle = 45;
    const coreWidth =  50;
    const x = Math.cos(angle * Math.PI / 180) * rect.width / 2;
    const y = Math.sin(angle * Math.PI / 180) * rect.width / 2;
    const tx = Math.cos(angle * Math.PI / 180) * coreWidth / 2;
    const ty = Math.sin(angle * Math.PI / 180) * coreWidth / 2;

    // Contact point at Q1 (4.30)
    let coordQ1 = { x: center.x + x - tx - 1, y: center.y + y - ty - 1 };
    expect(coordinate.outerPointStillInHostRadius(coordQ1)).toBeTruthy();

    coordQ1 = { x: center.x + x - tx, y: center.y + y - ty };
    expect(coordinate.outerPointStillInHostRadius(coordQ1)).toBeFalsy();

    // Contact point at Q2 (7.30)
    let coordQ2 = { x: center.x - x + tx + 1, y: center.y + y - ty - 1 };
    expect(coordinate.outerPointStillInHostRadius(coordQ2)).toBeTruthy();

    coordQ2 = { x: center.x - x + tx, y: center.y + y - ty };
    expect(coordinate.outerPointStillInHostRadius(coordQ2)).toBeFalsy();

    // Contact point at Q2 (10.30)
    let coordQ3 = { x: center.x - x + tx + 1, y: center.y - y + ty + 1 };
    expect(coordinate.outerPointStillInHostRadius(coordQ3)).toBeTruthy();

    coordQ3 = { x: center.x - x + tx, y: center.y - y + ty };
    expect(coordinate.outerPointStillInHostRadius(coordQ3)).toBeFalsy();

    // Contact point at Q2 (1.30)
    let coordQ4 = { x: center.x + x - tx - 1, y: center.y - y + ty + 1 };
    expect(coordinate.outerPointStillInHostRadius(coordQ4)).toBeTruthy();

    coordQ4 = { x: center.x + x - tx, y: center.y - y + ty };
    expect(coordinate.outerPointStillInHostRadius(coordQ4)).toBeFalsy();
  });
});

@Component({
  template: `<div ripple>RIPPLE</div>`,
  styles: [
    `:host div {
      width: 100px;
      height: 100px;
      border-radius: 5px;
      position: relative;
      left: 100px;
      top: 100px;
    }`
  ]
})
class TestRippleRectangleComponent {
  constructor(public elRef: ElementRef) {}
}

describe('RippleCoordinate - Rectangle Host:', () => {

  let fixture: ComponentFixture<TestRippleRectangleComponent>;
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
        TestRippleRectangleComponent
      ]
    });
    fixture = TestBed.createComponent(TestRippleRectangleComponent);
    directiveEl = fixture.debugElement.query(By.directive(RippleDirective));
    directive = directiveEl.injector.get(RippleDirective);
    fixture.detectChanges();
    ripple = directive.ripple;
    host = ripple.core.host;
    host.recalculate();
    fixture.detectChanges();
  });

  it('detect rectangle shaped host', () => {
    expect(host.isRound).toBeFalsy();
  });

  it('detect contact point outside/inside rectangle host correctly', () => {

    const { rect, center } = host;
    const { core } = ripple;
    const { coordinate } = core;
    const x = rect.width / 2;
    const y = rect.height / 2;

    const coordInsideTop = { x: center.x, y: center.y - y + 1 };
    expect(coordinate.centerStillIsInHostArea(coordInsideTop)).toBeTruthy();

    const coordOutsideTop = { x: center.x, y: center.y - y };
    expect(coordinate.centerStillIsInHostArea(coordOutsideTop)).toBeFalsy();

    const coordInsideBottom = { x: center.x, y: center.y + y - 1 };
    expect(coordinate.centerStillIsInHostArea(coordInsideBottom)).toBeTruthy();

    const coordOutsideBottom = { x: center.x, y: center.y + y };
    expect(coordinate.centerStillIsInHostArea(coordOutsideBottom)).toBeFalsy();

    const coordInsideLeft = { x: center.x - x + 1, y: center.y };
    expect(coordinate.centerStillIsInHostArea(coordInsideLeft)).toBeTruthy();

    const coordOutsideLeft = { x: center.x - x, y: center.y };
    expect(coordinate.centerStillIsInHostArea(coordOutsideLeft)).toBeFalsy();

    const coordInsideRight = { x: center.x + x - 1, y: center.y };
    expect(coordinate.centerStillIsInHostArea(coordInsideRight)).toBeTruthy();

    const coordOutsideRight = { x: center.x + x, y: center.y };
    expect(coordinate.centerStillIsInHostArea(coordOutsideRight)).toBeFalsy();
  });

  it('detect outer point correctly', () => {
    const { center } = host;
    const { core } = ripple;
    const { coordinate } = core;

    const element = ripple.core.element;
    core.renderer.setStyle(element, 'width', '50px');
    core.renderer.setStyle(element, 'height', '50px');

    let coordLeft = { x: center.x - 24, y: center.y };
    expect(coordinate.outerPointStillInHostRadius(coordLeft)).toBeTruthy();

    coordLeft = { x: center.x - 25, y: center.y };
    expect(coordinate.outerPointStillInHostRadius(coordLeft)).toBeFalsy();

    let coordRight = { x: center.x + 24, y: center.y };
    expect(coordinate.outerPointStillInHostRadius(coordRight)).toBeTruthy();

    coordRight = { x: center.x + 25, y: center.y };
    expect(coordinate.outerPointStillInHostRadius(coordRight)).toBeFalsy();

    let coordTop = { x: center.x, y: center.y - 24 };
    expect(coordinate.outerPointStillInHostRadius(coordTop)).toBeTruthy();

    coordTop = { x: center.x, y: center.y - 25 };
    expect(coordinate.outerPointStillInHostRadius(coordTop)).toBeFalsy();

    let coordBottom = { x: center.x, y: center.y + 24 };
    expect(coordinate.outerPointStillInHostRadius(coordBottom)).toBeTruthy();

    coordBottom = { x: center.x, y: center.y + 25 };
    expect(coordinate.outerPointStillInHostRadius(coordBottom)).toBeFalsy();
  });
});
