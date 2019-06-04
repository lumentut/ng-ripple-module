import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { NgRippleModule } from '@ng-ripple-module/ng-ripple.module';
import { MdlFlatBtnComponent } from './buttons/mdl.flat.btn.component';
import { MdlRaisedBtnComponent } from './buttons/mdl.raised.btn.component';
import { MdlColoredBtnComponent } from './buttons/mdl.colored.btn.component';
import { MdlTitleCardComponent } from './cards/mdl.title.card';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgRippleModule
      ],
      declarations: [
        AppComponent,
        MdlFlatBtnComponent,
        MdlRaisedBtnComponent,
        MdlColoredBtnComponent,
        MdlTitleCardComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
