import { useNavigate } from 'react-router-dom'
import { Mic, Keyboard } from 'lucide-react'
import VasilyMascot from '../system/VasilyMascot'

/**
 * Compact Vasily entry on Home. Whole row opens chat in text mode (S07);
 * dedicated keyboard / mic buttons make both input formats explicit.
 */
export default function VasilyBlock() {
  const nav = useNavigate()
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-3 pr-2">
      <button
        onClick={() => nav('/patient/vasily')}
        className="flex flex-1 items-center gap-3 text-left active:opacity-80 transition-opacity min-w-0"
      >
        <VasilyMascot size={40} />
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-bold text-ink-strong leading-tight">
            Спросить Василия
          </p>
          <p className="text-[12px] text-ink-muted leading-snug truncate">
            Текстом или голосом
          </p>
        </div>
      </button>
      <div className="flex flex-shrink-0 items-center gap-1.5">
        <button
          onClick={() => nav('/patient/vasily')}
          aria-label="Написать текстом"
          className="flex h-9 w-9 items-center justify-center rounded-full text-cyan-600 shadow-[inset_0_0_0_1.5px_var(--blue-200)] active:scale-[0.95] transition-transform"
        >
          <Keyboard size={15} strokeWidth={2.4} />
        </button>
        <button
          onClick={() => nav('/patient/vasily', { state: { mode: 'voice' } })}
          aria-label="Спросить голосом"
          className="flex h-9 w-9 items-center justify-center rounded-full text-cyan-600 shadow-[inset_0_0_0_1.5px_var(--blue-200)] active:scale-[0.95] transition-transform"
        >
          <Mic size={15} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  )
}
