/**
 * Battery Cells Card v0.8.0
 * Home Assistant custom Lovelace card
 */

console.info('%c 🔋 Battery Cell Card %c v0.8.0 ','background:linear-gradient(90deg,#ff0000 0%,#ff0000 2.5%,#ffa500 2.5%,#ffa500 5%,#ffff00 5%,#ffff00 7.5%,#00ee00 7.5%,#00ee00 100%);color:#000;font-weight:bold;padding:6px 12px;border-radius:4px;','color:#2e7d32;padding:4px 8px;');

const BATTERY_PRESETS = {

  lifepo4: {
    min: 2600,
    max: 3650,
    legend: [
      ['#ff0000', 5, '3.65V'],
      ['#ffa500', 5, '3.55V'],
      ['#ffff00', 10, '3.45V'],
      ['#00aa00', 60, '3.38V', '3.20V'],
      ['#ffff00', 10, null, '3.00V'],
      ['#ffa500', 5, null, '2.80V'],
      ['#ff0000', 5, null, '2.60V']
    ],
    barGradient: 'linear-gradient(to top,#ff0000 0%,#ff0000 5%,#ffa500 5%,#ffa500 10%,#ffff00 10%,#ffff00 20%,#00ee00 20%,#00ee00 80%,#ffff00 80%,#ffff00 90%,#ffa500 90%,#ffa500 95%,#ff0000 95%,#ff0000 100%)',
    fill: [
      {mv: 2600, pct: 0},
      {mv: 2800, pct: 5},
      {mv: 3000, pct: 10},
      {mv: 3200, pct: 20},
      {mv: 3380, pct: 80},
      {mv: 3450, pct: 90},
      {mv: 3550, pct: 95},
      {mv: 3650, pct: 100}
    ]
  },
  nmc: {
    min: 3000,
    max: 4200,
    legend: [
      ['#ff0000', 5, '4.20V'],
      ['#ffa500', 5, '4.10V'],
      ['#ffff00', 10, '4.00V'],
      ['#00aa00', 60, '3.70V', '3.50V'],
      ['#ffff00', 10, null, '3.30V'],
      ['#ffa500', 5, null, '3.10V'],
      ['#ff0000', 5, null, '3.00V']
    ],
    barGradient: 'linear-gradient(to top,#ff0000 0%,#ff0000 5%,#ffa500 5%,#ffa500 10%,#ffff00 10%,#ffff00 20%,#00ee00 20%,#00ee00 80%,#ffff00 80%,#ffff00 90%,#ffa500 90%,#ffa500 95%,#ff0000 95%,#ff0000 100%)',
    fill: [
      {mv: 3000, pct: 0},
      {mv: 3100, pct: 5},
      {mv: 3300, pct: 10},
      {mv: 3500, pct: 20},
      {mv: 3700, pct: 80},
      {mv: 4000, pct: 90},
      {mv: 4100, pct: 95},
      {mv: 4200, pct: 100}
    ]
  },
  lead: {
    min: 1800,
    max: 2450,
    legend: [
      ['#ff0000', 5, '2.45V'],
      ['#ffa500', 5, '2.35V'],
      ['#ffff00', 10, '2.25V'],
      ['#00aa00', 60, '2.10V', '2.00V'],
      ['#ffff00', 10, null, '1.90V'],
      ['#ffa500', 5, null, '1.85V'],
      ['#ff0000', 5, null, '1.80V']
    ],
    barGradient: 'linear-gradient(to top,#ff0000 0%,#ff0000 5%,#ffa500 5%,#ffa500 10%,#ffff00 10%,#ffff00 20%,#00ee00 20%,#00ee00 80%,#ffff00 80%,#ffff00 90%,#ffa500 90%,#ffa500 95%,#ff0000 95%,#ff0000 100%)',
    fill: [
      {mv: 1800, pct: 0},
      {mv: 1850, pct: 5},
      {mv: 1900, pct: 10},
      {mv: 2000, pct: 20},
      {mv: 2100, pct: 80},
      {mv: 2250, pct: 90},
      {mv: 2350, pct: 95},
      {mv: 2450, pct: 100}
    ]
  }
};


class BatteryCellsCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode:'open'});
    this._config={};
    this._hass=null;
    this._initialized=false;
    this._lastWidth=0;
    this._layoutKey='';
    this._resizeObserver=null;
    this._els={card:null,title:null,content:null,extraRow:null,cells:[],socTexts:[],diffDivs:[],iconSocs:[],syncIcons:[],extraItems:[]};
  }

  static getStubConfig() {
    return {
      title:'Battery Cells',theme:'',container_padding:10,top_padding:20,cell_gap:2,use_3d:true,
      show_legend:true,show_soc_icon:true,show_soc_value:true,show_sync_icon:true,show_cell_diff:true,
      show_extra_sensors:false,extra_sensors:[],overlay_opacity:.7,font_size:6,soc_entity:'sensor.soc',
      watt_entity:'sensor.pack',balance_sensor:null,cell_diff_sensor:'sensor.delta_mvolts',cell_diff:8,
      cell_bal_over:3000,cell_unit:'mV',auto_detect_low_high:true,pack_cell_low:null,pack_cell_high:null,
      chunk_cells:false,chunk_size:8,
      battery_type:'lifepo4',custom_min_mv:2600,custom_max_mv:3650,legend_stops:[],
      cells:Array.from({length:8},(_,i)=>({name:`Cell ${i+1}`,entity:`sensor.cell${i+1}`})),
      grid_options:{columns:12,rows:8}
    };
  }

  static getConfigElement() {
    return document.createElement('battery-cells-card-editor');
  }

  getGridOptions() {
    const go=this._config?.grid_options||{};
    return {
      columns:go.columns??12,
      rows:go.rows??8,
      min_columns:10,
      min_rows:6
    };
  }

  getCardSize() {
    const c=this._config||{},go=c.grid_options||{};
    const rows=go.rows==='auto'?8:typeof go.rows==='number'?go.rows:8;
    let base=rows;
    if(c.chunk_cells) base=Math.max(rows,Math.ceil((c.cells||[]).length/(c.chunk_size||8))*3);
    if(c.show_extra_sensors&&(c.extra_sensors||[]).length) base++;
    return base;
  }

  setConfig(config) {
    const d=BatteryCellsCard.getStubConfig(),c={...d,...config};
    delete c.background;
    delete c.card_height;

    c.cells=Array.isArray(config?.cells)&&config.cells.length?config.cells:d.cells;
    c.extra_sensors=Array.isArray(config?.extra_sensors)
      ?config.extra_sensors.map(s=>({name:s.name||'',entity:s.entity||'',icon:s.icon||'mdi:gauge'}))
      :[];

    c.grid_options={
      columns:config?.grid_options?.columns??d.grid_options.columns,
      rows:config?.grid_options?.rows??d.grid_options.rows
    };

    ['container_padding','top_padding','cell_gap','overlay_opacity','font_size','cell_diff','cell_bal_over','chunk_size']
      .forEach(k=>{if(c[k]==null)c[k]=d[k]});

    ['use_3d','show_legend','show_soc_icon','show_soc_value','show_sync_icon','show_cell_diff',
     'auto_detect_low_high','chunk_cells','show_extra_sensors']
      .forEach(k=>{if(c[k]==null)c[k]=d[k]});

    ['custom_min_mv','custom_max_mv'].forEach(k=>{if(c[k]==null)c[k]=d[k]});
    if(!c.battery_type||!['lifepo4','nmc','lead','custom'].includes(c.battery_type)) c.battery_type='lifepo4';
    if(!Array.isArray(c.legend_stops)) c.legend_stops=[];

    if(!c.show_legend)
      c.show_soc_value=c.show_soc_icon=c.show_cell_diff=c.show_sync_icon=false;

    const key=JSON.stringify({
      cells:c.cells.map(x=>`${x.entity}|${x.name||''}`),
      extra:c.extra_sensors.map(x=>`${x.entity}|${x.name}|${x.icon}`),
      showExtra:c.show_extra_sensors,chunk:c.chunk_cells,size:c.chunk_size,legend:c.show_legend,
      pad:c.container_padding,top:c.top_padding,gap:c.cell_gap,fs:c.font_size,op:c.overlay_opacity,
      d3:c.use_3d,title:c.title,theme:c.theme,go:c.grid_options,
      si:c.show_soc_icon,sv:c.show_soc_value,sy:c.show_sync_icon,sd:c.show_cell_diff,bt:c.battery_type,cmin:c.custom_min_mv,cmax:c.custom_max_mv,lstops:c.legend_stops
    });

    const changed=key!==this._layoutKey;
    this._config=c;
    this._layoutKey=key;

    if(this._hass){
      if(changed||!this._initialized)this._buildLayout(true);
      this._updateContent();
    }
  }

  set hass(hass) {
    this._hass=hass;
    if(!this._config)return;
    if(!this._initialized)this._buildLayout(true);
    this._updateContent();
  }

  _moreInfo(entityId) {
    if(!entityId)return;
    const ev=new Event('hass-more-info',{bubbles:true,composed:true});
    ev.detail={entityId};
    this.dispatchEvent(ev);
  }

  _applyTheme(card) {
    const theme=this._config.theme;
    if(!theme||theme==='default')card.removeAttribute('theme');
    else card.setAttribute('theme',theme);
  }

  _isCompactPreview() {
    const w=this.clientWidth||this.offsetWidth||0,h=this.clientHeight||this.offsetHeight||0;
    return w>0&&w<420||h>0&&h<260;
  }

  _buildLayout(force=false) {
    const c=this._config,shadow=this.shadowRoot;

    if(!this._initialized){
      shadow.innerHTML=`
<style>
:host{display:block;height:100%;width:100%;box-sizing:border-box;min-height:280px}
.card{height:100%;width:100%;box-sizing:border-box;border-radius:var(--ha-card-border-radius,12px);box-shadow:var(--ha-card-box-shadow,0 2px 4px rgba(0,0,0,.1));overflow:hidden;display:flex;flex-direction:column;padding:var(--bcc-pad,10px)}
.title{color:var(--primary-text-color);font-size:var(--bcc-title-size,24px);font-weight:400;padding:12px 0 0 16px;margin:0;padding-bottom:var(--bcc-top,20px);flex-shrink:0}
.extra-row{display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;justify-content:flex-start;padding:0 8px 10px 12px;flex-shrink:0}
.extra-row[hidden]{display:none!important}
.extra-item{display:inline-flex;align-items:center;gap:6px;cursor:pointer;color:var(--primary-text-color);font-size:calc(var(--bcc-fs,6)*1.4px + .55vw);font-weight:500;line-height:1.2;padding:2px 4px;border-radius:4px}
.extra-item:hover{background:rgba(127,127,127,.12)}
.extra-item ha-icon{--mdc-icon-size:calc(var(--bcc-fs,6)*2.2px + .9vw);color:var(--primary-color,var(--primary-text-color))}
.extra-name{color:var(--secondary-text-color);font-weight:400;margin-right:2px}
.extra-value{color:var(--primary-text-color);font-weight:600;font-variant-numeric:tabular-nums}
.extra-unit{color:var(--secondary-text-color);font-weight:400;font-size:.9em;margin-left:2px}
.content{flex:1;display:flex;flex-direction:column;gap:8px;overflow:hidden;width:100%;min-height:0}
.row{display:flex;gap:var(--bcc-gap,2px);align-items:flex-end;width:100%;box-sizing:border-box;min-height:0}
.cell-wrapper,.legend-wrapper{position:relative;border-radius:2px;overflow:visible;box-sizing:border-box;height:100%;flex:1 1 0;min-width:0}
.cell-wrapper{cursor:pointer}
.bar{width:100%;height:100%;position:relative;background:var(--bcc-bar-gradient,linear-gradient(to top,#ff0000 0%,#ff0000 5%,#ffa500 5%,#ffa500 10%,#ffff00 10%,#ffff00 20%,#00ee00 20%,#00ee00 80%,#ffff00 80%,#ffff00 90%,#ffa500 90%,#ffa500 95%,#ff0000 95%,#ff0000 100%))}
.overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,var(--bcc-op,.7));z-index:2;pointer-events:none}
.name,.value{position:absolute;left:50%;transform:translateX(-50%);z-index:3;width:90%;pointer-events:none;text-align:center;color:#fff;text-shadow:0 0 4px #000;font-weight:700;line-height:1.1}
.name{top:4px;white-space:normal;word-break:break-word;font-size:calc(var(--bcc-fs,6)*1.2px + .6vw)}
.value{bottom:4px;display:flex;flex-direction:column;align-items:center;white-space:nowrap}
.cell-value-num{font-size:calc(var(--bcc-fs,6)*1.5px + .6vw)}
.cell-value-unit{font-size:.85em;line-height:1}
.legend-inner{width:100%;height:100%;display:flex;flex-direction:column;position:relative;overflow:hidden}
.legend-block{position:relative;overflow:hidden;pointer-events:none}
.legend-label{position:absolute;left:0;right:0;text-align:center;font-weight:700;color:#fff;text-shadow:0 0 3px #000;pointer-events:none;font-size:calc(var(--bcc-fs,6)*1.2px + .5vw)}
.legend-label-top{top:-4px}.legend-label-bottom{bottom:-4px}
.overlay-soc{position:absolute;top:49%;left:50%;transform:translate(-50%,-50%);font-weight:700;color:#fff;text-shadow:0 0 6px #000;white-space:nowrap;cursor:pointer;font-size:calc(var(--bcc-fs,6)*1px + 1.2vw)}
.overlay-diff{position:absolute;top:57%;left:50%;transform:translate(-50%,-50%);font-weight:700;color:#fff;text-shadow:0 0 3px #000;white-space:nowrap;cursor:pointer;font-size:calc(var(--bcc-fs,6)*.7px + .6vw)}
.overlay-icon-battery{position:absolute;top:36%;left:50%;transform:translate(-50%,-50%);filter:drop-shadow(0 0 6px #000);cursor:pointer;--mdc-icon-size:calc(var(--bcc-fs,6)*2.8px + 1.6vw)}
.overlay-icon-sync{position:absolute;top:66%;left:50%;transform:translate(-50%,-50%);color:#dfeeff;filter:drop-shadow(0 0 16px #000);display:none;cursor:pointer;--mdc-icon-size:calc(var(--bcc-fs,6)*2.5px + 1.6vw)}
.border-highlight{position:absolute;inset:-3px;border-radius:3px;pointer-events:none;z-index:2;box-sizing:border-box;display:none}
.d3 .cell-wrapper,.d3 .legend-wrapper{border-top:3px solid #9b9b9b;border-left:3px solid #7b7b7b;border-right:3px solid #5b5b5b;border-bottom:3px solid #6d6d6d}
.flat .cell-wrapper,.flat .legend-wrapper{border:2px solid #000}
</style>
<ha-card class="card"><div class="title"></div><div class="extra-row" hidden></div><div class="content"></div></ha-card>`;

      this._els.card=shadow.querySelector('.card');
      this._els.title=shadow.querySelector('.title');
      this._els.extraRow=shadow.querySelector('.extra-row');
      this._els.content=shadow.querySelector('.content');
      this._initialized=true;
    }

    let contentW=this._els.content.clientWidth;
    if(!contentW||contentW<10)contentW=this.clientWidth||300;

    const widthChanged=Math.abs(contentW-this._lastWidth)>=8;
    if(!force&&this._els.cells.length===c.cells.length&&!widthChanged){
      this._buildExtraRow();
      return;
    }

    this._lastWidth=contentW;

    const compact=this._isCompactPreview();
    const fs=compact?Math.min(Number(c.font_size)||8,8):c.font_size;
    const titleSize=compact?'14px':'24px';
    const topPad=compact?Math.min(c.top_padding,8):c.top_padding;
    const contPad=compact?Math.min(c.container_padding,6):c.container_padding;
    const root=this._els.card;

    root.style.setProperty('--bcc-pad',`${contPad}px`);
    root.style.setProperty('--bcc-top',`${topPad}px`);
    root.style.setProperty('--bcc-gap',`${c.cell_gap}px`);
    root.style.setProperty('--bcc-fs',fs);
    root.style.setProperty('--bcc-op',c.overlay_opacity);
    root.style.setProperty('--bcc-title-size',titleSize);
    root.style.setProperty('--bcc-bar-gradient',this._getPreset().barGradient);
    root.classList.toggle('d3',!!c.use_3d);
    root.classList.toggle('flat',!c.use_3d);

    this._els.title.textContent=c.title||'';
    this._applyTheme(root);
    this.style.minHeight=compact?'300px':'280px';
    this._buildExtraRow();

    const content=this._els.content;
    content.innerHTML='';
    this._els.cells=[];
    this._els.socTexts=[];
    this._els.diffDivs=[];
    this._els.iconSocs=[];
    this._els.syncIcons=[];

    const chunkSize=c.chunk_size||8;
    const chunkActive=this._shouldChunk(c,contentW,chunkSize);
    const rowsData=chunkActive
      ?Array.from({length:Math.ceil(c.cells.length/chunkSize)},(_,i)=>c.cells.slice(i*chunkSize,(i+1)*chunkSize))
      :[c.cells];

    const gridRows=c.grid_options?.rows;
    const useIntrinsicHeight=chunkActive&&(gridRows==='auto'||gridRows==null||gridRows==='');
    const baseRowPx=compact?200:300;
    const extraH=c.show_extra_sensors&&(c.extra_sensors||[]).length?36:0;
    const titleSpace=(compact?36:56)+topPad+extraH;
    const pad=contPad*2;

    if(useIntrinsicHeight){
      this.style.height='auto';
      this.style.minHeight=compact?'300px':'280px';
      this._els.card.style.height='auto';
    }else{
      this.style.height='100%';
      this.style.minHeight=compact?'300px':'280px';
      this._els.card.style.height='100%';
    }

    let cellIndex=0;
    rowsData.forEach((chunk,rowIndex)=>{
      const row=document.createElement('div');
      row.className='row';
      if(chunkActive&&useIntrinsicHeight){
        row.style.flex='0 0 auto';
        row.style.height=`${baseRowPx}px`;
      }else{
        row.style.flex='1 1 0';
        row.style.minHeight=compact?'120px':'80px';
      }
      if(rowIndex>0)row.style.marginTop='8px';
      content.appendChild(row);
      if(c.show_legend)row.appendChild(this._createLegend());
      chunk.forEach(cfg=>{
        const cell=this._createCell(cfg,++cellIndex);
        row.appendChild(cell.cont);
        this._els.cells.push(cell);
      });
    });
  }

  _buildExtraRow() {
    const c=this._config,row=this._els.extraRow;
    if(!row)return;
    row.innerHTML='';
    this._els.extraItems=[];
    const list=c.show_extra_sensors?(c.extra_sensors||[]):[];

    if(!list.length){
      row.hidden=true;
      return;
    }

    row.hidden=false;
    list.forEach(cfg=>{
      const item=document.createElement('div');
      item.className='extra-item';
      item.title=cfg.name||cfg.entity||'';
      item.addEventListener('click',e=>{
        e.stopPropagation();
        this._moreInfo(cfg.entity);
      });

      const icon=document.createElement('ha-icon');
      icon.setAttribute('icon',cfg.icon||'mdi:gauge');
      item.appendChild(icon);

      if(cfg.name){
        const name=document.createElement('span');
        name.className='extra-name';
        name.textContent=cfg.name+':';
        item.appendChild(name);
      }

      const val=document.createElement('span');
      val.className='extra-value';
      val.textContent='—';
      item.appendChild(val);

      const unit=document.createElement('span');
      unit.className='extra-unit';
      item.appendChild(unit);

      row.appendChild(item);
      this._els.extraItems.push({entity:cfg.entity,cfgIcon:cfg.icon||'',valEl:val,unitEl:unit,iconEl:icon});
    });
  }

  _shouldChunk(c,width,size) {
    if(!c.chunk_cells)return false;
    const minCellW=Math.max(36,(c.font_size||6)*5.5);
    const n=c.cells.length+(c.show_legend?1:0);
    const gap=c.cell_gap*Math.max(0,n-1);
    const cellW=(width-gap)/Math.max(1,n);
    return window.innerWidth<1200||cellW<minCellW;
  }

  _createLegend() {
    const c=this._config,wrapper=document.createElement('div');
    wrapper.className='legend-wrapper';

    const inner=document.createElement('div');
    inner.className='legend-inner';
    wrapper.appendChild(inner);

    this._getPreset().legend.forEach(([color,pct,top,bottom])=>{
      const div=document.createElement('div');
      div.className='legend-block';
      div.style.background=color;
      div.style.flex=`${pct} 0 0px`;

      if(top){
        const lab=document.createElement('div');
        lab.className='legend-label legend-label-top';
        lab.textContent=top;
        div.appendChild(lab);
      }

      if(bottom){
        const lab=document.createElement('div');
        lab.className='legend-label legend-label-bottom';
        lab.textContent=bottom;
        div.appendChild(lab);
      }

      inner.appendChild(div);
    });

    const bind=(el,id)=>{
      if(!el||!id)return;
      el.addEventListener('click',e=>{
        e.stopPropagation();
        this._moreInfo(id);
      });
    };

    if(c.show_soc_value){
      const el=document.createElement('div');
      el.className='overlay-soc';
      inner.appendChild(el);
      this._els.socTexts.push(el);
      bind(el,c.soc_entity);
    }

    if(c.show_cell_diff){
      const el=document.createElement('div');
      el.className='overlay-diff';
      inner.appendChild(el);
      this._els.diffDivs.push(el);
      bind(el,c.cell_diff_sensor);
    }

    if(c.show_soc_icon){
      const el=document.createElement('ha-icon');
      el.className='overlay-icon-battery';
      el.setAttribute('icon','mdi:battery');
      inner.appendChild(el);
      this._els.iconSocs.push(el);
      bind(el,c.soc_entity);
    }

    if(c.show_sync_icon){
      const el=document.createElement('ha-icon');
      el.className='overlay-icon-sync';
      el.setAttribute('icon','mdi:sync');
      inner.appendChild(el);
      this._els.syncIcons.push(el);
      bind(el,c.cell_diff_sensor);
    }

    return wrapper;
  }

  _createCell(cfg,index) {
    const cont=document.createElement('div');
    cont.className='cell-wrapper';
    cont.style.height='100%';
    cont.title=cfg.name||cfg.entity||'';
    cont.addEventListener('click',e=>{
      e.stopPropagation();
      this._moreInfo(cfg.entity);
    });

    const bar=document.createElement('div');
    bar.className='bar';
    cont.appendChild(bar);

    const overlay=document.createElement('div');
    overlay.className='overlay';
    bar.appendChild(overlay);

    const name=document.createElement('div');
    name.className='name';
    name.textContent=cfg.name??'';
    bar.appendChild(name);

    const value=document.createElement('div');
    value.className='value';

    const num=document.createElement('span');
    num.className='cell-value-num';

    const unit=document.createElement('span');
    unit.className='cell-value-unit';

    value.append(num,unit);
    bar.appendChild(value);

    const border=document.createElement('div');
    border.className='border-highlight';
    cont.appendChild(border);

    return {cont,bar,overlay,nameDiv:name,numSpan:num,unitSpan:unit,border,entity:cfg.entity,index};
  }

  _formatExtraState(entityId) {
    const st=this._hass?.states?.[entityId];
    if(!st)return {value:'—',unit:'',icon:'mdi:gauge'};

    const unit=st.attributes?.unit_of_measurement||'';
    const icon=st.attributes?.icon||'mdi:gauge';
    const raw=st.state;

    if(raw==null||raw==='unavailable'||raw==='unknown')
      return {value:'—',unit:'',icon};

    const n=Number(raw);
    if(Number.isFinite(n)){
      const abs=Math.abs(n);
      let value=abs>=100?String(Math.round(n)):abs>=10?n.toFixed(1):n.toFixed(2);
      value=value.replace(/\.0+$/,'').replace(/(\.\d*?)0+$/,'$1').replace(/\.$/,'');
      return {value,unit,icon};
    }

    return {value:String(raw),unit,icon};
  }

  _updateContent() {
    if(!this._hass||!this._config||!this._initialized)return;

    const c=this._config,states=this._hass.states;

    this._els.extraItems.forEach(item=>{
      const {value,unit,icon}=this._formatExtraState(item.entity);
      item.valEl.textContent=value;
      item.unitEl.textContent=unit?` ${unit}`:'';
      if(item.iconEl)item.iconEl.setAttribute('icon',item.cfgIcon||icon||'mdi:gauge');
    });

    const socVal=parseFloat(states[c.soc_entity]?.state)||0;
    this._els.socTexts.forEach(el=>el.textContent=`${Math.round(socVal)}%`);

    let diffVal=parseFloat(states[c.cell_diff_sensor]?.state)||0;
    if(diffVal<1)diffVal*=1000;
    diffVal=Math.round(diffVal);

    const diffStr=diffVal?`Δ ${diffVal} mV`:'';
    this._els.diffDivs.forEach(el=>el.textContent=diffStr);

    const wattVal=parseFloat(states[c.watt_entity]?.state);
    let icon='mdi:battery',color='#00ccff';

    if(!Number.isNaN(wattVal)){
      if(wattVal>0){icon='mdi:battery-plus';color='#00ff00'}
      else if(wattVal<0){icon='mdi:battery-minus';color='#ff0000'}
    }

    this._els.iconSocs.forEach(el=>{
      el.setAttribute('icon',icon);
      el.style.color=color;
    });

    let lowIdx=c.pack_cell_low?parseInt(states[c.pack_cell_low]?.state,10):null;
    let highIdx=c.pack_cell_high?parseInt(states[c.pack_cell_high]?.state,10):null;

    if(!Number.isFinite(lowIdx))lowIdx=null;
    if(!Number.isFinite(highIdx))highIdx=null;

    let maxMv=0,minV=Infinity,maxV=-Infinity,minI=null,maxI=null;

    this._els.cells.forEach(cell=>{
      const raw=states[cell.entity]?.state,mv=this._toMv(raw);
      let valueStr,unitStr;

      if(mv==null){
        valueStr=raw??'-';
        unitStr='';
      }else if(c.cell_unit==='V'){
        valueStr=(mv/1000).toFixed(3);
        unitStr='V';
      }else{
        valueStr=String(Math.round(mv));
        unitStr='mV';
      }

      cell.numSpan.textContent=valueStr;
      cell.unitSpan.textContent=unitStr;
      cell.overlay.style.height=`${100-this._fillPercent(mv)}%`;

      if(mv!=null){
        if(mv>maxMv)maxMv=mv;
        if(mv<minV){minV=mv;minI=cell.index}
        if(mv>maxV){maxV=mv;maxI=cell.index}
      }
    });

    if(c.auto_detect_low_high){
      if(lowIdx==null)lowIdx=minI;
      if(highIdx==null)highIdx=maxI;
    }

    this._els.cells.forEach(cell=>{
      cell.border.style.display='none';
      cell.border.style.border='';

      if(cell.index===lowIdx){
        cell.border.style.borderTop='4px solid #ff6666';
        cell.border.style.borderLeft='4px solid #ff7f7f';
        cell.border.style.borderRight='4px solid #e60000';
        cell.border.style.borderBottom='4px solid #cc1a1a';
        cell.border.style.display='block';
      }else if(cell.index===highIdx){
        cell.border.style.borderTop='4px solid #99d1ff';
        cell.border.style.borderLeft='4px solid #66b3ff';
        cell.border.style.borderRight='4px solid #3385ff';
        cell.border.style.borderBottom='4px solid #0066dd';
        cell.border.style.display='block';
      }
    });

    let balancing=false;
    if(c.balance_sensor){
      const s=states[c.balance_sensor];
      if(s&&String(s.state).toLowerCase()==='on')balancing=true;
    }

    if(!balancing)balancing=diffVal>=c.cell_diff&&maxMv>=c.cell_bal_over;
    this._els.syncIcons.forEach(el=>el.style.display=balancing?'block':'none');
  }

  _toMv(raw) {
    const n=Number(raw);
    return Number.isFinite(n)?n<10?n*1000:n:null;
  }

  _getPreset() {
    const c = this._config || {};
    const type = c.battery_type || 'lifepo4';

    /* Full manual override via legend_stops */
    if (Array.isArray(c.legend_stops) && c.legend_stops.length >= 2) {
      return this._presetFromStops(c.legend_stops);
    }

    if (type === 'custom') {
      let min = Number(c.custom_min_mv);
      let max = Number(c.custom_max_mv);
      if (!Number.isFinite(min)) min = 2600;
      if (!Number.isFinite(max)) max = 3650;
      if (min >= max) { min = 2600; max = 3650; }
      /* Build same 7-segment structure as LiFePO4, scaled to min/max */
      const base = BATTERY_PRESETS.lifepo4;
      const span = max - min;
      const baseMin = base.min, baseSpan = base.max - base.min;
      const scale = (mv) => Math.round(min + ((mv - baseMin) / baseSpan) * span);
      const fmt = (mv) => (mv / 1000).toFixed(2).replace(/\.?0+$/, '') + 'V';
      const fill = base.fill.map(p => ({ mv: scale(p.mv), pct: p.pct }));
      const legend = base.legend.map((seg, i) => {
        const copy = seg.slice();
        /* rewrite labels from scaled fill points where present */
        return copy;
      });
      /* regenerate labels from fill points for clarity */
      const labels = fill.map(p => fmt(p.mv));
      /* map: fill indices 7,6,5,4,2,1,0 → legend tops/bottoms roughly */
      const legendScaled = [
        ['#ff0000', 5, labels[7]],
        ['#ffa500', 5, labels[6]],
        ['#ffff00', 10, labels[5]],
        ['#00aa00', 60, labels[4], labels[3]],
        ['#ffff00', 10, null, labels[2]],
        ['#ffa500', 5, null, labels[1]],
        ['#ff0000', 5, null, labels[0]]
      ];
      return {
        min, max,
        legend: legendScaled,
        barGradient: base.barGradient,
        fill
      };
    }

    return BATTERY_PRESETS[type] || BATTERY_PRESETS.lifepo4;
  }

  _presetFromStops(stops) {
    const c = this._config || {};
    const legend = stops.map(s => [
      s.color || '#00aa00',
      Number(s.pct) || 10,
      s.top || null,
      s.bottom || null
    ]);
    const withMv = stops.filter(s => Number.isFinite(Number(s.mv)));
    let fill, min, max, barGradient;
    if (withMv.length >= 2) {
      const sorted = withMv
        .map(s => ({ mv: Number(s.mv), color: s.color || '#00aa00' }))
        .sort((a, b) => a.mv - b.mv);
      min = sorted[0].mv;
      max = sorted[sorted.length - 1].mv;
      const span = max - min || 1;
      fill = sorted.map(s => ({
        mv: s.mv,
        pct: ((s.mv - min) / span) * 100
      }));
      /* build gradient from low→high for to-top */
      const parts = sorted.map(s => {
        const pct = ((s.mv - min) / span * 100).toFixed(1);
        return `${s.color} ${pct}%`;
      });
      barGradient = `linear-gradient(to top,${parts.join(',')})`;
    } else {
      min = Number(c.custom_min_mv) || 2600;
      max = Number(c.custom_max_mv) || 3650;
      fill = [
        { mv: min, pct: 0 },
        { mv: max, pct: 100 }
      ];
      barGradient = BATTERY_PRESETS.lifepo4.barGradient;
    }
    return { min, max, legend, barGradient, fill };
  }

  _fillPercent(mv) {
    if (mv == null) return 0;
    const { fill } = this._getPreset();
    if (!fill || fill.length < 2) return 0;
    if (mv <= fill[0].mv) return fill[0].pct;
    if (mv >= fill[fill.length - 1].mv) return fill[fill.length - 1].pct;
    for (let i = 0; i < fill.length - 1; i++) {
      const a = fill[i], b = fill[i + 1];
      if (mv >= a.mv && mv <= b.mv) {
        const t = (mv - a.mv) / (b.mv - a.mv || 1);
        return a.pct + t * (b.pct - a.pct);
      }
    }
    return 50;
  }

  connectedCallback() {
    this._onResize=this._debounce(()=>{
      if(this._initialized&&this._config&&this._hass){
        this._lastWidth=0;
        this._buildLayout(true);
        this._updateContent();
      }
    },250);

    if(typeof ResizeObserver!=='undefined'){
      this._resizeObserver=new ResizeObserver(()=>this._onResize());
      this._resizeObserver.observe(this);
    }else window.addEventListener('resize',this._onResize);
  }

  disconnectedCallback() {
    if(this._resizeObserver){
      this._resizeObserver.disconnect();
      this._resizeObserver=null;
    }
    if(this._onResize)window.removeEventListener('resize',this._onResize);
  }

  _debounce(fn,ms) {
    let t;
    return ()=>{clearTimeout(t);t=setTimeout(fn,ms)};
  }
}

customElements.define('battery-cells-card',BatteryCellsCard);

/**
 * Home Assistant custom Lovelace card editor
 */

class BatteryCellsCardEditor extends HTMLElement {
  constructor() {
    super();
    this._config={};
    this._hass=null;
    this._built=false;
    this._localConfig='';
    this._language='en';
  }

  set hass(hass) {
    this._hass=hass;
    const language=hass?.locale?.language?.toLowerCase()||'en';
    const nextLanguage=language.startsWith('de')?'de':'en';
    const changed=this._language!==nextLanguage;
    this._language=nextLanguage;

    this.querySelectorAll('ha-form').forEach(form=>form.hass=hass);
    if(changed&&this._built)this._build();
  }

  setConfig(config) {
    const initial=!this._built&&!Object.keys(this._config).length;
    const defined=Object.fromEntries(Object.entries(config||{}).filter(([,v])=>v!==undefined));

    const next={
      ...(initial?BatteryCellsCard.getStubConfig():this._config),
      ...defined
    };

    if(Array.isArray(config?.cells))next.cells=config.cells;
    if(Array.isArray(config?.extra_sensors))next.extra_sensors=config.extra_sensors;

    const normalized=this._normalize(next);
    const json=JSON.stringify(normalized);
    const local=json===this._localConfig;

    const oldLists=JSON.stringify([this._config.cells||[],this._config.extra_sensors||[]]);
    const newLists=JSON.stringify([normalized.cells||[],normalized.extra_sensors||[]]);
    const listsChanged=oldLists!==newLists;

    this._config=normalized;

    if(!this._built){
      this._build();
      return;
    }

    if(!local&&listsChanged){
      this._renderList('cells');
      this._renderList('extra_sensors');
    }

    if(!local)this._syncForms();
  }

  _t(key) {
    const t={
      en:{
        cells:'Cells',add_cell:'Add Cell',legend_sensors:'Legend Sensors',
        balancing_min_max:'Balancing & Min Cell / Max Cell',display:'Display',
        additional_sensors:'Additional Sensors',add_sensor:'Add Sensor',
        title:'Name',theme:'Theme',default:'Default',name:'Name',icon:'Icon',entity:'Entity',
        edit:'Edit',delete:'Delete',move:'Move',
        soc_entity:'State of charge (SOC)',watt_entity:'Power (W)',
        cell_diff_sensor:'Cell voltage delta',balance_sensor:'Balancing active (optional)',
        cell_diff:'Delta threshold (mV)',cell_bal_over:'Min cell voltage (mV)',
        auto_detect_low_high:'Auto-detect lowest / highest cell',
        pack_cell_low:'Lowest cell sensor',pack_cell_high:'Highest cell sensor',
        show_legend:'Show legend',show_soc_value:'Show SOC value',show_soc_icon:'Show SOC icon',
        show_cell_diff:'Show cell delta',show_sync_icon:'Show sync icon',
        show_extra_sensors:'Show additional sensors',use_3d:'3D frame',
        cell_unit:'Cell unit',font_size:'Font size',cell_gap:'Cell gap (px)',
        container_padding:'Container padding (px)',top_padding:'Title spacing (px)',
        overlay_opacity:'Overlay opacity',chunk_cells:'Wrap cells into rows',
        chunk_size:'Cells per row',fallback_cell:'Cell',fallback_sensor:'Sensor',
        battery_chemistry:'Battery Chemistry',battery_type:'Battery type',
        type_lifepo4:'LiFePO4',type_nmc:'NMC / NCM (Li-Ni-Mn-Co)',type_lead:'Lead-Acid (2V cell)',type_custom:'Custom',
        custom_min_mv:'Custom min voltage (mV)',custom_max_mv:'Custom max voltage (mV)',
        unit_mv:'mV',unit_v:'V'
      },
      de:{
        cells:'Zellen',add_cell:'Zelle hinzufügen',legend_sensors:'Legenden-Sensoren',
        balancing_min_max:'Balancing & Min. Zelle / Max. Zelle',display:'Anzeige',
        additional_sensors:'Zusätzliche Sensoren',add_sensor:'Sensor hinzufügen',
        title:'Name',theme:'Theme',default:'Standard',name:'Name',icon:'Symbol',entity:'Entität',
        edit:'Bearbeiten',delete:'Löschen',move:'Verschieben',
        soc_entity:'Ladezustand (SOC)',watt_entity:'Leistung (W)',
        cell_diff_sensor:'Zellspannungsdifferenz',balance_sensor:'Balancing aktiv (optional)',
        cell_diff:'Differenzschwellwert (mV)',cell_bal_over:'Min. Zellspannung (mV)',
        auto_detect_low_high:'Niedrigste / höchste Zelle automatisch erkennen',
        pack_cell_low:'Sensor für niedrigste Zelle',pack_cell_high:'Sensor für höchste Zelle',
        show_legend:'Legende anzeigen',show_soc_value:'SOC-Wert anzeigen',
        show_soc_icon:'SOC-Symbol anzeigen',show_cell_diff:'Zelldifferenz anzeigen',
        show_sync_icon:'Synchronisationssymbol anzeigen',
        show_extra_sensors:'Zusätzliche Sensoren anzeigen',use_3d:'3D-Rahmen',
        cell_unit:'Zelleneinheit',font_size:'Schriftgröße',cell_gap:'Zellenabstand (px)',
        container_padding:'Innenabstand (px)',top_padding:'Abstand zum Titel (px)',
        overlay_opacity:'Deckkraft des Overlays',chunk_cells:'Zellen auf mehrere Zeilen verteilen',
        chunk_size:'Zellen pro Zeile',fallback_cell:'Zelle',fallback_sensor:'Sensor',
        battery_chemistry:'Batterie-Chemie',battery_type:'Batterietyp',
        type_lifepo4:'LiFePO4',type_nmc:'NMC / NCM (Li-Ni-Mn-Co)',type_lead:'Blei (2V-Zelle)',type_custom:'Benutzerdefiniert',
        custom_min_mv:'Eigene Min-Spannung (mV)',custom_max_mv:'Eigene Max-Spannung (mV)',
        unit_mv:'mV',unit_v:'V'
      }
    };

    return t[this._language]?.[key]??t.en[key]??key;
  }

  _computeLabel(schema,context={}) {
    if(!schema?.name)return '';

    if(schema.name==='entity'){
      if(context.kind==='cells')return `${this._t('fallback_cell')} ${context.index+1}`;
      if(context.kind==='extra_sensors')return `${this._t('fallback_sensor')} ${context.index+1}`;
      if(context.addLabel)return context.addLabel;
    }

    return this._t(schema.name);
  }

  _normalize(config) {
    return {
      ...config,
      cells:Array.isArray(config.cells)
        ?config.cells.map(cell=>({name:cell?.name||'',entity:cell?.entity||''}))
        :[],
      extra_sensors:Array.isArray(config.extra_sensors)
        ?config.extra_sensors.map(sensor=>({name:sensor?.name||'',entity:sensor?.entity||'',icon:sensor?.icon||''}))
        :[],
      grid_options:{
        columns:config.grid_options?.columns??12,
        rows:config.grid_options?.rows??8
      }
    };
  }

  _form(schema,data,changed,labelContext={}) {
    const form=document.createElement('ha-form');
    form.hass=this._hass;
    form.schema=schema;
    form.data=data;
    form.computeLabel=field=>this._computeLabel(field,labelContext);

    form.addEventListener('value-changed',event=>{
      event.stopPropagation();
      if(event.detail?.value)changed(event.detail.value);
    });

    return form;
  }

  _panel(header,expanded=false) {
    const panel=document.createElement('ha-expansion-panel');
    panel.header=header;
    panel.outlined=true;
    panel.expanded=expanded;
    return panel;
  }

  _build() {
    this.replaceChildren();

    const style=document.createElement('style');
    style.textContent=`
:host{display:block}
.editor{display:flex;flex-direction:column;gap:var(--ha-space-4,8px)}
ha-form{display:block}
.list{display:flex;flex-direction:column;gap:var(--ha-space-2,4px)}
.row{display:grid;grid-template-columns:minmax(0,1fr) auto 40px auto;align-items:center;gap:var(--ha-space-1,4px)}
.entity{min-width:0}
.handle{width:40px;height:40px;display:flex;align-items:center;justify-content:center;cursor:grab;color:var(--secondary-text-color);touch-action:none}
.handle:active{cursor:grabbing}
.handle ha-svg-icon{width:24px;height:24px}
.detail{grid-column:1/-1}
.detail[hidden]{display:none}
`;

    this.append(style);

    this._root=document.createElement('div');
    this._root.className='editor';
    this.append(this._root);

    this._topForm=this._form(
      this._topSchema(),
      this._config,
      value=>this._commit(value,['title','theme'])
    );
    this._root.append(this._topForm);

    this._chemPanel=this._panel(this._t('battery_chemistry'),true);
    this._chemForm=this._form(
      this._chemSchema(),
      this._config,
      value=>this._commit(value,['battery_type','custom_min_mv','custom_max_mv'])
    );
    this._chemPanel.append(this._chemForm);
    this._root.append(this._chemPanel);

    this._cellsPanel=this._panel(this._t('cells'),true);
    this._cellsPanel.append(
      this._createSortable('cells'),
      this._createAddForm(this._t('add_cell'),entity=>{
        if(!entity)return;
        this._setList('cells',[
          ...this._config.cells,
          {
            entity,
            name:this._entityName(entity,`${this._t('fallback_cell')} ${this._config.cells.length+1}`)
          }
        ]);
      })
    );
    this._root.append(this._cellsPanel);

    this._sensorsPanel=this._panel(this._t('legend_sensors'));
    this._sensorsForm=this._form(
      this._sensorsSchema(),
      this._config,
      value=>this._commit(value,['soc_entity','watt_entity','cell_diff_sensor','balance_sensor'])
    );
    this._sensorsPanel.append(this._sensorsForm);
    this._root.append(this._sensorsPanel);

    this._balancePanel=this._panel(this._t('balancing_min_max'));
    this._balanceForm=this._form(
      this._balanceSchema(),
      this._config,
      value=>this._commit(value,['cell_diff','cell_bal_over','auto_detect_low_high','pack_cell_low','pack_cell_high'])
    );
    this._balancePanel.append(this._balanceForm);
    this._root.append(this._balancePanel);

    this._displayPanel=this._panel(this._t('display'));
    this._displayForm=this._form(
      this._displaySchema(),
      this._config,
      value=>this._commit(value,[
        'show_legend','show_soc_value','show_soc_icon','show_cell_diff','show_sync_icon',
        'show_extra_sensors','use_3d','cell_unit','font_size','cell_gap','container_padding',
        'top_padding','overlay_opacity','chunk_cells','chunk_size'
      ])
    );
    this._displayPanel.append(this._displayForm);
    this._root.append(this._displayPanel);

    this._extraPanel=this._panel(this._t('additional_sensors'));
    this._extraPanel.append(
      this._createSortable('extra_sensors'),
      this._createAddForm(this._t('add_sensor'),entity=>{
        if(!entity)return;

        this._commit({show_extra_sensors:true},['show_extra_sensors']);

        this._setList('extra_sensors',[
          ...this._config.extra_sensors,
          {
            entity,
            name:this._entityName(entity,`${this._t('fallback_sensor')} ${this._config.extra_sensors.length+1}`),
            icon:''
          }
        ]);
      })
    );
    this._root.append(this._extraPanel);

    this._built=true;
    this._renderList('cells');
    this._renderList('extra_sensors');
    this._localConfig=JSON.stringify(this._config);
  }

  _createSortable(kind) {
    const sortable=document.createElement('ha-sortable');
    sortable.setAttribute('handle-selector','.handle');
    sortable.setAttribute('draggable-selector','.row');

    sortable.addEventListener('item-moved',event=>{
      const {oldIndex,newIndex}=event.detail||{};
      if(!Number.isInteger(oldIndex)||!Number.isInteger(newIndex)||oldIndex===newIndex)return;

      const list=[...this._config[kind]];
      const [item]=list.splice(oldIndex,1);
      if(!item)return;

      list.splice(newIndex,0,item);
      this._setList(kind,list);
    });

    const list=document.createElement('div');
    list.className=`list ${kind}`;
    sortable.append(list);
    this[`_${kind}List`]=list;
    return sortable;
  }

  _createRow(kind,item,index) {
    const row=document.createElement('div');
    row.className='row';

    const entityForm=this._form(
      [{name:'entity',selector:{entity:{domain:'sensor'}}}],
      {entity:item.entity},
      value=>this._updateItem(kind,index,{entity:value.entity||''}),
      {kind,index}
    );
    entityForm.className='entity';

    const editButton=document.createElement('ha-icon-button');
    editButton.path='M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.13,5.12L18.88,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z';
    editButton.label=this._t('edit');
    editButton.title=this._t('edit');

    const detail=document.createElement('div');
    detail.className='detail';
    detail.hidden=true;

    const schema=kind==='cells'
      ?[{name:'name',selector:{text:{}}}]
      :[
        {name:'name',selector:{text:{}}},
        {name:'icon',selector:{icon:{}}}
      ];

    detail.append(
      this._form(schema,item,value=>this._updateItem(kind,index,value))
    );

    editButton.addEventListener('click',()=>detail.hidden=!detail.hidden);

    const handle=document.createElement('div');
    handle.className='handle';
    handle.tabIndex=0;
    handle.setAttribute('aria-label',this._t('move'));

    const dragIcon=document.createElement('ha-svg-icon');
    dragIcon.path='M9,5H15V7H9V5M9,11H15V13H9V11M9,17H15V19H9V17Z';
    handle.append(dragIcon);

    const deleteButton=document.createElement('ha-icon-button');
    deleteButton.path='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,6.41Z';
    deleteButton.label=this._t('delete');
    deleteButton.title=this._t('delete');

    deleteButton.addEventListener('click',()=>{
      const list=[...this._config[kind]];
      list.splice(index,1);
      this._setList(kind,list);
    });

    row.append(entityForm,editButton,handle,deleteButton,detail);
    return row;
  }

  _renderList(kind) {
    const list=this[`_${kind}List`];
    if(!list)return;

    list.replaceChildren(
      ...(this._config[kind]||[]).map((item,index)=>this._createRow(kind,item,index))
    );
  }

  _updateItem(kind,index,patch) {
    const list=[...this._config[kind]];
    list[index]={...list[index],...patch};
    this._setList(kind,list,false);
  }

  _setList(kind,list,render=true) {
    this._config[kind]=list.map(item=>({...item}));
    if(render) {
      this._renderList(kind);
    }
    this._emit();
  }

  _createAddForm(label,callback) {
    const form=this._form(
      [{name:'entity',selector:{entity:{domain:'sensor'}}}],
      {entity:''},
      value=>{
        if(!value.entity)return;
        callback(value.entity);
        form.data={entity:''};
      },
      {addLabel:label}
    );
    return form;
  }

  _entityName(entity,fallback) {
    return this._hass?.states?.[entity]?.attributes?.friendly_name||fallback;
  }

  _themes() {
    return [
      {value:'',label:this._t('default')},
      ...Object.keys(this._hass?.themes?.themes||{})
        .sort()
        .map(theme=>({value:theme,label:theme}))
    ];
  }

  _topSchema() {
    return [
      {name:'title',selector:{text:{}}},
      {name:'theme',selector:{select:{mode:'dropdown',options:this._themes()}}}
    ];
  }

  _chemSchema() {
    return [
      {
        name:'battery_type',
        selector:{
          select:{
            mode:'dropdown',
            options:[
              {value:'lifepo4',label:this._t('type_lifepo4')},
              {value:'nmc',label:this._t('type_nmc')},
              {value:'lead',label:this._t('type_lead')},
              {value:'custom',label:this._t('type_custom')}
            ]
          }
        }
      },
      {
        name:'custom_min_mv',
        visible:{field:'battery_type',value:'custom'},
        selector:{number:{min:1000,max:5000,mode:'box'}}
      },
      {
        name:'custom_max_mv',
        visible:{field:'battery_type',value:'custom'},
        selector:{number:{min:1000,max:5000,mode:'box'}}
      }
    ];
  }

  _sensorsSchema() {
    return [
      {name:'soc_entity',selector:{entity:{domain:'sensor'}}},
      {name:'watt_entity',selector:{entity:{domain:'sensor'}}},
      {name:'cell_diff_sensor',selector:{entity:{domain:'sensor'}}},
      {name:'balance_sensor',selector:{entity:{}}}
    ];
  }

  _balanceSchema() {
    return [
      {name:'cell_diff',selector:{number:{min:1,max:200,mode:'box'}}},
      {name:'cell_bal_over',selector:{number:{min:2000,max:4000,mode:'box'}}},
      {name:'auto_detect_low_high',selector:{boolean:{}}},
      {
        name:'pack_cell_low',
        visible:{field:'auto_detect_low_high',operator:'not_eq',value:true},
        selector:{entity:{domain:'sensor'}}
      },
      {
        name:'pack_cell_high',
        visible:{field:'auto_detect_low_high',operator:'not_eq',value:true},
        selector:{entity:{domain:'sensor'}}
      }
    ];
  }

  _displaySchema() {
    const legend=['show_soc_value','show_soc_icon','show_cell_diff','show_sync_icon'];

    return [
      {name:'show_legend',selector:{boolean:{}}},
      ...legend.map(name=>({
        name,
        visible:{field:'show_legend',value:true},
        selector:{boolean:{}}
      })),
      {name:'show_extra_sensors',selector:{boolean:{}}},
      {name:'use_3d',selector:{boolean:{}}},
      {
        name:'cell_unit',
        selector:{
          select:{
            mode:'dropdown',
            options:[
              {value:'mV',label:this._t('unit_mv')},
              {value:'V',label:this._t('unit_v')}
            ]
          }
        }
      },
      {name:'font_size',selector:{number:{min:4,max:16,step:.5,mode:'box'}}},
      {name:'cell_gap',selector:{number:{min:0,max:16,mode:'box'}}},
      {name:'container_padding',selector:{number:{min:0,max:40,mode:'box'}}},
      {name:'top_padding',selector:{number:{min:0,max:60,mode:'box'}}},
      {name:'overlay_opacity',selector:{number:{min:0,max:1,step:.05,mode:'box'}}},
      {name:'chunk_cells',selector:{boolean:{}}},
      {
        name:'chunk_size',
        visible:{field:'chunk_cells',value:true},
        selector:{number:{min:2,max:32,mode:'box'}}
      }
    ];
  }

  _commit(partial,fields) {
    const next={...this._config};

    fields.forEach(field=>{
      if(Object.prototype.hasOwnProperty.call(partial,field)&&partial[field]!==undefined)
        next[field]=partial[field];
    });

    if(fields.includes('chunk_cells')&&Object.prototype.hasOwnProperty.call(partial,'chunk_cells')){
      next.grid_options={
        ...(next.grid_options||{}),
        rows:partial.chunk_cells?'auto':8
      };
    }

    if(fields.includes('battery_type')&&partial.battery_type){
      const defaults={lifepo4:3000,nmc:3500,lead:2000,custom:Number(next.custom_min_mv)||2600};
      if(defaults[partial.battery_type]!=null) next.cell_bal_over=defaults[partial.battery_type];
    }

    this._config=this._normalize(next);

    if(!this._config.show_legend)
      this._config.show_soc_value=this._config.show_soc_icon=this._config.show_cell_diff=this._config.show_sync_icon=false;

    this._emit();
  }

  _emit() {
    const config=this._normalize({...this._config});
    delete config.background;
    delete config.card_height;

    this._localConfig=JSON.stringify(config);

    this.dispatchEvent(new CustomEvent('config-changed',{
      detail:{config},
      bubbles:true,
      composed:true
    }));
  }

  _syncForms() {
    if(!this._built)return;

    this._topForm.data=this._config;
    this._topForm.schema=this._topSchema();

    if(this._chemForm){
      this._chemForm.data=this._config;
      this._chemForm.schema=this._chemSchema();
    }

    this._sensorsForm.data=this._config;
    this._sensorsForm.schema=this._sensorsSchema();

    this._balanceForm.data=this._config;
    this._balanceForm.schema=this._balanceSchema();

    this._displayForm.data=this._config;
    this._displayForm.schema=this._displaySchema();
  }
}

customElements.define('battery-cells-card-editor',BatteryCellsCardEditor);

window.customCards=window.customCards||[];
window.customCards.push({
  type:'battery-cells-card',
  name:'Battery Cells Card',
  preview:true,
  description:'Battery cell monitoring and BMS visualisation (LiFePO4 / NMC / Lead / Custom)'
});
