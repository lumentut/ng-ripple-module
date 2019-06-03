import { RippleHost } from './ripple.host';

export interface Coordinate {
  x: number;
  y: number;
}

export class RippleCoordinate {

  constructor(
    private element: HTMLElement,
    private host: RippleHost
    ) {
  }

  centerStillIsInHostArea(coord: Coordinate): boolean {
    if (this.host.isRound) {
      return this.centerStillInCircleArea(coord);
    }
    return this.centerStillInRectangleArea(coord);
  }

  private fromHostCenterSq(coord: Coordinate) {
    const { center } = this.host;
    const dx = coord.x - center.x;
    const dy = coord.y - center.y;
    return dx * dx + dy * dy;
  }

  centerStillInCircleArea(coord: Coordinate): boolean {
    return this.fromHostCenterSq(coord) < this.host.radiusSquare;
  }

  centerStillInRectangleArea(coord: Coordinate): boolean {
    const { left, right, top, bottom } = this.host.rect;
    const isInRangeX = left < coord.x && coord.x < right;
    const isInRangeY = top < coord.y && coord.y < bottom;
    return isInRangeX && isInRangeY;
  }

  outerPointStillInHostRadius(coord: Coordinate): boolean {
    const { host, rect } = this;
    const contactPointFromCenterSq = this.fromHostCenterSq(coord);
    const maxContactPointFromCenter = host.radius - 0.5 * rect.width;
    const maxContactPointFromCenterSq = maxContactPointFromCenter * maxContactPointFromCenter;
    return contactPointFromCenterSq < maxContactPointFromCenterSq;
  }

  get rect(): ClientRect {
    return this.element.getBoundingClientRect();
  }
}
