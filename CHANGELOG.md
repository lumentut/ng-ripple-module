# Changelog
All notable changes to this project will be documented in this file.

## 1.0.1
### Changed
- Default attribute: `fixed`
- Default input: `rippleColor` & `splashOpacity`
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

### Removed
- Background element (`ripple-bg`)
- Light attribute
- Centered ripple
- Active class
- RippleEffect decorator

