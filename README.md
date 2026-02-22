[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
![GitHub total downloads](https://img.shields.io/github/downloads/jinx-22/battery-cell-card/total?style=flat-square&color=red)
[![GitHub release](https://img.shields.io/github/release/jinx-22/battery-cell-card?include_prereleases=&sort=semver&color=blue)](https://github.com/jinx-22/battery-cell-card/releases/)
![File size](https://img.shields.io/github/size/jinx-22/battery-cell-card/battery-cells-card.js?label=Card%20Size)
![last commit](https://img.shields.io/github/last-commit/jinx-22/battery-cell-card)
[![README deutsch](https://img.shields.io/badge/README-DE)](https://github.com/jinx-22/battery-cell-card/tree/battery-cells-card_v.0.6.0#battery-cell-card---zellen-echtzeit%C3%BCberwachung-deutsch)
[![stars](https://img.shields.io/github/stars/jinx-22/battery-cell-card)](https://github.com/jinx-22/battery-cell-card/stargazers)


# Battery Cells Card - Cell-(real-time) monitoring
*(Link to German version: [Deutsch](#battery-cell-card---zellen-echtzeit%C3%BCberwachung-deutsch)*  

**Version:** 0.6.0  
**Description:** A Home Assistant custom card to visualize battery cells, cell voltages, SOC, balancing status, and differences.  
Ideal for LiFePO₄ battery systems.

> **Note:**  
> The bar heights indicate cell voltage, not state of charge.  
> The percentage SOC can be read in the legend if an SOC sensor is assigned.

---

## Table of Contents
1. [What does this card do?](#what-does-this-card-do)  
2. [License](#license)  
3. [Features](#features)  
4. [Installation](#manual-installation)  
5. [Example Configuration](#example-configuration)  
6. [All Configuration Options](#configuration-options)  
7. [Functionality](#functionality)  
8. [Developer Notes](#developer-notes)

---

## What does this card do?

Depending on configuration, this custom card shows:

- Individual cell voltages (V or mV) 
- Cell voltage difference (Δ mV)  
- Charge / discharge power (W)  
- Charge/discharge icons  
- Balancing status  
- SOC value and SOC icon  
- Color-coded voltage legend  
- Responsive scaling  
- Optional row wrapping for small displays (chunking)
- card-mod ready (V.0.5.9.8)

Compatible with all BMS that provide individual cell sensors, e.g.:

- Daly  
- JK-BMS
- smartBMS smartlabs dongle
- All sensors reporting individual cell voltages (V or mV) 

---

## License

**Creative Commons – CC BY-NC-SA 4.0**  

- Editing & modifying allowed  
- Non-commercial use only  
- Share adaptations under same license  

[Link to full license](https://creativecommons.org/licenses/by-nc-sa/4.0/)

---

## Features

### Cell Visualization
- Color scale: Red → Orange → Yellow → Green

### Battery Status
- SOC text & icon  
- Plus/minus symbol depending on charge/discharge

### Balancing
- Sync icon when balancing is active  
- Δ voltage display between cells

### Flexible Layout
- Auto-scaling  
- Optional row wrapping (chunking)  
- Responsive for mobile and desktop

### Display Options
- Legend toggle  
- SOC value & icon toggle separately  
- 3D frame toggle  
- Adjustable font size

### Sensor Support
- SOC sensor  
- Power (W) sensor  
- Cell difference sensor  
- Lowest & highest cell sensor  
- Individual cells **{name, entity}**

---
Installation over HACS

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=jinx-22&repository=battery-cell-card&category=plugin)

## Manual Installation

1. Download **battery-cells-card.js**  
2. Copy it to `/config/www/community/battery-cell-card/`  
3. In Home Assistant:  
   - Settings  
   - Dashboards  
   - Three-dot menu  
   - Resources  
   - Add Resource  
   - URL: **/local/community/battery-cell-card/battery-cells-card.js**  
     Type: **JavaScript Module**
4. Reload browser (CTRL + F5)

The card is now selectable and visible in the GUI.

---

## 🧡 Support & Donations

If you like this integration and it adds real value to your Home Assistant setup,  
I’d appreciate a small donation — every contribution helps further development 🚀

<p align="center">
⚡ <b>Lightning Address:</b>
<br><br>
<code>usefulplay52@walletofsatoshi.com</code>
<br>

<img height="450" alt="Self_Wallet of Satoshi" src="https://github.com/user-attachments/assets/65cc18d9-05d1-4a00-8ccc-9922fdb54baf" />
<br><br>
or:
<br><br>

<div align="center">
<img width="25" height="25" alt="Bitcoin_25px" src="https://github.com/user-attachments/assets/f74cad36-8c05-4a33-89cd-b998075af33b" />
 Bitcoin:
<br><br>

<code>bc1qkz7mtp23cmshxnru96lzgeayu0urlysvqk5vry</code>
<br>

<img height="500" alt="Donations_240px" src="https://github.com/user-attachments/assets/196f68e4-b0e8-4f27-bded-8c4fe13b9d45" />
<br><br>
</div>

**Thank you very much**, and please leave a free  
[![GitHub stars](https://img.shields.io/github/stars/jinx-22/battery-cell-card?style=social)](https://github.com/jinx-22/battery-cell-card/stargazers)  
so others can find this project too — thanks!

---

### Configuration Options

| Option | Default | Type | Description |
|--------|---------|------|-------------|
| `card_height` | `380` | number | Total card height in pixels. |
| `background` | `null` | string / null | individuell background (optional) |
| `show_legend` | `true` | boolean | Show color legend. |
| `soc_entity` | `'sensor.status_of_charge'` | string | SOC sensor entity. |
| `watt_entity` | `'sensor.pack_watt'` | string | Power sensor (W). |
| `container_padding` | `10` | number | Inner padding around the card. |
| `cell_gap` | `2` | number | Gap between cell bars. |
| `top_padding` | `20` | number | Top padding for title/legend. |
| `overlay_opacity` | `0.70` | number | Overlay transparency for cells. |
| `font_size` | `7.5` | number | Base font size in px. |
| `title` | `'Battery Cells'` | string | Card title. |
| `balance_sensor` | `null` | string / null | Active balancing sensor. |
| `cell_diff_sensor` | `'sensor.delta_mvolts_between_cells'` | string | Sensor for cell voltage difference (Δ). |
| `cell_diff` | `8` | number | Minimum Δ to activate balancing icon. |
| `cell_bal_over` | `3000` | number | Minimum cell voltage to allow balancing. |
| `cell_unit` | `mV` | string | Unit "V" or "mV". |
| `auto_detect_low_high` | `true` | boolean | auto low-high calculate. |
| `show_soc_icon` | `true` | boolean | Show SOC icon in legend. |
| `show_soc_value` | `true` | boolean | Show SOC value as percentage. |
| `show_sync_icon` | `true` | boolean | Show sync/balancing icon. |
| `show_cell_diff` | `true` | boolean | Show cell difference (Δ mV). |
| `pack_cell_low` | `null` | string / null | Entity of lowest cell (optional). |
| `pack_cell_high` | `null` | string / null | Entity of highest cell (optional). |
| `use_3d` | `true` | boolean | Enable 3D effect. |
| `chunk_cells` | `false` | boolean | Wrap cells in rows (mobile optimization). |
| `chunk_size` | `8` | number | Number of cells per row in chunk mode. |
| `cells` | *(Array of cells)* | array | List of cells `{name, entity}`; auto-filled if empty. |

---

## Example Configuration

```yaml
type: custom:battery-cells-card
title: Battery Cells
card_height: 400
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
chunk_cells: false
chunk_size: 8
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
  rows: auto
```

<img width="890" height="918" alt="battery-cell-card-v0 5 0" src="https://github.com/user-attachments/assets/2e8b95ae-606a-4441-b825-b2e62f617771" />



## Battery Cell Card - Zellen-Echtzeitüberwachung (deutsch)
**Version:** 0.6.0
**Beschreibung:** Eine Home Assistant Custom Card zur Visualisierung von Batteriezellen, Zellspannungen, SOC, Balancing-Status und Differenzen.  
Ideal für LiFePO4-Batteriesysteme.


> Hinweis:  
> Die Balkenhöhen geben die Zellspannung, nicht den Ladezustand an.  
> Der prozentuale SOC kann in der Legende abgelesen werden, sofern ein SOC-Sensor eingetragen ist.



---

## Inhaltsverzeichnis
1. [Was macht die Karte?](#was-macht-die-karte)
2. [Lizenz](#lizenz)
3. [Features](#features)
4. [Installation](#installation-manuell)
5. [Beispiel-Konfiguration](#beispiel-konfiguration)
6. [Alle Konfigurationsoptionen](#konfigurationsoptionen-im-detail)
7. [Funktionsweise](#funktionsweise)
8. [Entwicklerhinweise](#entwicklerhinweise)

---

## Was macht die Karte?

Diese Custom Card zeigt je nach Konfiguration:

- Zellspannungen jeder einzelnen Zelle  (V or mV) 
- Zell-Differenz (Δ mV)  
- Ladung / Entladung (Watt)  
- Lade-/Entlade-Icons  
- Balancing-Status  
- SOC-Wert und SOC-Icon  
- Farblegende (Spannungsbereiche)  
- Responsive Größenanpassung  
- Optionaler Zeilenumbruch bei kleinen Displays (Chunking)
- card-mod funktioniert (ab V.0.5.9.8)

Kompatibel mit allen BMS die Zell-Sensoren ausgeben:

 u.a.
- Daly    
- JK-BMS
- smartBMS - smartlabs dongle
- allen Sensoren, die Zellspannungen einzeln melden (V or mV)

---

## Lizenz

**Creative Commons – CC BY-NC-SA 4.0**

- Bearbeiten & Anpassen erlaubt  
- Keine kommerzielle Nutzung  
- Weitergabe nur unter gleicher Lizenz  

[Link zur vollständigen Lizenz](https://creativecommons.org/licenses/by-nc-sa/4.0/)

---

## Features

### Zellenvisualisierung
- Farbskala von Rot → Orange → Gelb → Grün

### Batterie-Status
- SOC-Text & Icon
- Plus/Minus-Symbol abhängig von Lade-/Entladeleistung

### Balancing
- Sync-Icon, wenn Balancing aktiv
- Zell-Differenzanzeige (Δ mV)

### Flexibles Layout
- Automatische Skalierung
- Optionaler Zeilenumbruch (Chunking)
- Responsive Darstellung auf Mobil- und Desktop-Geräten

### Anzeigeoptionen
- Legende ein-/ausblendbar
- SOC-Wert & Icon separat ein-/ausblendbar
- 3D-Rahmen ein-/ausschaltbar
- Schriftgröße anpassbar

### Sensor-Unterstützung
- SOC-Sensor
- Leistungssensor (Watt)
- Zellendifferenzsensor
- Sensor niedrigste & höchste Zelle
- Individuelle Zellen **{name, entity}**

---

Installation über HACS

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=jinx-22&repository=battery-cell-card&category=plugin)

## Installation (manuell)

1. Datei **battery-cells-card.js** herunterladen  
2. In `/config/www/community/battery-cell-card/` kopieren  
3. In Home Assistant:  
   - Einstellungen  
   - Dashboards  
   - Drei Punkte  
   - Ressourcen  
   - Ressource hinzufügen  
   - URL: **/local/community/battery-cell-card/battery-cells-card.js**   
     Typ: **JavaScript-Modul**
4. Browser neu laden (STRG + F5)

Danach ist die Karte in der GUI verfügbar und auswählbar.

---
## 🧡 Support & Unterstützung

Wenn dir diese Integration gefällt und sie einen echten Mehrwert für dein Home Assistant Setup bietet,  
freue ich mich über eine kleine Unterstützung — jede Spende hilft, das Projekt weiterzuentwickeln 🚀
<br>
<p align="center">
⚡ <b>Lightning Adresse:</b>
<br> <br>
<code>usefulplay52@walletofsatoshi.com</code>
<br>
<img height="450" alt="Self_Wallet of Satoshi" src="https://github.com/user-attachments/assets/65cc18d9-05d1-4a00-8ccc-9922fdb54baf" />
<br> <br>
oder: 
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

**Vielen Dank** ,und gebt mir einen kostenlosen [![GitHub stars](https://img.shields.io/github/stars/jinx-22/battery-cell-card?style=social)](https://github.com/jinx-22/battery-cell-card/stargazers), dann finden andere auch den Weg hierher - Danke!


---

### Konfigurationsoptionen

| Option | Standardwert | Typ | Beschreibung |
|--------|--------------|------|--------------|
| `card_height` | `380` | number | Höhe der gesamten Karte in Pixel. |
| `background` | `null` | string / null | Hintergrund individuell (optional) |
| `show_legend` | `true` | boolean | Zeigt die Farblegende der Zellspannungen. |
| `soc_entity` | `'sensor.status_of_charge'` | string | Sensor-Entity für den State of Charge (SOC). |
| `watt_entity` | `'sensor.pack_watt'` | string | Sensor für Lade-/Entladeleistung in Watt. |
| `container_padding` | `10` | number | Außenabstand der Karte innen (Padding). |
| `cell_gap` | `2` | number | Abstand zwischen den Zellbalken. |
| `top_padding` | `20` | number | Oberer Abstand für Titel und Legende. |
| `overlay_opacity` | `0.70` | number | Transparenzwert für den Overlay-Effekt über Zellen. |
| `font_size` | `7.5` | number | Globale Schriftgröße der Karte. |
| `title` | `'Battery Cells'` | string | Titel der Karte. |
| `balance_sensor` | `null` | string / null | Sensor für aktives Balancing. |
| `cell_diff_sensor` | `'sensor.delta_mvolts_between_cells'` | string | Sensor für die Zellspannungs-Differenz (Δ). |
| `cell_diff` | `8` | number | Mindest-Differenz (mV) zur Aktivierung des Balancing-Icons. |
| `cell_bal_over` | `3000` | number | Mindestzellspannung (mV), ab der Balancing aktiv sein darf. |
| `cell_unit` | `V` | string | Anzeige-Einheit wählbar "V" or "mV". |
| `auto_detect_low_high` | `true` | boolean | auto Zellen low-high Berechnung. |
| `show_soc_icon` | `true` | boolean | Zeigt SOC-Icon in der Legende. |
| `show_soc_value` | `true` | boolean | Zeigt SOC-Wert als Prozentzahl. |
| `show_sync_icon` | `true` | boolean | Zeigt Sync-/Balancing-Icon. |
| `show_cell_diff` | `true` | boolean | Zeigt Zellspannungs-Differenz (Δ mV). |
| `pack_cell_low` | `null` | string / null | Entity der niedrigsten Zelle (optional). |
| `pack_cell_high` | `null` | string / null | Entity der höchsten Zelle (optional). |
| `use_3d` | `true` | boolean | Aktiviert 3D-Effekt der Zellbalken und der Legende. |
| `chunk_cells` | `false` | boolean | Teilt Zellen in Reihen auf (Mobil-Optimierung). |
| `chunk_size` | `8` | number | Anzahl der Zellen pro Reihe im Chunk-Modus. |
| `cells` | *(Array aus Zellen)* | array | Liste der Zellen mit `{ name, entity }`. Wird automatisch gefüllt, falls leer. |


---

## Beispiel-Konfiguration

```yaml
type: custom:battery-cells-card
title: Batteriespeicher Zellen
card_height: 380
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
cells:
  - name: Zelle 1
    entity: sensor.cell1
  - name: Zelle 2
    entity: sensor.cell2
  - name: Zelle 3
    entity: sensor.cell3
  - name: Zelle 4
    entity: sensor.cell4
  - name: Zelle 5
    entity: sensor.cell5
  - name: Zelle 6
    entity: sensor.cell6
  - name: Zelle 7
    entity: sensor.cell7
  - name: Zelle 8
    entity: sensor.cell8
grid_options:
  columns: 15
  rows: auto
```
