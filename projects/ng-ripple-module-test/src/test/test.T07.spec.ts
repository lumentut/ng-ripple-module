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
import { Ripple } from '@ng-ripple-module/ripple';
import { RippleHost } from '@ng-ripple-module/ripple.host';
import { HostType } from '@ng-ripple-module/ripple-core.component';

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
class RippleRoundComponent {
  constructor(public elRef: ElementRef) {}
}

@Component({
  template: `<a href="#" ripple></a>`,
  styles: [
    `:host a {
      width: 250px;
      height: 250px;
      border-radius: 3px;
      position: relative;
    }`
  ]
})
class RippleRectangleComponent {
  constructor(public elRef: ElementRef) {}
}

describe('T07 - Host Element shape and contact position detection test', () => {

  let fixtureRound: ComponentFixture<RippleRoundComponent>;
  let fixtureRectangle: ComponentFixture<RippleRectangleComponent>;
  let directiveRoundEl: DebugElement;
  let directiveRectangleEl: DebugElement;
  let directiveRound: RippleDirective;
  let directiveRectangle: RippleDirective;
  let roundHost: RippleHost;
  let rectangleHost: RippleHost;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        RippleRoundComponent,
        RippleRectangleComponent
      ],
      imports: [
        BrowserAnimationsModule,
        NgRippleModule
      ],
      providers: []
    }).compileComponents();

    fixtureRound = TestBed.createComponent(RippleRoundComponent);
    directiveRoundEl = fixtureRound.debugElement.query(By.directive(RippleDirective));
    directiveRound = directiveRoundEl.injector.get(RippleDirective);
    fixtureRound.detectChanges();

    fixtureRectangle = TestBed.createComponent(RippleRectangleComponent);
    directiveRectangleEl = fixtureRectangle.debugElement.query(By.directive(RippleDirective));
    directiveRectangle = directiveRectangleEl.injector.get(RippleDirective);
    fixtureRectangle.detectChanges();

    roundHost = directiveRound.ripple.host;
    rectangleHost = directiveRectangle.ripple.host;
  }));

  it('detect round shaped host', () => {
    expect(directiveRound.ripple.core.hostType).toEqual(HostType.ROUND);
  });

  it('detect contact point outside/inside round host correctly', () => {

    const angle = 45;
    const rect = roundHost.rect;
    const center = roundHost.center;
    const x = Math.cos(angle * Math.PI / 180) * rect.width / 2;
    const y = Math.sin(angle * Math.PI / 180) * rect.width / 2;

    // Contact point at Q1 (4.30)
    const coordInsideQ1 = { x: center.x + x, y: center.y + y };
    expect(directiveRound.ripple.core.centerCoordinateStillIsInHostArea(coordInsideQ1)).toBeTruthy();

    const coordOutsideQ1 = { x: center.x + x + 1, y: center.y + y + 1};
    expect(directiveRound.ripple.core.centerCoordinateStillIsInHostArea(coordOutsideQ1)).toBeFalsy();

    // Contact point at Q2 (7.30)
    const coordInsideQ2 = { x: center.x - x, y: center.y + y };
    expect(directiveRound.ripple.core.centerCoordinateStillIsInHostArea(coordInsideQ2)).toBeTruthy();

    const coordOutsideQ2 = { x: center.x - x - 1, y: center.y + y + 1};
    expect(directiveRound.ripple.core.centerCoordinateStillIsInHostArea(coordOutsideQ2)).toBeFalsy();

    // Contact point at Q3 (10.30)
    const coordInsideQ3 = { x: center.x - x + 1, y: center.y - y + 1 };
    expect(directiveRound.ripple.core.centerCoordinateStillIsInHostArea(coordInsideQ3)).toBeTruthy();

    const coordOutsideQ3 = { x: center.x - x, y: center.y - y };
    expect(directiveRound.ripple.core.centerCoordinateStillIsInHostArea(coordOutsideQ3)).toBeFalsy();

    // Contact point at Q4 (1.30)
    const coordInsideQ4 = { x: center.x + x - 1, y: center.y - y + 1 };
    expect(directiveRound.ripple.core.centerCoordinateStillIsInHostArea(coordInsideQ4)).toBeTruthy();

    const coordOutsideQ4 = { x: center.x + x, y: center.y - y };
    expect(directiveRound.ripple.core.centerCoordinateStillIsInHostArea(coordOutsideQ4)).toBeFalsy();
  });

  it('detect rectangle shaped host', () => {
    expect(directiveRectangle.ripple.core.hostType).toEqual(HostType.RECTANGLE);
  });

  it('detect contact point outside/inside rectangle host correctly', () => {

    const rect = rectangleHost.rect;
    const center = rectangleHost.center;
    const x = rect.width / 2;
    const y = rect.height / 2;

    const coordInsideTop = { x: center.x, y: center.y - y + 1 };
    expect(directiveRectangle.ripple.core.centerCoordinateStillIsInHostArea(coordInsideTop)).toBeTruthy();

    const coordOutsideTop = { x: center.x, y: center.y - y };
    expect(directiveRectangle.ripple.core.centerCoordinateStillIsInHostArea(coordOutsideTop)).toBeFalsy();

    const coordInsideBottom = { x: center.x, y: center.y + y - 1 };
    expect(directiveRectangle.ripple.core.centerCoordinateStillIsInHostArea(coordInsideBottom)).toBeTruthy();

    const coordOutsideBottom = { x: center.x, y: center.y + y };
    expect(directiveRectangle.ripple.core.centerCoordinateStillIsInHostArea(coordOutsideBottom)).toBeFalsy();

    const coordInsideLeft = { x: center.x - x + 1, y: center.y };
    expect(directiveRectangle.ripple.core.centerCoordinateStillIsInHostArea(coordInsideLeft)).toBeTruthy();

    const coordOutsideLeft = { x: center.x - x, y: center.y };
    expect(directiveRectangle.ripple.core.centerCoordinateStillIsInHostArea(coordOutsideLeft)).toBeFalsy();

    const coordInsideRight = { x: center.x + x - 1, y: center.y };
    expect(directiveRectangle.ripple.core.centerCoordinateStillIsInHostArea(coordInsideRight)).toBeTruthy();

    const coordOutsideRight = { x: center.x + x, y: center.y };
    expect(directiveRectangle.ripple.core.centerCoordinateStillIsInHostArea(coordOutsideRight)).toBeFalsy();
  });
});
