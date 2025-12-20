class BatteryCellsCard extends HTMLElement {
    
    constructor() {
        super();
        console.info(
          '%c 🔋 Battery Cell Card %c v.0.5.2 %c ',
          `background: linear-gradient(90deg,#ff0000 0%,#ff0000 2.5%,#ffa500 2.5%,#ffa500 5%,#ffff00 5%,#ffff00 7.5%,#00ee00 7.5%,#00ee00 100%);
           color: #000; font-weight: bold; padding: 6px 12px; border-radius: 4px;`,
          'color: #2e7d32; padding: 4px 8px; border-radius: 4px;',
          'color: #4caf50; font-weight: bold;'
        );

        this._config = {};
        this._hass = null;
        this._vpScale = 1.0;
    }

    static getConfigElement() {
        return document.createElement("battery-cells-card-editor");
    }

    set hass(hass) {
        this._hass = hass;
        this.render();
    }

    setConfig(config) {
        const cfg = Object.assign({}, config || {});
        cfg.background_color = cfg.background_color ?? "var(--ha-card-background, var(--card-background-color))";
        cfg.card_height = cfg.card_height ?? 380;
        cfg.show_legend = cfg.show_legend ?? true;
        cfg.soc_entity = cfg.soc_entity ?? 'sensor.soc';
        cfg.watt_entity = cfg.watt_entity ?? 'sensor.pack';
        cfg.container_padding = cfg.container_padding ?? 10;
        cfg.cell_gap = cfg.cell_gap ?? 2;
        cfg.top_padding = cfg.top_padding ?? 20;
        cfg.overlay_opacity = cfg.overlay_opacity ?? 0.70;
        cfg.font_size = cfg.font_size ?? 7.5;
        cfg.title = cfg.title ?? 'Battery Cells';
        cfg.balance_sensor = cfg.balance_sensor ?? null;
        cfg.cell_diff_sensor = cfg.cell_diff_sensor ?? "sensor.delta_mvolts";
        cfg.cell_diff = cfg.cell_diff ?? 8;
        cfg.cell_bal_over = cfg.cell_bal_over ?? 3000;
        cfg.cell_unit = cfg.cell_unit ?? "V";
        cfg.show_soc_icon = cfg.show_soc_icon ?? true;
        cfg.show_soc_value = cfg.show_soc_value ?? true;
        cfg.show_sync_icon = cfg.show_sync_icon ?? true;
        cfg.show_cell_diff = cfg.show_cell_diff ?? true;
        cfg.pack_cell_low = cfg.pack_cell_low ?? null;
        cfg.pack_cell_high = cfg.pack_cell_high ?? null;
        cfg.use_3d = cfg.use_3d ?? true;
        cfg.chunk_cells = cfg.chunk_cells ?? false;
        cfg.chunk_size = cfg.chunk_size ?? 8;
        cfg.cells = Array.isArray(cfg.cells) ? cfg.cells : this.constructor.getStubConfig().cells;
        this._config = cfg;
    }

    _isBalancingActive() {
        const cfg = this._config;
        const hass = this._hass;

        if (cfg.balance_sensor) {
            const s = hass.states[cfg.balance_sensor];
            if (s && String(s.state).toLowerCase() === "on") return true;
        }

        let diffSensorVal = null;
        if (cfg.cell_diff_sensor) {
            const s = hass.states[cfg.cell_diff_sensor];
            if (s) {
                let num = parseFloat(s.state);
                if (!isNaN(num)) {
                    if (num < 1) num *= 1000;
                    diffSensorVal = num;
                }
            }
        }

        const voltages = cfg.cells
            .map(c => parseFloat(this._hass.states[c.entity]?.state))
            .filter(v => !isNaN(v));

        if (!voltages.length) return false;

        const maxCell = Math.max(...voltages);
        const minCell = Math.min(...voltages);
        const useDiff = diffSensorVal !== null ? diffSensorVal : maxCell - minCell;

        return (useDiff >= cfg.cell_diff && maxCell >= cfg.cell_bal_over);
    }

    render() {
        if (!this._config || !this._hass) return;
        const vpWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        const vpHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        let vpScale = 0.5;
        if (vpWidth < 1200) vpScale = 1.1;
        if (vpWidth < 900)  vpScale = 1.2;
        if (vpWidth < 600)  vpScale = 1.35;
        if (vpWidth < 400)  vpScale = 1.4;
        if (vpHeight > vpWidth) vpScale *= 1.45;
        if (vpWidth < 800 && vpWidth > vpHeight) {
            vpScale *= 1.25;
        }
        this._vpScale = vpScale;

        const cardHeight = Number(this._config.card_height);
        const height = cardHeight - Number(this._config.top_padding);
        const showLegend = this._config.show_legend;
        const socVal = parseFloat(this._hass.states[this._config.soc_entity]?.state ?? 0);
        const wattVal = parseFloat(this._hass.states[this._config.watt_entity]?.state);
        const packCellLow = this._config.pack_cell_low ? parseInt(this._hass.states[this._config.pack_cell_low]?.state) : null;
        const packCellHigh = this._config.pack_cell_high ? parseInt(this._hass.states[this._config.pack_cell_high]?.state) : null;
        const gradientStr = `linear-gradient(to top, 
            #ff0000 0%, #ff0000 5%,
            #ffa500 5%, #ffa500 10%,
            #ffff00 10%, #ffff00 20%,
            #00ee00 20%, #00ee00 80%,
            #ffff00 80%, #ffff00 90%,
            #ffa500 90%, #ffa500 95%,
            #ff0000 95%, #ff0000 100%)`;
        this.innerHTML = '';
        const root = document.createElement('div');
        root.style.display = 'flex';
        root.style.flexDirection = 'column';
        root.style.alignItems = 'center';
        root.style.justifyContent = 'flex-start';
        root.style.minHeight = `${cardHeight}px`;
        root.style.padding = `${this._config.container_padding}px`;
        root.style.gap = '8px';
        root.style.background = this._config.background_color;
        root.style.borderRadius = "var(--ha-card-border-radius)";
        root.style.overflow = 'hidden';
        root.style.boxSizing = 'border-box';
    
        const titleDiv = document.createElement('div');
        titleDiv.textContent = this._config.title;
        titleDiv.style.color = 'var(--primary-text-color, #fff)';
        titleDiv.style.fontFamily = 'var(--ha-font-headline, inherit)';
        titleDiv.style.fontSize = 'var(--paper-font-headline_-_font-size, 24px)';
        titleDiv.style.fontWeight = 'var(--paper-font-headline_-_font-weight, 400)';
        titleDiv.style.display = 'flex';
        titleDiv.style.width = '100%';
        titleDiv.style.justifyContent = 'flex-start';
        titleDiv.style.padding = '20px 0 0 25px';
        titleDiv.style.borderRadius = '4px';
        root.appendChild(titleDiv);
    
        const chunkSize = this._config.chunk_size ?? 8;
        const chunkCellsActive = this._config.chunk_cells && document.documentElement.clientWidth < 900;
        const cellRows = chunkCellsActive
            ? Array.from({ length: Math.ceil(this._config.cells.length / chunkSize) }, (_, i) =>
                this._config.cells.slice(i * chunkSize, i * chunkSize + chunkSize))
            : [this._config.cells]; // sonst alle in einer Reihe
        cellRows.forEach((chunk, rowIndex) => {
            const rowDiv = document.createElement('div');
            rowDiv.style.display = 'flex';
            rowDiv.style.alignItems = 'flex-end';
            rowDiv.style.height = `${height}px`;
            rowDiv.style.gap = `${this._config.cell_gap}px`;
            rowDiv.style.width = '100%';
            rowDiv.style.flexWrap = 'nowrap';
            const itemCount = showLegend ? chunk.length + 1 : chunk.length;
            const containerWidth = rowDiv.getBoundingClientRect().width || (window.innerWidth - this._config.container_padding*2);
            const cellWidth = (containerWidth - this._config.cell_gap * (itemCount - 1)) / itemCount;
            if (showLegend) {
                const legendWrapper = document.createElement('div');
                legendWrapper.style.width = `${cellWidth}px`;
                legendWrapper.style.height = `${height}px`;
                legendWrapper.style.boxSizing = 'border-box';
                legendWrapper.style.display = 'flex';
                legendWrapper.style.flexDirection = 'column';
                legendWrapper.style.justifyContent = 'flex-end';
                legendWrapper.style.alignItems = 'center';
                legendWrapper.style.position = 'relative';
                legendWrapper.style.borderRadius = '2px';
                legendWrapper.style.overflow = 'hidden';
        
                if (this._config.use_3d) {
                    legendWrapper.style.borderTop = "3px solid #9b9b9b";
                    legendWrapper.style.borderLeft = "3px solid #7b7b7b";
                    legendWrapper.style.borderRight = "3px solid #5b5b5b";
                    legendWrapper.style.borderBottom = "3px solid #6d6d6d";
                } else {
                    legendWrapper.style.border = "2px solid #000";
                }
        
                const legendInner = this._createLegend(cellWidth, height, socVal, wattVal);
                legendWrapper.appendChild(legendInner);
                rowDiv.appendChild(legendWrapper);
            }
        
            chunk.forEach((cellCfg, index) => {
                const cellIndex = rowIndex * chunkSize + index + 1; // hier chunkSize statt cellsPerRow
                const cell = this._createCell(cellCfg, cellWidth, height, gradientStr);
        
                if (cellIndex === packCellLow || cellIndex === packCellHigh) {
                    const borderOverlay = document.createElement('div');
                    borderOverlay.style.position = 'absolute';
                    borderOverlay.style.top = '0';
                    borderOverlay.style.left = '0';
                    borderOverlay.style.width = '100%';
                    borderOverlay.style.height = '100%';
                    borderOverlay.style.borderRadius = 'inherit';
                    borderOverlay.style.boxSizing = 'border-box';
                    borderOverlay.style.pointerEvents = 'none';
                    borderOverlay.style.zIndex = '3';
        
                    if (cellIndex === packCellLow) {
                        borderOverlay.style.borderTop = "3px solid #ff4d4d";
                        borderOverlay.style.borderLeft = "3px solid #ff6666";
                        borderOverlay.style.borderRight = "3px solid #cc0000";
                        borderOverlay.style.borderBottom = "3px solid #990000";
                    }
                    if (cellIndex === packCellHigh) {
                        borderOverlay.style.borderTop = "3px solid #99ccff";
                        borderOverlay.style.borderLeft = "3px solid #66b3ff";
                        borderOverlay.style.borderRight = "3px solid #3385ff";
                        borderOverlay.style.borderBottom = "3px solid #0040cc";
                    }
        
                    cell.appendChild(borderOverlay);
                }
        
                rowDiv.appendChild(cell);
            });
        
            root.appendChild(rowDiv);
        });
        this.appendChild(root);
    }
    
    _createLegend(width, height, socVal, wattVal) {
        const legend = document.createElement('div');
        legend.style.width = `${width}px`;
        legend.style.height = `${height}px`;
        legend.style.display = 'flex';
        legend.style.flexDirection = 'column';
        legend.style.position = 'relative';
        legend.style.borderRadius = '2px';
        legend.style.boxSizing = 'border-box';
        legend.style.overflow = 'hidden';
        legend.style.padding = '0';
        legend.style.margin = '0';
    
        const blocks = [
            { color: '#ff0000', pct: 5, labelTop: '3,65V' },
            { color: '#ffa500', pct: 5, labelTop: '3,55V' },
            { color: '#ffff00', pct: 10, labelTop: '3,45V' },
            { color: '#00aa00', pct: 70, labelTop: '3,38V', labelBottom: '3,20V' },
            { color: '#ffff00', pct: 10, labelBottom: '3,00V' },
            { color: '#ffa500', pct: 5, labelBottom: '2,80V' },
            { color: '#ff0000', pct: 5, labelBottom: '2,60V' }
        ];
    
        const fontScale = ((width / 70) ** 0.75) * this._vpScale;
        const totalPct = blocks.reduce((s, b) => s + (b.pct || 0), 0) || 100;
    
        blocks.forEach(block => {
            const blockDiv = document.createElement('div');
            blockDiv.style.background = block.color;
            blockDiv.style.width = '100%';
            blockDiv.style.boxSizing = 'border-box';
            blockDiv.style.flex = `${(block.pct || 0)} 0 0px`;
            blockDiv.style.position = 'relative';
            blockDiv.style.display = 'flex';
            blockDiv.style.flexDirection = 'column';
            blockDiv.style.justifyContent = 'space-between';
            blockDiv.style.alignItems = 'center';
            blockDiv.style.paddingTop = '2px';
            blockDiv.style.paddingBottom = '2px';
            blockDiv.style.overflow = 'hidden';
            blockDiv.style.zIndex = '2';
    
            if (block.labelTop) {
                const topLabel = document.createElement('div');
                topLabel.textContent = block.labelTop;
                topLabel.style.alignSelf = 'center';
                topLabel.style.fontSize = `${Math.max(8, Math.round(this._config.font_size * fontScale))}px`;
                topLabel.style.fontWeight = '700';
                topLabel.style.color = '#fff';
                topLabel.style.textShadow = '0 0 3px black';
                topLabel.style.whiteSpace = 'nowrap';
                topLabel.style.lineHeight = '1';
                topLabel.style.marginTop = '0px';
                topLabel.style.marginBottom = 'auto';
                blockDiv.appendChild(topLabel);
            } else {
                const spacer = document.createElement('div');
                spacer.style.height = '0px';
                spacer.style.marginBottom = 'auto';
                blockDiv.appendChild(spacer);
            }
    
            if (block.labelBottom) {
                const bottomLabel = document.createElement('div');
                bottomLabel.textContent = block.labelBottom;
                bottomLabel.style.alignSelf = 'center';
                bottomLabel.style.fontSize = `${Math.max(8, Math.round(this._config.font_size * fontScale))}px`;
                bottomLabel.style.fontWeight = '700';
                bottomLabel.style.color = '#fff';
                bottomLabel.style.textShadow = '0 0 3px black';
                bottomLabel.style.whiteSpace = 'nowrap';
                bottomLabel.style.lineHeight = '1';
                bottomLabel.style.marginBottom = '0px';
                blockDiv.appendChild(bottomLabel);
            } else {
                const spacer2 = document.createElement('div');
                spacer2.style.height = '0px';
                spacer2.style.marginTop = 'auto';
                blockDiv.appendChild(spacer2);
            }
    
            legend.appendChild(blockDiv);
        });
    
        if (this._config.show_soc_icon) {
            let icon = 'mdi:battery';
            let color = '#00ccff';
            if (!isNaN(wattVal)) {
                if (wattVal > 0) { icon = 'mdi:battery-plus'; color = '#00ff00'; }
                else if (wattVal < 0) { icon = 'mdi:battery-minus'; color = '#ff0000'; }
            }
            const iconSoc = document.createElement('ha-icon');
            iconSoc.setAttribute('icon', icon);
            iconSoc.style.position = 'absolute';
            iconSoc.style.top = '36%';
            iconSoc.style.left = '50%';
            const iconScale = Math.min(height / 200, width / 1.0 / 80) * this._vpScale;
            iconSoc.style.transform = `translate(-50%, -50%) scale(${iconScale})`;
            iconSoc.style.transformOrigin = 'center center';
            iconSoc.style.color = color;
            iconSoc.style.filter = 'drop-shadow(0 0 6px black)';
            iconSoc.style.zIndex = '3';
            legend.appendChild(iconSoc);
        }
    
        if (this._config.show_soc_value) {
            const socText = document.createElement('div');
            socText.textContent = `${socVal}%`;
            socText.style.position = 'absolute';
            socText.style.top = '49%';
            socText.style.left = '50%';
            socText.style.transform = 'translate(-50%, -50%)';
            socText.style.fontWeight = '700';
            socText.style.fontSize = `${Math.max(8, Math.round(this._config.font_size * fontScale * 1.5))}px`;
            socText.style.color = '#fff';
            socText.style.textShadow = '0 0 3px black';
            socText.style.zIndex = '3';
            legend.appendChild(socText);
        }
    
        if (this._config.show_cell_diff) {
            const diff = this._hass.states[this._config.cell_diff_sensor];
            let diffVal = diff ? parseFloat(diff.state) : null;
            if (!isNaN(diffVal)) {
                if (diffVal < 1) diffVal = diffVal * 1000;
                diffVal = Math.round(diffVal);
    
                const diffDiv = document.createElement('div');
                diffDiv.textContent = `Δ ${diffVal} mV`;
                diffDiv.style.position = 'absolute';
                diffDiv.style.top = '57%';
                diffDiv.style.left = '50%';
                diffDiv.style.fontFamily = 'Arial, Helvetica, sans-serif';
                diffDiv.style.fontFeatureSettings = '"liga" 0';
                diffDiv.style.letterSpacing = '-0.08em';
                diffDiv.style.transform = 'translate(-50%, -50%)';
                diffDiv.style.fontSize = `${Math.max(8, Math.round(this._config.font_size * fontScale * 0.9))}px`;
                diffDiv.style.fontWeight = '700';
                diffDiv.style.color = '#fff';
                diffDiv.style.textShadow = '0 0 3px black';
                diffDiv.style.whiteSpace = 'nowrap';
                diffDiv.style.zIndex = '3';
                legend.appendChild(diffDiv);
            }
        }
    
        if (this._config.show_sync_icon && this._isBalancingActive()) {
            const syncIcon = document.createElement('ha-icon');
            syncIcon.setAttribute('icon', 'mdi:sync');
            syncIcon.style.position = 'absolute';
            syncIcon.style.top = '66%';
            syncIcon.style.left = '50%';
            const iconScale = Math.min(height / 200, width / 1.0 / 80) * this._vpScale;
            syncIcon.style.transform = `translate(-50%, -50%) scale(${iconScale})`;
            syncIcon.style.color = '#dfeeff';
            syncIcon.style.filter = 'drop-shadow(0 0 16px black)';
            syncIcon.style.zIndex = '3';
            legend.appendChild(syncIcon);
        }
    
        return legend;
    }

_createCell(cfg, width, height, gradientStr) {
    const raw = this._hass.states[cfg.entity]?.state;
    const numeric = Number(raw);
    const isNum = Number.isFinite(numeric);

    let valueMv = null;

    if (isNum) {
        valueMv = numeric < 10 ? numeric * 1000 : numeric;
    }
 
    let display;
    if (!Number.isFinite(valueMv)) {
        display = raw ?? '-';
    } else if (this._config.cell_unit === 'V') {
        display = `${(valueMv / 1000).toFixed(3)} V`;
    } else {
        display = `${Math.round(valueMv)} mV`;
    }

    let fillPercent = 0;
    if (valueMv != null) {
        if (valueMv <= 2800)      fillPercent = ((valueMv - 2600) / 200) * 5;
        else if (valueMv <= 3000) fillPercent = ((valueMv - 2800) / 200) * 5 + 5;
        else if (valueMv <= 3200) fillPercent = ((valueMv - 3000) / 200) * 10 + 10;
        else if (valueMv <= 3380) fillPercent = ((valueMv - 3200) / 180) * 60 + 20;
        else if (valueMv <= 3450) fillPercent = ((valueMv - 3380) / 70) * 10 + 80;
        else if (valueMv <= 3550) fillPercent = ((valueMv - 3450) / 100) * 5 + 90;
        else                      fillPercent = ((valueMv - 3550) / 100) * 5 + 95;
    }

    fillPercent = Math.max(0, Math.min(100, fillPercent));

        const cont = document.createElement('div');
        cont.style.width = `${width}px`;
        cont.style.position = 'relative';
        cont.style.display = 'flex';
        cont.style.flexDirection = 'column';
        cont.style.alignItems = 'center';
        cont.style.overflow = 'visible';
        cont.style.boxSizing = 'border-box';

        const bar = document.createElement('div');
        bar.style.width = '100%';
        bar.style.height = `${height}px`;
        bar.style.position = 'relative';
        bar.style.background = gradientStr;
        bar.style.borderRadius = '2px';
        bar.style.boxSizing = 'border-box';
        bar.style.zIndex = '1';

        if (this._config.use_3d) {
            bar.style.borderTop = "3px solid #9b9b9b";
            bar.style.borderLeft = "3px solid #7b7b7b";
            bar.style.borderRight = "3px solid #5b5b5b";
            bar.style.borderBottom = "3px solid #6d6d6d";
        } else {
            bar.style.border = "2px solid #000";
        }

        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.width = '100%';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.height = `${100 - fillPercent}%`;
        overlay.style.background = `rgba(0,0,0,${this._config.overlay_opacity})`;
        overlay.style.zIndex = '2';
        bar.appendChild(overlay);

        const fontScale = ((width / 70) ** 0.80) * this._vpScale;
        const nameDiv = document.createElement('div');
        nameDiv.textContent = cfg.name ?? '';
        nameDiv.style.position = 'absolute';
        nameDiv.style.top = '2px';
        nameDiv.style.left = '50%';
        nameDiv.style.transform = 'translateX(-50%)';
        nameDiv.style.fontSize = `${this._config.font_size * fontScale}px`;
        nameDiv.style.fontWeight = '700';
        nameDiv.style.color = '#fff';
        nameDiv.style.textShadow = '0 0 4px black';
        nameDiv.style.textAlign = 'center';
        nameDiv.style.zIndex = '3';
        bar.appendChild(nameDiv);

        const valDiv = document.createElement('div');
        valDiv.textContent = display;
        valDiv.style.position = 'absolute';
        valDiv.style.bottom = '2px';
        valDiv.style.left = '50%';
        valDiv.style.transform = 'translateX(-50%)';
        valDiv.style.fontSize = `${this._config.font_size * fontScale}px`;
        valDiv.style.fontWeight = '700';
        valDiv.style.color = '#fff';
        valDiv.style.lineHeight = '1.1';
        valDiv.style.textShadow = '0 0 4px black';
        valDiv.style.textAlign = 'center';
        valDiv.style.zIndex = '3';
        bar.appendChild(valDiv);

        cont.appendChild(bar);
        return cont;
    }

    static getStubConfig() {
        return {
            title: "Battery Cells",
            card_height: 380,
            cell_gap: 2,
            use_3d: true,
            show_legend: true,
            show_soc_icon: true,
            show_soc_value: true,
            show_sync_icon: true,
            show_cell_diff: true,
            overlay_opacity: 0.70,
            font_size: 7.5,
            soc_entity: "sensor.status_of_charge",
            watt_entity: "sensor.pack_watt",
            balance_sensor: null,
            cell_diff_sensor: "sensor.delta_mvolts",
            cell_diff: 8,
            cell_bal_over: 3000,
            cell_unit: "V",
            pack_cell_low: "sensor.pack_cell_low",
            pack_cell_high: "sensor.pack_cell_high",
            chunk_cells: false,
            chunk_size: 8,
            cells: Array.from({length: 8}, (_, i) => ({
                name: `Cell ${i+1}`,
                entity: `sensor.cell${i+1}`
            })),
            grid_options: {
                columns: 15,
                rows: 8,
            }
        };
    }
}

customElements.define('battery-cells-card', BatteryCellsCard);

class BatteryCellsCardEditor extends HTMLElement {
    constructor() {
        super();
        this._config = {};
    }

    setConfig(config) {
        this._config = config;
        this.render();
    }

    render() {
        this.innerHTML = `
            <div style="padding:16px; font-family: Arial, Helvetica, sans-serif;">
                <h3>Battery Cells Card – Settings</h3>
                <p>Currently, only the yaml-code-editor can be used!<br>
                   Momentan sind Änderungen nur über den Yaml-Code-Editor möglich!</p>
            </div>
        `;
    }

    static getConfigElement() {
        return document.createElement("battery-cells-card-editor");
    }

    static get defaultConfig() {
        return {};
    }
}

customElements.define("battery-cells-card-editor", BatteryCellsCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
    type: "battery-cells-card",
    name: "Battery Cells Card",
    preview: true,
    description: "Cell-Monitoring - BMS Visualisation."
});
