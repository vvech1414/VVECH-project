import { useMemo, useState } from 'react'
import {
  Send,
  Check,
  Clock,
  Eye,
  Search,
  ChevronDown,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Minus,
} from 'lucide-react'
import Button from '../primitives/Button'
import StatusBadge from '../primitives/StatusBadge'
import { acknowledgeAnalysis } from '../../store/actions'
import { formatDateShort, formatDateCompact } from '../../lib/formatters'
import {
  ANALYSIS_TYPE_LABEL,
  PERIOD_FILTERS,
  PLAN_STATUS_LABEL,
} from './doctorConstants'
import { readingsFromAnalysis } from '../../store/doctorSelectors'
import type {
  Analysis,
  DoctorRequest,
  PlanItem,
  PlanItemStatus,
} from '../../store/types'

/**
 * Doctor analyses workspace — JTBD-led IA.
 *
 * 1. «Ждут вашего решения» — pending review inbox (primary work surface).
 * 2. «Активные запросы» — outbound prep requests with progress.
 * 3. «История по показателям» — lab-type-grouped lookup.
 *
 * The screen leads with the doctor's most frequent action (accept new uploads),
 * so the spine of the screen reflects work to do, not chronology.
 */
export default function AnalysesWorkspace({
  analyses,
  planItems,
  requests,
  onOpenAnalysis,
  onCompose,
}: {
  analyses: Analysis[]
  planItems: PlanItem[]
  requests: DoctorRequest[]
  onOpenAnalysis: (a: Analysis) => void
  onCompose: () => void
}) {
  const planByAnalysisId = useMemo(() => {
    const m = new Map<string, PlanItem>()
    for (const p of planItems) {
      if (p.linkedAnalysisId) m.set(p.linkedAnalysisId, p)
    }
    return m
  }, [planItems])

  const pending = useMemo(
    () =>
      analyses
        .filter((a) => a.status === 'uploaded')
        .slice()
        .sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1)),
    [analyses],
  )

  const activeRequests = useMemo(
    () => requests.slice().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [requests],
  )

  return (
    <div className="flex flex-col gap-8">
      <WorkspaceHeader
        pendingCount={pending.length}
        activeRequests={activeRequests}
        planItems={planItems}
        analyses={analyses}
        onCompose={onCompose}
      />

      <PendingBand
        pending={pending}
        planByAnalysisId={planByAnalysisId}
        onOpenAnalysis={onOpenAnalysis}
      />

      <ActiveRequestsBand
        requests={activeRequests}
        planItems={planItems}
        analyses={analyses}
        onOpenAnalysis={onOpenAnalysis}
        onCompose={onCompose}
      />

      <HistoryByLabBand analyses={analyses} onOpenAnalysis={onOpenAnalysis} />
    </div>
  )
}

// ─── Header strip ────────────────────────────────────────────────────────────

function WorkspaceHeader({
  pendingCount,
  activeRequests,
  planItems,
  analyses,
  onCompose,
}: {
  pendingCount: number
  activeRequests: DoctorRequest[]
  planItems: PlanItem[]
  analyses: Analysis[]
  onCompose: () => void
}) {
  const primaryRequest = activeRequests[0]
  const itemsForPrimary = primaryRequest
    ? planItems.filter((p) => p.requestId === primaryRequest.id)
    : []
  const accepted = itemsForPrimary.filter(
    (p) => effectiveStatus(p, analyses) === 'acknowledged',
  ).length

  return (
    <header className="flex items-start justify-between gap-4 flex-wrap">
      <div className="flex flex-col gap-1">
        <p className="text-[10px] font-bold uppercase tracking-caps text-ink-muted">
          Анализы
        </p>
        <h2 className="text-h2-ui font-bold text-ink-strong leading-tight">
          {primaryRequest
            ? primaryRequest.title
            : 'Анализы пациента'}
        </h2>
        <p className="text-caption text-ink-muted leading-relaxed">
          {buildHeaderSubtitle({
            primaryRequest,
            itemsTotal: itemsForPrimary.length,
            accepted,
            pendingCount,
          })}
        </p>
      </div>
      <Button
        icon={<Send size={16} strokeWidth={2.4} />}
        onClick={onCompose}
        variant="secondary"
      >
        Отправить запрос
      </Button>
    </header>
  )
}

function buildHeaderSubtitle({
  primaryRequest,
  itemsTotal,
  accepted,
  pendingCount,
}: {
  primaryRequest: DoctorRequest | undefined
  itemsTotal: number
  accepted: number
  pendingCount: number
}): string {
  const parts: string[] = []
  if (primaryRequest && itemsTotal > 0) {
    parts.push(`Принято ${accepted} из ${itemsTotal}`)
  }
  if (pendingCount > 0) {
    parts.push(
      `${pendingCount} ${pluralize(pendingCount, [
        'результат ждёт',
        'результата ждут',
        'результатов ждут',
      ])} вашего решения`,
    )
  } else {
    parts.push('новых результатов на проверку нет')
  }
  return parts.join(' · ')
}

// ─── Band 1: Pending decisions ───────────────────────────────────────────────

function PendingBand({
  pending,
  planByAnalysisId,
  onOpenAnalysis,
}: {
  pending: Analysis[]
  planByAnalysisId: Map<string, PlanItem>
  onOpenAnalysis: (a: Analysis) => void
}) {
  return (
    <section className="flex flex-col gap-3">
      <BandHeading
        title="Ждут вашего решения"
        helper="Новые загрузки пациента — примите или откройте оригинал."
        count={pending.length}
        tone={pending.length > 0 ? 'attention' : 'neutral'}
      />
      {pending.length === 0 ? (
        <EmptyBand
          title="Все присланные анализы приняты"
          body="Когда пациент загрузит новый результат, он появится здесь."
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {pending.map((a) => (
            <PendingRow
              key={a.id}
              analysis={a}
              planItem={planByAnalysisId.get(a.id)}
              onOpen={() => onOpenAnalysis(a)}
              onAccept={() => acknowledgeAnalysis(a.id)}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

function PendingRow({
  analysis,
  planItem,
  onOpen,
  onAccept,
}: {
  analysis: Analysis
  planItem: PlanItem | undefined
  onOpen: () => void
  onAccept: () => void
}) {
  const reading = readingsFromAnalysis(analysis)[0]
  const lowConf = !!reading?.lowConfidence
  return (
    <li className="rounded-2xl bg-surface p-4 shadow-[inset_0_0_0_1.5px_var(--slate-100)]">
      <div className="flex items-start gap-4 flex-wrap md:flex-nowrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <p className="text-[14px] font-bold text-ink-strong leading-tight">
              {analysis.label}
            </p>
            {planItem ? (
              <span className="text-[10px] font-bold uppercase tracking-caps text-cyan-600 bg-cyan-50 rounded-full px-2 py-0.5">
                По запросу
              </span>
            ) : (
              <span className="text-[10px] font-bold uppercase tracking-caps text-ink-muted bg-surface-sunken rounded-full px-2 py-0.5">
                От пациента
              </span>
            )}
            {lowConf && (
              <span
                className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-caps text-amber-700 bg-amber-50 rounded-full px-2 py-0.5"
                title="Низкая уверенность OCR — стоит свериться с оригиналом"
              >
                <AlertTriangle size={11} strokeWidth={2.4} /> OCR
              </span>
            )}
          </div>
          <ValueLine analysis={analysis} />
          <p className="text-caption text-ink-muted mt-1">
            Загружено {formatDateShort(analysis.uploadedAt)}
            {planItem?.reason ? ` · ${planItem.reason}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="md"
            icon={<Eye size={14} strokeWidth={2.4} />}
            onClick={onOpen}
          >
            Открыть оригинал
          </Button>
          <Button
            size="md"
            icon={<Check size={14} strokeWidth={2.5} />}
            onClick={onAccept}
          >
            Принять
          </Button>
        </div>
      </div>
    </li>
  )
}

/**
 * Compact value + reference + delta vs previous reading. Shows the headline
 * value the doctor is deciding on without opening the drawer.
 */
function ValueLine({ analysis }: { analysis: Analysis }) {
  const readings = readingsFromAnalysis(analysis)
  if (readings.length === 0) {
    return (
      <p className="text-caption text-ink-muted">
        Не удалось распознать значения — откройте оригинал.
      </p>
    )
  }
  return (
    <div className="flex items-baseline gap-3 flex-wrap">
      {readings.map((r) => (
        <div key={r.field} className="flex items-baseline gap-1.5">
          <span className="text-caption text-ink-muted font-bold uppercase tracking-caps">
            {r.field}
          </span>
          <span
            className={`text-[15px] font-bold font-data ${
              r.range === 'above' || r.range === 'below'
                ? 'text-amber-700'
                : 'text-ink-strong'
            }`}
          >
            {r.display}
          </span>
          {r.ref && (
            <span className="text-caption text-ink-muted font-data">
              {r.ref}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Band 2: Active requests ─────────────────────────────────────────────────

function ActiveRequestsBand({
  requests,
  planItems,
  analyses,
  onOpenAnalysis,
  onCompose,
}: {
  requests: DoctorRequest[]
  planItems: PlanItem[]
  analyses: Analysis[]
  onOpenAnalysis: (a: Analysis) => void
  onCompose: () => void
}) {
  return (
    <section className="flex flex-col gap-3">
      <BandHeading
        title="Активные запросы"
        helper="Что вы попросили пациента подготовить и в каком оно статусе."
        count={requests.length}
      />
      {requests.length === 0 ? (
        <div className="rounded-2xl bg-surface-sunken p-6 flex flex-col items-start gap-2">
          <p className="text-[15px] font-bold text-ink-strong">
            Запросов пока нет
          </p>
          <p className="text-body text-ink-muted leading-relaxed">
            Сформируйте список анализов до приёма — пациент увидит запрос в
            приложении и сможет загрузить результаты.
          </p>
          <Button
            variant="secondary"
            icon={<Send size={16} strokeWidth={2.4} />}
            onClick={onCompose}
            className="mt-2"
          >
            Сформировать запрос
          </Button>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {requests.map((r) => {
            const items = planItems.filter((p) => p.requestId === r.id)
            return (
              <RequestCard
                key={r.id}
                request={r}
                items={items}
                analyses={analyses}
                onOpenAnalysis={onOpenAnalysis}
              />
            )
          })}
        </ul>
      )}
    </section>
  )
}

function RequestCard({
  request,
  items,
  analyses,
  onOpenAnalysis,
}: {
  request: DoctorRequest
  items: PlanItem[]
  analyses: Analysis[]
  onOpenAnalysis: (a: Analysis) => void
}) {
  const [expandAccepted, setExpandAccepted] = useState(false)

  const enriched = items.map((p) => ({
    item: p,
    status: effectiveStatus(p, analyses),
    analysis: p.linkedAnalysisId
      ? analyses.find((a) => a.id === p.linkedAnalysisId)
      : undefined,
  }))
  const open = enriched.filter((e) => e.status !== 'acknowledged')
  const accepted = enriched.filter((e) => e.status === 'acknowledged')
  const total = enriched.length

  return (
    <li className="rounded-2xl bg-surface p-5 shadow-[inset_0_0_0_1.5px_var(--slate-100)]">
      <header className="flex items-start justify-between gap-3 mb-4 flex-wrap">
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-body-lg font-bold text-ink-strong leading-tight">
              {request.title}
            </p>
            {!request.seenByPatient ? (
              <StatusBadge tone="warning">Уведомление не открыто</StatusBadge>
            ) : (
              <StatusBadge tone="success">Уведомление прочитано</StatusBadge>
            )}
          </div>
          <p className="text-caption text-ink-muted">
            Отправлено {formatDateShort(request.createdAt)}
            {' · '}
            Принято {accepted.length} из {total}
          </p>
          {request.body && (
            <p className="text-caption text-ink leading-relaxed mt-1">
              {request.body}
            </p>
          )}
        </div>
      </header>

      <ul className="flex flex-col gap-2">
        {open.map((e) => (
          <PlanItemRow
            key={e.item.id}
            item={e.item}
            status={e.status}
            analysis={e.analysis}
            onOpenAnalysis={onOpenAnalysis}
          />
        ))}
        {accepted.length > 0 && (
          <li>
            <button
              onClick={() => setExpandAccepted((v) => !v)}
              className="w-full text-left flex items-center gap-2 text-[11px] font-bold uppercase tracking-caps text-ink-muted hover:text-ink py-2"
            >
              <ChevronDown
                size={14}
                strokeWidth={2.4}
                className={`transition-transform ${
                  expandAccepted ? '' : '-rotate-90'
                }`}
              />
              Принято · {accepted.length}
            </button>
            {expandAccepted && (
              <ul className="flex flex-col gap-2 mt-1">
                {accepted.map((e) => (
                  <PlanItemRow
                    key={e.item.id}
                    item={e.item}
                    status={e.status}
                    analysis={e.analysis}
                    onOpenAnalysis={onOpenAnalysis}
                  />
                ))}
              </ul>
            )}
          </li>
        )}
      </ul>
    </li>
  )
}

function PlanItemRow({
  item,
  status,
  analysis,
  onOpenAnalysis,
}: {
  item: PlanItem
  status: PlanItemStatus
  analysis: Analysis | undefined
  onOpenAnalysis: (a: Analysis) => void
}) {
  const tone =
    status === 'acknowledged'
      ? 'success'
      : status === 'uploaded'
      ? 'info'
      : 'warning'
  return (
    <li className="rounded-xl bg-surface-sunken p-3 flex items-center gap-3">
      <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-[inset_0_0_0_1.5px_var(--slate-200)]">
        {status === 'acknowledged' ? (
          <Check size={16} strokeWidth={2.5} className="text-emerald-600" />
        ) : status === 'uploaded' ? (
          <Eye size={16} strokeWidth={2} className="text-cyan-500" />
        ) : (
          <Clock size={16} strokeWidth={2} className="text-amber-600" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold text-ink-strong truncate">
          {item.label}
        </p>
        {item.reason && (
          <p className="text-caption text-ink-muted leading-snug truncate">
            {item.reason}
          </p>
        )}
        <p className="text-[10px] font-bold uppercase tracking-caps text-ink-muted mt-1">
          {ANALYSIS_TYPE_LABEL[item.analysisType]}
          {item.dueDate ? ` · до ${formatDateShort(item.dueDate)}` : ''}
        </p>
      </div>
      <StatusBadge tone={tone}>{PLAN_STATUS_LABEL[status]}</StatusBadge>
      {analysis && (
        <Button
          variant="ghost"
          size="md"
          icon={<Eye size={13} strokeWidth={2.4} />}
          onClick={() => onOpenAnalysis(analysis)}
        >
          Открыть
        </Button>
      )}
    </li>
  )
}

// ─── Band 3: History grouped by lab type ─────────────────────────────────────

interface FieldGroup {
  field: string
  unit: string | null
  ref: string | null
  /** Newest-first list of readings for this field. */
  readings: Array<{
    analysis: Analysis
    display: string
    numericValue: number | null
    measuredAt: string
    range: 'in' | 'above' | 'below' | 'unknown'
  }>
}

function HistoryByLabBand({
  analyses,
  onOpenAnalysis,
}: {
  analyses: Analysis[]
  onOpenAnalysis: (a: Analysis) => void
}) {
  const [period, setPeriod] = useState('all')
  const [query, setQuery] = useState('')

  const groups = useMemo<FieldGroup[]>(() => {
    const cutoff = (() => {
      const p = PERIOD_FILTERS.find((x) => x.id === period)
      if (!p?.days) return null
      const d = new Date()
      d.setDate(d.getDate() - p.days)
      return d.toISOString()
    })()

    const map = new Map<string, FieldGroup>()
    for (const a of analyses) {
      const dateRef = a.date || a.uploadedAt
      if (cutoff && dateRef < cutoff) continue
      for (const r of readingsFromAnalysis(a)) {
        const key = r.field
        const g = map.get(key) ?? {
          field: r.field,
          unit: r.unit,
          ref: r.ref,
          readings: [],
        }
        g.readings.push({
          analysis: a,
          display: r.display,
          numericValue: r.numericValue,
          measuredAt: r.measuredAt,
          range: r.range,
        })
        // Keep latest non-null ref / unit.
        if (r.unit) g.unit = r.unit
        if (r.ref) g.ref = r.ref
        map.set(key, g)
      }
    }

    const q = query.trim().toLowerCase()
    const out = Array.from(map.values())
      .map((g) => ({
        ...g,
        readings: g.readings
          .slice()
          .sort((x, y) => (x.measuredAt < y.measuredAt ? 1 : -1)),
      }))
      .filter((g) =>
        q
          ? g.field.toLowerCase().includes(q) ||
            g.readings.some((r) =>
              r.analysis.label.toLowerCase().includes(q),
            )
          : true,
      )
      .sort((a, b) => {
        // Most recent reading first.
        const am = a.readings[0]?.measuredAt ?? ''
        const bm = b.readings[0]?.measuredAt ?? ''
        if (am === bm) return a.field < b.field ? -1 : 1
        return am < bm ? 1 : -1
      })
    return out
  }, [analyses, period, query])

  return (
    <section className="flex flex-col gap-3">
      <BandHeading
        title="История по показателям"
        helper="Сгруппировано по показателю — удобно сравнить новое значение с прошлыми."
        count={groups.length}
      />

      <div className="flex items-center gap-3 flex-wrap">
        <div
          className="flex flex-wrap gap-1.5"
          role="tablist"
          aria-label="Фильтр периода"
        >
          {PERIOD_FILTERS.map((p) => {
            const active = p.id === period
            return (
              <button
                key={p.id}
                role="tab"
                aria-selected={active}
                onClick={() => setPeriod(p.id)}
                className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-caps transition-colors ${
                  active
                    ? 'bg-cyan-500 text-white'
                    : 'bg-surface text-ink-muted shadow-[inset_0_0_0_1.5px_var(--slate-200)] hover:text-ink'
                }`}
              >
                {p.label}
              </button>
            )
          })}
        </div>
        <div className="relative ml-auto">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Найти показатель"
            aria-label="Поиск по истории анализов"
            className="w-[260px] rounded-xl bg-surface pl-9 pr-4 py-2 text-caption shadow-[inset_0_0_0_1.5px_var(--slate-200)] outline-none focus:shadow-[inset_0_0_0_1.5px_var(--blue-600)]"
          />
        </div>
      </div>

      {groups.length === 0 ? (
        <EmptyBand
          title="История пуста"
          body="Когда пациент загрузит результаты, они появятся здесь — сгруппированные по показателю."
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {groups.map((g) => (
            <FieldGroupCard
              key={g.field}
              group={g}
              onOpenAnalysis={onOpenAnalysis}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

function FieldGroupCard({
  group,
  onOpenAnalysis,
}: {
  group: FieldGroup
  onOpenAnalysis: (a: Analysis) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const latest = group.readings[0]
  const prev = group.readings[1]
  const trend = describeTrend(latest, prev)

  return (
    <li className="rounded-2xl bg-surface p-4 shadow-[inset_0_0_0_1.5px_var(--slate-100)]">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left flex items-center gap-4"
        aria-expanded={expanded}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <p className="text-[14px] font-bold text-ink-strong">
              {group.field}
            </p>
            <span className="text-caption text-ink-muted">
              {group.readings.length}{' '}
              {pluralize(group.readings.length, [
                'результат',
                'результата',
                'результатов',
              ])}
            </span>
            {group.ref && (
              <span className="text-caption text-ink-muted font-data">
                · реф. {group.ref}
              </span>
            )}
          </div>
          {latest && (
            <div className="flex items-baseline gap-2 mt-1 flex-wrap">
              <span
                className={`text-[18px] font-bold font-data leading-none ${
                  latest.range === 'above' || latest.range === 'below'
                    ? 'text-amber-700'
                    : 'text-ink-strong'
                }`}
              >
                {latest.display}
              </span>
              <span className="text-caption text-ink-muted font-data">
                {formatDateCompact(latest.measuredAt)}
              </span>
              {trend && <TrendBadge trend={trend} />}
            </div>
          )}
        </div>
        <Sparkline readings={group.readings} />
        <ChevronDown
          size={18}
          strokeWidth={2}
          className={`text-ink-muted transition-transform ${
            expanded ? '' : '-rotate-90'
          }`}
        />
      </button>

      {expanded && (
        <ul className="flex flex-col gap-1.5 mt-3 pt-3 shadow-[inset_0_1.5px_0_0_var(--slate-100)]">
          {group.readings.map((r, i) => (
            <li key={`${r.analysis.id}-${i}`}>
              <button
                onClick={() => onOpenAnalysis(r.analysis)}
                className="w-full text-left rounded-xl bg-surface-sunken px-3 py-2 flex items-center gap-3 hover:bg-cyan-50/50 transition-colors"
              >
                <span className="text-caption text-ink-muted font-data w-20 flex-shrink-0">
                  {formatDateCompact(r.measuredAt)}
                </span>
                <span
                  className={`text-[13px] font-bold font-data flex-shrink-0 ${
                    r.range === 'above' || r.range === 'below'
                      ? 'text-amber-700'
                      : 'text-ink-strong'
                  }`}
                >
                  {r.display}
                </span>
                <span className="text-caption text-ink-muted truncate">
                  {r.analysis.label}
                </span>
                <Eye
                  size={13}
                  strokeWidth={2.4}
                  className="text-cyan-500 ml-auto flex-shrink-0"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

function Sparkline({ readings }: { readings: FieldGroup['readings'] }) {
  const numeric = readings
    .filter((r) => r.numericValue != null)
    .slice()
    .sort((a, b) => (a.measuredAt < b.measuredAt ? -1 : 1))
  if (numeric.length < 2) {
    return <span className="w-[80px] flex-shrink-0" aria-hidden />
  }
  const values = numeric.map((r) => r.numericValue as number)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const w = 80
  const h = 28
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * (w - 4) + 2
      const y = h - 2 - ((v - min) / span) * (h - 4)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
  const last = numeric[numeric.length - 1]
  const lastX = w - 2
  const lastY = h - 2 - ((last.numericValue! - min) / span) * (h - 4)
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="flex-shrink-0"
      aria-hidden
    >
      <polyline
        points={pts}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        className="text-cyan-500"
      />
      <circle
        cx={lastX}
        cy={lastY}
        r={2.5}
        className={
          last.range === 'above' || last.range === 'below'
            ? 'fill-amber-600'
            : 'fill-cyan-500'
        }
      />
    </svg>
  )
}

// ─── Shared tiny helpers ─────────────────────────────────────────────────────

function BandHeading({
  title,
  helper,
  count,
  tone = 'neutral',
}: {
  title: string
  helper?: string
  count?: number
  tone?: 'neutral' | 'attention'
}) {
  return (
    <div className="flex items-baseline gap-3 flex-wrap">
      <h3 className="text-h3-ui font-bold text-ink-strong leading-tight">
        {title}
      </h3>
      {typeof count === 'number' && (
        <span
          className={`text-[11px] font-bold uppercase tracking-caps rounded-full px-2 py-0.5 ${
            tone === 'attention' && count > 0
              ? 'bg-amber-100 text-amber-800'
              : 'bg-surface-sunken text-ink-muted'
          }`}
        >
          {count}
        </span>
      )}
      {helper && (
        <p className="text-caption text-ink-muted basis-full leading-relaxed">
          {helper}
        </p>
      )}
    </div>
  )
}

function EmptyBand({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl bg-surface-sunken p-6 flex flex-col items-start gap-2">
      <p className="text-[15px] font-bold text-ink-strong">{title}</p>
      <p className="text-body text-ink-muted leading-relaxed">{body}</p>
    </div>
  )
}

function TrendBadge({
  trend,
}: {
  trend: { direction: 'up' | 'down' | 'flat'; delta: string; tone: 'good' | 'bad' | 'neutral' }
}) {
  const { direction, delta, tone } = trend
  const Icon = direction === 'up' ? ArrowUp : direction === 'down' ? ArrowDown : Minus
  const colorClass =
    tone === 'good'
      ? 'text-emerald-700 bg-emerald-50'
      : tone === 'bad'
      ? 'text-amber-700 bg-amber-50'
      : 'text-ink-muted bg-surface-sunken'
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[11px] font-bold font-data rounded-full px-1.5 py-0.5 ${colorClass}`}
    >
      <Icon size={10} strokeWidth={2.6} />
      {delta}
    </span>
  )
}

function describeTrend(
  latest: FieldGroup['readings'][number] | undefined,
  prev: FieldGroup['readings'][number] | undefined,
):
  | { direction: 'up' | 'down' | 'flat'; delta: string; tone: 'good' | 'bad' | 'neutral' }
  | null {
  if (!latest || !prev) return null
  if (latest.numericValue == null || prev.numericValue == null) return null
  const diff = +(latest.numericValue - prev.numericValue).toFixed(1)
  if (diff === 0) {
    return { direction: 'flat', delta: '0', tone: 'neutral' }
  }
  const direction: 'up' | 'down' = diff > 0 ? 'up' : 'down'
  // Tone vs reference: moving toward `in` is good; further from is bad.
  let tone: 'good' | 'bad' | 'neutral' = 'neutral'
  if (latest.range === 'in' && prev.range !== 'in') tone = 'good'
  else if (latest.range !== 'in' && prev.range === 'in') tone = 'bad'
  else if (latest.range === 'above') tone = diff < 0 ? 'good' : 'bad'
  else if (latest.range === 'below') tone = diff > 0 ? 'good' : 'bad'
  const sign = diff > 0 ? '+' : ''
  return { direction, delta: `${sign}${diff}`, tone }
}

function effectiveStatus(p: PlanItem, analyses: Analysis[]): PlanItemStatus {
  if (!p.linkedAnalysisId) return p.status
  const a = analyses.find((x) => x.id === p.linkedAnalysisId)
  if (!a) return p.status
  // Analysis is the source of truth for accept state — handles seeded
  // demos where planItem.status hasn't been mirrored back from the analysis.
  if (a.status === 'acknowledged') return 'acknowledged'
  if (a.status === 'uploaded' && p.status === 'assigned') return 'uploaded'
  return p.status
}

function pluralize(n: number, [one, few, many]: [string, string, string]): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 14) return many
  if (mod10 === 1) return one
  if (mod10 >= 2 && mod10 <= 4) return few
  return many
}
