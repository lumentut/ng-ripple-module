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
import { GLOBAL_RIPPLE_CONFIGS, RippleConfigs } from '@ng-ripple-module/ripple.configs';


const configs: RippleConfigs = {
  backgroundIncluded: false
};

@Component({
  template: `<a href="#" ripple></a>`,
  styles: [
    `:host a {
      width: 250px;
      height: 250px;
      border-radius: 50%;
      position: relative;
    }`
  ],
  providers: [
    {provide: GLOBAL_RIPPLE_CONFIGS, useValue: configs}
  ]
})
class RippleTestComponent {
  constructor(public elRef: ElementRef) {}
}

describe('T08 - No background component option test', () => {

  let component: RippleTestComponent;
  let fixture: ComponentFixture<RippleTestComponent>;
  let directiveEl: DebugElement;
  let directive: RippleDirective;
  let hostElement: HTMLElement;

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
    component = fixture.componentInstance;
    directiveEl = fixture.debugElement.query(By.directive(RippleDirective));
    directive = directiveEl.injector.get(RippleDirective);
    hostElement = component.elRef.nativeElement.children[0];

    fixture.detectChanges();

  }));

  it('create no background element on mountElement', () => {
    directive.ripple.mountElement();
    fixture.detectChanges();
    const children = hostElement.children;
    expect(children[0].localName).toEqual('ripple-core');
    expect(children.length).toBe(1);
  });

  it('remove core element after dismountElement', () => {
    directive.ripple.mountElement();
    fixture.detectChanges();
    directive.ripple.dismountElement();
    fixture.detectChanges();
    expect(hostElement.children.length).toBe(0);
  });

});
