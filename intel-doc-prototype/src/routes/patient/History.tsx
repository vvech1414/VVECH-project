import { useNavigate } from 'react-router-dom'
import { ChevronRight, FileText, Plus } from 'lucide-react'
import PhoneFrame from '../../components/patient/PhoneFrame'
import TopHeader from '../../components/patient/TopHeader'
import TabBar from '../../components/primitives/TabBar'
import StatusBadge from '../../components/primitives/StatusBadge'
import EmptyState from '../../components/primitives/EmptyState'
import {
  KIND_TINT,
  useHistoryEvents,
  type HistoryEvent,
} from '../../lib/historyEvents'
import { formatDateShort } from '../../lib/formatters'

function groupByDay(
  events: HistoryEvent[],
): Array<{ key: string; label: string; events: HistoryEvent[] }> {
  const groups = new Map<string, HistoryEvent[]>()
  for (const e of events) {
    const d = new Date(e.timestamp)
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    const arr = groups.get(key) ?? []
    arr.push(e)
    groups.set(key, arr)
  }
  return Array.from(groups.entries()).map(([key, arr]) => ({
    key,
    label: formatDateShort(arr[0].timestamp),
    events: arr,
  }))
}

export default function History() {
  const nav = useNavigate()
  const events = useHistoryEvents()
  const groups = groupByDay(events)

  return (
    <PhoneFrame>
      <TopHeader title="История" />

      <div className="flex-1 overflow-y-auto px-5 pb-[110px] flex flex-col gap-4">
        {events.length === 0 ? (
          <EmptyState
            Icon={FileText}
            title="Здесь будет история ваших действий"
            body="Когда вы начнёте загружать анализы и получать обновления — они появятся здесь."
            action={{
              label: 'Добавить анализ',
              variant: 'button',
              icon: Plus,
              onClick: () => nav('/patient/upload'),
            }}
          />
        ) : (
          groups.map((group) => (
            <section key={group.key} className="flex flex-col gap-2">
              <p className="text-[10px] font-bold uppercase tracking-caps text-ink-muted px-1">
                {group.label}
              </p>
              {group.events.map((e) => {
                const card = (
                  <div
                    className={`relative rounded-2xl bg-white p-4 flex items-start gap-3 ${
                      e.href ? 'hover:bg-slate-50 transition-colors text-left' : ''
                    }`}
                  >
                    {e.unread && (
                      <span
                        aria-label="Новое"
                        className="absolute left-1.5 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-cyan-500"
                      />
                    )}
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        KIND_TINT[e.kind]
                      }`}
                    >
                      <e.Icon size={20} strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-bold text-ink-strong leading-snug">
                        {e.title}
                      </p>
                      {e.description && (
                        <p className="text-caption text-ink-muted leading-snug mt-0.5">
                          {e.description}
                        </p>
                      )}
                      {e.badge && (
                        <div className="mt-1.5">
                          <StatusBadge tone={e.badge.tone}>{e.badge.label}</StatusBadge>
                        </div>
                      )}
                    </div>
                    {e.href && (
                      <ChevronRight size={18} className="text-slate-400 mt-1" />
                    )}
                  </div>
                )
                return e.href ? (
                  <button
                    key={e.id}
                    onClick={() => e.href && nav(e.href)}
                    className="text-left"
                  >
                    {card}
                  </button>
                ) : (
                  <div key={e.id}>{card}</div>
                )
              })}
            </section>
          ))
        )}
      </div>

      <TabBar />
    </PhoneFrame>
  )
}
