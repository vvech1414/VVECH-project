import { useId } from 'react'
import {
  AlertCircle,
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ListOrdered,
  Activity,
  Siren,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import MetricCard from './MetricCard'
import VasilyMascot from '../system/VasilyMascot'
import { COMPLAINT_TAG_LABEL } from './doctorConstants'
import { formatDateCompact } from '../../lib/formatters'
import type { Complaint } from '../../store/types'
import type {
  CriticalLab,
  MetricDelta,
  MetricReading,
  VasilyObservation,
  VisitGap,
  VisitGapSource,
} from '../../store/doctorSelectors'

/**
 * Sectioned blocks that live on the doctor's Сводка tab. Each block is
 * self-contained with its own empty state — `PatientRecord` composes them.
 */

// ─── «Что закрыть на визите» ─────────────────────────────────────────────────

export function VisitGapsBlock({ gaps }: { gaps: VisitGap[] }) {
  if (gaps.length === 0) {
    return (
      <BlockShell
        tone="amber"
        eyebrow="Что закрыть на визите"
        eyebrowIcon={<AlertTriangle size={14} strokeWidth={2.4} />}
        action={undefined}
      >
        <div className="rounded-2xl bg-emerald-50/70 px-4 py-3 inline-flex items-center gap-2 text-emerald-800">
          <CheckCircle2 size={14} strokeWidth={2.4} />
          <span className="text-body font-medium">
            Пробелов не выявлено · подготовка полная
          </span>
        </div>
      </BlockShell>
    )
  }
  return (
    <BlockShell
      tone="amber"
      eyebrow="Что закрыть на визите"
      eyebrowIcon={<AlertTriangle size={14} strokeWidth={2.4} />}
      counter={gaps.length}
      hint="Пункты по плану и наблюдения пациента в подготовке."
    >
      <ul className="flex flex-col gap-2">
        {gaps.map((g) => (
          <li
            key={g.id}
            className="flex items-start gap-3 rounded-2xl bg-amber-50/70 px-4 py-3"
          >
            <AlertTriangle
              size={15}
              strokeWidth={2.2}
              className="text-amber-600 mt-0.5 flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-body text-ink-strong leading-snug">
                  {g.label}
                </p>
                <SourceTag source={g.source} />
              </div>
              {g.subtext && (
                <p className="text-caption text-ink-muted mt-0.5 leading-snug">
                  {g.subtext}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </BlockShell>
  )
}

const SOURCE_LABEL: Record<VisitGapSource, string> = {
  protocol: 'По плану',
  'patient-discovered': 'Заметил пациент',
}

const SOURCE_TONE: Record<VisitGapSource, string> = {
  protocol: 'bg-white text-amber-800 shadow-[inset_0_0_0_1px_var(--amber-200,#fcd34d)]',
  'patient-discovered':
    'bg-white text-cyan-700 shadow-[inset_0_0_0_1px_var(--cyan-200,#a5f3fc)]',
}

function SourceTag({ source }: { source: VisitGapSource }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-caps ${SOURCE_TONE[source]}`}
    >
      {SOURCE_LABEL[source]}
    </span>
  )
}

// ─── «Что заметил Василий» ───────────────────────────────────────────────────

export function VasilyObservationsBlock({
  observations,
}: {
  observations: VasilyObservation[]
}) {
  if (observations.length === 0) return null
  return (
    <BlockShell
      eyebrow="Что заметил Василий"
      counter={observations.length}
      tone="vasily"
      leading={<VasilyMascot size={56} />}
    >
      <ul className="flex flex-col gap-2">
        {observations.map((o) => (
          <li
            key={o.id}
            className="flex items-start gap-3 rounded-2xl bg-cyan-50/60 px-4 py-3"
          >
            <Sparkles
              size={14}
              strokeWidth={2.2}
              className="text-cyan-600 mt-1 flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-body text-ink-strong leading-snug">
                {o.text}
              </p>
              {o.anchor && (
                <p className="text-[11px] uppercase tracking-caps font-bold text-cyan-700 mt-1">
                  {o.anchor}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
      <p className="text-caption text-ink-muted leading-snug mt-1">
        Это не заменяет консультацию врача — Василий помогает связать сигналы,
        но не предлагает диагноз или лечение.
      </p>
    </BlockShell>
  )
}

// ─── «Что важно пациенту» ────────────────────────────────────────────────────

export function RankedQuestionsBlock({
  questions,
  total,
  onSeeAll,
}: {
  questions: Complaint[]
  total: number
  onSeeAll: () => void
}) {
  if (questions.length === 0) {
    return (
      <BlockShell
        tone="blue"
        eyebrow="Что важно пациенту"
        eyebrowIcon={<ListOrdered size={14} strokeWidth={2.4} />}
      >
        <p className="text-body text-ink-muted leading-relaxed">
          Пациент не отметил тем — спросите при приёме.
        </p>
      </BlockShell>
    )
  }
  return (
    <BlockShell
      tone="blue"
      eyebrow="Что важно пациенту"
      eyebrowIcon={<ListOrdered size={14} strokeWidth={2.4} />}
      hint="Пациент сам отметил эти темы перед визитом."
      action={
        total > questions.length
          ? {
              label: `Все темы · ${total}`,
              onClick: onSeeAll,
            }
          : undefined
      }
    >
      <ol className="flex flex-col gap-2.5">
        {questions.map((q, i) => (
          <li
            key={q.id}
            className="flex items-start gap-3 rounded-2xl bg-surface-sunken p-3.5"
          >
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500 text-white text-[12px] font-bold">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-body text-ink-strong leading-snug">
                {q.text}
              </p>
              {q.tags && q.tags.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {q.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold uppercase tracking-caps text-ink-muted shadow-[inset_0_0_0_1px_var(--slate-200)]"
                    >
                      {COMPLAINT_TAG_LABEL[t] ?? t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </BlockShell>
  )
}

// ─── «Требуют подтверждения» ─────────────────────────────────────────────────

/**
 * Low-confidence OCR readings that the doctor should verify against the
 * source document before interpreting clinically. Renders nothing when the
 * list is empty — verification is an action surface, not an empty state.
 */
export function UnconfirmedMetricsBlock({
  metrics,
  onOpenAnalysis,
}: {
  metrics: MetricReading[]
  onOpenAnalysis: (analysisId: string) => void
}) {
  if (metrics.length === 0) return null
  return (
    <BlockShell
      tone="amber"
      eyebrow="Требуют подтверждения"
      eyebrowIcon={<AlertCircle size={14} strokeWidth={2.4} />}
      counter={metrics.length}
      hint="Распознано с низкой уверенностью — сверьтесь с оригиналом перед интерпретацией."
    >
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {metrics.map((m) => (
          <button
            key={`${m.analysisId}-${m.field}`}
            onClick={() => onOpenAnalysis(m.analysisId)}
            className="text-left rounded-2xl transition-shadow hover:shadow-[0_4px_16px_rgba(15,23,42,0.06)]"
          >
            <MetricCard reading={m} tone="unconfirmed" />
          </button>
        ))}
      </div>
    </BlockShell>
  )
}

// ─── «Вне референса» ─────────────────────────────────────────────────────────

/**
 * Confident readings outside the reference range — the clinical-findings
 * block. Items that are *also* low-confidence belong upstream in
 * `UnconfirmedMetricsBlock`, not here.
 */
export function OutOfRangeMetricsBlock({
  metrics,
  hasAnyMetrics,
  outOfRangeId,
  onOpenAnalysis,
}: {
  metrics: MetricReading[]
  /** Whether the patient has any structured readings at all. Drives the empty copy. */
  hasAnyMetrics: boolean
  /** When set, the corresponding metric card scrolls into view on mount. */
  outOfRangeId?: string
  onOpenAnalysis: (analysisId: string) => void
}) {
  const anchorId = useId()
  if (!hasAnyMetrics) {
    return (
      <BlockShell
        tone="rose"
        eyebrow="Вне референса"
        eyebrowIcon={<Activity size={14} strokeWidth={2.4} />}
      >
        <p className="text-body text-ink-muted leading-relaxed">
          Пациент пока не загрузил структурированные результаты.
        </p>
      </BlockShell>
    )
  }
  if (metrics.length === 0) {
    return (
      <BlockShell
        tone="rose"
        eyebrow="Вне референса"
        eyebrowIcon={<Activity size={14} strokeWidth={2.4} />}
      >
        <div className="rounded-2xl bg-emerald-50/70 px-4 py-3 inline-flex items-center gap-2 text-emerald-800">
          <CheckCircle2 size={14} strokeWidth={2.4} />
          <span className="text-body font-medium">
            Все ключевые показатели в референсе
          </span>
        </div>
      </BlockShell>
    )
  }
  return (
    <BlockShell
      id={anchorId}
      tone="rose"
      eyebrow="Вне референса"
      eyebrowIcon={<Activity size={14} strokeWidth={2.4} />}
      counter={metrics.length}
      hint="Что обсудить и с чем сравнить динамику."
    >
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {metrics.map((m) => (
          <button
            key={`${m.analysisId}-${m.field}`}
            data-out-of-range="1"
            onClick={() => onOpenAnalysis(m.analysisId)}
            className={`text-left rounded-2xl transition-shadow hover:shadow-[0_4px_16px_rgba(15,23,42,0.06)] ${
              outOfRangeId ? 'ring-2 ring-amber-300' : ''
            }`}
          >
            <MetricCard reading={m} tone="flagged" />
          </button>
        ))}
      </div>
    </BlockShell>
  )
}

// ─── «Динамика с прошлого визита» (M1) ───────────────────────────────────────

/**
 * Side-by-side current vs prior reading for each whitelisted key metric that
 * has at least two values on file. Source signal is patient-uploaded history
 * — a row is rendered only when the patient supplied a prior reading. Empty
 * state surfaces «Прошлых результатов нет» so the doctor can ask the patient
 * to upload them at the visit.
 */
export function DeltaSinceLastVisitBlock({ deltas }: { deltas: MetricDelta[] }) {
  if (deltas.length === 0) {
    return (
      <BlockShell
        tone="slate"
        eyebrow="Динамика с прошлого визита"
        eyebrowIcon={<TrendingUp size={14} strokeWidth={2.4} />}
      >
        <p className="text-body text-ink-muted leading-relaxed">
          Прошлых результатов нет — пациент пока не загрузил историю анализов.
        </p>
      </BlockShell>
    )
  }
  return (
    <BlockShell
      eyebrow="Динамика с прошлого визита"
      eyebrowIcon={<TrendingUp size={12} strokeWidth={2.4} />}
      counter={deltas.length}
      hint="Сравнение с прошлой загрузкой пациента."
    >
      <ul className="flex flex-col gap-2">
        {deltas.map((d) => (
          <li
            key={d.field}
            className="grid grid-cols-[120px_1fr_auto] items-center gap-3 rounded-2xl bg-surface-sunken px-4 py-3"
          >
            <p className="text-body font-bold text-ink-strong">{d.field}</p>
            <div className="flex items-center gap-2 text-caption text-ink-muted">
              <span className="font-data text-ink">
                {formatNumeric(d.previous.value, d.unit)}
              </span>
              <span className="text-[11px] uppercase tracking-caps">
                {formatDateCompact(d.previous.measuredAt)}
              </span>
              <ArrowRight size={12} className="text-ink-muted" strokeWidth={2} />
              <span className="font-data font-bold text-ink-strong">
                {formatNumeric(d.current.value, d.unit)}
              </span>
              <span className="text-[11px] uppercase tracking-caps">
                {formatDateCompact(d.current.measuredAt)}
              </span>
            </div>
            <DeltaPill delta={d.delta} unit={d.unit} trend={d.trend} />
          </li>
        ))}
      </ul>
    </BlockShell>
  )
}

function formatNumeric(value: number, unit: string | null): string {
  const v = Number.isInteger(value) ? value.toString() : value.toFixed(1)
  return unit ? `${v} ${unit}` : v
}

function DeltaPill({
  delta,
  unit,
  trend,
}: {
  delta: number
  unit: string | null
  trend: MetricDelta['trend']
}) {
  const sign = delta > 0 ? '+' : ''
  const value = `${sign}${delta.toFixed(1)}${unit ? ' ' + unit : ''}`
  const tone =
    trend === 'improved'
      ? 'bg-emerald-50 text-emerald-700'
      : trend === 'worsened'
      ? 'bg-amber-50 text-amber-700'
      : 'bg-slate-100 text-ink-muted'
  const Icon =
    trend === 'flat'
      ? ArrowRight
      : delta < 0
      ? ArrowDownRight
      : ArrowUpRight
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-bold font-data ${tone}`}
    >
      <Icon size={12} strokeWidth={2.4} />
      {value}
    </span>
  )
}

// ─── Critical-lab banner (M2) ────────────────────────────────────────────────

/**
 * Top-of-record signal for values that crossed conservative critical
 * thresholds. Non-alarmist by design — frames the readings as «обратите
 * внимание» rather than «опасно». Renders nothing when there are no
 * critical readings, so it is invisible on the canonical demo flow (p2)
 * and fires only on patients like Андрей Волков (p4).
 */
export function CriticalLabBanner({ labs }: { labs: CriticalLab[] }) {
  if (labs.length === 0) return null
  return (
    <section
      role="status"
      aria-label="Критические показатели"
      className="rounded-2xl border border-rose-200 bg-rose-50/70 px-5 py-4"
    >
      <div className="flex items-start gap-3">
        <Siren
          size={18}
          strokeWidth={2.2}
          className="text-rose-600 mt-0.5 flex-shrink-0"
        />
        <div className="min-w-0 flex-1">
          <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-caps text-rose-700">
            Критические значения
          </p>
          <p className="text-body text-ink-strong leading-snug mt-1">
            У пациента {labs.length === 1 ? 'показатель' : 'показатели'} за
            пределами безопасного диапазона. Стоит обсудить в первую очередь.
          </p>
          <ul className="mt-3 flex flex-col gap-1.5">
            {labs.map((l) => (
              <li
                key={`${l.analysisId}-${l.field}`}
                className="flex items-baseline justify-between gap-3 rounded-xl bg-white/70 px-3 py-2"
              >
                <span className="text-body font-bold text-ink-strong">
                  {l.field}{' '}
                  <span className="font-data text-rose-700">{l.display}</span>
                </span>
                <span className="text-caption text-ink-muted">
                  {l.reason}
                  {l.ref ? ` · норма ${l.ref}` : ''}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-caption text-ink-muted mt-2.5 leading-snug">
            Это подсказка системы — итоговая оценка за врачом.
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── Shared shell ────────────────────────────────────────────────────────────

type BlockTone = 'default' | 'amber' | 'rose' | 'blue' | 'slate' | 'vasily'

const TONE_STYLES: Record<
  BlockTone,
  {
    /** Icon chip background + foreground. */
    chip: string
    /** Eyebrow label color. */
    eyebrow: string
    /** Counter pill background + foreground. */
    counter: string
    /** Left accent rail color. */
    rail: string
  }
> = {
  default: {
    chip: 'bg-slate-100 text-ink-muted',
    eyebrow: 'text-ink-muted',
    counter: 'bg-slate-100 text-ink-muted',
    rail: 'bg-slate-200',
  },
  amber: {
    chip: 'bg-amber-100 text-amber-700',
    eyebrow: 'text-amber-800',
    counter: 'bg-amber-100 text-amber-700',
    rail: 'bg-amber-300',
  },
  rose: {
    chip: 'bg-rose-100 text-rose-700',
    eyebrow: 'text-rose-800',
    counter: 'bg-rose-100 text-rose-700',
    rail: 'bg-rose-300',
  },
  blue: {
    chip: 'bg-cyan-100 text-cyan-700',
    eyebrow: 'text-cyan-800',
    counter: 'bg-cyan-100 text-cyan-700',
    rail: 'bg-cyan-300',
  },
  slate: {
    chip: 'bg-slate-100 text-slate-600',
    eyebrow: 'text-slate-700',
    counter: 'bg-slate-100 text-slate-600',
    rail: 'bg-slate-200',
  },
  vasily: {
    chip: 'bg-cyan-50 text-cyan-700',
    eyebrow: 'text-cyan-800',
    counter: 'bg-cyan-100 text-cyan-700',
    rail: 'bg-cyan-300',
  },
}

function BlockShell({
  id,
  eyebrow,
  eyebrowIcon,
  hint,
  action,
  counter,
  tone = 'default',
  leading,
  children,
}: {
  id?: string
  eyebrow: string
  eyebrowIcon?: React.ReactNode
  hint?: string
  action?: { label: string; onClick: () => void }
  /** Numeric counter rendered next to the eyebrow (e.g. number of gaps). */
  counter?: number
  /** Visual tone — drives chip, eyebrow, counter, and accent rail colors. */
  tone?: BlockTone
  /** Custom leading visual that replaces the icon chip (e.g. Vasily mascot). */
  leading?: React.ReactNode
  children: React.ReactNode
}) {
  const t = TONE_STYLES[tone]
  return (
    <section
      id={id}
      className="relative flex gap-4 rounded-2xl bg-surface p-5 shadow-[inset_0_0_0_1.5px_var(--slate-100)]"
    >
      <div
        aria-hidden
        className={`absolute left-0 top-5 bottom-5 w-1 rounded-r-full ${t.rail}`}
      />
      <div className="flex-shrink-0">
        {leading ?? (
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl ${t.chip}`}
          >
            {eyebrowIcon}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p
              className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-caps ${t.eyebrow}`}
            >
              {eyebrow}
              {counter != null && counter > 0 && (
                <span
                  className={`ml-1 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1.5 text-[11px] font-bold tabular-nums ${t.counter}`}
                >
                  {counter}
                </span>
              )}
            </p>
            {hint && (
              <p className="text-caption text-ink-muted leading-snug mt-1">
                {hint}
              </p>
            )}
          </div>
          {action && (
            <button
              onClick={action.onClick}
              className="flex-shrink-0 text-[12px] font-bold text-cyan-600 hover:text-cyan-700"
            >
              {action.label}
            </button>
          )}
        </div>
        {children}
      </div>
    </section>
  )
}
