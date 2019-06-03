import {
  animate,
  AnimationAnimateMetadata,
  AnimationBuilder,
  AnimationPlayer,
  style
} from '@angular/animations';

import {
  RIPPLE_TO_CENTER_TRANSFORM,
  RippleConfigs
} from './ripple.configs';

export function getDuration(transition: string) {
  return transition.replace(/ .*/, '').match(/\d+/g).map(Number)[0];
}

export class RippleAnimation {

  constructor(
    private builder: AnimationBuilder,
    private configs: RippleConfigs,
    private element: HTMLElement,
  ) {}

  animationPlayerFactory(animation: any[]): AnimationPlayer {
    const { builder, element } = this;
    return builder.build(animation).create(element);
  }

  fill(tx: number, ty: number): AnimationPlayer {

    const showInTouchCoordinate = style({
      opacity: 1,
      transform: `translate3d(${tx}px, ${ty}px, 0) scale(0)`,
    });

    const centering = animate(this.configs.fillTransition, style({
      opacity: 1,
      transform: RIPPLE_TO_CENTER_TRANSFORM
    }));

    return this.animationPlayerFactory([showInTouchCoordinate, centering]);
  }

  translate(tx: number, ty: number, scale: number): AnimationPlayer {

    const translation = style({
      transform: `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`
    });

    const centering = animate(this.configs.fillTransition, style({
      transform: RIPPLE_TO_CENTER_TRANSFORM
    }));

    return this.animationPlayerFactory([translation, centering]);
  }

  get splash(): AnimationPlayer {
    const { splashOpacity, splashTransition } = this.configs;
    const splashToCenter = animate( splashTransition, style({
      opacity: splashOpacity,
      transform: RIPPLE_TO_CENTER_TRANSFORM
    }));
    return this.animationPlayerFactory([splashToCenter, this.fade]);
  }

  get fade(): AnimationAnimateMetadata {
    return animate(this.configs.fadeTransition, style({ opacity: 0 }));
  }
}
