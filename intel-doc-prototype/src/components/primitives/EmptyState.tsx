import type { LucideIcon } from 'lucide-react'

type Tone = 'info' | 'neutral'

interface EmptyStateAction {
  label: string
  onClick: () => void
  variant?: 'link' | 'button'
  icon?: LucideIcon
}

interface EmptyStateProps {
  Icon: LucideIcon
  tone?: Tone
  title: string
  body: string
  action?: EmptyStateAction
}

const TILE: Record<Tone, string> = {
  info: 'bg-cyan-50 text-cyan-500',
  neutral: 'bg-slate-100 text-slate-500',
}

export default function EmptyState({
  Icon,
  tone = 'info',
  title,
  body,
  action,
}: EmptyStateProps) {
  const variant = action?.variant ?? 'link'
  const ActionIcon = action?.icon

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 gap-3">
      <div
        className={`h-16 w-16 rounded-2xl flex items-center justify-center ${TILE[tone]}`}
      >
        <Icon size={28} strokeWidth={2} />
      </div>
      <p className="text-h2-ui font-bold text-ink-strong">{title}</p>
      <p className="text-caption text-ink-muted leading-relaxed max-w-[280px]">
        {body}
      </p>
      {action && variant === 'link' && (
        <button
          onClick={action.onClick}
          className="mt-3 text-[12px] font-bold tracking-caps uppercase text-cyan-500"
        >
          {action.label}
        </button>
      )}
      {action && variant === 'button' && (
        <button
          onClick={action.onClick}
          className="mt-3 inline-flex items-center gap-2 rounded-xl bg-cyan-500 text-white px-5 py-3 text-[15px] font-bold tracking-ui"
        >
          {ActionIcon && <ActionIcon size={18} strokeWidth={2.5} />}
          {action.label}
        </button>
      )}
    </div>
  )
}
