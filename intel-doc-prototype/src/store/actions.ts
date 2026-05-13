import { getState, setState, useInteldoc } from './store'
import { SEED } from './seed'
import type {
  AccountDraft,
  Analysis,
  AnalysisType,
  Appointment,
  AuditEvent,
  AuditEventType,
  Complaint,
  ComplaintTag,
  ConsentBundle,
  ConsentRecord,
  Document,
  DocumentType,
  DoctorRequest,
  ESignRecord,
  Gender,
  ID,
  Patient,
  PlanItem,
  WebRole,
} from './types'
import { runOcr } from '../lib/ocr-mock'
import {
  ACCESS_GRANT_DOCUMENT,
  ACCESS_GRANT_VERSION,
} from '../lib/consent-text'
import {
  hashSignedDocument,
  submitAccessGrant,
  submitConsentBundle as submitConsentBundleMock,
} from '../lib/onboarding-mocks'
import { track } from '../lib/analytics'

// ─── ID generator ────────────────────────────────────────────────────────────
let _seq = 1
function nextId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${(_seq++).toString(36)}`
}
function nowIso(): string {
  return new Date().toISOString()
}

// ─── Onboarding ─────────────────────────────────────────────────────────────
//
// The v4 spec has 3 distinct commit moments:
//   Screen 2 (account)  → saveAccountDraft  : transient draft only
//   Screen 3 (access)   → signAccessGrant   : Patient + AccessGrant + ESignRecord
//   Screen 4 (consents) → submitConsentBundle : ConsentBundle + finalize onboarding
//
// We keep the draft in-store (rather than component state) so back-navigation
// across the 4 routes doesn't lose typed input.

export function saveAccountDraft(draft: AccountDraft): void {
  setState({ accountDraft: draft })
}

export interface SignAccessGrantArgs {
  /** Convenience override; otherwise we read the in-store draft. */
  draft?: AccountDraft
}

/**
 * Persist Patient + AccessGrant + ESignRecord. Called after the user ticks
 * the confirmation checkbox and taps «Подписать и продолжить» on Screen 3.
 *
 * OTP step is omitted per pilot decision; signature is recorded with method
 * `mock_no_otp` for the audit trail to flag the deviation.
 */
export async function signAccessGrant(
  args: SignAccessGrantArgs = {},
): Promise<{ patient: Patient; esign: ESignRecord; grantId: ID }> {
  const state = getState()
  const draft = args.draft ?? state.accountDraft
  if (!draft) throw new Error('signAccessGrant: account draft missing')
  if (!draft.gender) throw new Error('signAccessGrant: gender missing')

  const patientId: ID = 'p1'
  const grantId = nextId('ag')
  const esignId = nextId('esign')
  const ts = nowIso()

  const patient: Patient = {
    id: patientId,
    name: draft.name.trim(),
    dob: draft.dob,
    gender: draft.gender,
    phone: draft.phone.trim(),
    email: draft.email?.trim() || undefined,
    identifiers: {},
    partnerClinic: 'enc',
    department: 'Отделение диабетологии',
    attendingDoctorId: 'd1',
    createdAt: ts,
  }

  const documentHash = await hashSignedDocument(
    `${ACCESS_GRANT_VERSION}|${ACCESS_GRANT_DOCUMENT}|recipient=enc|user=${patientId}`,
  )

  const esign: ESignRecord = {
    id: esignId,
    userId: patientId,
    documentHash,
    signedAt: ts,
    signatureMethod: 'mock_no_otp',
    recipientClinicId: 'enc',
    partnerId: 'enc',
  }

  setState((s) => ({
    patients: [
      ...s.patients.filter((p) => p.id !== patientId),
      patient,
    ],
    accessGrants: [
      ...s.accessGrants.filter((g) => g.patientId !== patientId),
      {
        id: grantId,
        patientId,
        clinicId: 'enc',
        scope: 'lifetime-clinic',
        grantedAt: ts,
        // Static recent-view timestamp so the patient sees a believable
        // "last viewed" line on Profile without backend access events.
        lastViewedAt: '2026-04-24T09:12:00Z',
      },
    ],
    esignRecords: [
      ...s.esignRecords.filter((r) => r.userId !== patientId),
      esign,
    ],
    currentPatientId: patientId,
    accessSigned: true,
  }))

  track({ name: 'access_grant_signed', esignId })

  // Backend stub — currently just simulates latency.
  await submitAccessGrant()
  track({ name: 'access_granted', grantId, esignId })

  return { patient, esign, grantId }
}

/**
 * Persist the consent bundle and mark onboarding complete. Called from
 * Screen 4 «Принять и продолжить».
 */
export async function submitConsentBundle(
  consents: ConsentRecord[],
): Promise<ConsentBundle> {
  const state = getState()
  const userId = state.currentPatientId
  if (!userId) throw new Error('submitConsentBundle: no active patient')
  const linkedEsign = state.esignRecords.find((r) => r.userId === userId)
  if (!linkedEsign) throw new Error('submitConsentBundle: no e-sign record')

  const bundle: ConsentBundle = {
    bundleId: nextId('bundle'),
    userId,
    capturedAt: nowIso(),
    ipAddress: 'browser-unknown',
    userAgent:
      typeof navigator !== 'undefined' ? navigator.userAgent : 'node',
    consents,
    linkedEsignId: linkedEsign.id,
    partnerId: 'enc',
  }

  setState((s) => ({
    consentBundles: [
      ...s.consentBundles.filter((b) => b.userId !== userId),
      bundle,
    ],
    hasCompletedOnboarding: true,
    accountDraft: null,
    accessSigned: false,
  }))

  track({ name: 'consents_submitted', bundle })

  await submitConsentBundleMock()
  return bundle
}

/** Idempotent helper — used by demo segments and the «Сбросить» toolbar. */
export function clearOnboarding() {
  setState({
    accountDraft: null,
    accessSigned: false,
    hasCompletedOnboarding: false,
  })
}

// ─── Legacy wrapper (kept for segments.ts back-compat during migration) ─────
// One-shot helper that goes from zero to a fully onboarded p1. Used by the
// demo fast-forward segments only. Real onboarding goes through saveDraft →
// signAccessGrant → submitConsentBundle.
export async function completeEntryFlow(input: {
  name: string
  dob: string
  gender: Gender
  phone: string
  email?: string
}): Promise<Patient> {
  saveAccountDraft({
    name: input.name,
    dob: input.dob,
    gender: input.gender,
    phone: input.phone,
    email: input.email ?? '',
  })
  const { patient } = await signAccessGrant()
  await submitConsentBundle([
    {
      id: 'pdn_general',
      version: ACCESS_GRANT_VERSION,
      accepted: true,
      ackMechanism: 'scroll_to_end',
    },
    {
      id: 'pdn_special',
      version: ACCESS_GRANT_VERSION,
      accepted: true,
      ackMechanism: 'scroll_to_end',
    },
  ])
  return patient
}

// ─── Uploads ────────────────────────────────────────────────────────────────
export async function uploadAnalysis(args: {
  type: AnalysisType
  planItemId?: ID
  fileUrl?: string
}): Promise<Analysis> {
  const { type, planItemId, fileUrl = '' } = args
  const { currentPatientId } = getState()
  if (!currentPatientId) throw new Error('no active patient')

  const ocr = await runOcr(type)

  const analysis: Analysis = {
    id: nextId('an'),
    patientId: currentPatientId,
    type,
    label: ocr.label,
    date: ocr.fields['дата'] ?? '',
    originalFileUrl: fileUrl,
    qualityCheck: 'clear',
    ocrFields: ocr.fields,
    linkedPlanItemId: planItemId,
    status: 'uploaded',
    uploadedAt: nowIso(),
  }

  setState((s) => {
    const planItems = planItemId
      ? s.planItems.map((p) =>
          p.id === planItemId
            ? { ...p, status: 'uploaded' as const, linkedAnalysisId: analysis.id }
            : p,
        )
      : s.planItems
    return {
      analyses: [analysis, ...s.analyses],
      planItems,
    }
  })
  return analysis
}

export function editOcrField(analysisId: ID, field: string, value: string): void {
  setState((s) => ({
    analyses: s.analyses.map((a) =>
      a.id === analysisId
        ? { ...a, ocrFields: { ...a.ocrFields, [field]: value } }
        : a,
    ),
  }))
}

export function uploadDocument(args: {
  type: DocumentType
  label: string
  fileUrl?: string
}): Document {
  const { type, label, fileUrl = '' } = args
  const { currentPatientId } = getState()
  if (!currentPatientId) throw new Error('no active patient')
  const doc: Document = {
    id: nextId('doc'),
    patientId: currentPatientId,
    type,
    label,
    originalFileUrl: fileUrl,
    qualityCheck: 'clear',
    status: 'uploaded',
    uploadedAt: nowIso(),
  }
  setState((s) => ({ documents: [doc, ...s.documents] }))
  return doc
}

export function addComplaint(text: string): Complaint | null {
  const trimmed = text.trim()
  if (!trimmed) return null
  const { currentPatientId } = getState()
  if (!currentPatientId) throw new Error('no active patient')
  const c: Complaint = {
    id: nextId('c'),
    patientId: currentPatientId,
    text: trimmed,
    createdAt: nowIso(),
  }
  setState((s) => ({ complaints: [c, ...s.complaints] }))
  return c
}

// ─── Doctor-side ────────────────────────────────────────────────────────────
export function openPatientRecord(patientId: ID): void {
  setState({ doctorActivePatientId: patientId })
}

export function sendRequest(args: {
  title: string
  body: string
  items: Array<{ analysisType: AnalysisType; label: string; reason?: string }>
}): DoctorRequest {
  const { doctorActivePatientId, currentDoctorId } = getState()
  const patientId = doctorActivePatientId
  if (!patientId) throw new Error('no active doctor patient')

  const requestId = nextId('req')
  const created = nowIso()

  const planItems: PlanItem[] = args.items.map((it) => ({
    id: nextId('pi'),
    patientId,
    requestId,
    analysisType: it.analysisType,
    label: it.label,
    reason: it.reason,
    status: 'assigned' as const,
    createdAt: created,
  }))

  const request: DoctorRequest = {
    id: requestId,
    patientId,
    fromDoctorId: currentDoctorId,
    title: args.title,
    body: args.body,
    planItemIds: planItems.map((p) => p.id),
    createdAt: created,
    seenByPatient: false,
  }

  setState((s) => ({
    doctorRequests: [request, ...s.doctorRequests],
    planItems: [...planItems, ...s.planItems],
  }))
  return request
}

export function openNotification(requestId: ID): void {
  setState((s) => ({
    doctorRequests: s.doctorRequests.map((r) =>
      r.id === requestId ? { ...r, seenByPatient: true } : r,
    ),
  }))
}

export function acknowledgeAnalysis(analysisId: ID): void {
  setState((s) => {
    const analysis = s.analyses.find((a) => a.id === analysisId)
    if (!analysis) return {}
    return {
      analyses: s.analyses.map((a) =>
        a.id === analysisId ? { ...a, status: 'acknowledged' as const } : a,
      ),
      planItems: s.planItems.map((p) =>
        p.id === analysis.linkedPlanItemId
          ? { ...p, status: 'acknowledged' as const }
          : p,
      ),
    }
  })
}

// ─── Booking ────────────────────────────────────────────────────────────────
export function bookMainAppointment(args: { date: string }): Appointment {
  const { currentPatientId } = getState()
  if (!currentPatientId) throw new Error('no active patient')
  const appt: Appointment = {
    id: nextId('appt'),
    patientId: currentPatientId,
    doctorId: getState().currentDoctorId,
    type: 'main',
    date: args.date,
    status: 'scheduled',
    createdAt: nowIso(),
  }
  setState((s) => ({ appointments: [appt, ...s.appointments] }))
  return appt
}

// ─── Complaint tags (patient checklist spec 017) ────────────────────────────
export function setComplaintTags(complaintId: ID, tags: ComplaintTag[]): void {
  setState((s) => ({
    complaints: s.complaints.map((c) =>
      c.id === complaintId ? { ...c, tags } : c,
    ),
  }))
}

// ─── Access lifecycle (patient writes; admin reads aggregates only) ─────────
export function revokeAccess(grantId: ID): void {
  const ts = nowIso()
  setState((s) => {
    const grant = s.accessGrants.find((g) => g.id === grantId)
    if (!grant) return {}
    return {
      accessGrants: s.accessGrants.map((g) =>
        g.id === grantId ? { ...g, revokedAt: ts } : g,
      ),
      auditEvents: [
        {
          id: nextId('ae'),
          type: 'access_revoked' as const,
          target: grant.department ?? 'ЛПУ',
          timestamp: ts,
          source: 'patient' as const,
          note: 'пациент отозвал доступ',
        },
        ...s.auditEvents,
      ],
    }
  })
  track({ name: 'access_revoked', grantId })
}

export function extendAccess(grantId: ID, newExpiresAt: string): void {
  const ts = nowIso()
  setState((s) => {
    const grant = s.accessGrants.find((g) => g.id === grantId)
    if (!grant) return {}
    return {
      accessGrants: s.accessGrants.map((g) =>
        g.id === grantId ? { ...g, expiresAt: newExpiresAt } : g,
      ),
      auditEvents: [
        {
          id: nextId('ae'),
          type: 'access_extended' as const,
          target: grant.department ?? 'ЛПУ',
          timestamp: ts,
          source: 'patient' as const,
          note: 'пациент продлил доступ',
        },
        ...s.auditEvents,
      ],
    }
  })
  track({ name: 'access_extended', grantId, newExpiresAt })
}

// ─── Admin no-op-ish actions (aggregate only — never expose PII) ────────────
export function logAdminEvent(
  type: AuditEventType,
  target: string,
  note?: string,
): AuditEvent {
  const event: AuditEvent = {
    id: nextId('ae'),
    type,
    target,
    timestamp: nowIso(),
    source: 'admin',
    note,
  }
  setState((s) => ({ auditEvents: [event, ...s.auditEvents] }))
  return event
}

export function markIncidentSeen(type: 'revoked' | 'expired'): void {
  // The pilot prototype does not persist a seen-flag; the action is kept as a
  // hook for the admin surface to record that the row was acknowledged.
  track({ name: 'admin_incident_seen', type })
}

// ─── Web auth (mock — accepts any credentials) ──────────────────────────────
export function signInWeb(role: WebRole, username: string): void {
  setState({
    webAuth: {
      role,
      username: username.trim() || 'demo',
      signedInAt: nowIso(),
    },
  })
  track({ name: 'web_login', role })
}

export function signOutWeb(): void {
  const role = getState().webAuth?.role
  setState({ webAuth: null })
  if (role) track({ name: 'web_logout', role })
}

// ─── Demo helpers ───────────────────────────────────────────────────────────
export function resetToSeed(): void {
  useInteldoc.persist.clearStorage()
  setState({ ...SEED })
}
