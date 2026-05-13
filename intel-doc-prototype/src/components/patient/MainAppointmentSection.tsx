import { useNavigate } from 'react-router-dom'
import { Calendar, ChevronRight } from 'lucide-react'
import StatusBadge from '../primitives/StatusBadge'
import Button from '../primitives/Button'
import ChecklistSection from './ChecklistSection'
import type { Appointment } from '../../store/types'
import { formatDateTime } from '../../lib/formatters'

interface MainAppointmentSectionProps {
  appointment: Appointment | null
  prepComplete: boolean
}

/**
 * Specs 022 + 023 + 024 + 025 — main appointment block.
 *  - 023: absent state with safe explanation
 *  - 024: book main doctor entry CTA
 *  - 025: surfaces «вы готовы → запишитесь» transition
 *  - 022: links preparatory visit context to main doctor
 */
export default function MainAppointmentSection({
  appointment,
  prepComplete,
}: MainAppointmentSectionProps) {
  const nav = useNavigate()

  if (appointment) {
    return (
      <ChecklistSection title="Основная запись">
        <div className="rounded-2xl bg-[#ECFDF5] p-4 flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
            <Calendar size={20} strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-bold text-emerald-900 font-data">
              {formatDateTime(appointment.date)}
            </p>
            <p className="text-caption text-emerald-800 leading-snug mt-0.5">
              ЭНЦ · Отделение диабетологии
            </p>
            <div className="mt-2">
              <StatusBadge tone="success">Запись подтверждена</StatusBadge>
            </div>
          </div>
        </div>
        <p className="text-caption text-ink-muted px-1 leading-relaxed">
          Подготовительный визит и материалы автоматически передадутся вашему врачу.
        </p>
      </ChecklistSection>
    )
  }

  // Absent main appointment (spec 023)
  return (
    <ChecklistSection title="Основная запись">
      <div className="rounded-2xl bg-white p-5 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-cyan-50 text-cyan-500 flex items-center justify-center">
            <Calendar size={20} strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-bold text-ink-strong leading-tight">
              Основная запись пока не оформлена
            </p>
            <p className="text-caption text-ink-muted leading-snug mt-0.5">
              {prepComplete
                ? 'Подготовка завершена — можно записаться к основному врачу.'
                : 'Запись появится здесь после выбора времени.'}
            </p>
          </div>
        </div>
        <Button
          full
          variant={prepComplete ? 'primary' : 'secondary'}
          onClick={() => nav('/patient/book')}
          iconRight={<ChevronRight size={16} strokeWidth={2.4} />}
        >
          {prepComplete
            ? 'Записаться к основному врачу'
            : 'Открыть запись'}
        </Button>
      </div>
    </ChecklistSection>
  )
}
