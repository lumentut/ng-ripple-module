import { Coordinate } from './ripple.coordinate';

export class RippleHost {

  borderRadius: string;
  center: Coordinate;
  diameter: number;
  margin: any;
  radius: any;
  radiusSquare: number;
  rect: ClientRect;

  constructor(public element: HTMLElement) {
    this.borderRadius = getComputedStyle(this.element).borderRadius;
    this.calculate();
  }

  recalculate() {
    this.calculate();
  }

  get isRound(): boolean {
    const { rect, borderRadius } = this;
    return borderRadius === '50%' && rect.width === rect.height;
  }

  relativePosition(coord: Coordinate): Coordinate {
    const { center } = this;
    const { x, y } = coord;
    return { x: x - center.x, y: y - center.y };
  }

  private calculate() {
    this.rect = this.element.getBoundingClientRect();
    this.calculateDiameter()
      .calculateRadius()
      .calculateRadiusSquare()
      .calculateCenter()
      .calculateMargin();
  }

  private calculateDiameter(): RippleHost {
    const { width, height } = this.rect;
    this.diameter = Math.hypot(width, height);
    return this;
  }

  private calculateCenter(): RippleHost {
    const { left, top, width, height } = this.rect;
    this.center = {
      x: left + (0.5 * width),
      y: top + (0.5 * height),
    };
    return this;
  }

  private calculateRadius(): RippleHost {
    this.radius = 0.5 * this.rect.width;
    return this;
  }

  private calculateRadiusSquare(): RippleHost {
    const { radius } = this;
    this.radiusSquare = radius * radius;
    return this;
  }

  private calculateMargin(): RippleHost {
    const { rect, diameter } = this;
    this.margin = {
      top: 0.5 * (rect.height - diameter),
      left: 0.5 * (rect.width - diameter)
    };
    return this;
  }
}
