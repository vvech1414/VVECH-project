// IntelDoc store — domain types
// Shared by patient and doctor surfaces. Keep additions backwards-compatible
// since persisted state lives in localStorage between sessions.

export type ID = string

export type Gender = 'female' | 'male'

export interface Patient {
  id: ID
  name: string
  dob: string // ISO yyyy-mm-dd
  gender: Gender
  phone: string // RU format, captured during onboarding
  email?: string // optional contact
  identifiers: { snils?: string; oms?: string }
  partnerClinic: string
  department: string
  attendingDoctorId: ID
  createdAt: string // ISO
  /** ISO timestamp at which the patient marked preparation complete. */
  prepCompletedAt?: string
  /** Approximate minutes the patient spent on preparation across sessions. */
  prepTimeSpentMin?: number
  /**
   * Working diagnosis carried into the visit. Surfaced on the doctor record
   * left-rail so the endocrinologist sees clinical context at a glance.
   * `confirmed` reflects whether a clinic-side specialist has signed off —
   * the prototype does not model the confirmation workflow further.
   */
  diagnosis?: {
    label: string
    confirmed: boolean
  }
}

// ─── Onboarding draft (transient, before commit) ────────────────────────────

export interface AccountDraft {
  name: string
  dob: string
  gender: Gender | null
  phone: string
  email: string
}

// ─── E-signature for the access grant (Screen 3) ────────────────────────────

export interface ESignRecord {
  id: ID
  userId: ID
  documentHash: string // hash of the granted-document text + recipient
  signedAt: string // ISO
  signatureMethod: 'mock_no_otp' // OTP omitted per pilot decision
  recipientClinicId: ID
  partnerId: string
}

// ─── Consent bundle (Screen 4, Appendix A.5 schema) ─────────────────────────

export type ConsentId = 'pdn_general' | 'pdn_special' | 'cross_border' | 'marketing'
export type AckMechanism =
  | 'scroll_to_end'
  | 'a11y_checkbox'
  | 'direct_tick'
  | 'not_applicable'

export interface ConsentRecord {
  id: ConsentId
  version: string // semantic version of the legal text
  accepted: boolean
  ackMechanism: AckMechanism
  channels?: string[] // for marketing: ['email','sms','push']
}

export interface ConsentBundle {
  bundleId: ID
  userId: ID
  capturedAt: string // ISO UTC
  ipAddress: string // unknown in browser; recorded as 'browser-unknown'
  userAgent: string
  consents: ConsentRecord[]
  linkedEsignId: ID
  partnerId: string
}

export interface AccessGrant {
  id: ID
  patientId: ID
  clinicId: ID
  scope: 'lifetime-clinic'
  grantedAt: string
  /** Optional explicit expiry — undefined for lifetime grants. */
  expiresAt?: string
  /** Set when the grant was revoked by the patient. */
  revokedAt?: string
  /** Optional department label captured at grant time (for admin rollups). */
  department?: string
  /** ISO timestamp of the most recent clinic-side view, surfaced to the patient. */
  lastViewedAt?: string
}

export type AnalysisType =
  | 'HbA1c'
  | 'glucose'
  | 'creatinine'
  | 'cholesterol'
  | 'other'

/**
 * Per-field metadata for OCR-extracted analyte values. Optional and
 * additive — when absent, rendering falls back to raw `ocrFields` strings
 * with no range / confidence indicators.
 */
export interface OcrFieldMeta {
  /** Display-form reference, e.g. "< 6.5 %". */
  ref?: string
  /** Numeric reference bounds, when comparable. */
  refMin?: number
  refMax?: number
  /** Numeric value parsed from `ocrFields[key]`. */
  numericValue?: number
  /** Unit string for compact rendering, e.g. "%", "ммоль/л". */
  unit?: string
  /** True when OCR confidence is below the demo threshold. */
  lowConfidence?: boolean
}

export interface Analysis {
  id: ID
  patientId: ID
  type: AnalysisType
  label: string
  date: string // ISO
  originalFileUrl: string
  qualityCheck: 'clear' | 'acceptable'
  ocrFields: Record<string, string>
  /** Sibling map keyed by the same field names as `ocrFields`. */
  ocrFieldMeta?: Record<string, OcrFieldMeta>
  linkedPlanItemId?: ID
  status: 'uploaded' | 'acknowledged'
  uploadedAt: string
}

export type DocumentType =
  | 'passport'
  | 'snils'
  | 'oms'
  | 'referral'
  | 'other'

export interface Document {
  id: ID
  patientId: ID
  type: DocumentType
  label: string
  originalFileUrl: string
  qualityCheck: 'clear' | 'acceptable'
  status: 'uploaded'
  uploadedAt: string
  /** OCR/structuring outcome surfaced to the doctor («Структура» column). */
  structureStatus?: 'structured' | 'original-only'
}

/** Non-clinical organizational tags chosen by the patient (per spec 017). */
export type ComplaintTag =
  | 'energy' // «Самочувствие и силы»
  | 'sleep' // «Сон»
  | 'weight' // «Вес и аппетит»
  | 'glucose' // «Сахар крови»
  | 'mood' // «Настроение»
  | 'other' // «Другое»

export interface Complaint {
  id: ID
  patientId: ID
  text: string
  createdAt: string
  /** Patient-assigned organizational tags (non-diagnostic). */
  tags?: ComplaintTag[]
  /**
   * Patient-set priority — 1 is highest. Drives the «Что важно пациенту»
   * ranking on the doctor Сводка. Absent ⇒ recency fallback.
   */
  priority?: number
}

export type PlanItemStatus = 'assigned' | 'uploaded' | 'acknowledged'

export interface PlanItem {
  id: ID
  patientId: ID
  requestId: ID
  analysisType: AnalysisType
  label: string
  reason?: string
  status: PlanItemStatus
  linkedAnalysisId?: ID
  createdAt: string
  /** Optional ISO timestamp by which the patient should upload the result. */
  dueDate?: string
}

export interface DoctorRequest {
  id: ID
  patientId: ID
  fromDoctorId: ID
  title: string
  body: string
  planItemIds: ID[]
  createdAt: string
  seenByPatient: boolean
}

export interface Appointment {
  id: ID
  patientId: ID
  doctorId: ID
  type: 'main' | 'preparatory'
  date: string
  status: 'scheduled' | 'completed'
  createdAt: string
}

export interface Doctor {
  id: ID
  name: string
  specialty: string
  clinicId: ID
}

export interface Clinic {
  id: ID
  name: string
  shortName: string
  department: string
}

// ─── Admin surface (aggregate-only, no PII) ─────────────────────────────────

/**
 * Pilot goal for the partner clinic — drives the «Прогресс к цели»
 * indicator in the admin overview header. Aggregate-only.
 */
export interface PilotGoal {
  /** Target number of patients with an active access grant by `targetDate`. */
  targetOnboarded: number
  /** ISO yyyy-mm-dd deadline. */
  targetDate: string
  /** Human label used as a fallback in the header, e.g. «к 15 мая». */
  targetLabel: string
}

/**
 * One stage of the adoption funnel surfaced as the hero block on the
 * admin overview. `count` is the cumulative number of pilot patients who
 * reached this stage. Stages are ordered narrowest-last by convention:
 * invited → installed → consented → granted → prepared.
 */
export type FunnelStageId =
  | 'invited'
  | 'installed'
  | 'consented'
  | 'granted'
  | 'prepared'

export interface FunnelStage {
  id: FunnelStageId
  label: string
  count: number
}

/**
 * Per-department or per-doctor adoption breakdown — same five funnel
 * stages, scoped to one slice. Used by the «Где теряем» block.
 */
export interface AdoptionBreakdownRow {
  /** Stable key for React lists. */
  id: string
  /** Display label — department name or doctor name. */
  label: string
  /** Optional secondary line, e.g. department for a doctor row. */
  sublabel?: string
  invited: number
  installed: number
  consented: number
  granted: number
  prepared: number
}

/** Top-three KPI tiles shown on the admin pilot overview. */
export interface PilotKpis {
  /** Number of patients onboarded during the pilot window. */
  onboarded: number
  /** % of visits where preparation was completed before the visit. */
  prepRate: number
  /** % of uploaded documents successfully recognized by OCR. */
  ocrRate: number
  /** Period label, e.g. «Пилот ЭНЦ, апрель 2026». */
  periodLabel: string
  /** Snapshot timestamp (ISO). */
  asOf: string
}

export type KpiId = 'onboarded' | 'prepRate' | 'ocrRate'

/** One sample on the KPI sparkline. */
export interface KpiTrendPoint {
  kpi: KpiId
  date: string // ISO yyyy-mm-dd
  value: number // 0..100
}

/** Aggregated rollout state for one department of the partner clinic. */
export interface DepartmentAccess {
  department: string
  activeCount: number
  /** Active grants whose expiry is within the next 7 days. */
  expiringSoon: number
}

export type AuditEventType =
  | 'access_granted'
  | 'access_revoked'
  | 'access_expired'
  | 'access_extended'
  | 'consent_recorded'
  | 'admin_kpi_viewed'

/** Aggregate journal entry — never carries PII. */
export interface AuditEvent {
  id: ID
  type: AuditEventType
  /** Department or clinic the event relates to (no patient ids). */
  target: string
  /** ISO timestamp. */
  timestamp: string
  /** Originating surface for traceability. */
  source: 'patient' | 'doctor' | 'admin' | 'system'
  /** Free-form aggregate label, e.g. «доступ для отделения эндокринологии». */
  note?: string
}

/** Recent revoke / expire incidents shown on admin rollout screen. */
export interface AccessIncidentBucket {
  type: 'revoked' | 'expired'
  count: number
  lastEventAt: string
}

export type ComplianceState = 'green' | 'amber' | 'red'

export interface ComplianceChecks {
  /** N3: consent versioned + timestamped. */
  n3ConsentRecorded: boolean
  /** N4: access scope explicitly defined for the patient. */
  n4ScopeDefined: boolean
  /** N5: audit log enabled and writing events. */
  n5AuditLogEnabled: boolean
  /** N7: access expiry tracked and not massively overdue. */
  n7ExpiryHealthy: boolean
}

// ─── Web (doctor + admin) auth ──────────────────────────────────────────────

export type WebRole = 'doctor' | 'admin'

export interface WebAuthSession {
  role: WebRole
  username: string
  signedInAt: string // ISO
}

// ─── Store shape ─────────────────────────────────────────────────────────────

export interface InteldocState {
  // Surfaces
  currentPatientId: ID | null
  doctorActivePatientId: ID | null
  currentDoctorId: ID

  // Web (doctor + admin) auth — mocked, no real verification
  webAuth: WebAuthSession | null

  // Onboarding gate (per spec §Product guardrails: persist locally)
  hasCompletedOnboarding: boolean
  // Onboarding draft (transient form state, kept in store so back-nav doesn't lose it)
  accountDraft: AccountDraft | null
  accessSigned: boolean // whether the access grant has been e-signed in this session

  // Collections
  clinics: Clinic[]
  doctors: Doctor[]
  patients: Patient[]
  accessGrants: AccessGrant[]
  esignRecords: ESignRecord[]
  consentBundles: ConsentBundle[]
  analyses: Analysis[]
  documents: Document[]
  complaints: Complaint[]
  planItems: PlanItem[]
  doctorRequests: DoctorRequest[]
  appointments: Appointment[]

  // ─── Admin slices (aggregate-only) ─────────────────────────────────────────
  pilotKpis: PilotKpis
  pilotGoal: PilotGoal
  funnel: FunnelStage[]
  adoptionByDepartment: AdoptionBreakdownRow[]
  adoptionByDoctor: AdoptionBreakdownRow[]
  kpiTrend: KpiTrendPoint[]
  accessByDepartment: DepartmentAccess[]
  accessIncidents: AccessIncidentBucket[]
  auditEvents: AuditEvent[]
  complianceState: ComplianceState
  complianceChecks: ComplianceChecks
}
