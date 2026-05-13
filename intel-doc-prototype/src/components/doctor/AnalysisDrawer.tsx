import { Check, FileText, X, Link2 } from 'lucide-react'
import Button from '../primitives/Button'
import StatusBadge from '../primitives/StatusBadge'
import AccessLogFootnote from './AccessLogFootnote'
import { LowConfidenceDot } from './MetricCard'
import { acknowledgeAnalysis } from '../../store/actions'
import { formatDateShort, formatDateTime } from '../../lib/formatters'
import type { Analysis, PlanItem } from '../../store/types'

/**
 * Side drawer used by both old- and new-analyses sections.
 * Shows the original document tile next to structured OCR fields side-by-side
 * (spec 02 — original vs structured separation, spec 09 — plan-item link
 * traceability).
 */
export default function AnalysisDrawer({
  analysis,
  linkedPlanItem,
  onClose,
}: {
  analysis: Analysis
  linkedPlanItem?: PlanItem | null
  onClose: () => void
}) {
  const isAssignedSource = !!linkedPlanItem
  return (
    <div
      className="fixed inset-0 z-40 bg-black/30 flex justify-end"
      onClick={onClose}
      role="dialog"
      aria-label={`Анализ — ${analysis.label}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[480px] bg-white h-full overflow-y-auto p-6 flex flex-col gap-5 shadow-md"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-caps text-cyan-500 mb-1">
              {isAssignedSource ? 'Назначенный анализ' : 'Анализ'}
            </p>
            <h2 className="text-h2-ui font-bold text-ink-strong leading-tight">
              {analysis.label}
            </h2>
            <p className="text-caption text-ink-muted mt-1 font-data">
              {analysis.date ? formatDateShort(analysis.date) : 'без даты'}
              {' · загрузка '}
              {formatDateTime(analysis.uploadedAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Закрыть"
            className="h-8 w-8 flex items-center justify-center rounded-full text-ink-muted hover:bg-slate-100"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {linkedPlanItem && (
          <div className="rounded-2xl bg-cyan-50 p-4 flex items-start gap-3">
            <Link2 size={16} className="text-cyan-500 mt-0.5" strokeWidth={2.4} />
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-caps text-cyan-600 mb-0.5">
                Привязан к плану
              </p>
              <p className="text-body text-ink-strong font-bold leading-tight">
                {linkedPlanItem.label}
              </p>
              {linkedPlanItem.reason && (
                <p className="text-caption text-ink mt-1 leading-snug">
                  {linkedPlanItem.reason}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-caps text-ink-muted mb-1.5">
              Оригинал
            </p>
            <div className="rounded-xl bg-surface-sunken p-4 h-52 flex flex-col items-center justify-center gap-2">
              <FileText size={36} className="text-cyan-500" strokeWidth={1.5} />
              <p className="text-caption text-ink-muted text-center px-2">
                {analysis.originalFileUrl
                  ? 'Файл загружен пациентом'
                  : 'Превью недоступно (демо)'}
              </p>
            </div>
            <div className="mt-2">
              <StatusBadge tone={analysis.qualityCheck === 'clear' ? 'success' : 'warning'}>
                {analysis.qualityCheck === 'clear' ? 'Качество ок' : 'Допустимо'}
              </StatusBadge>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-caps text-ink-muted mb-1.5">
              Распознанные данные
            </p>
            <div className="rounded-xl bg-surface-sunken p-4 flex flex-col gap-3">
              {Object.entries(analysis.ocrFields).map(([k, v]) => {
                const meta = analysis.ocrFieldMeta?.[k]
                return (
                  <div key={k}>
                    <div className="flex items-center gap-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-caps text-ink-muted">
                        {k}
                      </p>
                      {meta?.lowConfidence && <LowConfidenceDot inline />}
                    </div>
                    <p className="text-body-lg font-bold text-ink-strong font-data leading-tight">
                      {v}
                    </p>
                    {meta?.ref && (
                      <p className="text-[11px] text-ink-muted font-data leading-snug mt-0.5">
                        реф · {meta.ref}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
            <p className="text-caption text-ink-muted mt-2 leading-snug">
              Структурированные значения дополняют оригинал, не заменяя его.
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-surface-sunken p-4">
          <p className="text-[10px] font-bold uppercase tracking-caps text-ink-muted mb-1">
            Статус для врача
          </p>
          <p className="text-body text-ink-strong font-bold">
            {analysis.status === 'acknowledged'
              ? 'Принято в работу'
              : 'Ожидает проверки'}
          </p>
        </div>

        {analysis.status !== 'acknowledged' && (
          <Button
            full
            icon={<Check size={16} strokeWidth={2.5} />}
            onClick={() => {
              acknowledgeAnalysis(analysis.id)
              onClose()
            }}
          >
            Принять анализ
          </Button>
        )}

        <AccessLogFootnote />
      </div>
    </div>
  )
}
