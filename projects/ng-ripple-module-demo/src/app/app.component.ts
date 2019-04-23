import { Component,ViewChild } from '@angular/core';
import { RippleDirective } from '@ng-ripple-module/ripple.directive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'ng-ripple-module';
  cardTitle = 'Angular';

  constructor() {
    console.log(this)
  }
  onTap(event: any) {
    console.log(event)
  }

  onPress(event: any) {
    console.log(event)
  }

  onPressup(event: any) {
    console.log(event)
  }

  onClick(event: any) {
    console.log(event)
  }
}
