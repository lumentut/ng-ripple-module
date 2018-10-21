## Ng-Ripple-Module

An Angular ripple module as an alternative of available material design ripple.

### Installation
1.Install this module by running the following command:
```shell
npm i ng-ripple-module
```

2.Import `NgRippleModule` in your application's main `@NgModule` and `BrowserAnimationsModule` (if not imported yet).
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

This module provides you a single `ripple` directive so you can attach ripple component and its ripple effects easily into your application `HTMLElement` tag. You can freely decorate the shape, the color or the other style properties of your element by using your style sheet. <br>
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

## Element Positioning
To make this module works correctly, don't forget to set your nest element style position into a relatively positioned
```html
   your_nest_element {
      ...
      position: relative;
      ...
   }
```
<br>

## Available Inputs and Attributes
### `light`
Basically, the module is shipped out with `dark` ripple effect. If you need a light/white ripple effect, just use `light` attribute.
```html
  <button ripple light ...>...</button>
```

### `centered-ripple`
This attribute is used to make your ripple effect start from the center of your touched/clicked element.
```html
  <a href="..." ripple centered-ripple ...> ... </a>
```

### `fixed-ripple`
For some reason, you need a fixed ripple effect, let's say for a scrollable list item element. In this case, `fixed-ripple` attribute will help you a lot.
```html
  <ul ...>
    <li ripple fixed-ripple ...> ... </li>
    ...
  </ul>
```

### `rippleBgColor & activeBgColor`
If you need a custom ripple effect color, you can make a custom ripple effect using `rippleBgColor` and/or `activeBgColor`.
```html
  <button ... ripple 
    rippleBgColor={{ your_desired_ripple_bg_color }}
    activeBgColor={{ your_desired_active_bg_color }}>
    ...
  </button>
```

### `fillTransition, splashTransition, fadeTransition`
The Ripple effect is highly depend on transition/timing. Different time selection/transition will provide you different ripple effect too. This module provides you default transitions/timing but you can make experiments as you like.<br><br>
<b>`fillTransition`</b> is an input of ripple fill-in effect which consist of a `transition-duration` value.<br><br>
<b>`splashTransition`</b> is a ripple splash effect input. The value have to contain of both `transition-duration` and `transition-timing-function` sequentially.<br><br>
<b>`fadeTransition`</b> is for ripple both fadeout and fadein transition in a `transition-duration` value.<br>
<br>
 Example:
```html
  <button ripple light fixed-ripple
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
This input is used in determining limit of `rtap` event. Touch event that take place more than this limit will be emitted as `rpress` event.

## Available Events (`rtap`, `rpress`, `rpressup`, `rclick`)
This module provides you custom events that will emitt after your ripple effect animation completed. Of course you still can use default events ( eg. `tap` and `press` for Ionic Apps or `click` for mouse device). The events have `r` prefix to distinguish from default event.

## Custom Event Returned Object `($event)`
Every event provides by this module will return a custom event object. The returned value is an `RippleEvent` object as shown below:
```ts
target: HTMLElement;      // your host element
type: string;             // rtap | rpress | rpressup | rclick
timestamp: number;        // timestamp when the event emitted
clientX: number;          // center coordinate X of your host element
clientY: number;          // center coordinate Y of your host element
clientRect: ClientRect;   // host element ClientRect detail data
```
## Examples
Below are examples of ripple directive in Ionic (3) application. Dont't forget to set the host element style position property into `relative`;

```ts

...

@Component({
  selector: 'page-home',
  styles: [
    `:host .circle {
      width: 250px;
      height: 250px;
      border-radius: 50%;
      position: relative;
    }`,
    `:host .rectangle.card {
      width: 100%;
      height: 156px;
      border-radius: 5px;
      position: relative;
      margin: 0;
    }`,
    `:host ul {
      padding: 0;
    }`,
    `:host li {
      height: 70px;
      line-height: 70px;
    }`
  ],
  template: `
    <ion-header>
      ...
    </ion-header>
    <ion-content padding>

    ...

    <h2>Centered Ripple</h2>
    <p>
      <a href="#" ripple light centered-ripple
        class="circle button-md-primary"
        (rtap)="onTap($event)"
        (rpress)="onPress($event)"
        (rpressup)="onPressup($event)">
      </a>
    </p>
    <br>

    <h2>Draggable ripple</h2>
    <p>
      <a href="#" ripple light 
        class="circle button-md-primary"
        (rtap)="onTap($event)"
        (rpress)="onPress($event)"
        (rpressup)="onPressup($event)">
      </a>
    </p>
    <br>

    <h2>Fixed/Scrollable ripple</h2>
    <p>
      <a href="#" ripple light  fixed-ripple
        class="circle button-md-primary"
        (rtap)="onTap($event)"
        (rpress)="onPress($event)"
        (rpressup)="onPressup($event)">
      </a>
    </p>
    <br>
    <p>
      <a href="#" ripple fixed-ripple
        fillTransition="1000ms linear"
        splashTransition="250ms linear"
        class="rectangle card card-md"
        (rtap)="onTap($event)"
        (rpress)="onPress($event)"
        (rpressup)="onPressup($event)">
      </a>
    </p>

    <br>
    <h2>List Item</h2>
    <ul>
      <li *ngFor="let item of [1,2,3,4,5,6,7]" (rtap)="itemTap($event)"
        class="item item-block item-md"
        ripple fixed-ripple
        rippleBgColor="rgba(0,0,0,0.05)"
        activeBgColor="rgba(0,0,0,0.035)"
        fillTransition="1500ms linear"
        splashTransition="180ms cubic-bezier(0.2,0.05,0.2,1)"
        >
        List Item {{item}}
      </li>
    </ul>

    <br>
    <h2>Fixed/ Un-scrollable Button</h2>
    <button ripple light class="disable-hover button button-md button-default 
      button-default-md button-large button-large-md button-md-primary">
      Default
    </button>

    <br>
    <button ripple light class="disable-hover button button-md button-default 
      button-default-md button-large button-large-md button-md-dark">
      Default
    </button>

    <br>
    <button ripple class="disable-hover button button-md button-default 
      button-default-md button-large button-large-md button-md-light">
      Default
    </button>

    <br>
    <button ripple class="disable-hover button button-md button-default 
      button-default-md button-block button-block-md button-md-light">
      Default
    </button>

    <br>
    <button ripple light 
      class="disable-hover button button-md button-large button-large-md 
      button-round button-round-md button-md-secondary">
      <span class="button-inner">
        <ion-icon name="home" role="img" 
              class="icon icon-md ion-md-home" 
                aria-label="home">
            </ion-icon>
            Home
      </span>
    </button>
    <br>
    
    <br>
    <h2>Ionic button</h2>
    <p>It is better not to use ion-button directive directly. <br>
       It is highly recomended to use its css class instead. These are for example only. <br>
       Otherwise, you will get a double ripple effect. <br>
       The original of Ionic ripple effect will appear while you run in desktop browser.<p>
    <p>
      <button ion-button color="light" block ripple>Light</button>
    </p>

    <p>
      <button ion-button block ripple light>Default</button>
    </p>

    <p>
      <button ion-button color="secondary" block ripple light>Secondary</button>
    </p>

    <p>
      <button ion-button color="danger" block ripple light>Danger</button>
    </p>

    <p>
      <button ion-button color="dark" block ripple light>Dark</button>
    </p>

    <p>
      <button ion-button color="light" clear ripple>Light</button>
    </p>

    <p>
      <button ion-button clear ripple>Default</button>
    </p>

    <p>
      <button ion-button color="secondary" clear ripple>Secondary</button>
    </p>

    <p>
      <button ion-button color="danger" clear ripple>Danger</button>
    </p>

    <p>
      <button ion-button color="dark" clear ripple>Dark</button>
    </p>

    <p>
      <button ion-button color="light" outline ripple>Light</button>
    </p>

    <p>
      <button ion-button outline ripple>Default</button>
    </p>

    <p>
      <button ion-button color="secondary" outline ripple>Secondary</button>
    </p>

    <p>
      <button ion-button color="danger" outline ripple>Danger</button>
    </p>

    <p>
      <button ion-button color="dark" outline ripple>Dark</button>
    </p>

    <p>
      <button ion-button color="light" small ripple>Light Small</button>
    </p>
    <p>
      <button ion-button small ripple light>Default Small</button>
    </p>
    <p>
      <button ion-button color="secondary" ripple light>Secondary Medium</button>
    </p>

    <p>
      <button ion-button color="danger" medium ripple light>Danger Medium</button>
    </p>
    <p>
      <button ion-button color="dark" large ripple light>Dark Large</button>
    </p>

    ...

    </ion-content>

  `
})
export class HomePage {

  ...

  onTap(event: any){
    console.log(event.type)
  }

  onPress(event: any){
    console.log(event.type)
  }

  onPressup(event: any){
    console.log(event.type)
  }
  
  itemTap(event: any){
    console.log(event)
  }

  ...

}
```

Examples of  ripple at button tag without ionic button directive (utilization of ionic md styling class).<br>
Or you can create your own reusable directive to write the `md classes` into your element for you. 

```html
<button ripple light 
   class="disable-hover button button-md button-default 
   button-default-md button-large button-large-md button-md-primary">
   Default
</button>
```

```html
<button ripple 
  class="disable-hover button button-md button-default
  button-default-md button-block button-block-md button-md-light">
  Default
</button>
```

```html
<button ripple light 
  class="disable-hover button button-md button-large button-large-md
  button-round button-round-md button-md-secondary">
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
<button color="light" ripple icon-start
  class="disable-hover button button-md button-default
  button-default-md button-md-light">
  <span class="button-inner">
    <ion-icon name="arrow-back" role="img" 
          class="icon icon-md ion-md-arrow-back" aria-label="arrow back">
        </ion-icon>
        Back
  </span><div class="button-effect"></div>
</button>
```
<br>
It works! God Bless You  :)

<br>


<br>
Thank You. <br>
INDNJC,<br>
Kota Wisata, October 2018.
