## Ng-Ripple-Module

An Angular ripple module as an alternative of available material design ripple.

### Installation
1. Install this module by running the following command:
```shell
npm i ng-ripple-module
```

2. Import `NgRippleModule` in your application's main `@NgModule` and `BrowserAnimationsModule` (if not imported yet) at your `project_root/src/app/app.modules.ts`. 
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
Now you're ready to spread the ripple easily in your angular app.
## Directive 

This module provides you a single `ripple` directive so you can attach ripple component and its ripple effects easily into your application `HTMLElement` tag. You can freely decorate the shape, the color or the other style properties of your element by using your style sheet. <br>
The directive provides you a customizable `background` layer for your element active state and insert `activated` class at your host tag during `touch` or `click` event.
<br>
Example: <br>
```html
  <button ripple ....></button>
```
```html
  <a navlink="/home" ripple ....></a>
```
<br>

## Element Positioning
Both `ripple-core` element and `ripple-bg` element are positioned using the `top`, and `left` properties. So you have to make sure that the nest element position method property is `relative` positioned to make the ripple and its background reside correctly in the nest.<br>
As an alternative, you can use a reusable class and put at `your_project_root/src/style.scss` and then use it together with the `ripple` directive.

```html
// your_project_root/src/style.scss
.relative {
   position: relative;
}

// somewhere in your component template ... .html
<button ripple class="relative">
   ...
</button>
```
## Element Dimension
Since the ripple and it's background component get dimension from its nest parent, then you have to make sure that the nest element have a dimension that can be used by ripple component as a dimension reference.
<br>

## Available Inputs and Attributes
### `navlink`
If you apply the ripple directive to a HTML `<a>` tag which is commonly used as a navigation link, you have to use `navlink` instead of `href`. It is in order to prevent default behavior of the `<a>` tag and emmit the event only after the `ripple-bg` fadeout completely. Then, call a method to process the event and navigate to the specified link page.
```html
   <a navlink="/home" ripple light
      ...
      (rclick)="goBack($event)"
      (rtap)="goBack($event)">
      Back
   </a>
```
```ts
   ...
   import  { Router } from '@angular/router';
   ...
   export default SecondPage {
      ...
      constructor(private router: Router) { 
         ... 
      }
      ...
      goBack(event: any) {
         this.router.navigateByUrl(event.navLink);
      }
      ...
   }
```

### `light`
Basically, the module is shipped out with `dark` ripple effect. If you need a light/white ripple effect, just use `light` attribute.
```html
  <button ripple light ...>...</button>
```

### `centered-ripple`
This attribute is used to make your ripple effect start from the center of your touched/clicked element.
```html
  <a navlink="/next-page" ripple centered-ripple ...> ... </a>
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

### `fillTransition, splashTransition, fadeTransition, bgFadeTransition`,
The Ripple effect is highly depend on transition/timing. Different time selection/transition will provide you different ripple effect too. This module provides you default transitions/timing but you can make experiments as you like.<br><br>
<b>`fillTransition`</b> is an input of ripple fill-in effect which consist of a `transition-duration` value.<br><br>
<b>`splashTransition`</b> is a ripple splash effect input. The value have to contain of both `transition-duration` and `transition-timing-function` sequentially.<br><br>
<b>`fadeTransition`</b> is for ripple both fadeout and fadein transition in a `transition-duration` value.<br>
<b>`bgFadeTransition`</b> is for baground both fadeout and fadein transition in a `transition-duration` value.<br><br>
The action response time (pointer up to emit the event) is total of `splashTransition` || `fadeTransition` duration and `bgFadeTransition` duration. If the pointer up take place while the ripple still in fill phase (ripple scale < 1), the response time duration is `splashTransition` + `bgFadeTransition`. If the pointer up action is in idle phase (ripple scale = 1), the response time will be `fadeTransition` + `bgFadeTransition`.
<br>
 Example:
```html
  <button ripple light fixed-ripple
    fillTransition="1000ms"
    splashTransition="70ms cubic-bezier(0.4, 0.0, 0.2, 1)"
    fadeTransition="250ms"
    bgFadeTransition="150ms">
    ...
  </button>

  // Total response time of above customizations are:
  // Response time at fill phase = 70ms + 150ms;
  // Response time at idle phase = 250ms + 150ms;

```
Note: This website `http://cubic-bezier.com/` is a great tool to visualize and make experiments of `transition-timing-function`.<br>

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
navLink: string           // host element navigation link
```

## Custom Component
As the other developer who don't like to write repetives code, we can utilize the `ripple` directive at a custom component.

```ts
...

@Component({
  selector: 'back-btn',
  template: `
    <button ripple light
      fillTransition="{{ _fillTransition }}"
      splashTransition="{{ _splashTransition }}"
      (rtap)="back($event)"
      (rpressup)="back($event)"
      (rclick)="back($event)"
      >
      <ion-icon name="{{ _iconName }}"></ion-icon>
    </button>`
  ,
  styles: [
    `:host {
      position: fixed;
      display: block;
      width: 70px;
      height: 70px;
      margin-top: -35px;
      margin-left: -16px;
    }`,
    `:host button {
      color: #fff;
      padding: 0;
      width: inherit;
      height: inherit;
      font-size: 2rem;
      font-weight: bold;
      border-radius: 50%;
      background-color: transparent;
      position: relative;
      overflow: hidden;
    }`
  ]
})
export class BackBtnComponent {
   ...
   _fillTransition: string = ...
   _splashTransition: string = ...
   _iconName: string = ...
   ...
   back(event: RippleEvent) {
    // back action code
   }
}

```
Then you can use it at somewhere in your html template.
```html
   ...
   <back-btn></back-btn>
   ...
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
      <button ripple light centered-ripple
        class="circle button-md-primary"
        (rtap)="onTap($event)"
        (rpress)="onPress($event)"
        (rpressup)="onPressup($event)">
      </button>
    </p>
    <br>

    <h2>Draggable ripple</h2>
    <p>
      <button ripple light 
        class="circle button-md-primary"
        (rtap)="onTap($event)"
        (rpress)="onPress($event)"
        (rpressup)="onPressup($event)">
      </button>
    </p>
    <br>
    <p>
      <button ripple
        fillTransition="1000ms linear"
        rippleBgColor="rgba(0,0,0,0.05)"
        activeBgColor="rgba(0,0,0,0.035)"
        class="rectangle card card-md"
        (rtap)="onTap($event)"
        (rpress)="onPress($event)"
        (rpressup)="onPressup($event)">
      </button>
    </p>
    <br>

    <h2>Fixed/Scrollable ripple</h2>
    <p>
      <button ripple light  fixed-ripple
        class="circle button-md-primary"
        (rtap)="onTap($event)"
        (rpress)="onPress($event)"
        (rpressup)="onPressup($event)">
      </button>
    </p>
    <br>
    <p>
      <button ripple fixed-ripple
        fillTransition="1000ms linear"
        rippleBgColor="rgba(0,0,0,0.05)"
        activeBgColor="rgba(0,0,0,0.035)"
        class="rectangle card card-md"
        (rtap)="onTap($event)"
        (rpress)="onPress($event)"
        (rpressup)="onPressup($event)">
      </button>
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
       :)
    </p>
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
