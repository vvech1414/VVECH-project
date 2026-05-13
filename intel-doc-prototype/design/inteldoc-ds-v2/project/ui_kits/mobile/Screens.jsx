// IntelDoc Mobile — Screen components
// Globals: ScreenMain, ScreenGlycemia, ScreenChat, ScreenDiary, ScreenMarket

const Avatar = ({ src, size = 48 }) => (
  <div style={{
    width: size, height: size, borderRadius: 16, overflow: 'hidden',
    background: 'var(--blue-075) url(' + (src || '../../assets/avatar-placeholder.png') + ') center/cover',
  }} />
);

const GlycemiaChart = ({ height = 80, showTooltip, tipX = 200, tipVal = '6.3 ммоль/л', tipTime = '18:00' }) => (
  <div style={{ position: 'relative', width: '100%', height }}>
    <div style={{ position: 'absolute', left: 0, right: 0, top: '40%', height: '28%', background: 'var(--chart-band)', borderRadius: 2 }} />
    <svg viewBox="0 0 400 80" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <path d="M0,44 C24,38 48,22 78,38 C106,52 134,56 162,52 C190,48 210,18 238,30 C268,42 296,42 328,38 C358,34 384,42 400,34"
        stroke="var(--chart-in-range)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M78,38 C100,48 126,62 162,52" stroke="var(--chart-low)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
    {showTooltip && (
      <div style={{
        position: 'absolute', left: tipX, top: 6, background: '#fff',
        border: '1.5px solid var(--blue-200)', borderRadius: 14, padding: '6px 10px',
        fontSize: 12, fontWeight: 700, color: 'var(--slate-800)', textAlign: 'center',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div>{tipVal}</div>
        <div style={{ fontWeight: 400, color: 'var(--slate-500)', fontSize: 11 }}>{tipTime}</div>
      </div>
    )}
  </div>
);

const TimeInRange = ({ pct = 37.5 }) => {
  const r = 26, c = 2 * Math.PI * r, dash = (pct / 100) * c;
  return (
    <div style={{ position: 'relative', width: 64, height: 64 }}>
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} stroke="var(--peach-300)" strokeWidth="4" fill="none" opacity="0.5" />
        <circle cx="32" cy="32" r={r} stroke="var(--peach-500)" strokeWidth="4" fill="none"
                strokeDasharray={`${dash} ${c}`} transform="rotate(-90 32 32)" strokeLinecap="round" />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-data)', fontWeight: 700, fontSize: 14, color: 'var(--peach-500)'
      }}>{pct}%</div>
    </div>
  );
};

// ---------- HOME ----------
const ScreenMain = ({ onOpen }) => (
  <>
    <StatusBar />
    <div style={{ padding: '8px 16px 100px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 18, lineHeight: 1.25, color: 'var(--slate-700)' }}>
          Добрый день,<br/>Михалыч
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Icon name="bell" size={28} color="var(--slate-700)" />
            <div style={{ position: 'absolute', top: -2, right: 0, width: 8, height: 8, background: 'var(--error)', borderRadius: 999 }} />
          </div>
          <Avatar />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', height: 90 }}>
        <div style={{ flex: 1 }}><GlycemiaChart height={80} /></div>
        <TimeInRange pct={37.5} />
      </div>

      <div style={{ position: 'relative', height: 240, marginTop: -4 }}>
        <div style={{ position: 'absolute', inset: '10px 20px', background: 'var(--gradient-mascot-halo)' }} />
        <img src="../../assets/vasiliy-mascot.png" alt=""
             style={{ position: 'absolute', left: 0, top: 18, height: 222, width: 'auto' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: 240 }}>
          <ChatBubble side="left" name="" text="Привет! Я Василий, твой личный помощник" />
        </div>
        <div style={{ position: 'absolute', bottom: 8, right: 0 }}>
          <Button variant="secondary" iconRight="chat" onClick={() => onOpen?.('chat')}>Задать вопрос</Button>
        </div>
      </div>

      <Card title="Расходники" action={<LinkMore icon="plus">Пополнить</LinkMore>}>
        <div style={{ height: 8, borderRadius: 4, background: 'var(--slate-100)', overflow: 'hidden' }}>
          <div style={{ width: '62%', height: '100%', background: 'var(--blue-600)' }} />
        </div>
      </Card>

      <Card title="Полезные советы" action={<LinkMore />}>
        <div style={{ fontSize: 14, lineHeight: '20px', color: 'var(--slate-600)' }}>
          Похоже у вас заканчиваются иглы для шприц-ручек. Рекомендуем пополнить запасы.
        </div>
        <div><Button variant="secondary" iconRight="bag">Заказать</Button></div>
      </Card>
    </div>
  </>
);

// ---------- GLYCEMIA ----------
const ScreenGlycemia = ({ onBack, onOpen }) => (
  <>
    <StatusBar />
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 20px 12px' }}>
      <Icon name="close" size={24} color="var(--blue-600)" onClick={onBack} style={{ cursor: 'pointer' }} />
      <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--slate-900)' }}>Гликемия</div>
      <div style={{ width: 24 }} />
    </div>
    <div style={{ padding: '4px 16px 100px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, background: 'var(--slate-050)', borderRadius: 14, padding: '14px 16px' }}>
          <div style={{ fontSize: 12, color: 'var(--slate-500)' }}>Среднее значение</div>
          <div style={{ fontFamily: 'var(--font-data)', fontWeight: 700, fontSize: 18, color: 'var(--slate-900)', marginTop: 4 }}>3.4 ммоль/л</div>
        </div>
        <div style={{ flex: 1, background: 'var(--slate-050)', borderRadius: 14, padding: '14px 16px' }}>
          <div style={{ fontSize: 12, color: 'var(--slate-500)' }}>% в целевом диапазоне</div>
          <div style={{ fontFamily: 'var(--font-data)', fontWeight: 700, fontSize: 18, color: 'var(--slate-900)', marginTop: 4 }}>35%</div>
        </div>
      </div>

      <div style={{ position: 'relative', background: 'var(--slate-050)', borderRadius: 16, padding: 18, display: 'flex', gap: 14 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--slate-900)', marginBottom: 6 }}>Рекомендация от Василия</div>
          <div style={{ fontSize: 13, lineHeight: '18px', color: 'var(--slate-600)', marginBottom: 14 }}>
            Наблюдается тенденция к изменению твоего фактора чувствительности, что приводит к гипогликемиям
          </div>
          <Button variant="secondary" iconRight="chat" onClick={() => onOpen?.('chat')}>Обсудить</Button>
        </div>
        <img src="../../assets/vasiliy-mascot.png" alt="" style={{ width: 110, height: 'auto', alignSelf: 'flex-end' }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--slate-800)' }}>
          <Icon name="sort" size={16} /> Сортировка <Icon name="caret" size={14} />
        </div>
        <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--slate-800)' }}>
          <Icon name="filter" size={16} /> Фильтры <span style={{ width: 22, height: 22, borderRadius: 999, background: 'var(--blue-600)', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
        </div>
      </div>

      <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--slate-700)', marginTop: 4 }}>15 августа</div>

      {[
        { time: '13:00', rows: [{ time: '13:40', val: '3.4 ммоль/л' }, { time: '13:20', val: '4.5 ммоль/л' }, { time: '13:10', val: '5.2 ммоль/л' }] },
        { time: '12:00', rows: [{ time: '12:30', val: '6.3 ммоль/л' }, { time: '12:20', val: '5.0 ммоль/л' }] },
      ].map(grp => (
        <div key={grp.time} style={{ background: 'var(--slate-050)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', fontWeight: 700, color: 'var(--slate-900)' }}>
            {grp.time} <Icon name="caret" size={16} color="var(--slate-500)" />
          </div>
          {grp.rows.map(r => (
            <div key={r.time} style={{ display: 'flex', alignItems: 'center', padding: '10px 18px', borderTop: '1px solid var(--slate-100)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'var(--slate-900)', fontWeight: 500 }}>Гликемия</div>
                <div style={{ fontSize: 12, color: 'var(--slate-500)' }}>{r.time}</div>
              </div>
              <div style={{ fontFamily: 'var(--font-data)', fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: 'var(--slate-800)', marginRight: 8 }}>{r.val}</div>
              <Icon name="forward" size={16} color="var(--slate-400)" />
            </div>
          ))}
        </div>
      ))}
    </div>
  </>
);

// ---------- CHAT ----------
const ScreenChat = ({ onBack }) => {
  const [msgs, setMsgs] = React.useState([
    { side: 'left', name: 'Василий', text: 'Наблюдается тенденция к изменению твоего фактора чувствительности, что приводит к гипогликемиям' },
    { side: 'right', name: 'Михалыч', text: 'Охренеть. И что делать?' },
    { side: 'left', name: 'Василий', text: 'Попробуйте меньше жрать' },
  ]);
  const [val, setVal] = React.useState('');
  const send = () => {
    if (!val.trim()) return;
    setMsgs(m => [...m, { side: 'right', name: 'Михалыч', text: val }]);
    setVal('');
    setTimeout(() => setMsgs(m => [...m, { side: 'left', name: 'Василий', text: 'Понял, разберёмся.' }]), 600);
  };
  return (
    <>
      <StatusBar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 20px 12px' }}>
        <Icon name="close" size={24} color="var(--blue-600)" onClick={onBack} style={{ cursor: 'pointer' }} />
        <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--slate-900)' }}>Чат с Василием</div>
        <div style={{ width: 24 }} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 8, padding: '16px 16px 96px', minHeight: 620 }}>
        {msgs.map((m, i) => <ChatBubble key={i} {...m} />)}
      </div>
      <div style={{ position: 'absolute', bottom: 28, left: 16, right: 16, display: 'flex', gap: 10, alignItems: 'center', background: '#fff' }}>
        <Icon name="plus" size={24} color="var(--blue-600)" />
        <input value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
               placeholder="Ваше сообщение..."
               style={{ flex: 1, background: 'var(--slate-050)', border: 0, borderRadius: 999, padding: '12px 16px', fontSize: 14, fontFamily: 'var(--font-ui)', color: 'var(--slate-800)', outline: 'none' }} />
      </div>
    </>
  );
};

// ---------- DIARY ----------
const ScreenDiary = () => {
  const [cat, setCat] = React.useState('sugar');
  return (
    <>
      <StatusBar />
      <div style={{ padding: '8px 16px 100px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 26, color: 'var(--slate-500)' }}>Дневник</div>
        <div style={{ background: 'var(--slate-050)', borderRadius: 16, padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--slate-900)' }}>Гликемия</div>
            <span style={{ color: 'var(--blue-600)', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>За 12 часов ▾</span>
          </div>
          <GlycemiaChart height={120} showTooltip tipX={200} />
        </div>

        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
          {[
            { id: 'sugar', label: 'Гликемия', bg: 'var(--gradient-category-sugar)' },
            { id: 'insulin', label: 'Инсулин', bg: 'var(--gradient-category-insulin)' },
            { id: 'food', label: 'Еда', bg: 'var(--gradient-category-food)' },
            { id: 'act', label: 'Активность', bg: '#E8E9F1' },
          ].map(c => (
            <button key={c.id} onClick={() => setCat(c.id)} style={{
              border: 0, borderRadius: 999, padding: '11px 18px',
              background: c.bg, color: 'var(--slate-900)', fontWeight: 600, fontSize: 13,
              fontFamily: 'var(--font-ui)', whiteSpace: 'nowrap',
              outline: cat === c.id ? '2px solid var(--blue-600)' : 'none',
            }}>{c.label}</button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <Icon name="sort" size={16} /> Сортировка <Icon name="caret" size={14} />
          </div>
          <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <Icon name="filter" size={16} /> Фильтры <span style={{ width: 22, height: 22, borderRadius: 999, background: 'var(--blue-600)', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
          </div>
        </div>

        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--slate-700)' }}>15 августа</div>
        {[
          { time: '13:00', rows: [{ type: 'Гликемия', time: '13:10', val: '3.4 ммоль/л' }, { type: 'Инсулин', time: '13:01', val: '10 мл' }] },
          { time: '12:00', rows: [{ type: 'Еда', time: '12:34', val: '633 ккал' }] },
        ].map(grp => (
          <div key={grp.time} style={{ background: 'var(--slate-050)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', fontWeight: 700 }}>
              {grp.time} <Icon name="caret" size={16} color="var(--slate-500)" />
            </div>
            {grp.rows.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '10px 18px', borderTop: '1px solid var(--slate-100)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'var(--slate-900)', fontWeight: 500 }}>{r.type}</div>
                  <div style={{ fontSize: 12, color: 'var(--slate-500)' }}>{r.time}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-data)', fontWeight: 600, color: 'var(--slate-800)', marginRight: 8 }}>{r.val}</div>
                <Icon name="forward" size={16} color="var(--slate-400)" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

// ---------- MARKET ----------
const ScreenMarket = () => (
  <>
    <StatusBar />
    <div style={{ padding: '8px 16px 100px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: 26, color: 'var(--slate-500)' }}>Маркет</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Icon name="search" size={22} color="var(--slate-700)" />
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <Icon name="heart" size={22} color="var(--slate-700)" />
          <div style={{ position: 'relative' }}>
            <Icon name="bag" size={22} color="var(--slate-700)" />
            <span style={{ position: 'absolute', top: -6, right: -8, minWidth: 18, height: 18, padding: '0 4px', background: 'var(--blue-600)', color: '#fff', borderRadius: 999, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>9</span>
          </div>
        </div>
      </div>

      <div style={{ height: 150, background: 'var(--blue-050)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue-200)' }}>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5L5 20"/></svg>
      </div>
      <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
        {[0,1,2,3,4].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: 999, background: i === 1 ? 'var(--blue-600)' : 'var(--blue-100)' }} />)}
      </div>

      {[
        { title: 'Препараты', items: [{ name: 'Седжаро', price: '8 669' }, { name: 'Семавик', price: '4 319' }] },
        { title: 'Витамины', items: [{ name: 'Магний B6', price: '690' }, { name: 'Омега-3', price: '1 290' }] },
      ].map(sec => (
        <div key={sec.title}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--slate-900)' }}>{sec.title}</div>
            <span style={{ color: 'var(--blue-600)', fontWeight: 700, fontSize: 13 }}>Больше</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {sec.items.map(p => (
              <div key={p.name} style={{ background: 'var(--slate-050)', borderRadius: 14, padding: 12 }}>
                <div style={{ height: 104, background: 'var(--blue-050)', borderRadius: 10, position: 'relative', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--blue-200)" strokeWidth="1.5"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5L5 20"/></svg>
                  <Icon name="heart" size={18} color="var(--blue-600)" style={{ position: 'absolute', top: 8, right: 8 }} />
                </div>
                <div style={{ color: 'var(--slate-900)' }}>{p.name}</div>
                <div style={{ fontFamily: 'var(--font-data)', fontWeight: 700, color: 'var(--slate-900)', margin: '4px 0 10px' }}>₽ {p.price}</div>
                <Button variant="secondary" iconRight="bag" full>В корзину</Button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </>
);

Object.assign(window, { ScreenMain, ScreenGlycemia, ScreenChat, ScreenDiary, ScreenMarket, GlycemiaChart, TimeInRange, Avatar });
