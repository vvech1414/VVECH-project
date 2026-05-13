// Admin-surface mock data — aggregate only (no PII).
// Owned by the contract layer; coder agents may import freely.

import type {
  AccessIncidentBucket,
  AdoptionBreakdownRow,
  AuditEvent,
  ComplianceChecks,
  ComplianceState,
  DepartmentAccess,
  FunnelStage,
  KpiTrendPoint,
  PilotGoal,
  PilotKpis,
} from '../store/types'

export const PILOT_KPIS_SEED: PilotKpis = {
  onboarded: 128,
  prepRate: 72,
  ocrRate: 89,
  periodLabel: 'Пилот ЭНЦ, апрель 2026',
  asOf: '2026-04-25T08:00:00+03:00',
}

/**
 * Pilot goal — 200 patients with active access by 15 May 2026.
 * Partner-set; surfaced as a progress strip in the overview header.
 */
export const PILOT_GOAL_SEED: PilotGoal = {
  targetOnboarded: 200,
  targetDate: '2026-05-15',
  targetLabel: 'к 15 мая',
}

/**
 * Adoption funnel — five stages, narrowest-last. Anchored on the existing
 * 128 active grants and 72% prep rate so the funnel reconciles with the
 * other KPIs on the page.
 */
export const FUNNEL_SEED: FunnelStage[] = [
  { id: 'invited', label: 'Приглашены', count: 312 },
  { id: 'installed', label: 'Установили', count: 196 },
  { id: 'consented', label: 'Подписали согласие', count: 156 },
  { id: 'granted', label: 'Выдали доступ', count: 128 },
  { id: 'prepared', label: 'Подготовились к визиту', count: 92 },
]

/**
 * Department-scoped funnel breakdown. Sums across rows reconcile with the
 * top-level FUNNEL_SEED totals.
 */
export const ADOPTION_BY_DEPARTMENT_SEED: AdoptionBreakdownRow[] = [
  {
    id: 'dept-endo',
    label: 'Эндокринология',
    invited: 180,
    installed: 124,
    consented: 102,
    granted: 84,
    prepared: 64,
  },
  {
    id: 'dept-ter',
    label: 'Терапия',
    invited: 96,
    installed: 52,
    consented: 40,
    granted: 32,
    prepared: 19,
  },
  {
    id: 'dept-lab',
    label: 'Лабдиагностика',
    invited: 36,
    installed: 20,
    consented: 14,
    granted: 12,
    prepared: 9,
  },
]

/**
 * Doctor-scoped funnel breakdown. Sums across rows reconcile with the
 * Эндокринология + Терапия totals (Лабдиагностика is department-only).
 */
export const ADOPTION_BY_DOCTOR_SEED: AdoptionBreakdownRow[] = [
  {
    id: 'doc-d1',
    label: 'Соколов А.В.',
    sublabel: 'Эндокринология',
    invited: 60,
    installed: 46,
    consented: 40,
    granted: 36,
    prepared: 30,
  },
  {
    id: 'doc-d2',
    label: 'Лебедева М.С.',
    sublabel: 'Эндокринология',
    invited: 56,
    installed: 40,
    consented: 34,
    granted: 28,
    prepared: 22,
  },
  {
    id: 'doc-d3',
    label: 'Гордеев П.Н.',
    sublabel: 'Эндокринология',
    invited: 64,
    installed: 38,
    consented: 28,
    granted: 20,
    prepared: 12,
  },
  {
    id: 'doc-d4',
    label: 'Никитин В.А.',
    sublabel: 'Терапия',
    invited: 60,
    installed: 36,
    consented: 28,
    granted: 22,
    prepared: 14,
  },
  {
    id: 'doc-d5',
    label: 'Орлова Е.Д.',
    sublabel: 'Терапия',
    invited: 36,
    installed: 16,
    consented: 12,
    granted: 10,
    prepared: 5,
  },
]

/** 14 daily samples per KPI (~last two weeks of pilot). */
export const KPI_TREND_SEED: KpiTrendPoint[] = [
  // prepRate
  { kpi: 'prepRate', date: '2026-04-12', value: 64 },
  { kpi: 'prepRate', date: '2026-04-13', value: 66 },
  { kpi: 'prepRate', date: '2026-04-14', value: 65 },
  { kpi: 'prepRate', date: '2026-04-15', value: 68 },
  { kpi: 'prepRate', date: '2026-04-16', value: 70 },
  { kpi: 'prepRate', date: '2026-04-17', value: 71 },
  { kpi: 'prepRate', date: '2026-04-18', value: 70 },
  { kpi: 'prepRate', date: '2026-04-19', value: 72 },
  { kpi: 'prepRate', date: '2026-04-20', value: 73 },
  { kpi: 'prepRate', date: '2026-04-21', value: 71 },
  { kpi: 'prepRate', date: '2026-04-22', value: 74 },
  { kpi: 'prepRate', date: '2026-04-23', value: 73 },
  { kpi: 'prepRate', date: '2026-04-24', value: 72 },
  { kpi: 'prepRate', date: '2026-04-25', value: 72 },
  // onboarded (cumulative-like values, 0..100 normalized share)
  { kpi: 'onboarded', date: '2026-04-12', value: 48 },
  { kpi: 'onboarded', date: '2026-04-15', value: 58 },
  { kpi: 'onboarded', date: '2026-04-18', value: 70 },
  { kpi: 'onboarded', date: '2026-04-21', value: 82 },
  { kpi: 'onboarded', date: '2026-04-24', value: 96 },
  { kpi: 'onboarded', date: '2026-04-25', value: 100 },
  // ocrRate
  { kpi: 'ocrRate', date: '2026-04-12', value: 84 },
  { kpi: 'ocrRate', date: '2026-04-15', value: 86 },
  { kpi: 'ocrRate', date: '2026-04-18', value: 88 },
  { kpi: 'ocrRate', date: '2026-04-21', value: 87 },
  { kpi: 'ocrRate', date: '2026-04-24', value: 89 },
  { kpi: 'ocrRate', date: '2026-04-25', value: 89 },
]

export const ACCESS_BY_DEPARTMENT_SEED: DepartmentAccess[] = [
  { department: 'Эндокринология', activeCount: 84, expiringSoon: 6 },
  { department: 'Терапия', activeCount: 32, expiringSoon: 2 },
  { department: 'Лабдиагностика', activeCount: 12, expiringSoon: 0 },
]

export const ACCESS_INCIDENTS_SEED: AccessIncidentBucket[] = [
  { type: 'revoked', count: 3, lastEventAt: '2026-04-25T14:32:00+03:00' },
  { type: 'expired', count: 7, lastEventAt: '2026-04-25T11:05:00+03:00' },
]

export const AUDIT_EVENTS_SEED: AuditEvent[] = [
  {
    id: 'ae-1',
    type: 'access_granted',
    target: 'Эндокринология',
    timestamp: '2026-04-25T09:14:00+03:00',
    source: 'patient',
    note: 'доступ выдан отделению эндокринологии',
  },
  {
    id: 'ae-2',
    type: 'access_expired',
    target: 'Терапия',
    timestamp: '2026-04-25T11:05:00+03:00',
    source: 'system',
    note: 'срок доступа истёк автоматически',
  },
  {
    id: 'ae-3',
    type: 'access_revoked',
    target: 'Эндокринология',
    timestamp: '2026-04-25T14:32:00+03:00',
    source: 'patient',
    note: 'пациент отозвал доступ',
  },
  {
    id: 'ae-4',
    type: 'consent_recorded',
    target: 'ЭНЦ',
    timestamp: '2026-04-24T10:00:00+03:00',
    source: 'patient',
    note: 'согласие зафиксировано (версия 1.0)',
  },
]

export const COMPLIANCE_CHECKS_SEED: ComplianceChecks = {
  n3ConsentRecorded: true,
  n4ScopeDefined: true,
  n5AuditLogEnabled: true,
  // 8 grants expiring soon → amber
  n7ExpiryHealthy: false,
}

export const COMPLIANCE_STATE_SEED: ComplianceState = 'amber'

/** Department list used by onboarding/admin pickers. */
export const ENC_DEPARTMENTS: string[] = [
  'Эндокринология',
  'Терапия',
  'Лабдиагностика',
]
