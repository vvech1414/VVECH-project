// IntelDok Cockpit UI — minimal primitives
// Globals: Sidebar, TopBar, PatientList, PatientDetail, AIBrief, MetricStrip, LabRow

const cockpitIcons = {
  search: 'M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm10 2l-4.35-4.35',
  calendar: 'M3 8h18M6 3v4m12-4v4M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z',
  chart: 'M3 3v18h18M7 15l4-4 3 3 5-6',
  message: 'M21 12a8 8 0 0 1-8 8H6l-3 3V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8z',
  user: 'M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.4-3a7.4 7.4 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a7.4 7.4 0 0 0-2-1.2l-.4-2.4h-4l-.4 2.4a7.4 7.4 0 0 0-2 1.2l-2.3-1-2 3.4 2 1.5c-.1.4-.1.8-.1 1.2s0 .8.1 1.2l-2 1.5 2 3.4 2.3-1c.6.5 1.3.9 2 1.2l.4 2.4h4l.4-2.4c.7-.3 1.4-.7 2-1.2l2.3 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z',
  plus: 'M12 5v14M5 12h14',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  sparkle: 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2',
};

const CI = ({ name, size=20, stroke='currentColor', strokeWidth=1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d={cockpitIcons[name]} />
  </svg>
);

function Sidebar({ current, onChange }) {
  const items = [
    ['roster','Пациенты','user'],
    ['calendar','Приёмы','calendar'],
    ['chats','Чаты','message'],
    ['analytics','Аналитика','chart'],
  ];
  return (
    <div style={{width:220,background:'#fff',borderRight:'1px solid var(--slate-100)',display:'flex',flexDirection:'column',padding:'22px 16px',gap:4}}>
      <div style={{display:'flex',alignItems:'center',gap:10,padding:'4px 10px 22px'}}>
        <div style={{width:32,height:32,borderRadius:10,background:'var(--blue-600)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontFamily:'var(--font-display)'}}>ID</div>
        <div style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:18,color:'var(--slate-900)',letterSpacing:-.02}}>intelDok</div>
      </div>
      {items.map(([id,label,icon]) => (
        <button key={id} onClick={()=>onChange(id)} style={{
          display:'flex',alignItems:'center',gap:12,padding:'10px 12px',border:0,
          background:current===id?'var(--blue-050)':'transparent',
          color:current===id?'var(--blue-600)':'var(--slate-600)',
          borderRadius:10,fontFamily:'var(--font-ui)',fontWeight:current===id?700:500,fontSize:14,cursor:'pointer',textAlign:'left'
        }}><CI name={icon} size={18}/>{label}</button>
      ))}
      <div style={{flex:1}}/>
      <button style={{display:'flex',alignItems:'center',gap:12,padding:'10px 12px',border:0,background:'transparent',color:'var(--slate-500)',borderRadius:10,fontFamily:'var(--font-ui)',fontSize:14,cursor:'pointer',textAlign:'left'}}><CI name="gear" size={18}/>Настройки</button>
    </div>
  );
}

function TopBar({ title, subtitle, right }) {
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'20px 32px',borderBottom:'1px solid var(--slate-100)',background:'#fff'}}>
      <div>
        <div style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:22,color:'var(--slate-900)',letterSpacing:-.01}}>{title}</div>
        {subtitle && <div style={{fontFamily:'var(--font-ui)',fontSize:13,color:'var(--slate-500)',marginTop:2}}>{subtitle}</div>}
      </div>
      <div style={{display:'flex',gap:10,alignItems:'center'}}>{right}</div>
    </div>
  );
}

const MOCK_PATIENTS = [
  { id:'p1', name:'Михалыч (Виктор Н.)', age:58, tag:'СД1', status:'warn', last:'1 час назад', a1c:'7.8%', range:62, alert:'Серия гипогликемий · вчера' },
  { id:'p2', name:'Елена Сидорова', age:44, tag:'СД2', status:'ok', last:'Сегодня', a1c:'6.4%', range:84, alert:null },
  { id:'p3', name:'Пётр Игнатьев', age:67, tag:'СД2', status:'ok', last:'3 дня', a1c:'6.9%', range:77, alert:null },
  { id:'p4', name:'Наталья Кравцова', age:52, tag:'СД1 · Велгия', status:'err', last:'Сегодня', a1c:'8.9%', range:41, alert:'Титрация Велгии — риск гипо' },
  { id:'p5', name:'Олег Гринько', age:61, tag:'СД2', status:'ok', last:'Вчера', a1c:'7.1%', range:70, alert:null },
  { id:'p6', name:'Александр Соков', age:39, tag:'СД1', status:'warn', last:'2 дня', a1c:'7.6%', range:66, alert:'Дефицит записей · 4 дня' },
];

function StatusDot({ s }) {
  const colors = { ok:'var(--success-600)', warn:'var(--warning-600)', err:'var(--error-600)' };
  return <span style={{width:8,height:8,borderRadius:999,background:colors[s],flexShrink:0}}/>;
}

function PatientList({ selectedId, onSelect }) {
  return (
    <div style={{background:'#fff',border:'1px solid var(--slate-100)',borderRadius:16,overflow:'hidden'}}>
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr 1.5fr',padding:'12px 20px',borderBottom:'1px solid var(--slate-100)',fontFamily:'var(--font-data)',fontSize:11,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:'var(--slate-500)'}}>
        <div>Пациент</div><div>Возраст</div><div>Диагноз</div><div>Последний замер</div><div>HbA1c</div><div>В диапазоне</div>
      </div>
      {MOCK_PATIENTS.map(p => (
        <div key={p.id} onClick={()=>onSelect(p.id)} style={{
          display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr 1.5fr',padding:'14px 20px',
          borderBottom:'1px solid var(--slate-100)',cursor:'pointer',
          background:selectedId===p.id?'var(--blue-050)':'transparent',
          fontFamily:'var(--font-ui)',fontSize:14,color:'var(--slate-800)',alignItems:'center',
        }}>
          <div style={{display:'flex',gap:10,alignItems:'center',fontWeight:600}}><StatusDot s={p.status}/>{p.name}</div>
          <div style={{color:'var(--slate-600)'}}>{p.age}</div>
          <div style={{color:'var(--slate-600)'}}>{p.tag}</div>
          <div style={{color:'var(--slate-600)'}}>{p.last}</div>
          <div style={{fontFamily:'var(--font-data)',fontWeight:600,fontVariantNumeric:'tabular-nums'}}>{p.a1c}</div>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{flex:1,height:6,background:'var(--slate-100)',borderRadius:999,overflow:'hidden'}}>
              <div style={{width:`${p.range}%`,height:'100%',background:p.range>=70?'var(--success-600)':p.range>=50?'var(--warning-600)':'var(--error-600)'}}/>
            </div>
            <span style={{fontFamily:'var(--font-data)',fontSize:12,color:'var(--slate-600)',fontVariantNumeric:'tabular-nums',width:32,textAlign:'right'}}>{p.range}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function AIBrief() {
  return (
    <div style={{background:'linear-gradient(135deg, #EAF2FF 0%, #F5F9FA 100%)',border:'1px solid var(--blue-100)',borderRadius:16,padding:24}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
        <div style={{width:28,height:28,borderRadius:8,background:'var(--blue-600)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff'}}><CI name="sparkle" size={16}/></div>
        <div style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:16,color:'var(--slate-900)'}}>Сводка к приёму · Василий</div>
      </div>
      <ul style={{margin:0,padding:'0 0 0 18px',fontFamily:'var(--font-ui)',fontSize:14,lineHeight:1.6,color:'var(--slate-700)'}}>
        <li>За 14 дней 3 гипогликемии (2 ночных, 1 после обеда) — вероятна избыточная доза <b>Лантуса</b>.</li>
        <li>HbA1c <b>7.8 %</b> ↓ с 8.3 % за 3 мес. Тренд положительный.</li>
        <li>Пациент пропустил 4 записи приёма метформина · отмечено как «забыл».</li>
        <li><b>Предложить:</b> снизить базальный инсулин на 2 Ед и проверить ночные сахара через неделю.</li>
      </ul>
      <div style={{display:'flex',gap:10,marginTop:18}}>
        <button style={{padding:'10px 16px',borderRadius:10,border:'1.5px solid var(--blue-600)',background:'var(--blue-600)',color:'#fff',fontFamily:'var(--font-ui)',fontWeight:700,fontSize:14,cursor:'pointer'}}>Принять в заметки</button>
        <button style={{padding:'10px 16px',borderRadius:10,border:'1.5px solid var(--blue-300)',background:'transparent',color:'var(--blue-600)',fontFamily:'var(--font-ui)',fontWeight:700,fontSize:14,cursor:'pointer'}}>Уточнить у пациента</button>
      </div>
    </div>
  );
}

function MetricStrip() {
  const m = [
    ['HbA1c','7.8%','-0.5 за 3 мес','ok'],
    ['Глюкоза средняя','8.2 ммоль/л','±0.3','ok'],
    ['Время в диапазоне','62%','-4%','warn'],
    ['Гипогликемии','3','+2','err'],
  ];
  const c = { ok:'var(--success-600)', warn:'var(--warning-600)', err:'var(--error-600)' };
  return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
      {m.map(([l,v,d,s]) => (
        <div key={l} style={{background:'#fff',border:'1px solid var(--slate-100)',borderRadius:12,padding:'16px 18px'}}>
          <div style={{fontFamily:'var(--font-ui)',fontSize:12,color:'var(--slate-500)',marginBottom:6}}>{l}</div>
          <div style={{fontFamily:'var(--font-data)',fontWeight:700,fontSize:26,color:'var(--slate-900)',fontVariantNumeric:'tabular-nums'}}>{v}</div>
          <div style={{fontFamily:'var(--font-data)',fontSize:12,color:c[s],marginTop:2,fontVariantNumeric:'tabular-nums'}}>{d}</div>
        </div>
      ))}
    </div>
  );
}

function MiniChart() {
  const w = 700, h = 180, pad = 20;
  const data = [5.2,6.1,7.4,5.8,4.1,3.8,6.2,7.8,9.1,8.4,6.7,5.9,5.5,6.1];
  const lo = 3.9, hi = 10;
  const x = (i) => pad + (i/(data.length-1))*(w-pad*2);
  const y = (v) => h - pad - ((v-lo)/(hi-lo))*(h-pad*2);
  const path = data.map((v,i)=>`${i===0?'M':'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} style={{display:'block'}}>
      {/* target band */}
      <rect x={pad} y={y(8)} width={w-pad*2} height={y(4)-y(8)} fill="#EAF2FF" />
      {/* line */}
      <path d={path} stroke="var(--blue-600)" strokeWidth="2" fill="none"/>
      {/* dots */}
      {data.map((v,i)=>{
        const color = v<4.2?'var(--warning-600)':v>8.5?'var(--warning-600)':'var(--blue-600)';
        return <circle key={i} cx={x(i)} cy={y(v)} r="3" fill={color}/>
      })}
    </svg>
  );
}

function PatientDetail({ id, onBack }) {
  const p = MOCK_PATIENTS.find(x=>x.id===id) || MOCK_PATIENTS[0];
  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 380px',gap:20,height:'100%'}}>
      <div style={{display:'flex',flexDirection:'column',gap:20,overflow:'auto'}}>
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <button onClick={onBack} style={{background:'transparent',border:'1px solid var(--slate-200)',borderRadius:10,padding:'8px 12px',cursor:'pointer',fontFamily:'var(--font-ui)',fontSize:13,color:'var(--slate-700)'}}>← К списку</button>
          <div style={{flex:1}}>
            <div style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:24,letterSpacing:-.01}}>{p.name}</div>
            <div style={{fontFamily:'var(--font-ui)',fontSize:13,color:'var(--slate-500)'}}>{p.age} лет · {p.tag} · последний замер {p.last.toLowerCase()}</div>
          </div>
          <button style={{padding:'10px 16px',borderRadius:10,border:0,background:'var(--blue-600)',color:'#fff',fontFamily:'var(--font-ui)',fontWeight:700,fontSize:14,cursor:'pointer'}}>Начать приём</button>
        </div>

        <MetricStrip/>

        <div style={{background:'#fff',border:'1px solid var(--slate-100)',borderRadius:16,padding:24}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <div style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:16}}>Гликемия · 14 дней</div>
            <div style={{fontFamily:'var(--font-data)',fontSize:11,letterSpacing:'.06em',color:'var(--slate-500)',textTransform:'uppercase',fontWeight:700}}>ммоль/л</div>
          </div>
          <MiniChart/>
        </div>

        <div style={{background:'#fff',border:'1px solid var(--slate-100)',borderRadius:16,padding:24}}>
          <div style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:16,marginBottom:14}}>Последние анализы</div>
          {[
            ['HbA1c','7.8 %','15 августа','ok'],
            ['Холестерин ЛПНП','3.1 ммоль/л','15 августа','warn'],
            ['Креатинин','92 мкмоль/л','12 августа','ok'],
            ['Микроальбумин','24 мг/л','10 июля','ok'],
          ].map(([l,v,d,s]) => (
            <div key={l} style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 12px',gap:16,alignItems:'center',padding:'12px 0',borderBottom:'1px solid var(--slate-100)',fontFamily:'var(--font-ui)',fontSize:14}}>
              <div style={{color:'var(--slate-800)'}}>{l}</div>
              <div style={{fontFamily:'var(--font-data)',fontWeight:600,color:'var(--slate-900)',fontVariantNumeric:'tabular-nums'}}>{v}</div>
              <div style={{color:'var(--slate-500)'}}>{d}</div>
              <StatusDot s={s}/>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:20,overflow:'auto'}}>
        <AIBrief/>
        <div style={{background:'#fff',border:'1px solid var(--slate-100)',borderRadius:16,padding:20}}>
          <div style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:14,marginBottom:10}}>План приёма</div>
          <ol style={{margin:0,padding:'0 0 0 18px',fontFamily:'var(--font-ui)',fontSize:13,lineHeight:1.7,color:'var(--slate-700)'}}>
            <li>Обсудить ночные гипогликемии</li>
            <li>Скорректировать дозу Лантуса</li>
            <li>Обновить анализы (ОАК, HbA1c)</li>
            <li>Контроль через 2 нед.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Sidebar, TopBar, PatientList, PatientDetail, AIBrief, MetricStrip, MOCK_PATIENTS });
