[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
![GitHub total downloads](https://img.shields.io/github/downloads/jinx-22/battery-cell-card/total?style=flat-square&color=red)
[![GitHub release](https://img.shields.io/github/release/jinx-22/battery-cell-card?include_prereleases=&sort=semver&color=blue)](https://github.com/jinx-22/battery-cell-card/releases/)
![File size](https://img.shields.io/github/size/jinx-22/battery-cell-card/battery-cells-card.js?label=Card%20Size)
![last commit](https://img.shields.io/github/last-commit/jinx-22/battery-cell-card)
[![README Deutsch](https://img.shields.io/badge/README-DE)](https://github.com/jinx-22/battery-cell-card/tree/battery-cells-card_v.0.7.0#battery-cell-card---zellen-echtzeit%C3%BCberwachung-deutsch)
[![stars](https://img.shields.io/github/stars/jinx-22/battery-cell-card)](https://github.com/jinx-22/battery-cell-card/stargazers)

# Battery Cell Card - Real-Time Cell Monitoring

*(Link to the German version: [Deutsch](README_DE.md))*

**Version:** 0.7.0  
**Description:** A Home Assistant custom card for visualizing battery cells, cell voltages, SOC, balancing status, and voltage differences.

Ideal for LiFePO4 battery systems.

### New in Version 0.7.0

- New native Home Assistant Visual Editor
- Add, edit, delete, and reorder cells directly in the editor
- Additional sensors with custom names and icons
- Theme selection in the editor
- Responsive cell chunking
- Support for `grid_options`
- Improved responsive layout and content updates
- `card_height` and `background` are no longer used

> Note:
> The cell bar heights represent cell voltage, not state of charge.
> The percentage SOC can be displayed in the legend when an SOC sensor is configured.

<img width="1282" height="788" alt="2t" src="https://github.com/user-attachments/assets/72a04c39-3cfd-4768-89a0-d15e2399d07e" />
<img width="1039" height="512" alt="1" src="https://github.com/user-attachments/assets/c9f03baa-3997-44b7-8d95-478a2b91199b" />

---

## Table of Contents
1. [What does the card do?](#what-does-the-card-do)
2. [License](#license)
3. [Features](#features)
4. [Installation](#manual-installation)
5. [Example Configuration](#example-configuration)
6. [Configuration Options](#configuration-options-in-detail)
7. [How it works](#how-it-works)
8. [Developer Notes](#developer-notes)

---

## What does the card do?

Depending on the configuration, this custom card displays:

- Individual cell voltages (V or mV)
- Cell voltage difference (Δ mV)
- Charge / discharge power (Watt)
- Charge / discharge icons
- Balancing status
- SOC value and SOC icon
- Color legend for voltage ranges
- Responsive sizing
- Optional row wrapping on small displays (chunking)
- Additional sensors
- Home Assistant Visual Editor

Compatible with all BMS systems that provide individual cell sensors, including:

- Daly
- JK-BMS
- smartBMS - smartlabs dongle
- Any sensors that provide individual cell voltages (V or mV)

---

## License

**Creative Commons – CC BY-NC-SA 4.0**

- Modification & customization allowed
- No commercial use
- Redistribution only under the same license

[Full license](https://creativecommons.org/licenses/by-nc-sa/4.0/)

---

## Features

### Cell Visualization
- Color scale from Red → Orange → Yellow → Green

### Battery Status
- SOC text & icon
- Plus/minus symbol depending on charge/discharge power

### Balancing
- Sync icon when balancing is active
- Cell voltage difference display (Δ mV)

### Flexible Layout
- Automatic scaling
- Optional row wrapping (chunking)
- Responsive display on mobile and desktop devices
- `grid_options` for the Home Assistant Sections layout

### Display Options
- Show/hide legend
- Show/hide SOC value & icon independently
- Enable/disable 3D frame
- Adjustable font size
- Home Assistant theme selection

### Sensor Support
- SOC sensor
- Power sensor (Watt)
- Cell difference sensor
- Lowest & highest cell sensors
- Individual cells **{name, entity}**
- Additional sensors **{name, entity, icon}**

---

## Installation via HACS

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=jinx-22&repository=battery-cell-card&category=plugin)

## Manual Installation

1. Download **battery-cells-card.js**
2. Copy it to `/config/www/community/battery-cell-card/`
3. In Home Assistant:
   - Settings
   - Dashboards
   - Three dots
   - Resources
   - Add Resource
   - URL: **/local/community/battery-cell-card/battery-cells-card.js**
     Type: **JavaScript Module**
4. Reload the browser (CTRL + F5)

The card is then available and can be added through the GUI.

---

## 🧡 Support

If you like this integration and it adds real value to your Home Assistant setup,
I appreciate a small donation — every contribution helps to further develop the project 🚀

<br>
<p align="center">
⚡ <b>Lightning Address:</b>
<br> <br>
<code>usefulplay52@walletofsatoshi.com</code>
<br>
<img height="450" alt="Self_Wallet of Satoshi" src="https://github.com/user-attachments/assets/65cc18d9-05d1-4a00-8ccc-9922fdb54baf" />
<br> <br>
or:
<br>
<br>
<div align="center">
<img width="25" height="25" alt="Bitcoin_25px" src="https://github.com/user-attachments/assets/f74cad36-8c05-4a33-89cd-b998075af33b" />
 Bitcoin:
  <br> <br>
 <code>bc1qkz7mtp23cmshxnru96lzgeayu0urlysvqk5vry
 </code>
   <br>
<img height="500" alt="Donations_240px" src="https://github.com/user-attachments/assets/196f68e4-b0e8-4f27-bded-8c4fe13b9d45" />
<br>   <br>
</div>

**Thank you**, and please leave a free [![GitHub stars](https://img.shields.io/github/stars/jinx-22/battery-cell-card?style=social)](https://github.com/jinx-22/battery-cell-card/stargazers), so others can find their way here too - Thank you!

---

### Configuration Options

| Option | Default | Type | Description |
|--------|---------|------|-------------|
| `theme` | `""` | string | Home Assistant Theme. |
| `show_legend` | `true` | boolean | Shows the cell voltage color legend. |
| `soc_entity` | `sensor.soc` | string | Sensor entity for State of Charge (SOC). |
| `watt_entity` | `sensor.pack` | string | Sensor for charge/discharge power in Watt. |
| `container_padding` | `10` | number | Inner container padding. |
| `cell_gap` | `2` | number | Gap between cell bars. |
| `top_padding` | `20` | number | Top padding for title and legend. |
| `overlay_opacity` | `0.70` | number | Transparency of the cell overlay effect. |
| `font_size` | `6` | number | Global card font size. |
| `title` | `Battery Cells` | string | Card title. |
| `balance_sensor` | `null` | string / null | Sensor for active balancing. |
| `cell_diff_sensor` | `sensor.delta_mvolts` | string | Sensor for cell voltage difference (Δ). |
| `cell_diff` | `8` | number | Minimum difference (mV) for activating the balancing icon. |
| `cell_bal_over` | `3000` | number | Minimum cell voltage (mV) at which balancing may be active. |
| `cell_unit` | `mV` | string | Display unit: "V" or "mV". |
| `auto_detect_low_high` | `true` | boolean | Automatically detects the lowest and highest cell. |
| `show_soc_icon` | `true` | boolean | Shows the SOC icon in the legend. |
| `show_soc_value` | `true` | boolean | Shows the SOC percentage value. |
| `show_sync_icon` | `true` | boolean | Shows the Sync/Balancing icon. |
| `show_cell_diff` | `true` | boolean | Shows the cell voltage difference (Δ mV). |
| `pack_cell_low` | `null` | string / null | Entity of the lowest cell (optional). |
| `pack_cell_high` | `null` | string / null | Entity of the highest cell (optional). |
| `use_3d` | `true` | boolean | Enables the 3D effect of the cell bars and legend. |
| `chunk_cells` | `false` | boolean | Splits cells into multiple rows (mobile optimization). |
| `chunk_size` | `8` | number | Number of cells per row in chunk mode. |
| `show_extra_sensors` | `false` | boolean | Shows additional sensors. |
| `extra_sensors` | `[]` | array | Additional sensors with `{name, entity, icon}`. |
| `cells` | *(Array of cells)* | array | List of cells with `{name, entity}`. |
| `grid_options` | `columns: 12, rows: 8` | object | Home Assistant Sections layout. |

---

## Example Configuration

```yaml
type: custom:battery-cells-card
title: Battery Storage Cells
container_padding: 10
top_padding: 20
cell_gap: 2
use_3d: true
show_legend: true
show_soc_icon: true
show_soc_value: true
show_sync_icon: true
show_cell_diff: true
overlay_opacity: 0.7
font_size: 6
soc_entity: sensor.soc
watt_entity: sensor.pack
balance_sensor: null
cell_diff_sensor: sensor.delta_mvolts
cell_diff: 8
cell_bal_over: 3000
cell_unit: mV
auto_detect_low_high: true
pack_cell_low: null
pack_cell_high: null
chunk_cells: false
chunk_size: 8
show_extra_sensors: false
extra_sensors: []
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
  columns: 12
  rows: 8
```

<img width="890" height="918" alt="battery-cell-card-v0 5 0" src="https://github.com/user-attachments/assets/2e8b95ae-606a-4441-b825-b2e62f617771" />
