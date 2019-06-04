import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AfterViewInit, Component, ElementRef, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { BrowserModule, By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgRippleModule } from '@ng-ripple-module/ng-ripple.module';
import { Ripple } from '@ng-ripple-module/ripple';
import { RippleConfigs } from '@ng-ripple-module/ripple.configs';
import { RippleEffect } from '@ng-ripple-module/ripple.effect';
import { RippleFactory } from '@ng-ripple-module/ripple.factory';

const TEST_COLOR = 'rgba(0,0,0,0.08)';
const TEST_OPACITY = 0.5;

@Component({
  selector: 'app-ripple-cmp',
  template: `<ng-content></ng-content>`,
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
class TestDecoratorComponent extends RippleEffect implements AfterViewInit, OnDestroy {

  configs: RippleConfigs;
  ripple: Ripple;

  constructor(
    elRef: ElementRef,
    rippleFactory: RippleFactory
  ) {
    super(elRef, rippleFactory);
  }

  ngAfterViewInit() {
    super.initialize();
    super.subscribe();
  }

  ngOnDestroy() {
    super.destroy();
  }
}

@Component({
  template: `<app-ripple-cmp #rippleCmp
    [rippleColor]="color"
    [splashOpacity]="opacity"
    (rtap)="onTap($event)"
    (rpress)="onPress($event)"
    (rpressup)="onPressup($event)"
    (rclick)="onClick($event)"
    fixed></app-ripple-cmp>`,
  styles: [
    `:host div {
      width: 200px;
      height: 200px;
      top: 100;
      left: 100;
    }`
  ]
})
class TestContainerComponent {
  color = TEST_COLOR;
  opacity = TEST_OPACITY;

  @ViewChild('rippleCmp') rippleCmp;

  constructor(public elRef: ElementRef) {}
}

describe('RippleEffect:', () => {
  let component: TestContainerComponent;
  let fixture: ComponentFixture<TestContainerComponent>;
  let decoratorCmp: TestDecoratorComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        NgRippleModule
      ],
      declarations: [
        TestDecoratorComponent,
        TestContainerComponent
      ]
    });
    fixture = TestBed.createComponent(TestContainerComponent);
    component = fixture.componentInstance;
    decoratorCmp = component.rippleCmp;
    fixture.detectChanges();
  });

  it('should create ripple instance', () => {
    const debugElement = fixture.debugElement.query(By.directive(TestDecoratorComponent));
    expect(debugElement.nativeElement.tagName).toEqual('APP-RIPPLE-CMP');
    expect(component.rippleCmp.ripple).not.toBeUndefined();
  });

  it('should have element reference', () => {
    expect(decoratorCmp.elRef.nativeElement).not.toBeUndefined();
  });

  it('should have ripple factory', () => {
    expect(decoratorCmp.rippleFactory).not.toBeUndefined();
  });

  it('should have custom configs and have attribute and input binding', () => {
    expect(decoratorCmp.configs).not.toBeUndefined();
    const configs: any = decoratorCmp.configs;
    expect(configs.backgroundColor).toEqual(TEST_COLOR);
    expect(configs.splashOpacity).toEqual(TEST_OPACITY);
    expect(configs.fixed).toBeTruthy();
  });
});
