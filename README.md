(deutsche Beschreibung weiter unten!)

Battery Cells Card

Version: 0.5.0
Description: A Home Assistant custom card for visualizing battery cells, their voltages, state of charge, and balancing status.
Ideal for LiFePO4 or any other multi-cell battery systems.

Important: The fill level of the bars represents cell voltage, not the percentage state of charge.
The percentage SOC can be shown in the legend if the corresponding SOC sensor is configured.

1. What does the card do?

Depending on configuration, the card displays:

Individual cell voltages

Cell voltage difference (Δ mV)

Charge/discharge power (Watt)

Charge/Discharge icon

Balancing icon

Color scale (legend) based on voltage range

3D cylinder effect for the legend

Automatic responsive scaling

Optional row splitting (chunking) for small screens (e.g., smartphones)

This makes the card suitable for all systems that expose individual cell measurements (DIY-BMS, Daly, Seplos, JK BMS, and others).

License

This custom card is licensed under:

Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)

Sharing & modifying: allowed

Commercial use: not allowed

Derivatives: must be released under the same license

Link to the full license text: (CC BY-NC-SA 4.0).

Features
Cell Visualization

Display of each cell with color-coded voltage

Color scale from Red → Orange → Yellow → Green

Battery Status

Display of overall SOC (State of Charge)

SOC icon indicates charging (+) or discharging (–)

Cell Balancing

Sync icon when balancing is active

Can be triggered by sensor or manually configured

Monitoring of cell voltage difference (Δ mV)

Flexible Layouts

Responsive scaling for screen width and height

Optional chunking: split cells into rows for small screens

Legend (toggleable)

SOC icon and SOC value can be shown or hidden

Δ mV cell difference can be shown or hidden

Balancing status can be shown or hidden

3D frame effect can be enabled or disabled

Adjustable font size, card height, padding, and cell spacing

Sensor Support

Cell voltage difference sensor (cell_diff_sensor)

Lowest & highest cell sensors (pack_cell_low, pack_cell_high)

Individual cell sensors (cells: [...])

Manual Installation

Download battery-cells-card.js

Copy it into your Home Assistant /www folder

Add it as a Lovelace resource:
Settings → Dashboards → Three dots → Resources → Add Resource

Enter the URL:

/local/battery-cells-card.js


Select JavaScript Module

Reload the browser (CTRL + F5)

The card is now available in the dashboard editor

Example Configuration
type: custom:battery-cells-card
title: Main Battery
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
chunk_cells: true
chunk_size: 8
cells:
  - name: Cell 1
    entity: sensor.cell1
  - name: Cell 2
    entity: sensor.cell2
  - name: Cell 3
    entity: sensor.cell3
  # … more cells

Configuration Options in Detail
Option	Type	Default	Description
title	string	"Battery Cells"	Title of the card
card_height	number	380	Card height in pixels
show_legend	boolean	true	Shows the voltage color legend
soc_entity	string	"sensor.status_of_charge"	Sensor for state of charge
watt_entity	string	"sensor.pack_watt"	Sensor for current power
balance_sensor	string/null	null	Sensor for active cell balancing
cell_diff_sensor	string	"sensor.delta_mvolts_between_cells"	Cell voltage difference sensor
cell_diff	number	8	Threshold to show balancing icon
cell_bal_over	number	3000	Minimum cell voltage required for balancing
show_soc_icon	boolean	true	Displays SOC icon
show_soc_value	boolean	true	Displays SOC percentage
show_sync_icon	boolean	true	Displays balancing icon
show_cell_diff	boolean	true	Displays Δ cell difference
use_3d	boolean	true	Enables 3D bar/legend effect
chunk_cells	boolean	false	Splits cells into rows
chunk_size	number	8	Cell count per row when chunking
cells	array	Default 8	Array of cell objects { name, entity }
container_padding	number	10	Padding around the card
cell_gap	number	2	Gap between cells
top_padding	number	20	Top spacing
overlay_opacity	number	0.7	Opacity of cell overlay
font_size	number	7.5	Base font size in px
How It Works

Cell Bars: Height reflects the voltage, color follows voltage range

SOC Icon & Value: Displayed in the legend; icon shows charging/discharging

Cell Difference: Shows the Δ between highest and lowest cell

Balancing: Sync icon appears when balancing is active or conditions are met

Low/High Cells: Optionally highlights min/max cell voltages

Responsive Layout: Automatically adapts size based on device viewport

Chunking: Optional multi-row layout for mobile devices

Developer Notes

The card registers itself as custom:battery-cells-card

Editor component: battery-cells-card-editor (currently YAML-only)

Responsive scaling is handled internally via viewport calculations

________________________________________________________________________________________________________________________________________________________________

Battery Cells Card

Version: 0.5.0
Beschreibung: Eine Home Assistant Custom Card zur Visualisierung von Batteriezellen, deren Spannungen, Ladezustand und Balance-Status. 
Ideal für LiFePO4 oder andere mehrzellige Batteriesysteme.

Achtung: Der Füllstand der ZEllen gibt nicht den prozentualen Füllstand an, sondern die Spannung der Zellen!!!
Der prozentuale Füllstand kann in der Legende abgelesen werden, wenn der entsprechende Sensor zugewiesen/eingetragen wurde.

1. Was macht die Karte?


Sie zeigt je nach Konfiguration folgende Informationen:

- Zellspannungen jeder einzelnen Zelle

- Zell-Differenz (Δ mV)

- Ladung/Entladung (Watt)

- Lade-/Entladesymbol

- Balancing-Symbol

- Farbskala (Legende) entsprechend Zellspannung

- 3D-Zylinder-Effekt für die Legende

- Automatische Größenanpassung

- Optionaler Zeilenumbruch bei kleinen Displays (z. B. Smartphone)

Damit eignet sich die Karte für alle Systeme, die Zellen einzeln messen (DIY-BMS, Daly, Seplos, JKbms usw.).


Lizenz

Diese Custom Card steht unter der Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0).

    Teilen & Anpassen: Erlaubt
    Kommerzielle Nutzung: Nicht erlaubt
    Weitergabe von Anpassungen: Muss unter derselben Lizenz erfolgen

Link zur vollständigen Lizenz

Features
Zellenvisualisierung

Balken für jede Zelle

Farbverläufe von Rot → Orange → Gelb → Grün basierend auf Spannung

Batteriestatus

Anzeige des Gesamt-SOC Prozentwerts

Icon zeigt Laden (+) oder Entladen (−)

Zellen-Balancing

Sync-Icon bei aktivem Balancing

Automatische Aktivierung bei:

Δ mV über Schwellwert

Zellspannung über definiertem Minimum

Flexibles Layout

Responsive Skalierung

Optional: Zellen in mehrere Reihen teilen (Chunking)

Ideal für schmale Mobil-Displays

Legende (optional)

SOC-Icon ein-/ausblendbar

SOC-Wert ein-/ausblendbar

Zellendifferenz Δ mV ein-/ausblendbar

Balancing-Status ein-/ausblendbar

3D-Effekt an-/abschaltbar

Schriftgrößen, Abstände und Höhen frei einstellbar

Sensor-Integration

Zellendifferenzsensor (cell_diff_sensor)

Niedrigste & höchste Zelle (pack_cell_low, pack_cell_high)

Einzelzellen (cells: [...])


Manuelle Installation

    Lade die Datei battery-cells-card.js herunter
    Kopiere sie in den Ordner www deines Home Assistant
    Binde sie in Lovelace ein: Gehe zu:
        Einstellungen ->
        Dashboard ->
        oben rechts auf die 3 Punkte klicken ->
        Ressourcen ->
        Ressource hinzufügen ->
        /local/battery-cells-card.js (Java-Script-Modul) eingeben ->
        Browser neu laden mit Strg + F5
    nun sollte die Karte in der GUI auswählbar und aufzufinden sein!


Beispiel-Konfiguration
type: custom:battery-cells-card
title: Hauptbatterie
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
chunk_cells: true
chunk_size: 8
cells:
  - name: Zelle 1
    entity: sensor.cell1
  - name: Zelle 2
    entity: sensor.cell2
  - name: Zelle 3
    entity: sensor.cell3
  # … weitere Zellen

Konfigurationsoptionen im Detail
Option	Typ	Standard	Beschreibung
title	string	"Battery Cells"	Titel der Karte
card_height	number	380	Höhe der Karte in Pixel
show_legend	boolean	true	Zeigt die Farblegende der Zellspannung
soc_entity	string	"sensor.status_of_charge"	Sensor für den Ladezustand
watt_entity	string	"sensor.pack_watt"	Sensor für aktuelle Leistung
balance_sensor	string/null	null	Sensor für aktives Balancing
cell_diff_sensor	string	"sensor.delta_mvolts_between_cells"	Sensor für Zellenspannungsdifferenz
cell_diff	number	8	Minimale Differenz zur Aktivierung des Balancing-Icons
cell_bal_over	number	3000	Minimale Zellspannung zur Aktivierung des Balancing-Icons
show_soc_icon	boolean	true	Zeigt SOC-Icon
show_soc_value	boolean	true	Zeigt SOC-Wert
show_sync_icon	boolean	true	Zeigt Balancing-Icon
show_cell_diff	boolean	true	Zeigt Zellenspannungsdifferenz
use_3d	boolean	true	Aktiviert 3D-Effekt der Balken
chunk_cells	boolean	false	Teilt Zellen in Reihen auf
chunk_size	number	8	Anzahl Zellen pro Reihe beim Chunking
cells	array	8 Zellen als Default	Array von Zellenobjekten {name, entity}
container_padding	number	10	Padding um die Karte
cell_gap	number	2	Abstand zwischen Zellen
top_padding	number	20	Abstand oben
overlay_opacity	number	0.7	Deckkraft des Overlay bei Zellenanzeige
font_size	number	7.5	Basis-Schriftgröße in px
Funktionsweise

Zellenbalken: Höhe der Balken entspricht der Zellenspannung, gefärbt nach Bereich.

SOC-Icon & Wert: Anzeige in der Legende; Icon zeigt Plus/Minus je nach Wattwert.

Zellendifferenz: Berechnet Differenz zwischen höchster und niedrigster Zelle; optionales Delta-Display.

Balancing: Sync-Icon erscheint, wenn Balancing aktiv ist oder Differenz > cell_diff und Zellspannung > cell_bal_over.

Low/High Zellen: Optionales Highlight von niedrigster und höchster Zelle mit farbigen Rahmen.

Entwicklerhinweise

Die Karte registriert sich automatisch als custom:battery-cells-card.

Editor: battery-cells-card-editor für UI-Konfiguration -> momentan nur mit Yaml-editor!.

Responsive Skalierung wird automatisch anhand Viewport angepasst.
