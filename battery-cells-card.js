/**
 * Battery Cells Card – Home Assistant Lovelace card for BMS cell voltages
 * (LiFePO4, NMC/NCM, lead-acid, custom scale).
 */
const VERSION = '0.9.5';
console.info(`%c 🔋 Battery Cells Card %c v${VERSION} `, 'background:linear-gradient(90deg,#f00 0%,#f00 2.5%,#ffa500 2.5%,#ffa500 5%,#ff0 5%,#ff0 7.5%,#0e0 7.5%,#0e0 100%);color:#000;font-weight:bold;padding:6px 12px;border-radius:4px;', 'color:#2e7d32;padding:4px 8px;');

/* ── Constants ── */
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
const ANIM = {
  top: { upSec: 2.5, downSec: 4.2, gap: .4, stagger: .15, thickPx: 4, thickK: .014 },
  tail: { bar1: 50, bar2: 2 },
  speed: [[.02, .2], [.1, .6], [.5, 1.3], [1, 1.6]],
  wave: { period: 72, sec: 1.6, stagger: .5 },
  pulse: { width: 56 },
  flow: { minPx: 22, maxPx: 80, fullMv: 80, pulseSec: 1.4 }
};
/* Basic factor of the charge/discharge animation: speed 1.0 in the editor = internal playback rate 0.5 */
const SPEED_BASE = .5;
const speedAt = p => {
  const T = ANIM.speed;
  if (p <= T[0][0]) return T[0][1];
  for (let i = 1; i < T.length; i++) if (p <= T[i][0]) return T[i - 1][1] + (T[i][1] - T[i - 1][1]) * (p - T[i - 1][0]) / (T[i][0] - T[i - 1][0]);
  return T[T.length - 1][1];
};
/* Single source for all animation colours: keys, defaults and editor labels are derived from here */
const FX_DEFAULT_RGB = { tip1_up: [80, 160, 255], tip1_down: [255, 95, 22], tip2_up: [80, 160, 255], tip2_down: [255, 95, 22], tip3_up: [80, 160, 255], tip3_down: [255, 95, 22], bar1_up: [20, 130, 255], bar1_down: [255, 110, 30], bar2_up: [20, 130, 255], bar2_down: [255, 40, 50], wave_up: [140, 195, 255], wave_down: [255, 30, 30], pulse_up: [140, 195, 255], pulse_down: [255, 30, 30], bf: [45, 115, 255] };
const COLOR_KEYS = Object.keys(FX_DEFAULT_RGB).map(k => 'color_' + k);
const parseRgb = v => {
  if (Array.isArray(v) && v.length >= 3) { const a = v.slice(0, 3).map(Number); return a.every(Number.isFinite) ? a.map(n => Math.max(0, Math.min(255, Math.round(n)))) : null; }
  const m = /^#?([0-9a-f]{6})$/i.exec(String(v ?? '').trim());
  return m ? [0, 2, 4].map(i => parseInt(m[1].slice(i, i + 2), 16)) : null;
};
const J = c => c.join(',');
const mixW = (c, k) => c.map(v => Math.round(v * k + 255 * (1 - k)));
const mixK = (c, k) => c.map(v => Math.round(v * k));
const FX_VARS = {
  glow: c => ({ '--ov-g1': J(mixW(c, .25)), '--ov-g2': J(mixW(c, .7)), '--ov-g3': J(c) }),
  tip: c => ({ '--ov-t1': J(mixK(c, .55)), '--ov-t2': J(c), '--ov-t3': J(mixW(c, .55)), '--ov-t4': J(mixW(c, .15)) }),
  bar2: c => ({ '--ov-fc': J(c), '--ov-fg': J(mixW(c, .5)), '--ov-fh': `rgb(${J(mixW(c, .1))})` }),
  bar1: c => FX_VARS.bar2(c),
  bf: c => ({ '--ov-bo': `rgba(${J(c)},.98)`, '--ov-bg': `rgba(${J(c)},.2)`, '--ov-bg2': `rgba(${J(c)},.3)`, '--ov-bb': `rgba(${J(mixK(c, .16))},.92)`, '--ov-b3': `rgba(${J(c)},.65)`, '--ov-b2': `rgba(${J(mixW(c, .6))},.95)`, '--ov-b1': `rgb(${J(mixW(c, .12))})`, '--ov-b4': `rgb(${J(mixW(c, .25))})`, '--ov-bs': `rgba(${J(mixW(c, .6))},.95)`, '--ov-pf': `rgba(${J(mixW(c, .6))},.9)`, '--ov-ps': `rgba(${J(c)},.7)` })
};
const FX_NAMES = [...new Set(Object.values(FX_VARS).flatMap(f => Object.keys(f([0, 0, 0]))))];
const BF_CANVAS = '<canvas class="bfx" aria-hidden="true"></canvas>';
/* Opacity curve of the balancing glow (piecewise linear, p = 0..1 per cycle) */
const BF_FLICK = [[0, .85], [.06, .45], [.09, 1], [.34, .7], [.37, 1], [.63, .5], [.66, .95], [.85, .75], [1, .85]];
const flick = p => {
  p = ((p % 1) + 1) % 1;
  for (let i = 1; i < BF_FLICK.length; i++) if (p <= BF_FLICK[i][0]) { const a = BF_FLICK[i - 1], b = BF_FLICK[i]; return a[1] + (b[1] - a[1]) * (p - a[0]) / (b[0] - a[0]); }
  return .85;
};
const FLOW_TIPS = ['off', 'tip1', 'tip2', 'tip3'], FLOW_BARS = ['off', 'bar1', 'bar2'], FLOW_GLOWS = ['off', 'pulse', 'wave'], FLOW_SPEEDS = ['manual', 'auto'];
const LEGEND_TOGGLES = ['show_soc_value', 'show_soc_icon', 'show_cell_diff', 'show_sync_icon'];
const MIN_CELL_W_FLOOR = 40, DEFAULT_MIN_CELL_W = 50, DEFAULT_CELL_H = 340, CELL_H_MIN = 280, CELL_H_MAX = 800;
const RANGES = { cell_height: [CELL_H_MIN, CELL_H_MAX], min_cell_width: [MIN_CELL_W_FLOOR, 120], flow_max_charge_w: [100, 100000], flow_max_discharge_w: [100, 100000] };
const GRADIENT_BLEND = 1.1;
const MV_MAX = 6000, MAX_STOPS = 20, PLACEHOLDER_CELLS = 4;
const LIMITS = { font_size: [4, 16], cell_gap: [0, 16], container_padding: [0, 40], top_padding: [0, 60], overlay_opacity: [0, 1], flow_speed: [0.1, 2], flow_speed_auto: [0.2, 2], cell_diff: [0, 1000], cell_bal_over: [0, MV_MAX] };

/* ── Helpers ── */
const arr = x => Array.isArray(x) ? x : [];
const normCell = x => ({ name: x?.name ?? '', entity: x?.entity ?? '' });
const normExtra = x => ({ name: x?.name || '', entity: x?.entity || '', icon: x?.icon || '' });
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
/* Settings that only change CSS variables or live values: applying them does not rebuild the DOM
   (animations keep running, no flicker in the editor preview while a slider is dragged) */
const LIVE_KEYS = ['flow_speed', 'flow_speed_auto', 'flow_speed_mode', 'flow_max_charge_w', 'flow_max_discharge_w', 'cell_diff', 'cell_bal_over', 'cell_unit', 'overlay_opacity', 'font_size', 'cell_gap', 'container_padding', 'top_padding', 'extra_font_scale', 'watt_entity', 'balance_sensor', 'auto_detect_low_high', 'pack_cell_low', 'pack_cell_high', 'grid_options', 'type', 'cell_height', ...COLOR_KEYS];
const structSig = c => { const o = { ...c }; LIVE_KEYS.forEach(k => delete o[k]); return sig(o); };

function roundPath(pts, r) {
  const p = pts.filter((q, i) => !i || q[0] !== pts[i - 1][0] || q[1] !== pts[i - 1][1]);
  let d = `M${p[0][0]} ${p[0][1]}`;
  for (let i = 1; i < p.length - 1; i++) {
    const a = p[i - 1], b = p[i], c = p[i + 1];
    const l1 = Math.hypot(b[0] - a[0], b[1] - a[1]), l2 = Math.hypot(c[0] - b[0], c[1] - b[1]);
    const k = Math.min(r, l1 / 2, l2 / 2);
    d += `L${(b[0] + (a[0] - b[0]) / l1 * k).toFixed(1)} ${(b[1] + (a[1] - b[1]) / l1 * k).toFixed(1)}Q${b[0]} ${b[1]} ${(b[0] + (c[0] - b[0]) / l2 * k).toFixed(1)} ${(b[1] + (c[1] - b[1]) / l2 * k).toFixed(1)}`;
  }
  const e = p[p.length - 1];
  return `${d}L${e[0]} ${e[1]}`;
}

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

/* HA sections view: card height = rows * 56px + (rows - 1) * 8px. The cell height is the card height minus title, padding etc. */
const HA_ROW = 56, HA_ROW_GAP = 8, MIN_ROWS = 6;
const chromePx = c => 41 + c.top_padding + 2 * c.container_padding + (c.use_3d ? 8 : 0) + (c.show_extra_sensors && c.extra_sensors.length ? 32 : 0);
const rowsFor = c => Math.max(MIN_ROWS, Math.round((c.cell_height + chromePx(c) + HA_ROW_GAP) / (HA_ROW + HA_ROW_GAP)));
const heightFor = (rows, c) => Math.round(clamp(rows * (HA_ROW + HA_ROW_GAP) - HA_ROW_GAP - chromePx(c), CELL_H_MIN, CELL_H_MAX, DEFAULT_CELL_H));

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

/* ── Configuration ── */
const DEFAULTS = {
  title: 'Battery Cells', theme: '', container_padding: 10, top_padding: 20, cell_gap: 4,
  use_3d: false, show_slices: false, slice_strength: 'subtle',
  show_legend: true, show_soc_icon: true, show_soc_value: true, show_sync_icon: true, show_cell_diff: true,
  show_extra_sensors: false, show_balance_flow: false, ...Object.fromEntries(COLOR_KEYS.map(k => [k, null])), show_flow: false, flow_sync: false, flow_tip: 'tip1', flow_bar: 'off', flow_glow: 'off', flow_speed_mode: 'manual', flow_speed: 1, flow_speed_auto: 1, flow_max_charge_w: 3000, flow_max_discharge_w: 3000, extra_sensors: [], extra_font_scale: 1, overlay_opacity: .7, font_size: 8,
  soc_entity: null, watt_entity: null, balance_sensor: null, cell_diff_sensor: null,
  cell_diff: 8, cell_bal_over: 3000, cell_unit: 'mV',
  auto_detect_low_high: true, pack_cell_low: null, pack_cell_high: null,
  chunk_cells: false, chunk_mode: 'auto8', chunk_size: 8, cell_height: DEFAULT_CELL_H, min_cell_width: DEFAULT_MIN_CELL_W,
  battery_type: 'lifepo4', custom_min_mv: 2600, custom_max_mv: 3650, legend_stops: [], scale_gradient: false, cells: []
};
const stubConfig = () => ({
  ...DEFAULTS,
  font_size: 6,
  use_3d: true,
  show_slices: true,
  slice_strength: 'subtle',
  chunk_cells: false,
  chunk_mode: 'auto8',
  cell_height: 351,
  soc_entity: 'sensor.status_of_charge',
  watt_entity: 'sensor.pack_watt',
  cell_diff_sensor: 'sensor.delta_mvolts_between_cells',
  cells: Array.from({ length: 8 }, (_, i) => ({ name: `Cell ${i + 1}`, entity: `sensor.cell${i + 1}` })),
  grid_options: { columns: 24, rows: 7 }
});

function normalizeConfig(config = {}) {
  const c = { ...DEFAULTS, ...config };
  for (const k in DEFAULTS) if (c[k] == null) c[k] = DEFAULTS[k];
  c.cells = arr(c.cells).map(normCell);
  if (!c.cells.length) c.cells = Array.from({ length: PLACEHOLDER_CELLS }, (_, i) => ({ name: String(i + 1), entity: '' }));
  c.extra_sensors = arr(c.extra_sensors).map(normExtra);
  c.legend_stops = arr(c.legend_stops).filter(Boolean);
  c.battery_type = pick(c.battery_type, BATTERY_TYPES, 'lifepo4');
  c.slice_strength = pick(c.slice_strength, SLICE_LEVELS, 'subtle');
  c.chunk_mode = pick(c.chunk_mode, CHUNK_MODES, 'auto8');
  c.flow_tip = pick(c.flow_tip, FLOW_TIPS, 'tip1');
  c.flow_bar = pick(c.flow_bar, FLOW_BARS, 'off');
  c.flow_glow = pick(c.flow_glow, FLOW_GLOWS, 'off');
  c.flow_speed_mode = pick(c.flow_speed_mode, FLOW_SPEEDS, 'manual');
  c.cell_unit = pick(c.cell_unit, ['mV', 'V'], 'mV');
  c.grid_options = { columns: config.grid_options?.columns ?? 12 };
  for (const k in RANGES) c[k] = clamp(c[k], ...RANGES[k], DEFAULTS[k]);
  for (const k in LIMITS) c[k] = clamp(c[k], ...LIMITS[k], DEFAULTS[k]);
  c.chunk_size = clamp(c.chunk_size, 2, 32, 8);
  c.extra_font_scale = clamp(c.extra_font_scale, 0.7, 1.5, 1);
  return c;
}

/* ── Scale ── */
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
  for (let i = 1; i < stops.length; i++) stops[i].mv = Math.min(stops[i].mv, stops[i - 1].mv - 1);
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

/* ── Styles ── */
/* Adds the pause between two cycles: scales all keyframe percentages and holds the last frame */
function withCycleGap(css) {
  return css.replace(/@keyframes ([\w-]+)\{((?:[^{}]*\{[^{}]*\})+)\}/g, (all, name, body) => {
    if (/^(wv|bf)-/.test(name)) return all;
    const total = /-dn$/.test(name) ? ANIM.top.downSec : ANIM.top.upSec, k = Math.max(.5, 1 - ANIM.top.gap / total);
    let last = '';
    const frames = body.replace(/([^{}]+)\{([^{}]*)\}/g, (m, sel, decl) => {
      last = decl.replace(/;?animation-timing-function:cubic-bezier\([^)]*\)/, '');
      return `${sel.replace(/([\d.]+)%/g, (x, p) => +(p * k).toFixed(2) + '%')}{${decl}}`;
    });
    return `@keyframes ${name}{${frames}100%{${last}}}`;
  });
}
/* Cell animations share duration, delay and easing; only the keyframe name differs per element.
   [selector, keyframe base name] – the keyframes are called <base>-up (charging) and <base>-dn (discharging). */
const FX_ANIM = [
  ['.tg', 'tg'], ['.tg:not(.t2):not(.t3)', 'tg1'], ['.tg.t3', 'tg3'], ['.tb.t3', 'tg3'],
  ['.tb', 'tb'], ['.tg.t2::before', 'tb'], ['.tb.t1', 'tb1'], ['.tg:not(.t2):not(.t3)::after', 'tb1'],
  ['.tb.t3::before', 't3f'], ['.tb.t3::after', 't3r'], ['.tg.t3::before', 't3s'],
  ['.tl', 'tl'], ['.tl.l2', 'tl2'], ['.pv::before', 'pv-edge'], ['.pvi', 'pv'], ['.pt', 'pt']
];
const FX_ANIM_CSS = `[data-flow=up]{--dur:${ANIM.top.upSec}s}[data-flow=down]{--dur:${ANIM.top.downSec}s}`
  + `[data-flow] :is(.tg,.tb,.tl,.pvi,.pt),[data-flow] :is(.tg,.tb)::before,[data-flow] :is(.tg,.tb)::after,[data-flow] .pv::before{animation-duration:var(--dur);animation-delay:calc(var(--ci,0) * -${ANIM.top.stagger}s);animation-timing-function:linear;animation-iteration-count:infinite}`
  + FX_ANIM.map(([sel, base]) => `[data-flow=up] ${sel}{animation-name:${base}-up}[data-flow=down] ${sel}{animation-name:${base}-dn}`).join('');
const CARD_STYLE = withCycleGap(`:host{display:block;width:100%;box-sizing:border-box}:host([fill]){height:100%}.card>*{--u:min(1vw,3.2cqw)}.compact>*{--u:min(1vw,1.8cqw)}.card{position:relative;container-type:inline-size;isolation:isolate;width:100%;box-sizing:border-box;border-radius:var(--ha-card-border-radius,12px);box-shadow:var(--ha-card-box-shadow,0 2px 4px rgba(0,0,0,.1));overflow:hidden;display:flex;flex-direction:column;padding:var(--bcc-pad)}.fill{height:100%}.sl-subtle{--slh:.1;--sll:.1;--slg:.25;--sla:92%;--slb:95%}.sl-medium{--slh:.2;--sll:.2;--slg:.5;--sla:88%;--slb:92%}.sl-strong{--slh:.4;--sll:.4;--slg:.85;--sla:84%;--slb:86%}.title{color:var(--primary-text-color);font-size:var(--bcc-title);font-weight:400;padding:12px 0 var(--bcc-top) 16px;margin:0;flex-shrink:0}.extra{display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;padding:0 8px 10px 12px;flex-shrink:0}.extra[hidden]{display:none}.xi{display:inline-flex;align-items:center;gap:6px;color:var(--primary-text-color);font-family:var(--ha-font-family-body,var(--paper-font-body1_-_font-family,Roboto,Noto,sans-serif));font-size:calc(var(--ha-font-size-m,14px) * var(--bcc-efs,1));font-weight:500;line-height:1.3;padding:2px 4px;border-radius:4px}.xi:hover{background:rgba(127,127,127,.12)}.xi ha-state-icon{--mdc-icon-size:1.35em;color:var(--primary-color)}.xn{color:var(--secondary-text-color);font-weight:400;margin-right:2px}.xv{font-weight:600;font-variant-numeric:tabular-nums}.xu{color:var(--secondary-text-color);font-size:.9em;margin-left:2px}[data-e]{cursor:pointer}[data-e]:focus-visible{outline:2px solid var(--primary-color);outline-offset:1px}.content{display:flex;flex-direction:column;gap:12px;width:100%;--sh:clamp(1.5px,0.9cqw,6px);--bl:clamp(3px,1.15cqw,9px);--side:max(3px,min(1.2cqw,8px));--frame:clamp(7px,2.2cqw,32px)}.d3 .content{padding-top:max(8px,calc(var(--frame)*0.45));box-sizing:border-box}.fill .content{flex:1 1 auto;min-height:0}.row{display:flex;gap:var(--bcc-gap);align-items:flex-end;width:100%;box-sizing:border-box;height:var(--bcc-cellh);min-height:var(--bcc-cellh);flex:0 0 auto}.fill .row{height:auto;min-height:${CELL_H_MIN}px;flex:1 1 var(--bcc-base)}.fill .w{display:flex;height:auto;align-self:stretch}.fill .bar,.fill .inner{height:auto;flex:1 1 auto}.w{position:relative;border-radius:4px;overflow:hidden;box-sizing:border-box;height:100%;flex:1 1 0;min-width:0;padding-block:9px;padding-inline:var(--side)}.bar,.inner{position:relative;width:100%;height:100%;border-radius:1px;overflow:hidden}.bar{background:var(--bcc-grad)}.inner{display:flex;flex-direction:column}.d3 .bar,.d3 .inner{border-radius:2px}.bar::before{content:'';position:absolute;inset:0;pointer-events:none;z-index:1;border-radius:inherit;background:linear-gradient(115deg,rgba(255,255,255,.35) 0%,rgba(255,255,255,.1) 14%,rgba(255,255,255,0) 32%,rgba(0,0,0,0) 66%,rgba(0,0,0,.22) 100%);mix-blend-mode:overlay}.d3 .bar::after,.d3 .inner::after{content:'';position:absolute;inset:0;pointer-events:none;border-radius:inherit;z-index:1;box-shadow:inset 0 2px 3px rgba(0,0,0,.45),inset 0 -1px 2px rgba(255,255,255,.1),inset var(--sh) 0 var(--bl) rgba(0,0,0,.55),inset calc(-1*var(--sh)) 0 var(--bl) rgba(0,0,0,.55),inset calc(var(--sh)*2) 0 calc(var(--bl)*1.6) rgba(0,0,0,.28),inset calc(-2*var(--sh)) 0 calc(var(--bl)*1.6) rgba(0,0,0,.28)}.sl .bar::after,.sl .inner::after{content:'';position:absolute;inset:0;pointer-events:none;border-radius:inherit;z-index:1;background:linear-gradient(180deg,rgba(255,255,255,var(--slh)) 0,rgba(255,255,255,calc(var(--slh)*.3)) 18%,rgba(255,255,255,0) 40%,rgba(0,0,0,.05) 62%,rgba(0,0,0,var(--sll)) var(--sla),rgba(0,0,0,var(--slg)) var(--slb),rgba(0,0,0,var(--slg)) 100%) 0 0/100% 5% repeat-y}.ov{position:absolute;inset:0;background:rgba(0,0,0,var(--bcc-op));z-index:2;pointer-events:none}.name,.val{position:absolute;left:50%;transform:translateX(-50%);z-index:3;width:90%;pointer-events:none;text-align:center;color:#fff;text-shadow:0 0 6px #000;font-weight:700;line-height:1.1}.name{top:4px;white-space:normal;word-break:break-word;font-size:calc(var(--bcc-fs)*1.2px + .6*var(--u))}.val{bottom:4px;display:flex;flex-direction:column;align-items:center;white-space:nowrap;text-shadow:0 1px 2px #000,0 0 4px #000}.num{font-size:calc(var(--bcc-fs)*1.5px + .6*var(--u))}.unit{font-size:.85em;line-height:1}.seg{position:relative;overflow:hidden;pointer-events:none}.lab{position:absolute;left:0;right:0;text-align:center;font-weight:700;color:#fff;text-shadow:0 1px 2px #000,0 0 4px #000;pointer-events:none;font-size:calc(var(--bcc-fs)*1.2px + .5*var(--u));z-index:3}.lab.t{top:-3px}.lab.b{bottom:-4px}
.bar{--th:clamp(17.5px,calc((${ANIM.top.thickPx * 2}px + var(--bcc-cellh) * ${ANIM.top.thickK * 2}) * 1.25),45px)}[data-flow=up] .bar{--t1:var(--ov-t1,44,88,140);--t2:var(--ov-t2,80,160,255);--t3:var(--ov-t3,159,203,255);--t4:var(--ov-t4,229,241,255);--fc:var(--ov-fc,20,130,255);--fg:var(--ov-fg,138,193,255);--fh:var(--ov-fh,#e8f3ff);--fdir:bottom;--fpos:50% 0%}[data-flow=down] .bar{--t1:var(--ov-t1,150,25,12);--t2:var(--ov-t2,255,95,22);--t3:var(--ov-t3,255,175,60);--t4:var(--ov-t4,255,235,175);--fc:var(--ov-fc,255,110,30);--fg:var(--ov-fg,255,190,120);--fh:var(--ov-fh,#fff1d6);--fdir:top;--fpos:50% 100%}
.tg{--h1:max(5%,8px);display:none;position:absolute;left:0;right:0;bottom:calc(var(--fp,100) * 1% - var(--h1));height:var(--h1);transform-origin:50% 0;z-index:2;pointer-events:none;opacity:0;background-image:linear-gradient(to bottom,rgba(var(--t4),1) 0,rgba(var(--t3),1) 22%,rgba(var(--t2),.92) 70%,rgba(var(--t1),0) 100%)}.tg:not(.t2):not(.t3)::after{content:'';position:absolute;left:0;right:0;top:0;height:70%;pointer-events:none;opacity:0;background:linear-gradient(to bottom,rgba(255,255,255,1) 0,rgba(var(--t4),.85) 35%,rgba(var(--t3),.3) 75%,rgba(var(--t3),0) 100%)}.tg.t2{bottom:calc(var(--fp,100) * 1% - var(--th));height:var(--th);background-image:linear-gradient(to bottom,rgba(var(--t4),.98) 0,rgba(var(--t3),.88) 10%,rgba(var(--t2),.7) 50%,rgba(var(--t2),.26) 78%,rgba(var(--t1),0) 100%)}.tg.t2::before{content:'';position:absolute;left:0;right:0;top:0;height:70%;pointer-events:none;opacity:0;background:linear-gradient(to bottom,rgba(255,255,255,.6) 0,rgba(var(--t4),.4) 40%,rgba(var(--t4),0) 100%)}.tg.t2::after{content:'';position:absolute;left:0;right:0;top:0;height:2px;pointer-events:none;background:rgba(var(--t4),.95);box-shadow:0 0 6px 1px rgba(var(--t3),.8)}.tg.t3{--h3:clamp(9px,3.6%,26px);bottom:calc(var(--fp,100) * 1% - var(--h3));height:var(--h3);background-image:linear-gradient(to bottom,rgba(var(--t4),1) 0,rgba(var(--t3),.92) 20%,rgba(var(--t2),.62) 58%,rgba(var(--t1),0) 100%)}.tg.t3::before{content:'';position:absolute;left:6%;right:6%;bottom:100%;height:calc(var(--th) * 1.7);transform-origin:50% 100%;opacity:0;pointer-events:none;background:radial-gradient(circle at 10% 70%,#fff 0 1.2px,transparent 2.2px),radial-gradient(circle at 24% 38%,rgba(var(--t4),1) 0 1.4px,transparent 2.4px),radial-gradient(circle at 37% 78%,#fff 0 1px,transparent 2px),radial-gradient(circle at 50% 22%,rgba(var(--t4),1) 0 1.6px,transparent 2.6px),radial-gradient(circle at 63% 62%,#fff 0 1.2px,transparent 2.2px),radial-gradient(circle at 76% 30%,rgba(var(--t4),1) 0 1.4px,transparent 2.4px),radial-gradient(circle at 90% 74%,#fff 0 1px,transparent 2px)}.tg.t3::after{content:'';position:absolute;left:0;right:0;top:0;height:2px;pointer-events:none;background:rgba(var(--t4),1);box-shadow:0 0 8px 2px rgba(var(--t3),.9)}.tg.t2.gwn,.tg.t3.gwn,.tb.gwn{left:2px;right:2px}.tb{display:none;position:absolute;left:0;right:0;bottom:calc(var(--fp,100) * 1%);height:calc(var(--th) * .9);z-index:2;pointer-events:none;opacity:0;background:linear-gradient(to top,rgba(var(--t4),.75) 0,rgba(var(--t3),.4) 40%,rgba(var(--t3),0) 100%)}.tb.t1{height:calc(var(--th) * 1.1);background:linear-gradient(to top,rgba(var(--t4),.95) 0,rgba(var(--t3),.55) 40%,rgba(var(--t3),0) 100%)}.tb.t3{height:calc(var(--th) * 1.1)}.tb.t3::before{content:'';position:absolute;left:-6%;right:-6%;bottom:calc(var(--th) * -.9);height:calc(var(--th) * 1.8);opacity:0;pointer-events:none;background:radial-gradient(ellipse 50% 50% at 50% 50%,rgba(255,255,255,.95) 0,rgba(var(--t4),.8) 18%,rgba(var(--t3),.45) 42%,rgba(var(--t2),0) 75%)}.tb.t3::after{content:'';position:absolute;left:8%;right:8%;bottom:calc(var(--th) * -.5);height:var(--th);box-sizing:border-box;border:2px solid rgba(var(--t4),.95);border-radius:50%;box-shadow:0 0 8px 1px rgba(var(--t3),.8),inset 0 0 6px rgba(var(--t3),.6);opacity:0;pointer-events:none}[data-flow=up] .tg,[data-flow=down] .tg,[data-flow=up] .tb,[data-flow=down] .tb{display:block}
.ag{display:none;position:absolute;left:0;right:0;bottom:0;height:0;overflow:hidden;z-index:2;pointer-events:none}[data-flow=up] .ag,[data-flow=down] .ag{display:block}.tl{--ft:clamp(2px,calc(var(--bcc-cellh) * .015),8px);--ft2:max(1.5px,calc(var(--ft)*.35));position:absolute;left:0;right:0;top:0;height:100%;opacity:0}.tl::before,.tl::after{content:'';position:absolute;left:0;right:0;pointer-events:none}.tl::before{height:var(--tn,${ANIM.tail.bar1}%);background:linear-gradient(to var(--fdir),rgba(var(--fc),.8) 0,rgba(var(--fc),.58) 10%,rgba(var(--fc),.4) 20%,rgba(var(--fc),.26) 30%,rgba(var(--fc),.16) 40%,rgba(var(--fc),.09) 50%,rgba(var(--fc),.045) 60%,rgba(var(--fc),.018) 70%,rgba(var(--fc),.005) 80%,rgba(var(--fc),0) 100%);-webkit-mask-image:radial-gradient(ellipse 85% 130% at var(--fpos),#000 40%,transparent 100%);mask-image:radial-gradient(ellipse 85% 130% at var(--fpos),#000 40%,transparent 100%)}[data-flow=up] .tl::before{top:0}[data-flow=down] .tl::before{bottom:0}.tl.l2::before{--tn:min(100%,calc(var(--fp,100) * ${ANIM.tail.bar1 * ANIM.tail.bar2 / 100}%))}.tl::after{height:var(--ft2);background:var(--fh);box-shadow:0 0 4px 1px rgba(var(--fg),.9),0 0 12px 3px rgba(var(--fc),.6)}[data-flow=up] .tl::after{top:0}[data-flow=down] .tl::after{bottom:0}.tl.l2{top:auto;bottom:0;height:calc(100% * 100 / var(--fp,100))}
${FX_ANIM_CSS}
@keyframes tg-up{0%{opacity:.55;transform:scaleY(.9);animation-timing-function:cubic-bezier(.2,.6,.4,1)}45%{opacity:0;transform:scaleY(.6);animation-timing-function:cubic-bezier(.45,0,.85,.5)}96%{opacity:1;transform:scaleY(1)}100%{opacity:.55;transform:scaleY(.9)}}@keyframes tg-dn{0%{opacity:0;transform:scaleY(.5);animation-timing-function:cubic-bezier(.45,0,.85,.5)}42%{opacity:1;transform:scaleY(1);animation-timing-function:cubic-bezier(.15,.6,.4,1)}100%{opacity:0;transform:scaleY(.85)}}@keyframes tb-up{0%{opacity:.55;animation-timing-function:cubic-bezier(.2,.6,.4,1)}45%{opacity:0;animation-timing-function:cubic-bezier(.45,0,.85,.5)}96%{opacity:1}100%{opacity:.55}}@keyframes tb-dn{0%{opacity:0;animation-timing-function:cubic-bezier(.45,0,.85,.5)}42%{opacity:1;animation-timing-function:cubic-bezier(.15,.6,.4,1)}100%{opacity:0}}
@keyframes tg1-up{0%{opacity:1;transform:scaleY(1)}6%{opacity:1;transform:scaleY(1);animation-timing-function:cubic-bezier(.2,.6,.4,1)}50%{opacity:0;transform:scaleY(.7);animation-timing-function:cubic-bezier(.45,0,.85,.5)}96%{opacity:1;transform:scaleY(1)}100%{opacity:1;transform:scaleY(1)}}@keyframes tg1-dn{0%{opacity:0;transform:scaleY(.5);animation-timing-function:cubic-bezier(.45,0,.85,.5)}42%{opacity:1;transform:scaleY(1)}50%{opacity:1;transform:scaleY(1);animation-timing-function:cubic-bezier(.2,.6,.4,1)}100%{opacity:0;transform:scaleY(.85)}}@keyframes tb1-up{0%{opacity:1}6%{opacity:1;animation-timing-function:cubic-bezier(.2,.6,.4,1)}50%{opacity:0;animation-timing-function:cubic-bezier(.45,0,.85,.5)}96%{opacity:1}100%{opacity:1}}@keyframes tb1-dn{0%{opacity:0;animation-timing-function:cubic-bezier(.45,0,.85,.5)}42%{opacity:1}50%{opacity:1;animation-timing-function:cubic-bezier(.2,.6,.4,1)}100%{opacity:0}}
@keyframes tg3-up{0%{opacity:.75}12%{opacity:.45}40%{opacity:.15}70%{opacity:.3}90%{opacity:.5}95%{opacity:.62}96%{opacity:1}100%{opacity:.75}}@keyframes tg3-dn{0%{opacity:.2}10%{opacity:.12}17%{opacity:.3}24%{opacity:.16}31%{opacity:.4}37%{opacity:.26}41%{opacity:.55}42%{opacity:1}52%{opacity:.8}70%{opacity:.45}100%{opacity:.2}}@keyframes t3f-up{0%{opacity:.5;transform:scale(1.2)}7%{opacity:0;transform:scale(1.5)}95%{opacity:0;transform:scale(.3)}96%{opacity:1;transform:scale(.4)}98%{opacity:.85;transform:scale(1)}100%{opacity:.5;transform:scale(1.2)}}@keyframes t3f-dn{0%,41%{opacity:0;transform:scale(.3)}42%{opacity:1;transform:scale(.4)}46%{opacity:.8;transform:scale(1)}56%{opacity:0;transform:scale(1.5)}100%{opacity:0;transform:scale(1.5)}}@keyframes t3r-up{0%{opacity:.55;transform:scale(1)}14%{opacity:0;transform:scale(1.7)}95%{opacity:0;transform:scale(.2)}96%{opacity:.9;transform:scale(.2)}100%{opacity:.55;transform:scale(1)}}@keyframes t3r-dn{0%,41%{opacity:0;transform:scale(.2)}42%{opacity:.9;transform:scale(.2)}50%{opacity:.5;transform:scale(1)}62%{opacity:0;transform:scale(1.7)}100%{opacity:0;transform:scale(1.7)}}@keyframes t3s-up{0%{opacity:.5;transform:scale(1.3)}9%{opacity:0;transform:scale(1.7)}95%{opacity:0;transform:scale(.2)}96%{opacity:1;transform:scale(.25)}100%{opacity:.5;transform:scale(1.3)}}@keyframes t3s-dn{0%,41%{opacity:0;transform:scale(.2)}42%{opacity:1;transform:scale(.25)}52%{opacity:.55;transform:scale(1.2)}60%{opacity:0;transform:scale(1.7)}100%{opacity:0;transform:scale(1.7)}}
@keyframes tl-up{0%{transform:translateY(100%);opacity:1}96%{transform:translateY(0);opacity:1}100%{transform:translateY(0);opacity:0}}@keyframes tl-dn{0%,41.9%{transform:translateY(-100%);opacity:0}42%{transform:translateY(-100%);opacity:1}94%{transform:translateY(0);opacity:1}100%{transform:translateY(60%);opacity:0}}@keyframes tl2-up{0%{transform:translateY(100%);opacity:1}96%{transform:translateY(calc(100% - var(--fp,100)*1%));opacity:1}100%{transform:translateY(calc(100% - var(--fp,100)*1%));opacity:0}}@keyframes tl2-dn{0%,41.9%{transform:translateY(calc(var(--fp,100)*-1%));opacity:0}42%{transform:translateY(calc(var(--fp,100)*-1%));opacity:1}94%{transform:translateY(0);opacity:1}100%{transform:translateY(60%);opacity:0}}
.gl{display:none;position:absolute;left:0;right:0;bottom:0;height:0;overflow:hidden;z-index:2;pointer-events:none}[data-flow=up] .gl,[data-flow=down] .gl{display:block}[data-flow=up] .gl{--g1:var(--ov-g1,226,240,255);--g2:var(--ov-g2,175,213,255);--g3:var(--ov-g3,140,195,255)}[data-flow=down] .gl{--g1:var(--ov-g1,255,205,150);--g2:var(--ov-g2,255,80,40);--g3:var(--ov-g3,255,30,30)}.wv{display:none;position:absolute;top:0;bottom:0;left:0;width:34%;overflow:hidden;pointer-events:none;-webkit-mask-image:linear-gradient(to right,#000 0,rgba(0,0,0,.55) 35%,transparent 100%);mask-image:linear-gradient(to right,#000 0,rgba(0,0,0,.55) 35%,transparent 100%)}.wv.r{left:auto;right:0;-webkit-mask-image:linear-gradient(to left,#000 0,rgba(0,0,0,.55) 35%,transparent 100%);mask-image:linear-gradient(to left,#000 0,rgba(0,0,0,.55) 35%,transparent 100%)}[data-flow=up] .wv,[data-flow=down] .wv{display:block}.wvi{position:absolute;left:0;right:0;top:0;height:calc(100% + ${ANIM.wave.period}px);background:repeating-linear-gradient(to bottom,rgba(var(--g3),0) 0,rgba(var(--g2),.6) ${ANIM.wave.period / 8}px,rgba(var(--g1),1) ${ANIM.wave.period / 4}px,rgba(var(--g2),.6) ${ANIM.wave.period * .375}px,rgba(var(--g3),0) ${ANIM.wave.period / 2}px,rgba(var(--g3),0) ${ANIM.wave.period}px)}[data-flow=up] .wvi{animation:wv-up ${ANIM.wave.sec}s linear infinite;animation-delay:calc(var(--ci,0)*-${ANIM.wave.stagger}s)}[data-flow=down] .wvi{animation:wv-dn ${ANIM.wave.sec}s linear infinite;animation-delay:calc(var(--ci,0)*-${ANIM.wave.stagger}s)}@keyframes wv-up{from{transform:translateY(0)}to{transform:translateY(-${ANIM.wave.period}px)}}@keyframes wv-dn{from{transform:translateY(-${ANIM.wave.period}px)}to{transform:translateY(0)}}
.pv{display:none;position:absolute;top:0;bottom:0;left:0;width:${ANIM.pulse.width}%;overflow:hidden;pointer-events:none;background:linear-gradient(to right,rgba(var(--g2),.4) 0,rgba(var(--g3),.2) 28%,rgba(var(--g3),.08) 60%,rgba(var(--g3),0) 100%)}.pv.r{left:auto;right:0;background:linear-gradient(to left,rgba(var(--g2),.4) 0,rgba(var(--g3),.2) 28%,rgba(var(--g3),.08) 60%,rgba(var(--g3),0) 100%)}[data-flow=up] .pv,[data-flow=down] .pv{display:block}.pv::before{content:'';position:absolute;top:0;bottom:0;left:0;width:2px;background:rgba(var(--g1),.9);box-shadow:0 0 12px 2px rgba(var(--g2),.6);opacity:.45}.pv.r::before{left:auto;right:0}.pvi{position:absolute;inset:0;transform-origin:0 50%;opacity:0;background:linear-gradient(to right,rgba(var(--g2),.85) 0,rgba(var(--g3),.58) 18%,rgba(var(--g3),.22) 38%,rgba(var(--g3),.1) 60%,rgba(var(--g3),.03) 82%,rgba(var(--g3),0) 100%)}.pt{display:none;position:absolute;left:0;right:0;top:0;height:clamp(12px,5%,30px);pointer-events:none;opacity:0;background:linear-gradient(to bottom,rgba(var(--g1),.85) 0,rgba(var(--g2),.5) 28%,rgba(var(--g3),.18) 62%,rgba(var(--g3),0) 100%);-webkit-mask-image:linear-gradient(to right,rgba(0,0,0,.45) 0,#000 50%,rgba(0,0,0,.45) 100%);mask-image:linear-gradient(to right,rgba(0,0,0,.45) 0,#000 50%,rgba(0,0,0,.45) 100%)}.pt::before{content:'';position:absolute;left:0;right:0;top:0;height:2px;background:rgba(var(--g1),1);box-shadow:0 0 8px 2px rgba(var(--g2),.8)}[data-flow=up] .pt,[data-flow=down] .pt{display:block}.pv.r .pvi{transform-origin:100% 50%;background:linear-gradient(to left,rgba(var(--g2),.85) 0,rgba(var(--g3),.58) 18%,rgba(var(--g3),.22) 38%,rgba(var(--g3),.1) 60%,rgba(var(--g3),.03) 82%,rgba(var(--g3),0) 100%)}@keyframes pv-up{0%{transform:scaleX(.3);opacity:0;animation-timing-function:cubic-bezier(.45,0,.85,.5)}96%{transform:scaleX(1);opacity:1}100%{transform:scaleX(1);opacity:0}}@keyframes pv-dn{0%{transform:scaleX(1);opacity:0;animation-timing-function:cubic-bezier(.45,0,.85,.5)}42%{transform:scaleX(.8);opacity:1;animation-timing-function:cubic-bezier(.15,.6,.4,1)}100%{transform:scaleX(.3);opacity:0}}@keyframes pv-edge-up{0%{opacity:.45}96%{opacity:.95}100%{opacity:.45}}@keyframes pv-edge-dn{0%{opacity:.45}42%{opacity:.95}100%{opacity:.45}}@keyframes pt-up{0%{opacity:.35;animation-timing-function:cubic-bezier(.45,0,.85,.5)}96%{opacity:1}100%{opacity:.35}}@keyframes pt-dn{0%{opacity:.35;animation-timing-function:cubic-bezier(.45,0,.85,.5)}42%{opacity:1;animation-timing-function:cubic-bezier(.15,.6,.4,1)}100%{opacity:.35}}.paused *,.paused *::before,.paused *::after{animation-play-state:paused!important}
.soc,.diff,.bat,.sync{position:absolute;left:50%;transform:translate(-50%,-50%);z-index:3}.soc,.diff{font-weight:700;color:#fff;text-align:center;box-sizing:border-box}.soc{top:49%;width:94%;text-shadow:0 0 6px #000;white-space:nowrap;font-size:min(clamp(7px,calc(var(--bcc-fs)*1px + 1.2*var(--u)),18px),calc(var(--bcc-cellh)*.085));line-height:1}.diff{top:57%;width:90%;max-width:90%;text-shadow:0 0 3px #000;white-space:normal;font-size:min(clamp(6px,calc(var(--bcc-fs)*.7px + .6*var(--u)),14px),calc(var(--bcc-cellh)*.06));line-height:1}.bat{top:36%;filter:drop-shadow(0 0 6px #000);--mdc-icon-size:min(calc(var(--bcc-fs)*2.8px + 1.6*var(--u)),calc(var(--bcc-cellh)*.15))}.sync{top:66%;color:#dfeeff;filter:drop-shadow(0 0 16px #000);display:none;--mdc-icon-size:min(calc(var(--bcc-fs)*2.5px + 1.2*var(--u)),calc(var(--bcc-cellh)*.13))}.hl{position:absolute;inset:0;border-radius:1px;pointer-events:none;z-index:2;box-sizing:border-box;display:none}.d3 .hl{border-radius:2px;top:var(--frame);bottom:var(--frame);left:var(--side);right:var(--side);z-index:2}.low>.hl,.high>.hl{display:block;border:4px solid}.compact .low>.hl,.compact .high>.hl{border-width:2px}.low>.hl{border-color:#ff6666 #ff7f7f #cc1a1a #e60000}.high>.hl{border-color:#99d1ff #66b3ff #0066dd #3385ff}.d3 .w{overflow:visible;padding-block:var(--frame);padding-inline:var(--side);background:linear-gradient(180deg,rgba(255,255,255,.06) 0%,rgba(255,255,255,0) 38%,rgba(0,0,0,0) 62%,rgba(0,0,0,.2) 100%),linear-gradient(88deg,#404247 0%,#c9cbce 7%,#dcdee0 10%,#b3b5b9 16%,#93959a 23%,#e4e6e8 30%,#f0f1f2 37%,#b0b2b6 45%,#82848a 56%,#f1f2f3 68%,#62646a 78%,#4c4e54 86%,#f3f4f5 94%,#404247 100%);box-shadow:0 0 0 1px rgba(0,0,0,.28),inset 0 1px 1px rgba(255,255,255,.3),inset 0 -2px 3px rgba(255,255,255,.18),inset 1px 0 1px rgba(255,255,255,.15),inset -1px 0 2px rgba(255,255,255,.16)}.d3 .w::after{content:'';position:absolute;inset:calc(var(--frame) - 2px) max(0px,calc(var(--side) - 2px));box-sizing:border-box;border:2px solid;border-color:#d8dadd #e4e5e7 #2c2e33 #6a6c72;border-radius:3px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.55),0 0 0 1px rgba(0,0,0,.3);pointer-events:none;z-index:1}.d3 .w::before{content:'';position:absolute;top:-5px;left:50%;transform:translateX(-50%);width:20%;height:clamp(2px,1.2cqw,5px);box-sizing:border-box;background:linear-gradient(180deg,rgba(255,255,255,.5) 0%,rgba(255,255,255,0) 40%,rgba(0,0,0,0) 65%,rgba(0,0,0,.35) 100%),linear-gradient(95deg,#34363a 0%,#767880 8%,#b3b5ba 20%,#d8dadd 30%,#a9abaf 42%,#75777b 60%,#575960 80%,#3c3e42 92%,#2c2d31 100%);border:1px solid rgba(255,255,255,.28);border-radius:1px;box-shadow:inset 0 1px 1px rgba(255,255,255,.5),inset 0 -1px 1px rgba(0,0,0,.4);z-index:2;pointer-events:none}.flat .w{padding:3px}.flat .w::after{content:'';position:absolute;inset:0;box-sizing:border-box;border:2px solid #aeb1b4;border-radius:4px;pointer-events:none;z-index:2;box-shadow:inset 0 1px 0 rgba(255,255,255,.42),inset 1px 0 0 rgba(255,255,255,.28),inset 0 -1px 0 rgba(0,0,0,.28),inset -1px 0 0 rgba(0,0,0,.2),0 1px 2px rgba(0,0,0,.2)}
.bf .content{gap:18px}.flat.bf .content{gap:15px}.bfx{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:3;opacity:0;visibility:hidden;transform:translateZ(0);transition:opacity 1s ease,visibility 0s linear 1s}.bfx.on{opacity:1;visibility:visible;transition:opacity 1s ease,visibility 0s}.bf .bar::before,[data-flow] .bar::before{mix-blend-mode:normal}@container (max-width:600px){.content{--side:max(2px,min(1.2cqw,6px));--frame:clamp(7px,2.2cqw,28px)}}@container (max-width:400px){.content{--side:2px;--frame:clamp(6px,2cqw,24px)}}`);
/* One constructed stylesheet is shared by all cards (falls back to a <style> per card on old browsers) */
const SHEET = typeof CSSStyleSheet !== 'undefined' && 'replaceSync' in CSSStyleSheet.prototype ? new CSSStyleSheet() : null;
SHEET?.replaceSync(CARD_STYLE);
/* ── Card ── */
class BatteryCellsCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._c = this._hass = this._scale = this._card = this._ro = null;
    this._sig = ''; this._struct = ''; this._themeName = ''; this._rt = 0; this._rowCount = 0;
    this._ids = []; this._prev = []; this._rateG = SPEED_BASE; this._io = null; this._paused = false; this._rateRaf = 0;
    this._bf = this._bfEls = this._bfRo = null; this._bfKey = ''; this._bfOk = false; this._bfShown = false; this._bfT = 0; this._bfRaf = this._bfRaf2 = 0; this._bfSt = { on: false, low: 0, high: 0, ratio: 0 };
    this._bfG = null; this._bfCol = null; this._bfPx = ANIM.flow.minPx; this._bfTm = 0; this._bfD = 0; this._bfK = 1; this._bfRafL = 0; this._bfLast = 0; this._bfFadeEnd = 0;
    this._cells = []; this._extras = []; this._soc = []; this._diff = []; this._bat = []; this._sync = [];
    const handler = e => {
      if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
      const t = e.target.closest?.('[data-e]');
      if (!t) return;
      if (e.type === 'click') e.stopPropagation(); else e.preventDefault();
      if (t.dataset.e) this._moreInfo(t.dataset.e);
    };
    ['click', 'keydown'].forEach(type => this.shadowRoot.addEventListener(type, handler));
    /* New animations start at 1×; only adjust them when a different tempo is active (bundled to one pass per frame) */
    this.shadowRoot.addEventListener('animationstart', () => {
      if (this._rateG !== 1 && !this._rateRaf) this._rateRaf = requestAnimationFrame(() => { this._rateRaf = 0; this._setRates(); });
    });
  }
  static getStubConfig() { return stubConfig(); }
  static getConfigElement() { return document.createElement('battery-cells-card-editor'); }
  getGridOptions() { return { columns: this._c?.grid_options.columns ?? 12, rows: !this._c || this._c.chunk_cells ? 'auto' : rowsFor(this._c), min_columns: 10, min_rows: MIN_ROWS }; }
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
      c.soc_entity, c.watt_entity, c.cell_diff_sensor, c.balance_sensor, ...(c.auto_detect_low_high ? [] : [c.pack_cell_low, c.pack_cell_high]),
      ...c.cells.map(x => x.entity), ...c.extra_sensors.map(x => x.entity)
    ].filter(Boolean);
    this._prev = [];
    const struct = structSig(c);
    if (this._card && struct === this._struct && this._applyLive()) { this._update(); return; }
    this._struct = struct;
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
    /* Pause all CSS animations while the card is off screen or hidden (the latest entry holds the current state) */
    this._io = new IntersectionObserver(entries => { const e = entries[entries.length - 1]; this._paused = !e.isIntersecting; this._card?.classList.toggle('paused', this._paused); });
    this._io.observe(this);
    this._observeBf();
    this._settleBf();
    requestAnimationFrame(() => this._setRates());
  }
  disconnectedCallback() {
    clearTimeout(this._rt);
    this._bfRo?.disconnect();
    cancelAnimationFrame(this._bfRaf); cancelAnimationFrame(this._bfRaf2); cancelAnimationFrame(this._bfRafL); this._bfRafL = 0;
    cancelAnimationFrame(this._rateRaf); this._rateRaf = 0;
    clearTimeout(this._bfT); this._bfT = 0;
    this._ro?.disconnect();
    this._ro = null;
    this._io?.disconnect();
    this._io = null;
  }
  _moreInfo(entityId) {
    this.dispatchEvent(new CustomEvent('hass-more-info', { bubbles: true, composed: true, detail: { entityId } }));
  }

  /* All CSS animations play at _rateG (the balancing canvas runs on its own timing) */
  _setRates(root = this._card) {
    (root?.getAnimations?.({ subtree: true }) || []).forEach(an => {
      const r = this._rateG;
      if (r && an.playbackRate !== r) an.playbackRate = r;
    });
  }

  _applyColors(flow) {
    const c = this._c, card = this._card;
    if (!c || !card) return;
    const dir = flow === 'down' ? 'down' : 'up', vars = {};
    if (flow && c.show_flow) {
      const g = c.flow_glow !== 'off' && parseRgb(c[`color_${c.flow_glow}_${dir}`]);
      if (g) Object.assign(vars, FX_VARS.glow(g));
      const tp = c.flow_tip !== 'off' && parseRgb(c[`color_${c.flow_tip}_${dir}`]);
      if (tp) Object.assign(vars, FX_VARS.tip(tp));
      const b = c.flow_bar !== 'off' && parseRgb(c[`color_${c.flow_bar}_${dir}`]);
      if (b) Object.assign(vars, FX_VARS[c.flow_bar](b));
    }
    const f = c.show_balance_flow && parseRgb(c.color_bf);
    if (f) Object.assign(vars, FX_VARS.bf(f));
    this._bfCol = FX_VARS.bf(f || FX_DEFAULT_RGB.bf);
    FX_NAMES.forEach(n => { if (n in vars) card.style.setProperty(n, vars[n]); else card.style.removeProperty(n); });
  }

  _observeBf() {
    this._bfRo?.disconnect();
    if (!this._bfEls || !this._card || !this.isConnected) return;
    this._bfRo ??= new ResizeObserver(() => {
      cancelAnimationFrame(this._bfRaf);
      this._bfRaf = requestAnimationFrame(() => { if (this._bfOk) this._layoutBf(); });
    });
    this._bfRo.observe(this._card);
    const ct = this._card.querySelector('.content');
    if (ct) this._bfRo.observe(ct);
  }

  _settleBf() {
    if (!this._bfEls) return;
    this._bfOk = false;
    cancelAnimationFrame(this._bfRaf2);
    this._bfRaf2 = requestAnimationFrame(() => { this._bfRaf2 = requestAnimationFrame(() => { this._bfOk = true; this._layoutBf(); }); });
  }

  _measure() {
    const row = !this._c?.chunk_cells && this._card?.querySelector('.row');
    if (row) this._card.style.setProperty('--bcc-cellh', Math.max(CELL_H_MIN, row.offsetHeight) + 'px');
    this._layoutBf();
  }

  _layoutBf() {
    const card = this._card;
    if (!this._bfEls || !card) { this._bf = null; return; }
    const rows = [...card.querySelectorAll('.row')];
    if (!rows.length || !this._cells.length) { this._bf = null; return; }
    this._sizeBf();
    const right = Math.max(...rows.map(r => r.offsetLeft + r.offsetWidth)), padR = Math.max(0, card.clientWidth - right);
    const w = card.classList.contains('compact') ? 3 : 4;
    this._bf = {
      d3: card.classList.contains('d3'), w, cw: card.clientWidth,
      xr: right + Math.max(w / 2 + .5, Math.min(4, padR / 2)),
      rows: rows.map(r => ({ top: r.offsetTop, bottom: r.offsetTop + r.offsetHeight })),
      cells: this._cells.map(({ el }, i) => {
        const bar = el.querySelector('.bar'), fb = bar ? Math.max(0, el.offsetHeight - (bar.offsetTop + bar.offsetHeight)) : 0, bottom = el.offsetTop + el.offsetHeight;
        return { i, x: el.offsetLeft + el.offsetWidth / 2, left: el.offsetLeft, right: el.offsetLeft + el.offsetWidth, top: el.offsetTop, bottom, sy: bottom - Math.max(1.5, fb / 2), row: rows.indexOf(el.closest('.row')) };
      })
    };
    this._bfKey = '';
    this._drawBf();
  }

  _sizeBf() {
    const el = this._bfEls, card = this._card;
    if (!el || !card) return;
    const k = Math.min(globalThis.devicePixelRatio || 1, 2), w = Math.max(1, Math.round(card.clientWidth * k)), h = Math.max(1, Math.round(card.clientHeight * k));
    this._bfK = k;
    if (el.cv.width !== w) el.cv.width = w;
    if (el.cv.height !== h) el.cv.height = h;
  }

  _drawBf() {
    const g = this._bf, st = this._bfSt, el = this._bfEls;
    if (!g || !el) return;
    const S = g.cells[st.high - 1], D = g.cells[st.low - 1], on = !!(this._bfOk && st.on && S && D && S !== D && S.row >= 0 && D.row >= 0);
    if (!on) {
      el.g.classList.remove('on'); this._bfShown = false;
      this._bfFadeEnd = performance.now() + 1100;
      clearTimeout(this._bfT); this._bfT = 0;
      return;
    }
    const key = `${st.high}|${st.low}`;
    if (key !== this._bfKey) {
      if (this._bfShown && this._bfKey) {
        el.g.classList.remove('on'); this._bfShown = false;
        this._bfFadeEnd = performance.now() + 1100;
        clearTimeout(this._bfT);
        this._bfT = setTimeout(() => { this._bfT = 0; this._bfKey = ''; this._drawBf(); }, 1000);
        return;
      }
      if (this._bfT) return;
      this._bfKey = key;
      const tOff = (g.d3 ? 11.5 : 8.5) + g.w / 2, yb = g.rows[S.row].bottom + 3 + g.w / 2, yt = g.rows[D.row].top - tOff, ye = D.top - (g.d3 ? 5 : 3.5);
      let pts;
      if (S.row === D.row) {
        const dir = D.x > S.x ? 1 : -1, N = g.cells[S.i + dir];
        const gx = N && N.row === S.row ? (dir > 0 ? (S.right + N.left) / 2 : (N.right + S.left) / 2) : g.xr;
        pts = [[S.x, S.sy], [S.x, yb], [gx, yb], [gx, yt], [D.x, yt], [D.x, ye]];
      } else if (D.row === S.row + 1) pts = [[S.x, S.sy], [S.x, yt], [D.x, yt], [D.x, ye]];
      else pts = [[S.x, S.sy], [S.x, yb], [g.xr, yb], [g.xr, yt], [D.x, yt], [D.x, ye]];
      const pw = Math.max(8, (D.right - D.left) * .2), ph = g.d3 ? Math.min(5, Math.max(2, g.cw * .012)) : 3;
      this._bfG = {
        path: new Path2D(roundPath(pts, g.w + 1)), w: g.w,
        sx: S.x, sy: S.sy, dx: D.x, dy: ye,
        pole: { x: D.x - pw / 2, y: g.d3 ? D.top - 5 : D.top - 3.5, w: pw, h: ph }
      };
    }
    el.g.classList.add('on'); this._bfShown = true;
    this._bfPx = ANIM.flow.minPx + (ANIM.flow.maxPx - ANIM.flow.minPx) * st.ratio;
    this._bfRun();
  }

  /* The balancing flow is drawn on one canvas (own compositor layer): the rest of the card is never repainted by it */
  _bfRun() {
    if (this._bfRafL) return;
    this._bfLast = 0;
    this._bfRafL = requestAnimationFrame(t => this._bfFrame(t));
  }
  _bfFrame(t) {
    this._bfRafL = 0;
    const el = this._bfEls;
    if (!el || !this.isConnected) return;
    if (!this._bfShown && performance.now() > this._bfFadeEnd) {
      el.ctx.setTransform(1, 0, 0, 1, 0, 0);
      el.ctx.clearRect(0, 0, el.cv.width, el.cv.height);
      return;
    }
    this._bfRafL = requestAnimationFrame(t2 => this._bfFrame(t2));
    if (this._bfG && !this._paused && (!this._bfLast || t - this._bfLast >= 32)) {
      const dt = this._bfLast ? Math.min(.2, (t - this._bfLast) / 1000) : 0;
      this._bfLast = t; this._bfTm += dt; this._bfD += this._bfPx * dt;
      try { this._paintBf(el, this._bfG); } catch (e) { console.warn('Battery Cells Card: balancing draw failed', e); }
    }
  }
  _paintBf(el, geo) {
    const ctx = el.ctx, k = this._bfK, c = this._bfCol || FX_VARS.bf(FX_DEFAULT_RGB.bf), tm = this._bfTm, dist = this._bfD, w = geo.w, TAU = Math.PI * 2;
    ctx.setTransform(k, 0, 0, k, 0, 0);
    ctx.clearRect(0, 0, el.cv.width / k, el.cv.height / k);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = (col, width, alpha, dash, off) => {
      ctx.globalAlpha = alpha; ctx.strokeStyle = col; ctx.lineWidth = width;
      ctx.setLineDash(dash); ctx.lineDashOffset = off;
      ctx.stroke(geo.path);
    };
    line(c['--ov-bg'], w + 7, flick(tm / 2.6), [], 0);
    line(c['--ov-bg2'], w + 3, flick(tm / 1.9), [], 0);
    line(c['--ov-bo'], w, 1, [], 0);
    line(c['--ov-bb'], w - 2, 1, [], 0);
    const iw = w - 2;
    line(c['--ov-b3'], iw, 1, [30, 26], 25 - dist);
    line(c['--ov-b2'], iw * .8, 1, [14, 42], 9 - dist);
    line(c['--ov-b1'], iw * .5, 1, [5, 51], -dist);
    line(c['--ov-b4'], iw * .35, 1, [2, 7, 1, 13, 3, 17, 1, 9], -dist * 1.577);
    ctx.setLineDash([]); ctx.lineDashOffset = 0;
    const T = ANIM.flow.pulseSec, p = geo.pole;
    ctx.globalAlpha = .65 - .35 * Math.cos(TAU * (tm + T / 2) / T);
    ctx.fillStyle = c['--ov-pf']; ctx.strokeStyle = c['--ov-ps']; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.rect(p.x, p.y, p.w, p.h); ctx.fill(); ctx.stroke();
    [[geo.sx, geo.sy, 0], [geo.dx, geo.dy, T / 2]].forEach(([x, y, off]) => {
      const q = ((tm + off) % T) / T, sc = .3 + 1.2 * q;
      ctx.globalAlpha = .95 * (1 - q); ctx.strokeStyle = c['--ov-bs']; ctx.lineWidth = 1.2 * sc;
      ctx.beginPath(); ctx.arc(x, y, 5 * sc, 0, TAU); ctx.stroke();
    });
    ctx.globalAlpha = 1; ctx.fillStyle = '#fff';
    [[geo.sx, geo.sy], [geo.dx, geo.dy]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 1.8, 0, TAU); ctx.fill(); });
  }

  _env() {
    const c = this._c, w = this.clientWidth || 0, h = this.clientHeight || 0;
    const compact = (w > 0 && w < 420) || (h > 0 && h < 260);
    const pad = Math.max(compact ? Math.min(c.container_padding, 6) : c.container_padding, c.show_balance_flow ? (compact ? 6 : 8) : 0);
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
    return { compact, chunk, pad, size, sig: `${compact}|${chunk}|${size}|${minW}|${c.chunk_mode}` };
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
  _cellHtml(cfg, i = 0) {
    const c = this._c, on = c.show_flow, tip = on ? c.flow_tip : 'off', bar = on ? c.flow_bar : 'off', mode = on ? c.flow_glow : 'off';
    const gm = mode !== 'off', w = gm ? ' gwn' : '';
    const btn = cfg.entity ? ` data-e="${esc(cfg.entity)}" role="button" tabindex="0"` : '';
    const side = mode === 'wave' ? '<i class="wv"><i class="wvi"></i></i><i class="wv r"><i class="wvi"></i></i>'
      : mode === 'pulse' ? '<i class="pv"><i class="pvi"></i></i><i class="pv r"><i class="pvi"></i></i><i class="pt"></i>' : '';
    const fx = gm ? `<div class="gl ${mode}">${side}</div>` : '';
    const ag = bar !== 'off' ? `<div class="ag"><i class="tl${bar === 'bar2' ? ' l2' : ''}"></i></div>` : '';
    const tg = tip === 'tip1' ? '<div class="tg t1"></div><i class="tb t1"></i>'
      : tip === 'tip2' ? `<div class="tg t2${w}"></div><i class="tb${w}"></i>`
      : tip === 'tip3' ? `<div class="tg t3${w}"></div><i class="tb t3${w}"></i>` : '';
    return `<div class="w cell"${btn} style="--ci:${c.flow_sync ? 0 : i}" title="${esc(cfg.name || cfg.entity)}"><div class="bar"><div class="ov"></div>${ag}${tg}${fx}<div class="name">${esc(cfg.name)}</div><div class="val"><span class="num"></span><span class="unit"></span></div></div><div class="hl"></div></div>`;
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

  _vars(env) {
    const c = this._c;
    return {
      pad: env.pad + 'px',
      top: Math.max(env.compact ? Math.min(c.top_padding, 8) : c.top_padding, c.show_balance_flow ? (c.use_3d ? 8 : 12) : 0) + 'px',
      gap: c.cell_gap + 'px',
      efs: c.extra_font_scale,
      fs: env.compact ? Math.min(c.font_size, 8) : c.font_size,
      op: c.overlay_opacity,
      title: env.compact ? '14px' : '24px',
      grad: this._scale.gradient,
      base: c.cell_height + 'px',
      cellh: c.cell_height + 'px'
    };
  }
  /* Applies changed live settings without rebuilding the DOM; false = structure changed, full render needed */
  _applyLive() {
    const env = this._env();
    if (env.sig !== this._sig) return false;
    const v = this._vars(env);
    ['pad', 'top', 'gap', 'efs', 'fs', 'op', 'title', 'base', 'cellh'].forEach(k => this._card.style.setProperty(`--bcc-${k}`, v[k]));
    this._applyColors(this._card.dataset.flow || '');
    this._measure();
    return true;
  }

  _render() {
    const c = this._c, env = this._env(), r = this.shadowRoot;
    this._sig = env.sig;
    this.toggleAttribute('fill', !c.chunk_cells);
    const vars = this._vars(env);
    const rows = env.chunk
      ? Array.from({ length: Math.ceil(c.cells.length / env.size) }, (_, i) => c.cells.slice(i * env.size, (i + 1) * env.size))
      : [c.cells];
    this._rowCount = rows.length;
    const extra = c.show_extra_sensors ? c.extra_sensors : [];
    const theme = this._themeName = c.theme && c.theme !== 'default' ? c.theme : '';
    const legend = c.show_legend ? this._legendHtml() : '';

    let card = this._card;
    if (!card) {
      r.innerHTML = SHEET ? '<ha-card></ha-card>' : `<style>${CARD_STYLE}</style><ha-card></ha-card>`;
      if (SHEET) r.adoptedStyleSheets = [SHEET];
      card = this._card = r.querySelector('ha-card');
    }
    card.className = `card ${c.use_3d ? 'd3' : 'flat'}${c.chunk_cells ? '' : ' fill'}${env.compact ? ' compact' : ''}${c.show_slices ? ` sl sl-${c.slice_strength}` : ''}${c.show_balance_flow ? ' bf' : ''}${this._paused ? ' paused' : ''}`;
    theme ? card.setAttribute('theme', theme) : card.removeAttribute('theme');
    card.style.cssText = Object.entries(vars).map(([k, v]) => `--bcc-${k}:${v}`).join(';');
    this._applyColors(card.dataset.flow || '');
    if (theme) this._applyTheme();
    card.innerHTML = `<div class="title">${esc(c.title)}</div>`
      + `<div class="extra"${extra.length ? '' : ' hidden'}>${extra.map(s => this._extraHtml(s)).join('')}</div>`
      + `<div class="content">${rows.map((row, ri) => `<div class="row">${legend}${row.map((cfg, j) => this._cellHtml(cfg, ri * env.size + j)).join('')}</div>`).join('')}</div>`
      + (c.show_balance_flow ? BF_CANVAS : '');

    const all = s => [...r.querySelectorAll(s)], one = (el, s) => el.querySelector(s);
    this._cells = all('.cell').map(el => ({ el, ov: one(el, '.ov'), num: one(el, '.num'), unit: one(el, '.unit'), gl: one(el, '.gl'), ag: one(el, '.ag'), tg: one(el, '.tg'), tb: one(el, '.tb'), entity: el.dataset.e, fk: '', cls: '' }));
    this._extras = all('.xi').map((el, i) => ({ icon: one(el, 'ha-state-icon'), v: one(el, '.xv'), u: one(el, '.xu'), entity: extra[i]?.entity, cfgIcon: extra[i]?.icon || '', st: undefined, done: false }));
    this._soc = all('.soc'); this._diff = all('.diff'); this._bat = all('.bat'); this._sync = all('.sync');
    const cv = c.show_balance_flow ? card.querySelector('.bfx') : null;
    this._bfEls = cv ? { cv, g: cv, ctx: cv.getContext('2d') } : null;
    this._bf = null; this._bfG = null; this._bfKey = ''; this._bfShown = false; clearTimeout(this._bfT); this._bfT = 0;
    this._measure();
    this._observeBf();
    this._settleBf();
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

    const flow = c.show_flow && c.watt_entity ? (watt > 0 ? 'up' : watt < 0 ? 'down' : '') : '';
    let rateDirty = false;
    if (flow) {
      let g = c.flow_speed * SPEED_BASE;
      if (c.flow_speed_mode === 'auto') {
        const w = Math.abs(watt) * (/^k/i.test(S[c.watt_entity]?.attributes?.unit_of_measurement || '') ? 1000 : 1);
        const mx = flow === 'up' ? c.flow_max_charge_w : c.flow_max_discharge_w;
        g = speedAt(w / Math.max(1, mx)) * c.flow_speed_auto * SPEED_BASE;
      }
      /* power-dependent mode: 10 % hysteresis avoids re-walking all animations on every small power fluctuation */
      if (Math.abs(g - this._rateG) > this._rateG * (c.flow_speed_mode === 'auto' ? .1 : .001)) { this._rateG = g; rateDirty = true; }
    }
    if ((this._card.dataset.flow || '') !== flow) {
      if (flow) this._card.dataset.flow = flow; else delete this._card.dataset.flow;
      this._applyColors(flow);
      rateDirty = true;
    }
    if (flow && rateDirty) this._setRates();

    let minV = Infinity, maxV = -Infinity, minI = null, maxI = null;
    this._cells.forEach((cell, i) => {
      const st = S[cell.entity], mv = toMv(st?.state, st?.attributes?.unit_of_measurement);
      if (mv == null) { put(cell.num, '-'); put(cell.unit, ''); }
      else if (c.cell_unit === 'V') { put(cell.num, (mv / 1000).toFixed(3)); put(cell.unit, 'V'); }
      else { put(cell.num, String(Math.round(mv))); put(cell.unit, 'mV'); }
      const fp = fillPercent(this._scale.fill, mv), fk = fp.toFixed(2);
      if (cell.fk !== fk) {
        cell.fk = fk;
        const fpc = Math.max(1, fp).toFixed(2);
        cell.ov.style.height = `${100 - fp}%`;
        if (cell.gl) cell.gl.style.height = `${fp}%`;
        if (cell.ag) cell.ag.style.height = `${fp}%`;
        [cell.gl, cell.ag, cell.tg, cell.tb].forEach(el => el?.style.setProperty('--fp', fpc));
      }
      if (mv == null) return;
      if (mv < minV) { minV = mv; minI = i + 1; }
      if (mv > maxV) { maxV = mv; maxI = i + 1; }
    });


    const idx = id => { const n = id ? parseInt(S[id]?.state, 10) : NaN; return Number.isFinite(n) && n >= 1 && n <= this._cells.length ? n : null; };
    let low = null, high = null;
    if (c.auto_detect_low_high) { if (maxV > minV) { low = minI; high = maxI; } }
    else { low = idx(c.pack_cell_low); high = idx(c.pack_cell_high); }
    this._cells.forEach((cell, i) => {
      const cls = i + 1 === low ? 'low' : i + 1 === high ? 'high' : '';
      if (cell.cls !== cls) { cell.cls = cls; cell.el.classList.remove('low', 'high'); if (cls) cell.el.classList.add(cls); }
    });

    /* Cell spread: delta sensor if available, otherwise min/max of the cells */
    const spread = diff ?? (maxV > minV ? maxV - minV : 0);
    const balancing = (c.balance_sensor && String(S[c.balance_sensor]?.state).toLowerCase() === 'on')
      || (spread >= c.cell_diff && maxV >= c.cell_bal_over);
    const display = balancing ? 'block' : 'none';
    this._sync.forEach(el => { if (el.style.display !== display) el.style.display = display; });

    if (c.show_balance_flow) {
      this._bfSt = { on: !!balancing && low != null && high != null && low !== high, low: low || 0, high: high || 0, ratio: clamp(spread / ANIM.flow.fullMv, .15, 1, .15) };
      this._drawBf();
    }
  }
}
if (!customElements.get('battery-cells-card')) customElements.define('battery-cells-card', BatteryCellsCard);

/* ── Editor ── */
/* de only lists the texts that differ from en (_t falls back to en) */
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
    show_cell_diff: 'Show cell delta', show_sync_icon: 'Show sync icon', show_balance_flow: 'Balancing energy flow',
    show_anim_colors: 'Change animation colors',
    flow_sync: 'Light up all cells simultaneously (instead of in sequence)',
    animation: 'Animation', show_flow: 'Charge/discharge animation', flow_tip: 'Glowing cell top',
    ft_off: 'Off', ft_tip1: 'Glow', ft_tip2: 'Glow (subtle)', ft_tip3: 'Glow (explosion)',
    flow_bar: 'Running bar', fb_off: 'Off', fb_bar1: 'Running bar 1 (short tail)', fb_bar2: 'Running bar 2 (long tail)',
    flow_glow: 'Cell wall animation', fg_off: 'Off', fg_pulse: 'Pulse (edge to center)', fg_wave: 'Cell wall energy',
    flow_speed_mode: 'Speed', fs_manual: 'Constant', fs_auto: 'Power-dependent', flow_speed: 'Speed (×)', flow_speed_auto: 'Speed factor (×, power-dependent)', flow_max_charge_w: 'Max. charge power (W)', flow_max_discharge_w: 'Max. discharge power (W)',
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
    custom_min_mv: 'Min. voltage = lower edge of the bottom step (mV)', sec_cells: 'Cell appearance',
    sec_bal: 'Balancing detection', hint_bal: 'Balancing is active when the cell delta reaches the threshold and a cell is above the balancing voltage.',
    sec_lowhigh: 'Lowest / highest cell', hint_lowhigh: 'These cells are framed and linked by the energy flow. Automatic, or via two sensors that report the cell number.',
    custom_scale: 'Custom scale', add_stop: 'Add scale step', scale_gradient: 'Smooth color gradient (cells + legend)',
    scale_hint: 'Order = legend from top to bottom. Each step: voltage at the upper edge of its segment (must decrease downwards) and share (%) = segment height (always totals 100 %). The lower edge of the bottom step is the min. voltage below. Everything is adjusted automatically. At least 2 steps are needed, otherwise a default scale is used.',
    mv: 'Top edge mV', pct: 'Share %', top: 'Top label', bottom: 'Bottom label', stop_color: 'Color', hex: 'Hex color', h: 'Hue', s: 'Saturation', l: 'Lightness',
    unit_mv: 'mV', unit_v: 'V'
  },
  de: {
    cells: 'Zellen', add_cell: 'Zelle hinzufügen', legend_sensors: 'Legenden-Sensoren',
    balancing_min_max: 'Balancing & Min. Zelle / Max. Zelle', display: 'Anzeige',
    additional_sensors: 'Zusätzliche Sensoren', add_sensor: 'Sensor hinzufügen',
    default: 'Standard', icon: 'Symbol', entity: 'Entität',
    edit: 'Bearbeiten', delete: 'Löschen', move: 'Verschieben',
    soc_entity: 'Ladezustand (SOC)', watt_entity: 'Leistung (W)',
    cell_diff_sensor: 'Zellspannungsdifferenz', balance_sensor: 'Balancing aktiv (optional)',
    cell_diff: 'Differenzschwellwert (mV)', cell_bal_over: 'Balancing ab Zellspannung (mV)',
    auto_detect_low_high: 'Niedrigste / höchste Zelle automatisch erkennen',
    pack_cell_low: 'Sensor für niedrigste Zelle', pack_cell_high: 'Sensor für höchste Zelle',
    show_legend: 'Legende anzeigen', show_soc_value: 'SOC-Wert anzeigen',
    show_soc_icon: 'Laden-/Entladen-Symbol anzeigen', show_cell_diff: 'Zelldifferenz anzeigen',
    show_sync_icon: 'Synchronisationssymbol anzeigen', show_balance_flow: 'Balancing-Energiefluss',
    show_anim_colors: 'Animationsfarben ändern',
    flow_sync: 'Alle Zellen gleichzeitig aufleuchten (statt der Reihe nach)',
    show_flow: 'Lade-/Entlade-Animation', flow_tip: 'Aufglühende Zellspitze',
    ft_off: 'Aus', ft_tip1: 'Aufglühen', ft_tip2: 'Aufglühen (dezent)', ft_tip3: 'Aufglühen (Explosion)',
    flow_bar: 'Laufbalken', fb_off: 'Aus', fb_bar1: 'Laufbalken 1 (kurzer Schweif)', fb_bar2: 'Laufbalken 2 (langer Schweif)',
    flow_glow: 'Zellwand-Animation', fg_off: 'Aus', fg_pulse: 'Pulsieren (Rand zur Mitte)', fg_wave: 'Zellwandenergie',
    flow_speed_mode: 'Geschwindigkeit', fs_manual: 'Gleichbleibend', fs_auto: 'Leistungsabhängig', flow_speed: 'Geschwindigkeit (×)', flow_speed_auto: 'Tempo-Faktor (×, leistungsabhängig)', flow_max_charge_w: 'Max. Ladeleistung (W)', flow_max_discharge_w: 'Max. Entladeleistung (W)',
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
    type_lead: 'Blei (2V-Zelle)', type_custom: 'Benutzerdefiniert',
    preset: 'Farb-Skala-Preset', preset_none: 'Kein Preset', preset1: 'Preset 1 – LiFePO4 Standard', preset2: 'Preset 2 – LiFePO4 Lila / Rosa', preset3: 'Preset 3 – LiFePO4 Sunset', preset4: 'Preset 4 – LiFePO4 Neon', preset5: 'Preset 5 – LiFePO4 Ozean', preset6: 'Preset 6 – NMC / NCM', preset7: 'Preset 7 – Blei (2V-Zelle)',
    custom_min_mv: 'Min-Spannung = Unterkante der untersten Stufe (mV)', sec_cells: 'Zellendarstellung',
    sec_bal: 'Balancing-Erkennung', hint_bal: 'Balancing ist aktiv, wenn die Zelldifferenz den Schwellwert erreicht und eine Zelle über der Balancing-Spannung liegt.',
    sec_lowhigh: 'Niedrigste / höchste Zelle', hint_lowhigh: 'Diese Zellen werden umrandet und vom Energiefluss verbunden. Automatisch oder über zwei Sensoren, die die Zellnummer liefern.',
    custom_scale: 'Benutzerdefinierte Skala', add_stop: 'Skalen-Stufe hinzufügen', scale_gradient: 'Farbverlauf (Zellen + Legende)',
    scale_hint: 'Reihenfolge = Legende von oben nach unten. Je Stufe: Spannung an der Oberkante des Segments (muss nach unten sinken) und Anteil (%) = Segmenthöhe (ergibt immer 100 %). Die Unterkante der untersten Stufe ist die Min-Spannung unten. Alles wird automatisch angepasst. Mindestens 2 Stufen nötig, sonst gilt eine Standard-Skala.',
    mv: 'Obergrenze mV', pct: 'Anteil %', top: 'Beschriftung oben', bottom: 'Beschriftung unten', stop_color: 'Farbe', hex: 'Hex-Farbe', h: 'Farbton', s: 'Sättigung', l: 'Helligkeit'
  }
};
/* Colour labels: "<animation> – <direction>", built from the keys of FX_DEFAULT_RGB */
const FX_NAME = {
  en: { tip1: 'Glow', tip2: 'Glow (subtle)', tip3: 'Glow (explosion)', bar1: 'Running bar 1', bar2: 'Running bar 2', wave: 'Cell wall energy', pulse: 'Pulse', bf: 'Energy flow color' },
  de: { tip1: 'Aufglühen', tip2: 'Aufglühen (dezent)', tip3: 'Aufglühen (Explosion)', bar1: 'Laufbalken 1', bar2: 'Laufbalken 2', wave: 'Zellwandenergie', pulse: 'Pulsieren', bf: 'Energiefluss – Farbe' }
};
const FX_DIR = { en: { up: 'charging color', down: 'discharging color' }, de: { up: 'Farbe Laden', down: 'Farbe Entladen' } };
for (const l in FX_NAME) for (const k in FX_DEFAULT_RGB) {
  const [n, d] = k.split('_');
  I18N[l]['color_' + k] = d ? `${FX_NAME[l][n]} – ${FX_DIR[l][d]}` : FX_NAME[l][n];
}

const EDITOR_CSS = `.editor ha-expansion-panel{scroll-margin-top:8px}.editor .sep{height:0;border-top:1px solid var(--divider-color);margin:12px 0}.editor .sh{color:var(--primary-text-color);font-size:16px;font-weight:500;padding:8px 0 4px}.editor{display:flex;flex-direction:column;gap:var(--ha-space-4,8px);container-type:inline-size}.editor ha-form{display:block}.editor .list{display:flex;flex-direction:column;gap:var(--ha-space-2,4px)}.editor .row{display:grid;grid-template-columns:minmax(0,1fr) auto 37px auto;align-items:center;gap:0}.editor ha-icon-button{--ha-icon-button-size:44px;--mdc-icon-button-size:44px}.editor .entity{min-width:0}.editor .handle{width:37px;height:44px;display:flex;align-items:center;justify-content:center;cursor:grab;color:var(--secondary-text-color);touch-action:none}.editor .handle:active{cursor:grabbing}.editor .handle ha-svg-icon{width:24px;height:24px}.editor .detail{grid-column:1/-1}.editor .detail[hidden]{display:none}.editor .hint{color:var(--secondary-text-color);font-size:12px;padding:0 0 8px}.editor .sw{display:flex;align-items:center;gap:4px;padding-right:4px}.editor .sw ha-form{flex:0 0 50%;min-width:0}.editor .sw ha-form+ha-form{flex:0 0 30%}.editor .sample{width:40px;height:56px;flex:none;box-sizing:border-box;border:1px solid var(--divider-color);border-radius:6px;cursor:pointer}.editor .add{padding-top:8px}.editor .colors{display:flex;flex-direction:column;gap:8px;padding:4px 4px 8px}.editor .colors[hidden]{display:none}.editor .crow{display:flex;align-items:center;gap:12px}.editor .csw{position:relative;width:40px;height:40px;flex:none;box-sizing:border-box;border:1px solid var(--divider-color);border-radius:6px;overflow:hidden;cursor:pointer}.editor .csw input{position:absolute;top:-8px;left:-8px;width:calc(100% + 16px);height:calc(100% + 16px);margin:0;padding:0;border:0;opacity:0;cursor:pointer}.editor .clab{min-width:0;color:var(--primary-text-color);font-size:14px}@container (max-width:480px){.editor .row:has(>.sw){grid-template-columns:minmax(0,1fr) 10cqw 8cqw 10cqw}.editor .row:has(>.sw)>ha-icon-button{--ha-icon-button-size:10cqw;--mdc-icon-button-size:10cqw}.editor .row:has(>.sw)>.handle{width:8cqw}.editor .sw{gap:1cqw;padding-right:0}.editor .sample{flex:0 0 14%;width:auto}.editor .sw ha-form{flex:0 0 44%;--text-field-padding:0 4cqw}.editor .sw ha-form+ha-form{flex:0 0 32%}}`;
const ICON_EDIT = 'M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.13,5.12L18.88,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z';
const ICON_DEL = 'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z';
const ICON_DRAG = 'M6,5H18V7H6V5M6,11H18V13H6V11M6,17H18V19H6V17Z';
const SENSOR_SELECTOR = { entity: { domain: 'sensor' } };
const ENTITY_SCHEMA = [{ name: 'entity', selector: SENSOR_SELECTOR }];
const TEXT_SEL = { text: {} };
const SCHEMA_KEYS = ['watt_entity', 'show_flow', 'show_balance_flow', 'flow_tip', 'flow_bar', 'flow_glow', 'flow_speed_mode', 'chunk_cells', 'chunk_mode', 'battery_type', 'show_legend', 'show_slices', 'auto_detect_low_high', 'pack_cell_low', 'pack_cell_high'];
const ENTITY_KEYS = ['soc_entity', 'watt_entity', 'cell_diff_sensor', 'balance_sensor', 'pack_cell_low', 'pack_cell_high'];
const CLEAR_DEFAULTS = { theme: 'default', battery_type: 'lifepo4', slice_strength: 'subtle', flow_tip: 'off', flow_bar: 'off', flow_glow: 'off', flow_speed_mode: 'manual', cell_unit: 'mV' };
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
const rgbToHex = c => '#' + c.map(n => n.toString(16).padStart(2, '0')).join('');
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
/* Voltages and labels of the scale presets come from PRESETS; only preset 2 uses its own voltage steps */
const mkPreset = (type, cols, mvs) => {
  const p = PRESETS[type], mv = mvs || p.slice(1).reverse();
  return { min: p[0], stops: cols.map((color, i) => ({ color, pct: PRESET_PCT[i], mv: mv[i], top: i < 4 ? volt(p[7 - i]) : '', bottom: i > 2 ? volt(p[6 - i]) : '' })) };
};
const SCALE_PRESETS = {
  preset1: mkPreset('lifepo4', STD_COLORS),
  preset2: mkPreset('lifepo4', ['#380070', '#8d00eb', '#ff05d5', '#ff99f0', '#ff05d5', '#8d00eb', '#380070'], [3650, 3550, 3450, 3380, 3200, 3000, 2800]),
  preset3: mkPreset('lifepo4', ['#be123c', '#f97316', '#fbbf24', '#10b981', '#fbbf24', '#f97316', '#be123c']),
  preset4: mkPreset('lifepo4', ['#f472b6', '#d946ef', '#a981e9', '#22d3ee', '#a981e9', '#d946ef', '#f472b6']),
  preset5: mkPreset('lifepo4', ['#fd8b8b', '#2563eb', '#38bdf8', '#34d399', '#38bdf8', '#2563eb', '#fd8b8b']),
  preset6: mkPreset('nmc', STD_COLORS),
  preset7: mkPreset('lead', STD_COLORS)
};

class BatteryCellsCardEditor extends HTMLElement {
  constructor() {
    super();
    this._config = {}; this._hass = null; this._built = false; this._local = ''; this._lang = 'en'; this._forms = [];
    this._presetForm = this._scalePanel = this._animPanel = this._colorsBox = null; this._balReady = false; this._pwrReady = false; this._hk = null; this._stopRefs = [];
    this._showColors = false; this._colorsSig = ''; this._colorRefs = [];
  }
  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    const lang = (hass?.locale?.language || 'en').toLowerCase().startsWith('de') ? 'de' : 'en';
    const langChanged = lang !== this._lang;
    this._lang = lang;
    if (langChanged && this._built) return this._build();
    this._pushHass(hass, first);
    if (first && this._built) this._syncForms(true);
    else if (this._built) {
      if (this._balanceReady() !== this._balReady || this._powerReady() !== this._pwrReady) this._syncForms(true);
      else this._syncAnim();
    }
  }
  _pushHass(hass, force) {
    const k = [hass?.locale, hass?.themes, hass?.entities, hass?.devices, hass?.areas, hass?.localize];
    if (!force && this._hk && !k.some((v, i) => v !== this._hk[i])) return;
    this._hk = k;
    this.querySelectorAll('ha-form').forEach(f => { f.hass = hass; });
  }
  setConfig(config) {
    const fresh = !this._built && !Object.keys(this._config).length;
    const defined = Object.fromEntries(Object.entries(config || {}).filter(([, v]) => v !== undefined));
    const empty = !Object.keys(defined).some(k => k !== 'type');
    const next = this._normalize({ ...(fresh && empty ? stubConfig() : DEFAULTS), ...defined });
    const lists = c => sig([c.cells, c.extra_sensors, c.legend_stops]);
    const listsChanged = lists(this._config) !== lists(next);
    const isOwnEcho = sig(next) === this._local;
    /* Sections layout <-> cell height: rows changed in HA's layout tab move the slider (the slider moves the rows in _commit) */
    const rows = next.grid_options?.rows;
    let synced = false;
    if (!next.chunk_cells && Number.isFinite(rows)) {
      if (!this._built) { if (defined.cell_height === undefined && !(fresh && empty)) next.cell_height = heightFor(rows, next); }
      else if (!isOwnEcho && rows !== this._config.grid_options?.rows) {
        const h = heightFor(rows, next);
        synced = h !== this._config.cell_height;
        next.cell_height = h;
      }
    }
    this._config = next;
    if (!this._built) return this._build();
    if (isOwnEcho) return;
    if (listsChanged) ['cells', 'extra_sensors', 'legend_stops'].forEach(k => this._renderList(k));
    this._syncForms(true);
    if (synced) this._emit();
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
      ...Object.fromEntries(COLOR_KEYS.map(k => [k, parseRgb(c[k])])),
      cells: arr(c.cells).map(normCell),
      extra_sensors: arr(c.extra_sensors).map(normExtra),
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
    return { ...this._config, overlay_opacity_pct: Math.round((Number(this._config.overlay_opacity) || 0) * 100), show_anim_colors: this._showColors };
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

  _topSchema() { return [{ name: 'title', selector: TEXT_SEL }]; }
  _themeSchema() {
    const themes = Object.keys(this._hass?.themes?.themes || {}).filter(t => t !== 'default').sort().map(t => ({ value: t, label: t }));
    return [{ name: 'theme', selector: dropdown([{ value: 'default', label: this._t('default') }, ...themes]) }];
  }
  _chemSchema() {
    return [{ name: 'battery_type', selector: dropdown(BATTERY_TYPES.map(v => ({ value: v, label: this._t('type_' + v) }))) }];
  }
  _customMinSchema() { return [{ name: 'custom_min_mv', selector: numSel(1000, 5000) }]; }
  _scaleSchema() { return [{ name: 'scale_gradient', selector: bool }]; }
  _animBalSchema() { return this._balanceReady() ? [{ name: 'show_balance_flow', selector: bool }] : []; }
  _animFlowSchema() {
    const c = this._config, opt = (list, pre) => dropdown(list.map(v => ({ value: v, label: this._t(pre + v) })));
    const s = [];
    if (this._powerReady()) {
      s.push({ name: 'show_flow', selector: bool });
      if (c.show_flow) {
        s.push({ name: 'flow_tip', selector: opt(FLOW_TIPS, 'ft_') }, { name: 'flow_bar', selector: opt(FLOW_BARS, 'fb_') }, { name: 'flow_glow', selector: opt(FLOW_GLOWS, 'fg_') }, { name: 'flow_sync', selector: bool });
        if (c.flow_tip !== 'off' || c.flow_bar !== 'off' || c.flow_glow !== 'off') {
          s.push({ name: 'flow_speed_mode', selector: opt(FLOW_SPEEDS, 'fs_') });
          if (c.flow_speed_mode === 'manual') s.push({ name: 'flow_speed', selector: { number: { min: 0.1, max: 2, step: 0.1, mode: 'slider' } } });
          else {
            const w = { number: { min: 100, max: 100000, step: 10, mode: 'box', unit_of_measurement: 'W' } };
            s.push({ name: 'flow_max_charge_w', selector: w }, { name: 'flow_max_discharge_w', selector: w }, { name: 'flow_speed_auto', selector: { number: { min: 0.2, max: 2, step: 0.1, mode: 'slider' } } });
          }
        }
      }
    }
    return s;
  }
  _animColorKeys() {
    const c = this._config, keys = [];
    if (this._powerReady() && c.show_flow) {
      for (const k of [c.flow_tip, c.flow_bar, c.flow_glow]) if (k !== 'off') keys.push(`color_${k}_up`, `color_${k}_down`);
    }
    if (this._balanceReady() && c.show_balance_flow) keys.push('color_bf');
    return keys;
  }
  _animColorSchema() { return this._animColorKeys().length ? [{ name: 'show_anim_colors', selector: bool }] : []; }
  _colorHex(key) { return rgbToHex(parseRgb(this._config[key]) || FX_DEFAULT_RGB[key.slice(6)]); }
  _colorRow(key) {
    const row = mk('div', 'crow'), sw = mk('div', 'csw'), input = document.createElement('input'), lab = mk('span', 'clab');
    input.type = 'color';
    input.addEventListener('input', () => { sw.style.background = input.value; });
    input.addEventListener('change', () => this._commit({ [key]: parseRgb(input.value) }, [key]));
    lab.textContent = this._t(key);
    sw.append(input);
    row.append(sw, lab);
    return { key, row, sw, input };
  }
  _renderAnimColors() {
    const box = this._colorsBox;
    if (!box) return;
    const keys = this._showColors ? this._animColorKeys() : [];
    box.hidden = !keys.length;
    const k = keys.join('|');
    if (k !== this._colorsSig) {
      this._colorsSig = k;
      this._colorRefs = keys.map(key => this._colorRow(key));
      box.replaceChildren(...this._colorRefs.map(r => r.row));
    }
    this._colorRefs.forEach(r => {
      const hex = this._colorHex(r.key);
      if (r.input.value !== hex) r.input.value = hex;
      r.sw.style.background = hex;
    });
  }
  _numOk(id) { const st = id && this._hass?.states?.[id]; return !!st && num1(st.state) != null; }
  _powerReady() {
    const id = this._config.watt_entity;
    return this._numOk(id) || (this._pwrReady && !!id);
  }
  _animReady() { return this._powerReady() || this._balanceReady(); }
  _syncAnim() {
    if (!this._animPanel) return;
    const d = this._animReady() ? '' : 'none';
    if (this._animPanel.style.display !== d) this._animPanel.style.display = d;
  }
  _balanceSchema() { return [{ name: 'cell_diff', selector: numSel(1, 200) }, { name: 'cell_bal_over', selector: numSel(1500, 4500) }]; }
  _lowHighSchema() {
    const s = [{ name: 'auto_detect_low_high', selector: bool }];
    if (!this._config.auto_detect_low_high) s.push({ name: 'pack_cell_low', selector: SENSOR_SELECTOR }, { name: 'pack_cell_high', selector: SENSOR_SELECTOR });
    return s;
  }
  _balanceReady() {
    const c = this._config;
    return !!c.auto_detect_low_high || (this._numOk(c.pack_cell_low) && this._numOk(c.pack_cell_high)) || (this._balReady && !!c.pack_cell_low && !!c.pack_cell_high);
  }
  _fontUnitSchema() {
    return [{ type: 'grid', name: '', schema: [
      { name: 'font_size', selector: numSel(4, 16, .5) },
      { name: 'cell_unit', selector: dropdown([{ value: 'mV', label: this._t('unit_mv') }, { value: 'V', label: this._t('unit_v') }]) }
    ] }];
  }
  _gapSchema() {
    return [{ type: 'grid', name: '', column_min_width: '90px', schema: [
      { name: 'cell_gap', selector: numSel(0, 16) },
      { name: 'top_padding', selector: numSel(0, 60) },
      { name: 'container_padding', selector: numSel(0, 40) }
    ] }];
  }
  _switchSchema() {
    const cfg = this._config;
    return [
      { name: 'show_legend', selector: bool },
      ...(cfg.show_legend ? LEGEND_TOGGLES.map(name => ({ name, selector: bool })) : []),
      { name: 'show_extra_sensors', selector: bool },
      { name: 'use_3d', selector: bool },
      { name: 'show_slices', selector: bool },
      ...(cfg.show_slices ? [{ name: 'slice_strength', selector: dropdown(SLICE_LEVELS.map(v => ({ value: v, label: this._t('slice_' + v) }))) }] : [])
    ];
  }
  _chunkSchema() { return [{ name: 'chunk_cells', selector: bool }]; }
  _chunkOptSchema() {
    const cfg = this._config, s = [];
    if (cfg.chunk_cells) {
      s.push({ name: 'chunk_mode', selector: dropdown(CHUNK_MODES.map(v => ({ value: v, label: this._t('chunk_' + v) }))) });
      if (cfg.chunk_mode === 'manual') s.push({ name: 'chunk_size', selector: numSel(2, 32) });
    }
    return s;
  }
  _extraSchema() {
    return [{ name: 'extra_font_scale', selector: { number: { min: 0.7, max: 1.5, step: 0.05, mode: 'slider' } } }];
  }

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
    const sep = () => mk('div', 'sep');
    const head = key => { const h = mk('div', 'sh'); h.textContent = this._t(key); return h; };
    const note = key => { const n = mk('div', 'hint'); n.textContent = this._t(key); return n; };
    this._condSeps = [];
    /* Divider that is only visible while both neighbouring forms have fields */
    const sepBetween = (a, b) => { const d = sep(); this._condSeps.push([d, a, b]); return d; };
    const one = (name, selector, field = name) => form(() => [{ name, selector }], [field]);
    const slider = (name, min, max) => one(name, { number: { min, max, step: 1, mode: 'slider' } });
    /* Custom scale lives inside the chemistry panel and is only shown for battery type "custom" */
    this._scalePanel = mk('div', 'custom');
    this._scalePanel.append(
      sep(), head('custom_scale'), hint, this._scalePresetForm(),
      sep(), form(this._scaleSchema, ['scale_gradient']),
      sep(), this._sortable('legend_stops'), addStop,
      sep(), form(this._customMinSchema, ['custom_min_mv']));

    /* Colour toggle is editor state only (not saved in the config) */
    const colorFn = this._animColorSchema.bind(this);
    const colorToggle = this._form(colorFn(), this._formData(), v => { this._showColors = !!v.show_anim_colors; this._syncForms(false); });
    this._forms.push([colorToggle, colorFn]);
    this._colorsBox = mk('div', 'colors');
    this._colorsSig = ''; this._colorRefs = [];

    const balForm = form(this._animBalSchema, ['show_balance_flow']);
    const flowForm = form(this._animFlowSchema, ['show_flow', 'flow_tip', 'flow_bar', 'flow_glow', 'flow_sync', 'flow_speed_mode', 'flow_speed', 'flow_speed_auto', 'flow_max_charge_w', 'flow_max_discharge_w']);
    const chunkOn = form(this._chunkSchema, ['chunk_cells']);
    const chunkOpt = form(this._chunkOptSchema, ['chunk_mode', 'chunk_size']);

    const root = mk('div', 'editor');
    root.append(
      form(this._topSchema, ['title']),
      panel('battery_chemistry', form(this._chemSchema, ['battery_type']), this._scalePanel),
      panel('cells',
        this._sortable('cells'),
        sep(),
        this._addForm(this._t('add_cell'), entity => this._setList('cells', [
          ...this._config.cells,
          { entity, name: this._entityName(entity, `${this._t('fallback_cell')} ${this._config.cells.length + 1}`) }
        ]))),
      panel('legend_sensors',
        one('soc_entity', SENSOR_SELECTOR), sep(),
        one('watt_entity', SENSOR_SELECTOR), sep(),
        one('cell_diff_sensor', SENSOR_SELECTOR), sep(),
        one('balance_sensor', { entity: {} })),
      panel('balancing_min_max',
        head('sec_bal'), note('hint_bal'),
        form(this._balanceSchema, ['cell_diff', 'cell_bal_over']),
        sep(), head('sec_lowhigh'), note('hint_lowhigh'),
        form(this._lowHighSchema, ['auto_detect_low_high', 'pack_cell_low', 'pack_cell_high'])),
      panel('display',
        head('sec_cells'),
        form(this._fontUnitSchema, ['font_size', 'cell_unit']),
        form(this._gapSchema, ['cell_gap', 'top_padding', 'container_padding']),
        sep(), slider('cell_height', CELL_H_MIN, CELL_H_MAX),
        sep(), slider('min_cell_width', MIN_CELL_W_FLOOR, 120),
        sep(), one('overlay_opacity_pct', { number: { min: 0, max: 100, step: 1, mode: 'slider' } }, 'overlay_opacity'),
        sep(),
        form(this._switchSchema, [...LEGEND_TOGGLES, 'show_legend', 'show_extra_sensors', 'use_3d', 'show_slices', 'slice_strength']),
        sep(),
        form(this._themeSchema, ['theme'])),
      this._animPanel = panel('animation',
        balForm, sepBetween(balForm, flowForm), flowForm,
        sepBetween(flowForm, colorToggle), colorToggle,
        this._colorsBox),
      panel('chunk_panel', chunkOn, sepBetween(chunkOn, chunkOpt), chunkOpt),
      panel('additional_sensors',
        this._sortable('extra_sensors'),
        sep(),
        this._addForm(this._t('add_sensor'), entity => {
          this._commit({ show_extra_sensors: true }, ['show_extra_sensors']);
          this._setList('extra_sensors', [
            ...this._config.extra_sensors,
            { entity, icon: '', name: this._entityName(entity, `${this._t('fallback_sensor')} ${this._config.extra_sensors.length + 1}`) }
          ]);
        }),
        sep(),
        form(this._extraSchema, ['extra_font_scale']))
    );
    this.append(style, root);
    this._accordion(root);
    this._built = true;
    const first = open.indexOf(true);
    if (first >= 0) { const ps = this.querySelectorAll('ha-expansion-panel'); if (ps[first]) ps[first].expanded = true; }
    ['cells', 'extra_sensors', 'legend_stops'].forEach(k => this._renderList(k));
    this._syncForms(false);
    this._local = sig(this._config);
  }

  _accordion(root) {
    const panels = [...root.querySelectorAll(':scope > ha-expansion-panel')];
    panels.forEach(p => p.addEventListener('expanded-changed', e => {
      if (e.target !== p || !e.detail?.expanded) return;
      panels.forEach(o => { if (o !== p && o.expanded) o.expanded = false; });
      /* The panel that was open collapses above and shifts the page: scroll to the opened panel once that is done */
      clearTimeout(this._scrollT);
      this._scrollT = setTimeout(() => p.scrollIntoView({ block: 'start', behavior: 'smooth' }), 350);
    }));
  }

  _syncForms(schema) {
    this._balReady = this._balanceReady();
    this._pwrReady = this._powerReady();
    const data = this._formData();
    this._forms.forEach(([f, fn]) => {
      if (schema) f.schema = fn();
      f.data = data;
    });
    this._condSeps?.forEach(([el, a, b]) => { const d = a.schema?.length && b.schema?.length ? '' : 'none'; if (el.style.display !== d) el.style.display = d; });
    if (this._presetForm) this._presetForm.data = { preset: this._presetKey() };
    if (this._scalePanel) this._scalePanel.style.display = this._config.battery_type === 'custom' ? '' : 'none';
    this._renderAnimColors();
    this._syncAnim();
  }

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
    /* Clearing a dropdown (X) falls back to its off/default value */
    const empty = v => v == null || v === '';
    partial = { ...partial };
    fields.forEach(f => { if (f in CLEAR_DEFAULTS && empty(partial[f])) partial[f] = CLEAR_DEFAULTS[f]; });
    if (fields.includes('chunk_mode') && empty(partial.chunk_mode)) { partial.chunk_mode = this._config.chunk_mode; partial.chunk_cells = false; }
    if (partial.overlay_opacity_pct !== undefined && partial.overlay_opacity_pct !== Math.round((Number(this._config.overlay_opacity) || 0) * 100)) {
      partial = { ...partial, overlay_opacity: partial.overlay_opacity_pct / 100 };
    }
    if (fields.some(k => RANGES[k] && partial[k] !== this._config[k] && !(partial[k] >= RANGES[k][0] && partial[k] <= RANGES[k][1]))) return;
    const next = { ...this._config };
    fields.forEach(f => {
      if (partial[f] !== undefined) next[f] = partial[f];
      else if (ENTITY_KEYS.includes(f)) next[f] = null;
    });
    COLOR_KEYS.forEach(k => { const v = parseRgb(next[k]); next[k] = v && J(v) !== J(FX_DEFAULT_RGB[k.slice(6)]) ? v : null; });
    if (partial.custom_min_mv !== undefined && next.battery_type === 'custom' && next.legend_stops?.length) {
      next.custom_min_mv = Math.min(next.custom_min_mv, Number(next.legend_stops[next.legend_stops.length - 1].mv) - 1);
    }

    if ('chunk_cells' in partial && !!partial.chunk_cells !== !!this._config.chunk_cells) {
      const go = { ...this._config.grid_options };
      delete go.rows;
      next.grid_options = partial.chunk_cells ? go : { ...go, rows: rowsFor(next) };
    }
    if (!next.chunk_cells && partial.cell_height !== undefined && partial.cell_height !== this._config.cell_height) {
      next.grid_options = { ...next.grid_options, rows: rowsFor(next) };
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

/* ── Registration ── */
window.customCards = window.customCards || [];
if (!window.customCards.some(x => x.type === 'battery-cells-card')) {
  window.customCards.push({
    type: 'battery-cells-card',
    name: 'Battery Cells Card',
    preview: true,
    description: 'Battery cell monitoring and BMS visualisation (LiFePO4 / NMC / Lead / Custom)'
  });
}
