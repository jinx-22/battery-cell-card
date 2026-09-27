# Changelog

## [0.8.0] - 2026-09-27

### Added
- Battery chemistry selection: LiFePO4, NMC/NCM, Lead-Acid (2V cell), Custom
- NMC/NCM preset (3.00 V – 4.20 V) with matching legend and cell coloring
- Lead-Acid preset (1.80 V – 2.45 V per 2V cell) with matching legend and cell coloring
- Custom voltage range via `custom_min_mv` / `custom_max_mv`
- Optional `legend_stops` for full manual control of legend labels, colors, segment heights and cell fill curve
- Visual editor section “Battery Chemistry” (English / German)

<img width="533" height="352" alt="0 8" src="https://github.com/user-attachments/assets/ae1a84b7-b2c6-4e85-a39a-7528715f04eb" />

---

## [0.7.2] - 2026-09-26

### Fixed
- Overlay bugfix

---

## [0.7.1] - 2026-09-26

### Added
- Language support for the card editor (English / German), follows Home Assistant language setting

### Fixed
- Several editor issues, including cell name input losing focus after every keystroke

### Improved
- Editor performance by avoiding unnecessary list re-renders when editing existing cells and sensors

---

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

---

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
