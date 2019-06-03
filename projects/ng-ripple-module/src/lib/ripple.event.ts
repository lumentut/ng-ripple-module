import { Coordinate } from './ripple.coordinate';
import { Subject } from 'rxjs';

export class RippleEvent {

  target: HTMLElement;
  type: string;
  timestamp: number;
  clientX: number;
  clientY: number;
  clientRect: ClientRect;
  navLink: string;
  delay: number;

  constructor(
    element: HTMLElement,
    coordinate: Coordinate,
    delay: number,
    type: string
  ) {
    this.target = element;
    this.type = type;
    this.timestamp = (new Date()).getTime();
    this.clientX = coordinate.x;
    this.clientY = coordinate.y;
    this.clientRect = element.getBoundingClientRect();
    this.navLink = element.getAttribute('navlink');
    this.delay = delay;
  }
}

export class RipplePublisher extends Subject<RippleEvent> {

  constructor() {
    super();
  }

  delay: any = (ms: number) => new Promise(_ => setTimeout(_, ms));

  dispatch(event: RippleEvent) {
    this.delay(event.delay).then(() => this.next(event));
  }

  subscribeEmitter(context: any) {
    context.ripple.subscriptions.add(this.subscribe((event: RippleEvent) => {
      if (!context[event.type]) { return; }
      context[event.type].emit(event);
    }));
  }
}
