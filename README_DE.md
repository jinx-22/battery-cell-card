[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5?style=flat&logo=homeassistantcommunitystore&logoColor=white)](https://github.com/hacs/integration)
[![GitHub total downloads](https://img.shields.io/github/downloads/jinx-22/battery-cell-card/total?style=flat&color=red&logo=github&logoColor=white)](https://github.com/jinx-22/battery-cell-card/releases)
[![GitHub release](https://img.shields.io/github/release/jinx-22/battery-cell-card?include_prereleases=&sort=semver&color=blue&style=flat&logo=github&logoColor=white)](https://github.com/jinx-22/battery-cell-card/releases/)
[![File size](https://img.shields.io/github/size/jinx-22/battery-cell-card/battery-cells-card.js?label=Card%20Size&style=flat&logo=javascript&logoColor=white)](https://github.com/jinx-22/battery-cell-card/blob/main/battery-cells-card.js)
[![Editor Einstellungen - Doku](https://img.shields.io/badge/Editor%20Einstellungen-Doku-e91e63?style=flat&logo=readthedocs&logoColor=white)](#editor-dokumentation)
[![README english](https://img.shields.io/badge/README-EN-blue?style=flat&logo=googletranslate&logoColor=white)](README.md)
[![stars](https://img.shields.io/github/stars/jinx-22/battery-cell-card?style=flat&logo=github&logoColor=white)](https://github.com/jinx-22/battery-cell-card/stargazers)
[![Donate Bitcoin](https://img.shields.io/badge/Bitcoin-Spenden-F7931A?style=flat&logo=bitcoin&logoColor=white)](#bitcoin)
[![Donate Lightning](https://img.shields.io/badge/%E2%9A%A1-Lightning-FFD700?style=flat)](#lightning)

# Battery Cells Card - Zellspannungs-Überwachung in Echtzeit

*(Link zur englischen Version: [English](README.md))*

**Version:** 0.9.4

**Beschreibung:** Eine benutzerdefinierte Home-Assistant-Karte zur Visualisierung von Batteriezellen, Zellspannungen, SOC, Balancing-Status und Differenzen.  
Ideal für LiFePO₄-Batteriesysteme, auch für NMC/NCM und Blei-Säureakkus.

## ✨ Neu

### Hinzugefügt

* Leere Karten zeigen jetzt 4 nicht anklickbare Platzhalterzellen
* Verbesserte Barrierefreiheit durch Beschriftungen für Symbole

### Geändert

* Saubereres YAML mit nur von den Standardwerten abweichenden Einstellungen
* Balancing-Bereich auf 1500–4500 mV erweitert
* Bezeichnung für das Laden-/Entladen-Symbol korrigiert

### Verbessert

* Zuverlässigere Erkennung der High-/Low-Zellen
* Verbesserte Klick- und Tastaturfokus-Unterstützung
* Effizientere Aktualisierung der Zusatzsensoren
* Geöffnete Editor-Bereiche bleiben beim Sprachwechsel erhalten
* Doppelte Registrierung und mehrfaches Laden der Karte verhindert


### ✨ Neu in v0.9.3

* Neuer 3D-Look → Batteriegehäuse mit Chrom-Optik.

<img width="30%" height="auto" alt="3d-w" src="https://github.com/user-attachments/assets/0fcbeab4-91fe-4651-b412-3fd7f194c292" /><img width="30%" height="auto" alt="3d" src="https://github.com/user-attachments/assets/7342d1fd-bfd2-45d1-8b37-cf5ead4f8f74" />

* Eine komplett eigene Batterie-Skala direkt im visuellen Editor erstellen (Spannungspunkte, Farben, Segmenthöhen, Beschriftungen).
* 7 Skalen-Presets für eigene Batterien – erstelle deinen eigenen Favoriten!
* Optionaler Farbverlauf der Skala.

<img width="60%" height="auto" alt="Skala" src="https://github.com/user-attachments/assets/2543b511-668d-4fda-9fff-d4b35d1e1805" />

* Scheiben-Optik für die Skala: drei Stärken – Dezent, Mittel und Stark.
* Chunk-Modus komplett überarbeitet. (Bitte Feedback geben, ob die Darstellung auf dem iPhone korrekt funktioniert!)
* Auswählbarer Batterietyp komplett überarbeitet und weiterentwickelt.
* Visueller Editor erweitert und überarbeitet.
* Native Home-Assistant-Editor-Komponenten für eine bessere Bedienung.
* Zellen und zusätzliche Sensoren können jetzt direkt im visuellen Editor hinzugefügt, bearbeitet, gelöscht und sortiert werden.
* Eigene Namen und Icons für Zellen und zusätzliche Sensoren.
* Editor auf Deutsch und Englisch verfügbar.
* Auto-Chunk-Modus → Auto4, Auto8 oder manuell.
* Chunk-Höhe im Editor manuell einstellbar.
* Chunk-Zellenbreite im Editor manuell einstellbar.
* Schriftgröße der zusätzlichen Sensoren skalierbar.
* Verbesserte automatische Erkennung der niedrigsten und höchsten Zellspannung.
* Verbesserte Darstellung von Balancing und Zellspannungsdifferenzen.
* Verbesserte Unterstützung für Spannungssensoren mit V- oder mV-Werten.
* `grid_options` zur Steuerung der Kartengröße.
* Erhebliche Performance-Verbesserungen und viele weitere kleine Änderungen/Verbesserungen.

### Vollständiger Changelog: [changelog.md](https://github.com/jinx-22/battery-cell-card/blob/main/changelog.md)

---

> [!CAUTION]
> **Hinweis:** Die Balkenhöhe zeigt die Zellspannung, nicht den Ladezustand.
> Der SOC in Prozent ist in der Legende ablesbar, wenn ein SOC-Sensor zugewiesen ist.

---

> [!TIP]
> ### 📖 Editor-Dokumentation
> Jede Einstellung des visuellen Editors ist Schritt für Schritt erklärt, mit Zweck der Option und Hinweis, wann sie sichtbar ist.
>
> **👉 [Editor-Dokumentation](#editor-dokumentation)**

---

## Inhaltsverzeichnis

1. [Was macht diese Karte?](#was-macht-diese-karte)
2. [Geplante Funktionen](#-geplante-funktionen)
3. [Funktionen](#funktionen)
4. [Installation](#installation)
5. [Unterstützung & Spenden](#-unterstützung--spenden)
6. [Konfigurationsoptionen](#konfigurationsoptionen)
7. [Beispielkonfiguration](#beispielkonfiguration)
8. [Editor-Dokumentation](#editor-dokumentation)
9. [Screenshots](#screenshots)
10. [Lizenz](#lizenz)

---

## Was macht diese Karte?

Je nach Konfiguration kann diese Karte anzeigen:

* Einzelne Zellspannungen (V oder mV)
* Zellspannungsdifferenz (Δ mV)
* Lade-/Entladeleistung (W)
* Lade-/Entladesymbole
* Balancing-Status
* SOC-Wert und SOC-Symbol
* Farbcodierte Spannungsskala
* Optionaler weicher Farbverlauf der Skala
* Zusätzliche Sensoren mit eigenen Namen und Symbolen
* Responsive Skalierung
* Optionaler Zeilenumbruch für kleinere Displays (Chunking)
* Optionaler 3D-Metallrahmen und Scheiben-Look der Skala
* Eigene Batterie-Spannungsskalen und Presets
* Einstellbare Zellen- und Zeilenabmessungen
* Visueller Editor für einfache Konfiguration
* card-mod ready (V0.5.9.8)

Kompatibel mit allen BMS, die einzelne Zellsensoren bereitstellen, z. B.:

* Daly
* JK-BMS
* smartBMS smartlabs Dongle
* Alle Sensoren, die einzelne Zellspannungen melden (V oder mV)

---

## 🔜 Geplante Funktionen

Alle geplanten Funktionen sind umgesetzt. Ideen und Funktionswünsche sind willkommen – bitte ein [Issue](https://github.com/jinx-22/battery-cell-card/issues) öffnen.

---

## Funktionen

### Zellen-Visualisierung

* Farbskala: Rot → Orange → Gelb → Grün
* Niedrigste und höchste Zelle mit einem Ring hervorgehoben
* Batterietypen: LiFePO4, NMC/NCM, Blei-Säure (2V-Zelle), Benutzerdefiniert
* Eigene Skala mit 7 Presets, eigenen Farben, Beschriftungen und optionalem weichem Farbverlauf

<img width="33%" height="auto" alt="0 8" src="https://github.com/user-attachments/assets/ae1a84b7-b2c6-4e85-a39a-7528715f04eb" />

### Batteriestatus

* SOC-Text & Symbol
* Plus-/Minus-Symbol je nach Laden/Entladen

### Balancing

* Sync-Symbol, wenn das Balancing aktiv ist
* Anzeige der Spannungsdifferenz Δ zwischen den Zellen

### Flexibles Layout

* Automatische Skalierung
* Responsive für Handy und Desktop
* Optionaler Zellen-Umbruch (Chunking) im Modus Auto 4, Auto 8 oder Manuell

### Anzeigeoptionen

* Legende ein-/ausblenden
* SOC-Wert & Symbol getrennt schaltbar
* 3D-Metallrahmen schaltbar
* **Scheiben-Look der Skala** in drei Stufen: Dezent, Mittel, Stark (mit und ohne 3D-Rahmen)
* Einstellbare Schriftgröße
* Zusätzliche Sensoren mit Name, Symbol und Schriftgröße

### Sensor-Unterstützung

* SOC-Sensor
* Leistungssensor (W)
* Zelldifferenz-Sensor
* Balancing-Sensor (optional)
* Sensor für niedrigste & höchste Zelle
* Einzelne Zellen **{name, entity}**
* Zusätzliche Sensoren **{name, entity, icon}**

---

## Installation

### HACS

Klicke auf den Button, um das Repository in HACS hinzuzufügen, lade die Karte herunter und lade den Browser neu.

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=jinx-22&repository=battery-cell-card&category=plugin)

### Manuelle Installation

1. **battery-cells-card.js** herunterladen
2. Nach `/config/www/community/battery-cell-card/` kopieren
3. In Home Assistant:
   - Einstellungen
   - Dashboards
   - Drei-Punkte-Menü
   - Ressourcen
   - Ressource hinzufügen
   - URL: **/local/community/battery-cell-card/battery-cells-card.js**
   - Typ: **JavaScript-Modul**
4. Browser neu laden (STRG + F5)

Die Karte ist jetzt in der Oberfläche auswählbar und sichtbar.

---

## 🧡 Unterstützung & Spenden

Wenn dir diese Integration gefällt und sie deinem Home-Assistant-Setup echten Mehrwert bringt,  
freue ich mich über eine kleine Spende — jeder Beitrag hilft bei der Weiterentwicklung 🚀

## 🧡 Support & Donations

If you like this integration and it adds real value to your Home Assistant setup,  
I’d appreciate a small donation — every contribution helps further development 🚀

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

**Vielen Dank**, und bitte vergib einen kostenlosen [![GitHub stars](https://img.shields.io/github/stars/jinx-22/battery-cell-card?style=social)](https://github.com/jinx-22/battery-cell-card/stargazers), damit auch andere dieses Projekt finden — danke!

---

## Konfigurationsoptionen

Die Karte hat einen visuellen Editor (Englisch / Deutsch, folgt der Home-Assistant-Sprache). Jede Option kann auch in YAML gesetzt werden. Zahlenwerte außerhalb des erlaubten Bereichs werden automatisch begrenzt.

| Option | Standard | Typ | Bereich / Werte | Beschreibung |
| ------ | -------- | --- | --------------- | ------------ |
| `title` | `'Battery Cells'` | string | – | Kartentitel. |
| `theme` | `''` | string | Theme-Name | Home-Assistant-Theme für diese Karte (leer = Standard-Theme). |
| `battery_type` | `lifepo4` | string | `lifepo4`, `nmc`, `lead`, `custom` | Batterie-Chemie und Spannungsskala. |
| `custom_min_mv` | `2600` | number | 1000 – 5000 | Nur `custom`: minimale Zellspannung (mV). Mit `legend_stops` ist es die Unterkante der untersten Stufe. |
| `custom_max_mv` | `3650` | number | 1000 – 5000 | Nur `custom`: maximale Zellspannung (mV). Wird verwendet, wenn weniger als 2 `legend_stops` existieren. |
| `legend_stops` | `[]` | array | 2 – 20 Stufen | Nur `custom`: eigene Skalen-Stufen `{color, mv, pct, top, bottom}` (siehe Hinweis unten). |
| `scale_gradient` | `false` | boolean | – | `custom`-Skala: weicher Farbverlauf statt harter Segmente (Zellen + Legende). |
| `show_legend` | `true` | boolean | – | Legendenspalte anzeigen. |
| `soc_entity` | `null` | string / null | Sensor | Sensor für den Ladezustand (%). |
| `watt_entity` | `null` | string / null | Sensor | Leistungssensor (W). Positiv = Laden, negativ = Entladen. |
| `cell_diff_sensor` | `null` | string / null | Sensor | Zellspannungsdifferenz (Δ). Einheit `V` / `mV` wird erkannt; ohne Einheit gelten Werte unter 0,1 als V. |
| `balance_sensor` | `null` | string / null | Entität | Optionale Entität „Balancing aktiv“ (Zustand `on`). |
| `cell_diff` | `8` | number | 0 – 1000 | Minimale Δ (mV) für das Balancing-(Sync-)Symbol. |
| `cell_bal_over` | `3000` | number | 0 – 6000 | Das Balancing-Symbol erscheint nur, wenn die höchste Zelle mindestens diese Spannung (mV) hat. |
| `auto_detect_low_high` | `true` | boolean | – | Niedrigste / höchste Zelle automatisch erkennen. |
| `pack_cell_low` | `null` | string / null | Sensor | Sensor mit der Nummer der niedrigsten Zelle (Automatik aus). |
| `pack_cell_high` | `null` | string / null | Sensor | Sensor mit der Nummer der höchsten Zelle (Automatik aus). |
| `show_soc_value` | `true` | boolean | – | SOC-Wert in der Legende. |
| `show_soc_icon` | `true` | boolean | – | Batterie-Symbol in der Legende (ändert sich mit der Leistung). |
| `show_cell_diff` | `true` | boolean | – | Zelldifferenz (Δ mV) in der Legende. |
| `show_sync_icon` | `true` | boolean | – | Sync-Symbol während des Balancings. |
| `cell_unit` | `mV` | string | `mV`, `V` | Einheit der Zellwerte. |
| `font_size` | `8` | number | 4 – 16 | Grundschriftgröße. |
| `overlay_opacity` | `0.7` | number | 0 – 1 | Abdunklung des leeren Teils jeder Zelle. |
| `cell_gap` | `4` | number | 0 – 16 | Abstand zwischen den Zellen (px). |
| `container_padding` | `10` | number | 0 – 40 | Innenabstand um die Zellen (px). |
| `top_padding` | `20` | number | 0 – 60 | Abstand unter dem Titel (px). |
| `use_3d` | `false` | boolean | – | 3D-Metallrahmen. |
| `show_slices` | `false` | boolean | – | Scheiben-Look der Skala. |
| `slice_strength` | `medium` | string | `subtle`, `medium`, `strong` | Stärke des Scheiben-Looks. |
| `chunk_cells` | `false` | boolean | – | Zellen auf schmalen Displays in mehrere Zeilen umbrechen. |
| `chunk_mode` | `auto8` | string | `auto4`, `auto8`, `manual` | Umbruch-Modus. |
| `chunk_size` | `8` | number | 2 – 32 | Zellen pro Zeile, nur Modus `manual` (Obergrenze). |
| `cell_height` | `340` | number | 200 – 800 | Zeilenhöhe (px), nur mit `chunk_cells: true`. |
| `min_cell_width` | `50` | number | 40 – 120 | Minimale Zellenbreite (px); kleinere Breiten lösen den Umbruch früher aus. |
| `show_extra_sensors` | `false` | boolean | – | Zusätzliche Sensoren über den Zellen anzeigen. |
| `extra_sensors` | `[]` | array | – | Liste von `{name, entity, icon}`. Ohne `icon` wird das Symbol der Entität verwendet. |
| `extra_font_scale` | `1` | number | 0.7 – 1.5 | Schriftgrößenfaktor für zusätzliche Sensoren. |
| `cells` | `[]` | array | – | Liste der Zellen `{name, entity}` in Anzeigereihenfolge (V oder mV wird erkannt). |
| `grid_options` | `columns: 12` | object | `columns`, `rows` | Home-Assistant-Layout. Ohne Umbruch: mind. 5 Zeilen (Standard 6). Mit Umbruch: `rows: auto`. |

**Schlüssel von `legend_stops`** (nur mit `battery_type: custom`, erste Stufe = Oberkante der Legende):

| Schlüssel | Beschreibung |
| --------- | ------------ |
| `color` | Beliebige CSS-Farbe, z. B. `'#00ee00'`. |
| `mv` | Spannung (mV) an der **Oberkante** des Segments. Muss von oben nach unten sinken. |
| `pct` | Segmenthöhe in %. Alle Stufen ergeben zusammen immer 100 %. |
| `top` / `bottom` | Optionale Beschriftungen oben / unten am Segment. |

**Batterietypen**

| `battery_type` | Spannungsbereich (pro Zelle) |
| -------------- | ---------------------------- |
| `lifepo4` | 2,60 V – 3,65 V |
| `nmc` | 3,00 V – 4,20 V |
| `lead` | 1,80 V – 2,45 V (2-V-Zelle) |
| `custom` | `custom_min_mv` – `custom_max_mv` oder eigene `legend_stops` |

**Balancing-Symbol:** wird angezeigt, wenn `balance_sensor` auf `on` steht, oder wenn Δ ≥ `cell_diff` und die höchste Zelle ≥ `cell_bal_over` ist.

> Karten, die über den Karten-Auswahldialog erstellt werden, sind mit den Beispielsensoren `sensor.status_of_charge`, `sensor.pack_watt` und `sensor.delta_mvolts_between_cells` vorbelegt.
> `card_height` und `background` werden nicht mehr unterstützt (seit 0.7.0).

---

## Beispielkonfiguration

### Standard (LiFePO4, 8 Zellen)

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

### Mit Zellen-Umbruch (16 Zellen)

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
  # … bis C16
grid_options:
  columns: 24
```

### Eigene Skala (NMC-ähnliche Farben)

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

---

## Editor-Dokumentation

Der Editor besteht aus aufklappbaren Panels, nummeriert in der Reihenfolge, in der sie erscheinen. Jede Änderung wird sofort in der Vorschau übernommen.


Punkte mit Badge (![sichtbar bei 2.1 = Benutzerdefiniert](https://img.shields.io/badge/sichtbar%20bei-2.1%20%3D%20Benutzerdefiniert-orange?style=flat) ![sichtbar bei 8.1 an](https://img.shields.io/badge/sichtbar%20bei-8.1%20an-blue?style=flat)) werden im Editor nur angezeigt, wenn die genannte Einstellung gewählt ist. Orange = Batterietyp *Benutzerdefiniert*, Blau = ein anderer Schalter oder Modus.


### Inhalt


1. [Name und Theme](#1-name-und-theme)
   - [1.1 Name](#11-name)
   - [1.2 Theme](#12-theme)

2. [Batterie-Chemie](#2-batterie-chemie)
   - [2.1 Batterietyp](#21-batterietyp)
   - [2.2 Eigene Min-Spannung](#22-eigene-min-spannung) ![sichtbar bei 2.1 = Benutzerdefiniert](https://img.shields.io/badge/sichtbar%20bei-2.1%20%3D%20Benutzerdefiniert-orange?style=flat)
   - [2.3 Eigene Max-Spannung](#23-eigene-max-spannung) ![sichtbar bei 2.1 = Benutzerdefiniert](https://img.shields.io/badge/sichtbar%20bei-2.1%20%3D%20Benutzerdefiniert-orange?style=flat)

3. [Benutzerdefinierte Skala](#3-benutzerdefinierte-skala) ![sichtbar bei 2.1 = Benutzerdefiniert](https://img.shields.io/badge/sichtbar%20bei-2.1%20%3D%20Benutzerdefiniert-orange?style=flat)
   - [3.1 Farb-Skala-Preset](#31-farb-skala-preset)
   - [3.2 Farbverlauf](#32-farbverlauf)
   - [3.3 Skalen-Stufe](#33-skalen-stufe)
   - [3.4 Stufenfarbe](#34-stufenfarbe)
   - [3.5 Beschriftung](#35-beschriftung)
   - [3.6 Verschieben und Löschen](#36-verschieben-und-löschen)
   - [3.7 Skalen-Stufe hinzufügen](#37-skalen-stufe-hinzufügen)
   - [3.8 Automatische Korrekturen](#38-automatische-korrekturen)

4. [Zellen](#4-zellen)
   - [4.1 Zelle hinzufügen](#41-zelle-hinzufügen)
   - [4.2 Entität und Name ändern](#42-entität-und-name-ändern)
   - [4.3 Verschieben und Löschen](#43-verschieben-und-löschen)

5. [Legenden-Sensoren](#5-legenden-sensoren)
   - [5.1 Ladezustand (SOC)](#51-ladezustand-soc)
   - [5.2 Leistung (W)](#52-leistung-w)
   - [5.3 Zellspannungsdifferenz](#53-zellspannungsdifferenz)
   - [5.4 Balancing aktiv](#54-balancing-aktiv)

6. [Balancing und Min. Zelle / Max. Zelle](#6-balancing-und-min-zelle--max-zelle)
   - [6.1 Differenzschwellwert](#61-differenzschwellwert)
   - [6.2 Balancing ab Zellspannung](#62-balancing-ab-zellspannung)
   - [6.3 Niedrigste / höchste Zelle automatisch erkennen](#63-niedrigste--höchste-zelle-automatisch-erkennen)
   - [6.4 Sensor für niedrigste Zelle](#64-sensor-für-niedrigste-zelle) ![sichtbar bei 6.3 aus](https://img.shields.io/badge/sichtbar%20bei-6.3%20aus-blue?style=flat)
   - [6.5 Sensor für höchste Zelle](#65-sensor-für-höchste-zelle) ![sichtbar bei 6.3 aus](https://img.shields.io/badge/sichtbar%20bei-6.3%20aus-blue?style=flat)

7. [Anzeige](#7-anzeige)
   - [7.1 Schriftgröße](#71-schriftgröße)
   - [7.2 Deckkraft des Overlays](#72-deckkraft-des-overlays)
   - [7.3 Zellenabstand](#73-zellenabstand)
   - [7.4 Kartenrand-Abstand](#74-kartenrand-abstand)
   - [7.5 Abstand zum Titel](#75-abstand-zum-titel)
   - [7.6 Zelleneinheit](#76-zelleneinheit)
   - [7.7 Legende anzeigen](#77-legende-anzeigen)
   - [7.8 Legenden-Elemente](#78-legenden-elemente) ![sichtbar bei 7.7 an](https://img.shields.io/badge/sichtbar%20bei-7.7%20an-blue?style=flat)
   - [7.9 Zusätzliche Sensoren anzeigen](#79-zusätzliche-sensoren-anzeigen)
   - [7.10 3D-Rahmen](#710-3d-rahmen)
   - [7.11 Scheiben-Schatten](#711-scheiben-schatten)
   - [7.12 Schattenstärke](#712-schattenstärke) ![sichtbar bei 7.11 an](https://img.shields.io/badge/sichtbar%20bei-7.11%20an-blue?style=flat)

8. [Zellen-Umbruch](#8-zellen-umbruch)
   - [8.1 Zellen umbrechen aktivieren](#81-zellen-umbrechen-aktivieren)
   - [8.2 Umbruch-Modus](#82-umbruch-modus) ![sichtbar bei 8.1 an](https://img.shields.io/badge/sichtbar%20bei-8.1%20an-blue?style=flat)
   - [8.3 Zellenhöhe](#83-zellenhöhe) ![sichtbar bei 8.1 an](https://img.shields.io/badge/sichtbar%20bei-8.1%20an-blue?style=flat)
   - [8.4 Min. Zellenbreite](#84-min-zellenbreite) ![sichtbar bei 8.1 an](https://img.shields.io/badge/sichtbar%20bei-8.1%20an-blue?style=flat)
   - [8.5 Zellen pro Zeile](#85-zellen-pro-zeile) ![sichtbar bei 8.1 an + 8.2 = Manuell](https://img.shields.io/badge/sichtbar%20bei-8.1%20an%20%2B%208.2%20%3D%20Manuell-blue?style=flat)

9. [Zusätzliche Sensoren](#9-zusätzliche-sensoren)
   - [9.1 Schriftgröße](#91-schriftgröße)
   - [9.2 Sensor hinzufügen](#92-sensor-hinzufügen)
   - [9.3 Name und Symbol](#93-name-und-symbol)
   - [9.4 Verschieben und Löschen](#94-verschieben-und-löschen)

---


### 1. Name und Theme

#### 1.1 Name
> **Einstellung:** Freitext für den Kartentitel (`title`). Standard: `Battery Cells`.
>
> **Zweck:** Der Titel steht oben auf der Karte. Er hilft, mehrere Batterien auf einem Dashboard zu unterscheiden.

#### 1.2 Theme
> **Einstellung:** Dropdown mit *Standard* und allen in Home Assistant installierten Themes (`theme`).
>
> **Zweck:** Gibt dieser Karte ein eigenes Farbschema (Text-, Akzent- und Hintergrundfarben), unabhängig vom Dashboard, z. B. eine dunkle Karte auf hellem Dashboard. *Standard* übernimmt das Theme des Dashboards.

---

### 2. Batterie-Chemie

#### 2.1 Batterietyp
> **Einstellung:** *LiFePO4*, *NMC / NCM (Li-Ni-Mn-Co)*, *Blei (2V-Zelle)* oder *Benutzerdefiniert* (`battery_type`).
>
> **Zweck:** Legt den Spannungsbereich fest, der auf die Balkenhöhe sowie auf Farben und Beschriftung der Legende abgebildet wird (LiFePO4 2,60 – 3,65 V, NMC 3,00 – 4,20 V, Blei 1,80 – 2,45 V pro Zelle). Beim Wechsel des Typs wird außerdem ein passender Wert für [6.2](#62-balancing-ab-zellspannung) vorgeschlagen. *Benutzerdefiniert* schaltet 2.2, 2.3 und das Panel [Benutzerdefinierte Skala](#3-benutzerdefinierte-skala) frei.

#### <a id="22-eigene-min-spannung"></a>2.2 Eigene Min-Spannung ![sichtbar bei 2.1 = Benutzerdefiniert](https://img.shields.io/badge/sichtbar%20bei-2.1%20%3D%20Benutzerdefiniert-orange?style=flat)
> **Einstellung:** Zahl in mV, 1000 – 5000, Standard 2600 (`custom_min_mv`). Nur bei *Benutzerdefiniert*.
>
> **Zweck:** Spannung, bei der ein Zellbalken als leer gilt. Bei eigenen Skalen-Stufen ist es die Unterkante der untersten Stufe und wird automatisch gesenkt, falls sie sonst mit dieser Stufe kollidieren würde.

#### <a id="23-eigene-max-spannung"></a>2.3 Eigene Max-Spannung ![sichtbar bei 2.1 = Benutzerdefiniert](https://img.shields.io/badge/sichtbar%20bei-2.1%20%3D%20Benutzerdefiniert-orange?style=flat)
> **Einstellung:** Zahl in mV, 1000 – 5000, Standard 3650 (`custom_max_mv`). Nur bei *Benutzerdefiniert*.
>
> **Zweck:** Spannung, bei der ein Zellbalken als voll gilt. Sie wird verwendet, wenn die eigene Skala weniger als 2 Stufen hat. So passt du die Standard-Farbskala an eine Chemie an, die nicht in der Liste steht.

---

### <a id="3-benutzerdefinierte-skala"></a>3. Benutzerdefinierte Skala ![sichtbar bei 2.1 = Benutzerdefiniert](https://img.shields.io/badge/sichtbar%20bei-2.1%20%3D%20Benutzerdefiniert-orange?style=flat)

Wird im Editor nur angezeigt, wenn der Batterietyp (2.1) *Benutzerdefiniert* ist.

#### 3.1 Farb-Skala-Preset
> **Einstellung:** Dropdown mit *Kein Preset* und 7 fertigen Skalen: LiFePO4 Standard, Lila / Rosa, Sunset, Neon, Ozean, NMC / NCM, Blei (2V-Zelle).
>
> **Zweck:** Schneller Einstieg für die eigene Skala. Ein Preset ersetzt alle Stufen und setzt die Min-Spannung. Du kannst die Stufen danach anpassen; das Dropdown springt auf *Kein Preset*, sobald sie abweichen.

#### 3.2 Farbverlauf
> **Einstellung:** Schalter an / aus (`scale_gradient`). Standard: aus.
>
> **Zweck:** Aus = harte Farbsegmente wie in der Legende. An = weiche Übergänge zwischen den Farben, in den Zellen und in der Legende. Die Beschriftungen der Legende bleiben an ihrer Position.

#### 3.3 Skalen-Stufe
> **Einstellung:** Je Farbsegment eine Zeile, von oben in der Legende nach unten. Jede Zeile hat das Farbfeld, die **Obergrenze in mV** (`mv`) und den **Anteil in %** (`pct`) des Segments.
>
> **Zweck:** Legt fest, wo die Farben wechseln. Die Spannung ist der Wert an der Oberkante des Segments, der Anteil seine Höhe in der Legende. Tippe auf das Farbfeld oder den Stift, um Farbe und Beschriftung zu öffnen.

#### 3.4 Stufenfarbe
> **Einstellung:** Hex-Farbe (z. B. `#00ee00`) oder die Regler *Farbton*, *Sättigung* und *Helligkeit* (`color`).
>
> **Zweck:** Farbe des Segments in Zellen und Legende. Hex-Feld und Regler bleiben synchron: Du kannst mit einem Hex-Wert starten und mit den Reglern feinjustieren.

#### 3.5 Beschriftung
> **Einstellung:** Optionale Texte *Beschriftung oben* und *Beschriftung unten* (`top`, `bottom`), z. B. `3.65V`.
>
> **Zweck:** Beschriftungen an der Ober- und Unterkante des Segments in der Legende. Üblicherweise werden nur die wichtigen Spannungen beschriftet.

#### 3.6 Verschieben und Löschen
> **Einstellung:** Ziehgriff zum Verschieben einer Stufe, Kreuz zum Löschen.
>
> **Zweck:** Bringt die Stufen in die richtige Reihenfolge oder entfernt nicht benötigte. Nach dem Verschieben wird die Spannung der Stufe zwischen die neuen Nachbarn gesetzt.

#### 3.7 Skalen-Stufe hinzufügen
> **Einstellung:** Schaltfläche *Skalen-Stufe hinzufügen*. Maximal 20 Stufen, mindestens 2 sind für eine eigene Skala nötig.
>
> **Zweck:** Fügt unter der letzten Stufe ein Segment mit 100 mV niedrigerer Spannung hinzu. Praktisch für feinere Skalen mit mehr Farbsegmenten.

#### 3.8 Automatische Korrekturen
> **Einstellung:** Nichts einzustellen.
>
> **Zweck:** Der Editor verhindert ungültige Skalen: Spannungen sinken immer von oben nach unten, die Anteile ergeben immer 100 % (die benachbarte Stufe übernimmt die Differenz) und die unterste Stufe endet bei der eigenen Min-Spannung.

---

### 4. Zellen

#### 4.1 Zelle hinzufügen
> **Einstellung:** Sensor im Feld *Zelle hinzufügen* auswählen.
>
> **Zweck:** Fügt der Karte einen Balken hinzu. Der Name wird aus dem Anzeigenamen der Entität übernommen. Werte in V oder mV werden automatisch erkannt. Ein Tipp auf eine Zelle im Dashboard öffnet die Details des Sensors.

#### 4.2 Entität und Name ändern
> **Einstellung:** Sensor direkt in der Zeile ändern; mit dem Stift den angezeigten Namen bearbeiten.
>
> **Zweck:** Ersetzt einen Sensor oder kürzt den Namen, der oben am Balken steht (z. B. `C1`).

#### 4.3 Verschieben und Löschen
> **Einstellung:** Ziehgriff zum Verschieben einer Zelle, Kreuz zum Löschen.
>
> **Zweck:** Die Reihenfolge in der Liste ist die Reihenfolge der Balken von links nach rechts.

---

### 5. Legenden-Sensoren

#### 5.1 Ladezustand (SOC)
> **Einstellung:** Sensor-Entität (`soc_entity`).
>
> **Zweck:** Zeigt den Ladezustand in Prozent in der Legende. Ein Tipp darauf öffnet die Details des Sensors.

#### 5.2 Leistung (W)
> **Einstellung:** Sensor-Entität (`watt_entity`).
>
> **Zweck:** Steuert das Batterie-Symbol in der Legende: grünes Plus beim Laden, rotes Minus beim Entladen, blaues neutrales Symbol bei 0 W.

#### 5.3 Zellspannungsdifferenz
> **Einstellung:** Sensor-Entität in V oder mV (`cell_diff_sensor`).
>
> **Zweck:** Zeigt die Differenz zwischen der höchsten und der niedrigsten Zelle als `Δ x mV` in der Legende. Sie entscheidet außerdem, wann das Sync-Symbol erscheint (siehe [6.1](#61-differenzschwellwert)).

#### 5.4 Balancing aktiv
> **Einstellung:** Optionale Entität beliebigen Typs (`balance_sensor`).
>
> **Zweck:** Ist ihr Zustand `on`, wird das Sync-Symbol angezeigt. Nutze sie, wenn dein BMS das Balancing direkt meldet. Ohne sie wird das Symbol aus Differenz und Zellspannung abgeleitet ([6.1](#61-differenzschwellwert), [6.2](#62-balancing-ab-zellspannung)).

---

### 6. Balancing und Min. Zelle / Max. Zelle

#### 6.1 Differenzschwellwert
> **Einstellung:** Zahl in mV, Standard 8 (`cell_diff`).
>
> **Zweck:** Das Sync-Symbol erscheint nur, wenn der Unterschied zwischen höchster und niedrigster Zelle mindestens diesen Wert erreicht.

#### 6.2 Balancing ab Zellspannung
> **Einstellung:** Zahl in mV, Standard 3000 (`cell_bal_over`). Beim Wechsel des Batterietyps werden 3000 (LiFePO4 / Benutzerdefiniert), 3500 (NMC) oder 2000 (Blei) vorgeschlagen.
>
> **Zweck:** Die meisten BMS balancieren nur nahe am vollen Zustand. Das Sync-Symbol verlangt deshalb zusätzlich, dass die höchste Zelle diese Spannung erreicht.

#### 6.3 Niedrigste / höchste Zelle automatisch erkennen
> **Einstellung:** Schalter an / aus (`auto_detect_low_high`). Standard: an.
>
> **Zweck:** An = die Karte findet die niedrigste Zelle (roter Ring) und die höchste Zelle (blauer Ring) selbst anhand der Zellwerte. Aus = du gibst eigene Sensoren vor (6.4, 6.5), z. B. die vom BMS gemeldeten Nummern.

#### <a id="64-sensor-für-niedrigste-zelle"></a>6.4 Sensor für niedrigste Zelle ![sichtbar bei 6.3 aus](https://img.shields.io/badge/sichtbar%20bei-6.3%20aus-blue?style=flat)
> **Einstellung:** Sensor-Entität (`pack_cell_low`). Nur sichtbar bei ausgeschalteter Automatik.
>
> **Zweck:** Der Sensorwert ist die Nummer der niedrigsten Zelle (1 = erste Zelle in deiner Liste) und bekommt den roten Ring.

#### <a id="65-sensor-für-höchste-zelle"></a>6.5 Sensor für höchste Zelle ![sichtbar bei 6.3 aus](https://img.shields.io/badge/sichtbar%20bei-6.3%20aus-blue?style=flat)
> **Einstellung:** Sensor-Entität (`pack_cell_high`). Nur sichtbar bei ausgeschalteter Automatik.
>
> **Zweck:** Der Sensorwert ist die Nummer der höchsten Zelle und bekommt den blauen Ring.

---

### 7. Anzeige

#### 7.1 Schriftgröße
> **Einstellung:** Zahl 4 – 16 in Schritten von 0,5, Standard 8 (`font_size`).
>
> **Zweck:** Grundgröße für Namen, Werte und Legendentexte. Alle Texte skalieren mit der Kartenbreite; dieser Wert verschiebt sie größer oder kleiner. Auf kleinen Displays ist er auf 8 begrenzt.

#### 7.2 Deckkraft des Overlays
> **Einstellung:** Zahl 0 – 1, Standard 0,7 (`overlay_opacity`).
>
> **Zweck:** Dunkelt den leeren Teil jedes Balkens oberhalb des Spannungspegels ab. Höhere Werte machen den Füllstand besser lesbar, niedrigere zeigen mehr von den Skalenfarben.

#### 7.3 Zellenabstand
> **Einstellung:** Zahl 0 – 16 px, Standard 4 (`cell_gap`).
>
> **Zweck:** Abstand zwischen den Zellen. Kleinere Abstände lassen mehr Platz für die Balken.

#### 7.4 Kartenrand-Abstand
> **Einstellung:** Zahl 0 – 40 px, Standard 10 (`container_padding`).
>
> **Zweck:** Innenabstand zwischen Kartenrand und Zellen. Auf kleinen Displays ist er auf 6 px begrenzt.

#### 7.5 Abstand zum Titel
> **Einstellung:** Zahl 0 – 60 px, Standard 20 (`top_padding`).
>
> **Zweck:** Abstand zwischen Titel und Zellen. Auf kleinen Displays ist er auf 8 px begrenzt.

#### 7.6 Zelleneinheit
> **Einstellung:** *mV* oder *V* (`cell_unit`). Standard: mV.
>
> **Zweck:** Einheit des Werts unten in jeder Zelle: ganze Millivolt (`3321 mV`) oder Volt mit drei Nachkommastellen (`3.321 V`).

#### 7.7 Legende anzeigen
> **Einstellung:** Schalter an / aus (`show_legend`). Standard: an.
>
> **Zweck:** Die Legende ist die erste Spalte mit Farbskala, Spannungsbeschriftungen und den Statuselementen aus 7.8. Aus = nur die Zellen werden angezeigt.

#### <a id="78-legenden-elemente"></a>7.8 Legenden-Elemente ![sichtbar bei 7.7 an](https://img.shields.io/badge/sichtbar%20bei-7.7%20an-blue?style=flat)
> **Einstellung:** Vier Schalter, nur sichtbar bei eingeschalteter Legende: SOC-Wert (`show_soc_value`), SOC-Symbol (`show_soc_icon`), Zelldifferenz (`show_cell_diff`), Synchronisationssymbol (`show_sync_icon`).
>
> **Zweck:** Wähle, welche Statuselemente in der Legende erscheinen: Ladezustand in Prozent, Batterie-Symbol mit Lade-/Entladerichtung, `Δ mV` und das Sync-Symbol während des Balancings.

#### 7.9 Zusätzliche Sensoren anzeigen
> **Einstellung:** Schalter an / aus (`show_extra_sensors`). Standard: aus.
>
> **Zweck:** Zeigt die Sensoren aus Panel [9](#9-zusätzliche-sensoren) in einer Zeile über den Zellen. Das Hinzufügen eines Sensors in Panel 9 schaltet den Schalter automatisch ein.

#### 7.10 3D-Rahmen
> **Einstellung:** Schalter an / aus (`use_3d`). Standard: aus.
>
> **Zweck:** Metallgehäuse mit Pol oben um jede Zelle. Aus = flacher Rahmen mit dünnem Rand. Der Rahmen wird bei schmalen Karten automatisch dünner.

#### 7.11 Scheiben-Schatten
> **Einstellung:** Schalter an / aus (`show_slices`). Standard: aus.
>
> **Zweck:** Teilt die farbigen Balken in feine Scheiben mit Schatten. Funktioniert mit und ohne 3D-Rahmen.

#### <a id="712-schattenstärke"></a>7.12 Schattenstärke ![sichtbar bei 7.11 an](https://img.shields.io/badge/sichtbar%20bei-7.11%20an-blue?style=flat)
> **Einstellung:** *Dezent*, *Mittel* oder *Stark* (`slice_strength`). Nur sichtbar bei eingeschaltetem Scheiben-Schatten (7.11).
>
> **Zweck:** Intensität des Schattens zwischen den Scheiben. *Dezent* ist kaum sichtbar, *Stark* ergibt einen ausgeprägten Stapel-Look.

---

### 8. Zellen-Umbruch

#### 8.1 Zellen umbrechen aktivieren
> **Einstellung:** Schalter an / aus (`chunk_cells`). Standard: aus.
>
> **Zweck:** Bricht die Zellen in mehrere Zeilen um, wenn die Karte zu schmal ist, damit sie nie gestaucht werden (ideal für Handys und große Akkus). Bei aktivem Umbruch wird die Kartenhöhe aus der Zellenhöhe berechnet und die Layout-Zeilen stehen auf *Auto*. Beim Ausschalten werden wieder 8 Layout-Zeilen gesetzt; die Höhe kommt dann aus dem Dashboard-Layout.

#### <a id="82-umbruch-modus"></a>8.2 Umbruch-Modus ![sichtbar bei 8.1 an](https://img.shields.io/badge/sichtbar%20bei-8.1%20an-blue?style=flat)
> **Einstellung:** *Auto 4 Zellen*, *Auto 8 Zellen* oder *Manuell* (`chunk_mode`). Standard: Auto 8.
>
> **Zweck:** *Auto 4* bricht in Zeilen zu 4, 8, 16 … um, *Auto 8* in Zeilen zu 8, 16 …, je nach Kartenbreite. *Manuell* nutzt den Wert aus 8.5 als Obergrenze.

#### <a id="83-zellenhöhe"></a>8.3 Zellenhöhe ![sichtbar bei 8.1 an](https://img.shields.io/badge/sichtbar%20bei-8.1%20an-blue?style=flat)
> **Einstellung:** Zahl 200 – 800 px, Standard 340 (`cell_height`). Nur sichtbar bei aktivem Umbruch.
>
> **Zweck:** Höhe einer Zellenzeile. Alle Zeilen sind gleich hoch, die Balken schrumpfen also nach dem Umbruch nicht.

#### <a id="84-min-zellenbreite"></a>8.4 Min. Zellenbreite ![sichtbar bei 8.1 an](https://img.shields.io/badge/sichtbar%20bei-8.1%20an-blue?style=flat)
> **Einstellung:** Zahl 40 – 120 px, Standard 50 (`min_cell_width`). Nur sichtbar bei aktivem Umbruch.
>
> **Zweck:** Kleinste erlaubte Breite einer Zelle. Ein höherer Wert lässt die Karte früher umbrechen und hält die Zellen breiter.

#### <a id="85-zellen-pro-zeile"></a>8.5 Zellen pro Zeile ![sichtbar bei 8.1 an + 8.2 = Manuell](https://img.shields.io/badge/sichtbar%20bei-8.1%20an%20%2B%208.2%20%3D%20Manuell-blue?style=flat)
> **Einstellung:** Zahl 2 – 32, Standard 8 (`chunk_size`). Nur sichtbar im Modus *Manuell*.
>
> **Zweck:** Höchstzahl an Zellen pro Zeile. Ist die Karte dafür zu schmal, werden weniger Zellen pro Zeile verwendet.

---

### 9. Zusätzliche Sensoren

#### 9.1 Schriftgröße
> **Einstellung:** Regler 0,7 – 1,5, Standard 1 (`extra_font_scale`).
>
> **Zweck:** Größenfaktor für Texte und Symbole der zusätzlichen Sensoren, unabhängig von der Schriftgröße der Zellen.

#### 9.2 Sensor hinzufügen
> **Einstellung:** Sensor im Feld *Sensor hinzufügen* auswählen.
>
> **Zweck:** Fügt über den Zellen eine Wertzeile hinzu, z. B. Temperatur, Strom oder Zyklenzahl. Die Einheit wird aus der Entität übernommen. Ein Tipp auf einen Wert öffnet die Details des Sensors.

#### 9.3 Name und Symbol
> **Einstellung:** Mit dem Stift öffnen: Freitext *Name* und Symbolauswahl (`name`, `icon`).
>
> **Zweck:** Der Name steht vor dem Wert. Ohne Symbol wird das Standardsymbol der Entität verwendet.

#### 9.4 Verschieben und Löschen
> **Einstellung:** Ziehgriff zum Verschieben eines Sensors, Kreuz zum Löschen.
>
> **Zweck:** Die Reihenfolge in der Liste ist die Reihenfolge von links nach rechts.

---

## Screenshots

<img width="60%" height="auto" alt="Screenshot1" src="https://github.com/user-attachments/assets/5f8281fe-c0eb-457e-928a-3d51ead546c3" />
<img width="60%" height="auto" alt="Screenshot2" src="https://github.com/user-attachments/assets/6fc3ca88-7ca2-476b-aae2-5a5b7ef6833a" />
<img width="60%" height="auto" alt="Screenshot3" src="https://github.com/user-attachments/assets/a020dbda-9a2a-456c-b50e-341ecf2aee2f" />

---

## Lizenz

**Creative Commons – CC BY-NC-SA 4.0**

- Bearbeiten & Verändern erlaubt
- Nur nicht-kommerzielle Nutzung
- Bearbeitungen unter derselben Lizenz weitergeben

[Link zur vollständigen Lizenz](https://creativecommons.org/licenses/by-nc-sa/4.0/)
