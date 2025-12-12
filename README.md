# Battery Cells Card - Cell-Monitoring (coming soon)
*(Link to German version: [Deutsch](
#battery-cell-card---zellen-monitoring-deutsch))*  

**Version:** 0.5.0  
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

- Individual cell voltages  
- Cell voltage difference (Δ mV)  
- Charge / discharge power (W)  
- Charge/discharge icons  
- Balancing status  
- SOC value and SOC icon  
- Color-coded voltage legend  
- Responsive scaling  
- Optional row wrapping for small displays (chunking)

Compatible with all BMS that provide individual cell sensors, e.g.:

- Daly  
- JK-BMS
- smartBMS smartlabs dongle
- All sensors reporting individual cell voltages  

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

## Manual Installation

1. Download **battery-cells-card.js**  
2. Copy it to `/config/www/`  
3. In Home Assistant:  
   - Settings  
   - Dashboards  
   - Three-dot menu  
   - Resources  
   - Add Resource  
   - URL: **/local/battery-cells-card.js**  
     Type: **JavaScript Module**
4. Reload browser (CTRL + F5)

The card is now selectable and visible in the GUI.

---

### Configuration Options

| Option | Default | Type | Description |
|--------|---------|------|-------------|
| `card_height` | `380` | number | Total card height in pixels. |
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
background_color: "#00000080"
card_height: 400
show_legend: true
soc_entity: sensor.status_of_charge
watt_entity: sensor.pack_watt
balance_sensor: sensor.cell_balance_active
cell_diff_sensor: sensor.delta_mvolts_between_cells
cell_diff: 10
cell_bal_over: 3000
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
  rows: 8
```

<img width="890" height="918" alt="battery-cell-card-v0 5 0" src="https://github.com/user-attachments/assets/2e8b95ae-606a-4441-b825-b2e62f617771" />



## Battery Cell Card - Zellen-Monitoring (deutsch)
**Version:** 0.5.0  
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

- Zellspannungen jeder einzelnen Zelle  
- Zell-Differenz (Δ mV)  
- Ladung / Entladung (Watt)  
- Lade-/Entlade-Icons  
- Balancing-Status  
- SOC-Wert und SOC-Icon  
- Farblegende (Spannungsbereiche)  
- Responsive Größenanpassung  
- Optionaler Zeilenumbruch bei kleinen Displays (Chunking)

Kompatibel mit allen BMS die Zell-Sensoren ausgeben:

 u.a.
- Daly    
- JK-BMS
- smartBMS - smartlabs dongle
- allen Sensoren, die Zellspannungen einzeln melden

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

## Installation (manuell)

1. Datei **battery-cells-card.js** herunterladen  
2. In `/config/www/` kopieren  
3. In Home Assistant:  
   - Einstellungen  
   - Dashboards  
   - Drei Punkte  
   - Ressourcen  
   - Ressource hinzufügen  
   - URL: **/local/battery-cells-card.js**  
     Typ: **JavaScript-Modul**
4. Browser neu laden (STRG + F5)

Danach ist die Karte in der GUI verfügbar und auswählbar.

---

### Konfigurationsoptionen

| Option | Standardwert | Typ | Beschreibung |
|--------|--------------|------|--------------|
| `card_height` | `380` | number | Höhe der gesamten Karte in Pixel. |
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
title: Battery Cells
background_color: "#00000080"
card_height: 400
show_legend: true
soc_entity: sensor.status_of_charge
watt_entity: sensor.pack_watt
balance_sensor: sensor.cell_balance_active
cell_diff_sensor: sensor.delta_mvolts_between_cells
cell_diff: 10
cell_bal_over: 3000
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
  rows: 8
