import { Calendar, ArrowRight, AlertCircle, Check, Send } from 'lucide-react'
import StatusBadge from '../primitives/StatusBadge'
import Button from '../primitives/Button'
import { formatDateShort } from '../../lib/formatters'
import type { Appointment } from '../../store/types'

/**
 * Main appointment view — specs 22–25.
 * - 22: Preparatory ↔ main link surfaced together when both exist.
 * - 23: «Основная запись отсутствует» state with explicit non-blocking copy.
 * - 24: Main booking lifecycle (the mock booking action lives on the patient
 *       surface; doctor sees status only).
 * - 25: Preparation→booking transition gate — visible readiness summary that
 *       tells the doctor whether the patient can be safely advanced.
 */
export default function AppointmentSection({
  mainAppointment,
  preparatoryAppointments,
  prepReady,
  prepSummary,
  patientSurfaceHint,
  onComposeRequest,
}: {
  mainAppointment: Appointment | null
  preparatoryAppointments: Appointment[]
  prepReady: boolean
  prepSummary: { done: number; total: number }
  patientSurfaceHint?: string
  onComposeRequest: () => void
}) {
  return (
    <div className="flex flex-col gap-5">
      <header>
        <h2 className="text-h2-ui font-bold text-ink-strong leading-tight">
          Основной приём
        </h2>
        <p className="text-caption text-ink-muted mt-1">
          Состояние записи к основному врачу и переход из подготовки в запись.
        </p>
      </header>

      {/* Spec 23 + 24 + 25 — booking lifecycle */}
      {mainAppointment ? (
        <div className="rounded-2xl bg-cyan-500 text-white p-6 flex items-center gap-5">
          <div className="h-14 w-14 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <Calendar size={28} strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-caps text-white/80 mb-1">
              Запись запланирована
            </p>
            <p className="text-h1-ui font-bold leading-tight font-data">
              {formatDateShort(mainAppointment.date)}
            </p>
            <p className="text-caption text-white/85 mt-1">
              {mainAppointment.status === 'completed'
                ? 'Приём завершён'
                : 'Пациент придёт на приём в указанную дату'}
            </p>
          </div>
          <StatusBadge tone={mainAppointment.status === 'completed' ? 'success' : 'info'}>
            {mainAppointment.status === 'completed' ? 'Завершён' : 'Запланирован'}
          </StatusBadge>
        </div>
      ) : (
        <div className="rounded-2xl bg-surface-sunken p-6 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
              <AlertCircle size={20} strokeWidth={2} />
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-bold text-ink-strong">
                Основная запись отсутствует
              </p>
              <p className="text-caption text-ink-muted mt-1 leading-relaxed">
                Пациент пока не выбрал слот. Запись на основной приём остаётся
                действием пациента — кокпит не бронирует за него.
              </p>
            </div>
          </div>
          {patientSurfaceHint && (
            <p className="text-caption text-cyan-600">{patientSurfaceHint}</p>
          )}
        </div>
      )}

      {/* Spec 25 — readiness gate */}
      <div className="rounded-2xl bg-surface p-5 shadow-[inset_0_0_0_1.5px_var(--slate-100)]">
        <div className="flex items-center justify-between gap-3 mb-2">
          <p className="text-[10px] font-bold uppercase tracking-caps text-ink-muted">
            Готовность к переходу «подготовка → запись»
          </p>
          <span className="text-caption text-ink-muted font-data">
            {prepSummary.done} из {prepSummary.total}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={`h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 ${
              prepReady
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {prepReady ? (
              <Check size={18} strokeWidth={2.5} />
            ) : (
              <AlertCircle size={18} strokeWidth={2} />
            )}
          </div>
          <p className="text-body text-ink-strong leading-tight">
            {prepReady
              ? 'Пациент готов к записи на основной приём'
              : 'Подготовка ещё не завершена — пациент видит подсказку в приложении'}
          </p>
          {!prepReady && (
            <Button
              variant="secondary"
              size="md"
              icon={<Send size={14} strokeWidth={2.4} />}
              onClick={onComposeRequest}
              className="ml-auto"
            >
              Уточнить запросом
            </Button>
          )}
        </div>
      </div>

      {/* Spec 22 — preparatory→main link */}
      {preparatoryAppointments.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-caps text-ink-muted mb-2">
            Связанные подготовительные визиты
          </p>
          <ul className="flex flex-col gap-2">
            {preparatoryAppointments.map((a) => (
              <li
                key={a.id}
                className="rounded-xl bg-surface-sunken px-4 py-3 flex items-center gap-3"
              >
                <Calendar size={16} className="text-cyan-500" strokeWidth={2} />
                <span className="text-body text-ink-strong font-bold flex-1">
                  {formatDateShort(a.date)}
                </span>
                {mainAppointment && (
                  <span className="inline-flex items-center gap-1 text-caption text-ink-muted">
                    <ArrowRight size={14} strokeWidth={2} />
                    {formatDateShort(mainAppointment.date)}
                  </span>
                )}
                <StatusBadge tone={a.status === 'completed' ? 'success' : 'info'}>
                  {a.status === 'completed' ? 'Завершён' : 'Запланирован'}
                </StatusBadge>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
