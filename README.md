[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5?style=flat&logo=homeassistantcommunitystore&logoColor=white)](https://github.com/hacs/integration)
[![GitHub total downloads](https://img.shields.io/github/downloads/jinx-22/battery-cell-card/total?style=flat&color=red&logo=github&logoColor=white)](https://github.com/jinx-22/battery-cell-card/releases)
[![GitHub release](https://img.shields.io/github/release/jinx-22/battery-cell-card?include_prereleases=&sort=semver&color=blue&style=flat&logo=github&logoColor=white)](https://github.com/jinx-22/battery-cell-card/releases/)
[![File size](https://img.shields.io/github/size/jinx-22/battery-cell-card/battery-cells-card.js?label=Card%20Size&style=flat&logo=javascript&logoColor=white)](https://github.com/jinx-22/battery-cell-card/blob/main/battery-cells-card.js)
[![Editor Settings - Docs](https://img.shields.io/badge/Editor%20Settings-Docs-e91e63?style=flat&logo=readthedocs&logoColor=white)](#editor-documentation)
[![README deutsch](https://img.shields.io/badge/README-DE-blue?style=flat&logo=googletranslate&logoColor=white)](README_DE.md)
[![stars](https://img.shields.io/github/stars/jinx-22/battery-cell-card?style=flat&logo=github&logoColor=white)](https://github.com/jinx-22/battery-cell-card/stargazers)
[![Donate Bitcoin](https://img.shields.io/badge/Bitcoin-Donate-F7931A?style=flat&logo=bitcoin&logoColor=white)](#bitcoin)
[![Donate Lightning](https://img.shields.io/badge/%E2%9A%A1-Lightning-FFD700?style=flat)](#lightning)

# Battery Cells Card - Cell Voltage Monitoring in Real Time

*(Link to German version: [Deutsch](README_DE.md))*

**Version:** 0.9.6

**Description:** A custom Home Assistant card for visualizing battery cells, cell voltages, SOC, balancing status and differences.  
Ideal for LiFePO₄ battery systems, also suitable for NMC/NCM and lead-acid batteries. Also available as a simple battery display for home batteries that don't provide cell voltage sensors.

### ✨ New in v0.9.6

---

Mode: Battery monitoring (without cell voltages)

<img width="30%" height="auto" alt="brave_7u0pNbkvNC" src="https://github.com/user-attachments/assets/41e6d55a-ee29-494e-99ed-b011efbbe16d" />

---

Mode: Cell monitoring (detailed)

<img width="50%" height="auto" alt="brave_qZR7FbmqRH" src="https://github.com/user-attachments/assets/f77792e3-4cbd-475a-8ec7-5744177e5e5e" />

---

* **New card mode "Battery monitoring (without cell voltages)"** (`display_mode: battery`): The card shows only a single battery that is filled by the SOC sensor – ideal for home batteries without cell voltage sensors or when that level of detail isn't needed. It is selected at the top of the **Display Mode / Battery Chemistry** panel:
  * **Cell monitoring (detailed)** – the familiar view with all cell voltages (default)
  * **Battery monitoring (without cell voltages)** – only the legend as a single battery
  * Percentage labels in 5 / 10 / 20 / 25 % steps (`soc_step`); 0 % and 100 % are also shown with the 20 % and 25 % steps.
  * 7 color presets for the SOC scale (`soc_preset`): Standard colors, Green, Blue, Purple / Pink, Sunset, Neon, Ocean. Green and Blue.
  * Adjustable battery width from 110 to 400 px (`battery_width`).
  * Charge/discharge animations (glow, running bar, cell wall) also run on the battery.
  * Cell difference, balancing detection and sync icon are kept.
* **The sync icon rotates** while balancing is active (in both modes).
* **Editor adapts to the mode:** In battery monitoring the Cells and Cell Wrapping panels and the "Show legend" switch are greyed out. Settings that only apply to cells (battery type, lowest / highest cell, cell unit, cell gap, "Balancing from cell voltage", "All cells simultaneously") are hidden. "Min. cell width" is replaced by "Battery width".

### Full Changelog: [changelog.md](https://github.com/jinx-22/battery-cell-card/blob/main/changelog.md)

---

> [!CAUTION]
> **Note:** In cell monitoring the bar height shows the cell voltage, not the state of charge.  
> The SOC in percent can be read in the legend if an SOC sensor is assigned.  
> In battery monitoring the fill level of the battery shows the SOC directly.

---

> [!TIP]
> ### 📖 Editor Documentation
> Every setting of the visual editor is explained step by step, including the purpose of the option and when it is visible.
>
> **👉 [Editor Documentation](#editor-documentation)**

---

## Table of Contents

1. [What does this card do?](#what-does-this-card-do)
2. [Planned Features](#-planned-features)
3. [Features](#features)
4. [Installation](#installation)
5. [Support & Donations](#-support--donations)
6. [Configuration Options](#configuration-options)
7. [Example Configuration](#example-configuration)
8. [Editor Documentation](#editor-documentation)
9. [Screenshots](#screenshots)
10. [License](#license)

---

## What does this card do?

Depending on the configuration, this card can display:

* Individual cell voltages (V or mV)
* Cell voltage difference (Δ mV)
* Charge/discharge power (W)
* Charge/discharge icons
* Balancing status
* SOC value and SOC icon
* Color-coded voltage scale
* Optional smooth color gradient of the scale
* Additional sensors with custom names and icons
* Responsive scaling
* Optional row wrapping for smaller displays (Chunking)
* Optional 3D metal frame and disc-style scale
* Custom battery voltage scales and presets
* Adjustable cell and row dimensions
* Charge/discharge animations (glow, running bar, cell wall) with synchronized or sequential mode
* Balancing energy flow as an animated line between highest and lowest cell
* Adjustable animation speed and separate colors for charging, discharging and balancing
* Simple battery monitoring as a single battery with SOC fill level, percentage scale and color presets (without cell voltage sensors)
* Visual editor for easy configuration
* card-mod ready (V0.5.9.8)

Compatible with all BMS that provide individual cell sensors, e.g.:

* Daly
* JK-BMS
* smartBMS smartlabs Dongle
* All sensors that report individual cell voltages (V or mV)

---

<img width="50%" height="auto" alt="firefox_BlMrAtUIUM" src="https://github.com/user-attachments/assets/7c10b71a-4cf2-4f18-8212-059047c8a453" /><img width="50%" height="auto" alt="brave_qZR7FbmqRH" src="https://github.com/user-attachments/assets/f77792e3-4cbd-475a-8ec7-5744177e5e5e" />

---

Battery monitoring, on the other hand, only needs an SOC sensor and therefore also works with home batteries that don't provide individual cell voltages.

<img width="30%" height="auto" alt="brave_7u0pNbkvNC" src="https://github.com/user-attachments/assets/41e6d55a-ee29-494e-99ed-b011efbbe16d" />

---

## 🔜 Planned Features

All planned features have been implemented. Ideas and feature requests are welcome – please open an [discussions](https://github.com/jinx-22/battery-cell-card/discussions).

---

## Features

### Cell Visualization

* Color scale: Red → Orange → Yellow → Green
* Lowest and highest cell highlighted with a ring
* Battery types: LiFePO4, NMC/NCM, Lead-Acid (2V cell), Custom
* Custom scale with 7 presets, own colors, labels and optional smooth gradient

<img width="33%" height="auto" alt="0 8" src="https://github.com/user-attachments/assets/ae1a84b7-b2c6-4e85-a39a-7528715f04eb" />

### Battery Monitoring (without cell voltages)

* A single battery filled by the SOC sensor – without cells
* Percentage labels in 5 / 10 / 20 / 25 % steps
* 7 SOC color presets: Standard colors, Green, Blue, Purple / Pink, Sunset, Neon, Ocean (Green and Blue in a glowing laser look)
* Adjustable width (110–400 px), icons, font and 3D frame grow responsively
* Charge/discharge animations on the battery
* Cell difference, balancing detection and rotating sync icon

### Battery Status

* SOC text & icon
* Plus/minus symbol depending on charge/discharge

### Balancing

* Sync icon when balancing is active (the icon rotates)
* Display of the voltage difference Δ between the cells
* Optional animated balancing energy flow between highest and lowest cell (also across wrapped rows)

### Charge/Discharge Animations

* Glowing cell top (3 styles)
* Running bar (2 styles)
* Cell wall animation (2 styles: Pulse / Cell wall energy)
* Synchronized (all cells at the same time) or sequential (one after another through the cells)
* Speed constant or power-dependent
* Separate colors for charging, discharging and balancing energy flow

### Flexible Layout

* Automatic scaling
* Responsive for mobile and desktop
* Optional cell wrapping (Chunking) in Auto 4, Auto 8 or Manual mode
* Adjustable cell height (280–800 px) and minimum cell width (40–120 px)
* Layout rows are derived from the cell height (Home Assistant Sections)

### Display Options

* Legend on/off
* SOC value & icon separately switchable
* 3D metal frame switchable
* **Disc look of the scale** in three levels: Subtle, Medium, Strong (with and without 3D frame)
* Adjustable font size
* Additional sensors with name, icon and font size

### Sensor Support

* SOC sensor
* Power sensor (W)
* Cell difference sensor
* Balancing sensor (optional)
* Sensor for lowest & highest cell
* Individual cells **{name, entity}**
* Additional sensors **{name, entity, icon}**

---

## Installation

### HA Marketplace (HACS)

Click the button to add the repository in HA MARKETPLACE, download the card and reload your browser.

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=jinx-22&repository=battery-cell-card&category=plugin)

## HA Marketplace (HACS)

1. Open **Settings -> Marketplace**
3. Search for **Battery Cells Card**
4. Install the card
5. Reload Home Assistant or the browser

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
4. Reload the browser (CTRL + F5)

The card is now selectable and visible in the UI.

---

## 🧡 Support & Donations

If you like this integration and it adds real value to your Home Assistant setup,  
I would appreciate a small donation — every contribution helps with further development 🚀

<div align="center">

### <a id="lightning"></a>Lightning

<img width="32" alt="Lightning" src="https://github.com/user-attachments/assets/0bff59d2-7986-46cf-9d39-17fe0dbb128a" />

`usefulplay52@walletofsatoshi.com`

<img height="300" alt="Lightning - Wallet of Satoshi" src="https://github.com/user-attachments/assets/65cc18d9-05d1-4a00-8ccc-9922fdb54baf" />

### <a id="bitcoin"></a>Bitcoin

<img width="32" alt="Bitcoin" src="https://github.com/user-attachments/assets/f74cad36-8c05-4a33-89cd-b998075af33b" />

`bc1qkz7mtp23cmshxnru96lzgeayu0urlysvqk5vry`

<img height="300" alt="Bitcoin donation" src="https://github.com/user-attachments/assets/196f68e4-b0e8-4f27-bded-8c4fe13b9d45" />

</div>

**Thank you very much**, and please leave a free [![GitHub stars](https://img.shields.io/github/stars/jinx-22/battery-cell-card?style=social)](https://github.com/jinx-22/battery-cell-card/stargazers) so others can find this project too — thanks!

---

## Configuration Options

The card has a visual editor (English / German, follows the Home Assistant language). Every option can also be set in YAML. Numeric values outside the allowed range are automatically clamped.

`display_mode` selects between **cell monitoring** (`cells`, default) and **battery monitoring** (`battery`). Options that only apply to one mode are marked in their description; details on battery monitoring follow below the table.

| Option | Default | Type | Range / Values | Description |
| ------ | -------- | --- | --------------- | ------------ |
| `title` | `'Battery Cells'` | string | – | Card title. |
| `theme` | `''` | string | Theme name | Home Assistant theme for this card (empty = default theme). |
| `display_mode` | `cells` | string | `cells`, `battery` | Card mode: `cells` = cell monitoring (detailed, all cell voltages), `battery` = battery monitoring (without cell voltages, a single battery with SOC fill level). |
| `soc_preset` | `traffic` | string | `traffic`, `green`, `blue`, `purple`, `sunset`, `neon`, `ocean` | `battery` only: color scale of the battery. `traffic` = Standard colors, `green` / `blue` = glowing laser green / laser blue, `purple` = Purple / Pink. |
| `soc_step` | `'10'` | string / number | `5`, `10`, `20`, `25` | `battery` only: steps of the percentage labels. 0 % and 100 % are only shown with 20 and 25. |
| `battery_width` | `120` | number | 110 – 400 | `battery` only: width of the battery (px). On a narrow card it is limited to the card width. |
| `battery_type` | `lifepo4` | string | `lifepo4`, `nmc`, `lead`, `custom` | Battery chemistry and voltage scale (cell monitoring only). |
| `custom_min_mv` | `2600` | number | 1000 – 5000 | `custom` only: minimum cell voltage (mV). With `legend_stops` it is the lower edge of the bottom step. |
| `custom_max_mv` | `3650` | number | 1000 – 5000 | `custom` only: maximum cell voltage (mV). Used when fewer than 2 `legend_stops` exist. YAML only (not in the editor). |
| `legend_stops` | `[]` | array | 2 – 20 steps | `custom` only: custom scale steps `{color, mv, pct, top, bottom}` (see note below). |
| `scale_gradient` | `false` | boolean | – | Soft color gradient instead of hard segments. Applies to the `custom` scale (cells + legend) and, in battery monitoring, to the SOC scale (not for `green` / `blue`, which always use a gradient). |
| `show_legend` | `true` | boolean | – | Show the legend column. In battery monitoring the battery is always visible. |
| `soc_entity` | `null` | string / null | Sensor | Sensor for the state of charge (%). Required in battery monitoring: it determines the fill level. |
| `watt_entity` | `null` | string / null | Sensor | Power sensor (W). Positive = charging, negative = discharging. Required for charge/discharge animations. |
| `cell_diff_sensor` | `null` | string / null | Sensor | Cell voltage difference (Δ). Unit `V` / `mV` is detected; without unit, values below 0.1 are treated as V. |
| `balance_sensor` | `null` | string / null | Entity | Optional “balancing active” entity (state `on`). |
| `cell_diff` | `8` | number | 0 – 1000 | Minimum Δ (mV) for the balancing (sync) icon. |
| `cell_bal_over` | `3000` | number | 0 – 6000 | Cell monitoring only: The balancing icon only appears when the highest cell is at least this voltage (mV). |
| `auto_detect_low_high` | `true` | boolean | – | Automatically detect lowest / highest cell (cell monitoring only). |
| `pack_cell_low` | `null` | string / null | Sensor | Sensor with the number of the lowest cell (auto off). |
| `pack_cell_high` | `null` | string / null | Sensor | Sensor with the number of the highest cell (auto off). |
| `show_soc_value` | `true` | boolean | – | SOC value in the legend. |
| `show_soc_icon` | `true` | boolean | – | Battery icon in the legend (changes with power). |
| `show_cell_diff` | `true` | boolean | – | Cell difference (Δ mV) in the legend. In battery monitoring the Δ is shown on its own line above the mV value. |
| `show_sync_icon` | `true` | boolean | – | Sync icon during balancing (rotates as long as balancing is active). |
| `show_balance_flow` | `false` | boolean | – | Animated balancing energy flow between highest and lowest cell (cell monitoring only). |
| `show_flow` | `false` | boolean | – | Enable charge/discharge animations (requires `watt_entity`). Works in both modes. |
| `flow_tip` | `tip1` | string | `off`, `tip1`, `tip2`, `tip3` | Glowing cell top: off, Glow, Glow (subtle), Glow (Explosion). |
| `flow_bar` | `off` | string | `off`, `bar1`, `bar2` | Running bar: off, short tail, long tail. |
| `flow_glow` | `off` | string | `off`, `pulse`, `wave` | Cell wall animation: off, Pulse (edge to center), Cell wall energy. |
| `flow_sync` | `false` | boolean | – | `true` = all cells simultaneously; `false` = sequential one after another (cell monitoring only). |
| `flow_speed_mode` | `manual` | string | `manual`, `auto` | Speed constant or power-dependent. |
| `flow_speed` | `1` | number | 0.1 – 2 | Speed factor for constant speed. |
| `flow_speed_auto` | `1` | number | 0.2 – 2 | Speed factor for power-dependent speed. |
| `flow_max_charge_w` | `3000` | number | 100 – 100000 | Max. charge power (W) for power-dependent speed. |
| `flow_max_discharge_w` | `3000` | number | 100 – 100000 | Max. discharge power (W) for power-dependent speed. |
| `color_tip1_up` / `color_tip1_down` … | `null` | string / array | RGB or Hex | Animation colors for charging (`_up`) and discharging (`_down`). Keys: `color_tip1_*`, `color_tip2_*`, `color_tip3_*`, `color_bar1_*`, `color_bar2_*`, `color_pulse_*`, `color_wave_*`, `color_bf`. `null` = default color. |
| `cell_unit` | `mV` | string | `mV`, `V` | Unit of the cell values (cell monitoring only). |
| `font_size` | `8` | number | 4 – 16 | Base font size. |
| `overlay_opacity` | `0.7` | number | 0 – 1 | Darkening of the empty part of each cell or of the battery. |
| `cell_gap` | `4` | number | 0 – 16 | Gap between cells (px, cell monitoring only). |
| `container_padding` | `10` | number | 0 – 40 | Padding around the cells (px). |
| `top_padding` | `20` | number | 0 – 60 | Spacing below the title (px). |
| `use_3d` | `false` | boolean | – | 3D metal frame. |
| `show_slices` | `false` | boolean | – | Disc look of the scale. |
| `slice_strength` | `subtle` | string | `subtle`, `medium`, `strong` | Strength of the disc look. |
| `chunk_cells` | `false` | boolean | – | Wrap cells into multiple rows on narrow displays (cell monitoring only). |
| `chunk_mode` | `auto8` | string | `auto4`, `auto8`, `manual` | Wrapping mode. |
| `chunk_size` | `8` | number | 2 – 32 | Cells per row, only in `manual` mode (upper limit). |
| `cell_height` | `340` | number | 280 – 800 | Cell height (px); in battery monitoring the height of the battery. Synchronized with layout rows in the Sections view (without wrapping). Default for new cards: 351. |
| `min_cell_width` | `50` | number | 40 – 120 | Minimum cell width (px); smaller widths trigger wrapping earlier (cell monitoring only). |
| `show_extra_sensors` | `false` | boolean | – | Show additional sensors above the cells. |
| `extra_sensors` | `[]` | array | – | List of `{name, entity, icon}`. Without `icon` the entity icon is used. |
| `extra_font_scale` | `1` | number | 0.7 – 1.5 | Font size factor for additional sensors. |
| `cells` | `[]` | array | – | List of cells `{name, entity}` in display order (V or mV is detected). Not needed in battery monitoring. |
| `grid_options` | `columns: 12` | object | `columns`, `rows` | Home Assistant layout. Without wrapping: `rows` is derived from `cell_height` (minimum 6). With wrapping: `rows: auto`. |

**Keys of `legend_stops`** (only with `battery_type: custom`, first step = top edge of the legend):

| Key | Description |
| --------- | ------------ |
| `color` | Any CSS color, e.g. `'#00ee00'`. |
| `mv` | Voltage (mV) at the **upper edge** of the segment. Must decrease from top to bottom. |
| `pct` | Segment height in %. All steps always add up to 100 %. |
| `top` / `bottom` | Optional labels at the top / bottom of the segment. |

**Battery types**

| `battery_type` | Voltage range (per cell) |
| -------------- | ---------------------------- |
| `lifepo4` | 2.60 V – 3.65 V |
| `nmc` | 3.00 V – 4.20 V |
| `lead` | 1.80 V – 2.45 V (2 V cell) |
| `custom` | `custom_min_mv` – `custom_max_mv` or own `legend_stops` |

**Battery monitoring (`display_mode: battery`)**

The card shows only the legend as a single battery. The fill level comes from `soc_entity`; the percentage numbers are placed where the voltage values are in cell monitoring.

| `soc_preset` | Name | Layout |
| ------------ | ---- | ------ |
| `traffic` | Standard colors | 0–5 % red · 5–10 % orange · 10–20 % yellow · 20–80 % green · 80–90 % yellow · 90–95 % orange · 95–100 % red |
| `green` | Green | Glowing laser green with color gradient and shimmer |
| `blue` | Blue | Glowing laser blue with color gradient and shimmer |
| `purple` | Purple / Pink | Same layout as Standard colors, colors from dark purple to pink |
| `sunset` | Sunset | Same layout as Standard colors, colors from red via orange and yellow to green |
| `neon` | Neon | Same layout as Standard colors, colors from pink via violet to cyan |
| `ocean` | Ocean | Same layout as Standard colors, colors from rose-red via blue and light blue to turquoise-green |

* **Still in effect:** `soc_entity`, `watt_entity`, `cell_diff_sensor`, `balance_sensor`, `cell_diff`, `show_soc_value`, `show_soc_icon`, `show_cell_diff`, `show_sync_icon`, `show_flow`, `flow_*`, `color_*` (except `color_bf`), `font_size`, `overlay_opacity`, `container_padding`, `top_padding`, `use_3d`, `show_slices`, `slice_strength`, `cell_height`, `theme`, `show_extra_sensors`, `extra_sensors`, `extra_font_scale`, `title`, `grid_options`.
* **Ignored** (may remain in the configuration): `cells`, `battery_type`, `custom_min_mv`, `custom_max_mv`, `legend_stops`, `show_legend`, `chunk_cells`, `chunk_mode`, `chunk_size`, `cell_gap`, `cell_unit`, `min_cell_width`, `cell_bal_over`, `auto_detect_low_high`, `pack_cell_low`, `pack_cell_high`, `show_balance_flow`, `flow_sync`, `color_bf`.
* **Responsive:** Icons and font grow with the width and height of the battery. With the 3D frame the side borders, the top edge and the positive pole grow along.

**Balancing icon:** is shown when `balance_sensor` is `on`, or when Δ ≥ `cell_diff` and the highest cell ≥ `cell_bal_over`. In battery monitoring there are no cell voltages: balancing is considered active when `balance_sensor` is `on` – or, if no `balance_sensor` is set, as soon as Δ ≥ `cell_diff`. As long as balancing is active the icon rotates.

**Balancing energy flow:** only appears while balancing is currently detected (via `balance_sensor` or the values under Balancing Detection). Only available in cell monitoring.

> Cards created via the card picker are pre-filled with the example sensors `sensor.status_of_charge`, `sensor.pack_watt` and `sensor.delta_mvolts_between_cells`.  
> `card_height` and `background` are no longer supported (since 0.7.0).

---

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
show_flow: true
flow_tip: tip1
flow_bar: bar1
flow_glow: wave
flow_sync: false
flow_speed_mode: auto
flow_max_charge_w: 3000
flow_max_discharge_w: 3000
show_balance_flow: true
cell_height: 351
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
  rows: 7
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

### Battery monitoring (without cell voltages)

```yaml
type: custom:battery-cells-card
title: Home battery
display_mode: battery
soc_entity: sensor.status_of_charge
watt_entity: sensor.pack_watt
cell_diff_sensor: sensor.delta_mvolts_between_cells
balance_sensor: binary_sensor.balancing_active
soc_preset: traffic
soc_step: '10'
battery_width: 140
cell_height: 351
use_3d: true
show_slices: true
show_flow: true
flow_tip: tip1
flow_bar: bar1
flow_glow: pulse
grid_options:
  columns: 12
  rows: 7
```

### Battery monitoring in laser green (wide, 20 % steps)

```yaml
type: custom:battery-cells-card
title: Battery
display_mode: battery
soc_entity: sensor.status_of_charge
watt_entity: sensor.pack_watt
soc_preset: green
soc_step: '20'
battery_width: 220
use_3d: true
show_flow: true
flow_tip: tip2
flow_glow: wave
```

* * *

## Editor Documentation

The editor consists of collapsible panels, numbered in the order they appear. Every change is applied immediately in the preview. Only one panel is open at a time (accordion).

Items with a badge (![visible when 2.2 = Custom](https://img.shields.io/badge/visible%20when-2.2%20%3D%20Custom-orange?style=flat) ![visible when 7.1 on](https://img.shields.io/badge/visible%20when-7.1%20on-blue?style=flat)) are only shown in the editor when the stated setting is selected. Orange = battery type *Custom*, Blue = another switch or mode.

**Two card modes:** The card mode is selected in panel 2. The editor adapts to it:

| Area | Cell monitoring (detailed) | Battery monitoring (without cell voltages) |
| ---- | -------------------------- | ------------------------------------------ |
| Panel 2 | Battery type, custom scale if applicable | SOC color scale, color gradient, percent steps |
| Panel 3 Cells | active | greyed out |
| Panel 5 Balancing | all settings | difference threshold only |
| Panel 6 Display | cell unit, cell gap, cell height, min. cell width | cell unit and cell gap are omitted, "Cell height" is called battery height, "Min. cell width" becomes battery width; "Show legend" switch greyed out |
| Panel 7 Animation | all animations | without balancing energy flow and "All cells simultaneously" |
| Panel 8 Cell Wrapping | active | greyed out |

### Contents

1. [Name](#1-name)

2. [Display Mode / Battery Chemistry](#2-display-mode--battery-chemistry)
   - [2.1 Card mode](#21-card-mode)
   - [2.2 Battery type](#22-battery-type) ![visible when 2.1 = Cell monitoring](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Cell%20monitoring-blue?style=flat)
   - [2.3 Custom scale](#23-custom-scale) ![visible when 2.2 = Custom](https://img.shields.io/badge/visible%20when-2.2%20%3D%20Custom-orange?style=flat)
   - [2.4 Custom min voltage](#24-custom-min-voltage) ![visible when 2.2 = Custom](https://img.shields.io/badge/visible%20when-2.2%20%3D%20Custom-orange?style=flat)
   - [2.5 SOC color scale](#25-soc-color-scale) ![visible when 2.1 = Battery monitoring](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Battery%20monitoring-blue?style=flat)
   - [2.6 Color gradient (battery monitoring)](#26-color-gradient-battery-monitoring) ![visible when 2.1 = Battery monitoring](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Battery%20monitoring-blue?style=flat)
   - [2.7 Percent steps](#27-percent-steps) ![visible when 2.1 = Battery monitoring](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Battery%20monitoring-blue?style=flat)

3. [Cells](#3-cells)
   - [3.1 Add cell](#31-add-cell)
   - [3.2 Change entity and name](#32-change-entity-and-name)
   - [3.3 Reorder and delete](#33-reorder-and-delete)

4. [Legend Sensors](#4-legend-sensors)
   - [4.1 State of charge (SOC)](#41-state-of-charge-soc)
   - [4.2 Power (W)](#42-power-w)
   - [4.3 Cell voltage difference](#43-cell-voltage-difference)
   - [4.4 Balancing active](#44-balancing-active)

5. [Balancing and Min. Cell / Max. Cell](#5-balancing-and-min-cell--max-cell)
   - [5.1 Balancing detection](#51-balancing-detection)
   - [5.2 Difference threshold](#52-difference-threshold)
   - [5.3 Balancing from cell voltage](#53-balancing-from-cell-voltage) ![visible when 2.1 = Cell monitoring](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Cell%20monitoring-blue?style=flat)
   - [5.4 Lowest / highest cell](#54-lowest--highest-cell) ![visible when 2.1 = Cell monitoring](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Cell%20monitoring-blue?style=flat)
   - [5.5 Automatically detect](#55-automatically-detect)
   - [5.6 Sensor for lowest cell](#56-sensor-for-lowest-cell) ![visible when 5.5 off](https://img.shields.io/badge/visible%20when-5.5%20off-blue?style=flat)
   - [5.7 Sensor for highest cell](#57-sensor-for-highest-cell) ![visible when 5.5 off](https://img.shields.io/badge/visible%20when-5.5%20off-blue?style=flat)

6. [Display](#6-display)
   - [6.1 Font size and cell unit](#61-font-size-and-cell-unit)
   - [6.2 Cell gap, title spacing, card padding](#62-cell-gap-title-spacing-card-padding)
   - [6.3 Cell height / Battery height](#63-cell-height--battery-height)
   - [6.4 Min. cell width / Battery width](#64-min-cell-width--battery-width)
   - [6.5 Overlay opacity](#65-overlay-opacity)
   - [6.6 Legend and legend elements](#66-legend-and-legend-elements)
   - [6.7 Show additional sensors](#67-show-additional-sensors)
   - [6.8 3D frame](#68-3d-frame)
   - [6.9 Disc shadows and strength](#69-disc-shadows-and-strength)
   - [6.10 Theme](#610-theme)

7. [Animation](#7-animation)
   - [7.1 Balancing energy flow](#71-balancing-energy-flow) ![visible when 2.1 = Cell monitoring](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Cell%20monitoring-blue?style=flat)
   - [7.2 Charge/Discharge animation](#72-chargedischarge-animation) ![visible when power sensor](https://img.shields.io/badge/visible%20when-power%20sensor-blue?style=flat)
   - [7.3 Glow / Running bar / Cell wall](#73-glow--running-bar--cell-wall) ![visible when 7.2 on](https://img.shields.io/badge/visible%20when-7.2%20on-blue?style=flat)
   - [7.4 All cells simultaneously](#74-all-cells-simultaneously) ![visible when 7.2 on](https://img.shields.io/badge/visible%20when-7.2%20on-blue?style=flat)
   - [7.5 Speed](#75-speed) ![visible when 7.2 on and animation active](https://img.shields.io/badge/visible%20when-7.2%20on%20%2B%20animation-blue?style=flat)
   - [7.6 Animation colors](#76-animation-colors)

8. [Cell Wrapping](#8-cell-wrapping)
   - [8.1 Enable cell wrapping](#81-enable-cell-wrapping)
   - [8.2 Wrapping mode](#82-wrapping-mode) ![visible when 8.1 on](https://img.shields.io/badge/visible%20when-8.1%20on-blue?style=flat)
   - [8.3 Cells per row](#83-cells-per-row) ![visible when 8.1 on + 8.2 = Manual](https://img.shields.io/badge/visible%20when-8.1%20on%20%2B%208.2%20%3D%20Manual-blue?style=flat)

9. [Additional Sensors](#9-additional-sensors)
   - [9.1 Add sensor](#91-add-sensor)
   - [9.2 Name and icon](#92-name-and-icon)
   - [9.3 Reorder and delete](#93-reorder-and-delete)
   - [9.4 Font size](#94-font-size)

---

### 1. Name

#### 1.1 Name
> **Setting:** Free text for the card title (`title`). Default: `Battery Cells`.
>
> **Purpose:** The title is displayed at the top of the card. It helps distinguish multiple batteries on a dashboard.

---

### 2. Display Mode / Battery Chemistry

#### 2.1 Card mode
> **Setting:** Above the dropdown it says "Select card mode:". The dropdown "Battery sensor values" (`display_mode`) offers two entries:
> - *Cell monitoring (detailed)* (`cells`, default)
> - *Battery monitoring (without cell voltages)* (`battery`)
>
> **Purpose:** In **cell monitoring** the card shows all cell voltages with a legend. In **battery monitoring** only the legend is shown as a single battery whose fill level is determined by the SOC sensor ([4.1](#41-state-of-charge-soc)) – ideal for home batteries without cell voltage sensors. The percentage numbers are placed where the voltage values are otherwise shown.
>
> When switching to battery monitoring, the panels *Cells* and *Cell Wrapping* as well as the switch *Show legend* are greyed out, and the battery type disappears. All cell settings remain saved and are back when you switch back.

#### <a id="22-battery-type"></a>2.2 Battery type ![visible when 2.1 = Cell monitoring](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Cell%20monitoring-blue?style=flat)
> **Setting:** *LiFePO4*, *NMC / NCM (Li-Ni-Mn-Co)*, *Lead (2V cell)* or *Custom* (`battery_type`). Only visible in cell monitoring.
>
> **Purpose:** Defines the voltage range that is mapped to the bar height as well as the colors and labels of the legend (LiFePO4 2.60 – 3.65 V, NMC 3.00 – 4.20 V, Lead 1.80 – 2.45 V per cell). When changing the type, a suitable value for [5.3](#53-balancing-from-cell-voltage) is also suggested. *Custom* unlocks the custom scale and the min voltage.

#### <a id="23-custom-scale"></a>2.3 Custom scale ![visible when 2.2 = Custom](https://img.shields.io/badge/visible%20when-2.2%20%3D%20Custom-orange?style=flat)
> Only shown in the editor when the battery type (2.2) is *Custom*.

##### Color Scale Preset
> **Setting:** Dropdown with *No Preset* and 7 ready-made scales: LiFePO4 Standard, Purple / Pink, Sunset, Neon, Ocean, NMC / NCM, Lead (2V cell).
>
> **Purpose:** Quick start for your own scale. A preset replaces all steps and sets the min voltage. You can adjust the steps afterwards; the dropdown jumps to *No Preset* as soon as they differ.

##### Color Gradient
> **Setting:** Switch on / off (`scale_gradient`). Default: off.
>
> **Purpose:** Off = hard color segments as in the legend. On = soft transitions between the colors, in the cells and in the legend. The legend labels stay in their position.

##### Scale Step
> **Setting:** One row per color segment, from top to bottom in the legend. Each row has the color field, the **upper limit in mV** (`mv`) and the **share in %** (`pct`) of the segment.
>
> **Purpose:** Defines where the colors change. The voltage is the value at the upper edge of the segment, the share is its height in the legend. Tap the color field or the pencil to open color and labels.

##### Step Color
> **Setting:** Hex color (e.g. `#00ee00`) or the sliders *Hue*, *Saturation* and *Brightness* (`color`).
>
> **Purpose:** Color of the segment in cells and legend. Hex field and sliders stay in sync.

##### Labels
> **Setting:** Optional texts *Label top* and *Label bottom* (`top`, `bottom`), e.g. `3.65V`.
>
> **Purpose:** Labels at the upper and lower edge of the segment in the legend.

##### Reorder and Delete
> **Setting:** Drag handle to move a step, cross to delete.
>
> **Purpose:** Brings the steps into the correct order or removes unneeded ones. After moving, the voltage of the step is set between the new neighbors.

##### Add Scale Step
> **Setting:** Button *Add scale step*. Maximum 20 steps, at least 2 are required for a custom scale.
>
> **Purpose:** Adds a segment with 100 mV lower voltage below the last step.

##### Automatic Corrections
> **Purpose:** The editor prevents invalid scales: voltages always decrease from top to bottom, the shares always add up to 100 % and the lowest step ends at the custom min voltage.

#### <a id="24-custom-min-voltage"></a>2.4 Custom Min Voltage ![visible when 2.2 = Custom](https://img.shields.io/badge/visible%20when-2.2%20%3D%20Custom-orange?style=flat)
> **Setting:** Number in mV, 1000 – 5000, default 2600 (`custom_min_mv`). Only for *Custom*.
>
> **Purpose:** Voltage at which a cell bar is considered empty. With custom scale steps it is the lower edge of the bottom step and is automatically lowered if it would otherwise collide with this step.
>
> **Note:** `custom_max_mv` is no longer present in the editor, but remains configurable via YAML and is used when fewer than 2 scale steps exist.

#### <a id="25-soc-color-scale"></a>2.5 SOC color scale ![visible when 2.1 = Battery monitoring](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Battery%20monitoring-blue?style=flat)
> **Setting:** Dropdown "Color scale (SOC)" (`soc_preset`) with 7 entries: *Standard colors*, *Green*, *Blue*, *Purple / Pink*, *Sunset*, *Neon*, *Ocean*. Only visible in battery monitoring.
>
> **Purpose:** Colors of the battery. Standard colors, Purple / Pink, Sunset, Neon and Ocean are built like the voltage scale: up to 5 % red, up to 10 % orange, up to 20 % yellow, 20–80 % main color, then yellow, orange, red again (or the matching colors of the preset). *Green* and *Blue* have a glowing laser look with color gradient and a slight shimmer.

#### <a id="26-color-gradient-battery-monitoring"></a>2.6 Color gradient (battery monitoring) ![visible when 2.1 = Battery monitoring](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Battery%20monitoring-blue?style=flat)
> **Setting:** Switch on / off (`scale_gradient`). Default: off.
>
> **Purpose:** Off = hard color segments. On = soft transitions between the colors of the SOC scale. For *Green* and *Blue* the switch is not shown because these presets always use a gradient.

#### <a id="27-percent-steps"></a>2.7 Percent steps ![visible when 2.1 = Battery monitoring](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Battery%20monitoring-blue?style=flat)
> **Setting:** Dropdown with *5 %*, *10 %*, *20 %*, *25 %* (`soc_step`). Default: 10 %.
>
> **Purpose:** Spacing of the percentage labels next to the battery. The values 0 % and 100 % are only shown with 20 % and 25 %.

---

### 3. Cells

> In battery monitoring (2.1) this panel is greyed out because there are no individual cells. The entered cells remain saved.

#### 3.1 Add cell
> **Setting:** Select a sensor in the field *Add cell*.
>
> **Purpose:** Adds a bar to the card. The name is taken from the friendly name of the entity. Values in V or mV are automatically detected. Tapping a cell on the dashboard opens the sensor details.

#### 3.2 Change entity and name
> **Setting:** Change the sensor directly in the row; use the pencil to edit the displayed name.
>
> **Purpose:** Replaces a sensor or shortens the name shown at the top of the bar (e.g. `C1`).

#### 3.3 Reorder and delete
> **Setting:** Drag handle to move a cell, cross to delete.
>
> **Purpose:** The order in the list is the order of the bars from left to right.

---

### 4. Legend Sensors

#### 4.1 State of charge (SOC)
> **Setting:** Sensor entity (`soc_entity`).
>
> **Purpose:** Shows the state of charge in percent in the legend. Tapping it opens the sensor details. In battery monitoring the sensor is required: it determines the fill level of the battery.

#### 4.2 Power (W)
> **Setting:** Sensor entity (`watt_entity`).
>
> **Purpose:** Controls the battery icon in the legend: green plus when charging, red minus when discharging, blue neutral icon at 0 W. Required for the charge/discharge animations in the Animation panel.

#### 4.3 Cell voltage difference
> **Setting:** Sensor entity in V or mV (`cell_diff_sensor`).
>
> **Purpose:** Shows the difference between the highest and lowest cell as `Δ x mV` in the legend. It also decides when the sync icon appears (see [5.2](#52-difference-threshold)). In battery monitoring the Δ is shown on its own line, centered above the mV value.

#### 4.4 Balancing active
> **Setting:** Optional entity of any type (`balance_sensor`).
>
> **Purpose:** If its state is `on`, the sync icon is displayed. Use it if your BMS reports balancing directly. Without it the icon is derived from difference and cell voltage ([5.2](#52-difference-threshold), [5.3](#53-balancing-from-cell-voltage)). In battery monitoring, without this sensor only the difference ([5.2](#52-difference-threshold)) is evaluated.

---

### 5. Balancing and Min. Cell / Max. Cell

> In battery monitoring (2.1) the panel is called just **Balancing** and only shows the difference threshold (5.2). Settings 5.3 to 5.7 are omitted.

#### 5.1 Balancing detection
> Short heading and hint text: Balancing is active when the cell difference reaches the threshold and a cell is above the balancing voltage. In battery monitoring the hint reads: Without a balancing sensor, balancing is assumed as soon as the cell difference reaches the threshold.

#### 5.2 Difference threshold
> **Setting:** Number in mV, default 8 (`cell_diff`).
>
> **Purpose:** The sync icon only appears when the difference between highest and lowest cell reaches at least this value. In battery monitoring this value alone decides as long as no “Balancing active” sensor (4.4) is set.

#### <a id="53-balancing-from-cell-voltage"></a>5.3 Balancing from cell voltage ![visible when 2.1 = Cell monitoring](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Cell%20monitoring-blue?style=flat)
> **Setting:** Number in mV, default 3000 (`cell_bal_over`). When changing the battery type, 3000 (LiFePO4 / Custom), 3500 (NMC) or 2000 (Lead) are suggested. Only visible in cell monitoring.
>
> **Purpose:** Most BMS only balance near the full state. The sync icon therefore additionally requires that the highest cell reaches this voltage.

#### <a id="54-lowest--highest-cell"></a>5.4 Lowest / highest cell ![visible when 2.1 = Cell monitoring](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Cell%20monitoring-blue?style=flat)
> Short heading and hint text: These cells are outlined and connected by the energy flow. Automatically or via two sensors that provide the cell number. This section (5.4 to 5.7) is hidden in battery monitoring.

#### 5.5 Automatically detect
> **Setting:** Switch on / off (`auto_detect_low_high`). Default: on.
>
> **Purpose:** On = the card finds the lowest cell (red ring) and the highest cell (blue ring) itself based on the cell values. Off = you provide your own sensors (5.6, 5.7), e.g. the numbers reported by the BMS.

#### <a id="56-sensor-for-lowest-cell"></a>5.6 Sensor for lowest cell ![visible when 5.5 off](https://img.shields.io/badge/visible%20when-5.5%20off-blue?style=flat)
> **Setting:** Sensor entity (`pack_cell_low`). Only visible when automatic detection is off.
>
> **Purpose:** The sensor value is the number of the lowest cell (1 = first cell in your list) and receives the red ring.

#### <a id="57-sensor-for-highest-cell"></a>5.7 Sensor for highest cell ![visible when 5.5 off](https://img.shields.io/badge/visible%20when-5.5%20off-blue?style=flat)
> **Setting:** Sensor entity (`pack_cell_high`). Only visible when automatic detection is off.
>
> **Purpose:** The sensor value is the number of the highest cell and receives the blue ring.

---

### 6. Display

> In battery monitoring (2.1) the first section of this panel is called **Battery appearance**. Icons and font of the battery grow automatically with its width and height.

#### 6.1 Font size and cell unit
> **Setting:** Font size 4 – 16, default 8 (`font_size`); unit *mV* or *V* (`cell_unit`).
>
> **Purpose:** Base size for names, values and legend texts. Unit of the value at the bottom of each cell: whole millivolts or volts with three decimal places. In battery monitoring the unit is omitted, only the font size remains.

#### 6.2 Cell gap, title spacing, card padding
> **Setting:** Cell gap 0 – 16 px (`cell_gap`), spacing to title 0 – 60 px (`top_padding`), card padding 0 – 40 px (`container_padding`).
>
> **Purpose:** Distances between cells, below the title and to the card edge. In battery monitoring the cell gap is omitted.

#### <a id="63-cell-height--battery-height"></a>6.3 Cell height / Battery height
> **Setting:** Number 280 – 800 px, default 340 (`cell_height`). For new cards 351 px.
>
> **Purpose:** Height of the cell row. Without wrapping the number of layout rows in the Home Assistant Sections view is derived from it (minimum 6). With wrapping it is the fixed row height. In battery monitoring the setting is called **Battery height** and defines the height of the battery.

#### <a id="64-min-cell-width--battery-width"></a>6.4 Min. cell width / Battery width
> **Setting:**
> - Cell monitoring: *Min. cell width*, number 40 – 120 px, default 50 (`min_cell_width`).
> - Battery monitoring: *Battery width*, number 110 – 400 px, default 120 (`battery_width`).
>
> **Purpose:** Both settings share the same spot in the editor. *Min. cell width* is the smallest allowed width of a cell: a higher value makes the card wrap earlier and keeps the cells wider. *Battery width* defines the width of the battery; on a narrower card it is limited to the card width. Icons, font and the 3D frame grow with the width.

#### 6.5 Overlay opacity
> **Setting:** Number 0 – 100 %, default 70 % (`overlay_opacity`).
>
> **Purpose:** Darkens the empty part of each bar above the voltage level, in battery monitoring the empty part of the battery above the SOC.

#### 6.6 Legend and legend elements
> **Setting:** Switch show legend (`show_legend`); when legend is on: SOC value, SOC icon, cell difference, sync icon.
>
> **Purpose:** The legend is the first column with color scale and status elements. The four elements can be switched on and off individually. As long as balancing is active the sync icon rotates (one rotation takes 6 seconds). In battery monitoring the switch *Show legend* is greyed out because the battery is always visible; the four elements remain individually switchable.

#### 6.7 Show additional sensors
> **Setting:** Switch on / off (`show_extra_sensors`). Default: off.
>
> **Purpose:** Shows the sensors from panel [9](#9-additional-sensors) in a row above the cells. Adding a sensor in panel 9 automatically turns the switch on.

#### 6.8 3D frame
> **Setting:** Switch on / off (`use_3d`). Default: off.
>
> **Purpose:** Metal housing with pole on top around each cell. Off = flat frame with thin border. In battery monitoring the 3D frame applies to the battery: side borders, top edge and pole grow proportionally with width and height. In flat mode there is no pole.

#### 6.9 Disc shadows and strength
> **Setting:** Switch on / off (`show_slices`); when on: *Subtle*, *Medium* or *Strong* (`slice_strength`).
>
> **Purpose:** Divides the colored bars into fine discs with shadows. Intensity of the shadow between the discs.

#### 6.10 Theme
> **Setting:** Dropdown with *Default* and all themes installed in Home Assistant (`theme`).
>
> **Purpose:** Gives this card its own color scheme, independent of the dashboard. *Default* takes over the theme of the dashboard.

---

### 7. Animation

#### <a id="71-balancing-energy-flow"></a>7.1 Balancing energy flow ![visible when 2.1 = Cell monitoring](https://img.shields.io/badge/visible%20when-2.1%20%3D%20Cell%20monitoring-blue?style=flat)
> **Setting:** Switch on / off (`show_balance_flow`). Default: off. Only available in cell monitoring.
>
> **Purpose:** Animated energy line between the highest and the lowest cell, also across wrapped rows. Only appears while balancing is currently detected (via the “Balancing active” sensor or the values under Balancing Detection).

#### <a id="72-chargedischarge-animation"></a>7.2 Charge/Discharge animation ![visible when power sensor](https://img.shields.io/badge/visible%20when-power%20sensor-blue?style=flat)
> **Setting:** Switch on / off (`show_flow`). Only visible if a power sensor (4.2) is set.
>
> **Purpose:** Enables the charge/discharge animations. The three animation types (glow, running bar, cell wall) are time-synchronized and complement each other. They run in both modes, in battery monitoring on the battery; the glowing tip and the running bar move along with the SOC fill level.

#### <a id="73-glow--running-bar--cell-wall"></a>7.3 Glow / Running bar / Cell wall ![visible when 7.2 on](https://img.shields.io/badge/visible%20when-7.2%20on-blue?style=flat)
> **Setting:**
> - Glow (`flow_tip`): *Off*, *Glow*, *Glow (subtle)*, *Glow (Explosion)*
> - Running bar (`flow_bar`): *Off*, *Running bar 1 (short tail)*, *Running bar 2 (long tail)*
> - Cell wall animation (`flow_glow`): *Off*, *Pulse (edge to center)*, *Cell wall energy*
>
> **Purpose:** Select one or more animation effects. They run synchronized and together create a harmonious overall effect.

#### <a id="74-all-cells-simultaneously"></a>7.4 All cells simultaneously ![visible when 7.2 on](https://img.shields.io/badge/visible%20when-7.2%20on-blue?style=flat)
> **Setting:** Switch on / off (`flow_sync`). Hidden in battery monitoring.
>
> **Purpose:** On = all cells animate simultaneously. Off = the animation runs sequentially through the cells.

#### <a id="75-speed"></a>7.5 Speed ![visible when 7.2 on and animation active](https://img.shields.io/badge/visible%20when-7.2%20on%20%2B%20animation-blue?style=flat)
> **Setting:** *Constant* or *Power-dependent* (`flow_speed_mode`).
> - Constant: Speed factor 0.1× – 2× (`flow_speed`)
> - Power-dependent: Max. charge power and Max. discharge power (W), plus speed factor 0.2× – 2× (`flow_speed_auto`)
>
> **Purpose:** Controls how fast the animation runs. With power-dependent the speed is adjusted to the current power relative to the maximum values.

#### 7.6 Animation colors
> **Setting:** Switch *Change animation colors*; when on: color fields for the active effects (charging / discharging) and if applicable the energy flow color.
>
> **Purpose:** Separate colors for charging and discharging per animation type as well as for the balancing energy flow. Default colors are used as long as nothing is overridden.

---

### 8. Cell Wrapping

> In battery monitoring (2.1) this panel is greyed out because there are no cells to wrap.

#### 8.1 Enable cell wrapping
> **Setting:** Switch on / off (`chunk_cells`). Default: off.
>
> **Purpose:** Wraps the cells into multiple rows when the card is too narrow so that they are never squeezed (ideal for phones and large packs). With wrapping active the card height is calculated from the cell height and the layout rows are set to *Auto*. When switched off the layout rows are derived from the cell height again.

#### <a id="82-wrapping-mode"></a>8.2 Wrapping mode ![visible when 8.1 on](https://img.shields.io/badge/visible%20when-8.1%20on-blue?style=flat)
> **Setting:** *Auto 4 cells*, *Auto 8 cells* or *Manual* (`chunk_mode`). Default: Auto 8.
>
> **Purpose:** *Auto 4* wraps in rows of 4, 8, 16 …, *Auto 8* in rows of 8, 16 …, depending on the card width. *Manual* uses the value from 8.3 as upper limit.

#### <a id="83-cells-per-row"></a>8.3 Cells per row ![visible when 8.1 on + 8.2 = Manual](https://img.shields.io/badge/visible%20when-8.1%20on%20%2B%208.2%20%3D%20Manual-blue?style=flat)
> **Setting:** Number 2 – 32, default 8 (`chunk_size`). Only visible in *Manual* mode.
>
> **Purpose:** Maximum number of cells per row. If the card is too narrow for that, fewer cells per row are used.

---

### 9. Additional Sensors

#### 9.1 Add sensor
> **Setting:** Select a sensor in the field *Add sensor*.
>
> **Purpose:** Adds a value row above the cells, e.g. temperature, current or cycle count. The unit is taken from the entity. Tapping a value opens the sensor details. Adding a sensor automatically turns on “Show additional sensors”.

#### 9.2 Name and icon
> **Setting:** Open with the pencil: Free text *Name* and icon picker (`name`, `icon`).
>
> **Purpose:** The name is shown in front of the value. Without an icon the standard icon of the entity is used.

#### 9.3 Reorder and delete
> **Setting:** Drag handle to move a sensor, cross to delete.
>
> **Purpose:** The order in the list is the order from left to right.

#### 9.4 Font size
> **Setting:** Slider 0.7 – 1.5, default 1 (`extra_font_scale`). At the end of the panel.
>
> **Purpose:** Size factor for texts and icons of the additional sensors, independent of the cell font size.

---

## Screenshots

<img width="60%" height="auto" alt="Skala" src="https://github.com/user-attachments/assets/2543b511-668d-4fda-9fff-d4b35d1e1805" />
<img width="60%" height="auto" alt="Screenshot1" src="https://github.com/user-attachments/assets/5f8281fe-c0eb-457e-928a-3d51ead546c3" />
<img width="60%" height="auto" alt="Screenshot2" src="https://github.com/user-attachments/assets/6fc3ca88-7ca2-476b-aae2-5a5b7ef6833a" />
<img width="60%" height="auto" alt="Screenshot3" src="https://github.com/user-attachments/assets/a020dbda-9a2a-456c-b50e-341ecf2aee2f" />

---

## License

This project is licensed under the **Apache License 2.0**.

See the [LICENSE](LICENSE) file for the full license text.
