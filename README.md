[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5?style=flat&logo=homeassistantcommunitystore&logoColor=white)](https://github.com/hacs/integration) [![GitHub total downloads](https://img.shields.io/github/downloads/jinx-22/battery-cell-card/total?style=flat&color=red&logo=github&logoColor=white)](https://github.com/jinx-22/battery-cell-card/releases) [![GitHub release](https://img.shields.io/github/release/jinx-22/battery-cell-card?include_prereleases=&sort=semver&color=blue&style=flat&logo=github&logoColor=white)](https://github.com/jinx-22/battery-cell-card/releases/) [![File size](https://img.shields.io/github/size/jinx-22/battery-cell-card/battery-cells-card.js?label=Card%20Size&style=flat&logo=javascript&logoColor=white)](https://github.com/jinx-22/battery-cell-card/blob/main/battery-cells-card.js) [![Editor Setting - Doku](https://img.shields.io/badge/Editor%20Setting-Doku-e91e63?style=flat&logo=readthedocs&logoColor=white)](#editor-documentation) [![README deutsch](https://img.shields.io/badge/README-DE-blue?style=flat&logo=googletranslate&logoColor=white)](https://github.com/jinx-22/battery-cell-card/blob/main/README_DE.md) [![stars](https://img.shields.io/github/stars/jinx-22/battery-cell-card?style=flat&logo=github&logoColor=white)](https://github.com/jinx-22/battery-cell-card/stargazers) [![Donate Bitcoin](https://img.shields.io/badge/Bitcoin-Donate-F7931A?style=flat&logo=bitcoin&logoColor=white)](#bitcoin) [![Donate Lightning](https://img.shields.io/badge/%E2%9A%A1-Lightning-FFD700?style=flat)](#lightning)

# Battery Cells Card - Cell-(real-time) monitoring

*(Link to German version: [Deutsch](https://github.com/jinx-22/battery-cell-card/blob/main/README_DE.md))*

**Version:** 0.9.5

**Description:** A Home Assistant custom card to visualize battery cells, cell voltages, SOC, balancing status, and differences.  
Ideal for LiFePO₄ battery systems, also for NMC/NCM and lead-acid.

## ✨ New

### ✨ New in 0.9.5

**Animations**

- Charge / discharge animation: glowing cell top, running bar and cell wall animation (pulse or cell wall energy), constant or power-dependent speed.
- Balancing energy flow: an animated energy line from the highest to the lowest cell while balancing.
- Own animation colors, selectable in the editor.
- Pulse animation redesigned: soft glow from both cell walls and a horizontal glow at the fill level.
- No more flickering in the Home Assistant Companion App.

**Editor**

- Cell height as slider with px input, linked with the layout rows of the sections dashboard (in both directions). Minimum 280 px.
- Min. cell width as slider.
- Display panel re-sorted: cell appearance, switches and theme are grouped.
- Custom scale integrated into the panel *Battery Chemistry*.
- Headings and hint texts in the balancing panel, dividers between all settings, the editor scrolls to the opened panel.

New cards start with 351 px (7 layout rows). Details: [changelog.md](https://github.com/jinx-22/battery-cell-card/blob/main/changelog.md)

### ✨ New in 0.9.4

**Added**

- Empty cards now display 4 non-clickable placeholder cells
- Improved accessibility with labels for icons

**Changed**

- Cleaner YAML output with only non-default values
- Balancing range expanded to 1500–4500 mV
- Corrected loading/unloading symbol label

**Improved**

- More reliable High/Low cell detection
- Improved click and keyboard focus handling
- More efficient extra sensor updates
- Editor state is preserved when changing language
- Prevented duplicate card registration and loading

### ✨ New in 0.9.3

- New 3D look → chrome-finished battery housing.

<img width="30%" height="auto" alt="3d-w" src="https://github.com/user-attachments/assets/0fcbeab4-91fe-4651-b412-3fd7f194c292" /><img width="30%" height="auto" alt="3d" src="https://github.com/user-attachments/assets/7342d1fd-bfd2-45d1-8b37-cf5ead4f8f74" />

- Create a fully customized battery scale directly in the visual editor (voltage points, colors, segment heights, labels).
- 7 custom battery scale presets - create your own favorite!
- Toggleable scale color gradient.

<img width="60%" height="auto" alt="Skala" src="https://github.com/user-attachments/assets/2543b511-668d-4fda-9fff-d4b35d1e1805" />

- Disc-style scale with three intensity levels – Subtle, Medium, and Strong.
- Chunk mode completely reworked. (Please provide feedback on whether it displays correctly on iPhone!)
- Selectable battery type completely reworked and further enhanced.
- Visual editor expanded and redesigned.
- Native Home Assistant editor components for a better editing experience.
- Cells and additional sensors can now be added, edited, removed, and sorted directly in the visual editor.
- Custom names and icons for cells and additional sensors.
- Editor available in German and English.
- Auto-Chunk mode → Auto4, Auto8, or Manual.
- Chunk height can be adjusted manually in the editor.
- Chunk cell width can be adjusted manually in the editor.
- Optional smooth color gradients for custom scales.
- Adjustable font size for additional sensors.
- Improved automatic detection of the lowest and highest cell voltage.
- Improved balancing and cell voltage difference display.
- Improved support for voltage sensors using V or mV.
- `grid_options` for controlling the card size.
- Significant performance improvements and many other small changes and enhancements.

### Full changelog: [changelog.md](https://github.com/jinx-22/battery-cell-card/blob/main/changelog.md)

* * *

> [!CAUTION]
> **Note:** The bar heights indicate cell voltage, not state of charge. The percentage SOC can be read in the legend if an SOC sensor is assigned.

* * *

> [!TIP]
> ### 📖 Editor documentation
>
> Every setting of the visual editor is explained step by step, with the purpose of each option and when it is visible.
>
> **👉 [Editor documentation](#editor-documentation)**

* * *

## Table of Contents

01. [What does this card do?](#what-does-this-card-do)
02. [Planned Features](#-planned-features)
03. [Features](#features)
04. [Installation](#installation)
05. [Support & Donations](#-support--donations)
06. [Configuration Options](#configuration-options)
07. [Example Configuration](#example-configuration)
08. [Editor documentation](#editor-documentation)
09. [Screenshots](#screenshots)
10. [License](#license)

* * *

## What does this card do?

Depending on the configuration, this custom card can display:

- Individual cell voltages (V or mV)
- Cell voltage difference (Δ mV)
- Charge/discharge power (W)
- Charge/discharge icons
- Charge/discharge animation with several effects
- Balancing status and an animated balancing energy flow
- SOC value and SOC icon
- Color-coded voltage scale
- Optional smooth scale color gradient
- Additional sensors with custom names and icons
- Responsive scaling
- Optional row wrapping for smaller displays (chunking)
- Optional 3D metal frame and disc-style scale
- Custom battery voltage scales and presets
- Adjustable cell and row dimensions
- Visual editor for easy configuration
- card-mod ready (V0.5.9.8)

Compatible with all BMS that provide individual cell sensors, e.g.:

- Daly
- JK-BMS
- smartBMS smartlabs dongle
- All sensors reporting individual cell voltages (V or mV)

* * *

## 🔜 Planned Features

All planned features are realized. Ideas and feature requests are welcome – please open an [issue](https://github.com/jinx-22/battery-cell-card/issues).

* * *

## Features

### Cell Visualization

- Color scale: Red → Orange → Yellow → Green
- Lowest and highest cell highlighted with a ring
- Battery types: LiFePO4, NMC/NCM, Lead-Acid (2V cell), Custom
- Custom scale with 7 presets, own colors, labels and optional smooth gradient

[![0 8](https://github.com/user-attachments/assets/ae1a84b7-b2c6-4e85-a39a-7528715f04eb)](https://github.com/user-attachments/assets/ae1a84b7-b2c6-4e85-a39a-7528715f04eb)

### Battery Status

- SOC text & icon
- Plus/minus symbol depending on charge/discharge

### Balancing

- Sync icon when balancing is active
- Δ voltage display between cells
- Optional balancing energy flow: animated line from the highest to the lowest cell

### Animations

- Charge/discharge animation (needs the power sensor), direction follows the power sign
- Glowing cell top in 3 styles, running bar in 2 styles, cell wall animation (pulse or cell wall energy)
- Speed constant or power-dependent
- Own colors for charging, discharging and the balancing flow
- Animations pause while the card is not visible

### Flexible Layout

- Auto-scaling
- Responsive for mobile and desktop
- Cell height linked with the layout rows of the sections dashboard
- Optional cell wrapping (chunking) in Auto 4, Auto 8 or Manual mode

### Display Options

- Legend toggle
- SOC value & icon toggle separately
- 3D metal frame toggle
- **Disc look for the scale** in three strengths: Subtle, Medium, Strong (works with and without the 3D frame)
- Adjustable font size
- Additional sensors with name, icon and font size

### Sensor Support

- SOC sensor
- Power (W) sensor
- Cell difference sensor
- Balancing sensor (optional)
- Lowest & highest cell sensor
- Individual cells **{name, entity}**
- Additional sensors **{name, entity, icon}**

* * *

## Installation

### HACS

Click the button to add the repository in HACS, download the card and reload your browser.

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=jinx-22&repository=battery-cell-card&category=plugin)

### Manual Installation

1. Download **battery-cells-card.js**
2. Copy it to `/config/www/community/battery-cell-card/`
3. In Home Assistant:

   - Settings
   - Dashboards
   - Three-dot menu
   - Resources
   - Add Resource
   - URL: **/local/community/battery-cell-card/battery-cells-card.js**
   - Type: **JavaScript Module**
4. Reload browser (CTRL + F5). In the Home Assistant app also clear the app cache (Settings → Companion App → Troubleshooting) after an update.

The card is now selectable and visible in the GUI.

* * *

## 🧡 Support & Donations

If you like this integration and it adds real value to your Home Assistant setup,  
I’d appreciate a small donation — every contribution helps further development 🚀

### Lightning

[![Lightning](https://github.com/user-attachments/assets/0bff59d2-7986-46cf-9d39-17fe0dbb128a)](https://github.com/user-attachments/assets/0bff59d2-7986-46cf-9d39-17fe0dbb128a)

`usefulplay52@walletofsatoshi.com`

[![Lightning - Wallet of Satoshi](https://github.com/user-attachments/assets/65cc18d9-05d1-4a00-8ccc-9922fdb54baf)](https://github.com/user-attachments/assets/65cc18d9-05d1-4a00-8ccc-9922fdb54baf)

### Bitcoin

[![Bitcoin](https://github.com/user-attachments/assets/f74cad36-8c05-4a33-89cd-b998075af33b)](https://github.com/user-attachments/assets/f74cad36-8c05-4a33-89cd-b998075af33b)

`bc1qkz7mtp23cmshxnru96lzgeayu0urlysvqk5vry`

[![Bitcoin donation](https://github.com/user-attachments/assets/196f68e4-b0e8-4f27-bded-8c4fe13b9d45)](https://github.com/user-attachments/assets/196f68e4-b0e8-4f27-bded-8c4fe13b9d45)

**Thank you very much**, and please leave a free [![GitHub stars](https://img.shields.io/github/stars/jinx-22/battery-cell-card?style=social)](https://github.com/jinx-22/battery-cell-card/stargazers) so others can find this project too — thanks!

* * *

## Configuration Options

The card has a visual editor (English / German, follows your Home Assistant language). Every option can also be set in YAML. Numeric values outside the allowed range are clamped automatically.

| Option | Default | Type | Range / Values | Description |
|---|---|---|---|---|
| `title` | `'Battery Cells'` | string | – | Card title. |
| `theme` | `''` | string | theme name | Home Assistant theme for this card (empty = default theme). |
| `battery_type` | `lifepo4` | string | `lifepo4`, `nmc`, `lead`, `custom` | Battery chemistry and voltage scale. |
| `custom_min_mv` | `2600` | number | 1000 – 5000 | `custom` only: minimum cell voltage (mV). With `legend_stops` it is the lower edge of the bottom step. |
| `custom_max_mv` | `3650` | number | 1000 – 5000 | `custom` only, YAML only: maximum cell voltage (mV). Used when fewer than 2 `legend_stops` exist. |
| `legend_stops` | `[]` | array | 2 – 20 steps | `custom` only: own scale steps `{color, mv, pct, top, bottom}` (see below). |
| `scale_gradient` | `false` | boolean | – | `custom` scale: smooth color gradient instead of hard segments (cells + legend). |
| `show_legend` | `true` | boolean | – | Show the legend column. |
| `soc_entity` | `null` | string / null | sensor | State of charge sensor (%). |
| `watt_entity` | `null` | string / null | sensor | Power sensor (W or kW). Positive = charging, negative = discharging. |
| `cell_diff_sensor` | `null` | string / null | sensor | Cell voltage difference (Δ). Unit `V` / `mV` is detected; without a unit, values below 0.1 count as V. |
| `balance_sensor` | `null` | string / null | entity | Optional "balancing active" entity (state `on`). |
| `cell_diff` | `8` | number | 0 – 1000 | Minimum Δ (mV) for the balancing (sync) icon. |
| `cell_bal_over` | `3000` | number | 0 – 6000 | Balancing icon only appears when the highest cell is at least this voltage (mV). |
| `auto_detect_low_high` | `true` | boolean | – | Detect the lowest / highest cell automatically. |
| `pack_cell_low` | `null` | string / null | sensor | Sensor with the number of the lowest cell (auto-detect off). |
| `pack_cell_high` | `null` | string / null | sensor | Sensor with the number of the highest cell (auto-detect off). |
| `show_soc_value` | `true` | boolean | – | SOC value in the legend. |
| `show_soc_icon` | `true` | boolean | – | Battery icon in the legend (changes with power). |
| `show_cell_diff` | `true` | boolean | – | Cell difference (Δ mV) in the legend. |
| `show_sync_icon` | `true` | boolean | – | Sync icon while balancing. |
| `cell_unit` | `mV` | string | `mV`, `V` | Unit of the cell values. |
| `font_size` | `8` | number | 4 – 16 | Base font size. |
| `overlay_opacity` | `0.7` | number | 0 – 1 | Darkening of the empty part of each cell. |
| `cell_gap` | `4` | number | 0 – 16 | Gap between cells (px). |
| `container_padding` | `10` | number | 0 – 40 | Padding around the cells (px). |
| `top_padding` | `20` | number | 0 – 60 | Spacing below the title (px). |
| `use_3d` | `false` | boolean | – | 3D metal frame. |
| `show_slices` | `false` | boolean | – | Disc look for the scale. |
| `slice_strength` | `subtle` | string | `subtle`, `medium`, `strong` | Strength of the disc look. |
| `show_flow` | `false` | boolean | – | Charge / discharge animation (needs `watt_entity`). |
| `flow_tip` | `tip1` | string | `off`, `tip1`, `tip2`, `tip3` | Glowing cell top: Glow, Glow (subtle), Glow (explosion). |
| `flow_bar` | `off` | string | `off`, `bar1`, `bar2` | Running bar: short tail / long tail. |
| `flow_glow` | `off` | string | `off`, `pulse`, `wave` | Cell wall animation: Pulse (edge to center, with glow at the cell top) or cell wall energy (waves). |
| `flow_sync` | `false` | boolean | – | Light up all cells simultaneously instead of cell by cell. |
| `flow_speed_mode` | `manual` | string | `manual`, `auto` | Constant or power-dependent animation speed. |
| `flow_speed` | `1` | number | 0.1 – 2 | Speed factor for `manual`. |
| `flow_speed_auto` | `1` | number | 0.2 – 2 | Speed factor for `auto` (0.2× at low power up to 1.6× at maximum power, multiplied by this value). |
| `flow_max_charge_w` | `3000` | number | 100 – 100000 | `auto`: charging power (W) at which the speed is at its maximum. |
| `flow_max_discharge_w` | `3000` | number | 100 – 100000 | `auto`: discharging power (W) at which the speed is at its maximum. |
| `show_balance_flow` | `false` | boolean | – | Animated energy line from the highest to the lowest cell while balancing. |
| `color_*` | `null` | `[R, G, B]` | 0 – 255 | Animation colors, see the table below. `null` = default color. |
| `chunk_cells` | `false` | boolean | – | Wrap cells into several rows on narrow displays. |
| `chunk_mode` | `auto8` | string | `auto4`, `auto8`, `manual` | Wrapping mode. |
| `chunk_size` | `8` | number | 2 – 32 | Cells per row, `manual` mode only (upper limit). |
| `cell_height` | `340` | number | 280 – 800 | Height of the cell row (px). With wrapping: height of each row. In the sections dashboard the layout rows apply; without `grid_options.rows` they are derived from this value. The editor keeps both in sync. |
| `min_cell_width` | `50` | number | 40 – 120 | Minimum cell width (px); smaller widths wrap earlier (only with `chunk_cells: true`). |
| `show_extra_sensors` | `false` | boolean | – | Show additional sensors above the cells. |
| `extra_sensors` | `[]` | array | – | List of `{name, entity, icon}`. Without `icon` the entity icon is used. |
| `extra_font_scale` | `1` | number | 0.7 – 1.5 | Font size factor for additional sensors. |
| `cells` | `[]` | array | – | List of cells `{name, entity}` in display order (V or mV is detected). |
| `grid_options` | `columns: 12` | object | `columns`, `rows` | Home Assistant layout. Without wrapping: min. 6 rows, default derived from `cell_height` (7 rows at 340 px). With wrapping: `rows: auto`. |

**`legend_stops` keys** (only with `battery_type: custom`, first step = top of the legend):

| Key | Description |
|---|---|
| `color` | Any CSS color, e.g. `'#00ee00'`. |
| `mv` | Voltage (mV) at the **upper edge** of the segment. Must decrease from top to bottom. |
| `pct` | Segment height in %. All steps always add up to 100 %. |
| `top` / `bottom` | Optional labels at the top / bottom of the segment. |

**Animation colors** (`[R, G, B]` list or `'#rrggbb'`, charging = `_up`, discharging = `_down`; only set a color if you want to change the default):

| Option | Default color |
|---|---|
| `color_tip1_up` | `[80, 160, 255]` |
| `color_tip1_down` | `[255, 95, 22]` |
| `color_tip2_up` | `[80, 160, 255]` |
| `color_tip2_down` | `[255, 95, 22]` |
| `color_tip3_up` | `[80, 160, 255]` |
| `color_tip3_down` | `[255, 95, 22]` |
| `color_bar1_up` | `[20, 130, 255]` |
| `color_bar1_down` | `[255, 110, 30]` |
| `color_bar2_up` | `[20, 130, 255]` |
| `color_bar2_down` | `[255, 40, 50]` |
| `color_pulse_up` | `[140, 195, 255]` |
| `color_pulse_down` | `[255, 30, 30]` |
| `color_wave_up` | `[140, 195, 255]` |
| `color_wave_down` | `[255, 30, 30]` |
| `color_bf` | `[45, 115, 255]` |

The prefix names the effect: `tip1` – `tip3` = glowing cell top, `bar1` / `bar2` = running bar, `pulse` / `wave` = cell wall animation, `bf` = balancing energy flow.

**Battery types**

| `battery_type` | Voltage range (per cell) |
|---|---|
| `lifepo4` | 2.60 V – 3.65 V |
| `nmc` | 3.00 V – 4.20 V |
| `lead` | 1.80 V – 2.45 V (2 V cell) |
| `custom` | `custom_min_mv` – `custom_max_mv` or own `legend_stops` |

**Balancing icon:** shown when `balance_sensor` is `on`, or when Δ ≥ `cell_diff` and the highest cell ≥ `cell_bal_over`.

> Cards created through the card picker are pre-filled with the example sensors `sensor.status_of_charge`, `sensor.pack_watt` and `sensor.delta_mvolts_between_cells`. `card_height` and `background` are no longer supported (since 0.7.0).

* * *

## Example Configuration

### Standard (LiFePO4, 8 cells)

```yaml
type: custom:battery-cells-card
title: Battery Cells
battery_type: lifepo4
show_legend: true
soc_entity: sensor.status_of_charge
watt_entity: sensor.pack_watt
balance_sensor: sensor.cell_balance_active
cell_diff_sensor: sensor.delta_mvolts_between_cells
cell_diff: 10
cell_bal_over: 3000
cell_unit: mV
auto_detect_low_high: true
show_soc_icon: true
show_soc_value: true
show_sync_icon: true
show_cell_diff: true
use_3d: true
show_slices: true
slice_strength: medium
cells:
  - name: Cell 1
    entity: sensor.cell1
  - name: Cell 2
    entity: sensor.cell2
  - name: Cell 3
    entity: sensor.cell3
  - name: Cell 4
    entity: sensor.cell4
  - name: Cell 5
    entity: sensor.cell5
  - name: Cell 6
    entity: sensor.cell6
  - name: Cell 7
    entity: sensor.cell7
  - name: Cell 8
    entity: sensor.cell8
grid_options:
  columns: 24
  rows: 8
```

### With animations

```yaml
type: custom:battery-cells-card
title: Battery Cells
soc_entity: sensor.status_of_charge
watt_entity: sensor.pack_watt
cell_diff_sensor: sensor.delta_mvolts_between_cells
auto_detect_low_high: true
show_flow: true            # charge / discharge animation (needs watt_entity)
flow_tip: tip1             # off | tip1 | tip2 | tip3
flow_bar: bar1             # off | bar1 | bar2
flow_glow: pulse           # off | pulse | wave
flow_speed_mode: auto      # manual | auto (power-dependent)
flow_max_charge_w: 3000
flow_max_discharge_w: 3000
show_balance_flow: true    # energy line from highest to lowest cell while balancing
color_bf: [45, 115, 255]   # optional: own color [R, G, B]
cells:
  - { name: Cell 1, entity: sensor.cell1 }
  - { name: Cell 2, entity: sensor.cell2 }
```

### With cell wrapping (16 cells)

```yaml
type: custom:battery-cells-card
title: Battery 16S
chunk_cells: true
chunk_mode: auto8
cell_height: 340
min_cell_width: 50
soc_entity: sensor.status_of_charge
cells:
  - name: C1
    entity: sensor.cell1
  # … up to C16
grid_options:
  columns: 24
```

### Custom scale (NMC-like colors)

```yaml
type: custom:battery-cells-card
battery_type: custom
custom_min_mv: 3000
scale_gradient: false
legend_stops:
  - { color: '#ff0000', mv: 4200, pct: 5,  top: '4.20V', bottom: '' }
  - { color: '#ffa500', mv: 4100, pct: 5,  top: '4.10V', bottom: '' }
  - { color: '#ffff00', mv: 4000, pct: 10, top: '4.00V', bottom: '' }
  - { color: '#00ee00', mv: 3700, pct: 60, top: '3.70V', bottom: '3.50V' }
  - { color: '#ffff00', mv: 3500, pct: 10, top: '',      bottom: '3.30V' }
  - { color: '#ffa500', mv: 3300, pct: 5,  top: '',      bottom: '3.10V' }
  - { color: '#ff0000', mv: 3100, pct: 5,  top: '',      bottom: '3.00V' }
cells:
  - { name: Cell 1, entity: sensor.cell1 }
  - { name: Cell 2, entity: sensor.cell2 }
```

* * *

## Editor documentation

The editor consists of collapsible panels, numbered in the order they appear. Every change is applied to the preview immediately. Between the settings of a panel thin dividers separate the groups.

Items with a badge ([![visible when 2.1 = Custom](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square) [![visible when 8.1 on](https://img.shields.io/badge/visible%20when-8.1%20on-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-8.1%20on-blue?style=flat-square)) are only shown in the editor when the stated setting is selected. Orange = battery type *Custom*, blue = another switch or mode.

### Contents

1. [Name](#1-name)
   - [1.1 Name](#11-name)
2. [Battery Chemistry](#2-battery-chemistry)
   - [2.1 Battery type](#21-battery-type)
   - [2.2 Color preset](#22-color-preset) [![visible when 2.1 = Custom](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)
   - [2.3 Smooth color gradient](#23-smooth-color-gradient) [![visible when 2.1 = Custom](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)
   - [2.4 Scale step](#24-scale-step) [![visible when 2.1 = Custom](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)
   - [2.5 Step color](#25-step-color) [![visible when 2.1 = Custom](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)
   - [2.6 Step labels](#26-step-labels) [![visible when 2.1 = Custom](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)
   - [2.7 Reorder and delete](#27-reorder-and-delete) [![visible when 2.1 = Custom](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)
   - [2.8 Add scale step](#28-add-scale-step) [![visible when 2.1 = Custom](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)
   - [2.9 Min. voltage](#29-min-voltage) [![visible when 2.1 = Custom](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)
   - [2.10 Automatic corrections](#210-automatic-corrections) [![visible when 2.1 = Custom](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)
3. [Cells](#3-cells)
   - [3.1 Add cell](#31-add-cell)
   - [3.2 Change entity and name](#32-change-entity-and-name)
   - [3.3 Reorder and delete](#33-reorder-and-delete)
4. [Legend Sensors](#4-legend-sensors)
   - [4.1 State of charge (SOC)](#41-state-of-charge-soc)
   - [4.2 Power (W)](#42-power-w)
   - [4.3 Cell voltage delta](#43-cell-voltage-delta)
   - [4.4 Balancing active](#44-balancing-active)
5. [Balancing and Min. Cell / Max. Cell](#5-balancing-and-min-cell--max-cell)
   - [5.1 Delta threshold](#51-delta-threshold)
   - [5.2 Balancing from cell voltage](#52-balancing-from-cell-voltage)
   - [5.3 Auto-detect lowest / highest cell](#53-auto-detect-lowest--highest-cell)
   - [5.4 Lowest cell sensor](#54-lowest-cell-sensor) [![visible when 5.3 off](https://img.shields.io/badge/visible%20when-5.3%20off-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-5.3%20off-blue?style=flat-square)
   - [5.5 Highest cell sensor](#55-highest-cell-sensor) [![visible when 5.3 off](https://img.shields.io/badge/visible%20when-5.3%20off-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-5.3%20off-blue?style=flat-square)
6. [Display](#6-display)
   - [6.1 Font size](#61-font-size)
   - [6.2 Cell unit](#62-cell-unit)
   - [6.3 Cell gap](#63-cell-gap)
   - [6.4 Title spacing](#64-title-spacing)
   - [6.5 Card padding](#65-card-padding)
   - [6.6 Cell height](#66-cell-height)
   - [6.7 Min. cell width](#67-min-cell-width)
   - [6.8 Overlay opacity](#68-overlay-opacity)
   - [6.9 Show legend](#69-show-legend)
   - [6.10 Legend items](#610-legend-items) [![visible when 6.9 on](https://img.shields.io/badge/visible%20when-6.9%20on-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-6.9%20on-blue?style=flat-square)
   - [6.11 Show additional sensors](#611-show-additional-sensors)
   - [6.12 3D frame](#612-3d-frame)
   - [6.13 Disc shading](#613-disc-shading)
   - [6.14 Shading strength](#614-shading-strength) [![visible when 6.13 on](https://img.shields.io/badge/visible%20when-6.13%20on-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-6.13%20on-blue?style=flat-square)
   - [6.15 Theme](#615-theme)
7. [Animation](#7-animation)
   - [7.1 Balancing energy flow](#71-balancing-energy-flow) [![visible when 5.3 on or 5.4 + 5.5 set](https://img.shields.io/badge/visible%20when-5.3%20on%20or%205.4%20%2B%205.5%20set-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-5.3%20on%20or%205.4%20%2B%205.5%20set-blue?style=flat-square)
   - [7.2 Charge / discharge animation](#72-charge--discharge-animation) [![visible when 4.2 set](https://img.shields.io/badge/visible%20when-4.2%20set-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-4.2%20set-blue?style=flat-square)
   - [7.3 Glowing cell top](#73-glowing-cell-top) [![visible when 7.2 on](https://img.shields.io/badge/visible%20when-7.2%20on-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-7.2%20on-blue?style=flat-square)
   - [7.4 Running bar](#74-running-bar) [![visible when 7.2 on](https://img.shields.io/badge/visible%20when-7.2%20on-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-7.2%20on-blue?style=flat-square)
   - [7.5 Cell wall animation](#75-cell-wall-animation) [![visible when 7.2 on](https://img.shields.io/badge/visible%20when-7.2%20on-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-7.2%20on-blue?style=flat-square)
   - [7.6 Light up all cells simultaneously](#76-light-up-all-cells-simultaneously) [![visible when 7.2 on](https://img.shields.io/badge/visible%20when-7.2%20on-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-7.2%20on-blue?style=flat-square)
   - [7.7 Speed](#77-speed) [![visible when 7.2 on + one effect on](https://img.shields.io/badge/visible%20when-7.2%20on%20%2B%20one%20effect%20on-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-7.2%20on%20%2B%20one%20effect%20on-blue?style=flat-square)
   - [7.8 Speed (×)](#78-speed-) [![visible when 7.7 = Constant](https://img.shields.io/badge/visible%20when-7.7%20%3D%20Constant-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-7.7%20%3D%20Constant-blue?style=flat-square)
   - [7.9 Max. charge / discharge power (W)](#79-max-charge--discharge-power-w) [![visible when 7.7 = Power-dependent](https://img.shields.io/badge/visible%20when-7.7%20%3D%20Power--dependent-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-7.7%20%3D%20Power--dependent-blue?style=flat-square)
   - [7.10 Speed factor](#710-speed-factor) [![visible when 7.7 = Power-dependent](https://img.shields.io/badge/visible%20when-7.7%20%3D%20Power--dependent-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-7.7%20%3D%20Power--dependent-blue?style=flat-square)
   - [7.11 Change animation colors](#711-change-animation-colors) [![visible when 7.1 or 7.2 on](https://img.shields.io/badge/visible%20when-7.1%20or%207.2%20on-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-7.1%20or%207.2%20on-blue?style=flat-square)
8. [Cell Wrapping](#8-cell-wrapping)
   - [8.1 Enable cell wrapping](#81-enable-cell-wrapping)
   - [8.2 Wrapping mode](#82-wrapping-mode) [![visible when 8.1 on](https://img.shields.io/badge/visible%20when-8.1%20on-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-8.1%20on-blue?style=flat-square)
   - [8.3 Cells per row](#83-cells-per-row) [![visible when 8.1 on + 8.2 = Manual](https://img.shields.io/badge/visible%20when-8.1%20on%20%2B%208.2%20%3D%20Manual-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-8.1%20on%20%2B%208.2%20%3D%20Manual-blue?style=flat-square)
9. [Additional Sensors](#9-additional-sensors)
   - [9.1 Add sensor](#91-add-sensor)
   - [9.2 Name and icon](#92-name-and-icon)
   - [9.3 Reorder and delete](#93-reorder-and-delete)
   - [9.4 Font size](#94-font-size)

* * *

### 1. Name

#### 1.1 Name

> **Setting:** Free text for the card title (`title`). Default: `Battery Cells`.
>
> **Purpose:** The title is shown at the top of the card. It helps to tell several battery packs apart on one dashboard.

* * *

### 2. Battery Chemistry

The custom scale (2.2 – 2.10) is part of this panel and is only shown when the battery type is *Custom*.

#### 2.1 Battery type

> **Setting:** *LiFePO4*, *NMC / NCM (Li-Ni-Mn-Co)*, *Lead-Acid (2V cell)* or *Custom* (`battery_type`).
>
> **Purpose:** Defines the voltage range that is mapped to the bar height and the legend colors and labels (LiFePO4 2.60 – 3.65 V, NMC 3.00 – 4.20 V, lead 1.80 – 2.45 V per cell). Changing the type also suggests a fitting value for [5.2](#52-balancing-from-cell-voltage). *Custom* unlocks the custom scale below.

#### 2.2 Color preset

[![visible when 2.1 = Custom](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)

> **Setting:** Dropdown with *No preset* and 7 ready-made scales: LiFePO4 Standard, Purple / Pink, Sunset, Neon, Ocean, NMC / NCM, Lead-Acid.
>
> **Purpose:** Quick start for your own scale. A preset replaces all steps and sets the min. voltage. You can edit the steps afterwards; the dropdown switches back to *No preset* as soon as they differ.

#### 2.3 Smooth color gradient

[![visible when 2.1 = Custom](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)

> **Setting:** Switch on / off (`scale_gradient`). Default: off.
>
> **Purpose:** Off = hard color segments like the legend. On = soft transitions between the colors, in the cells and in the legend. The labels in the legend stay at their position.

#### 2.4 Scale step

[![visible when 2.1 = Custom](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)

> **Setting:** One row per color segment, from the top of the legend downwards. Each row has the color swatch, the **top edge voltage in mV** (`mv`) and the **share in %** (`pct`) of the segment.
>
> **Purpose:** Defines where the colors change. The voltage is the value at the upper edge of the segment, the share is its height in the legend. Tap the swatch or the pencil to open the color and label settings.

#### 2.5 Step color

[![visible when 2.1 = Custom](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)

> **Setting:** Hex color (e.g. `#00ee00`) or the sliders *Hue*, *Saturation* and *Lightness* (`color`).
>
> **Purpose:** Color of the segment in cells and legend. Hex field and sliders stay in sync, so you can start from a hex value and fine-tune with the sliders.

#### 2.6 Step labels

[![visible when 2.1 = Custom](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)

> **Setting:** Optional texts *Top label* and *Bottom label* (`top`, `bottom`), e.g. `3.65V`.
>
> **Purpose:** Labels at the upper and lower edge of the segment in the legend. Typically only the important voltages are labelled.

#### 2.7 Reorder and delete

[![visible when 2.1 = Custom](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)

> **Setting:** Drag handle to move a step, cross to delete it.
>
> **Purpose:** Brings the steps into the right order or removes unneeded ones. After moving, the voltage of the step is set between its new neighbours.

#### 2.8 Add scale step

[![visible when 2.1 = Custom](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)

> **Setting:** Button *Add scale step*. Maximum 20 steps, at least 2 are needed for a custom scale.
>
> **Purpose:** Adds a segment below the last one with a voltage 100 mV lower. Useful for finer scales with more color segments.

#### 2.9 Min. voltage

[![visible when 2.1 = Custom](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)

> **Setting:** Number in mV, 1000 – 5000, default 2600 (`custom_min_mv`). At the bottom of the custom scale section.
>
> **Purpose:** Lower edge of the bottom step: the voltage at which a cell bar counts as empty. It is lowered automatically if it would collide with the bottom step. The upper end of the scale is the top edge of the first step. (`custom_max_mv` is only used when fewer than 2 steps exist and can be set in YAML.)

#### 2.10 Automatic corrections

[![visible when 2.1 = Custom](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Custom-orange?style=flat-square)

> **Setting:** Nothing to set.
>
> **Purpose:** The editor prevents invalid scales: voltages always decrease from top to bottom, shares always add up to 100 % (the neighbouring step takes the difference) and the bottom step ends at the min. voltage.

* * *

### 3. Cells

#### 3.1 Add cell

> **Setting:** Select a sensor in the field *Add Cell*.
>
> **Purpose:** Adds one bar to the card. The name is taken from the friendly name of the entity. Values in V or mV are detected automatically. Tapping a cell on the dashboard opens the sensor details.

#### 3.2 Change entity and name

> **Setting:** Change the sensor directly in the row; tap the pencil to edit the displayed name.
>
> **Purpose:** Replaces a sensor or shortens the name that is shown at the top of the bar (e.g. `C1`).

#### 3.3 Reorder and delete

> **Setting:** Drag handle to move a cell, cross to delete it.
>
> **Purpose:** The order in the list is the order of the bars from left to right.

* * *

### 4. Legend Sensors

#### 4.1 State of charge (SOC)

> **Setting:** Sensor entity (`soc_entity`).
>
> **Purpose:** Shows the charge level in percent in the legend. Tapping it opens the sensor details.

#### 4.2 Power (W)

> **Setting:** Sensor entity (`watt_entity`).
>
> **Purpose:** Controls the battery icon in the legend: green plus while charging, red minus while discharging, blue neutral icon at 0 W. It also drives the charge / discharge animation (see panel [7](#7-animation)).

#### 4.3 Cell voltage delta

> **Setting:** Sensor entity in V or mV (`cell_diff_sensor`).
>
> **Purpose:** Shows the difference between the highest and lowest cell as `Δ x mV` in the legend. It is also used to decide when the sync icon appears (see [5.1](#51-delta-threshold)).

#### 4.4 Balancing active

> **Setting:** Optional entity of any type (`balance_sensor`).
>
> **Purpose:** If its state is `on`, the sync icon is shown. Use it when your BMS reports balancing directly. Without it the icon is derived from the delta and the cell voltage ([5.1](#51-delta-threshold), [5.2](#52-balancing-from-cell-voltage)).

* * *

### 5. Balancing and Min. Cell / Max. Cell

Two groups: *Balancing detection* (5.1, 5.2) and *Lowest / highest cell* (5.3 – 5.5).

#### 5.1 Delta threshold

> **Setting:** Number in mV, default 8 (`cell_diff`).
>
> **Purpose:** The sync icon is only shown when the difference between highest and lowest cell is at least this value.

#### 5.2 Balancing from cell voltage

> **Setting:** Number in mV, default 3000 (`cell_bal_over`). Changing the battery type suggests 3000 (LiFePO4 / Custom), 3500 (NMC) or 2000 (lead).
>
> **Purpose:** Most BMS only balance near the full state. The sync icon therefore also requires that the highest cell reaches this voltage.

#### 5.3 Auto-detect lowest / highest cell

> **Setting:** Switch on / off (`auto_detect_low_high`). Default: on.
>
> **Purpose:** On = the card finds the lowest cell (red ring) and highest cell (blue ring) itself from the cell values. Off = you provide your own sensors ([5.4](#54-lowest-cell-sensor), [5.5](#55-highest-cell-sensor)), e.g. the numbers reported by your BMS. The two cells are also the start and end of the balancing energy flow ([7.1](#71-balancing-energy-flow)).

#### 5.4 Lowest cell sensor

[![visible when 5.3 off](https://img.shields.io/badge/visible%20when-5.3%20off-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-5.3%20off-blue?style=flat-square)

> **Setting:** Sensor entity (`pack_cell_low`). Only visible with auto-detect off.
>
> **Purpose:** The sensor value is the number of the lowest cell (1 = first cell in your list) and gets the red ring.

#### 5.5 Highest cell sensor

[![visible when 5.3 off](https://img.shields.io/badge/visible%20when-5.3%20off-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-5.3%20off-blue?style=flat-square)

> **Setting:** Sensor entity (`pack_cell_high`). Only visible with auto-detect off.
>
> **Purpose:** The sensor value is the number of the highest cell and gets the blue ring.

* * *

### 6. Display

Group *Cell appearance* (6.1 – 6.8), then the switches (6.9 – 6.14) and the theme (6.15).

#### 6.1 Font size

> **Setting:** Number 4 – 16 in steps of 0.5, default 8 (`font_size`).
>
> **Purpose:** Base size for names, values and legend texts. All texts scale with the card width; this value shifts them larger or smaller. On small displays it is limited to 8.

#### 6.2 Cell unit

> **Setting:** *mV* or *V* (`cell_unit`). Default: mV.
>
> **Purpose:** Unit of the value at the bottom of each cell: whole millivolts (`3321 mV`) or volts with three decimals (`3.321 V`).

#### 6.3 Cell gap

> **Setting:** Number 0 – 16 px, default 4 (`cell_gap`).
>
> **Purpose:** Distance between the cells. Smaller gaps leave more space for the bars.

#### 6.4 Title spacing

> **Setting:** Number 0 – 60 px, default 20 (`top_padding`).
>
> **Purpose:** Space between the title and the cells. On small displays it is limited to 8 px.

#### 6.5 Card padding

> **Setting:** Number 0 – 40 px, default 10 (`container_padding`).
>
> **Purpose:** Inner margin between card edge and cells. On small displays it is limited to 6 px.

#### 6.6 Cell height

> **Setting:** Slider with px input, 280 – 800 px, default 340 (`cell_height`).
>
> **Purpose:** Height of the cell row. **Sections dashboard:** the card height comes from the layout rows (layout tab) and the slider is linked with them in both directions: moving the slider sets the rows, changing the rows in the layout tab moves the slider (1 row ≈ 64 px minus title and padding, so the value is an approximation). **Other dashboards:** the slider sets the card height directly. **With cell wrapping ([8.1](#81-enable-cell-wrapping)):** height of each row of cells.

#### 6.7 Min. cell width

> **Setting:** Slider with px input, 40 – 120 px, default 50 (`min_cell_width`).
>
> **Purpose:** Smallest width a cell may have. A higher value makes the card wrap earlier and keeps the cells wider. Only has an effect with cell wrapping ([8.1](#81-enable-cell-wrapping)).

#### 6.8 Overlay opacity

> **Setting:** Slider 0 – 100 %, default 70 % (`overlay_opacity`, 0 – 1 in YAML).
>
> **Purpose:** Darkens the empty part of each bar above the voltage level. Higher values make the fill level easier to read, lower values show more of the scale colors.

#### 6.9 Show legend

> **Setting:** Switch on / off (`show_legend`). Default: on.
>
> **Purpose:** The legend is the first column with the color scale, voltage labels and the status items from [6.10](#610-legend-items). Off = only the cells are shown.

#### 6.10 Legend items

[![visible when 6.9 on](https://img.shields.io/badge/visible%20when-6.9%20on-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-6.9%20on-blue?style=flat-square)

> **Setting:** Four switches, only visible with the legend on: SOC value (`show_soc_value`), SOC icon (`show_soc_icon`), cell delta (`show_cell_diff`), sync icon (`show_sync_icon`).
>
> **Purpose:** Choose which status items are shown on the legend: charge percentage, battery icon with charge direction, `Δ mV` and the sync icon during balancing.

#### 6.11 Show additional sensors

> **Setting:** Switch on / off (`show_extra_sensors`). Default: off.
>
> **Purpose:** Shows the sensors from panel [9](#9-additional-sensors) in a row above the cells. Adding a sensor in panel 9 switches it on automatically.

#### 6.12 3D frame

> **Setting:** Switch on / off (`use_3d`). Default: off.
>
> **Purpose:** Metal housing with a pole on top around each cell. Off = flat frame with a thin border. The frame becomes thinner automatically on narrow cards.

#### 6.13 Disc shading

> **Setting:** Switch on / off (`show_slices`). Default: off.
>
> **Purpose:** Divides the colored bars into fine discs with shadow. Works with and without the 3D frame.

#### 6.14 Shading strength

[![visible when 6.13 on](https://img.shields.io/badge/visible%20when-6.13%20on-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-6.13%20on-blue?style=flat-square)

> **Setting:** *Subtle*, *Medium* or *Strong* (`slice_strength`). Only visible with [6.13](#613-disc-shading) on.
>
> **Purpose:** Intensity of the shadow between the discs. *Subtle* is barely visible, *Strong* gives a pronounced stacked look.

#### 6.15 Theme

> **Setting:** Dropdown with *Default* and all themes installed in Home Assistant (`theme`).
>
> **Purpose:** Gives this card its own color scheme (text, accent and background colors) independent of the dashboard, e.g. a dark card on a light dashboard. *Default* follows the dashboard theme.

* * *

### 7. Animation

The panel appears as soon as the power sensor ([4.2](#42-power-w)) delivers a value or the balancing detection ([5.3](#53-auto-detect-lowest--highest-cell)) is available. Animations pause while the card is not visible.

#### 7.1 Balancing energy flow

[![visible when 5.3 on or 5.4 + 5.5 set](https://img.shields.io/badge/visible%20when-5.3%20on%20or%205.4%20%2B%205.5%20set-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-5.3%20on%20or%205.4%20%2B%205.5%20set-blue?style=flat-square)

> **Setting:** Switch on / off (`show_balance_flow`). Default: off.
>
> **Purpose:** While balancing is active and the lowest and highest cell are known, an animated energy line runs from the highest to the lowest cell (across wrapped rows as well). The speed grows with the cell difference (up to 80 mV). The line fades out when balancing ends and when one of the two cells changes.

#### 7.2 Charge / discharge animation

[![visible when 4.2 set](https://img.shields.io/badge/visible%20when-4.2%20set-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-4.2%20set-blue?style=flat-square)

> **Setting:** Switch on / off (`show_flow`). Default: off.
>
> **Purpose:** Animates the cells while the battery charges (power > 0, effects move up) or discharges (power < 0, effects move down). At 0 W nothing is animated.

#### 7.3 Glowing cell top

[![visible when 7.2 on](https://img.shields.io/badge/visible%20when-7.2%20on-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-7.2%20on-blue?style=flat-square)

> **Setting:** *Off*, *Glow*, *Glow (subtle)* or *Glow (explosion)* (`flow_tip`). Default: Glow.
>
> **Purpose:** Lights up the top edge of the fill level. *Glow* is a bright flash, *subtle* a thin soft band, *explosion* adds sparks and a ring burst.

#### 7.4 Running bar

[![visible when 7.2 on](https://img.shields.io/badge/visible%20when-7.2%20on-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-7.2%20on-blue?style=flat-square)

> **Setting:** *Off*, *Running bar 1 (short tail)* or *Running bar 2 (long tail)* (`flow_bar`). Default: off.
>
> **Purpose:** A bright bar travels through the filled part of the cell in the direction of the energy flow and leaves a tail behind it.

#### 7.5 Cell wall animation

[![visible when 7.2 on](https://img.shields.io/badge/visible%20when-7.2%20on-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-7.2%20on-blue?style=flat-square)

> **Setting:** *Off*, *Pulse (edge to center)* or *Cell wall energy* (`flow_glow`). Default: off.
>
> **Purpose:** *Pulse*: a soft glow runs from both cell walls towards the center and lights up the top edge of the fill level horizontally. *Cell wall energy*: waves run along the side walls.

#### 7.6 Light up all cells simultaneously

[![visible when 7.2 on](https://img.shields.io/badge/visible%20when-7.2%20on-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-7.2%20on-blue?style=flat-square)

> **Setting:** Switch on / off (`flow_sync`). Default: off.
>
> **Purpose:** Off = the effect starts cell by cell, like a wave through the pack. On = all cells light up at the same time.

#### 7.7 Speed

[![visible when 7.2 on + one effect on](https://img.shields.io/badge/visible%20when-7.2%20on%20%2B%20one%20effect%20on-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-7.2%20on%20%2B%20one%20effect%20on-blue?style=flat-square)

> **Setting:** *Constant* or *Power-dependent* (`flow_speed_mode`). Default: Constant.
>
> **Purpose:** Constant uses one speed for everything. Power-dependent adapts the speed to the current power: slow at low power, fast near your maximum power ([7.9](#79-max-charge--discharge-power-w)).

#### 7.8 Speed (×)

[![visible when 7.7 = Constant](https://img.shields.io/badge/visible%20when-7.7%20%3D%20Constant-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-7.7%20%3D%20Constant-blue?style=flat-square)

> **Setting:** Slider 0.1 – 2, default 1 (`flow_speed`).
>
> **Purpose:** Playback speed of the animations.

#### 7.9 Max. charge / discharge power (W)

[![visible when 7.7 = Power-dependent](https://img.shields.io/badge/visible%20when-7.7%20%3D%20Power--dependent-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-7.7%20%3D%20Power--dependent-blue?style=flat-square)

> **Setting:** Two numbers, 100 – 100000 W, default 3000 (`flow_max_charge_w`, `flow_max_discharge_w`).
>
> **Purpose:** The power at which the animation reaches its maximum speed. Set them to the power your system really reaches, otherwise the animation stays slow.

#### 7.10 Speed factor

[![visible when 7.7 = Power-dependent](https://img.shields.io/badge/visible%20when-7.7%20%3D%20Power--dependent-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-7.7%20%3D%20Power--dependent-blue?style=flat-square)

> **Setting:** Slider 0.2 – 2, default 1 (`flow_speed_auto`).
>
> **Purpose:** Scales the power-dependent speed. With factor 1 the speed rises from 0.2× at almost no power to 1.6× at maximum power; factor 2 doubles it.

#### 7.11 Change animation colors

[![visible when 7.1 or 7.2 on](https://img.shields.io/badge/visible%20when-7.1%20or%207.2%20on-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-7.1%20or%207.2%20on-blue?style=flat-square)

> **Setting:** Switch (editor only) that shows color pickers (`color_*`).
>
> **Purpose:** One color per active effect, separately for charging and discharging, plus the color of the balancing flow. Only colors that differ from the default are saved in the configuration.

* * *

### 8. Cell Wrapping

#### 8.1 Enable cell wrapping

> **Setting:** Switch on / off (`chunk_cells`). Default: off.
>
> **Purpose:** Wraps the cells into several rows when the card is too narrow, so they are never squeezed (ideal for phones and large packs). With wrapping on, the card height is calculated from the cell height ([6.6](#66-cell-height)) and the layout rows are set to *auto*. Switching it off sets the layout rows again from the cell height.

#### 8.2 Wrapping mode

[![visible when 8.1 on](https://img.shields.io/badge/visible%20when-8.1%20on-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-8.1%20on-blue?style=flat-square)

> **Setting:** *Auto 4*, *Auto 8* or *Manual* (`chunk_mode`). Default: Auto 8.
>
> **Purpose:** *Auto 4* wraps in rows of 4, 8, 16 …, *Auto 8* in rows of 8, 16 …, depending on the card width. *Manual* uses the value from [8.3](#83-cells-per-row) as upper limit.

#### 8.3 Cells per row

[![visible when 8.1 on + 8.2 = Manual](https://img.shields.io/badge/visible%20when-8.1%20on%20%2B%208.2%20%3D%20Manual-blue?style=flat-square)](https://img.shields.io/badge/visible%20when-8.1%20on%20%2B%208.2%20%3D%20Manual-blue?style=flat-square)

> **Setting:** Number 2 – 32, default 8 (`chunk_size`). Only visible in *Manual* mode.
>
> **Purpose:** Maximum number of cells per row. If the card is too narrow for that many, fewer cells per row are used.

* * *

### 9. Additional Sensors

#### 9.1 Add sensor

> **Setting:** Select a sensor in the field *Add Sensor*.
>
> **Purpose:** Adds a value row above the cells, e.g. temperature, current or cycle count. The unit is taken from the entity. Tapping a value opens the sensor details.

#### 9.2 Name and icon

> **Setting:** Tap the pencil: free text *Name* and an icon picker (`name`, `icon`).
>
> **Purpose:** The name is shown in front of the value. Without an icon the standard icon of the entity is used.

#### 9.3 Reorder and delete

> **Setting:** Drag handle to move a sensor, cross to delete it.
>
> **Purpose:** The order in the list is the order from left to right.

#### 9.4 Font size

> **Setting:** Slider 0.7 – 1.5, default 1 (`extra_font_scale`). At the bottom of the panel.
>
> **Purpose:** Size factor for the texts and icons of the additional sensors, independent of the cell font size.

* * *

## Screenshots

[![Screenshot1](https://github.com/user-attachments/assets/5f8281fe-c0eb-457e-928a-3d51ead546c3)](https://github.com/user-attachments/assets/5f8281fe-c0eb-457e-928a-3d51ead546c3) [![Screenshot2](https://github.com/user-attachments/assets/6fc3ca88-7ca2-476b-aae2-5a5b7ef6833a)](https://github.com/user-attachments/assets/6fc3ca88-7ca2-476b-aae2-5a5b7ef6833a) [![Screenshot3](https://github.com/user-attachments/assets/a020dbda-9a2a-456c-b50e-341ecf2aee2f)](https://github.com/user-attachments/assets/a020dbda-9a2a-456c-b50e-341ecf2aee2f)

* * *

## License

**Creative Commons – CC BY-NC-SA 4.0**

- Editing & modifying allowed
- Non-commercial use only
- Share adaptations under same license

[Link to full license](https://creativecommons.org/licenses/by-nc-sa/4.0/)
