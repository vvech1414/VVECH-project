import { FileText, Check, AlertCircle, ExternalLink, Sparkles } from 'lucide-react'
import StatusBadge from '../primitives/StatusBadge'
import { formatDateTime } from '../../lib/formatters'
import { DOCUMENT_SLOTS } from './doctorConstants'
import type { Document } from '../../store/types'

function StructureBadge({
  status,
}: {
  status: Document['structureStatus']
}) {
  if (status === 'structured') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
        <Sparkles size={11} strokeWidth={2.4} /> Структурировано
      </span>
    )
  }
  if (status === 'original-only') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700">
        <FileText size={11} strokeWidth={2.4} /> Только оригинал
      </span>
    )
  }
  return null
}

/**
 * Documents preparation checklist (specs 11–15).
 * - 11/13: Required vs. optional slots, readiness rollup.
 * - 12: Upload state per slot (mocked — patient does the actual upload).
 * - 14: OMS gets a dedicated callout because it's the formal pilot doc.
 * - 15: External-LPU referral slot rendered with origin hint.
 */
export default function DocumentsSection({
  documents,
}: {
  documents: Document[]
}) {
  const requiredSlots = DOCUMENT_SLOTS.filter((s) => s.required)
  const requiredUploaded = requiredSlots.filter((s) =>
    documents.some((d) => d.type === s.type),
  ).length
  const percent = requiredSlots.length
    ? Math.round((requiredUploaded / requiredSlots.length) * 100)
    : 0
  const ready = requiredUploaded === requiredSlots.length

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h2 className="text-h2-ui font-bold text-ink-strong leading-tight">
          Документы
        </h2>
        <p className="text-caption text-ink-muted mt-1">
          Логистическая готовность пакета документов перед приёмом.
        </p>
      </header>

      <div className="rounded-2xl bg-surface-sunken p-5 flex items-center gap-5">
        <div className="flex-shrink-0 h-16 w-16 rounded-2xl bg-white flex items-center justify-center font-data text-h2-ui font-bold text-cyan-500">
          {percent}%
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-bold text-ink-strong">
            {ready
              ? 'Обязательные документы загружены'
              : `Загружено ${requiredUploaded} из ${requiredSlots.length} обязательных`}
          </p>
          <p className="text-caption text-ink-muted mt-1">
            Пациент загружает оригиналы; IntelDoc хранит копии для приёма.
          </p>
        </div>
        <StatusBadge tone={ready ? 'success' : 'warning'}>
          {ready ? 'Готовы' : 'В работе'}
        </StatusBadge>
      </div>

      <ul className="flex flex-col gap-2">
        {DOCUMENT_SLOTS.map((slot) => {
          const matches = documents.filter((d) => d.type === slot.type)
          const filled = matches.length > 0
          const last = matches.length
            ? matches.slice().sort((a, b) =>
                a.uploadedAt < b.uploadedAt ? 1 : -1,
              )[0]
            : null
          const isOms = slot.type === 'oms'
          const isReferral = slot.type === 'referral'
          return (
            <li
              key={slot.type}
              className={`rounded-2xl p-4 flex items-center gap-4 ${
                isOms
                  ? 'bg-cyan-50/60 shadow-[inset_0_0_0_1.5px_var(--cyan-200)]'
                  : 'bg-surface-sunken'
              }`}
            >
              <div
                className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  filled
                    ? 'bg-emerald-100 text-emerald-700'
                    : slot.required
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-white text-ink-muted shadow-[inset_0_0_0_1.5px_var(--slate-200)]'
                }`}
              >
                {filled ? (
                  <Check size={20} strokeWidth={2.5} />
                ) : slot.required ? (
                  <AlertCircle size={20} strokeWidth={2} />
                ) : (
                  <FileText size={20} strokeWidth={2} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[14px] font-bold text-ink-strong">{slot.label}</p>
                  {slot.required && (
                    <span className="text-[10px] font-bold uppercase tracking-caps text-rose-600">
                      Обязательно
                    </span>
                  )}
                  {!slot.required && !filled && (
                    <span className="text-[10px] font-bold uppercase tracking-caps text-ink-muted">
                      Опционально
                    </span>
                  )}
                  {isReferral && filled && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-caps text-cyan-600">
                      <ExternalLink size={11} strokeWidth={2.4} />
                      Сторонний ЛПУ
                    </span>
                  )}
                </div>
                <p className="text-caption text-ink-muted mt-0.5 leading-snug">
                  {slot.helper}
                </p>
                {last && (
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <p className="text-caption text-ink-muted font-data">
                      Загружено {formatDateTime(last.uploadedAt)}
                    </p>
                    {last.structureStatus && (
                      <StructureBadge status={last.structureStatus} />
                    )}
                  </div>
                )}
              </div>
              <StatusBadge
                tone={filled ? 'success' : slot.required ? 'warning' : 'neutral'}
              >
                {filled ? 'Загружен' : slot.required ? 'Ожидаем' : 'Не загружен'}
              </StatusBadge>
            </li>
          )
        })}
      </ul>

      <p className="text-caption text-ink-muted leading-relaxed">
        Доктор видит факт загрузки; редактирование и удаление документов остаётся
        на стороне пациента.
      </p>
    </div>
  )
}
