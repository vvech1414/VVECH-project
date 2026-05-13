// IntelDoc Mobile — UI Kit primitives
// Globals: iconRegistry, Icon, Button, Chip, Card, ChatBubble, StatusBar, TabBar, FAB, BottomSheet

const IntelDocIcons = {
  bell: 'M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 0 0-4-5.7V5a2 2 0 0 0-4 0v.3A6 6 0 0 0 6 11v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 1 1-6 0',
  home: 'M3 11l9-8 9 8v10a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2z',
  book: 'M4 4h13a3 3 0 0 1 3 3v14H7a3 3 0 0 1-3-3zM4 4v13',
  shop: 'M3 9l2-4h14l2 4M3 9v11h18V9M3 9h18',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7-3a7 7 0 0 0-.11-1.22l2.11-1.63-2-3.46-2.48.86a7 7 0 0 0-2.12-1.22L14 3h-4l-.4 2.33a7 7 0 0 0-2.12 1.22l-2.48-.86-2 3.46 2.11 1.63A7 7 0 0 0 5 12a7 7 0 0 0 .11 1.22l-2.11 1.63 2 3.46 2.48-.86a7 7 0 0 0 2.12 1.22L10 21h4l.4-2.33a7 7 0 0 0 2.12-1.22l2.48.86 2-3.46-2.11-1.63A7 7 0 0 0 19 12z',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  chat: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  bag: 'M3 6h18l-2 13H5L3 6zm5 0V4a4 4 0 0 1 8 0v2',
  heart: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  close: 'M18 6 6 18M6 6l12 12',
  back: 'm15 6-6 6 6 6',
  forward: 'm9 6 6 6-6 6',
  search: 'M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zm9 16-4-4',
  check: 'M5 12l5 5L20 7',
  caret: 'm6 9 6 6 6-6',
  sort: 'M3 6h18M6 12h12M10 18h4',
  filter: 'M4 5h16M7 12h10M10 19h4',
  mic: 'M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zm7 9a7 7 0 0 1-14 0m7 7v4',
  edit: 'M12 20h9M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-8 9a8 8 0 0 1 16 0',
};

const Icon = ({ name, size = 20, strokeWidth = 2, style = {}, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
       strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d={IntelDocIcons[name]} />
  </svg>
);

const Button = ({ variant = 'primary', children, icon, iconRight, full, size = 'md', onClick, style = {} }) => {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: 8, border: 0, borderRadius: 12, cursor: 'pointer',
    fontFamily: 'var(--font-ui)', fontWeight: 700, letterSpacing: '0.005em',
    padding: size === 'lg' ? '15px 22px' : '12px 18px',
    fontSize: size === 'lg' ? 15 : 14,
    width: full ? '100%' : 'auto',
    transition: 'all 180ms cubic-bezier(0.16, 1, 0.3, 1)',
    ...style,
  };
  const variants = {
    primary: { background: 'var(--blue-600)', color: '#fff' },
    secondary: { background: '#fff', color: 'var(--blue-600)', boxShadow: 'inset 0 0 0 1.5px var(--blue-600)' },
    ghost: { background: 'transparent', color: 'var(--blue-600)' },
    dark: { background: 'var(--slate-900)', color: '#fff' },
  };
  return (
    <button style={{ ...base, ...variants[variant] }} onClick={onClick}>
      {icon && <Icon name={icon} size={16} />}
      {children}
      {iconRight && <Icon name={iconRight} size={14} />}
    </button>
  );
};

const Chip = ({ children, active, onClick, style }) => (
  <button onClick={onClick} style={{
    borderRadius: 999, padding: '10px 16px',
    fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 12,
    textTransform: 'uppercase', letterSpacing: '0.04em',
    border: active ? '1.5px solid var(--blue-600)' : '1.5px solid var(--blue-100)',
    background: active ? 'var(--blue-600)' : 'var(--blue-050)',
    color: active ? '#fff' : 'var(--blue-600)',
    cursor: 'pointer', ...style,
  }}>{children}</button>
);

const Card = ({ title, action, children, style }) => (
  <div style={{
    background: 'var(--slate-050)', borderRadius: 16, padding: 20,
    display: 'flex', flexDirection: 'column', gap: 12, ...style,
  }}>
    {(title || action) && (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {title && <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--slate-800)' }}>{title}</div>}
        {action}
      </div>
    )}
    {children}
  </div>
);

const LinkMore = ({ children = 'Еще', icon = 'forward', onClick }) => (
  <span onClick={onClick} style={{
    display: 'inline-flex', alignItems: 'center', gap: 4,
    color: 'var(--blue-600)', fontWeight: 700, fontSize: 12,
    letterSpacing: '0.04em', textTransform: 'uppercase', cursor: 'pointer'
  }}>{children}<Icon name={icon} size={12} /></span>
);

const ChatBubble = ({ from, text, side = 'left', name }) => (
  <div style={{
    alignSelf: side === 'left' ? 'flex-start' : 'flex-end',
    background: side === 'left' ? 'var(--slate-050)' : 'var(--blue-600)',
    color: side === 'left' ? 'var(--slate-800)' : '#fff',
    padding: '12px 16px', borderRadius: 20, maxWidth: 280,
    fontSize: 14, lineHeight: '20px',
  }}>
    {name && <div style={{
      fontSize: 12, fontWeight: 700, marginBottom: 4,
      color: side === 'left' ? 'var(--slate-500)' : 'var(--blue-100)'
    }}>{name}</div>}
    {text}
  </div>
);

const StatusBar = () => (
  <div style={{
    height: 44, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0 24px', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 15, color: 'var(--slate-900)',
  }}>
    <span>9:41</span>
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <svg width="18" height="10" viewBox="0 0 18 10" fill="currentColor"><rect x="0" y="4" width="3" height="6" rx="0.5"/><rect x="5" y="2" width="3" height="8" rx="0.5"/><rect x="10" y="0" width="3" height="10" rx="0.5"/></svg>
      <svg width="16" height="11" viewBox="0 0 16 11" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1.5 4c3.5-3 9.5-3 13 0M3.5 6.5c2-1.6 7-1.6 9 0M6 9a2 2 0 0 1 4 0"/></svg>
      <svg width="24" height="11" viewBox="0 0 24 11" fill="none" stroke="currentColor" strokeWidth="1"><rect x="0.5" y="0.5" width="20" height="10" rx="2"/><rect x="2" y="2" width="17" height="7" rx="1" fill="currentColor"/><rect x="21" y="3" width="2" height="5" rx="1" fill="currentColor"/></svg>
    </div>
  </div>
);

const TabBar = ({ current, onChange, items }) => (
  <div style={{
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 89, padding: '8px 16px 32px',
    background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(40px)',
    display: 'flex', justifyContent: 'space-around', alignItems: 'center',
    borderTop: '1px solid var(--slate-100)',
  }}>
    {items.map(it => (
      <div key={it.id} onClick={() => onChange(it.id)} style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        color: current === it.id ? 'var(--blue-600)' : 'var(--slate-400)',
        fontSize: 10, fontWeight: current === it.id ? 700 : 500,
        cursor: 'pointer', width: 75, padding: '4px 0',
      }}>
        <Icon name={it.icon} size={22} strokeWidth={current === it.id ? 2.2 : 1.8} />
        {it.label}
      </div>
    ))}
  </div>
);

const FAB = ({ onClick, icon = 'plus' }) => (
  <button onClick={onClick} style={{
    position: 'absolute', bottom: 47, left: '50%', transform: 'translateX(-50%)',
    width: 64, height: 64, borderRadius: 999, background: 'var(--blue-600)',
    border: 0, color: '#fff', boxShadow: 'var(--shadow-lg)', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2,
  }}>
    <Icon name={icon} size={26} strokeWidth={2.4} />
  </button>
);

const BottomSheet = ({ open, onClose, title, children }) => (
  open ? (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 10,
      background: 'rgba(15,16,20,0.25)', display: 'flex', alignItems: 'flex-end',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: '#fff', borderRadius: '24px 24px 0 0',
        padding: '14px 20px 32px', display: 'flex', flexDirection: 'column', gap: 16,
        animation: 'slideUp 320ms cubic-bezier(0.16,1,0.3,1)',
      }}>
        <div style={{ width: 48, height: 4, background: 'var(--slate-200)', borderRadius: 2, alignSelf: 'center' }} />
        {title && <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 18, color: 'var(--slate-900)' }}>{title}</div>}
        {children}
      </div>
    </div>
  ) : null
);

Object.assign(window, { IntelDocIcons, Icon, Button, Chip, Card, LinkMore, ChatBubble, StatusBar, TabBar, FAB, BottomSheet });
