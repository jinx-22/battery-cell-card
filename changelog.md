# Changelog

## [0.9.5] - 2026-10-26

### Added

- **Charge / discharge animation** (needs the power sensor): glowing cell top (3 styles), running bar (2 styles) and cell wall animation (pulse or cell wall energy). Optional simultaneous lighting of all cells.
- **Animation speed** constant (0.1× – 2×) or power-dependent (relative to your maximum charge / discharge power).
- **Balancing energy flow**: an animated energy line runs from the highest to the lowest cell while balancing is active, also across wrapped rows.
- Own **animation colors** for charging, discharging and the balancing flow (`color_*`), editable with color pickers in the editor.
- **Cell height slider** (280 – 800 px) in the Display panel. In the sections dashboard it is linked with the layout rows in both directions: change the slider and the rows follow, change the rows in the layout tab and the slider follows.
- **Min. cell width slider** (40 – 120 px) in the Display panel.
- Short headings and hint texts in the panel *Balancing and Min. Cell / Max. Cell*.
- Editor scrolls to a panel when it is opened.

### Changed

- Pulse animation redesigned: soft permanent glow from both cell walls plus a horizontal glow at the fill level of each cell.
- Editor reorganized:
  - Theme moved to the Display panel.
  - The custom scale now lives inside the panel *Battery Chemistry* (only shown for battery type *Custom*); the min. voltage is at the bottom of that section.
  - `custom_max_mv` is no longer shown in the editor (still usable in YAML, used when fewer than 2 scale steps exist).
  - Cell height and min. cell width moved from *Cell Wrapping* to *Display*; the Display panel was re-sorted and grouped.
  - Dividers between the settings in all panels.
  - Font size of the additional sensors moved to the bottom of its panel.
- Minimum cell height raised from 200 to 280 px. New cards start with 351 px (7 layout rows).
- Without explicit `grid_options.rows` the layout rows are derived from `cell_height` (min. 6 rows).
- Label "Pulse / wave" renamed to "Cell wall animation".
- Animations are no longer switched off by the system setting "reduce motion".

### Fixed

- Flickering of the card in the Home Assistant Companion App while animations are running.
- Cell height changes are applied without rebuilding the card (no flicker in the editor preview while dragging the slider).

### Improved

- The balancing energy flow is drawn on its own canvas layer and does not repaint the rest of the card.
- Animations pause while the card is not visible.

---

## [0.9.4]

### Added

- Empty cards display 4 non-clickable placeholder cells
- Improved accessibility with labels for icons

### Changed

- Cleaner YAML output with only non-default values
- Balancing range expanded to 1500–4500 mV
- Corrected loading/unloading symbol label

### Improved

- More reliable high / low cell detection
- Improved click and keyboard focus handling
- More efficient additional sensor updates
- Editor state is preserved when changing language
- Prevented duplicate card registration and loading

---

## [0.9.3]

### Added

- New 3D look: chrome-finished battery housing

[![3d-w](https://github.com/user-attachments/assets/0fcbeab4-91fe-4651-b412-3fd7f194c292)](https://github.com/user-attachments/assets/0fcbeab4-91fe-4651-b412-3fd7f194c292)[![3d](https://github.com/user-attachments/assets/7342d1fd-bfd2-45d1-8b37-cf5ead4f8f74)](https://github.com/user-attachments/assets/7342d1fd-bfd2-45d1-8b37-cf5ead4f8f74)

- Fully customized battery scale directly in the visual editor (voltage points, colors, segment heights, labels)
- 7 custom battery scale presets
- Toggleable scale color gradient

[![Skala](https://github.com/user-attachments/assets/2543b511-668d-4fda-9fff-d4b35d1e1805)](https://github.com/user-attachments/assets/2543b511-668d-4fda-9fff-d4b35d1e1805)

- Disc-style scale with three intensity levels: Subtle, Medium and Strong
- Chunk mode completely reworked, Auto-Chunk mode (Auto 4, Auto 8 or Manual), adjustable chunk height and cell width
- Battery type selection reworked and extended
- Visual editor expanded and redesigned with native Home Assistant components
- Cells and additional sensors can be added, edited, removed and sorted in the editor; custom names and icons
- Adjustable font size for additional sensors
- `grid_options` for controlling the card size

### Improved

- Automatic detection of the lowest and highest cell voltage
- Balancing and cell voltage difference display
- Support for voltage sensors using V or mV
- Significant performance improvements

---

## [0.8.0] - 2026-09-27

### Added

- Battery chemistry selection: LiFePO4, NMC/NCM, Lead-Acid (2V cell), Custom
- NMC/NCM preset (3.00 V – 4.20 V) with matching legend and cell coloring
- Lead-Acid preset (1.80 V – 2.45 V per 2V cell) with matching legend and cell coloring
- Custom voltage range via `custom_min_mv` / `custom_max_mv`
- Optional `legend_stops` for full manual control of legend labels, colors, segment heights and cell fill curve
- Visual editor section "Battery Chemistry" (English / German)

[![0 8](https://github.com/user-attachments/assets/ae1a84b7-b2c6-4e85-a39a-7528715f04eb)](https://github.com/user-attachments/assets/ae1a84b7-b2c6-4e85-a39a-7528715f04eb)

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

## Older versions

**0.5.9.8 beta** – new work, performance update, adjustment of font size, card-mod-ready now!

**0.5.4 beta** – add `auto_detect_low_high`: calculate high cell and low cell internally (delete the sensors!)

**0.5.3** – font and other mini fixes

**0.5.2** – Fix for HA theme (no fixed background; card-mod is currently not supported). Fix for delta. Fix for the comment in the visual (still non-existent) editor. Fix: minimal adjustment of font size in mobile view. Fix: corrected calculation of the fill height when using V sensor values (thanks to Deepintheeast). Add: option to set cell sensor values in V or mV.
