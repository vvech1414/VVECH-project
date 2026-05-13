import { useNavigate } from 'react-router-dom'
import { ChevronRight, Stethoscope } from 'lucide-react'
import ChecklistSection from './ChecklistSection'

export interface ExtraSpecialist {
  slug: string
  name: string
  reason: string
}

export const ADDITIONAL_SPECIALISTS: ExtraSpecialist[] = [
  {
    slug: 'ophthalmologist',
    name: 'Офтальмолог',
    reason: 'Контроль состояния сосудов глазного дна',
  },
  {
    slug: 'cardiologist',
    name: 'Кардиолог',
    reason: 'Профилактика осложнений со стороны сердца',
  },
  {
    slug: 'neurologist',
    name: 'Невролог',
    reason: 'Оценка чувствительности при нейропатии',
  },
  {
    slug: 'nephrologist',
    name: 'Нефролог',
    reason: 'Контроль функции почек при сахарном диабете',
  },
]

/** Spec 019 — display block; tapping a row routes to spec 020 list/selection. */
export default function AdditionalDoctorsSection() {
  const nav = useNavigate()
  return (
    <ChecklistSection title="Какие ещё врачи могут понадобиться">
      <div className="rounded-2xl bg-cyan-50 px-4 py-3">
        <p className="text-caption text-cyan-700 leading-relaxed">
          Это рекомендации по подготовке. Решение, к кому записаться, остаётся за вами и вашим врачом.
        </p>
      </div>

      {ADDITIONAL_SPECIALISTS.slice(0, 3).map((spec) => (
        <button
          key={spec.slug}
          onClick={() => nav(`/patient/extra-doctors?focus=${spec.slug}`)}
          className="rounded-2xl bg-white p-4 flex items-start gap-3 text-left hover:bg-slate-50 transition-colors"
        >
          <div className="h-10 w-10 rounded-xl bg-cyan-50 text-cyan-500 flex items-center justify-center flex-shrink-0">
            <Stethoscope size={20} strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-bold text-ink-strong">{spec.name}</p>
            <p className="text-caption text-ink-muted leading-snug mt-0.5">
              {spec.reason}
            </p>
          </div>
          <ChevronRight size={18} className="text-slate-400 mt-1" />
        </button>
      ))}

      <button
        onClick={() => nav('/patient/extra-doctors')}
        className="text-[12px] font-bold tracking-caps uppercase text-cyan-500 self-start px-1 mt-1"
      >
        Посмотреть всех специалистов
      </button>
    </ChecklistSection>
  )
}
