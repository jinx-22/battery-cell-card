[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
![GitHub total downloads](https://img.shields.io/github/downloads/jinx-22/battery-cell-card/total?style=flat-square&color=red)
[![GitHub release](https://img.shields.io/github/release/jinx-22/battery-cell-card?include_prereleases=&sort=semver&color=blue)](https://github.com/jinx-22/battery-cell-card/releases/)
![File size](https://img.shields.io/github/size/jinx-22/battery-cell-card/battery-cells-card.js?label=Card%20Size)
![last commit](https://img.shields.io/github/last-commit/jinx-22/battery-cell-card)
[![README deutsch](https://img.shields.io/badge/README-DE)](battery-cell-card/blob/main/README.md)
[![stars](https://img.shields.io/github/stars/jinx-22/battery-cell-card)](https://github.com/jinx-22/battery-cell-card/stargazers)

# Battery Cell Card - Zellen-Echtzeitüberwachung

*(Link zur englischen Version: [English](README.md))*

**Version:** 0.7.0  
**Beschreibung:** Eine Home Assistant Custom Card zur Visualisierung von Batteriezellen, Zellspannungen, SOC, Balancing-Status und Differenzen.

Ideal für LiFePO4-Batteriesysteme.

### Neu in Version 0.7.0

- Neuer nativer Home Assistant Visual Editor
- Zellen direkt im Editor hinzufügen, bearbeiten, löschen und per Drag & Drop sortieren
- Zusätzliche Sensoren mit Name und Icon
- Theme-Auswahl im Editor
- Responsive Cell-Chunking
- Unterstützung von `grid_options`
- Verbesserte responsive Darstellung und Layout-Aktualisierung
- `card_height` und `background` werden nicht mehr verwendet

> Hinweis:
> Die Balkenhöhen geben die Zellspannung, nicht den Ladezustand an.
> Der prozentuale SOC kann in der Legende abgelesen werden, sofern ein SOC-Sensor eingetragen ist.


<img width="1282" height="788" alt="2t" src="https://github.com/user-attachments/assets/72a04c39-3cfd-4768-89a0-d15e2399d07e" />
<img width="1039" height="512" alt="1" src="https://github.com/user-attachments/assets/c9f03baa-3997-44b7-8d95-478a2b91199b" />

---

## Inhaltsverzeichnis
1. [Was macht die Karte?](#was-macht-die-karte)
2. [Features](#features)
3. [Installation](#installation-manuell)
4. [Beispiel-Konfiguration](#beispiel-konfiguration)
5. [Alle Konfigurationsoptionen](#konfigurationsoptionen-im-detail)
6. [Funktionsweise](#funktionsweise)
7. [Entwicklerhinweise](#entwicklerhinweise)
8. [Lizenz](#lizenz)

---

## Was macht die Karte?

Diese Custom Card zeigt je nach Konfiguration:

- Zellspannungen jeder einzelnen Zelle (V oder mV)
- Zell-Differenz (Δ mV)
- Ladung / Entladung (Watt)
- Lade-/Entlade-Icons
- Balancing-Status
- SOC-Wert und SOC-Icon
- Farblegende (Spannungsbereiche)
- Responsive Größenanpassung
- Optionaler Zeilenumbruch bei kleinen Displays (Chunking)
- Zusätzliche Sensoren
- Home Assistant Visual Editor

Kompatibel mit allen BMS die Zell-Sensoren ausgeben:
u.a.

- Daly
- JK-BMS
- smartBMS - smartlabs dongle
- allen Sensoren, die Zellspannungen einzeln melden (V oder mV)

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
- `grid_options` für das Home Assistant Sections-Layout

### Anzeigeoptionen
- Legende ein-/ausblendbar
- SOC-Wert & Icon separat ein-/ausblendbar
- 3D-Rahmen ein-/ausschaltbar
- Schriftgröße anpassbar
- Home Assistant Theme auswählbar

### Sensor-Unterstützung
- SOC-Sensor
- Leistungssensor (Watt)
- Zellendifferenzsensor
- Sensor niedrigste & höchste Zelle
- Individuelle Zellen **{name, entity}**
- Zusätzliche Sensoren **{name, entity, icon}**

---

## Installation über HACS

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
| `theme` | `""` | string | Home Assistant Theme. |
| `show_legend` | `true` | boolean | Zeigt die Farblegende der Zellspannungen. |
| `soc_entity` | `sensor.soc` | string | Sensor-Entity für den State of Charge (SOC). |
| `watt_entity` | `sensor.pack` | string | Sensor für Lade-/Entladeleistung in Watt. |
| `container_padding` | `10` | number | Außenabstand der Karte innen (Padding). |
| `cell_gap` | `2` | number | Abstand zwischen den Zellbalken. |
| `top_padding` | `20` | number | Oberer Abstand für Titel und Legende. |
| `overlay_opacity` | `0.70` | number | Transparenzwert für den Overlay-Effekt über Zellen. |
| `font_size` | `6` | number | Globale Schriftgröße der Karte. |
| `title` | `Battery Cells` | string | Titel der Karte. |
| `balance_sensor` | `null` | string / null | Sensor für aktives Balancing. |
| `cell_diff_sensor` | `sensor.delta_mvolts` | string | Sensor für die Zellspannungs-Differenz (Δ). |
| `cell_diff` | `8` | number | Mindest-Differenz (mV) zur Aktivierung des Balancing-Icons. |
| `cell_bal_over` | `3000` | number | Mindestzellspannung (mV), ab der Balancing aktiv sein darf. |
| `cell_unit` | `mV` | string | Anzeige-Einheit "V" oder "mV". |
| `auto_detect_low_high` | `true` | boolean | Automatische Berechnung der niedrigsten und höchsten Zelle. |
| `show_soc_icon` | `true` | boolean | Zeigt SOC-Icon in der Legende. |
| `show_soc_value` | `true` | boolean | Zeigt SOC-Wert als Prozentzahl. |
| `show_sync_icon` | `true` | boolean | Zeigt Sync-/Balancing-Icon. |
| `show_cell_diff` | `true` | boolean | Zeigt Zellspannungs-Differenz (Δ mV). |
| `pack_cell_low` | `null` | string / null | Entity der niedrigsten Zelle (optional). |
| `pack_cell_high` | `null` | string / null | Entity der höchsten Zelle (optional). |
| `use_3d` | `true` | boolean | Aktiviert 3D-Effekt der Zellbalken und der Legende. |
| `chunk_cells` | `false` | boolean | Teilt Zellen in Reihen auf (Mobil-Optimierung). |
| `chunk_size` | `8` | number | Anzahl der Zellen pro Reihe im Chunk-Modus. |
| `show_extra_sensors` | `false` | boolean | Zeigt zusätzliche Sensoren an. |
| `extra_sensors` | `[]` | array | Zusätzliche Sensoren mit `{name, entity, icon}`. |
| `cells` | *(Array aus Zellen)* | array | Liste der Zellen mit `{name, entity}`. |
| `grid_options` | `columns: 12, rows: 8` | object | Home Assistant Sections-Layout. |

---

## Beispiel-Konfiguration

```yaml
type: custom:battery-cells-card
title: Batteriespeicher Zellen
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
  columns: 12
  rows: 8
```
<img width="890" height="918" alt="battery-cell-card-v0 5 0" src="https://github.com/user-attachments/assets/2e8b95ae-606a-4441-b825-b2e62f617771" />

--- 

# 📜 Lizenz

**Apache-2.0**
