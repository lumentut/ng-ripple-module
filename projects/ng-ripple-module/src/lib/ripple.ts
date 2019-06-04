import { NgZone, ComponentRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { RippleAnimation } from './ripple.animation';
import { RippleConfigs } from './ripple.configs';
import { RippleComponent } from './ripple.component';
import { RippleCoordinate } from './ripple.coordinate';
import { RippleEvent } from './ripple.event';
import { RippleListener, PointerListener, Events } from './ripple.listener';
import { RipplePublisher } from './ripple.event';

export function getContact(event: any) {
  const evt = event.changedTouches ? event.changedTouches[0] : event;
  return {
    point: { x: evt.clientX, y: evt.clientY },
    input: (event.pointerType || event.type).slice(0, 5)
  };
}

export class Ripple {

  animation: RippleAnimation;
  coordinate: RippleCoordinate;
  component: RippleComponent;
  contact: any;
  eventTrigger = [];
  pointer: any;
  pointerListeners: any;
  subscriptions = new Subscription();
  trigger: string[];

  readonly pointerdownEvent = ['pointerdown'];
  readonly fallbackEvent = ['touchstart', 'mousedown'];

  constructor(
    public componentRef: ComponentRef<any>,
    public configs: RippleConfigs,
    public hostElement: HTMLElement,
    public listener: RippleListener,
    public publisher: RipplePublisher,
    public ngZone: NgZone,
  ) {
    const { fallbackEvent, pointerdownEvent } = this;
    this.trigger = 'onpointerdown' in window ? pointerdownEvent : fallbackEvent;
    this.initialize();
  }

  initialize() {
    this.trigger.forEach(eventName => {
      this.eventTrigger.push([eventName, this.onPointerDown]);
    });

    const { hostElement, eventTrigger } = this;
    this.ngZone.runOutsideAngular(() => {
      this.listener.startListening(hostElement, eventTrigger);
    });
  }

  subscribeEmitter(context: any) {
    this.publisher.subscribeEmitter(context);
  }

  get core() {
    return this.componentRef.instance;
  }

  private delay(eventName: Events): number {
    const { splashTransition } = this.configs;
    return eventName === Events.PRESS ? 0 : splashTransition.match(/\d+/g).map(Number)[0];
  }

  private event = (eventName: Events) => {
    const { core, hostElement } = this;
    return new RippleEvent( hostElement, core.host.center, this.delay(eventName), eventName);
  }

  private onPointerDown = (event: PointerEvent | MouseEvent | TouchEvent) => {
    this.contact = getContact(event);
    this.pointer = new PointerListener(this);
    this.core.fillAt(this.contact.point);
  }

  onPointerMove = (event: MouseEvent | TouchEvent) => {
    const contact = getContact(event);
    const { core } = this;
    if (!core.coordinate.centerStillIsInHostArea(contact.point)
      || core.configs.fixed) {
      return this.onPointerEnd();
    }
    if (core.coordinate.outerPointStillInHostRadius(contact.point)) {
      return core.translateTo(contact.point);
    }
  }

  onPointerEnd = () => {
    const { hostElement, pointer } = this;
    this.listener.stopListening(hostElement, pointer.listeners);
    this.core.splash();
  }

  destroy() {
    const { eventTrigger, hostElement, pointer } = this;
    this.listener.stopListening(hostElement, eventTrigger);
    if (pointer) {
      this.listener.stopListening(hostElement, pointer.listeners);
    }
    this.subscriptions.unsubscribe();
  }
}
