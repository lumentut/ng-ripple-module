import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-ripple-module';
  cardTitle = 'Angular';
  onTap(event: any) {
    console.log(event)
  }

  onPress(event: any) {
    console.log(event)
  }

  onClick(event: any) {
    console.log(event)
  }
}
