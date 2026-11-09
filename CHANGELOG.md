# Changelog

## [0.1.0] - 2026-11-09

I reviewed the whole extension and fixed a bunch of bugs. Some of them were there since day one.

### Added

- You can now convert many selections at once.
- Only the two font sizes are required. Leave other values empty to use the settings, like `16, 20, , , 14`.
- Values can have a `px` unit.
- Errors now tell you what's wrong with the input.

### Changed

- The comment no longer adds a semicolon. Before, `font-size: 16, 20;` ended with `;;`.
- Equal font sizes now return a plain `rem` value instead of `clamp()`.
- I removed the one-time warning about the parameter order. New users saw it for no reason.

### Fixed

- The command worked only after you opened a CSS or SCSS file. Now it works in any file, like Sass, Less, HTML, or JSX.
- A `0` value was ignored. For example, a `viewportMin` of `0` was replaced by the setting.
- If the mobile size was bigger than the desktop size, the value grew the wrong way.
- Equal viewport values added `Infinity` to the output.
- The README had a wrong example output and a wrong `showComments` default.
- The repository URL in `package.json` was broken.
- The tests didn't run at all. Now they do.

## [0.0.9] - 2025-01-25

### Changed

- `baseFontSize` is now the last parameter. Update your input if you used the old order.
