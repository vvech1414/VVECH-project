import { MessageSquare, Tag } from 'lucide-react'
import { formatDateTime } from '../../lib/formatters'
import { COMPLAINT_TAG_LABEL } from './doctorConstants'
import type { Complaint, ComplaintTag } from '../../store/types'

/**
 * Doctor view of patient complaints (specs 16–18).
 * - 16: Display all complaints sorted newest first.
 * - 17: Render attached organisational tags (non-diagnostic taxonomy).
 * - 18: Editing remains patient-side; doctor sees a read-only history with
 *       creation timestamp so they can ask follow-up questions in a request.
 */
export default function ComplaintsSection({
  complaints,
}: {
  complaints: Complaint[]
}) {
  if (complaints.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <Header />
        <div className="rounded-2xl bg-surface-sunken p-6 flex items-start gap-3">
          <MessageSquare size={20} className="text-ink-muted mt-0.5" strokeWidth={2} />
          <div>
            <p className="text-[15px] font-bold text-ink-strong">
              Пациент пока не описал жалоб
            </p>
            <p className="text-caption text-ink-muted mt-1 leading-relaxed">
              Можно отправить запрос «Уточнение жалоб», чтобы получить контекст
              перед приёмом.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Newest first.
  const sorted = complaints
    .slice()
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))

  // Tag rollup across all complaints (spec 17).
  const tagCounts = new Map<ComplaintTag, number>()
  for (const c of sorted) {
    for (const t of c.tags ?? []) {
      tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Header />

      {tagCounts.size > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {[...tagCounts.entries()].map(([tag, n]) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 px-3 py-1 text-[11px] font-bold uppercase tracking-caps text-cyan-700"
            >
              <Tag size={11} strokeWidth={2.4} />
              {COMPLAINT_TAG_LABEL[tag] ?? tag}
              <span className="font-data text-cyan-500">· {n}</span>
            </span>
          ))}
        </div>
      )}

      <ul className="flex flex-col gap-2">
        {sorted.map((c) => (
          <li
            key={c.id}
            className="rounded-2xl bg-surface-sunken p-4 flex flex-col gap-2"
          >
            <p className="text-body text-ink-strong leading-relaxed whitespace-pre-line">
              {c.text}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-caption text-ink-muted font-data">
                {formatDateTime(c.createdAt)}
              </span>
              {(c.tags ?? []).map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-caps text-cyan-600 shadow-[inset_0_0_0_1.5px_var(--slate-200)]"
                >
                  {COMPLAINT_TAG_LABEL[t] ?? t}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>

      <p className="text-caption text-ink-muted leading-relaxed">
        Жалобы записаны со слов пациента и могут уточняться через запрос.
      </p>
    </div>
  )
}

function Header() {
  return (
    <header>
      <h2 className="text-h2-ui font-bold text-ink-strong leading-tight">
        Жалобы пациента
      </h2>
      <p className="text-caption text-ink-muted mt-1">
        Логистический ввод от пациента — не клиническая оценка.
      </p>
    </header>
  )
}
