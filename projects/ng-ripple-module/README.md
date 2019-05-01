## Ng-Ripple-Module

An Angular ripple module as an alternative of available material design ripple.

### Installation
1. Install this module by running the following command:
```shell
npm i ng-ripple-module
```

2. Import `NgRippleModule` at your application's `@NgModule`. Since the library depends heavily on browser animation, please make sure that you import `BrowserAnimationsModule` too. 
```ts
...
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgRippleModule } from 'ng-ripple-module';
...

@NgModule({
   ...
   imports: [
      ...
      BrowserModule,
      BrowserAnimationsModule,
      NgRippleModule
      ...
   ],
   ...
})
export class MyModule { ... }
```
Now you're ready to spread the ripple easily in your angular app.<br>
### Wiki
For more detail information, please read the [wiki](https://github.com/yohaneslumentut/ng-ripple-module/wiki).

### Demo
Please visit the demo page [here](https://yohaneslumentut.github.io/ng-ripple-module/).

<br>
It works! God Bless You :)
<br>

<br>
Thank You. <br>
INDNJC,<br>
Kota Wisata, October 2018.
