# Changelog

## [0.9.3] - 2026-10-04

Summary of all changes since **0.8.0** (development steps 0.9.0 – 0.9.3.2): new 3D look, disc-style scale, visual scale builder, completely reworked cell wrapping, many editor and stability improvements.

<img width="30%" height="auto" alt="3d-w" src="https://github.com/user-attachments/assets/0fcbeab4-91fe-4651-b412-3fd7f194c292" /><img width="30%" height="auto" alt="3d" src="https://github.com/user-attachments/assets/7342d1fd-bfd2-45d1-8b37-cf5ead4f8f74" />

### Added

**3D look and display**
- New 3D metal housing (`use_3d`): one continuous chrome gradient over the whole frame (top, sides, bottom), inner edge, and a battery pole on top
- Frame thickness scales with the card width; side frame and caps become thinner on narrow cards and phones (down to 2 px)
- Pole keeps the same proportions at every cell width and height
- Flat mode with a thin metal border for the non-3D look
- Lowest / highest cell ring in 3D mode now frames the scale area, with light coming from the bottom right and stronger colors
- Cell names and voltage values are drawn above the ring and are never covered by it
- Disc-style scale (`show_slices`) with three strengths (`slice_strength`: `subtle`, `medium`, `strong`), usable with and without the 3D frame
- Contrast shadow for the mV value at the bottom of each cell, same as in the legend

**Custom scale builder (battery type `custom`)**
- New editor panel **Custom Scale** for `legend_stops`: add, delete, drag to reorder, up to 20 steps
- Per step: color, top edge voltage (`mv`), share in % (`pct`), top and bottom label
- Color input as hex field plus hue / saturation / lightness sliders
- 7 ready-made scale presets: LiFePO4 Standard, Purple / Pink, Sunset, Neon, Ocean, NMC / NCM, Lead-Acid. The dropdown shows *No preset* as soon as you change a step
- Optional smooth color gradient (`scale_gradient`) for cells and legend. Legend labels stay exactly in place
- Automatic corrections while editing: voltages always decrease from top to bottom, shares always add up to 100 %, the lowest step ends at `custom_min_mv`
- Scale step rows adapt to narrow portrait displays in the Home Assistant app

**Cell wrapping (chunking)**
- New editor panel **Cell wrapping**
- Wrapping modes `chunk_mode`: `auto4`, `auto8` and `manual`
- Adjustable row height `cell_height` (200 – 800 px)
- Adjustable minimum cell width `min_cell_width` (40 – 120 px)
- `chunk_size` (cells per row) only for the manual mode and only visible there

**Other**
- Font size factor for additional sensors `extra_font_scale` (0.7 – 1.5)
- Placeholder `-` is shown for cells that report no numeric value (e.g. `unavailable`)
- Theme dropdown shows *Default* when no theme is selected
- Compact card-picker preview with ready-made sample values (3D on, subtle disc shading, font size 6)

### Changed

- **Cell wrapping reworked.** The number of rows is decided only by the available card width (no fixed split anymore). Cells are never squeezed after wrapping and keep their height. Wrapping starts earlier so that cells do not get too narrow
- **Card height logic.** Wrapping **off**: the height comes from the Home Assistant layout (`grid_options`, minimum 5 rows, default 6) and the cells fill it without empty space. Wrapping **on**: fixed `cell_height` and layout rows `auto` (the height is no longer taken from the dashboard). Switching wrapping off restores 8 layout rows
- **Scale logic of `legend_stops`.** Each step now defines the voltage at the **upper edge** of its segment. The lower edge of the lowest step is `custom_min_mv`. All presets were rebuilt accordingly
- **Balancing.** Default for `cell_bal_over` is now 3000 mV. Changing the battery type in the editor suggests a matching value (LiFePO4 / Custom 3000, NMC 3500, lead 2000). The label now reads "Balancing from cell voltage"
- **Delta unit detection.** Without a unit attribute, values below 0.1 are read as volts (before: below 1), so a delta of e.g. 0.5 mV is no longer shown as 500 mV
- **Legend text sizes** for SOC and delta follow the *Font size* setting and are slightly smaller on the smallest card height (200 px) and wide cells
- **Default values.** 3D frame and disc shading are off by default. The sample sensors `sensor.status_of_charge`, `sensor.pack_watt` and `sensor.delta_mvolts_between_cells` are only pre-filled by the card picker; `soc_entity`, `watt_entity` and `cell_diff_sensor` have no fixed fallback anymore
- The editor no longer writes the obsolete keys `background` and `card_height` into the saved configuration
- Minimum cell height raised from 180 to 200 px

### Improved

- Complete rewrite of the card code: leaner, cleaner structure, less duplicated logic, identical features and look
- The card reacts to Home Assistant state changes only when a used entity really changed, and renders once even if no state changed yet (e.g. in the picker preview)
- Responsive layout rules (frame, side and cap thickness) now follow the **card width** instead of the browser window, so narrow cards on large screens look correct as well
- Configuration values are validated and limited automatically (`font_size`, `cell_gap`, `container_padding`, `top_padding`, `overlay_opacity`, `cell_diff`, `cell_bal_over`, `cell_unit`); the value `0` is now accepted
- Editor: number inputs no longer jump back to the minimum value while typing; optional entities (balancing sensor, lowest / highest cell sensor, ...) can be cleared
- Editor: conditional options are only shown when they apply (legend items, disc shading strength, wrapping options, manual cells per row, custom scale)

### Fixed

- Card showed no values until the first entity state changed (affected e.g. the card-picker preview)
- SOC and delta text size ignored the *Font size* setting
- Setting `cell_gap`, `container_padding` or `overlay_opacity` to `0` was replaced by the default

### Removed

- No feature, option or display mode was removed
- Implicit fallback sensors (see *Changed*)
- Obsolete `background` / `card_height` keys in saved configurations (the card has ignored them since 0.7.0)

### Upgrade notes

- **Using `legend_stops` from 0.8.0 in YAML?** `mv` now means the voltage at the upper edge of the segment and must decrease from top to bottom. Check your values or re-create the scale in the new editor panel (or start from a preset)
- **Cards without `soc_entity`, `watt_entity` or `cell_diff_sensor`?** Set the entities explicitly, they are no longer filled with sample sensors automatically
- Clear the browser cache (CTRL + F5) after updating. The browser console shows the loaded card version

---

## [0.8.0] - 2026-09-27

### Added

- Battery chemistry selection: LiFePO4, NMC/NCM, Lead-Acid (2V cell), Custom
- NMC/NCM preset (3.00 V – 4.20 V) with matching legend and cell coloring
- Lead-Acid preset (1.80 V – 2.45 V per 2V cell) with matching legend and cell coloring
- Custom voltage range via `custom_min_mv` / `custom_max_mv`
- Optional `legend_stops` for full manual control of legend labels, colors, segment heights and cell fill curve
- Visual editor section “Battery Chemistry” (English / German)

<img width="33%" height="auto" alt="0 8" src="https://github.com/user-attachments/assets/ae1a84b7-b2c6-4e85-a39a-7528715f04eb" />

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
  * `ha-form`
  * `ha-expansion-panel`
  * `ha-sortable`
  * `ha-icon-button`
  * Home Assistant entity selectors
- No custom drag-and-drop implementation
- Editor configuration changes are applied immediately

---

## Older versions

**0.5.9.8 beta**  
New work, performance update, adjustment of font size, card-mod ready now!

**v0.5.4 beta**  
Add `auto_detect_low_high` - calculate high_cell and low_cell internally (delete sensors!!)

**v0.5.3**  
Font and other mini fixes

**v0.5.2**  
- Fix for HA theme (no fixed background; card-mod is currently not supported)
- Fix for Delta
- Fix for the comment in the visual (still non-existent) editor
- Fix: minimal adjustment of font size in mobile view
- Fix: corrected calculation of the fill height when using V sensor values. Thanks to Deepintheeast
- Add: option to set cell sensor values in V or mV
