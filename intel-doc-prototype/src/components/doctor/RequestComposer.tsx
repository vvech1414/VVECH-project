import { useMemo, useState } from 'react'
import { Plus, Trash2, Send, Check } from 'lucide-react'
import Button from '../primitives/Button'
import { sendRequest } from '../../store/actions'
import type { AnalysisType, Patient } from '../../store/types'

interface DraftItem {
  analysisType: AnalysisType
  label: string
  reason: string
}

const TEMPLATE = {
  id: 'extra-tests',
  title: 'Дополнительные анализы перед приёмом',
  body: '{name}, перед приёмом нам важно увидеть актуальные значения. Загрузите, пожалуйста, результаты ниже — это займёт несколько минут.',
  items: [
    {
      analysisType: 'glucose' as AnalysisType,
      label: 'Глюкоза крови натощак',
      reason: 'Контроль текущего уровня перед визитом',
    },
    {
      analysisType: 'creatinine' as AnalysisType,
      label: 'Креатинин',
      reason: 'Оценка функции почек',
    },
  ],
}

const TYPE_OPTIONS: AnalysisType[] = [
  'HbA1c',
  'glucose',
  'creatinine',
  'cholesterol',
  'other',
]

const TYPE_LABEL: Record<AnalysisType, string> = {
  HbA1c: 'Гликированный гемоглобин (HbA1c)',
  glucose: 'Глюкоза крови натощак',
  creatinine: 'Креатинин',
  cholesterol: 'Холестерин',
  other: 'Другой анализ',
}

export default function RequestComposer({ patient }: { patient: Patient }) {
  const firstName = patient.name.split(' ')[0] ?? 'Пациент'
  const initial = useMemo(
    () => ({
      ...TEMPLATE,
      body: TEMPLATE.body.replace('{name}', firstName),
    }),
    [firstName],
  )

  const [title, setTitle] = useState(initial.title)
  const [body, setBody] = useState(initial.body)
  const [items, setItems] = useState<DraftItem[]>(initial.items)
  const [justSent, setJustSent] = useState(false)

  function reset() {
    setTitle(initial.title)
    setBody(initial.body)
    setItems(initial.items)
  }

  function addRow() {
    setItems((arr) => [
      ...arr,
      { analysisType: 'glucose', label: TYPE_LABEL.glucose, reason: '' },
    ])
  }

  function setRow(i: number, patch: Partial<DraftItem>) {
    setItems((arr) =>
      arr.map((x, idx) => {
        if (idx !== i) return x
        const next = { ...x, ...patch }
        if (patch.analysisType && next.label === TYPE_LABEL[x.analysisType])
          next.label = TYPE_LABEL[patch.analysisType]
        return next
      }),
    )
  }

  function removeRow(i: number) {
    setItems((arr) => arr.filter((_, idx) => idx !== i))
  }

  function send() {
    const valid = items.filter((it) => it.label.trim())
    sendRequest({
      title: title.trim() || 'Запрос врача',
      body: body.trim(),
      items: valid,
    })
    setJustSent(true)
    reset()
    window.setTimeout(() => setJustSent(false), 2400)
  }

  return (
    <section className="rounded-2xl bg-surface-sunken p-5 flex flex-col gap-4">
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-caps text-ink-muted">
            Новый запрос
          </p>
          <h3 className="text-h2-ui font-bold text-ink-strong">
            Запрос пациенту
          </h3>
        </div>
        {justSent ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[12px] font-bold text-emerald-700">
            <Check size={14} strokeWidth={2.4} />
            Отправлено
          </span>
        ) : (
          <Button
            icon={<Send size={16} strokeWidth={2.4} />}
            onClick={send}
            disabled={!title.trim()}
          >
            Отправить
          </Button>
        )}
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          <Field label="Тема запроса">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl bg-white px-4 py-3 text-body-lg text-ink-strong shadow-[inset_0_0_0_1.5px_var(--slate-200)] outline-none focus:shadow-[inset_0_0_0_1.5px_var(--blue-600)]"
            />
          </Field>

          <Field label="Сообщение пациенту">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              className="w-full rounded-xl bg-white px-4 py-3 text-body-lg text-ink-strong shadow-[inset_0_0_0_1.5px_var(--slate-200)] outline-none focus:shadow-[inset_0_0_0_1.5px_var(--blue-600)] resize-none"
            />
          </Field>

          <Field label="Что нужно загрузить">
            <div className="flex flex-col gap-2">
              {items.map((it, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-white p-3 flex items-start gap-2 shadow-[inset_0_0_0_1.5px_var(--slate-200)]"
                >
                  <select
                    value={it.analysisType}
                    onChange={(e) =>
                      setRow(i, { analysisType: e.target.value as AnalysisType })
                    }
                    className="rounded-lg bg-white px-3 py-2 text-body shadow-[inset_0_0_0_1.5px_var(--slate-200)] outline-none focus:shadow-[inset_0_0_0_1.5px_var(--blue-600)]"
                  >
                    {TYPE_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {TYPE_LABEL[t]}
                      </option>
                    ))}
                  </select>
                  <input
                    value={it.reason}
                    onChange={(e) => setRow(i, { reason: e.target.value })}
                    placeholder="Зачем нужен (показывается пациенту)"
                    className="flex-1 rounded-lg bg-white px-3 py-2 text-body shadow-[inset_0_0_0_1.5px_var(--slate-200)] outline-none focus:shadow-[inset_0_0_0_1.5px_var(--blue-600)]"
                  />
                  <button
                    onClick={() => removeRow(i)}
                    aria-label="Убрать"
                    className="h-9 w-9 flex items-center justify-center rounded-lg text-ink-muted hover:bg-slate-100 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 size={16} strokeWidth={2} />
                  </button>
                </div>
              ))}
              <button
                onClick={addRow}
                className="self-start inline-flex items-center gap-1 text-[12px] font-bold tracking-caps uppercase text-cyan-500"
              >
                <Plus size={14} strokeWidth={2.4} />
                Добавить пункт
              </button>
            </div>
          </Field>
        </div>

        <aside className="rounded-2xl bg-white p-4 flex flex-col gap-3 shadow-[inset_0_0_0_1.5px_var(--slate-200)]">
          <p className="text-[10px] font-bold uppercase tracking-caps text-ink-muted">
            Предпросмотр у пациента
          </p>
          <div className="rounded-2xl bg-cyan-500 p-4 text-white shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-caps text-white/85">
                Новый запрос
              </span>
            </div>
            <p className="text-[16px] font-bold leading-tight mb-1.5">{title}</p>
            <p className="text-caption text-white/85 leading-relaxed">{body}</p>
          </div>
          <div className="rounded-2xl bg-surface-sunken p-3">
            <p className="text-[10px] font-bold uppercase tracking-caps text-ink-muted mb-2">
              Что попросим
            </p>
            <ul className="space-y-1.5 text-body text-ink-strong">
              {items.length === 0 && (
                <li className="text-ink-muted text-caption">— пунктов нет</li>
              )}
              {items.map((it, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 mt-1.5 flex-shrink-0" />
                  <span>
                    <span className="font-bold">{it.label}</span>
                    {it.reason && (
                      <span className="text-caption text-ink-muted block leading-snug">
                        {it.reason}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[10px] font-bold uppercase tracking-caps text-ink-muted">
        {label}
      </span>
      {children}
    </label>
  )
}
