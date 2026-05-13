import type { ChipVariant } from '../types'

interface StatusChipProps {
  label: string
  variant: ChipVariant
  size?: 'sm' | 'md'
}

const variantClasses: Record<ChipVariant, string> = {
  // Soft semantic palette per design system: pastel bg + saturated fg
  success: 'bg-[#ECFDF5] text-emerald-700',
  warning: 'bg-[#FFFBEB] text-amber-700',
  error: 'bg-[#FFF1F2] text-rose-700',
  info: 'bg-cyan-50 text-cyan-600',
  neutral: 'bg-slate-100 text-slate-600',
}

export default function StatusChip({ label, variant, size = 'sm' }: StatusChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-bold tracking-caps uppercase ${
        size === 'sm' ? 'px-2.5 py-1 text-[10px]' : 'px-3 py-1.5 text-caption'
      } ${variantClasses[variant]}`}
    >
      {label}
    </span>
  )
}
