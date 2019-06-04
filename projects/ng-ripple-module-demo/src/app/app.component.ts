import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'ng-ripple-module';
  cardTitle = 'Angular';
  version = 'v.1.0.1';

  constructor() {
    console.log(this);
  }

  goTo(event: any) {
    window.location.href = event.navLink;
  }

  onTap(event: any) {
    console.log(event);
  }

  onPress(event: any) {
    console.log(event);
  }

  onPressup(event: any) {
    console.log(event);
  }

  onClick(event: any) {
    console.log(event);
  }
}
