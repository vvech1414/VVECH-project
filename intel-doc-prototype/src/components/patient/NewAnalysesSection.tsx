import { useNavigate } from 'react-router-dom'
import { Check, FileText, Upload } from 'lucide-react'
import StatusBadge from '../primitives/StatusBadge'
import ChecklistSection from './ChecklistSection'
import type { PlanItem, PlanItemStatus } from '../../store/types'

interface NewAnalysesSectionProps {
  items: { assigned: PlanItem[]; uploaded: PlanItem[]; acknowledged: PlanItem[] }
  /** Optional doctor name + date label rendered above the list. */
  planMeta?: { doctorName?: string; sentLabel?: string } | null
}

const STATUS_TONE: Record<PlanItemStatus, 'warning' | 'info' | 'success'> = {
  assigned: 'warning',
  uploaded: 'info',
  acknowledged: 'success',
}
const STATUS_LABEL: Record<PlanItemStatus, string> = {
  assigned: 'К загрузке',
  uploaded: 'На проверке',
  acknowledged: 'Принято',
}

/**
 * Specs 005–010: doctor-assigned new analyses with explicit statuses, upload
 * entry, dossier aggregation hint, and link to the originating plan/request.
 */
export default function NewAnalysesSection({ items, planMeta }: NewAnalysesSectionProps) {
  const nav = useNavigate()
  const all = [...items.assigned, ...items.uploaded, ...items.acknowledged]
  if (all.length === 0) return null

  const done = items.uploaded.length + items.acknowledged.length
  const total = all.length

  return (
    <ChecklistSection title="Назначил врач" hint={`${done}/${total}`}>
      {planMeta && (planMeta.doctorName || planMeta.sentLabel) && (
        <div className="rounded-2xl bg-cyan-50 px-4 py-3 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-cyan-500 text-white flex items-center justify-center flex-shrink-0">
            <FileText size={18} strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-cyan-700 leading-snug">
              План обследования от врача
            </p>
            <p className="text-caption text-cyan-700/80 leading-snug truncate">
              {[planMeta.doctorName, planMeta.sentLabel].filter(Boolean).join(' · ')}
            </p>
          </div>
        </div>
      )}

      {all.map((item) => {
        const tone = STATUS_TONE[item.status]
        const label = STATUS_LABEL[item.status]
        const Icon = item.status === 'acknowledged' ? Check : item.status === 'uploaded' ? FileText : Upload
        const onClick =
          item.status === 'assigned'
            ? () => nav(`/patient/upload/${item.analysisType}`)
            : undefined
        return (
          <button
            key={item.id}
            onClick={onClick}
            disabled={!onClick}
            className="rounded-2xl bg-white p-4 flex items-center gap-3 text-left disabled:cursor-default hover:bg-slate-50 transition-colors"
          >
            <div
              className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                item.status === 'acknowledged'
                  ? 'bg-[#ECFDF5] text-emerald-600'
                  : 'bg-cyan-50 text-cyan-500'
              }`}
            >
              <Icon size={20} strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-ink-strong leading-snug">
                {item.label}
              </p>
              {item.reason && (
                <p className="text-caption text-ink-muted leading-snug mt-0.5 line-clamp-2">
                  {item.reason}
                </p>
              )}
            </div>
            <StatusBadge tone={tone}>{label}</StatusBadge>
          </button>
        )
      })}

      {done > 0 && (
        <p className="text-caption text-ink-muted px-1 leading-relaxed">
          Принятые результаты автоматически попадут в досье — врач увидит их перед
          приёмом.
        </p>
      )}
    </ChecklistSection>
  )
}
