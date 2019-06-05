# Changelog
All notable changes to this project will be documented in this file.

## [1.0.1] - 2019-06-05
### Changed
- Default attribute: `fixed`
- Default input: `rippleColor` & `splashOpacity`
- No more mount & dismount ripple element to reduce expensive operation.
- Default `RippleConfigs` :
  ```ts
  interface RippleConfigs {
    backgroundColor?: string;
    fadeTransition?: string;
    fillTransition?: string;
    fixed?: boolean;
    splashTransition?: string;
    splashOpacity?: number;
    tapLimit?: number;
  }`
  ```

### Added
- Base Class: `RippleEffect`
- Factory Class: `RippleFactory`

### Removed
- Background element (`ripple-bg`)
- Light attribute
- Centered ripple
- Active class
- RippleEffect decorator

