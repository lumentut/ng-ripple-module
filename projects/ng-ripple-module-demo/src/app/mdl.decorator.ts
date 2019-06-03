import { HostBinding } from '@angular/core';

export interface MDLButtonInterface {
  accent?: boolean;
  colored?: boolean;
  danger?: boolean;
  dark?: boolean;
  fab?: boolean;
  miniFab?: boolean;
  primary?: boolean;
  raised?: boolean;
  ripple?: boolean;
  secondary?: boolean;
  success?: boolean;
  warning?: boolean;
}

export function MDLButton({
  accent = false,
  colored = false,
  danger = false,
  dark = false,
  fab = false,
  miniFab = false,
  primary = false,
  raised = false,
  ripple = false,
  secondary = false,
  success = false,
  warning = false
}: MDLButtonInterface = {}) {
  return function mdlButton<T extends { new (...args: any[]): {} }>(constructor: T) {
    class MDLButtonDecorator extends constructor {
      @HostBinding('class.mdl-button') button = true;
      @HostBinding('class.mdl-button--accent') accentBtn = accent;
      @HostBinding('class.mdl-button--colored') coloredBtn = colored;
      @HostBinding('class.mdl-button--fab') fabBtn = fab;
      @HostBinding('class.mdl-button--mini-fab') miniFabBtn = miniFab;
      @HostBinding('class.mdl-button--raised') raisedBtn = raised;
      @HostBinding('class.mdl-js-ripple-effect') rippleBtn = ripple;
      @HostBinding('class.mdl-button-danger') dangerBtn = danger;
      @HostBinding('class.mdl-button-dark') darkBtn = dark;
      @HostBinding('class.mdl-button-primary') primaryBtn = primary;
      @HostBinding('class.mdl-button-secondary') secondaryBtn = secondary;
      @HostBinding('class.mdl-button-success') successBtn = success;
      @HostBinding('class.mdl-button-warning') warningBtn = warning;
    }
    return MDLButtonDecorator;
  };
}
