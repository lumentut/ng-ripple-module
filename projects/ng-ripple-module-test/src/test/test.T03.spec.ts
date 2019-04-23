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

describe('T03 - Directive: Mount/Dismount Core Element and Background Element', () => {

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

  it('create Element on mountElement', () => {

    directive.ripple.mountElement();
    fixture.detectChanges();

    const children = hostElement.children;
    const expectedChildren = ['ripple-core', 'ripple-bg'];

    expect(expectedChildren).toContain(children[0].localName);
    expect(expectedChildren).toContain(children[1].localName);
    
  });

  it('remove element after dismountElement', () => {
    
    directive.ripple.mountElement();
    fixture.detectChanges();
    directive.ripple.dismountElement();
    fixture.detectChanges();

    expect(hostElement.children.length).toBe(0);

  });

});
