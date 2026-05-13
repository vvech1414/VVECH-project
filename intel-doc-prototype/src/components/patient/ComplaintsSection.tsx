import { useState } from 'react'
import { AlertCircle, Pencil, Tags } from 'lucide-react'
import Button from '../primitives/Button'
import BottomSheet from '../primitives/BottomSheet'
import ChecklistSection from './ChecklistSection'
import type { Complaint, ComplaintTag } from '../../store/types'
import { addComplaint, setComplaintTags } from '../../store/actions'
import { formatDateShort } from '../../lib/formatters'

const TAG_LABEL: Record<ComplaintTag, string> = {
  energy: 'Самочувствие и силы',
  sleep: 'Сон',
  weight: 'Вес и аппетит',
  glucose: 'Сахар крови',
  mood: 'Настроение',
  other: 'Другое',
}

const TAG_ORDER: ComplaintTag[] = [
  'energy',
  'sleep',
  'weight',
  'glucose',
  'mood',
  'other',
]

interface ComplaintsSectionProps {
  complaints: Complaint[]
}

/** Specs 016 + 017 + 018: list, tags, edit (replace) entry. */
export default function ComplaintsSection({ complaints }: ComplaintsSectionProps) {
  const [composerOpen, setComposerOpen] = useState(false)
  const [text, setText] = useState('')
  const [tagsDraft, setTagsDraft] = useState<ComplaintTag[]>([])
  const [editing, setEditing] = useState<Complaint | null>(null)

  function openComposer(target: Complaint | null) {
    setEditing(target)
    setText(target?.text ?? '')
    setTagsDraft(target?.tags ?? [])
    setComposerOpen(true)
  }

  function toggleTag(tag: ComplaintTag) {
    setTagsDraft((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  function save() {
    const trimmed = text.trim()
    if (trimmed.length < 5) return
    if (editing) {
      // No update-text action in contract — replace by adding new + retag, then
      // tag the new one. The old entry stays as historical context.
      const created = addComplaint(trimmed)
      if (created) setComplaintTags(created.id, tagsDraft)
    } else {
      const created = addComplaint(trimmed)
      if (created && tagsDraft.length > 0) setComplaintTags(created.id, tagsDraft)
    }
    setComposerOpen(false)
    setEditing(null)
    setText('')
    setTagsDraft([])
  }

  return (
    <>
      <ChecklistSection
        title="Жалобы"
        hint={complaints.length > 0 ? `${complaints.length}` : undefined}
      >
        {complaints.length === 0 && (
          <div className="rounded-2xl bg-surface-sunken p-4 text-center">
            <AlertCircle size={20} className="mx-auto mb-2 text-cyan-500" strokeWidth={2} />
            <p className="text-caption text-ink leading-relaxed">
              Опишите, что вас беспокоит — это поможет врачу подготовиться к разговору.
            </p>
          </div>
        )}
        {complaints.map((c) => (
          <div key={c.id} className="rounded-2xl bg-white p-4 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-3">
              <p className="text-body text-ink-strong leading-relaxed flex-1">
                {c.text}
              </p>
              <button
                onClick={() => openComposer(c)}
                aria-label="Уточнить"
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-cyan-50 flex items-center justify-center flex-shrink-0"
              >
                <Pencil size={14} className="text-cyan-500" strokeWidth={2.4} />
              </button>
            </div>
            {c.tags && c.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {c.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-full bg-cyan-50 text-cyan-700 px-2.5 py-0.5 text-[11px] font-bold tracking-caps"
                  >
                    {TAG_LABEL[t]}
                  </span>
                ))}
              </div>
            )}
            <p className="text-caption text-ink-muted">
              {formatDateShort(c.createdAt)}
            </p>
          </div>
        ))}
        <Button
          variant="secondary"
          full
          size="md"
          onClick={() => openComposer(null)}
        >
          {complaints.length > 0 ? 'Добавить ещё' : 'Добавить жалобу'}
        </Button>
      </ChecklistSection>

      <BottomSheet
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        title={editing ? 'Уточните жалобу' : 'Опишите, что беспокоит'}
      >
        <p className="text-caption text-ink-muted leading-relaxed text-center">
          Свободно, своими словами. Можно по пунктам.
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Например: уровень сахара утром выше нормы, иногда головокружения..."
          rows={5}
          className="w-full rounded-xl bg-surface-sunken px-4 py-3 text-body-lg text-ink-strong placeholder:text-ink-subtle outline-none resize-none focus:shadow-[inset_0_0_0_1.5px_var(--blue-600)]"
        />

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 px-1">
            <Tags size={14} className="text-cyan-500" strokeWidth={2} />
            <p className="text-[10px] font-bold uppercase tracking-caps text-ink-muted">
              Категории — по желанию
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TAG_ORDER.map((tag) => {
              const active = tagsDraft.includes(tag)
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full px-3 py-1.5 text-[12px] font-bold tracking-caps transition-colors ${
                    active
                      ? 'bg-cyan-500 text-white'
                      : 'bg-white text-cyan-600 shadow-[inset_0_0_0_1.5px_var(--blue-200)]'
                  }`}
                >
                  {TAG_LABEL[tag]}
                </button>
              )
            })}
          </div>
        </div>

        <Button
          full
          onClick={save}
          disabled={text.trim().length < 5}
        >
          Сохранить
        </Button>
        <p className="text-caption text-ink-muted leading-relaxed text-center">
          Это организационные категории — не диагноз. Решения принимает ваш врач.
        </p>
      </BottomSheet>
    </>
  )
}
