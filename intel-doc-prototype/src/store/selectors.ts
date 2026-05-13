import type {
  AccessGrant,
  Analysis,
  Appointment,
  AuditEvent,
  Complaint,
  Document,
  DoctorRequest,
  ID,
  InteldocState,
  KpiId,
  KpiTrendPoint,
  Patient,
  PlanItem,
  PlanItemStatus,
} from './types'

// Active patient (entry-flow created or first patient).
export function selectActivePatient(s: InteldocState): Patient | null {
  if (!s.currentPatientId) return null
  return s.patients.find((p) => p.id === s.currentPatientId) ?? null
}

export function selectDoctorActivePatient(s: InteldocState): Patient | null {
  if (!s.doctorActivePatientId) return null
  return s.patients.find((p) => p.id === s.doctorActivePatientId) ?? null
}

export function selectUnseenRequests(s: InteldocState): DoctorRequest[] {
  if (!s.currentPatientId) return []
  return s.doctorRequests.filter(
    (r) => r.patientId === s.currentPatientId && !r.seenByPatient,
  )
}

export function selectRequestsForPatient(
  s: InteldocState,
  patientId: ID,
): DoctorRequest[] {
  return s.doctorRequests.filter((r) => r.patientId === patientId)
}

export function selectPlanItemsForPatient(
  s: InteldocState,
  patientId: ID | null = s.currentPatientId,
): Record<PlanItemStatus, PlanItem[]> {
  const all = patientId
    ? s.planItems.filter((p) => p.patientId === patientId)
    : []
  return {
    assigned: all.filter((p) => p.status === 'assigned'),
    uploaded: all.filter((p) => p.status === 'uploaded'),
    acknowledged: all.filter((p) => p.status === 'acknowledged'),
  }
}

export function selectAnalysesForPatient(
  s: InteldocState,
  patientId: ID | null = s.currentPatientId,
): Analysis[] {
  if (!patientId) return []
  return s.analyses
    .filter((a) => a.patientId === patientId)
    .slice()
    .sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1))
}

export function selectDocumentsForPatient(
  s: InteldocState,
  patientId: ID | null = s.currentPatientId,
): Document[] {
  if (!patientId) return []
  return s.documents.filter((d) => d.patientId === patientId)
}

export function selectComplaintsForPatient(
  s: InteldocState,
  patientId: ID | null = s.currentPatientId,
): Complaint[] {
  if (!patientId) return []
  return s.complaints.filter((c) => c.patientId === patientId)
}

export function selectAppointmentsForPatient(
  s: InteldocState,
  patientId: ID | null = s.currentPatientId,
): Appointment[] {
  if (!patientId) return []
  return s.appointments.filter((a) => a.patientId === patientId)
}

// Documents readiness — passport / OMS are required, SNILS + referral are optional context.
const REQUIRED_DOCS: Document['type'][] = ['passport', 'oms']

export function selectDocumentReadiness(s: InteldocState): {
  uploaded: number
  total: number
  percent: number
} {
  const docs = selectDocumentsForPatient(s)
  const uploaded = REQUIRED_DOCS.filter((req) =>
    docs.some((d) => d.type === req),
  ).length
  const total = REQUIRED_DOCS.length
  return { uploaded, total, percent: Math.round((uploaded / total) * 100) }
}

/**
 * Prep is "complete" when:
 *  - all required documents uploaded
 *  - no doctor-assigned plan items remain in 'assigned' state
 *  - at least one complaint or one analysis on file (so the visit isn't empty)
 */
export function selectPrepIsComplete(s: InteldocState): boolean {
  const docs = selectDocumentReadiness(s)
  const plan = selectPlanItemsForPatient(s)
  const analyses = selectAnalysesForPatient(s)
  const complaints = selectComplaintsForPatient(s)
  const docsReady = docs.uploaded === docs.total
  const planClear = plan.assigned.length === 0
  const hasContent = analyses.length > 0 || complaints.length > 0
  return docsReady && planClear && hasContent
}

export function selectPrepProgress(s: InteldocState): {
  done: number
  total: number
  label: string
} {
  // Five top-level prep buckets per master prompt §11 / S10
  const docs = selectDocumentReadiness(s)
  const plan = selectPlanItemsForPatient(s)
  const analyses = selectAnalysesForPatient(s)
  const complaints = selectComplaintsForPatient(s)

  const buckets = [
    plan.assigned.length === 0 && plan.uploaded.length + plan.acknowledged.length > 0,
    docs.uploaded === docs.total,
    complaints.length > 0,
    analyses.length > 0,
    selectAppointmentsForPatient(s).some((a) => a.type === 'main'),
  ]
  // If no plan was ever issued, count that bucket as N/A by collapsing both numerator & denominator.
  const planEverIssued = plan.assigned.length + plan.uploaded.length + plan.acknowledged.length > 0
  const considered = buckets.slice(0, planEverIssued ? 5 : 4)
  const done = considered.filter(Boolean).length
  const total = considered.length
  return { done, total, label: `${done} из ${total}` }
}

export function selectAppointmentForPatient(
  s: InteldocState,
  patientId: ID | null = s.currentPatientId,
): Appointment | null {
  const appts = selectAppointmentsForPatient(s, patientId)
  return appts.find((a) => a.type === 'main') ?? null
}

// ─── Access selectors (shared by patient + admin surfaces) ──────────────────

export function selectActiveAccessGrants(s: InteldocState): AccessGrant[] {
  return s.accessGrants.filter((g) => !g.revokedAt)
}

export function selectAccessGrantsForPatient(
  s: InteldocState,
  patientId: ID | null = s.currentPatientId,
): AccessGrant[] {
  if (!patientId) return []
  return s.accessGrants.filter((g) => g.patientId === patientId)
}

// ─── Admin selectors (aggregate-only) ───────────────────────────────────────

export function selectKpiTrend(
  s: InteldocState,
  kpi: KpiId,
): KpiTrendPoint[] {
  return s.kpiTrend
    .filter((p) => p.kpi === kpi)
    .slice()
    .sort((a, b) => (a.date < b.date ? -1 : 1))
}

export function selectRecentAuditEvents(
  s: InteldocState,
  limit = 10,
): AuditEvent[] {
  return s.auditEvents
    .slice()
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
    .slice(0, limit)
}

/**
 * Compute the rolled-up compliance colour from the four checks.
 * Falls back to the explicit `complianceState` field when checks are missing.
 */
export function selectComputedComplianceState(
  s: InteldocState,
): 'green' | 'amber' | 'red' {
  const c = s.complianceChecks
  if (!c) return s.complianceState
  if (!c.n3ConsentRecorded || !c.n4ScopeDefined) return 'red'
  if (!c.n5AuditLogEnabled || !c.n7ExpiryHealthy) return 'amber'
  return 'green'
}
