class BatteryCellsCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    console.info(
      '%c 🔋 Battery Cell Card %c v.0.5.9.8.beta %c ',
      `background: linear-gradient(90deg,#ff0000 0%,#ff0000 2.5%,#ffa500 2.5%,#ffa500 5%,#ffff00 5%,#ffff00 7.5%,#00ee00 7.5%,#00ee00 100%);
       color: #000; font-weight: bold; padding: 6px 12px; border-radius: 4px;`,
      'color: #2e7d32; padding: 4px 8px; border-radius: 4px;',
      'color: #4caf50; font-weight: bold;'
    );
    this._config = {};
    this._hass = null;
    this._vpScale = 1.0;
    this._initialized = false;
    this._lastContentWidth = 0;
    this._elements = {
      haCard: null,
      content: null,
      titleDiv: null,
      rows: [],
      legendWrappers: [],
      socTexts: [],
      diffDivs: [],
      iconSocs: [],
      syncIcons: [],
      cells: []
    };
  }

  static getStubConfig() {
    return {
      title: "Battery Cells",
      card_height: 380,
      container_padding: 10,
      top_padding: 20,
      cell_gap: 2,
      use_3d: true,
      show_legend: true,
      show_soc_icon: true,
      show_soc_value: true,
      show_sync_icon: true,
      show_cell_diff: true,
      overlay_opacity: 0.70,
      font_size: 6,
      soc_entity: "sensor.soc",
      watt_entity: "sensor.pack",
      balance_sensor: null,
      cell_diff_sensor: "sensor.delta_mvolts",
      cell_diff: 8,
      cell_bal_over: 3000,
      cell_unit: "mV",
      auto_detect_low_high: true,
      pack_cell_low: null,
      pack_cell_high: null,
      chunk_cells: false,
      chunk_size: 8,
      cells: Array.from({length: 8}, (_, i) => ({
        name: `Cell ${i+1}`,
        entity: `sensor.cell${i+1}`
      })),
      grid_options: {
          columns: 15,
          rows: "auto",
      }
    };
  }

  static getConfigElement() {
    return document.createElement("battery-cells-card-editor");
  }

  setConfig(config) {
    const cfg = Object.assign({}, config || {});
    cfg.card_height = cfg.card_height ?? 380;
    cfg.background = cfg.background ?? null;
    cfg.container_padding = cfg.container_padding ?? 10;
    cfg.top_padding = cfg.top_padding ?? 20;
    cfg.cell_gap = cfg.cell_gap ?? 2;
    cfg.overlay_opacity = cfg.overlay_opacity ?? 0.70;
    cfg.font_size = cfg.font_size ?? 6;
    cfg.title = cfg.title ?? 'Battery Cells';
    cfg.show_legend = cfg.show_legend ?? true;
    cfg.show_soc_icon = cfg.show_soc_icon ?? true;
    cfg.show_soc_value = cfg.show_soc_value ?? true;
    cfg.show_sync_icon = cfg.show_sync_icon ?? true;
    cfg.show_cell_diff = cfg.show_cell_diff ?? true;
    cfg.use_3d = cfg.use_3d ?? true;
    cfg.chunk_cells = cfg.chunk_cells ?? false;
    cfg.chunk_size = cfg.chunk_size ?? 8;
    cfg.cells = Array.isArray(cfg.cells) ? cfg.cells : BatteryCellsCard.getStubConfig().cells;
    cfg.soc_entity = cfg.soc_entity ?? 'sensor.soc';
    cfg.watt_entity = cfg.watt_entity ?? 'sensor.pack';
    cfg.cell_diff_sensor = cfg.cell_diff_sensor ?? "sensor.delta_mvolts";
    cfg.cell_diff = cfg.cell_diff ?? 8;
    cfg.cell_bal_over = cfg.cell_bal_over ?? 3000;
    cfg.cell_unit = cfg.cell_unit ?? "mV";
    cfg.auto_detect_low_high = cfg.auto_detect_low_high ?? true;
    this._config = cfg;
    if (this._hass) this._renderAll();
  }

  set hass(hass) {
    this._hass = hass;
    if (this._config) this._renderAll();
  }

  _renderAll() {
    if (!this._config || !this._hass) return;
    this._calculateVpScale();
    this._buildDOM();
    this._updateLayoutIfNeeded();
    this._updateContent();
  }

  _calculateVpScale() {
    const vpWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    let vpScale = 1.0;
    if (vpWidth < 900) vpScale = 1.2;
    if (vpWidth < 600) vpScale = 1.3;
    if (vpWidth < 400) vpScale = 1.4;
    this._vpScale = vpScale;
  }

  _buildDOM() {
    if (this._initialized) return;
    const shadow = this.shadowRoot;
    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          height: 100%;
          width: 100%;
        }
        .card {
          height: 100%;
          width: 100%;
          box-sizing: border-box;
          background: ${this._config.background ? this._config.background : 'var(--ha-card-background, var(--card-background-color, white))'};
          border-radius: var(--ha-card-border-radius, 12px);
          box-shadow: var(--ha-card-box-shadow, 0px 2px 4px rgba(0,0,0,0.1));
          overflow: hidden;
          display: flex;
          flex-direction: column;
          padding: ${this._config.container_padding}px;
          
        }
        .title {
          color: var(--primary-text-color);
          font-size: 24px;
          font-weight: 400;
          padding: 20px 0 0 35px;
          margin: 0;
          padding-bottom: ${this._config.top_padding}px;
        }
        .content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
          overflow: hidden;
        }
        .row {
          display: flex;
          gap: ${this._config.cell_gap}px;
          align-items: flex-end;
          width: 100%;
        }
        .cell-wrapper, .legend-wrapper {
          position: relative;
          border-radius: 2px;
          overflow: visible;
          box-sizing: border-box;
          height: 100%;
        }
        .bar {
          width: 100%;
          height: 100%;
          background: linear-gradient(to top,
            #ff0000 0%, #ff0000 5%,
            #ffa500 5%, #ffa500 10%,
            #ffff00 10%, #ffff00 20%,
            #00ee00 20%, #00ee00 80%,
            #ffff00 80%, #ffff00 90%,
            #ffa500 90%, #ffa500 95%,
            #ff0000 95%, #ff0000 100%);
          position: relative;
        }
        .overlay {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,${this._config.overlay_opacity});
          z-index: 2;
        }
        .name {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          font-weight: 700;
          color: #fff;
          text-shadow: 0 0 4px black;
          text-align: center;
          z-index: 3;
          width: 90%;
          pointer-events: none;
          line-height: 1.1;
          font-size: calc(${this._config.font_size * 1.2}px + 0.6vw);
          white-space: normal;
          word-break: break-word;
        }
        .value {
          position: absolute;
          left: 50%;
          bottom: 4px;
          transform: translateX(-50%);
          z-index: 3;
          width: 90%;
          pointer-events: none;
        
          display: flex;
          flex-direction: column;
          align-items: center;
        
          white-space: nowrap; /* verhindert Umbruch der Zahl */
        }
        .cell-value-num {
          white-space: nowrap;
          font-weight: 700;
          color: #fff;
          text-shadow: 0 0 4px black;
          line-height: 1.1;
        
          font-size: calc(${this._config.font_size * 1.5}px + 0.6vw);;
        }
        .cell-value-unit {
          font-size: 0.85em;
          line-height: 1;
          white-space: normal;
          color: #fff;
          text-shadow: 0 0 4px black;
        }
        .name { top: 4px; }
        .value { bottom: 4px; }
        .legend-label {
          position: absolute;
          left: 0; right: 0;
          text-align: center;
          font-weight: 700;
          color: #fff;
          text-shadow: 0 0 3px black;
          pointer-events: none;
          font-size: calc(${this._config.font_size}px * 1.2 + 0.5vw);
        }
        .legend-label-top { top: -4px; }
        .legend-label-bottom { bottom: -4px; }
        .overlay-soc {
          position: absolute;
          top: 49%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-weight: 700;
          color: #fff;
          text-shadow: 0 0 6px black;
          z-index: 2;
          white-space: nowrap;
          font-size: calc(${this._config.font_size}px + 1.2vw);
        }
        .overlay-diff {
          position: absolute;
          top: 57%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-weight: 700;
          color: #fff;
          text-shadow: 0 0 3px black;
          z-index: 2;
          white-space: nowrap;
          font-size: calc(${this._config.font_size * 0.7}px + 0.6vw);
        }
        .overlay-icon-battery {
          position: absolute;
          top: 36%;
          left: 50%;
          transform: translate(-50%, -50%);
          filter: drop-shadow(0 0 6px black);
          z-index: 2;
          --mdc-icon-size: calc(${this._config.font_size * 2.8}px + 1.6vw);
        }
        
        .overlay-icon-sync {
          position: absolute;
          top: 66%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #dfeeff;
          filter: drop-shadow(0 0 16px black);
          z-index: 2;
          display: none;
          --mdc-icon-size: calc(${this._config.font_size * 2.5}px + 1.6vw);
        }
        .border-highlight {
          position: absolute;
          inset: -3px; /* Der farbige Border ragt 3px über den Container hinaus */
          border-radius: 3px; /* Etwas größer als der Wrapper-Radius (2px + 3px) */
          pointer-events: none;
          z-index: 2; /* Höher als alles andere – liegt garantiert oben */
          box-sizing: border-box;
        }
      </style>
        <ha-card class="card">
          <div class="title">${this._config.title}</div>
          <div class="content"></div>
        </ha-card>
    `;
    this._elements.haCard = shadow.querySelector('.card');
    this._elements.titleDiv = shadow.querySelector('.title');
    this._elements.content = shadow.querySelector('.content');
    const borderStyle = this._config.use_3d ?
      `border-top: 3px solid #9b9b9b;
       border-left: 3px solid #7b7b7b;
       border-right: 3px solid #5b5b5b;
       border-bottom: 3px solid #6d6d6d;` :
      `border: 2px solid #000;`;
    const styleEl = document.createElement('style');
    styleEl.textContent = `.cell-wrapper, .legend-wrapper { ${borderStyle} }`;
    shadow.appendChild(styleEl);
    this._initialized = true;
  }

  _updateLayoutIfNeeded() {
    const content = this._elements.content;
    const currentWidth = content.clientWidth;
    if (Math.abs(currentWidth - this._lastContentWidth) < 10) return;
    this._lastContentWidth = currentWidth;

    content.innerHTML = '';
    this._elements.rows = [];
    this._elements.cells = [];
    this._elements.legendWrappers = [];
    this._elements.socTexts = [];
    this._elements.diffDivs = [];
    this._elements.iconSocs = [];
    this._elements.syncIcons = [];

    const chunkActive = this._config.chunk_cells && window.innerWidth < 1080;
    const chunkSize = this._config.chunk_size ?? 8;

    const rowsData = chunkActive
      ? Array.from({ length: Math.ceil(this._config.cells.length / chunkSize) }, (_, i) =>
          this._config.cells.slice(i * chunkSize, (i + 1) * chunkSize))
      : [this._config.cells];

    // Basis-Höhe einer einzelnen Reihe (volle Balkenhöhe)
    const baseRowHeight = this._config.card_height - this._config.top_padding - this._config.container_padding * 2;

    // Wenn Chunking aktiv und mehr als 1 Reihe → Card höher machen
    if (chunkActive && rowsData.length > 1) {
      const additionalRows = rowsData.length - 1;
      const additionalHeight = additionalRows * (baseRowHeight + 8); // +8px Gap pro zusätzliche Reihe
      const newCardHeight = this._config.card_height + additionalHeight;

      this.style.height = `${newCardHeight}px`;
      this._elements.haCard.style.height = `${newCardHeight}px`;
    } else {
      // Normale Höhe
      this.style.height = '100%';
      this._elements.haCard.style.height = '100%';
    }

    rowsData.forEach((chunk, rowIndex) => {
      const row = document.createElement('div');
      row.className = 'row';
      row.style.height = `${baseRowHeight}px`;
      if (rowIndex > 0) row.style.marginTop = '8px';
      content.appendChild(row);
      this._elements.rows.push(row);

      let cellWidth = 0;

      if (this._config.show_legend) {
        const totalItems = chunk.length + 1;
        cellWidth = (content.clientWidth - this._config.cell_gap * (totalItems - 1)) / totalItems;

        const legendWrapper = document.createElement('div');
        legendWrapper.className = 'legend-wrapper';
        legendWrapper.style.width = `${cellWidth}px`;
        legendWrapper.style.height = '100%';

        const legendInner = this._createLegendInner(cellWidth);

        if (this._config.show_soc_value) {
          const socText = document.createElement('div');
          socText.className = 'overlay-soc';
          legendInner.appendChild(socText);
          this._elements.socTexts.push(socText);
        }
        if (this._config.show_cell_diff) {
          const diffDiv = document.createElement('div');
          diffDiv.className = 'overlay-diff';
          legendInner.appendChild(diffDiv);
          this._elements.diffDivs.push(diffDiv);
        }
        if (this._config.show_soc_icon) {
          const iconSoc = document.createElement('ha-icon');
          iconSoc.className = 'overlay-icon-battery';
          legendInner.appendChild(iconSoc);
          this._elements.iconSocs.push(iconSoc);
        }
        if (this._config.show_sync_icon) {
          const syncIcon = document.createElement('ha-icon');
          syncIcon.className = 'overlay-icon-sync';
          syncIcon.setAttribute('icon', 'mdi:sync');
          legendInner.appendChild(syncIcon);
          this._elements.syncIcons.push(syncIcon);
        }

        legendWrapper.appendChild(legendInner);
        row.appendChild(legendWrapper);
        this._elements.legendWrappers.push(legendWrapper);
      } else {
        cellWidth = (content.clientWidth - this._config.cell_gap * (chunk.length - 1)) / chunk.length;
      }

      chunk.forEach((cellCfg, idx) => {
        const cellIndex = rowIndex * chunkSize + idx + 1;
        const cellEl = this._createCellElement(cellCfg, cellWidth);
        cellEl.index = cellIndex;
        row.appendChild(cellEl.cont);
        this._elements.cells.push(cellEl);
      });
    });
  }

  _createLegendInner(width) {
    const legend = document.createElement('div');
    legend.style.width = '100%';
    legend.style.height = '100%';
    legend.style.display = 'flex';
    legend.style.flexDirection = 'column';
    legend.style.position = 'relative';

    const blocks = [
      { color: '#ff0000', pct: 5, labelTop: '3,65V' },
      { color: '#ffa500', pct: 5, labelTop: '3,55V' },
      { color: '#ffff00', pct: 10, labelTop: '3,45V' },
      { color: '#00aa00', pct: 60, labelTop: '3,38V', labelBottom: '3,20V' },
      { color: '#ffff00', pct: 10, labelBottom: '3,00V' },
      { color: '#ffa500', pct: 5, labelBottom: '2,80V' },
      { color: '#ff0000', pct: 5, labelBottom: '2,60V' }
    ];

    blocks.forEach(block => {
      const blockDiv = document.createElement('div');
      blockDiv.style.background = block.color;
      blockDiv.style.flex = `${block.pct} 0 0px`;
      blockDiv.style.position = 'relative';
      blockDiv.style.overflow = 'hidden';

      if (block.labelTop) {
        const topLabel = document.createElement('div');
        topLabel.textContent = block.labelTop;
        topLabel.className = 'legend-label legend-label-top';
        blockDiv.appendChild(topLabel);
      }
      if (block.labelBottom) {
        const bottomLabel = document.createElement('div');
        bottomLabel.textContent = block.labelBottom;
        bottomLabel.className = 'legend-label legend-label-bottom';
        blockDiv.appendChild(bottomLabel);
      }
      legend.appendChild(blockDiv);
    });

    return legend;
  }

  _createCellElement(cfg, width) {
    const cont = document.createElement('div');
    cont.className = 'cell-wrapper';
    cont.style.width = `${width}px`;
    cont.style.height = '100%';
    const bar = document.createElement('div');
    bar.className = 'bar';
    cont.appendChild(bar);
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    bar.appendChild(overlay);
    const nameDiv = document.createElement('div');
    nameDiv.className = 'name';
    nameDiv.textContent = cfg.name ?? '';
    bar.appendChild(nameDiv);
    const valDiv = document.createElement('div');
    valDiv.className = 'value';
    bar.appendChild(valDiv);
    const borderOverlay = document.createElement('div');
    borderOverlay.className = 'border-highlight';
    borderOverlay.style.display = 'none';
    cont.appendChild(borderOverlay);
    return { cont, bar, overlay, nameDiv, valDiv, borderOverlay, entity: cfg.entity };
  }

  _updateContent() {
    const socVal = parseFloat(this._hass.states[this._config.soc_entity]?.state ?? 0);
    const wattVal = parseFloat(this._hass.states[this._config.watt_entity]?.state ?? 0);

    this._elements.socTexts.forEach(el => el.textContent = `${Math.round(socVal)}%`);

    this._elements.diffDivs.forEach(el => {
      let diffVal = parseFloat(this._hass.states[this._config.cell_diff_sensor]?.state ?? 0);
      if (diffVal < 1) diffVal *= 1000;
      diffVal = Math.round(diffVal);
      el.textContent = diffVal ? `Δ ${diffVal} mV` : '';
    });

    this._elements.iconSocs.forEach(el => {
      let icon = 'mdi:battery';
      let color = '#00ccff';
      if (!isNaN(wattVal)) {
        if (wattVal > 0) { icon = 'mdi:battery-plus'; color = '#00ff00'; }
        else if (wattVal < 0) { icon = 'mdi:battery-minus'; color = '#ff0000'; }
      }
      el.setAttribute('icon', icon);
      el.style.color = color;
    });

    const balancing = this._isBalancingActive();
    this._elements.syncIcons.forEach(el => el.style.display = balancing ? 'block' : 'none');

    this._elements.cells.forEach(cell => {
      const raw = this._hass.states[cell.entity]?.state;
      const numeric = Number(raw);
      let valueMv = Number.isFinite(numeric) ? (numeric < 10 ? numeric * 1000 : numeric) : null;
      let display = valueMv === null ? (raw ?? '-') :
        this._config.cell_unit === 'V' ? `${(valueMv / 1000).toFixed(3)} V` : `${Math.round(valueMv)} mV`;

      let fillPercent = 0;
      if (valueMv !== null) {
        if (valueMv <= 2600) fillPercent = 0;
        else if (valueMv <= 2800) fillPercent = ((valueMv - 2600) / 200) * 5;
        else if (valueMv <= 3000) fillPercent = ((valueMv - 2800) / 200) * 5 + 5;
        else if (valueMv <= 3200) fillPercent = ((valueMv - 3000) / 200) * 10 + 10;
        else if (valueMv <= 3380) fillPercent = ((valueMv - 3200) / 180) * 60 + 20;
        else if (valueMv <= 3450) fillPercent = ((valueMv - 3380) / 70) * 10 + 80;
        else if (valueMv <= 3550) fillPercent = ((valueMv - 3450) / 100) * 5 + 90;
        else if (valueMv <= 3650) fillPercent = ((valueMv - 3550) / 100) * 5 + 95;
        else fillPercent = 100;
      }
      fillPercent = Math.max(0, Math.min(100, fillPercent));
      cell.overlay.style.height = `${100 - fillPercent}%`;
      let valueStr, unitStr;
      
      if (valueMv === null) {
        valueStr = raw ?? '-';
        unitStr = '';
      } else if (this._config.cell_unit === 'V') {
        valueStr = (valueMv / 1000).toFixed(3);
        unitStr = 'V';
      } else {
        valueStr = Math.round(valueMv);
        unitStr = 'mV';
      }
      
      cell.valDiv.innerHTML = `
        <span class="cell-value-num">${valueStr}</span>
        <span class="cell-value-unit">${unitStr}</span>
        `;

      let packCellLow = this._config.pack_cell_low ? parseInt(this._hass.states[this._config.pack_cell_low]?.state) : null;
      let packCellHigh = this._config.pack_cell_high ? parseInt(this._hass.states[this._config.pack_cell_high]?.state) : null;

      if (this._config.auto_detect_low_high && (packCellLow === null || packCellHigh === null)) {
        const values = this._config.cells
          .map((c, i) => {
            const num = parseFloat(this._hass.states[c.entity]?.state);
            if (!Number.isFinite(num)) return null;
            const mv = num < 10 ? num * 1000 : num;
            return { index: i + 1, value: mv };
          })
          .filter(Boolean);
        if (values.length) {
          if (packCellLow === null) packCellLow = values.reduce((a, b) => a.value < b.value ? a : b).index;
          if (packCellHigh === null) packCellHigh = values.reduce((a, b) => a.value > b.value ? a : b).index;
        }
      }

      cell.borderOverlay.style.display = 'none';
      cell.borderOverlay.style.border = '';
      if (cell.index === packCellLow) {
        cell.borderOverlay.style.borderTop = "4px solid #ff6666";   // helles, leuchtendes Rot oben
        cell.borderOverlay.style.borderLeft = "4px solid #ff7f7f";  // etwas helleres Rot links
        cell.borderOverlay.style.borderRight = "4px solid #e60000"; // kräftiges, mittleres Rot rechts
        cell.borderOverlay.style.borderBottom = "4px solid #cc1a1a"; // heller/dynamischeres Rot unten
        cell.borderOverlay.style.display = 'block';

      } else if (cell.index === packCellHigh) {
        cell.borderOverlay.style.borderTop = "4px solid #99d1ff";    // sehr helles Blau oben (starker Lichtreflex)
        cell.borderOverlay.style.borderLeft = "4px solid #66b3ff";   // helles Blau links
        cell.borderOverlay.style.borderRight = "4px solid #3385ff";  // mittleres Blau rechts
        cell.borderOverlay.style.borderBottom = "4px solid #0066dd"; // dunkles Blau unten (Tiefe/Schatten)
        cell.borderOverlay.style.display = 'block';

      }
    });
  }

  _isBalancingActive() {
    if (this._config.balance_sensor) {
      const s = this._hass.states[this._config.balance_sensor];
      if (s && String(s.state).toLowerCase() === "on") return true;
    }
    let diff = parseFloat(this._hass.states[this._config.cell_diff_sensor]?.state ?? 0);
    if (diff < 1) diff *= 1000;
    const voltages = this._config.cells.map(c => parseFloat(this._hass.states[c.entity]?.state)).filter(v => Number.isFinite(v));
    if (!voltages.length) return false;
    const maxV = Math.max(...voltages);
    return diff >= this._config.cell_diff && maxV >= this._config.cell_bal_over;
  }

  connectedCallback() {
    this._resizeHandler = this._debounce(() => {
      if (this._initialized && this._config && this._hass) {
        this._renderAll();
      }
    }, 300);
    window.addEventListener('resize', this._resizeHandler);
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this._resizeHandler);
  }

  _debounce(fn, delay) {
    let timer;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(fn, delay);
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
                <h3>Battery Cells Card &ndash; Settings</h3>
                <p>
                    Currently, only the yaml-code-editor can be used!<br>
                    Momentan sind &Auml;nderungen nur &uuml;ber den Yaml-Code-Editor m&ouml;glich!
                </p>
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
