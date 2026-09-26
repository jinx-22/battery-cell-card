/**
 * Battery Cells Card v0.7.0
 * Home Assistant custom Lovelace card
 */
class BatteryCellsCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._hass = null;
    this._initialized = false;
    this._lastWidth = 0;
    this._layoutKey = '';
    this._resizeObserver = null;
    this._els = {
      card: null, title: null, content: null, extraRow: null,
      cells: [], socTexts: [], diffDivs: [], iconSocs: [], syncIcons: [],
      extraItems: []
    };
    console.info(
      '%c 🔋 Battery Cell Card %c v0.7.0 ',
      'background:linear-gradient(90deg,#ff0000 0%,#ff0000 2.5%,#ffa500 2.5%,#ffa500 5%,#ffff00 5%,#ffff00 7.5%,#00ee00 7.5%,#00ee00 100%);color:#000;font-weight:bold;padding:6px 12px;border-radius:4px;',
      'color:#2e7d32;padding:4px 8px;'
    );
  }

  static getStubConfig() {
    return {
      title: 'Battery Cells',
      theme: '',
      container_padding: 10,
      top_padding: 20,
      cell_gap: 2,
      use_3d: true,
      show_legend: true,
      show_soc_icon: true,
      show_soc_value: true,
      show_sync_icon: true,
      show_cell_diff: true,
      show_extra_sensors: false,
      extra_sensors: [],
      overlay_opacity: 0.7,
      font_size: 6,
      soc_entity: 'sensor.soc',
      watt_entity: 'sensor.pack',
      balance_sensor: null,
      cell_diff_sensor: 'sensor.delta_mvolts',
      cell_diff: 8,
      cell_bal_over: 3000,
      cell_unit: 'mV',
      auto_detect_low_high: true,
      pack_cell_low: null,
      pack_cell_high: null,
      chunk_cells: false,
      chunk_size: 8,
      cells: Array.from({ length: 8 }, (_, i) => ({
        name: `Cell ${i + 1}`,
        entity: `sensor.cell${i + 1}`
      })),
      grid_options: { columns: 12, rows: 8 }
    };
  }

  static getConfigElement() {
    return document.createElement('battery-cells-card-editor');
  }

  getGridOptions() {
    const c = this._config || {};
    const go = c.grid_options || {};
    const rows =
      go.rows === 'auto'
        ? 8
        : (typeof go.rows === 'number' ? go.rows : 8);

    return {
      columns: go.columns ?? 12,
      rows: go.rows ?? 8,
      min_columns: 10,
      min_rows: 5
    };
  }

  getCardSize() {
    const c = this._config || {};
    const go = c.grid_options || {};
  
    const configuredRows =
      go.rows === 'auto'
        ? 8
        : (typeof go.rows === 'number' ? go.rows : 8);
  
    let base = configuredRows;
  
    if (c.chunk_cells) {
      const size = c.chunk_size || 8;
      const n = Math.max(
        1,
        Math.ceil(
          (c.cells || []).length / size
        )
      );
  
      base = Math.max(
        configuredRows,
        n * 3
      );
    }
  
    if (
      c.show_extra_sensors &&
      (c.extra_sensors || []).length
    ) {
      base += 1;
    }
  
    return base;
  }
  
  setConfig(config) {
    const d = BatteryCellsCard.getStubConfig();
    const c = { ...d, ...config };
    delete c.background;
    delete c.card_height;

    c.cells = Array.isArray(config?.cells) && config.cells.length ? config.cells : d.cells;
    c.extra_sensors = Array.isArray(config?.extra_sensors)
      ? config.extra_sensors.map((s) => ({
          name: s.name || '',
          entity: s.entity || '',
          icon: s.icon || 'mdi:gauge'
        }))
      : [];

    c.grid_options = {
      columns: config?.grid_options?.columns ?? d.grid_options.columns,
      rows: config?.grid_options?.rows ?? d.grid_options.rows
    };

    ['container_padding', 'top_padding', 'cell_gap', 'overlay_opacity', 'font_size', 'cell_diff', 'cell_bal_over', 'chunk_size']
      .forEach((k) => { if (c[k] == null) c[k] = d[k]; });
    ['use_3d', 'show_legend', 'show_soc_icon', 'show_soc_value', 'show_sync_icon', 'show_cell_diff',
      'auto_detect_low_high', 'chunk_cells', 'show_extra_sensors']
      .forEach((k) => { if (c[k] == null) c[k] = d[k]; });

    if (!c.show_legend) {
      c.show_soc_value = false;
      c.show_soc_icon = false;
      c.show_cell_diff = false;
      c.show_sync_icon = false;
    }

    const key = JSON.stringify({
      cells: c.cells.map((x) => `${x.entity}|${x.name || ''}`),
      extra: (c.extra_sensors || []).map((x) => `${x.entity}|${x.name}|${x.icon}`),
      showExtra: c.show_extra_sensors,
      chunk: c.chunk_cells, size: c.chunk_size, legend: c.show_legend,
      pad: c.container_padding, top: c.top_padding, gap: c.cell_gap,
      fs: c.font_size, op: c.overlay_opacity, d3: c.use_3d, title: c.title, theme: c.theme,
      go: c.grid_options,
      si: c.show_soc_icon, sv: c.show_soc_value, sy: c.show_sync_icon, sd: c.show_cell_diff
    });

    const layoutChanged = key !== this._layoutKey;
    this._config = c;
    this._layoutKey = key;
    if (this._hass) {
      if (layoutChanged || !this._initialized) this._buildLayout(true);
      this._updateContent();
    }
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._config) return;
    if (!this._initialized) this._buildLayout(true);
    this._updateContent();
  }

  _moreInfo(entityId) {
    if (!entityId) return;
    const ev = new Event('hass-more-info', { bubbles: true, composed: true });
    ev.detail = { entityId };
    this.dispatchEvent(ev);
  }

  _applyTheme(cardEl) {
    const theme = this._config.theme;
    if (!theme || theme === 'default' || theme === '') {
      cardEl.removeAttribute('theme');
      return;
    }
    cardEl.setAttribute('theme', theme);
  }

  _isCompactPreview() {
    const w = this.clientWidth || this.offsetWidth || 0;
    const h = this.clientHeight || this.offsetHeight || 0;
    if (w > 0 && w < 420) return true;
    if (h > 0 && h < 260) return true;
    return false;
  }

  _buildLayout(force = false) {
    const c = this._config;
    const shadow = this.shadowRoot;

    if (!this._initialized) {
      shadow.innerHTML = `
        <style>
          :host {
            display: block; height: 100%; width: 100%; box-sizing: border-box;
            min-height: 280px;
          }
          .card {
            height: 100%; width: 100%; box-sizing: border-box;
            border-radius: var(--ha-card-border-radius, 12px);
            box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0,0,0,.1));
            overflow: hidden; display: flex; flex-direction: column;
            padding: var(--bcc-pad, 10px);
          }
          .title {
            color: var(--primary-text-color);
            font-size: var(--bcc-title-size, 24px); font-weight: 400;
            padding: 12px 0 0 16px; margin: 0;
            padding-bottom: var(--bcc-top, 20px); flex-shrink: 0;
          }
          .extra-row {
            display: flex; flex-wrap: wrap; gap: 8px 16px;
            align-items: center; justify-content: flex-start;
            padding: 0 8px 10px 12px;
            flex-shrink: 0;
          }
          .extra-row[hidden] { display: none !important; }
          .extra-item {
            display: inline-flex; align-items: center; gap: 6px;
            cursor: pointer; color: var(--primary-text-color);
            font-size: calc(var(--bcc-fs, 6) * 1.4px + 0.55vw);
            font-weight: 500; line-height: 1.2;
            padding: 2px 4px; border-radius: 4px;
          }
          .extra-item:hover { background: rgba(127,127,127,0.12); }
          .extra-item ha-icon {
            --mdc-icon-size: calc(var(--bcc-fs, 6) * 2.2px + 0.9vw);
            color: var(--primary-color, var(--primary-text-color));
          }
          .extra-name {
            color: var(--secondary-text-color);
            font-weight: 400;
            margin-right: 2px;
          }
          .extra-value {
            color: var(--primary-text-color);
            font-weight: 600;
            font-variant-numeric: tabular-nums;
          }
          .extra-unit {
            color: var(--secondary-text-color);
            font-weight: 400;
            font-size: 0.9em;
            margin-left: 2px;
          }
          .content {
            flex: 1; display: flex; flex-direction: column; gap: 8px;
            overflow: hidden; width: 100%; min-height: 0;
          }
          .row {
            display: flex; gap: var(--bcc-gap, 2px); align-items: flex-end;
            width: 100%; box-sizing: border-box; min-height: 0;
          }
          .cell-wrapper, .legend-wrapper {
            position: relative; border-radius: 2px; overflow: visible;
            box-sizing: border-box; height: 100%; flex: 1 1 0; min-width: 0;
          }
          .cell-wrapper { cursor: pointer; }
          .bar {
            width: 100%; height: 100%; position: relative;
            background: linear-gradient(to top,
              #ff0000 0%, #ff0000 5%, #ffa500 5%, #ffa500 10%,
              #ffff00 10%, #ffff00 20%, #00ee00 20%, #00ee00 80%,
              #ffff00 80%, #ffff00 90%, #ffa500 90%, #ffa500 95%,
              #ff0000 95%, #ff0000 100%);
          }
          .overlay {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0, var(--bcc-op, .7)); z-index: 2; pointer-events: none;
          }
          .name, .value {
            position: absolute; left: 50%; transform: translateX(-50%);
            z-index: 3; width: 90%; pointer-events: none; text-align: center;
            color: #fff; text-shadow: 0 0 4px #000; font-weight: 700; line-height: 1.1;
          }
          .name {
            top: 4px; white-space: normal; word-break: break-word;
            font-size: calc(var(--bcc-fs, 6) * 1.2px + .6vw);
          }
          .value {
            bottom: 4px; display: flex; flex-direction: column; align-items: center; white-space: nowrap;
          }
          .cell-value-num { font-size: calc(var(--bcc-fs, 6) * 1.5px + .6vw); }
          .cell-value-unit { font-size: .85em; line-height: 1; }
          .legend-inner {
            width: 100%; height: 100%; display: flex; flex-direction: column; position: relative;
          }
          .legend-block { position: relative; overflow: hidden; pointer-events: none; }
          .legend-label {
            position: absolute; left: 0; right: 0; text-align: center;
            font-weight: 700; color: #fff; text-shadow: 0 0 3px #000; pointer-events: none;
            font-size: calc(var(--bcc-fs, 6) * 1.2px + .5vw);
          }
          .legend-label-top { top: -4px; }
          .legend-label-bottom { bottom: -4px; }
          .overlay-soc {
            position: absolute; top: 49%; left: 50%; transform: translate(-50%,-50%);
            font-weight: 700; color: #fff; text-shadow: 0 0 6px #000; z-index: 4;
            white-space: nowrap; cursor: pointer;
            font-size: calc(var(--bcc-fs, 6) * 1px + 1.2vw);
          }
          .overlay-diff {
            position: absolute; top: 57%; left: 50%; transform: translate(-50%,-50%);
            font-weight: 700; color: #fff; text-shadow: 0 0 3px #000; z-index: 4;
            white-space: nowrap; cursor: pointer;
            font-size: calc(var(--bcc-fs, 6) * .7px + .6vw);
          }
          .overlay-icon-battery {
            position: absolute; top: 36%; left: 50%; transform: translate(-50%,-50%);
            filter: drop-shadow(0 0 6px #000); z-index: 4; cursor: pointer;
            --mdc-icon-size: calc(var(--bcc-fs, 6) * 2.8px + 1.6vw);
          }
          .overlay-icon-sync {
            position: absolute; top: 66%; left: 50%; transform: translate(-50%,-50%);
            color: #dfeeff; filter: drop-shadow(0 0 16px #000); z-index: 4;
            display: none; cursor: pointer;
            --mdc-icon-size: calc(var(--bcc-fs, 6) * 2.5px + 1.6vw);
          }
          .border-highlight {
            position: absolute; inset: -3px; border-radius: 3px;
            pointer-events: none; z-index: 2; box-sizing: border-box; display: none;
          }
          .d3 .cell-wrapper, .d3 .legend-wrapper {
            border-top: 3px solid #9b9b9b; border-left: 3px solid #7b7b7b;
            border-right: 3px solid #5b5b5b; border-bottom: 3px solid #6d6d6d;
          }
          .flat .cell-wrapper, .flat .legend-wrapper { border: 2px solid #000; }
        </style>
        <ha-card class="card">
          <div class="title"></div>
          <div class="extra-row" hidden></div>
          <div class="content"></div>
        </ha-card>
      `;
      this._els.card = shadow.querySelector('.card');
      this._els.title = shadow.querySelector('.title');
      this._els.extraRow = shadow.querySelector('.extra-row');
      this._els.content = shadow.querySelector('.content');
      this._initialized = true;
    }

    let contentW = this._els.content.clientWidth;
    if (!contentW || contentW < 10) contentW = this.clientWidth || 300;
    const widthChanged = Math.abs(contentW - this._lastWidth) >= 8;
    if (!force && this._els.cells.length === c.cells.length && !widthChanged) {
      this._buildExtraRow();
      return;
    }
    this._lastWidth = contentW;

    const compact = this._isCompactPreview();
    const fs = compact ? Math.min(Number(c.font_size) || 6, 6) : c.font_size;
    const titleSize = compact ? '14px' : '24px';
    const topPad = compact ? Math.min(c.top_padding, 8) : c.top_padding;
    const contPad = compact ? Math.min(c.container_padding, 6) : c.container_padding;

    const root = this._els.card;
    root.style.setProperty('--bcc-pad', `${contPad}px`);
    root.style.setProperty('--bcc-top', `${topPad}px`);
    root.style.setProperty('--bcc-gap', `${c.cell_gap}px`);
    root.style.setProperty('--bcc-fs', fs);
    root.style.setProperty('--bcc-op', c.overlay_opacity);
    root.style.setProperty('--bcc-title-size', titleSize);
    root.classList.toggle('d3', !!c.use_3d);
    root.classList.toggle('flat', !c.use_3d);
    this._els.title.textContent = c.title || '';
    this._applyTheme(root);
    this.style.minHeight = compact ? '300px' : '280px';

    this._buildExtraRow();

    const content = this._els.content;
    content.innerHTML = '';
    this._els.cells = [];
    this._els.socTexts = [];
    this._els.diffDivs = [];
    this._els.iconSocs = [];
    this._els.syncIcons = [];

    const chunkSize = c.chunk_size || 8;
    const chunkActive = this._shouldChunk(c, contentW, chunkSize);
    const rowsData = chunkActive
      ? Array.from({ length: Math.ceil(c.cells.length / chunkSize) }, (_, i) =>
          c.cells.slice(i * chunkSize, (i + 1) * chunkSize))
      : [c.cells];

    const gridRows = c.grid_options?.rows;
    const useIntrinsicHeight =
      chunkActive && (gridRows === 'auto' || gridRows == null || gridRows === '');

    const BASE_ROW_PX = compact ? 200 : 300;
    const extraH = (c.show_extra_sensors && (c.extra_sensors || []).length) ? 36 : 0;
    const titleSpace = (compact ? 36 : 56) + topPad + extraH;
    const pad = contPad * 2;

    if (useIntrinsicHeight) {
      const bodyH = rowsData.length * BASE_ROW_PX + (rowsData.length - 1) * 8;
      const totalH = bodyH + titleSpace + pad + 16;
      this.style.height = `${totalH}px`;
      this.style.minHeight = `${Math.max(totalH, compact ? 300 : 280)}px`;
      this._els.card.style.height = '100%';
    } else {
      this.style.height = '100%';
      this.style.minHeight = compact ? '300px' : '280px';
      this._els.card.style.height = '100%';
    }

    let cellIndex = 0;
    rowsData.forEach((chunk, rowIndex) => {
      const row = document.createElement('div');
      row.className = 'row';
      if (chunkActive && useIntrinsicHeight) {
        row.style.flex = '0 0 auto';
        row.style.height = `${BASE_ROW_PX}px`;
      } else {
        row.style.flex = '1 1 0';
        row.style.minHeight = compact ? '120px' : '80px';
      }
      if (rowIndex > 0) row.style.marginTop = '8px';
      content.appendChild(row);
      if (c.show_legend) row.appendChild(this._createLegend());
      chunk.forEach((cfg) => {
        cellIndex += 1;
        const cell = this._createCell(cfg, cellIndex);
        row.appendChild(cell.cont);
        this._els.cells.push(cell);
      });
    });
  }

  _buildExtraRow() {
    const c = this._config;
    const row = this._els.extraRow;
    if (!row) return;
    row.innerHTML = '';
    this._els.extraItems = [];

    const list = c.show_extra_sensors ? (c.extra_sensors || []) : [];
    if (!list.length) {
      row.hidden = true;
      return;
    }
    row.hidden = false;

    list.forEach((cfg) => {
      const item = document.createElement('div');
      item.className = 'extra-item';
      item.title = cfg.name || cfg.entity || '';
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        this._moreInfo(cfg.entity);
      });

      const icon = document.createElement('ha-icon');
      icon.setAttribute('icon', cfg.icon || 'mdi:gauge');
      item.appendChild(icon);

      if (cfg.name) {
        const nameEl = document.createElement('span');
        nameEl.className = 'extra-name';
        nameEl.textContent = cfg.name + ':';
        item.appendChild(nameEl);
      }

      const valEl = document.createElement('span');
      valEl.className = 'extra-value';
      valEl.textContent = '—';
      item.appendChild(valEl);

      const unitEl = document.createElement('span');
      unitEl.className = 'extra-unit';
      item.appendChild(unitEl);

      row.appendChild(item);
      this._els.extraItems.push({
        entity: cfg.entity,
        cfgIcon: cfg.icon || '',
        valEl,
        unitEl,
        iconEl: icon
      });
    });
  }

  _shouldChunk(c, contentWidth, chunkSize) {
    if (!c.chunk_cells) return false;
    const minCellW = Math.max(36, (c.font_size || 6) * 5.5);
    const nFull = c.cells.length + (c.show_legend ? 1 : 0);
    const gapFull = c.cell_gap * Math.max(0, nFull - 1);
    const cellWFull = (contentWidth - gapFull) / Math.max(1, nFull);
    if (window.innerWidth < 1200) return true;
    if (cellWFull < minCellW) return true;
    return false;
  }

  _createLegend() {
    const c = this._config;
    const wrapper = document.createElement('div');
    wrapper.className = 'legend-wrapper';
    const inner = document.createElement('div');
    inner.className = 'legend-inner';
    wrapper.appendChild(inner);

    const blocks = [
      { color: '#ff0000', pct: 5, labelTop: '3.65V' },
      { color: '#ffa500', pct: 5, labelTop: '3.55V' },
      { color: '#ffff00', pct: 10, labelTop: '3.45V' },
      { color: '#00aa00', pct: 60, labelTop: '3.38V', labelBottom: '3.20V' },
      { color: '#ffff00', pct: 10, labelBottom: '3.00V' },
      { color: '#ffa500', pct: 5, labelBottom: '2.80V' },
      { color: '#ff0000', pct: 5, labelBottom: '2.60V' }
    ];
    blocks.forEach((block) => {
      const div = document.createElement('div');
      div.className = 'legend-block';
      div.style.background = block.color;
      div.style.flex = `${block.pct} 0 0px`;
      if (block.labelTop) {
        const lab = document.createElement('div');
        lab.className = 'legend-label legend-label-top';
        lab.textContent = block.labelTop;
        div.appendChild(lab);
      }
      if (block.labelBottom) {
        const lab = document.createElement('div');
        lab.className = 'legend-label legend-label-bottom';
        lab.textContent = block.labelBottom;
        div.appendChild(lab);
      }
      inner.appendChild(div);
    });

    const bindMoreInfo = (el, entityId) => {
      if (!el || !entityId) return;
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        this._moreInfo(entityId);
      });
    };

    if (c.show_soc_value) {
      const soc = document.createElement('div');
      soc.className = 'overlay-soc';
      inner.appendChild(soc);
      this._els.socTexts.push(soc);
      bindMoreInfo(soc, c.soc_entity);
    }
    if (c.show_cell_diff) {
      const diff = document.createElement('div');
      diff.className = 'overlay-diff';
      inner.appendChild(diff);
      this._els.diffDivs.push(diff);
      bindMoreInfo(diff, c.cell_diff_sensor);
    }
    if (c.show_soc_icon) {
      const icon = document.createElement('ha-icon');
      icon.className = 'overlay-icon-battery';
      icon.setAttribute('icon', 'mdi:battery');
      inner.appendChild(icon);
      this._els.iconSocs.push(icon);
      bindMoreInfo(icon, c.soc_entity);
    }
    if (c.show_sync_icon) {
      const sync = document.createElement('ha-icon');
      sync.className = 'overlay-icon-sync';
      sync.setAttribute('icon', 'mdi:sync');
      inner.appendChild(sync);
      this._els.syncIcons.push(sync);
      bindMoreInfo(sync, c.cell_diff_sensor);
    }
    return wrapper;
  }

  _createCell(cfg, index) {
    const cont = document.createElement('div');
    cont.className = 'cell-wrapper';
    cont.style.height = '100%';
    cont.title = cfg.name || cfg.entity || '';
    cont.addEventListener('click', (e) => {
      e.stopPropagation();
      this._moreInfo(cfg.entity);
    });
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
    const numSpan = document.createElement('span');
    numSpan.className = 'cell-value-num';
    const unitSpan = document.createElement('span');
    unitSpan.className = 'cell-value-unit';
    valDiv.append(numSpan, unitSpan);
    bar.appendChild(valDiv);
    const border = document.createElement('div');
    border.className = 'border-highlight';
    cont.appendChild(border);
    return { cont, bar, overlay, nameDiv, numSpan, unitSpan, border, entity: cfg.entity, index };
  }

  _formatExtraState(entityId) {
    const st = this._hass?.states?.[entityId];
    if (!st) return { value: '—', unit: '', icon: 'mdi:gauge' };
    const unit = st.attributes?.unit_of_measurement || '';
    const icon = st.attributes?.icon || 'mdi:gauge';
    const raw = st.state;
    if (raw == null || raw === 'unavailable' || raw === 'unknown') {
      return { value: '—', unit: '', icon };
    }
    const n = Number(raw);
    if (Number.isFinite(n)) {
      const abs = Math.abs(n);
      let value;
      if (abs >= 100) value = String(Math.round(n));
      else if (abs >= 10) value = n.toFixed(1);
      else value = n.toFixed(2);
      value = value.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
      return { value, unit, icon };
    }
    return { value: String(raw), unit, icon };
  }

  _updateContent() {
    if (!this._hass || !this._config || !this._initialized) return;
    const c = this._config;
    const states = this._hass.states;

    // Extra sensors row
    this._els.extraItems.forEach((item) => {
      const { value, unit, icon } = this._formatExtraState(item.entity);
      item.valEl.textContent = value;
      item.unitEl.textContent = unit ? ` ${unit}` : '';
      if (item.iconEl) {
        const ic = item.cfgIcon || icon || 'mdi:gauge';
        item.iconEl.setAttribute('icon', ic);
      }
    });

    const socVal = parseFloat(states[c.soc_entity]?.state) || 0;
    this._els.socTexts.forEach((el) => { el.textContent = `${Math.round(socVal)}%`; });

    let diffVal = parseFloat(states[c.cell_diff_sensor]?.state) || 0;
    if (diffVal < 1) diffVal *= 1000;
    diffVal = Math.round(diffVal);
    const diffStr = diffVal ? `Δ ${diffVal} mV` : '';
    this._els.diffDivs.forEach((el) => { el.textContent = diffStr; });

    const wattVal = parseFloat(states[c.watt_entity]?.state);
    let icon = 'mdi:battery';
    let color = '#00ccff';
    if (!Number.isNaN(wattVal)) {
      if (wattVal > 0) { icon = 'mdi:battery-plus'; color = '#00ff00'; }
      else if (wattVal < 0) { icon = 'mdi:battery-minus'; color = '#ff0000'; }
    }
    this._els.iconSocs.forEach((el) => {
      el.setAttribute('icon', icon);
      el.style.color = color;
    });

    let lowIdx = c.pack_cell_low ? parseInt(states[c.pack_cell_low]?.state, 10) : null;
    let highIdx = c.pack_cell_high ? parseInt(states[c.pack_cell_high]?.state, 10) : null;
    if (!Number.isFinite(lowIdx)) lowIdx = null;
    if (!Number.isFinite(highIdx)) highIdx = null;

    let maxMv = 0, minV = Infinity, maxV = -Infinity, minI = null, maxI = null;

    this._els.cells.forEach((cell) => {
      const raw = states[cell.entity]?.state;
      const mv = this._toMv(raw);
      let valueStr, unitStr;
      if (mv == null) {
        valueStr = raw ?? '-';
        unitStr = '';
      } else if (c.cell_unit === 'V') {
        valueStr = (mv / 1000).toFixed(3);
        unitStr = 'V';
      } else {
        valueStr = String(Math.round(mv));
        unitStr = 'mV';
      }
      cell.numSpan.textContent = valueStr;
      cell.unitSpan.textContent = unitStr;
      cell.overlay.style.height = `${100 - this._fillPercent(mv)}%`;
      if (mv != null) {
        if (mv > maxMv) maxMv = mv;
        if (mv < minV) { minV = mv; minI = cell.index; }
        if (mv > maxV) { maxV = mv; maxI = cell.index; }
      }
    });

    if (c.auto_detect_low_high) {
      if (lowIdx == null) lowIdx = minI;
      if (highIdx == null) highIdx = maxI;
    }

    this._els.cells.forEach((cell) => {
      cell.border.style.display = 'none';
      cell.border.style.border = '';
      if (cell.index === lowIdx) {
        cell.border.style.borderTop = '4px solid #ff6666';
        cell.border.style.borderLeft = '4px solid #ff7f7f';
        cell.border.style.borderRight = '4px solid #e60000';
        cell.border.style.borderBottom = '4px solid #cc1a1a';
        cell.border.style.display = 'block';
      } else if (cell.index === highIdx) {
        cell.border.style.borderTop = '4px solid #99d1ff';
        cell.border.style.borderLeft = '4px solid #66b3ff';
        cell.border.style.borderRight = '4px solid #3385ff';
        cell.border.style.borderBottom = '4px solid #0066dd';
        cell.border.style.display = 'block';
      }
    });

    let balancing = false;
    if (c.balance_sensor) {
      const s = states[c.balance_sensor];
      if (s && String(s.state).toLowerCase() === 'on') balancing = true;
    }
    if (!balancing) balancing = diffVal >= c.cell_diff && maxMv >= c.cell_bal_over;
    this._els.syncIcons.forEach((el) => {
      el.style.display = balancing ? 'block' : 'none';
    });
  }

  _toMv(raw) {
    const n = Number(raw);
    if (!Number.isFinite(n)) return null;
    return n < 10 ? n * 1000 : n;
  }

  _fillPercent(mv) {
    if (mv == null) return 0;
    if (mv <= 2600) return 0;
    if (mv <= 2800) return ((mv - 2600) / 200) * 5;
    if (mv <= 3000) return ((mv - 2800) / 200) * 5 + 5;
    if (mv <= 3200) return ((mv - 3000) / 200) * 10 + 10;
    if (mv <= 3380) return ((mv - 3200) / 180) * 60 + 20;
    if (mv <= 3450) return ((mv - 3380) / 70) * 10 + 80;
    if (mv <= 3550) return ((mv - 3450) / 100) * 5 + 90;
    if (mv <= 3650) return ((mv - 3550) / 100) * 5 + 95;
    return 100;
  }

  connectedCallback() {
    this._onResize = this._debounce(() => {
      if (this._initialized && this._config && this._hass) {
        this._lastWidth = 0;
        this._buildLayout(true);
        this._updateContent();
      }
    }, 250);
    if (typeof ResizeObserver !== 'undefined') {
      this._resizeObserver = new ResizeObserver(() => this._onResize());
      this._resizeObserver.observe(this);
    } else {
      window.addEventListener('resize', this._onResize);
    }
  }

  disconnectedCallback() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
    if (this._onResize) window.removeEventListener('resize', this._onResize);
  }

  _debounce(fn, ms) {
    let t;
    return () => { clearTimeout(t); t = setTimeout(fn, ms); };
  }
}

customElements.define('battery-cells-card', BatteryCellsCard);


class BatteryCellsCardEditor extends HTMLElement {
  constructor() {
    super();

    this._config = {};
    this._hass = null;
    this._built = false;
    this._localConfig = '';
  }

  set hass(hass) {
    this._hass = hass;

    this.querySelectorAll('ha-form').forEach((el) => {
      el.hass = hass;
    });
  }

  setConfig(config) {
    const initial =
      !this._built &&
      !Object.keys(this._config).length;

    const next = initial
      ? {
          ...BatteryCellsCard.getStubConfig(),
          ...this._defined(config)
        }
      : {
          ...this._config,
          ...this._defined(config)
        };

    if (Array.isArray(config?.cells)) {
      next.cells = config.cells;
    }

    if (Array.isArray(config?.extra_sensors)) {
      next.extra_sensors = config.extra_sensors;
    }

    const normalized =
      this._normalize(next);

    const json =
      JSON.stringify(normalized);

    const local =
      json === this._localConfig;

    const listsChanged =
      !this._sameLists(
        this._config,
        normalized
      );

    this._config =
      normalized;

    if (!this._built) {
      this._build();
      return;
    }

    if (!local && listsChanged) {
      this._buildLists();
    }

    if (!local) {
      this._syncForms();
    }
  }

  _defined(config) {
    if (!config || typeof config !== 'object') {
      return {};
    }

    return Object.fromEntries(
      Object.entries(config).filter(
        ([, value]) =>
          value !== undefined
      )
    );
  }

  _normalize(config) {
    config.cells = Array.isArray(config.cells)
      ? config.cells.map((cell) => ({
          name: cell?.name || '',
          entity: cell?.entity || ''
        }))
      : [];

    config.extra_sensors =
      Array.isArray(config.extra_sensors)
        ? config.extra_sensors.map(
            (sensor) => ({
              name: sensor?.name || '',
              entity: sensor?.entity || '',
              icon: sensor?.icon || ''
            })
          )
        : [];

    config.grid_options = {
      columns:
        config.grid_options?.columns ?? 12,

      rows:
        config.grid_options?.rows ?? 8
    };

    return config;
  }

  _sameLists(a, b) {
    return (
      JSON.stringify(
        a?.cells || []
      ) ===
        JSON.stringify(
          b?.cells || []
        ) &&
      JSON.stringify(
        a?.extra_sensors || []
      ) ===
        JSON.stringify(
          b?.extra_sensors || []
        )
    );
  }

  _form(schema, data, changed) {
    const form =
      document.createElement('ha-form');

    form.hass =
      this._hass;

    form.schema =
      schema;

    form.data =
      data;

    form.computeLabel =
      (schemaEntry) =>
        schemaEntry.label ??
        schemaEntry.name ??
        '';

    form.addEventListener(
      'value-changed',
      (event) => {
        event.stopPropagation();

        if (event.detail?.value) {
          changed(
            event.detail.value
          );
        }
      }
    );

    return form;
  }

  _panel(header, expanded = false) {
    const panel =
      document.createElement(
        'ha-expansion-panel'
      );

    panel.header =
      header;

    panel.outlined =
      true;

    panel.expanded =
      expanded;

    return panel;
  }

  _build() {
    this.replaceChildren();

    const style =
      document.createElement('style');

    style.textContent = `
      :host {
        display: block;
      }

      .editor {
        display: flex;
        flex-direction: column;
        gap: var(--ha-space-4, 8px);
      }

      ha-form {
        display: block;
      }

      .list {
        display: flex;
        flex-direction: column;
        gap: var(--ha-space-2, 4px);
      }

      .row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto 40px auto;
        align-items: center;
        gap: var(--ha-space-1, 4px);
      }

      .entity {
        min-width: 0;
      }

      .handle {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: grab;
        color: var(--secondary-text-color);
        touch-action: none;
      }

      .handle:active {
        cursor: grabbing;
      }

      .handle ha-svg-icon {
        width: 24px;
        height: 24px;
      }

      .detail {
        grid-column: 1 / -1;
      }

      .detail[hidden] {
        display: none;
      }
    `;

    this.append(style);

    this._root =
      document.createElement('div');

    this._root.className =
      'editor';

    this.append(
      this._root
    );

    this._topForm =
      this._form(
        this._topSchema(),
        this._config,
        (value) =>
          this._commit(
            value,
            [
              'title',
              'theme'
            ]
          )
      );

    this._root.append(
      this._topForm
    );

    this._cellsPanel =
      this._panel(
        'Cells',
        true
      );

    this._cellsPanel.append(
      this._createSortable(
        'cells'
      ),

      this._createAddForm(
        'Add Cell',
        (entity) => {
          if (!entity) return;

          this._replaceList(
            'cells',
            [
              ...this._config.cells,

              {
                entity,

                name:
                  this._entityName(
                    entity,
                    `Cell ${
                      this._config
                        .cells
                        .length + 1
                    }`
                  )
              }
            ]
          );
        }
      )
    );

    this._root.append(
      this._cellsPanel
    );

    this._sensorsPanel =
      this._panel(
        'Legend Sensors'
      );

    this._sensorsForm =
      this._form(
        this._sensorsSchema(),
        this._config,
        (value) =>
          this._commit(
            value,
            [
              'soc_entity',
              'watt_entity',
              'cell_diff_sensor',
              'balance_sensor'
            ]
          )
      );

    this._sensorsPanel.append(
      this._sensorsForm
    );

    this._root.append(
      this._sensorsPanel
    );

    this._balancePanel =
      this._panel(
        'Balancing & Min Cell/ Max Cell'
      );

    this._balanceForm =
      this._form(
        this._balanceSchema(),
        this._config,
        (value) =>
          this._commit(
            value,
            [
              'cell_diff',
              'cell_bal_over',
              'auto_detect_low_high',
              'pack_cell_low',
              'pack_cell_high'
            ]
          )
      );

    this._balancePanel.append(
      this._balanceForm
    );

    this._root.append(
      this._balancePanel
    );

    this._displayPanel =
      this._panel(
        'Display'
      );

    this._displayForm =
      this._form(
        this._displaySchema(),
        this._config,
        (value) =>
          this._commit(
            value,
            [
              'show_legend',
              'show_soc_value',
              'show_soc_icon',
              'show_cell_diff',
              'show_sync_icon',
              'show_extra_sensors',
              'use_3d',
              'cell_unit',
              'font_size',
              'cell_gap',
              'container_padding',
              'top_padding',
              'overlay_opacity',
              'chunk_cells',
              'chunk_size'
            ]
          )
      );

    this._displayPanel.append(
      this._displayForm
    );

    this._root.append(
      this._displayPanel
    );

    this._extraPanel =
      this._panel(
        'Additional Sensors'
      );

    this._extraPanel.append(
      this._createSortable(
        'extra_sensors'
      ),

      this._createAddForm(
        'Add Sensor',
        (entity) => {
          if (!entity) return;

          this._commit({
            show_extra_sensors:
              true
          }, [
            'show_extra_sensors'
          ]);

          this._replaceList(
            'extra_sensors',
            [
              ...this._config
                .extra_sensors,

              {
                entity,

                name:
                  this._entityName(
                    entity,
                    `Sensor ${
                      this._config
                        .extra_sensors
                        .length + 1
                    }`
                  ),

                icon: ''
              }
            ]
          );
        }
      )
    );

    this._root.append(
      this._extraPanel
    );

    this._built =
      true;

    this._buildLists();

    this._localConfig =
      JSON.stringify(
        this._config
      );
  }

  _createSortable(kind) {
    const sortable =
      document.createElement(
        'ha-sortable'
      );

    sortable.setAttribute(
      'handle-selector',
      '.handle'
    );

    sortable.setAttribute(
      'draggable-selector',
      '.row'
    );

    sortable.addEventListener(
      'item-moved',
      (event) => {
        const oldIndex =
          event.detail?.oldIndex;

        const newIndex =
          event.detail?.newIndex;

        if (
          !Number.isInteger(
            oldIndex
          ) ||
          !Number.isInteger(
            newIndex
          ) ||
          oldIndex === newIndex
        ) {
          return;
        }

        const list =
          [
            ...this._config[kind]
          ];

        const [item] =
          list.splice(
            oldIndex,
            1
          );

        if (!item) return;

        list.splice(
          newIndex,
          0,
          item
        );

        this._replaceList(
          kind,
          list
        );
      }
    );

    const list =
      document.createElement(
        'div'
      );

    list.className =
      `list ${kind}`;

    sortable.append(
      list
    );

    this[`_${kind}List`] =
      list;

    return sortable;
  }

  _createRow(
    kind,
    item,
    index
  ) {
    const row =
      document.createElement(
        'div'
      );

    row.className =
      'row';

    const entityForm =
      this._form(
        [
          {
            name: 'entity',
            label: '',
            selector: {
              entity: {
                domain: 'sensor'
              }
            }
          }
        ],

        {
          entity:
            item.entity
        },

        (value) => {
          this._updateItem(
            kind,
            index,
            {
              entity:
                value.entity || ''
            }
          );
        }
      );

    entityForm.className =
      'entity';

    const editButton =
      document.createElement(
        'ha-icon-button'
      );

    editButton.path =
      'M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.13,5.12L18.88,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z';

    editButton.label =
      'Edit';

    const detail =
      document.createElement(
        'div'
      );

    detail.className =
      'detail';

    detail.hidden =
      true;

    const schema =
      kind === 'cells'
        ? [
            {
              name: 'name',
              label: 'Name',
              selector: {
                text: {}
              }
            }
          ]
        : [
            {
              name: 'name',
              label: 'Name',
              selector: {
                text: {}
              }
            },

            {
              name: 'icon',
              label: 'Icon',
              selector: {
                icon: {}
              }
            }
          ];

    const detailForm =
      this._form(
        schema,
        item,
        (value) => {
          this._updateItem(
            kind,
            index,
            value
          );
        }
      );

    detail.append(
      detailForm
    );

    editButton.addEventListener(
      'click',
      () => {
        detail.hidden =
          !detail.hidden;
      }
    );

    const handle =
      document.createElement(
        'div'
      );

    handle.className =
      'handle';

    handle.tabIndex =
      0;

    const dragIcon =
      document.createElement(
        'ha-svg-icon'
      );

    dragIcon.path =
      'M9,5H15V7H9V5M9,11H15V13H9V11M9,17H15V19H9V17Z';

    handle.append(
      dragIcon
    );

    const deleteButton =
      document.createElement(
        'ha-icon-button'
      );

    deleteButton.path =
      'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,6.41Z';

    deleteButton.label =
      'Delete';

    deleteButton.addEventListener(
      'click',
      () => {
        const list =
          [
            ...this._config[kind]
          ];

        list.splice(
          index,
          1
        );

        this._replaceList(
          kind,
          list
        );
      }
    );

    row.append(
      entityForm,
      editButton,
      handle,
      deleteButton,
      detail
    );

    return row;
  }

  _buildLists() {
    this._renderList(
      'cells'
    );

    this._renderList(
      'extra_sensors'
    );
  }

  _renderList(kind) {
    const list =
      this[`_${kind}List`];

    if (!list) return;

    list.replaceChildren(
      ...(this._config[kind] || [])
        .map(
          (item, index) =>
            this._createRow(
              kind,
              item,
              index
            )
        )
    );
  }

  _updateItem(
    kind,
    index,
    patch
  ) {
    const list =
      [
        ...this._config[kind]
      ];

    list[index] = {
      ...list[index],
      ...patch
    };

    this._config[kind] =
      list;

    this._emit();
  }

  _replaceList(
    kind,
    list
  ) {
    this._config[kind] =
      list.map(
        (item) => ({
          ...item
        })
      );

    this._renderList(
      kind
    );

    this._emit();
  }

  _createAddForm(
    label,
    callback
  ) {
    let form;

    form =
      this._form(
        [
          {
            name: 'entity',
            label,
            selector: {
              entity: {
                domain: 'sensor'
              }
            }
          }
        ],

        {
          entity: ''
        },

        (value) => {
          if (!value.entity) {
            return;
          }

          callback(
            value.entity
          );

          form.data = {
            entity: ''
          };
        }
      );

    return form;
  }

  _entityName(
    entity,
    fallback
  ) {
    return (
      this._hass
        ?.states?.[entity]
        ?.attributes
        ?.friendly_name ||
      fallback
    );
  }

  _themes() {
    return [
      {
        value: '',
        label: 'Default'
      },

      ...Object.keys(
        this._hass
          ?.themes
          ?.themes || {}
      )
        .sort()
        .map(
          (theme) => ({
            value: theme,
            label: theme
          })
        )
    ];
  }

  _topSchema() {
    return [
      {
        name: 'title',
        label: 'Name',
        selector: {
          text: {}
        }
      },

      {
        name: 'theme',
        label: 'Theme',
        selector: {
          select: {
            mode: 'dropdown',
            options:
              this._themes()
          }
        }
      }
    ];
  }

  _sensorsSchema() {
    return [
      {
        name: 'soc_entity',
        label:
          'State of charge (SOC)',
        selector: {
          entity: {
            domain: 'sensor'
          }
        }
      },

      {
        name: 'watt_entity',
        label: 'Power (W)',
        selector: {
          entity: {
            domain: 'sensor'
          }
        }
      },

      {
        name: 'cell_diff_sensor',
        label:
          'Cell voltage delta',
        selector: {
          entity: {
            domain: 'sensor'
          }
        }
      },

      {
        name: 'balance_sensor',
        label:
          'Balancing active (optional)',
        selector: {
          entity: {}
        }
      }
    ];
  }

  _balanceSchema() {
    return [
      {
        name: 'cell_diff',
        label:
          'Delta threshold (mV)',
        selector: {
          number: {
            min: 1,
            max: 200,
            mode: 'box'
          }
        }
      },

      {
        name: 'cell_bal_over',
        label:
          'Min cell voltage (mV)',
        selector: {
          number: {
            min: 2000,
            max: 4000,
            mode: 'box'
          }
        }
      },

      {
        name:
          'auto_detect_low_high',

        label:
          'Auto-detect lowest / highest cell',

        selector: {
          boolean: {}
        }
      },

      {
        name: 'pack_cell_low',

        label:
          'Lowest cell sensor',

        visible: {
          field:
            'auto_detect_low_high',

          operator:
            'not_eq',

          value:
            true
        },

        selector: {
          entity: {
            domain: 'sensor'
          }
        }
      },

      {
        name: 'pack_cell_high',

        label:
          'Highest cell sensor',

        visible: {
          field:
            'auto_detect_low_high',

          operator:
            'not_eq',

          value:
            true
        },

        selector: {
          entity: {
            domain: 'sensor'
          }
        }
      }
    ];
  }

  _displaySchema() {
    return [
      {
        name: 'show_legend',
        label: 'Show legend',
        selector: {
          boolean: {}
        }
      },

      {
        name: 'show_soc_value',
        label: 'Show SOC value',

        visible: {
          field:
            'show_legend',

          value:
            true
        },

        selector: {
          boolean: {}
        }
      },

      {
        name: 'show_soc_icon',
        label: 'Show SOC icon',

        visible: {
          field:
            'show_legend',

          value:
            true
        },

        selector: {
          boolean: {}
        }
      },

      {
        name: 'show_cell_diff',
        label: 'Show cell delta',

        visible: {
          field:
            'show_legend',

          value:
            true
        },

        selector: {
          boolean: {}
        }
      },

      {
        name: 'show_sync_icon',
        label: 'Show sync icon',

        visible: {
          field:
            'show_legend',

          value:
            true
        },

        selector: {
          boolean: {}
        }
      },

      {
        name: 'show_extra_sensors',
        label:
          'Show additional sensors',

        selector: {
          boolean: {}
        }
      },

      {
        name: 'use_3d',
        label: '3D frame',

        selector: {
          boolean: {}
        }
      },

      {
        name: 'cell_unit',
        label: 'Cell unit',

        selector: {
          select: {
            mode: 'dropdown',

            options: [
              {
                value: 'mV',
                label: 'mV'
              },

              {
                value: 'V',
                label: 'V'
              }
            ]
          }
        }
      },

      {
        name: 'font_size',
        label: 'Font size',

        selector: {
          number: {
            min: 4,
            max: 16,
            step: 0.5,
            mode: 'box'
          }
        }
      },

      {
        name: 'cell_gap',
        label:
          'Cell gap (px)',

        selector: {
          number: {
            min: 0,
            max: 16,
            mode: 'box'
          }
        }
      },

      {
        name:
          'container_padding',

        label:
          'Container padding (px)',

        selector: {
          number: {
            min: 0,
            max: 40,
            mode: 'box'
          }
        }
      },

      {
        name:
          'top_padding',

        label:
          'Title spacing (px)',

        selector: {
          number: {
            min: 0,
            max: 60,
            mode: 'box'
          }
        }
      },

      {
        name:
          'overlay_opacity',

        label:
          'Overlay opacity',

        selector: {
          number: {
            min: 0,
            max: 1,
            step: 0.05,
            mode: 'box'
          }
        }
      },

      {
        name:
          'chunk_cells',

        label:
          'Wrap cells into rows',

        selector: {
          boolean: {}
        }
      },

      {
        name:
          'chunk_size',

        label:
          'Cells per row',

        visible: {
          field:
            'chunk_cells',

          value:
            true
        },

        selector: {
          number: {
            min: 2,
            max: 32,
            mode: 'box'
          }
        }
      }
    ];
  }

  _commit(
    partial,
    fields
  ) {
    const next = {
      ...this._config
    };

    for (
      const field of fields || []
    ) {
      if (
        Object.prototype.hasOwnProperty.call(
          partial,
          field
        ) &&
        partial[field] !== undefined
      ) {
        next[field] =
          partial[field];
      }
    }

    this._config =
      this._normalize(
        next
      );

    if (
      !this._config.show_legend
    ) {
      this._config.show_soc_value =
        false;

      this._config.show_soc_icon =
        false;

      this._config.show_cell_diff =
        false;

      this._config.show_sync_icon =
        false;
    }

    this._emit();
  }

  _emit() {
    const config =
      this._normalize({
        ...this._config,

        cells:
          this._config.cells.map(
            (cell) => ({
              ...cell
            })
          ),

        extra_sensors:
          this._config
            .extra_sensors
            .map(
              (sensor) => ({
                ...sensor
              })
            )
      });

    delete config.background;
    delete config.card_height;

    this._localConfig =
      JSON.stringify(
        config
      );

    this.dispatchEvent(
      new CustomEvent(
        'config-changed',
        {
          detail: {
            config
          },

          bubbles: true,
          composed: true
        }
      )
    );
  }

  _syncForms() {
    if (!this._built) {
      return;
    }

    this._topForm.data =
      this._config;

    this._topForm.schema =
      this._topSchema();

    this._sensorsForm.data =
      this._config;

    this._balanceForm.data =
      this._config;

    this._displayForm.data =
      this._config;
  }
}

customElements.define(
  'battery-cells-card-editor',
  BatteryCellsCardEditor
);

window.customCards =
  window.customCards || [];

window.customCards.push({
  type: 'battery-cells-card',
  name: 'Battery Cells Card',
  preview: true,
  description:
    'Battery cell monitoring and BMS visualisation'
});
