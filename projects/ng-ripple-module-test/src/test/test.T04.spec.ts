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
import { RippleMotionTracker } from '@ng-ripple-module/ripple.tracker';

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

describe('T04 - Directive listen to Tap, Click, Press, and Press Up test', () => {

  let component: RippleTestComponent;
  let fixture: ComponentFixture<RippleTestComponent>;	
  let directiveEl: DebugElement;	
  let directive: RippleDirective;
  let motionTracker: RippleMotionTracker;

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
    motionTracker = directive.ripple.tracker;

    fixture.detectChanges();
  
  }));

  // const pointerEvent: PointerEvent = {
  //   pointerType: 'mouse',

  // }

  it('recognize rtap action', () => {

    motionTracker.pointerDownTimeStamp = 0;
    
  });

});
