# Changelog

## [0.7.0] - 2026-09-26

### Added
- New native Home Assistant Visual Editor
- Add, edit, delete and reorder battery cells directly in the editor
- Add, edit, delete and reorder additional sensors
- Custom names and icons for cells and additional sensors
- Home Assistant theme selection
- Responsive cell chunking
- Home Assistant `grid_options` support
- Conditional editor options depending on the selected settings
- Improved responsive layout and compact display handling

### Improved
- More efficient layout and content updates
- Improved handling of configuration changes without unnecessary layout rebuilds
- Improved cell voltage normalization for V and mV sensor values
- Improved automatic detection of lowest and highest cell
- Improved balancing detection
- Additional sensors can be opened directly via Home Assistant More Info

### Changed
- Card sizing is now handled through Home Assistant layout / `grid_options`
- Legacy `card_height` configuration is no longer supported
- Legacy `background` configuration is no longer supported

### Editor
- Uses native Home Assistant components:
  - `ha-form`
  - `ha-expansion-panel`
  - `ha-sortable`
  - `ha-icon-button`
  - Home Assistant entity selectors
- No custom drag-and-drop implementation
- Editor configuration changes are applied immediately

0.5.9.8.beta 
new work, performance update,adjustment of font size, card-mod-ready now!

v.0.5.4 beta
add auto_detect_low_high - calculate high_cell and low_cell intern (delete sensors!!)

v.0.5.3
Font and other mini fixes

v0.5.2
Fix for HA theme (no fixed background; Card mode is currently not supported)
Fix for Delta Fix for the comment in the visual (still non-existent) editor
Fix: minimal adjustment of font size in mobile view
Fix :  Corrected calculation of the fill height when using V sensor values. –Y Thanks to [Deepintheeast](#Deepintheeast)
Add: Option to set cell sensor values in V or mV
