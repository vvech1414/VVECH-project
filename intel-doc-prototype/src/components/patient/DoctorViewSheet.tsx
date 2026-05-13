import { Check, Minus } from 'lucide-react'
import BottomSheet from '../primitives/BottomSheet'
import Button from '../primitives/Button'

export interface DoctorViewField {
  label: string
  value?: string
}

interface DoctorViewSheetProps {
  open: boolean
  onClose: () => void
  fields: DoctorViewField[]
}

export default function DoctorViewSheet({
  open,
  onClose,
  fields,
}: DoctorViewSheetProps) {
  return (
    <BottomSheet open={open} onClose={onClose} title="Что видит врач">
      <p className="text-caption text-ink-muted leading-relaxed text-center -mt-2">
        Эти поля помогают врачу подготовиться к приёму.
        Их можно дополнить позже.
      </p>

      <div className="rounded-2xl bg-surface-sunken overflow-hidden">
        {fields.map((f, i) => {
          const filled = Boolean(f.value)
          return (
            <div
              key={f.label}
              className={`flex items-center gap-3 px-4 py-3 ${
                i > 0 ? 'border-t border-slate-100' : ''
              }`}
            >
              <div
                className={`h-7 w-7 flex-shrink-0 rounded-full flex items-center justify-center ${
                  filled
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {filled ? (
                  <Check size={14} strokeWidth={2.5} />
                ) : (
                  <Minus size={14} strokeWidth={2.5} />
                )}
              </div>
              <p className="flex-1 text-body text-ink-strong">{f.label}</p>
              <p
                className={`text-caption font-bold ${
                  filled ? 'text-ink-strong' : 'text-ink-muted'
                }`}
              >
                {filled ? f.value : 'не заполнено'}
              </p>
            </div>
          )
        })}
      </div>

      <Button variant="secondary" full onClick={onClose}>
        Понятно
      </Button>
    </BottomSheet>
  )
}
