# battery-cell-card for Home Assistant
HomeAssistant - Battery cell visualisation

**english**

# Battery Cells Card

This is a **Custom Card** for Home Assistant, designed to display individual battery cell information.

## Features
- Displays Battery-Cell with sensor values

## License
This Custom Card is licensed under the **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)**.

- **Share & Adapt:** Allowed  
- **Commercial use:** Not allowed  
- **Distribution of adaptations:** Must be under the same license  

[Link to the full license](LICENSE)

## Installation (manual)
1. Download the file `battery-cells-card.js`  
2. Copy it into the `www` folder of your Home Assistant  
3. Add it to Lovelace:  
   - Go to **Settings** ->
   - **Dashboard** -> 
   - Click the 3 dots at the top right ->
   - **Resources** -> **Add resource** -> 
   - Enter `/local/battery-cells-card.js` (JavaScript Module) -> 
   - Reload the browser with **Ctrl + F5**  
4. The card should now be selectable and visible in the GUI.




**german**

# Battery Cells Card

Dies ist eine **Custom Card** für Home Assistant.

## Funktionen
- Visualisiert Batteriezellen mit Sensorwerten in HomeAssistant

## Lizenz
Diese Custom Card steht unter der **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)**.

- **Teilen & Anpassen:** Erlaubt  
- **Kommerzielle Nutzung:** Nicht erlaubt  
- **Weitergabe von Anpassungen:** Muss unter derselben Lizenz erfolgen  

[Link zur vollständigen Lizenz](LICENSE)

## Installation (manuell)
1. Lade die Datei `battery-cells-card.js` herunter  
2. Kopiere sie in den Ordner `www` deines Home Assistant  
3. Binde sie in Lovelace ein:
   Gehe zu:
   - Einstellungen ->
   - Dashboard ->
   - oben rechts auf die 3 Punkte klicken ->
   - Ressourcen ->
   - Ressource hinzufügen ->
   - /local/battery-cells-card.js (Java-Script-Modul) eingeben ->
   - Browser neu laden mit Strg + F5
5. nun sollte die Karte in der GUI auswählbar und aufzufinden sein!

```yaml-Editor
type: custom:battery-cells-card
title: Batteriespeicher Zellen
card_height: 380
bar_width: 48
cell_gap: 4
use_3d: true
show_legend: true
show_soc_icon: true
show_soc_value: true
show_sync_icon: true
show_cell_diff: true
overlay_opacity: 0.7
min: 2.6
max: 3.65
font_size: 14
soc_entity: sensor.status_of_charge
watt_entity: sensor.pack_watt
balance_sensor: null
cell_diff_sensor: sensor.delta_mvolts_between_cells
cell_diff: 8
cell_bal_over: 3000
pack_cell_low: sensor.pack_cell_low
pack_cell_high: sensor.pack_cell_high
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
  columns: 16
  rows: auto
