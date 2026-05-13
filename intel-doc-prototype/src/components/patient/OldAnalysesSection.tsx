import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, FileText, Filter, Search, X } from 'lucide-react'
import StatusBadge from '../primitives/StatusBadge'
import ChecklistSection from './ChecklistSection'
import type { Analysis } from '../../store/types'
import { formatDateShort } from '../../lib/formatters'

type Period = 'all' | '30d' | '90d' | '12m'

const PERIOD_LABEL: Record<Period, string> = {
  all: 'За всё время',
  '30d': 'Последние 30 дней',
  '90d': 'Последние 3 месяца',
  '12m': 'Последний год',
}

function withinPeriod(iso: string, period: Period): boolean {
  if (period === 'all' || !iso) return true
  const d = new Date(iso).getTime()
  if (Number.isNaN(d)) return true
  const now = Date.now()
  const days = period === '30d' ? 30 : period === '90d' ? 90 : 365
  return now - d <= days * 24 * 60 * 60 * 1000
}

interface OldAnalysesSectionProps {
  analyses: Analysis[]
}

/**
 * Spec 001 + 002 + 003 + 004: list of old analyses with period filter and
 * name/type search. Empty + filtered-empty states included.
 */
export default function OldAnalysesSection({ analyses }: OldAnalysesSectionProps) {
  const nav = useNavigate()
  const [period, setPeriod] = useState<Period>('all')
  const [query, setQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showFilter, setShowFilter] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return analyses.filter((a) => {
      const refDate = a.date || a.uploadedAt
      if (!withinPeriod(refDate, period)) return false
      if (!q) return true
      const hay = `${a.label} ${a.type}`.toLowerCase()
      return hay.includes(q)
    })
  }, [analyses, period, query])

  const hint = analyses.length > 0 ? `${analyses.length}` : undefined

  return (
    <ChecklistSection title="Старые анализы" hint={hint}>
      {analyses.length === 0 ? (
        <button
          onClick={() => nav('/patient/upload')}
          className="rounded-2xl bg-cyan-50 p-4 text-center hover:bg-cyan-100 transition-colors"
        >
          <p className="text-[15px] font-bold text-cyan-600">Загрузить анализ</p>
          <p className="text-caption text-cyan-700/80 mt-1">
            Распознаем значения автоматически
          </p>
        </button>
      ) : (
        <>
          {/* Filter / search controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowSearch((v) => !v)
                if (showSearch) setQuery('')
              }}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold tracking-caps uppercase ${
                showSearch || query
                  ? 'bg-cyan-500 text-white'
                  : 'bg-white text-cyan-500 shadow-[inset_0_0_0_1.5px_var(--blue-200)]'
              }`}
              aria-label="Поиск по анализам"
            >
              <Search size={14} strokeWidth={2.5} />
              Поиск
            </button>
            <button
              onClick={() => setShowFilter((v) => !v)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold tracking-caps uppercase ${
                period !== 'all'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-white text-cyan-500 shadow-[inset_0_0_0_1.5px_var(--blue-200)]'
              }`}
              aria-label="Фильтр по периоду"
            >
              <Filter size={14} strokeWidth={2.5} />
              {period === 'all' ? 'Период' : PERIOD_LABEL[period]}
            </button>
          </div>

          {showSearch && (
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                strokeWidth={2}
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Например: HbA1c"
                className="w-full rounded-xl bg-white pl-9 pr-9 py-2.5 text-body text-ink-strong placeholder:text-ink-subtle outline-none focus:shadow-[inset_0_0_0_1.5px_var(--blue-600)]"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  aria-label="Очистить поиск"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center"
                >
                  <X size={14} className="text-slate-500" strokeWidth={2.5} />
                </button>
              )}
            </div>
          )}

          {showFilter && (
            <div className="flex flex-wrap gap-2">
              {(Object.keys(PERIOD_LABEL) as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`rounded-full px-3 py-1.5 text-[12px] font-bold tracking-caps uppercase ${
                    period === p
                      ? 'bg-cyan-500 text-white'
                      : 'bg-white text-cyan-500 shadow-[inset_0_0_0_1.5px_var(--blue-200)]'
                  }`}
                >
                  {PERIOD_LABEL[p]}
                </button>
              ))}
            </div>
          )}

          {/* Filtered-empty state */}
          {filtered.length === 0 && (
            <div className="rounded-2xl bg-surface-sunken p-4 text-center">
              <p className="text-body text-ink-strong leading-snug">
                Под фильтр ничего не подошло
              </p>
              <p className="text-caption text-ink-muted mt-1 leading-relaxed">
                Попробуйте изменить период или очистить поиск.
              </p>
              <button
                onClick={() => {
                  setPeriod('all')
                  setQuery('')
                }}
                className="mt-2 text-[12px] font-bold tracking-caps uppercase text-cyan-500"
              >
                Сбросить фильтры
              </button>
            </div>
          )}

          {filtered.slice(0, 6).map((a) => (
            <button
              key={a.id}
              onClick={() => nav(`/patient/history/${a.id}`)}
              className="rounded-2xl bg-white p-4 flex items-center gap-3 text-left hover:bg-slate-50 transition-colors"
            >
              <div className="h-10 w-10 rounded-xl bg-cyan-50 text-cyan-500 flex items-center justify-center flex-shrink-0">
                <FileText size={20} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-ink-strong truncate">
                  {a.label}
                </p>
                <p className="text-caption text-ink-muted">
                  {a.date ? formatDateShort(a.date) : '—'}
                </p>
              </div>
              {a.status === 'acknowledged' ? (
                <StatusBadge tone="success">Принято</StatusBadge>
              ) : (
                <ChevronRight size={18} className="text-slate-400" />
              )}
            </button>
          ))}
          {filtered.length > 6 && (
            <button
              onClick={() => nav('/patient/history')}
              className="text-[12px] font-bold tracking-caps uppercase text-cyan-500 self-start px-1 mt-1"
            >
              Показать всё ({filtered.length})
            </button>
          )}
        </>
      )}
    </ChecklistSection>
  )
}
