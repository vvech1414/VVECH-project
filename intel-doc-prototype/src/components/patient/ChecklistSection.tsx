import type { ReactNode } from 'react'

interface ChecklistSectionProps {
  title: string
  hint?: string
  children: ReactNode
}

export default function ChecklistSection({ title, hint, children }: ChecklistSectionProps) {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2 px-1">
        <p className="text-[10px] font-bold uppercase tracking-caps text-ink-muted">
          {title}
        </p>
        {hint && (
          <span className="text-caption text-ink-muted font-data">{hint}</span>
        )}
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </section>
  )
}
