import { useNavigate } from 'react-router-dom'
import {
  Check,
  ChevronRight,
  IdCard,
  ScrollText,
  Stethoscope,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import StatusBadge from '../primitives/StatusBadge'
import ChecklistSection from './ChecklistSection'
import type { Document, DocumentType } from '../../store/types'

interface DocumentSpec {
  type: DocumentType
  label: string
  hint: string
  required: boolean
  Icon: LucideIcon
  /** Marks the row as the dedicated «направление от другого ЛПУ» variant. */
  externalReferral?: boolean
}

/**
 * Combines specs:
 *  - 011 document preparation checklist
 *  - 012 document upload entry
 *  - 013 document readiness status
 *  - 014 OMS document
 *  - 015 external LPU referral
 */
export const DOCUMENT_CHECKLIST: DocumentSpec[] = [
  {
    type: 'passport',
    label: 'Паспорт',
    hint: 'Понадобится для оформления приёма',
    required: true,
    Icon: IdCard,
  },
  {
    type: 'oms',
    label: 'Полис ОМС',
    hint: 'Подтверждает право на бесплатные услуги',
    required: true,
    Icon: ScrollText,
  },
  {
    type: 'snils',
    label: 'СНИЛС',
    hint: 'По желанию — ускорит оформление',
    required: false,
    Icon: ScrollText,
  },
  {
    type: 'referral',
    label: 'Направление от другого ЛПУ',
    hint: 'Если приём по направлению — добавьте',
    required: false,
    Icon: Stethoscope,
    externalReferral: true,
  },
]

interface DocumentsSectionProps {
  documents: Document[]
}

export default function DocumentsSection({ documents }: DocumentsSectionProps) {
  const nav = useNavigate()
  const total = DOCUMENT_CHECKLIST.filter((d) => d.required).length
  const requiredUploaded = DOCUMENT_CHECKLIST.filter(
    (d) => d.required && documents.some((doc) => doc.type === d.type),
  ).length

  return (
    <ChecklistSection
      title="Документы"
      hint={`${requiredUploaded}/${total}`}
    >
      {DOCUMENT_CHECKLIST.map((spec) => {
        const present = documents.find((d) => d.type === spec.type)
        return (
          <button
            key={spec.type}
            onClick={() => nav(`/patient/doc-upload/${spec.type}`)}
            className="rounded-2xl bg-white p-4 flex items-center gap-3 text-left hover:bg-slate-50 transition-colors"
          >
            <div
              className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                present
                  ? 'bg-[#ECFDF5] text-emerald-600'
                  : spec.externalReferral
                  ? 'bg-[#FFFBEB] text-amber-600'
                  : 'bg-cyan-50 text-cyan-500'
              }`}
            >
              {present ? (
                <Check size={20} strokeWidth={2.5} />
              ) : (
                <spec.Icon size={20} strokeWidth={2} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-ink-strong leading-snug">
                {spec.label}
              </p>
              <p className="text-caption text-ink-muted leading-snug mt-0.5">
                {present ? 'Загружено' : spec.hint}
              </p>
            </div>
            {present ? (
              <StatusBadge tone="success">Готово</StatusBadge>
            ) : spec.required ? (
              <StatusBadge tone="warning">Обязательно</StatusBadge>
            ) : (
              <ChevronRight size={18} className="text-slate-400" />
            )}
          </button>
        )
      })}

      <p className="text-caption text-ink-muted px-1 leading-relaxed">
        Документы хранятся в зашифрованном виде. Доступ имеет только клиника, которой вы выдали разрешение.
      </p>
    </ChecklistSection>
  )
}

// Helper used by the checklist count when needed elsewhere.
export function selectRequiredDocReadiness(documents: Document[]): {
  uploaded: number
  total: number
} {
  const required = DOCUMENT_CHECKLIST.filter((d) => d.required)
  const uploaded = required.filter((spec) =>
    documents.some((d) => d.type === spec.type),
  ).length
  return { uploaded, total: required.length }
}
