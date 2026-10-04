/**
 * Battery Cells Card v0.9.4
 * Home Assistant custom Lovelace card – cell voltage / BMS visualisation
 */
const VERSION = '0.9.4';
console.info(`%c 🔋 Battery Cells Card %c v${VERSION} `, 'background:linear-gradient(90deg,#f00 0%,#f00 2.5%,#ffa500 2.5%,#ffa500 5%,#ff0 5%,#ff0 7.5%,#0e0 7.5%,#0e0 100%);color:#000;font-weight:bold;padding:6px 12px;border-radius:4px;', 'color:#2e7d32;padding:4px 8px;');

/* ───────────── Konstanten ───────────── */
const PRESETS = {
  lifepo4: [2600, 2800, 3000, 3200, 3380, 3450, 3550, 3650],
  nmc: [3000, 3100, 3300, 3500, 3700, 4000, 4100, 4200],
  lead: [1800, 1850, 1900, 2000, 2100, 2250, 2350, 2450]
};
const BAL_DEFAULT = { lifepo4: 3000, nmc: 3500, lead: 2000, custom: 3000 };
const FILL_PCT = [0, 5, 10, 20, 80, 90, 95, 100];
const SEGMENTS = [['#ff0000', 5], ['#ffa500', 5], ['#ffff00', 10], ['#00aa00', 60], ['#ffff00', 10], ['#ffa500', 5], ['#ff0000', 5]];
const BAR_GRADIENT = 'linear-gradient(to top,#ff0000 0%,#ff0000 5%,#ffa500 5%,#ffa500 10%,#ffff00 10%,#ffff00 20%,#00ee00 20%,#00ee00 80%,#ffff00 80%,#ffff00 90%,#ffa500 90%,#ffa500 95%,#ff0000 95%,#ff0000 100%)';
const BATTERY_TYPES = ['lifepo4', 'nmc', 'lead', 'custom'];
const SLICE_LEVELS = ['subtle', 'medium', 'strong'];
const CHUNK_MODES = ['auto4', 'auto8', 'manual'];
const LEGEND_TOGGLES = ['show_soc_value', 'show_soc_icon', 'show_cell_diff', 'show_sync_icon'];
const MIN_CELL_W_FLOOR = 40, DEFAULT_MIN_CELL_W = 50, DEFAULT_CELL_H = 340, CELL_H_MIN = 200, CELL_H_MAX = 800;
const RANGES = { cell_height: [CELL_H_MIN, CELL_H_MAX], min_cell_width: [MIN_CELL_W_FLOOR, 120] };
const GRADIENT_BLEND = 1.1;
const MV_MAX = 6000, MAX_STOPS = 20, PLACEHOLDER_CELLS = 4;
const LIMITS = { font_size: [4, 16], cell_gap: [0, 16], container_padding: [0, 40], top_padding: [0, 60], overlay_opacity: [0, 1], cell_diff: [0, 1000], cell_bal_over: [0, MV_MAX] };

/* ───────────── Helfer ───────────── */
const arr = x => Array.isArray(x) ? x : [];
const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ESC[m]);
const volt = mv => (mv / 1000).toFixed(2) + 'V';
const num1 = v => { const n = parseFloat(v); return Number.isFinite(n) ? n : null; };
const toMv = (raw, unit) => {
  const n = num1(raw);
  return n == null ? null : (unit === 'V' || (unit !== 'mV' && n < 10) ? n * 1000 : n);
};
const clamp = (v, lo, hi, d) => { const n = Number(v); return Number.isFinite(n) ? Math.max(lo, Math.min(hi, n)) : d; };
const pick = (v, list, d) => list.includes(v) ? v : d;
const safeColor = c => { const s = String(c ?? '').trim(); return s && globalThis.CSS?.supports?.('color', s) ? s : '#00aa00'; };
const sortKeys = (k, v) => v && typeof v === 'object' && !Array.isArray(v) ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)) : v;
const sig = o => JSON.stringify(o, sortKeys);

function largestNiceSize(maxAllowed, minSize, total) {
  let s = minSize;
  while (s * 2 <= total && s * 2 <= maxAllowed) s *= 2;
  return s;
}
const linesOf = c => {
  const n = arr(c.cells).length;
  if (!c.chunk_cells || !n) return 1;
  if (c.chunk_mode === 'manual') return Math.ceil(n / Math.min(c.chunk_size || 8, n));
  return Math.ceil(n / (c.chunk_mode === 'auto4' ? 4 : 8));
};

function fitStops(list, keep = -1, min = 0) {
  const n = list.length;
  if (!n) return list;
  const lo = clamp(Math.round(Number(min)), 0, MV_MAX, 0);
  const mv = list.map(s => clamp(Math.round(Number(s.mv)), 0, MV_MAX, 0));
  if (keep >= 0) mv[keep] = Math.max(keep < n - 1 ? mv[keep + 1] + 1 : lo + 1, Math.min(keep ? mv[keep - 1] - 1 : MV_MAX, mv[keep]));
  for (let i = 1; i < n; i++) mv[i] = Math.min(mv[i], mv[i - 1] - 1);
  mv[n - 1] = Math.max(mv[n - 1], lo + 1);
  for (let i = n - 2; i >= 0; i--) mv[i] = Math.max(mv[i], mv[i + 1] + 1);
  let p = list.map(s => Math.max(1, Math.round(Number(s.pct)) || 1));
  if (n === 1) p[0] = 100;
  else if (keep >= 0) {
    p[keep] = Math.min(p[keep], 100 - (n - 1));
    let diff = p.reduce((a, v) => a + v, 0) - 100;
    for (let d = 1; d < n && diff; d++) for (const k of [keep + d, keep - d]) {
      if (k < 0 || k >= n || !diff) continue;
      if (diff > 0) { const t = Math.min(diff, p[k] - 1); p[k] -= t; diff -= t; }
      else { p[k] -= diff; diff = 0; }
    }
  } else {
    const sum = p.reduce((a, v) => a + v, 0), raw = p.map(v => 100 * v / sum), out = raw.map(Math.floor);
    const left = 100 - out.reduce((a, v) => a + v, 0);
    raw.map((v, k) => [v - out[k], k]).sort((a, b) => b[0] - a[0]).slice(0, left).forEach(([, k]) => out[k]++);
    let lack = 0;
    out.forEach((v, k) => { if (v < 1) { lack += 1 - v; out[k] = 1; } });
    while (lack-- > 0) out[out.indexOf(Math.max(...out))]--;
    p = out;
  }
  return list.map((s, i) => ({ ...s, mv: mv[i], pct: p[i] }));
}

/* ───────────── Konfiguration ───────────── */
const DEFAULTS = {
  title: 'Battery Cells', theme: '', container_padding: 10, top_padding: 20, cell_gap: 4,
  use_3d: false, show_slices: false, slice_strength: 'medium',
  show_legend: true, show_soc_icon: true, show_soc_value: true, show_sync_icon: true, show_cell_diff: true,
  show_extra_sensors: false, extra_sensors: [], extra_font_scale: 1, overlay_opacity: .7, font_size: 8,
  soc_entity: null, watt_entity: null, balance_sensor: null, cell_diff_sensor: null,
  cell_diff: 8, cell_bal_over: 3000, cell_unit: 'mV',
  auto_detect_low_high: true, pack_cell_low: null, pack_cell_high: null,
  chunk_cells: false, chunk_mode: 'auto8', chunk_size: 8, cell_height: DEFAULT_CELL_H, min_cell_width: DEFAULT_MIN_CELL_W,
  battery_type: 'lifepo4', custom_min_mv: 2600, custom_max_mv: 3650, legend_stops: [], scale_gradient: false, cells: []
};
const stubConfig = () => ({
  ...DEFAULTS,
  font_size: 5,
  use_3d: true,
  show_slices: true,
  slice_strength: 'subtle',
  chunk_cells: false,
  chunk_mode: 'auto8',
  cell_height: CELL_H_MIN,
  soc_entity: 'sensor.status_of',
  watt_entity: 'sensor.pack',
  cell_diff_sensor: 'sensor.delta_mvolts_between',
  cells: Array.from({ length: 8 }, (_, i) => ({ name: `Cell ${i + 1}`, entity: `sensor.test_cell${i + 1}` })),
  grid_options: { columns: 24, rows: 6 }
});

function normalizeConfig(config = {}) {
  const c = { ...DEFAULTS, ...config };
  for (const k in DEFAULTS) if (c[k] == null) c[k] = DEFAULTS[k];
  c.cells = arr(c.cells).map(x => ({ name: x?.name ?? '', entity: x?.entity ?? '' }));
  if (!c.cells.length) c.cells = Array.from({ length: PLACEHOLDER_CELLS }, (_, i) => ({ name: String(i + 1), entity: '' }));
  c.extra_sensors = arr(c.extra_sensors).map(s => ({ name: s?.name || '', entity: s?.entity || '', icon: s?.icon || '' }));
  c.legend_stops = arr(c.legend_stops).filter(Boolean);
  c.battery_type = pick(c.battery_type, BATTERY_TYPES, 'lifepo4');
  c.slice_strength = pick(c.slice_strength, SLICE_LEVELS, 'medium');
  c.chunk_mode = pick(c.chunk_mode, CHUNK_MODES, 'auto8');
  c.cell_unit = pick(c.cell_unit, ['mV', 'V'], 'mV');
  c.grid_options = { columns: config.grid_options?.columns ?? 12 };
  for (const k in RANGES) c[k] = clamp(c[k], ...RANGES[k], DEFAULTS[k]);
  for (const k in LIMITS) c[k] = clamp(c[k], ...LIMITS[k], DEFAULTS[k]);
  c.chunk_size = clamp(c.chunk_size, 2, 32, 8);
  c.extra_font_scale = clamp(c.extra_font_scale, 0.7, 1.5, 1);
  return c;
}

/* ───────────── Skala ───────────── */
function buildScale(c) {
  if (c.battery_type === 'custom' && c.legend_stops.length >= 2) return scaleFromStops(c);
  let pts = PRESETS[c.battery_type];
  if (!pts) {
    let lo = Number(c.custom_min_mv), hi = Number(c.custom_max_mv);
    if (!(lo < hi)) { lo = 2600; hi = 3650; }
    const b = PRESETS.lifepo4;
    pts = b.map(v => Math.round(lo + (v - b[0]) / (b[7] - b[0]) * (hi - lo)));
  }
  return {
    legend: SEGMENTS.map(([col, pct], i) => [col, pct, i < 4 ? volt(pts[7 - i]) : null, i > 2 ? volt(pts[6 - i]) : null]),
    gradient: BAR_GRADIENT,
    fill: pts.map((mv, i) => ({ mv, pct: FILL_PCT[i] }))
  };
}

function legendGradient(legend, smooth) {
  const total = legend.reduce((a, l) => a + l[1], 0) || 1;
  const segs = legend.map(([col, pct]) => [col, pct / total * 100]).reverse();
  const last = segs.length - 1, out = [];
  let acc = 0;
  segs.forEach(([col, h], i) => {
    const a = acc, b = acc += h;
    if (!smooth) { out.push(`${col} ${a.toFixed(2)}% ${b.toFixed(2)}%`); return; }
    const ws = i && a <= 50 ? GRADIENT_BLEND * Math.min(h, segs[i - 1][1]) : 0;
    const we = i < last && b > 50 ? GRADIENT_BLEND * Math.min(h, segs[i + 1][1]) : 0;
    const k = ws + we > .9 * h ? .9 * h / (ws + we) : 1;
    out.push(`${col} ${(a + ws * k).toFixed(2)}%`, `${col} ${(b - we * k).toFixed(2)}%`);
  });
  return `linear-gradient(to top,${out.join(',')})`;
}

function scaleFromStops(c) {
  const stops = arr(c.legend_stops).map((s, i) => ({
    color: safeColor(s?.color),
    pct: Math.max(0, Number(s?.pct) || 0),
    mv: s?.mv == null || s.mv === '' ? NaN : Number(s.mv),
    top: s?.top || null,
    bottom: s?.bottom || null,
    index: i
  })).filter(s => Number.isFinite(s.mv));
  const legend = stops.length ? stops.map(s => [s.color, s.pct || 0, s.top, s.bottom]) : [['#00aa00', 100, null, null]];
  let fill;
  if (stops.length >= 2) {
    const total = stops.reduce((a, s) => a + s.pct, 0) || 1, edge = new Map();
    let acc = 0;
    for (let i = stops.length - 1; i >= 0; i--) { acc += stops[i].pct; edge.set(stops[i].index, acc / total * 100); }
    fill = stops.map(s => ({ mv: s.mv, pct: edge.get(s.index) })).sort((a, b) => a.mv - b.mv || a.pct - b.pct);
    for (let i = 1; i < fill.length; i++) fill[i].pct = Math.max(fill[i].pct, fill[i - 1].pct);
    const lo = Number(c.custom_min_mv);
    fill.unshift({ mv: Number.isFinite(lo) && lo < fill[0].mv ? lo : fill[0].mv, pct: 0 });
    const t = fill[fill.length - 1];
    if (t.pct < 99.999) fill.push({ mv: t.mv, pct: 100 }); else t.pct = 100;
  } else {
    const lo = Number(c.custom_min_mv), hi = Number(c.custom_max_mv);
    const min = Number.isFinite(lo) ? lo : 2600;
    const max = Number.isFinite(hi) && hi > min ? hi : 3650;
    fill = [{ mv: min, pct: 0 }, { mv: max, pct: 100 }];
  }
  return { legend, gradient: legendGradient(legend, c.scale_gradient), fill, gradientMode: !!c.scale_gradient };
}

function fillPercent(fill, mv) {
  if (mv == null) return 0;
  if (mv <= fill[0].mv) return fill[0].pct;
  for (let i = 1; i < fill.length; i++) {
    const a = fill[i - 1], b = fill[i];
    if (mv < b.mv) return a.pct + (mv - a.mv) / (b.mv - a.mv) * (b.pct - a.pct);
  }
  return fill[fill.length - 1].pct;
}

function formatExtra(st) {
  const s = st?.state, unit = st?.attributes?.unit_of_measurement || '';
  if (s == null || s === 'unavailable' || s === 'unknown') return { v: '—', u: '' };
  const n = Number(s);
  if (!Number.isFinite(n)) return { v: String(s), u: unit };
  const a = Math.abs(n);
  return { v: String(a >= 100 ? Math.round(n) : +n.toFixed(a >= 10 ? 1 : 2)), u: unit };
}

/* ───────────── CSS ───────────── */
const CARD_CSS = `:host{display:block;width:100%;box-sizing:border-box}
:host([fill]){height:100%}
.card>*{--u:min(1vw,3.2cqw)}.compact>*{--u:min(1vw,1.8cqw)}
.card{container-type:inline-size;isolation:isolate;width:100%;box-sizing:border-box;border-radius:var(--ha-card-border-radius,12px);box-shadow:var(--ha-card-box-shadow,0 2px 4px rgba(0,0,0,.1));overflow:hidden;display:flex;flex-direction:column;padding:var(--bcc-pad)}
.fill{height:100%}
.sl-subtle{--slh:.1;--sll:.1;--slg:.25;--sla:92%;--slb:95%}.sl-medium{--slh:.2;--sll:.2;--slg:.5;--sla:88%;--slb:92%}.sl-strong{--slh:.4;--sll:.4;--slg:.85;--sla:84%;--slb:86%}
.title{color:var(--primary-text-color);font-size:var(--bcc-title);font-weight:400;padding:12px 0 var(--bcc-top) 16px;margin:0;flex-shrink:0}
.extra{display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;padding:0 8px 10px 12px;flex-shrink:0}.extra[hidden]{display:none}
.xi{display:inline-flex;align-items:center;gap:6px;color:var(--primary-text-color);font-family:var(--ha-font-family-body,var(--paper-font-body1_-_font-family,Roboto,Noto,sans-serif));font-size:calc(var(--ha-font-size-m,14px) * var(--bcc-efs,1));font-weight:500;line-height:1.3;padding:2px 4px;border-radius:4px}
.xi:hover{background:rgba(127,127,127,.12)}
.xi ha-state-icon{--mdc-icon-size:1.35em;color:var(--primary-color)}
.xn{color:var(--secondary-text-color);font-weight:400;margin-right:2px}.xv{font-weight:600;font-variant-numeric:tabular-nums}.xu{color:var(--secondary-text-color);font-size:.9em;margin-left:2px}
[data-e]{cursor:pointer}[data-e]:focus-visible{outline:2px solid var(--primary-color);outline-offset:1px}
.content{display:flex;flex-direction:column;gap:12px;width:100%;--sh:clamp(1.5px,0.9cqw,6px);--bl:clamp(3px,1.15cqw,9px);--side:max(3px,min(1.2cqw,8px));--frame:clamp(7px,2.2cqw,32px)}
.d3 .content{padding-top:max(8px,calc(var(--frame)*0.45));box-sizing:border-box}
.fill .content{flex:1 1 auto;min-height:0}
.row{display:flex;gap:var(--bcc-gap);align-items:flex-end;width:100%;box-sizing:border-box;height:var(--bcc-cellh);min-height:var(--bcc-cellh);flex:0 0 auto}
.fill .row{height:auto;min-height:${CELL_H_MIN}px;flex:1 1 var(--bcc-base)}
.fill .w{display:flex;height:auto;align-self:stretch}
.fill .bar,.fill .inner{height:auto;flex:1 1 auto}
.w{position:relative;border-radius:4px;overflow:hidden;box-sizing:border-box;height:100%;flex:1 1 0;min-width:0;padding-block:9px;padding-inline:var(--side)}
.bar,.inner{position:relative;width:100%;height:100%;border-radius:1px;overflow:hidden}.bar{background:var(--bcc-grad)}.inner{display:flex;flex-direction:column}
.d3 .bar,.d3 .inner{border-radius:2px}
.bar::before{content:'';position:absolute;inset:0;pointer-events:none;z-index:1;border-radius:inherit;background:linear-gradient(115deg,rgba(255,255,255,.35) 0%,rgba(255,255,255,.1) 14%,rgba(255,255,255,0) 32%,rgba(0,0,0,0) 66%,rgba(0,0,0,.22) 100%);mix-blend-mode:overlay}
.d3 .bar::after,.d3 .inner::after{content:'';position:absolute;inset:0;pointer-events:none;border-radius:inherit;z-index:1;box-shadow:inset 0 2px 3px rgba(0,0,0,.45),inset 0 -1px 2px rgba(255,255,255,.1),inset var(--sh) 0 var(--bl) rgba(0,0,0,.55),inset calc(-1*var(--sh)) 0 var(--bl) rgba(0,0,0,.55),inset calc(var(--sh)*2) 0 calc(var(--bl)*1.6) rgba(0,0,0,.28),inset calc(-2*var(--sh)) 0 calc(var(--bl)*1.6) rgba(0,0,0,.28)}
.sl .bar::after,.sl .inner::after{content:'';position:absolute;inset:0;pointer-events:none;border-radius:inherit;z-index:1;background:linear-gradient(180deg,rgba(255,255,255,var(--slh)) 0,rgba(255,255,255,calc(var(--slh)*.3)) 18%,rgba(255,255,255,0) 40%,rgba(0,0,0,.05) 62%,rgba(0,0,0,var(--sll)) var(--sla),rgba(0,0,0,var(--slg)) var(--slb),rgba(0,0,0,var(--slg)) 100%) 0 0/100% 5% repeat-y}
.ov{position:absolute;inset:0;background:rgba(0,0,0,var(--bcc-op));z-index:2;pointer-events:none}
.name,.val{position:absolute;left:50%;transform:translateX(-50%);z-index:3;width:90%;pointer-events:none;text-align:center;color:#fff;text-shadow:0 0 6px #000;font-weight:700;line-height:1.1}
.name{top:4px;white-space:normal;word-break:break-word;font-size:calc(var(--bcc-fs)*1.2px + .6*var(--u))}
.val{bottom:4px;display:flex;flex-direction:column;align-items:center;white-space:nowrap;text-shadow:0 1px 2px #000,0 0 4px #000}
.num{font-size:calc(var(--bcc-fs)*1.5px + .6*var(--u))}.unit{font-size:.85em;line-height:1}
.seg{position:relative;overflow:hidden;pointer-events:none}
.lab{position:absolute;left:0;right:0;text-align:center;font-weight:700;color:#fff;text-shadow:0 1px 2px #000,0 0 4px #000;pointer-events:none;font-size:calc(var(--bcc-fs)*1.2px + .5*var(--u));z-index:3}
.lab.t{top:-3px}.lab.b{bottom:-4px}
.soc,.diff,.bat,.sync{position:absolute;left:50%;transform:translate(-50%,-50%);z-index:3}
.soc,.diff{font-weight:700;color:#fff;text-align:center;box-sizing:border-box}
.soc{top:49%;width:94%;text-shadow:0 0 6px #000;white-space:nowrap;font-size:min(clamp(7px,calc(var(--bcc-fs)*1px + 1.2*var(--u)),18px),calc(var(--bcc-cellh)*.085));line-height:1}
.diff{top:57%;width:90%;max-width:90%;text-shadow:0 0 3px #000;white-space:normal;font-size:min(clamp(6px,calc(var(--bcc-fs)*.7px + .6*var(--u)),14px),calc(var(--bcc-cellh)*.06));line-height:1}
.bat{top:36%;filter:drop-shadow(0 0 6px #000);--mdc-icon-size:min(calc(var(--bcc-fs)*2.8px + 1.6*var(--u)),calc(var(--bcc-cellh)*.15))}
.sync{top:66%;color:#dfeeff;filter:drop-shadow(0 0 16px #000);display:none;--mdc-icon-size:min(calc(var(--bcc-fs)*2.5px + 1.2*var(--u)),calc(var(--bcc-cellh)*.13))}
.hl{position:absolute;inset:0;border-radius:1px;pointer-events:none;z-index:2;box-sizing:border-box;display:none}
.d3 .hl{border-radius:2px;top:var(--frame);bottom:var(--frame);left:var(--side);right:var(--side);z-index:2}
.low>.hl,.high>.hl{display:block;border:4px solid}.compact .low>.hl,.compact .high>.hl{border-width:2px}
.low>.hl{border-color:#ff6666 #ff7f7f #cc1a1a #e60000}.high>.hl{border-color:#99d1ff #66b3ff #0066dd #3385ff}
.d3 .w{overflow:visible;padding-block:var(--frame);padding-inline:var(--side);background:linear-gradient(180deg,rgba(255,255,255,.06) 0%,rgba(255,255,255,0) 38%,rgba(0,0,0,0) 62%,rgba(0,0,0,.2) 100%),linear-gradient(88deg,#404247 0%,#c9cbce 7%,#dcdee0 10%,#b3b5b9 16%,#93959a 23%,#e4e6e8 30%,#f0f1f2 37%,#b0b2b6 45%,#82848a 56%,#f1f2f3 68%,#62646a 78%,#4c4e54 86%,#f3f4f5 94%,#404247 100%);box-shadow:0 0 0 1px rgba(0,0,0,.28),inset 0 1px 1px rgba(255,255,255,.3),inset 0 -2px 3px rgba(255,255,255,.18),inset 1px 0 1px rgba(255,255,255,.15),inset -1px 0 2px rgba(255,255,255,.16)}
.d3 .w::after{content:'';position:absolute;inset:calc(var(--frame) - 2px) max(0px,calc(var(--side) - 2px));box-sizing:border-box;border:2px solid;border-color:#d8dadd #e4e5e7 #2c2e33 #6a6c72;border-radius:3px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.55),0 0 0 1px rgba(0,0,0,.3);pointer-events:none;z-index:1}
.d3 .w::before{content:'';position:absolute;top:-5px;left:50%;transform:translateX(-50%);width:20%;height:clamp(2px,1.2cqw,5px);box-sizing:border-box;background:linear-gradient(180deg,rgba(255,255,255,.5) 0%,rgba(255,255,255,0) 40%,rgba(0,0,0,0) 65%,rgba(0,0,0,.35) 100%),linear-gradient(95deg,#34363a 0%,#767880 8%,#b3b5ba 20%,#d8dadd 30%,#a9abaf 42%,#75777b 60%,#575960 80%,#3c3e42 92%,#2c2d31 100%);border:1px solid rgba(255,255,255,.28);border-radius:1px;box-shadow:inset 0 1px 1px rgba(255,255,255,.5),inset 0 -1px 1px rgba(0,0,0,.4);z-index:2;pointer-events:none}
.flat .w{padding:3px}
.flat .w::after{content:'';position:absolute;inset:0;box-sizing:border-box;border:2px solid #aeb1b4;border-radius:4px;pointer-events:none;z-index:2;box-shadow:inset 0 1px 0 rgba(255,255,255,.42),inset 1px 0 0 rgba(255,255,255,.28),inset 0 -1px 0 rgba(0,0,0,.28),inset -1px 0 0 rgba(0,0,0,.2),0 1px 2px rgba(0,0,0,.2)}
@container (max-width:600px){.content{--side:max(2px,min(1.2cqw,6px));--frame:clamp(7px,2.2cqw,28px)}}
@container (max-width:400px){.content{--side:2px;--frame:clamp(6px,2cqw,24px)}}`;

/* ───────────── Karte ───────────── */
class BatteryCellsCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._c = this._hass = this._scale = this._card = this._ro = null;
    this._sig = ''; this._themeName = ''; this._rt = 0; this._rowCount = 0;
    this._ids = []; this._prev = [];
    this._cells = []; this._extras = []; this._soc = []; this._diff = []; this._bat = []; this._sync = [];
    const handler = e => {
      if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
      const t = e.target.closest?.('[data-e]');
      if (!t) return;
      if (e.type === 'click') e.stopPropagation(); else e.preventDefault();
      if (t.dataset.e) this._moreInfo(t.dataset.e);
    };
    ['click', 'keydown'].forEach(type => this.shadowRoot.addEventListener(type, handler));
  }
  static getStubConfig() { return stubConfig(); }
  static getConfigElement() { return document.createElement('battery-cells-card-editor'); }
  getGridOptions() { return { columns: this._c?.grid_options.columns ?? 12, rows: !this._c || this._c.chunk_cells ? 'auto' : 6, min_columns: 10, min_rows: 6 }; }
  getCardSize() {
    const c = this._c;
    if (!c) return 8;
    const lines = this._rowCount || linesOf(c);
    return Math.ceil((lines * c.cell_height + 120) / 50) + (c.show_extra_sensors && c.extra_sensors.length ? 1 : 0);
  }
  setConfig(config) {
    const c = this._c = normalizeConfig(config);
    this._scale = buildScale(c);
    this._ids = [
      c.soc_entity, c.watt_entity, c.cell_diff_sensor, c.balance_sensor, c.pack_cell_low, c.pack_cell_high,
      ...c.cells.map(x => x.entity), ...c.extra_sensors.map(x => x.entity)
    ].filter(Boolean);
    this._prev = [];
    this._render();
    this._update();
  }
  set hass(hass) {
    const prev = this._hass;
    this._hass = hass;
    if (!this._c) return;
    if (this._themeName && hass.themes !== prev?.themes) this._applyTheme();
    const changed = this._changed(hass.states);
    if (!prev || changed) this._update();
  }
  _changed(states) {
    const ids = this._ids, prev = this._prev;
    let changed = false;
    for (let i = 0; i < ids.length; i++) {
      const s = states[ids[i]];
      if (s !== prev[i]) { prev[i] = s; changed = true; }
    }
    return changed;
  }
  connectedCallback() {
    if (this._c) { if (this._env().sig !== this._sig) { this._render(); this._update(); } else this._measure(); }
    this._ro = new ResizeObserver(() => {
      clearTimeout(this._rt);
      this._rt = setTimeout(() => {
        if (!this._c) return;
        if (this._env().sig !== this._sig) { this._render(); this._update(); } else this._measure();
      }, 250);
    });
    this._ro.observe(this);
  }
  disconnectedCallback() {
    clearTimeout(this._rt);
    this._ro?.disconnect();
    this._ro = null;
  }
  _moreInfo(entityId) {
    this.dispatchEvent(new CustomEvent('hass-more-info', { bubbles: true, composed: true, detail: { entityId } }));
  }

  _measure() {
    const row = !this._c?.chunk_cells && this._card?.querySelector('.row');
    if (row) this._card.style.setProperty('--bcc-cellh', Math.max(CELL_H_MIN, row.offsetHeight) + 'px');
  }

  _env() {
    const c = this._c, w = this.clientWidth || 0, h = this.clientHeight || 0;
    const compact = (w > 0 && w < 420) || (h > 0 && h < 260);
    const pad = compact ? Math.min(c.container_padding, 6) : c.container_padding;
    const gap = c.cell_gap || 0, n = c.cells.length;
    const minW = Math.max(MIN_CELL_W_FLOOR, Number(c.min_cell_width) || DEFAULT_MIN_CELL_W);
    let size = n, chunk = false;
    if (c.chunk_cells && n > 0 && w > 0) {
      const maxSlots = Math.max(1, Math.floor((w - 2 * pad + gap) / (minW + gap)));
      const fit = c.show_legend ? Math.max(0, maxSlots - 1) : maxSlots;
      if (fit < n) {
        if (c.chunk_mode === 'manual') size = Math.max(1, Math.min(c.chunk_size || 8, n, fit));
        else {
          const minSize = c.chunk_mode === 'auto4' ? 4 : 8;
          size = Math.max(minSize, Math.min(n, largestNiceSize(fit, minSize, n)));
        }
        if (w < 480 && size > 8) size = 8;
        chunk = size < n;
      }
      if (chunk) size = Math.ceil(n / Math.ceil(n / size));
    }
    return { compact, chunk, pad, size, sig: `${compact}|${chunk}|${size}|${minW}|${c.cell_height}|${c.chunk_mode}` };
  }

  _legendHtml() {
    const c = this._c, soc = esc(c.soc_entity), diff = esc(c.cell_diff_sensor);
    const on = k => c.show_legend && c[k];
    const btn = (e, label) => e ? ` data-e="${e}" role="button" tabindex="0"${label ? ` aria-label="${label}"` : ''}` : '';
    const gm = this._scale.gradientMode;
    const segs = this._scale.legend.map(([col, pct, top, bot]) =>
      `<div class="seg" style="${gm ? '' : `background:${esc(col)};`}flex:${pct} 0 0px">${top ? `<div class="lab t">${esc(top)}</div>` : ''}${bot ? `<div class="lab b">${esc(bot)}</div>` : ''}</div>`
    ).join('');
    return `<div class="w"><div class="inner"${gm ? ` style="background:${esc(this._scale.gradient)}"` : ''}>${segs}`
      + (on('show_soc_value') ? `<div class="soc"${btn(soc)}></div>` : '')
      + (on('show_cell_diff') ? `<div class="diff"${btn(diff)}></div>` : '')
      + (on('show_soc_icon') ? `<ha-icon class="bat" icon="mdi:battery"${btn(soc, soc)}></ha-icon>` : '')
      + (on('show_sync_icon') ? `<ha-icon class="sync" icon="mdi:sync"${btn(diff, diff)}></ha-icon>` : '')
      + '</div></div>';
  }
  _cellHtml(cfg) {
    const btn = cfg.entity ? ` data-e="${esc(cfg.entity)}" role="button" tabindex="0"` : '';
    return `<div class="w cell"${btn} title="${esc(cfg.name || cfg.entity)}"><div class="bar"><div class="ov"></div><div class="name">${esc(cfg.name)}</div><div class="val"><span class="num"></span><span class="unit"></span></div></div><div class="hl"></div></div>`;
  }
  _extraHtml(s) {
    const btn = s.entity ? ` data-e="${esc(s.entity)}" role="button" tabindex="0"` : '';
    return `<div class="xi"${btn} title="${esc(s.name || s.entity)}"><ha-state-icon></ha-state-icon>${s.name ? `<span class="xn">${esc(s.name)}:</span>` : ''}<span class="xv">—</span><span class="xu"></span></div>`;
  }

  _applyTheme() {
    const themes = this._hass?.themes, t = themes?.themes?.[this._themeName];
    if (!t || !this._card) return;
    const mode = t.modes?.[themes.darkMode ? 'dark' : 'light'] || {};
    for (const [k, v] of Object.entries({ ...t, ...mode })) {
      if (k !== 'modes' && typeof v === 'string') this._card.style.setProperty(`--${k}`, v);
    }
  }

  _render() {
    const c = this._c, env = this._env(), r = this.shadowRoot;
    this._sig = env.sig;
    this.toggleAttribute('fill', !c.chunk_cells);
    const vars = {
      pad: env.pad + 'px',
      top: (env.compact ? Math.min(c.top_padding, 8) : c.top_padding) + 'px',
      gap: c.cell_gap + 'px',
      efs: c.extra_font_scale,
      fs: env.compact ? Math.min(c.font_size, 8) : c.font_size,
      op: c.overlay_opacity,
      title: env.compact ? '14px' : '24px',
      grad: this._scale.gradient,
      base: c.cell_height + 'px',
      cellh: c.cell_height + 'px'
    };
    const rows = env.chunk
      ? Array.from({ length: Math.ceil(c.cells.length / env.size) }, (_, i) => c.cells.slice(i * env.size, (i + 1) * env.size))
      : [c.cells];
    this._rowCount = rows.length;
    const extra = c.show_extra_sensors ? c.extra_sensors : [];
    const theme = this._themeName = c.theme && c.theme !== 'default' ? c.theme : '';
    const legend = c.show_legend ? this._legendHtml() : '';

    let card = this._card;
    if (!card) {
      r.innerHTML = `<style>${CARD_CSS}</style><ha-card></ha-card>`;
      card = this._card = r.querySelector('ha-card');
    }
    card.className = `card ${c.use_3d ? 'd3' : 'flat'}${c.chunk_cells ? '' : ' fill'}${env.compact ? ' compact' : ''}${c.show_slices ? ` sl sl-${c.slice_strength}` : ''}`;
    theme ? card.setAttribute('theme', theme) : card.removeAttribute('theme');
    card.style.cssText = Object.entries(vars).map(([k, v]) => `--bcc-${k}:${v}`).join(';');
    if (theme) this._applyTheme();
    card.innerHTML = `<div class="title">${esc(c.title)}</div>`
      + `<div class="extra"${extra.length ? '' : ' hidden'}>${extra.map(s => this._extraHtml(s)).join('')}</div>`
      + `<div class="content">${rows.map(row => `<div class="row">${legend}${row.map(cfg => this._cellHtml(cfg)).join('')}</div>`).join('')}</div>`;

    const all = s => [...r.querySelectorAll(s)], one = (el, s) => el.querySelector(s);
    this._cells = all('.cell').map(el => ({ el, ov: one(el, '.ov'), num: one(el, '.num'), unit: one(el, '.unit'), entity: el.dataset.e }));
    this._extras = all('.xi').map((el, i) => ({ icon: one(el, 'ha-state-icon'), v: one(el, '.xv'), u: one(el, '.xu'), entity: extra[i]?.entity, cfgIcon: extra[i]?.icon || '', st: undefined, done: false }));
    this._soc = all('.soc'); this._diff = all('.diff'); this._bat = all('.bat'); this._sync = all('.sync');
    this._measure();
  }

  _update() {
    const h = this._hass, c = this._c;
    if (!h || !c || !this._card) return;
    const S = h.states, val = id => (id ? num1(S[id]?.state) : null);
    const put = (el, t) => { if (el.textContent !== t) el.textContent = t; };

    this._extras.forEach(x => {
      if (!x.entity || !x.icon) return;
      const st = S[x.entity];
      if (x.done && st === x.st) return;
      x.st = st; x.done = true;
      const { v, u } = formatExtra(st);
      put(x.v, v);
      put(x.u, u ? ` ${u}` : '');
      x.icon.hass = h;
      const stateObj = st || { entity_id: x.entity, state: 'unknown', attributes: {} };
      if (x.cfgIcon) {
        x.icon.setAttribute('icon', x.cfgIcon);
        x.icon.stateObj = { ...stateObj, attributes: { ...stateObj.attributes, icon: x.cfgIcon } };
      } else {
        x.icon.removeAttribute('icon');
        x.icon.stateObj = stateObj;
      }
    });

    const soc = val(c.soc_entity), socText = soc == null ? '—' : `${Math.round(soc)}%`;
    this._soc.forEach(el => put(el, socText));

    let diff = val(c.cell_diff_sensor);
    const du = S[c.cell_diff_sensor]?.attributes?.unit_of_measurement;
    if (diff != null && (du === 'V' || (du !== 'mV' && Math.abs(diff) < 0.1))) diff *= 1000;
    diff = diff == null ? null : Math.round(diff);
    const diffText = diff != null ? `Δ ${diff} mV` : '';
    this._diff.forEach(el => put(el, diffText));

    const watt = val(c.watt_entity);
    const [icon, color] = watt > 0 ? ['mdi:battery-plus', '#00ff00'] : watt < 0 ? ['mdi:battery-minus', '#ff0000'] : ['mdi:battery', '#00ccff'];
    this._bat.forEach(el => {
      if (el.getAttribute('icon') !== icon) el.setAttribute('icon', icon);
      if (el.style.color !== color) el.style.color = color;
    });

    let minV = Infinity, maxV = -Infinity, minI = null, maxI = null;
    this._cells.forEach((cell, i) => {
      const st = S[cell.entity], mv = toMv(st?.state, st?.attributes?.unit_of_measurement);
      if (mv == null) { put(cell.num, '-'); put(cell.unit, ''); }
      else if (c.cell_unit === 'V') { put(cell.num, (mv / 1000).toFixed(3)); put(cell.unit, 'V'); }
      else { put(cell.num, String(Math.round(mv))); put(cell.unit, 'mV'); }
      cell.ov.style.height = `${100 - fillPercent(this._scale.fill, mv)}%`;
      if (mv == null) return;
      if (mv < minV) { minV = mv; minI = i + 1; }
      if (mv > maxV) { maxV = mv; maxI = i + 1; }
    });

    const idx = id => { const n = id ? parseInt(S[id]?.state, 10) : NaN; return Number.isFinite(n) ? n : null; };
    let low = idx(c.pack_cell_low), high = idx(c.pack_cell_high);
    if (c.auto_detect_low_high && maxV > minV) { low ??= minI; high ??= maxI; }
    this._cells.forEach((cell, i) => {
      cell.el.classList.toggle('low', i + 1 === low);
      cell.el.classList.toggle('high', i + 1 !== low && i + 1 === high);
    });

    const balancing = (c.balance_sensor && String(S[c.balance_sensor]?.state).toLowerCase() === 'on')
      || ((diff || 0) >= c.cell_diff && maxV >= c.cell_bal_over);
    const display = balancing ? 'block' : 'none';
    this._sync.forEach(el => { if (el.style.display !== display) el.style.display = display; });
  }
}
if (!customElements.get('battery-cells-card')) customElements.define('battery-cells-card', BatteryCellsCard);

/* ───────────── Editor ───────────── */
const I18N = {
  en: {
    cells: 'Cells', add_cell: 'Add Cell', legend_sensors: 'Legend Sensors',
    balancing_min_max: 'Balancing & Min Cell / Max Cell', display: 'Display',
    additional_sensors: 'Additional Sensors', add_sensor: 'Add Sensor',
    title: 'Name', theme: 'Theme', default: 'Default', name: 'Name', icon: 'Icon', entity: 'Entity',
    edit: 'Edit', delete: 'Delete', move: 'Move',
    soc_entity: 'State of charge (SOC)', watt_entity: 'Power (W)',
    cell_diff_sensor: 'Cell voltage delta', balance_sensor: 'Balancing active (optional)',
    cell_diff: 'Delta threshold (mV)', cell_bal_over: 'Balancing from cell voltage (mV)',
    auto_detect_low_high: 'Auto-detect lowest / highest cell',
    pack_cell_low: 'Lowest cell sensor', pack_cell_high: 'Highest cell sensor',
    show_legend: 'Show legend', show_soc_value: 'Show SOC value', show_soc_icon: 'Show charge/discharge icon',
    show_cell_diff: 'Show cell delta', show_sync_icon: 'Show sync icon',
    show_extra_sensors: 'Show additional sensors', use_3d: '3D frame',
    extra_font_scale: 'Font size for additional sensors',
    show_slices: 'Disc shading', slice_strength: 'Shading strength',
    slice_subtle: 'Subtle', slice_medium: 'Medium', slice_strong: 'Strong',
    cell_unit: 'Cell unit', font_size: 'Font size', cell_gap: 'Cell gap (px)',
    container_padding: 'Card padding (px)', top_padding: 'Title spacing (px)',
    overlay_opacity_pct: 'Overlay opacity (%)',
    chunk_panel: 'Cell wrapping', chunk_cells: 'Enable cell wrapping', chunk_mode: 'Wrapping mode',
    chunk_auto4: 'Auto 4 cells', chunk_auto8: 'Auto 8 cells', chunk_manual: 'Manual',
    chunk_size: 'Cells per row', cell_height: 'Cell height (px)', min_cell_width: 'Min. cell width (px)',
    fallback_cell: 'Cell', fallback_sensor: 'Sensor',
    battery_chemistry: 'Battery Chemistry', battery_type: 'Battery type',
    type_lifepo4: 'LiFePO4', type_nmc: 'NMC / NCM (Li-Ni-Mn-Co)', type_lead: 'Lead-Acid (2V cell)', type_custom: 'Custom',
    preset: 'Color preset', preset_none: 'No preset', preset1: 'Preset 1 – LiFePO4 Standard', preset2: 'Preset 2 – LiFePO4 Purple / Pink', preset3: 'Preset 3 – LiFePO4 Sunset', preset4: 'Preset 4 – LiFePO4 Neon', preset5: 'Preset 5 – LiFePO4 Ocean', preset6: 'Preset 6 – NMC / NCM', preset7: 'Preset 7 – Lead-Acid (2V cell)',
    custom_min_mv: 'Custom min voltage (mV)', custom_max_mv: 'Custom max voltage (mV)',
    custom_scale: 'Custom scale', add_stop: 'Add scale step', scale_gradient: 'Smooth color gradient (cells + legend)',
    scale_hint: 'Order = legend from top to bottom. Each step: voltage at the upper edge of its segment (must decrease downwards) and share (%) = segment height (always totals 100 %). The lower edge of the bottom step is the custom min voltage (Battery Chemistry). Everything is adjusted automatically. At least 2 steps are needed, otherwise min/max voltage is used.',
    mv: 'Top edge mV', pct: 'Share %', top: 'Top label', bottom: 'Bottom label', stop_color: 'Color', hex: 'Hex color', h: 'Hue', s: 'Saturation', l: 'Lightness',
    unit_mv: 'mV', unit_v: 'V'
  },
  de: {
    cells: 'Zellen', add_cell: 'Zelle hinzufügen', legend_sensors: 'Legenden-Sensoren',
    balancing_min_max: 'Balancing & Min. Zelle / Max. Zelle', display: 'Anzeige',
    additional_sensors: 'Zusätzliche Sensoren', add_sensor: 'Sensor hinzufügen',
    title: 'Name', theme: 'Theme', default: 'Standard', name: 'Name', icon: 'Symbol', entity: 'Entität',
    edit: 'Bearbeiten', delete: 'Löschen', move: 'Verschieben',
    soc_entity: 'Ladezustand (SOC)', watt_entity: 'Leistung (W)',
    cell_diff_sensor: 'Zellspannungsdifferenz', balance_sensor: 'Balancing aktiv (optional)',
    cell_diff: 'Differenzschwellwert (mV)', cell_bal_over: 'Balancing ab Zellspannung (mV)',
    auto_detect_low_high: 'Niedrigste / höchste Zelle automatisch erkennen',
    pack_cell_low: 'Sensor für niedrigste Zelle', pack_cell_high: 'Sensor für höchste Zelle',
    show_legend: 'Legende anzeigen', show_soc_value: 'SOC-Wert anzeigen',
    show_soc_icon: 'Laden-/Entladen-Symbol anzeigen', show_cell_diff: 'Zelldifferenz anzeigen',
    show_sync_icon: 'Synchronisationssymbol anzeigen',
    show_extra_sensors: 'Zusätzliche Sensoren anzeigen', use_3d: '3D-Rahmen',
    extra_font_scale: 'Schriftgröße für zusätzliche Sensoren',
    show_slices: 'Scheiben-Schatten', slice_strength: 'Schattenstärke',
    slice_subtle: 'Dezent', slice_medium: 'Mittel', slice_strong: 'Stark',
    cell_unit: 'Zelleneinheit', font_size: 'Schriftgröße', cell_gap: 'Zellenabstand (px)',
    container_padding: 'Kartenrand-Abstand (px)', top_padding: 'Abstand zum Titel (px)',
    overlay_opacity_pct: 'Deckkraft des Overlays (%)',
    chunk_panel: 'Zellen-Umbruch', chunk_cells: 'Zellen umbrechen aktivieren', chunk_mode: 'Umbruch-Modus',
    chunk_auto4: 'Auto 4 Zellen', chunk_auto8: 'Auto 8 Zellen', chunk_manual: 'Manuell',
    chunk_size: 'Zellen pro Zeile', cell_height: 'Zellenhöhe (px)', min_cell_width: 'Min. Zellenbreite (px)',
    fallback_cell: 'Zelle', fallback_sensor: 'Sensor',
    battery_chemistry: 'Batterie-Chemie', battery_type: 'Batterietyp',
    type_lifepo4: 'LiFePO4', type_nmc: 'NMC / NCM (Li-Ni-Mn-Co)', type_lead: 'Blei (2V-Zelle)', type_custom: 'Benutzerdefiniert',
    preset: 'Farb-Skala-Preset', preset_none: 'Kein Preset', preset1: 'Preset 1 – LiFePO4 Standard', preset2: 'Preset 2 – LiFePO4 Lila / Rosa', preset3: 'Preset 3 – LiFePO4 Sunset', preset4: 'Preset 4 – LiFePO4 Neon', preset5: 'Preset 5 – LiFePO4 Ozean', preset6: 'Preset 6 – NMC / NCM', preset7: 'Preset 7 – Blei (2V-Zelle)',
    custom_min_mv: 'Eigene Min-Spannung (mV)', custom_max_mv: 'Eigene Max-Spannung (mV)',
    custom_scale: 'Benutzerdefinierte Skala', add_stop: 'Skalen-Stufe hinzufügen', scale_gradient: 'Farbverlauf (Zellen + Legende)',
    scale_hint: 'Reihenfolge = Legende von oben nach unten. Je Stufe: Spannung an der Oberkante des Segments (muss nach unten sinken) und Anteil (%) = Segmenthöhe (ergibt immer 100 %). Die Unterkante der untersten Stufe ist die eigene Min-Spannung (Batterie-Chemie). Alles wird automatisch angepasst. Mindestens 2 Stufen nötig, sonst gelten Min-/Max-Spannung.',
    mv: 'Obergrenze mV', pct: 'Anteil %', top: 'Beschriftung oben', bottom: 'Beschriftung unten', stop_color: 'Farbe', hex: 'Hex-Farbe', h: 'Farbton', s: 'Sättigung', l: 'Helligkeit',
    unit_mv: 'mV', unit_v: 'V'
  }
};

const EDITOR_CSS = `.editor{display:flex;flex-direction:column;gap:var(--ha-space-4,8px);container-type:inline-size}.editor ha-form{display:block}.editor .list{display:flex;flex-direction:column;gap:var(--ha-space-2,4px)}.editor .row{display:grid;grid-template-columns:minmax(0,1fr) auto 37px auto;align-items:center;gap:0}.editor ha-icon-button{--ha-icon-button-size:44px;--mdc-icon-button-size:44px}.editor .entity{min-width:0}.editor .handle{width:37px;height:44px;display:flex;align-items:center;justify-content:center;cursor:grab;color:var(--secondary-text-color);touch-action:none}.editor .handle:active{cursor:grabbing}.editor .handle ha-svg-icon{width:24px;height:24px}.editor .detail{grid-column:1/-1}.editor .detail[hidden]{display:none}.editor .hint{color:var(--secondary-text-color);font-size:12px;padding:0 0 8px}.editor .sw{display:flex;align-items:center;gap:4px;padding-right:4px}.editor .sw ha-form{flex:0 0 50%;min-width:0}.editor .sw ha-form+ha-form{flex:0 0 30%}.editor .sample{width:40px;height:56px;flex:none;box-sizing:border-box;border:1px solid var(--divider-color);border-radius:6px;cursor:pointer}.editor .add{padding-top:8px}@container (max-width:480px){.editor .row:has(>.sw){grid-template-columns:minmax(0,1fr) 10cqw 8cqw 10cqw}.editor .row:has(>.sw)>ha-icon-button{--ha-icon-button-size:10cqw;--mdc-icon-button-size:10cqw}.editor .row:has(>.sw)>.handle{width:8cqw}.editor .sw{gap:1cqw;padding-right:0}.editor .sample{flex:0 0 14%;width:auto}.editor .sw ha-form{flex:0 0 44%;--text-field-padding:0 4cqw}.editor .sw ha-form+ha-form{flex:0 0 32%}}`;
const ICON_EDIT = 'M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.13,5.12L18.88,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z';
const ICON_DEL = 'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z';
const ICON_DRAG = 'M6,5H18V7H6V5M6,11H18V13H6V11M6,17H18V19H6V17Z';
const SENSOR_SELECTOR = { entity: { domain: 'sensor' } };
const ENTITY_SCHEMA = [{ name: 'entity', selector: SENSOR_SELECTOR }];
const TEXT_SEL = { text: {} };
const SCHEMA_KEYS = ['chunk_cells', 'chunk_mode', 'battery_type', 'show_legend', 'show_slices', 'auto_detect_low_high'];
const ENTITY_KEYS = ['soc_entity', 'watt_entity', 'cell_diff_sensor', 'balance_sensor', 'pack_cell_low', 'pack_cell_high'];
const bool = { boolean: {} };
const numSel = (min, max, step) => ({ number: { min, max, ...(step && { step }), mode: 'box' } });
const sliderSel = (min, max) => ({ number: { min, max, step: 1, mode: 'slider' } });
const dropdown = options => ({ select: { mode: 'dropdown', options } });
const mk = (tag, cls) => { const e = document.createElement(tag); if (cls) e.className = cls; return e; };
const lean = c => Object.fromEntries(Object.entries(c).filter(([k, v]) => !(k in DEFAULTS) || !(v == null || (k === 'theme' && v === 'default') || sig(v) === sig(DEFAULTS[k]))));

let hexCtx;
const toHex = c => {
  const s = String(c || '').trim();
  if (!s) return '#00aa00';
  const ctx = hexCtx ??= document.createElement('canvas').getContext('2d');
  ctx.fillStyle = '#000000'; ctx.fillStyle = s; const v1 = ctx.fillStyle;
  ctx.fillStyle = '#ffffff'; ctx.fillStyle = s; const v2 = ctx.fillStyle;
  return v1 === v2 && /^#[0-9a-f]{6}$/i.test(v1) ? v1.toLowerCase() : '#00aa00';
};
const hexToHsl = hex => {
  const n = parseInt(hex.slice(1), 16), r = (n >> 16 & 255) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  let h = 0, sat = 0;
  if (d) {
    sat = d / (1 - Math.abs(2 * l - 1));
    h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
  }
  return { h: Math.round(h), s: Math.round(sat * 100), l: Math.round(l * 100) };
};
const hslToHex = (h, sat, l) => {
  sat /= 100; l /= 100;
  const k = n => (n + h / 30) % 12, a = sat * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  const x = v => Math.round(v * 255).toString(16).padStart(2, '0');
  return `#${x(f(0))}${x(f(8))}${x(f(4))}`;
};

const PRESET_PCT = [5, 5, 10, 60, 10, 5, 5];
const STD_COLORS = ['#ff0000', '#ffa500', '#ffff00', '#00ee00', '#ffff00', '#ffa500', '#ff0000'];
const LFP_MV = [3650, 3550, 3450, 3380, 3200, 3000, 2800];
const LFP_TOP = ['3.65V', '3.55V', '3.45V', '3.38V'], LFP_BOT = ['3.20V', '3.00V', '2.80V', '2.60V'];
const mkPreset = (min, cols, mvs, tops, bots) => ({
  min,
  stops: cols.map((color, i) => ({ color, pct: PRESET_PCT[i], mv: mvs[i], top: i < 4 ? tops[i] : '', bottom: i > 2 ? bots[i - 3] : '' }))
});
const SCALE_PRESETS = {
  preset1: mkPreset(2600, STD_COLORS, LFP_MV, LFP_TOP, LFP_BOT),
  preset2: mkPreset(2600, ['#380070', '#8d00eb', '#ff05d5', '#ff99f0', '#ff05d5', '#8d00eb', '#380070'], [3650, 3542, 3450, 3380, 3200, 3000, 2800], LFP_TOP, ['3.20V', '3.00V', '2.80V', '2.60V']),
  preset3: mkPreset(2600, ['#be123c', '#f97316', '#fbbf24', '#10b981', '#fbbf24', '#f97316', '#be123c'], LFP_MV, LFP_TOP, LFP_BOT),
  preset4: mkPreset(2600, ['#f472b6', '#d946ef', '#a981e9', '#22d3ee', '#a981e9', '#d946ef', '#f472b6'], LFP_MV, LFP_TOP, LFP_BOT),
  preset5: mkPreset(2600, ['#fd8b8b', '#2563eb', '#38bdf8', '#34d399', '#38bdf8', '#2563eb', '#fd8b8b'], LFP_MV, LFP_TOP, LFP_BOT),
  preset6: mkPreset(3000, STD_COLORS, [4200, 4100, 4000, 3700, 3500, 3300, 3100], ['4.20V', '4.10V', '4.00V', '3.70V'], ['3.50V', '3.30V', '3.10V', '3.00V']),
  preset7: mkPreset(1800, STD_COLORS, [2450, 2350, 2250, 2100, 2000, 1900, 1850], ['2.45V', '2.35V', '2.25V', '2.10V'], ['2.00V', '1.90V', '1.85V', '1.80V'])
};

class BatteryCellsCardEditor extends HTMLElement {
  constructor() {
    super();
    this._config = {}; this._hass = null; this._built = false; this._local = ''; this._lang = 'en'; this._forms = [];
    this._presetForm = this._scalePanel = null; this._stopRefs = [];
  }
  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    const lang = (hass?.locale?.language || 'en').toLowerCase().startsWith('de') ? 'de' : 'en';
    const langChanged = lang !== this._lang;
    this._lang = lang;
    if (langChanged && this._built) return this._build();
    this.querySelectorAll('ha-form').forEach(f => { f.hass = hass; });
    if (first && this._built) this._syncForms(true);
  }
  setConfig(config) {
    const fresh = !this._built && !Object.keys(this._config).length;
    const defined = Object.fromEntries(Object.entries(config || {}).filter(([, v]) => v !== undefined));
    const empty = !Object.keys(defined).some(k => k !== 'type');
    const next = this._normalize({ ...(fresh && empty ? stubConfig() : DEFAULTS), ...defined });
    const lists = c => sig([c.cells, c.extra_sensors, c.legend_stops]);
    const listsChanged = lists(this._config) !== lists(next);
    const isOwnEcho = sig(next) === this._local;
    this._config = next;
    if (!this._built) return this._build();
    if (isOwnEcho) return;
    if (listsChanged) ['cells', 'extra_sensors', 'legend_stops'].forEach(k => this._renderList(k));
    this._syncForms(true);
  }
  _t(key) { return I18N[this._lang]?.[key] ?? I18N.en[key] ?? key; }
  _computeLabel(schema, ctx = {}) {
    if (!schema?.name) return '';
    if (schema.name === 'entity') {
      if (ctx.kind === 'cells') return `${this._t('fallback_cell')} ${ctx.index + 1}`;
      if (ctx.kind === 'extra_sensors') return `${this._t('fallback_sensor')} ${ctx.index + 1}`;
      if (ctx.addLabel) return ctx.addLabel;
    }
    return this._t(schema.name);
  }
  _normalize(c) {
    return {
      ...c,
      theme: c.theme || 'default',
      cells: arr(c.cells).map(x => ({ name: x?.name || '', entity: x?.entity || '' })),
      extra_sensors: arr(c.extra_sensors).map(x => ({ name: x?.name || '', entity: x?.entity || '', icon: x?.icon || '' })),
      legend_stops: arr(c.legend_stops).map(x => ({
        color: x?.color || '#00aa00',
        pct: Number.isFinite(Number(x?.pct)) && Number(x?.pct) > 0 ? Number(x.pct) : 10,
        mv: x?.mv != null && x.mv !== '' && Number.isFinite(Number(x.mv)) ? Number(x.mv) : 3000,
        top: x?.top || '',
        bottom: x?.bottom || ''
      }))
    };
  }
  _formData() {
    return { ...this._config, overlay_opacity_pct: Math.round((Number(this._config.overlay_opacity) || 0) * 100) };
  }
  _entityName(entity, fallback) { return this._hass?.states?.[entity]?.attributes?.friendly_name || fallback; }
  _form(schema, data, onChange, ctx = {}) {
    const form = document.createElement('ha-form');
    form.hass = this._hass;
    form.schema = schema;
    form.data = data;
    form.computeLabel = field => this._computeLabel(field, ctx);
    form.addEventListener('value-changed', e => {
      e.stopPropagation();
      if (e.detail?.value) onChange(e.detail.value);
    });
    return form;
  }

  /* ── Schemata ── */
  _topSchema() {
    const themes = Object.keys(this._hass?.themes?.themes || {}).filter(t => t !== 'default').sort().map(t => ({ value: t, label: t }));
    return [
      { name: 'title', selector: TEXT_SEL },
      { name: 'theme', selector: dropdown([{ value: 'default', label: this._t('default') }, ...themes]) }
    ];
  }
  _chemSchema() {
    const s = [{ name: 'battery_type', selector: dropdown(BATTERY_TYPES.map(v => ({ value: v, label: this._t('type_' + v) }))) }];
    if (this._config.battery_type === 'custom') s.push({ name: 'custom_min_mv', selector: numSel(1000, 5000) }, { name: 'custom_max_mv', selector: numSel(1000, 5000) });
    return s;
  }
  _scaleSchema() { return [{ name: 'scale_gradient', selector: bool }]; }
  _sensorsSchema() {
    return [
      { name: 'soc_entity', selector: SENSOR_SELECTOR },
      { name: 'watt_entity', selector: SENSOR_SELECTOR },
      { name: 'cell_diff_sensor', selector: SENSOR_SELECTOR },
      { name: 'balance_sensor', selector: { entity: {} } }
    ];
  }
  _balanceSchema() {
    const s = [
      { name: 'cell_diff', selector: numSel(1, 200) },
      { name: 'cell_bal_over', selector: numSel(1500, 4500) },
      { name: 'auto_detect_low_high', selector: bool }
    ];
    if (!this._config.auto_detect_low_high) s.push({ name: 'pack_cell_low', selector: SENSOR_SELECTOR }, { name: 'pack_cell_high', selector: SENSOR_SELECTOR });
    return s;
  }
  _displaySchema() {
    const cfg = this._config;
    return [
      { name: 'font_size', selector: numSel(4, 16, .5) },
      { name: 'overlay_opacity_pct', selector: { number: { min: 0, max: 100, step: 1, mode: 'slider', unit_of_measurement: '%' } } },
      { name: 'cell_gap', selector: numSel(0, 16) },
      { name: 'container_padding', selector: numSel(0, 40) },
      { name: 'top_padding', selector: numSel(0, 60) },
      { name: 'cell_unit', selector: dropdown([{ value: 'mV', label: this._t('unit_mv') }, { value: 'V', label: this._t('unit_v') }]) },
      { name: 'show_legend', selector: bool },
      ...(cfg.show_legend ? LEGEND_TOGGLES.map(name => ({ name, selector: bool })) : []),
      { name: 'show_extra_sensors', selector: bool },
      { name: 'use_3d', selector: bool },
      { name: 'show_slices', selector: bool },
      ...(cfg.show_slices ? [{ name: 'slice_strength', selector: dropdown(SLICE_LEVELS.map(v => ({ value: v, label: this._t('slice_' + v) }))) }] : [])
    ];
  }
  _chunkSchema() {
    const cfg = this._config, s = [{ name: 'chunk_cells', selector: bool }];
    if (cfg.chunk_cells) {
      s.push({ name: 'chunk_mode', selector: dropdown(CHUNK_MODES.map(v => ({ value: v, label: this._t('chunk_' + v) }))) });
      s.push({ name: 'cell_height', selector: numSel(CELL_H_MIN, CELL_H_MAX, 10) }, { name: 'min_cell_width', selector: numSel(MIN_CELL_W_FLOOR, 120) });
      if (cfg.chunk_mode === 'manual') s.push({ name: 'chunk_size', selector: numSel(2, 32) });
    }
    return s;
  }
  _extraSchema() {
    return [{ name: 'extra_font_scale', selector: { number: { min: 0.7, max: 1.5, step: 0.05, mode: 'slider' } } }];
  }

  /* ── Farbpresets ── */
  _presetKey() {
    const cur = JSON.stringify(this._config.legend_stops || []), min = Number(this._config.custom_min_mv);
    return Object.keys(SCALE_PRESETS).find(k => SCALE_PRESETS[k].min === min && JSON.stringify(SCALE_PRESETS[k].stops) === cur) || '';
  }
  _scalePresetForm() {
    const options = [{ value: '', label: this._t('preset_none') }, ...Object.keys(SCALE_PRESETS).map(value => ({ value, label: this._t(value) }))];
    return this._presetForm = this._form(
      [{ name: 'preset', selector: dropdown(options) }],
      { preset: this._presetKey() },
      v => {
        const p = SCALE_PRESETS[v.preset];
        if (p) this._config = { ...this._config, custom_min_mv: p.min };
        this._setList('legend_stops', p?.stops || []);
        this._syncForms(false);
      }
    );
  }

  /* ── Aufbau ── */
  _build() {
    const open = [...this.querySelectorAll('ha-expansion-panel')].map(p => !!p.expanded);
    this.style.display = 'block';
    this.replaceChildren();
    this._forms = [];
    const form = (schemaFn, fields) => {
      const fn = schemaFn.bind(this);
      const f = this._form(fn(), this._formData(), v => this._commit(v, fields));
      this._forms.push([f, fn]);
      return f;
    };
    const panel = (key, ...children) => {
      const p = document.createElement('ha-expansion-panel');
      p.header = this._t(key); p.outlined = true;
      p.append(...children);
      return p;
    };
    const style = document.createElement('style');
    style.textContent = EDITOR_CSS;
    const hint = mk('div', 'hint');
    hint.textContent = this._t('scale_hint');
    const addStop = mk('div', 'add');
    const addBtn = document.createElement('ha-button');
    addBtn.textContent = this._t('add_stop');
    addBtn.addEventListener('click', () => this._addStop());
    addStop.append(addBtn);
    this._scalePanel = panel('custom_scale', hint, this._scalePresetForm(), form(this._scaleSchema, ['scale_gradient']), this._sortable('legend_stops'), addStop);
    const root = mk('div', 'editor');
    root.append(
      form(this._topSchema, ['title', 'theme']),
      panel('battery_chemistry', form(this._chemSchema, ['battery_type', 'custom_min_mv', 'custom_max_mv'])),
      this._scalePanel,
      panel('cells',
        this._sortable('cells'),
        this._addForm(this._t('add_cell'), entity => this._setList('cells', [
          ...this._config.cells,
          { entity, name: this._entityName(entity, `${this._t('fallback_cell')} ${this._config.cells.length + 1}`) }
        ]))),
      panel('legend_sensors', form(this._sensorsSchema, ['soc_entity', 'watt_entity', 'cell_diff_sensor', 'balance_sensor'])),
      panel('balancing_min_max', form(this._balanceSchema, ['cell_diff', 'cell_bal_over', 'auto_detect_low_high', 'pack_cell_low', 'pack_cell_high'])),
      panel('display', form(this._displaySchema, [
        ...LEGEND_TOGGLES, 'show_legend', 'show_extra_sensors', 'use_3d', 'show_slices', 'slice_strength',
        'cell_unit', 'font_size', 'cell_gap', 'container_padding', 'top_padding', 'overlay_opacity'
      ])),
      panel('chunk_panel', form(this._chunkSchema, ['chunk_cells', 'chunk_mode', 'cell_height', 'min_cell_width', 'chunk_size'])),
      panel('additional_sensors',
        form(this._extraSchema, ['extra_font_scale']),
        this._sortable('extra_sensors'),
        this._addForm(this._t('add_sensor'), entity => {
          this._commit({ show_extra_sensors: true }, ['show_extra_sensors']);
          this._setList('extra_sensors', [
            ...this._config.extra_sensors,
            { entity, icon: '', name: this._entityName(entity, `${this._t('fallback_sensor')} ${this._config.extra_sensors.length + 1}`) }
          ]);
        }))
    );
    this.append(style, root);
    this._built = true;
    this.querySelectorAll('ha-expansion-panel').forEach((p, i) => { if (open[i]) p.expanded = true; });
    ['cells', 'extra_sensors', 'legend_stops'].forEach(k => this._renderList(k));
    this._syncForms(false);
    this._local = sig(this._config);
  }

  _syncForms(schema) {
    const data = this._formData();
    this._forms.forEach(([f, fn]) => {
      if (schema) f.schema = fn();
      f.data = data;
    });
    if (this._presetForm) this._presetForm.data = { preset: this._presetKey() };
    if (this._scalePanel) this._scalePanel.style.display = this._config.battery_type === 'custom' ? '' : 'none';
  }

  /* ── Listen (Zellen, Zusatzsensoren, Skalenstufen) ── */
  _sortable(kind) {
    const sortable = document.createElement('ha-sortable');
    sortable.setAttribute('handle-selector', '.handle');
    sortable.setAttribute('draggable-selector', '.row');
    sortable.addEventListener('item-moved', e => {
      const { oldIndex, newIndex } = e.detail || {};
      if (!Number.isInteger(oldIndex) || !Number.isInteger(newIndex) || oldIndex === newIndex) return;
      const list = [...this._config[kind]];
      let [item] = list.splice(oldIndex, 1);
      if (!item) return;
      if (kind === 'legend_stops') {
        const hi = list[newIndex - 1]?.mv, lo = list[newIndex]?.mv;
        item = { ...item, mv: hi != null && lo != null ? Math.round((hi + lo) / 2) : hi != null ? Math.max((Number(this._config.custom_min_mv) || 0) + 1, hi - 100) : Math.min(MV_MAX, lo + 100) };
      }
      list.splice(newIndex, 0, item);
      this._setList(kind, list, true, newIndex);
    });
    const list = mk('div', `list ${kind}`);
    sortable.append(list);
    this[`_${kind}List`] = list;
    return sortable;
  }
  _addForm(label, onAdd) {
    const form = this._form(ENTITY_SCHEMA, { entity: '' }, v => {
      if (!v.entity) return;
      onAdd(v.entity);
      form.data = { entity: '' };
    }, { addLabel: label });
    return form;
  }
  _renderList(kind) {
    if (kind === 'legend_stops') this._stopRefs = [];
    this[`_${kind}List`]?.replaceChildren(...arr(this._config[kind]).map((item, i) => kind === 'legend_stops' ? this._stopRow(item, i) : this._row(kind, item, i)));
  }
  _btn(path, key, onClick) {
    const b = document.createElement('ha-icon-button');
    b.path = path; b.label = b.title = this._t(key);
    b.addEventListener('click', onClick);
    return b;
  }
  _handle() {
    const handle = mk('div', 'handle');
    handle.tabIndex = 0;
    handle.setAttribute('aria-label', this._t('move'));
    const icon = document.createElement('ha-svg-icon');
    icon.path = ICON_DRAG;
    handle.append(icon);
    return handle;
  }
  _listRow(kind, i, main, detail, toggle) {
    const row = mk('div', 'row');
    row.append(
      main,
      this._btn(ICON_EDIT, 'edit', toggle),
      this._handle(),
      this._btn(ICON_DEL, 'delete', () => this._setList(kind, this._config[kind].filter((_, j) => j !== i))),
      detail
    );
    return row;
  }
  _row(kind, item, i) {
    const entity = this._form(ENTITY_SCHEMA, { entity: item.entity }, v => this._updateItem(kind, i, { entity: v.entity || '' }), { kind, index: i });
    entity.className = 'entity';
    const detail = mk('div', 'detail');
    detail.hidden = true;
    const fields = [{ name: 'name', selector: TEXT_SEL }, ...(kind === 'cells' ? [] : [{ name: 'icon', selector: { icon: {} } }])];
    detail.append(this._form(fields, item, v => this._updateItem(kind, i, v)));
    return this._listRow(kind, i, entity, detail, () => { detail.hidden = !detail.hidden; });
  }
  _stopRow(item, i) {
    const kind = 'legend_stops';
    const detail = mk('div', 'detail');
    detail.hidden = true;
    const toggle = () => { detail.hidden = !detail.hidden; };
    const sample = mk('div', 'sample');
    sample.tabIndex = 0;
    sample.setAttribute('role', 'button');
    sample.title = this._t('stop_color');
    sample.style.background = toHex(item.color);
    sample.addEventListener('click', toggle);
    sample.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    const num = (name, min, max) => this._form([{ name, selector: { number: { min, max, mode: 'box' } } }], item, v => this._updateItem(kind, i, { [name]: v[name] }));
    const mvForm = num('mv', 0, MV_MAX), pctForm = num('pct', 1, 100);
    this._stopRefs[i] = { mv: mvForm, pct: pctForm };
    const sw = mk('div', 'sw entity');
    sw.append(sample, mvForm, pctForm);
    sw.addEventListener('focusout', () => this._settleStops(i));

    const fromHex = hex => ({ hex, ...hexToHsl(hex) });
    let cur = fromHex(toHex(item.color));
    const colorForm = this._form(
      [{ name: 'hex', selector: TEXT_SEL }, { name: 'h', selector: sliderSel(0, 360) }, { name: 's', selector: sliderSel(0, 100) }, { name: 'l', selector: sliderSel(0, 100) }],
      cur, v => {
        let color;
        if (v.hex !== cur.hex) {
          const m = /^#?([0-9a-f]{6})$/i.exec(String(v.hex || '').trim());
          if (!m) return;
          color = '#' + m[1].toLowerCase();
          cur = fromHex(color);
        } else {
          const h = v.h ?? cur.h, sat = v.s ?? cur.s, l = v.l ?? cur.l;
          color = hslToHex(h, sat, l);
          cur = { hex: color, h, s: sat, l };
        }
        colorForm.data = cur;
        sample.style.background = color;
        this._updateItem(kind, i, { color });
      });
    detail.append(colorForm, this._form(
      [{ name: 'top', selector: TEXT_SEL }, { name: 'bottom', selector: TEXT_SEL }],
      item, v => this._updateItem(kind, i, { top: v.top, bottom: v.bottom })));
    return this._listRow(kind, i, sw, detail, toggle);
  }

  _settleStops(i) {
    const cur = this._config.legend_stops, fixed = fitStops(cur, i, this._config.custom_min_mv);
    if (JSON.stringify(fixed) === JSON.stringify(cur)) return;
    this._config.legend_stops = fixed;
    this._stopRefs.forEach((r, k) => { if (fixed[k]) { r.mv.data = fixed[k]; r.pct.data = fixed[k]; } });
    this._emit();
  }
  _addStop() {
    const list = arr(this._config.legend_stops);
    if (list.length >= MAX_STOPS) return;
    const min = Number(this._config.custom_min_mv) || 0, mv = list.length ? Math.max(min + 1, Number(list[list.length - 1].mv) - 100) : 3000;
    this._setList('legend_stops', [...list, { color: '#00aa00', pct: 10, mv, top: '', bottom: '' }], true, list.length);
  }
  _updateItem(kind, i, patch) {
    const list = [...this._config[kind]];
    list[i] = { ...list[i], ...patch };
    this._setList(kind, list, false);
  }
  _setList(kind, list, render = true, keep = -1) {
    if (kind === 'legend_stops' && render) list = fitStops(list, keep, this._config.custom_min_mv);
    this._config[kind] = list.map(x => ({ ...x }));
    if (kind === 'legend_stops' && this._presetForm) this._presetForm.data = { preset: this._presetKey() };
    if (render) this._renderList(kind);
    this._emit();
  }

  _commit(partial, fields) {
    if (partial.overlay_opacity_pct !== undefined && partial.overlay_opacity_pct !== Math.round((Number(this._config.overlay_opacity) || 0) * 100)) {
      partial = { ...partial, overlay_opacity: partial.overlay_opacity_pct / 100 };
    }
    if (fields.some(k => RANGES[k] && partial[k] !== this._config[k] && !(partial[k] >= RANGES[k][0] && partial[k] <= RANGES[k][1]))) return;
    const next = { ...this._config };
    fields.forEach(f => {
      if (partial[f] !== undefined) next[f] = partial[f];
      else if (ENTITY_KEYS.includes(f)) next[f] = null;
    });
    if (partial.custom_min_mv !== undefined && next.battery_type === 'custom' && next.legend_stops?.length) {
      next.custom_min_mv = Math.min(next.custom_min_mv, Number(next.legend_stops[next.legend_stops.length - 1].mv) - 1);
    }

    if ('chunk_cells' in partial && !!partial.chunk_cells !== !!this._config.chunk_cells) {
      const go = { ...this._config.grid_options };
      delete go.rows;
      next.grid_options = partial.chunk_cells ? go : { ...go, rows: 8 };
    }
    if (partial.battery_type && partial.battery_type !== this._config.battery_type) {
      next.cell_bal_over = BAL_DEFAULT[partial.battery_type] ?? 3000;
    }

    const schemaChanged = SCHEMA_KEYS.some(k => k in partial && partial[k] !== this._config[k]);
    this._config = this._normalize(next);
    this._emit();
    this._syncForms(schemaChanged);
  }

  _emit() {
    const config = this._normalize(this._config);
    this._local = sig(config);
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: lean(config) }, bubbles: true, composed: true }));
  }
}
if (!customElements.get('battery-cells-card-editor')) customElements.define('battery-cells-card-editor', BatteryCellsCardEditor);

/* ───────────── Registrierung ───────────── */
window.customCards = window.customCards || [];
if (!window.customCards.some(x => x.type === 'battery-cells-card')) {
  window.customCards.push({
    type: 'battery-cells-card',
    name: 'Battery Cells Card',
    preview: true,
    description: 'Battery cell monitoring and BMS visualisation (LiFePO4 / NMC / Lead / Custom)'
  });
}
