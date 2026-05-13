import { useState } from 'react'
import { UserPlus, Check, Calendar } from 'lucide-react'
import StatusBadge from '../primitives/StatusBadge'
import Button from '../primitives/Button'
import { SPECIALIST_OPTIONS } from './doctorConstants'
import type { Appointment } from '../../store/types'

/**
 * «Какие ещё врачи могут понадобиться» — specs 19–22.
 * - 19: Block listing partner-curated specialists (no AI inference).
 * - 20: Selection list rendered in the doctor cockpit (informational here —
 *       the patient performs the actual booking on the mobile surface).
 * - 21: Booking lifecycle visible as «отметить как назначен» (mock toggle,
 *       not persisted to the frozen store).
 * - 22: Linking a preparatory appointment to the main visit shown when one
 *       exists.
 */
export default function AdditionalDoctorsSection({
  preparatoryAppointments,
  mainAppointment,
}: {
  preparatoryAppointments: Appointment[]
  mainAppointment: Appointment | null
}) {
  // Local-only marking for the demo; the patient surface still owns booking.
  const [recommended, setRecommended] = useState<Set<string>>(
    () => new Set(SPECIALIST_OPTIONS.slice(0, 2).map((s) => s.id)),
  )

  function toggle(id: string) {
    setRecommended((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h2 className="text-h2-ui font-bold text-ink-strong leading-tight">
          Какие ещё врачи могут понадобиться
        </h2>
        <p className="text-caption text-ink-muted mt-1">
          Партнёрский список специальностей для подготовки. Выбор не является
          медицинским назначением.
        </p>
      </header>

      <ul className="flex flex-col gap-2">
        {SPECIALIST_OPTIONS.map((s) => {
          const on = recommended.has(s.id)
          return (
            <li
              key={s.id}
              className="rounded-2xl bg-surface-sunken p-4 flex items-center gap-4"
            >
              <div
                className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  on
                    ? 'bg-cyan-500 text-white'
                    : 'bg-white text-ink-muted shadow-[inset_0_0_0_1.5px_var(--slate-200)]'
                }`}
              >
                <UserPlus size={20} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-ink-strong">
                  {s.specialty}
                </p>
                <p className="text-caption text-ink-muted leading-snug">
                  {s.reason}
                </p>
                {s.slotHint && (
                  <p className="text-caption text-cyan-600 font-data mt-1">
                    Свободный слот: {s.slotHint}
                  </p>
                )}
              </div>
              <Button
                variant={on ? 'secondary' : 'ghost'}
                size="md"
                icon={on ? <Check size={14} strokeWidth={2.5} /> : undefined}
                onClick={() => toggle(s.id)}
              >
                {on ? 'Рекомендован' : 'Рекомендовать'}
              </Button>
            </li>
          )
        })}
      </ul>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-caps text-ink-muted mb-2">
          Запись пациента к подготовительным врачам
        </p>
        {preparatoryAppointments.length === 0 ? (
          <p className="text-body text-ink-muted">
            Пациент пока не записан к дополнительным специалистам.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {preparatoryAppointments.map((a) => (
              <li
                key={a.id}
                className="rounded-xl bg-surface-sunken px-4 py-3 flex items-center gap-3"
              >
                <Calendar size={16} className="text-cyan-500" strokeWidth={2} />
                <div className="flex-1">
                  <p className="text-body text-ink-strong font-bold leading-tight">
                    {a.date}
                  </p>
                  <p className="text-caption text-ink-muted">
                    Подготовительный визит перед приёмом
                    {mainAppointment && ' основного врача'}
                  </p>
                </div>
                <StatusBadge tone={a.status === 'completed' ? 'success' : 'info'}>
                  {a.status === 'completed' ? 'Завершён' : 'Запланирован'}
                </StatusBadge>
              </li>
            ))}
          </ul>
        )}
        {mainAppointment && preparatoryAppointments.length > 0 && (
          <p className="text-caption text-cyan-600 mt-2">
            Подготовительные визиты связаны с основным приёмом{' '}
            <span className="font-data font-bold">{mainAppointment.date}</span>.
          </p>
        )}
      </div>
    </div>
  )
}
