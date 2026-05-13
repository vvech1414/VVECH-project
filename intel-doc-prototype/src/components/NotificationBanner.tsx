type NotifType = 'info' | 'action' | 'reminder' | 'success'

interface NotificationBannerProps {
  type: NotifType
  title: string
  body: string
  cta?: string
  onCta?: () => void
}

const typeStyles: Record<
  NotifType,
  { bg: string; titleColor: string; ctaColor: string }
> = {
  info: { bg: 'bg-cyan-50', titleColor: 'text-cyan-700', ctaColor: 'text-cyan-600' },
  action: { bg: 'bg-[#FFFBEB]', titleColor: 'text-amber-800', ctaColor: 'text-amber-700' },
  reminder: { bg: 'bg-cyan-50', titleColor: 'text-navy-900', ctaColor: 'text-cyan-500' },
  success: { bg: 'bg-[#ECFDF5]', titleColor: 'text-emerald-800', ctaColor: 'text-emerald-700' },
}

export default function NotificationBanner({
  type,
  title,
  body,
  cta,
  onCta,
}: NotificationBannerProps) {
  const s = typeStyles[type]
  return (
    <div className={`rounded-2xl p-4 ${s.bg}`}>
      <p className={`text-[15px] font-bold mb-1 ${s.titleColor}`}>{title}</p>
      <p className="text-caption text-slate-700 leading-relaxed">{body}</p>
      {cta && (
        <button
          onClick={onCta}
          className={`mt-3 inline-flex items-center gap-1 text-[12px] font-bold tracking-caps uppercase ${s.ctaColor}`}
        >
          {cta}
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 12L10 8L6 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  )
}
