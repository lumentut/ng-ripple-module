import { AfterViewInit, Component, ElementRef, Inject, Renderer2 } from '@angular/core';
import { AnimationBuilder, AnimationPlayer } from '@angular/animations';
import { RippleHost } from './ripple.host';
import { RippleAnimation } from './ripple.animation';
import { RippleConfigs, RIPPLE_SCALE_INCREASER, RIPPLE_CONFIGS, RIPPLE_CORE_CONFIGS } from './ripple.configs';
import { RippleCoordinate, Coordinate } from './ripple.coordinate';

export interface RippleStyle {
  width?: number;
  height?: number;
  marginLeft?: number;
  marginTop?: number;
  background?: string;
}

@Component({
  selector: 'ripple-core',
  template: `<ng-content></ng-content>`,
  styles: [
    `:host {
      top: 0;
      left: 0;
      display: block;
      position: absolute;
      border-radius: 50%;
      opacity: 0;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      will-change: transform, opacity;
    }`
  ]
})
export class RippleComponent implements AfterViewInit {

  animation: RippleAnimation;
  animationPlayer: AnimationPlayer;
  configs: RippleConfigs;
  coordinate: RippleCoordinate;
  dismountTimeout: any;
  element: HTMLElement;
  players = [];
  scale: number;

  constructor(
    private animationBuilder: AnimationBuilder,
    private elRef: ElementRef,
    private host: RippleHost,
    private renderer: Renderer2,
    @Inject(RIPPLE_CORE_CONFIGS) public coreConfigs: RippleConfigs
  ) {
    this.element = this.elRef.nativeElement;
    this.configs = { ...RIPPLE_CONFIGS, ...this.coreConfigs };
    this.renderer.setStyle(this.element, 'background', this.configs.backgroundColor);
  }

  ngAfterViewInit() {
    const { animationBuilder, configs, element, host } = this;
    this.coordinate = new RippleCoordinate(element, host);
    this.animation = new RippleAnimation(animationBuilder, configs, element);
    this.host.element.appendChild(element);
    this.resizeAndReposition();
  }

  get styles(): RippleStyle {
    const { diameter, margin } = this.host;
    return {
      width: diameter,
      height: diameter,
      marginLeft: margin.left,
      marginTop: margin.top
    };
  }

  private resizeAndReposition() {
    for (const key in this.styles) {
      if (this.styles[key]) {
        this.renderer.setStyle(this.element, key, `${this.styles[key]}px`);
      }
    }
  }

  fillAt(coord: Coordinate) {
    this.scale = undefined;
    this.host.recalculate();
    const pos = this.host.relativePosition(coord);
    this.animationPlayer = this.animation.fill(pos.x, pos.y);
    this.animationPlayer.play();
  }

  get currentScale(): number {
    const { width } = this.element.getBoundingClientRect();
    const { diameter } = this.host;
    return width / diameter;
  }

  getScale(): number {
    const { scale } = this;
    const currentScale = scale ? scale : this.currentScale;
    return currentScale + RIPPLE_SCALE_INCREASER;
  }

  translateTo(coord: Coordinate) {
    const pos = this.host.relativePosition(coord);
    const scale = this.getScale();
    const player = this.animation.translate(pos.x, pos.y, scale);
    this.scale = scale;
    this.manageTranslateAnimation(player);
    this.animationPlayer.play();
  }

  private manageTranslateAnimation(player: AnimationPlayer) {

    this.players.push(player);

    const { players } = this;
    const index = players.indexOf(player);
    const prev = index - 1;

    if (index > 0) {
      players[prev].destroy();
      players[prev] = null;
      players.splice(prev, 1);
    }

    this.animationPlayer = player;
  }

  splash() {
    this.animationPlayer = this.animation.splash;
    this.animationPlayer.play();
  }
}
