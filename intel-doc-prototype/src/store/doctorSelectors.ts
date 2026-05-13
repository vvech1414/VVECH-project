import type {
  Analysis,
  AnalysisType,
  Complaint,
  ID,
  InteldocState,
  OcrFieldMeta,
} from './types'

/**
 * Doctor-cockpit-specific read-side derivations. Pure functions over state
 * — safe to call from `useInteldoc` selectors. None of these mutate or
 * dispatch.
 */

// ─── Prep effort ─────────────────────────────────────────────────────────────

export interface PrepMeta {
  preparedAt: string | null
  timeSpentMin: number | null
  docsCount: number
  questionsCount: number
}

export function selectPrepMeta(s: InteldocState, patientId: ID): PrepMeta {
  const patient = s.patients.find((p) => p.id === patientId)
  return {
    preparedAt: patient?.prepCompletedAt ?? null,
    timeSpentMin: patient?.prepTimeSpentMin ?? null,
    docsCount: s.documents.filter((d) => d.patientId === patientId).length,
    questionsCount: s.complaints.filter((c) => c.patientId === patientId)
      .length,
  }
}

// ─── Ranked questions ────────────────────────────────────────────────────────

/**
 * Top-N patient complaints ordered by patient-set priority (1 = highest),
 * with newest-first tiebreak. Fallback when no priorities are set: pure
 * recency. Used by «Что важно пациенту» on Сводка.
 */
export function selectRankedQuestions(
  s: InteldocState,
  patientId: ID,
  limit = 3,
): Complaint[] {
  const all = s.complaints.filter((c) => c.patientId === patientId)
  const sorted = all.slice().sort((a, b) => {
    const ap = a.priority ?? Number.POSITIVE_INFINITY
    const bp = b.priority ?? Number.POSITIVE_INFINITY
    if (ap !== bp) return ap - bp
    return a.createdAt < b.createdAt ? 1 : -1
  })
  return sorted.slice(0, limit)
}

// ─── Reference range / metric flags ──────────────────────────────────────────

export type RangeFlag = 'in' | 'above' | 'below' | 'unknown'

export interface MetricReading {
  /** e.g. 'HbA1c'. */
  field: string
  /** Display value as recognized, e.g. '7.8 %'. */
  display: string
  numericValue: number | null
  unit: string | null
  /** Display-form reference, e.g. '< 6.5 %'. */
  ref: string | null
  range: RangeFlag
  lowConfidence: boolean
  /** ISO of the source analysis date (or upload). */
  measuredAt: string
  /** Source analysis id — used for drill-down. */
  analysisId: ID
  analysisLabel: string
  analysisType: AnalysisType
}

const NON_VALUE_FIELD = new Set(['дата', 'норма', 'date', 'reference'])

function classifyRange(meta: OcrFieldMeta | undefined): RangeFlag {
  if (!meta || meta.numericValue == null) return 'unknown'
  const { numericValue, refMin, refMax } = meta
  if (refMin != null && numericValue < refMin) return 'below'
  if (refMax != null && numericValue > refMax) return 'above'
  if (refMin != null || refMax != null) return 'in'
  return 'unknown'
}

/**
 * Flatten an analysis's OCR fields into doctor-facing metric readings.
 * Excludes structural fields like «дата» / «норма».
 */
export function readingsFromAnalysis(a: Analysis): MetricReading[] {
  const out: MetricReading[] = []
  for (const [field, raw] of Object.entries(a.ocrFields)) {
    if (NON_VALUE_FIELD.has(field.toLowerCase())) continue
    const meta = a.ocrFieldMeta?.[field]
    out.push({
      field,
      display: raw,
      numericValue: meta?.numericValue ?? null,
      unit: meta?.unit ?? null,
      ref: meta?.ref ?? a.ocrFields['норма'] ?? null,
      range: classifyRange(meta),
      lowConfidence: !!meta?.lowConfidence,
      measuredAt: a.date || a.uploadedAt,
      analysisId: a.id,
      analysisLabel: a.label,
      analysisType: a.type,
    })
  }
  return out
}

/**
 * Latest reading per metric field, taken across all analyses for a patient.
 * Newest-first by `measuredAt`. The doctor-side «Ключевые показатели»
 * grid renders this list, capped to the curated whitelist.
 */
export function selectLatestMetricsByField(
  s: InteldocState,
  patientId: ID,
): MetricReading[] {
  const byField = new Map<string, MetricReading>()
  const analyses = s.analyses.filter((a) => a.patientId === patientId)
  for (const a of analyses) {
    for (const r of readingsFromAnalysis(a)) {
      const prev = byField.get(r.field)
      if (!prev || prev.measuredAt < r.measuredAt) byField.set(r.field, r)
    }
  }
  return Array.from(byField.values()).sort((a, b) =>
    a.measuredAt < b.measuredAt ? 1 : -1,
  )
}

/**
 * Curated whitelist + ordering for the «Ключевые показатели» grid. Other
 * fields still appear in the analyses drawer / timeline.
 */
export const KEY_METRIC_ORDER = [
  'HbA1c',
  'Глюкоза',
  'Креатинин',
  'Холестерин',
  'ЛПНП',
  'ТТГ',
] as const

export function selectKeyMetrics(
  s: InteldocState,
  patientId: ID,
): MetricReading[] {
  const all = selectLatestMetricsByField(s, patientId)
  const idx = new Map(KEY_METRIC_ORDER.map((k, i) => [k, i]))
  return all
    .filter((r) => idx.has(r.field as (typeof KEY_METRIC_ORDER)[number]))
    .sort(
      (a, b) =>
        (idx.get(a.field as (typeof KEY_METRIC_ORDER)[number]) ?? 0) -
        (idx.get(b.field as (typeof KEY_METRIC_ORDER)[number]) ?? 0),
    )
}

export function selectOutOfRangeCount(
  s: InteldocState,
  patientId: ID,
): number {
  return selectLatestMetricsByField(s, patientId).filter(
    (r) => r.range === 'above' || r.range === 'below',
  ).length
}

// ─── «Что закрыть на визите» (visit gaps) ────────────────────────────────────

export type VisitGapKind =
  | 'plan-overdue'
  | 'plan-pending'
  | 'low-confidence-ocr'
  | 'doc-unstructured'

/**
 * Where the gap originated. `protocol` items come from the doctor's plan;
 * `patient-discovered` items come from the patient's own uploads or quality
 * issues on those uploads. The doctor surface uses this to tag rows so the
 * mix is legible at a glance.
 */
export type VisitGapSource = 'protocol' | 'patient-discovered'

export interface VisitGap {
  id: string
  kind: VisitGapKind
  source: VisitGapSource
  /** Primary one-line action / label («Микроальбумин не сдан»). */
  label: string
  /** Why it surfaces — one short helper line («просрочен план от 15 апр»). */
  subtext?: string
}

/**
 * Doctor-actionable gaps to address during the visit. Aggregates four sources:
 * overdue / still-assigned plan items, low-confidence OCR readings on labs,
 * and uploaded documents that did not structure cleanly. Used by «Что закрыть
 * на визите» on Обзор. Ordered by clinical priority: overdue plan items first,
 * then OCR concerns, then loose documents.
 */
export function selectVisitGaps(
  s: InteldocState,
  patientId: ID,
  now: Date = new Date(),
): VisitGap[] {
  const gaps: VisitGap[] = []

  for (const p of s.planItems.filter((pi) => pi.patientId === patientId)) {
    if (p.status === 'uploaded' || p.status === 'acknowledged') continue
    const overdue = p.dueDate ? new Date(p.dueDate) < now : false
    gaps.push({
      id: `plan-${p.id}`,
      kind: overdue ? 'plan-overdue' : 'plan-pending',
      source: 'protocol',
      label: `${p.label} — не сдан`,
      subtext: overdue ? 'просрочен план визита' : 'по плану ожидаем результат',
    })
  }

  for (const a of s.analyses.filter((an) => an.patientId === patientId)) {
    const meta = a.ocrFieldMeta ?? {}
    for (const [field, m] of Object.entries(meta)) {
      if (!m?.lowConfidence) continue
      gaps.push({
        id: `ocr-${a.id}-${field}`,
        kind: 'low-confidence-ocr',
        source: 'patient-discovered',
        label: `${field} — низкая уверенность OCR`,
        subtext: `«${a.label}» · стоит свериться с оригиналом`,
      })
    }
  }

  for (const d of s.documents.filter((dd) => dd.patientId === patientId)) {
    if (d.structureStatus === 'original-only') {
      gaps.push({
        id: `doc-${d.id}`,
        kind: 'doc-unstructured',
        source: 'patient-discovered',
        label: `${d.label} — не структурировано`,
        subtext: 'сохранён только оригинал, ручная сверка',
      })
    }
  }

  // Order: overdue protocol items first, remaining protocol next, then
  // patient-discovered. Inside each bucket, preserve insertion order.
  const rank = (g: VisitGap): number => {
    if (g.kind === 'plan-overdue') return 0
    if (g.source === 'protocol') return 1
    return 2
  }
  return gaps.sort((a, b) => rank(a) - rank(b))
}

// ─── Delta since last visit (M1) ─────────────────────────────────────────────

export interface MetricDelta {
  field: string
  unit: string | null
  /** Reference range string for the current reading. */
  ref: string | null
  current: {
    value: number
    display: string
    measuredAt: string
    range: RangeFlag
  }
  previous: {
    value: number
    display: string
    measuredAt: string
    range: RangeFlag
  }
  /** Signed numeric difference current − previous, rounded to 1 decimal. */
  delta: number
  /**
   * Direction of the change relative to the reference range.
   *  - `improved`: moved toward the reference range
   *  - `worsened`: moved further from the reference range
   *  - `flat`: |delta| below the «meaningful change» threshold
   */
  trend: 'improved' | 'worsened' | 'flat'
}

/** Minimal absolute change to be considered a meaningful delta, by metric. */
const DELTA_FLAT_THRESHOLD: Record<string, number> = {
  HbA1c: 0.2,
  Глюкоза: 0.3,
  Креатинин: 5,
  Холестерин: 0.2,
  ЛПНП: 0.2,
  ТТГ: 0.3,
}

/**
 * For each whitelisted key metric, compute the delta between the most recent
 * reading and the prior reading. Only metrics with at least two numeric
 * readings produce a row. Output is ordered by the same KEY_METRIC_ORDER as
 * the «Ключевые показатели» grid so the doctor can scan it as a column.
 */
export function selectDeltaSinceLastVisit(
  s: InteldocState,
  patientId: ID,
): MetricDelta[] {
  const idx = new Map(KEY_METRIC_ORDER.map((k, i) => [k, i]))
  const byField = new Map<string, MetricReading[]>()
  for (const a of s.analyses.filter((an) => an.patientId === patientId)) {
    for (const r of readingsFromAnalysis(a)) {
      if (!idx.has(r.field as (typeof KEY_METRIC_ORDER)[number])) continue
      if (r.numericValue == null) continue
      const list = byField.get(r.field) ?? []
      list.push(r)
      byField.set(r.field, list)
    }
  }

  const out: MetricDelta[] = []
  for (const [field, list] of byField) {
    if (list.length < 2) continue
    const sorted = list
      .slice()
      .sort((a, b) => (a.measuredAt < b.measuredAt ? 1 : -1))
    const cur = sorted[0]
    const prev = sorted[1]
    if (cur.numericValue == null || prev.numericValue == null) continue
    const delta = +(cur.numericValue - prev.numericValue).toFixed(1)
    const flatLimit = DELTA_FLAT_THRESHOLD[field] ?? 0.1
    let trend: MetricDelta['trend'] = 'flat'
    if (Math.abs(delta) >= flatLimit) {
      // Direction relative to the reference range. We use range flags as the
      // proxy: moving from `above`/`below` toward `in` is improvement.
      if (cur.range === 'in' && prev.range !== 'in') trend = 'improved'
      else if (cur.range !== 'in' && prev.range === 'in') trend = 'worsened'
      else if (cur.range === 'above') trend = delta < 0 ? 'improved' : 'worsened'
      else if (cur.range === 'below') trend = delta > 0 ? 'improved' : 'worsened'
      else trend = 'flat'
    }
    out.push({
      field,
      unit: cur.unit,
      ref: cur.ref,
      current: {
        value: cur.numericValue,
        display: cur.display,
        measuredAt: cur.measuredAt,
        range: cur.range,
      },
      previous: {
        value: prev.numericValue,
        display: prev.display,
        measuredAt: prev.measuredAt,
        range: prev.range,
      },
      delta,
      trend,
    })
  }
  out.sort(
    (a, b) =>
      (idx.get(a.field as (typeof KEY_METRIC_ORDER)[number]) ?? 0) -
      (idx.get(b.field as (typeof KEY_METRIC_ORDER)[number]) ?? 0),
  )
  return out
}

// ─── Critical labs (M2) ──────────────────────────────────────────────────────

export interface CriticalLab {
  field: string
  display: string
  ref: string | null
  measuredAt: string
  analysisId: ID
  analysisLabel: string
  /** Short, neutral phrase explaining why the value is flagged as critical. */
  reason: string
}

/**
 * Critical thresholds beyond which a value warrants surfacing a top-of-record
 * banner. Endocrinology-relevant only — kept conservative so the banner is
 * rare in the demo (fires on Андрей Волков, not on Сергей Волков). Values are
 * neutral signals, not alarms — the banner copy is non-alarmist by design.
 */
const CRITICAL_RULES: Array<{
  field: string
  test: (v: number) => boolean
  reason: string
}> = [
  {
    field: 'HbA1c',
    test: (v) => v >= 10,
    reason: 'выраженная гипергликемия за период',
  },
  {
    field: 'Глюкоза',
    test: (v) => v >= 13,
    reason: 'высокий уровень натощак',
  },
  {
    field: 'Креатинин',
    test: (v) => v >= 200,
    reason: 'значительно выше референса',
  },
]

export function selectCriticalLabs(
  s: InteldocState,
  patientId: ID,
): CriticalLab[] {
  const out: CriticalLab[] = []
  for (const r of selectLatestMetricsByField(s, patientId)) {
    if (r.numericValue == null) continue
    const rule = CRITICAL_RULES.find((c) => c.field === r.field)
    if (!rule || !rule.test(r.numericValue)) continue
    out.push({
      field: r.field,
      display: r.display,
      ref: r.ref,
      measuredAt: r.measuredAt,
      analysisId: r.analysisId,
      analysisLabel: r.analysisLabel,
      reason: rule.reason,
    })
  }
  return out
}

// ─── «Что заметил Василий» (consultative observations) ──────────────────────

export interface VasilyObservation {
  id: string
  /** Plain-text observation. Single sentence, neutral, non-diagnostic. */
  text: string
  /** Optional short anchor («жалоба №3», «HbA1c», «холестерин»). */
  anchor?: string
}

/**
 * Curated AI-style observations surfaced as «Что заметил Василий» on the
 * doctor Обзор. Per CLAUDE.md product guardrail #3 these are consultative
 * only — they connect signals (complaints + labs + plan) but never diagnose,
 * prescribe, or instruct the doctor what to do. Generated by simple rule
 * patterns over the same store, not an LLM.
 */
export function selectVasilyObservations(
  s: InteldocState,
  patientId: ID,
  now: Date = new Date(),
): VasilyObservation[] {
  const out: VasilyObservation[] = []

  const complaints = s.complaints.filter((c) => c.patientId === patientId)
  const analyses = s.analyses.filter((a) => a.patientId === patientId)
  const planItems = s.planItems.filter((p) => p.patientId === patientId)

  // Pattern 1: patient asks about kidneys + микроальбумин plan still pending.
  const asksKidneys = complaints.find((c) =>
    /почк|микроальбумин|нефро/i.test(c.text),
  )
  const microAlbumin = planItems.find(
    (p) =>
      /микроальбумин|альбумин/i.test(p.label) &&
      p.status === 'assigned',
  )
  if (asksKidneys && microAlbumin) {
    out.push({
      id: 'v-kidneys-microalbumin',
      anchor: 'жалобы + план',
      text: 'Пациент сам спрашивает про почки — микроальбумин по плану ещё не сдан. Уместно обсудить.',
    })
  }

  // Pattern 2: low-confidence OCR concentrated on one lab.
  for (const a of analyses) {
    const meta = a.ocrFieldMeta ?? {}
    const fields = Object.entries(meta).filter(([, m]) => m?.lowConfidence)
    if (fields.length === 0) continue
    const [fieldName, m] = fields[0]
    out.push({
      id: `v-ocr-${a.id}`,
      anchor: a.label,
      text: `${fieldName} ${a.ocrFields[fieldName] ?? ''} — Василий не уверен в распознавании. Стоит свериться с оригиналом.`,
    })
  }

  // Pattern 3: HbA1c gap from target.
  const hba = analyses
    .flatMap(readingsFromAnalysis)
    .find((r) => r.field === 'HbA1c' && r.numericValue != null)
  if (hba && hba.numericValue != null && hba.range === 'above') {
    const target = 6.5
    const gap = +(hba.numericValue - target).toFixed(1)
    out.push({
      id: 'v-hba1c-target',
      anchor: 'HbA1c',
      text: `HbA1c ${hba.display} — выше целевого ${target}%. Разрыв ${gap > 0 ? `+${gap}` : gap}.`,
    })
  }

  // Pattern 4: lipid panel — both holesterol and ЛПНП elevated.
  const readings = analyses.flatMap(readingsFromAnalysis)
  const cholHigh = readings.find(
    (r) => r.field === 'Холестерин' && r.range === 'above',
  )
  const ldlHigh = readings.find(
    (r) => r.field === 'ЛПНП' && r.range === 'above',
  )
  if (cholHigh && ldlHigh) {
    out.push({
      id: 'v-lipids',
      anchor: 'липидный профиль',
      text: `Холестерин ${cholHigh.display} и ЛПНП ${ldlHigh.display} — оба выше нормы. Стоит обсудить липидный статус.`,
    })
  }

  // Pattern 5: emotional/anxiety signal in complaints.
  const anxious = complaints.find((c) =>
    /тревог|переживаю|беспокою|боюсь|страшно/i.test(c.text),
  )
  if (anxious) {
    out.push({
      id: 'v-emotional',
      anchor: `жалоба${anxious.priority ? ` №${anxious.priority}` : ''}`,
      text: 'Пациент написал об эмоциональных переживаниях. Стоит акцентировать поддержку в разговоре.',
    })
  }

  // Suppress unused-arg warning — `now` reserved for future temporal patterns
  // (recurrence checks, prep-window proximity). Keeping the signature stable.
  void now

  return out.slice(0, 4)
}
