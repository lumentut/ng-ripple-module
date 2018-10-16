## Ng-Ripple-Module

An Angular ripple module as an alternative of available material design ripple.

### Installation
1.Install this module by running the following command:
```shell
npm i ng-ripple-module
```

2.Import `NgRippleModule` in your application's main `@NgModule` and `BrowserAnimationsModule` (if is not imported yet).
```ts
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgRippleModule } from 'ng-ripple-module';

@NgModule({
   ...
   imports: [
      ...
      BrowserAnimationsModule,
      NgRippleModule
   ]
})
export class MyModule { ... }
```
Now you're ready to use this module
## Directive 

This module provides you a single `ripple` directive to easily attach ripple component with its ripple effects into your application `HTMLElement` tag. You can freely decorate the shape, color or the other style properties of your element by using your style sheet. <br>
The directive provides you a customizable `background` layer for your element active state and insert `activated` class at your host tag during `touch` or `click` event.
<br>
Example: <br>
```html
  <button ripple ....></button>
```
```html
  <a href="..." ripple ....></a>
```
<br>

## Available Inputs and Attributes
### `light`
Basically, the module is shipped out with `dark` ripple effect. If you need a light/white ripple effect, just use `light` attributes as follow:
```html
  <button ripple light ...>...</button>
```

### `centered-ripple`
This attribute is used to make your ripple effect start from the center of your touched/clicked element.
```html
  <a href="..." ripple centered-ripple ...> ... </a>
```

### `fixed-ripple`
For some reason, you need a fixed ripple effect, let's say for a list item element. In this case, `fixed-ripple` attributes will help you a lot.
```html
  <ul ...>
    <li ripple fixed-ripple ...> ... </li>
    ...
  </ul>
```

### `rippleBgColor & activeBgColor`
If you need a custom ripple effect color, you can customize the ripple effect using `rippleBgColor` and/or `activeBgColor`.
```html
  <button ... ripple 
    rippleBgColor={{_rippleBgColor}}
    activeBgColor={{_activeBgColor}}>
    ...
  </button>
```

### `fillTransition, splashTransition, fadeTransition`
Ripple effect highly depend on transition. Different time selection/transition will provide you different ripple effect too.<br><br>
<b>`fillTransition`</b> is an input of ripple fill in effect which consist of a `transition-duration` value.<br><br>
<b>`splashTransition`</b> is a ripple splash effect input.The value have to contains both `transition-duration` and `transition-timing-function` sequentially.<br><br>
<b>`fadeTransition`</b> is for ripple both fadeout and fadein transition in a `transition-duration` value.<br>
<br>
 Example:
```html
  <button ripple light fixed-centered
    fillTransition="1000ms"
    splashTransition="70ms cubic-bezier(0.4, 0.0, 0.2, 1)"
    fadeTransition="250ms">
    ...
  </button>
```
This website `http://cubic-bezier.com/` is a great tool to visualize and make experiments of `transition-timing-function`.<br>
### `clickEmitDelay`
For mouse click event, by default will trigger an `rclick` event after `250ms`. You can use `clickEmitDelay` to customize your desired click delay event.
```html
  <button ripple light centered-ripple
    (rclick)="onClick($event)"
    clickEmitDelay="0ms">
        ...
  </button>
```
### `clickAndSplashTransition`
Ripple effect of mouse click event can be customized by using this input.
```html
  <button ripple light centered-ripple
    clickAndSplashTransition="250ms ease-out"
    (rclick)="onClick($event)">
        ...
  </button>
```

### `tapLimit`
This input is used in determining limit of `rtap` event. Touch event that more than this limit will be considered as `rpress`

## Available Events (`rtap`, `rpress`, `rpressup`, `rclick`)
This module provides you custom events that will emitted after your ripple effect animation completed. Of course you still can use default events ( eg. `tap` and `press` for Ionic Apps or `click` for mouse device). The events have `r` prefix to distinguish from default event.

## Custom Event Returned Object `($event)`
Every event provides by this module will returned a custom event object. The returned value is an `RippleEvent` object as shown below:
```ts
target: HTMLElement;      // your host element
type: string;         // rtap | rpress | rpressup | rclick
timestamp: number;      // timestamp when the event emitted
clientX: number;      // center coordinate X of your host element
clientY: number;      // center coordinate Y of your host element
clientRect: ClientRect;   // host element ClientRect detail data
```
## Examples
Below are examples of ripple directive in Ionic (3) application.

```html
// styling at your app.scss
 .circle {
  width: 250px;
    height: 250px;
    border-radius: 50%; 
 }
 
 // at your template
 <a href="#" ripple light centered-ripple 
  class="circle button-md-primary">
 </a>
```

Examples of  ripple at button tag without ionic button directive (utilization of ionic md styling class) 
```html
<button ripple light class="disable-hover button button-md button-default button-default-md button-large button-large-md button-md-primary">
    Default
</button>
```

```html
<button ripple class="disable-hover button button-md button-default button-default-md button-block button-block-md button-md-light">
  Default
</button>
```

```html
<button ripple light class="disable-hover button button-md button-large button-large-md button-round button-round-md button-md-secondary">
  <span class="button-inner">
    <ion-icon name="home" role="img" 
          class="icon icon-md ion-md-home" 
            aria-label="home">
        </ion-icon>
        Home
  </span>
</button>
```

```html
<button color="light" ripple icon-start class="disable-hover button button-md button-default button-default-md button-md-light">
  <span class="button-inner">
    <ion-icon name="arrow-back" role="img" 
          class="icon icon-md ion-md-arrow-back" aria-label="arrow back">
        </ion-icon>
        Back
  </span><div class="button-effect"></div>
</button>
```

It works!  :) God Bless You.


<br>
Thank You. <br>
INDNJC,<br>
Kota Wisata 2018.