# IntelDoc Prototype — Shared State Contract

Source-of-truth for the three downstream coder agents (patient, doctor, admin).
This contract is **frozen for the current iteration**. If a coder agent needs
a change, write a follow-up note (see §Followup mechanism) — do not edit
shared types or actions directly.

The store lives in `src/store/` and is persisted in `localStorage`
under key `inteldoc-demo-v1`. Additions are backwards-compatible — existing
fields keep the same name, type and semantics.

---

## 1. State map (`src/store/types.ts` → `InteldocState`)

### Surfaces / session
| Field | Type | Description |
|-------|------|-------------|
| `currentPatientId` | `ID \| null` | Active patient on the patient surface. |
| `doctorActivePatientId` | `ID \| null` | Patient currently opened in the doctor cockpit. |
| `currentDoctorId` | `ID` | Doctor account behind the cockpit (mock single doctor). |

### Onboarding
| Field | Type | Description |
|-------|------|-------------|
| `hasCompletedOnboarding` | `boolean` | True once consent bundle is committed. |
| `accountDraft` | `AccountDraft \| null` | Transient form state across the 4 onboarding routes. |
| `accessSigned` | `boolean` | Per-session flag: access grant was just e-signed. |

### Reference catalogues
| Field | Type | Description |
|-------|------|-------------|
| `clinics` | `Clinic[]` | Partner clinics; ЭНЦ is `id: 'enc'`. |
| `doctors` | `Doctor[]` | Doctor directory; cockpit user is `id: 'd1'`. |
| `patients` | `Patient[]` | Patient records (incl. `p2`, `p3` for cockpit list). |

### Audit / consent records (N3, N4, N5, N7)
| Field | Type | Description |
|-------|------|-------------|
| `accessGrants` | `AccessGrant[]` | Patient → clinic access. New optional fields `expiresAt`, `revokedAt`, `department`. |
| `esignRecords` | `ESignRecord[]` | E-signature log entries (mock_no_otp). |
| `consentBundles` | `ConsentBundle[]` | PDN consent bundles per patient. |

### Patient content
| Field | Type | Description |
|-------|------|-------------|
| `analyses` | `Analysis[]` | Uploaded lab analyses (HbA1c / glucose / creatinine / cholesterol / other). |
| `documents` | `Document[]` | Uploaded admin documents (passport, oms, snils, referral, other). |
| `complaints` | `Complaint[]` | Patient-entered complaints. New optional `tags: ComplaintTag[]`. |
| `planItems` | `PlanItem[]` | Doctor-assigned items the patient must close. |
| `doctorRequests` | `DoctorRequest[]` | Outbound doctor requests with one or more plan items. |
| `appointments` | `Appointment[]` | Booked main / preparatory visits. |

### Admin slices (NEW — aggregate-only, no PII)
| Field | Type | Description |
|-------|------|-------------|
| `pilotKpis` | `PilotKpis` | Three top-row KPI tiles for the admin overview. |
| `kpiTrend` | `KpiTrendPoint[]` | Sparkline samples (date + value per KPI). |
| `accessByDepartment` | `DepartmentAccess[]` | Active grants and `expiringSoon` per department. |
| `accessIncidents` | `AccessIncidentBucket[]` | Recent revoke/expire aggregates (72h window). |
| `auditEvents` | `AuditEvent[]` | Append-only journal — aggregate label only, never patient ids. |
| `complianceState` | `ComplianceState` | `'green' \| 'amber' \| 'red'` — explicit override. |
| `complianceChecks` | `ComplianceChecks` | Booleans per N3 / N4 / N5 / N7. Used by `selectComputedComplianceState`. |

### New helper types
- `ComplaintTag` — `'energy' | 'sleep' | 'weight' | 'glucose' | 'mood' | 'other'`
- `KpiId` — `'onboarded' | 'prepRate' | 'ocrRate'`
- `AuditEventType` — `'access_granted' | 'access_revoked' | 'access_expired' | 'access_extended' | 'consent_recorded' | 'admin_kpi_viewed'`
- `ComplianceState` — `'green' | 'amber' | 'red'`

---

## 2. Surface read/write matrix

Legend: ✅ allowed · — disallowed · 👁 read-only

| Field | Patient R | Patient W | Doctor R | Doctor W | Admin R | Admin W |
|---|---|---|---|---|---|---|
| `currentPatientId` | ✅ | ✅ | — | — | — | — |
| `doctorActivePatientId` | — | — | ✅ | ✅ | — | — |
| `currentDoctorId` | 👁 | — | ✅ | — | — | — |
| `hasCompletedOnboarding` | ✅ | ✅ | — | — | — | — |
| `accountDraft` | ✅ | ✅ | — | — | — | — |
| `accessSigned` | ✅ | ✅ | — | — | — | — |
| `clinics` | 👁 | — | 👁 | — | 👁 | — |
| `doctors` | 👁 | — | 👁 | — | 👁 | — |
| `patients` | 👁 own | ✅ (signAccessGrant) | ✅ | — | — | — |
| `accessGrants` | ✅ | ✅ (`revokeAccess`, `extendAccess`) | 👁 own patient | — | 👁 aggregate via selectors | — |
| `esignRecords` | 👁 own | ✅ (signAccessGrant) | — | — | — | — |
| `consentBundles` | 👁 own | ✅ (submitConsentBundle) | — | — | — | — |
| `analyses` | ✅ | ✅ (upload, editOcr) | ✅ | ✅ (acknowledge) | — | — |
| `documents` | ✅ | ✅ (upload) | ✅ | — | — | — |
| `complaints` | ✅ | ✅ (add, setComplaintTags) | ✅ | — | — | — |
| `planItems` | ✅ | 👁 (mutated indirectly via upload) | ✅ | ✅ (sendRequest) | — | — |
| `doctorRequests` | ✅ | ✅ (`openNotification`) | ✅ | ✅ (sendRequest) | — | — |
| `appointments` | ✅ | ✅ (bookMainAppointment) | ✅ | — | — | — |
| `pilotKpis` | — | — | — | — | ✅ | — |
| `kpiTrend` | — | — | — | — | ✅ | — |
| `accessByDepartment` | — | — | — | — | ✅ | — |
| `accessIncidents` | — | — | — | — | ✅ | — |
| `auditEvents` | — | (written by patient actions) | — | — | ✅ | ✅ via `logAdminEvent` |
| `complianceState` / `complianceChecks` | — | — | — | — | ✅ | — |

Hard rule for the **admin** surface: never render any field that originates
from `patients`, `analyses`, `documents`, `complaints`, `planItems`,
`appointments`, `doctorRequests`, `esignRecords`, `consentBundles`. Admin
only reads aggregates from the dedicated admin slices.

---

## 3. Selector inventory (`src/store/selectors.ts`)

Existing (in use by patient + doctor):
- `selectActivePatient(s)` — current patient on the patient surface.
- `selectDoctorActivePatient(s)` — patient open in cockpit.
- `selectUnseenRequests(s)` — doctor requests not yet seen by current patient.
- `selectRequestsForPatient(s, patientId)` — all requests for a patient.
- `selectPlanItemsForPatient(s, patientId?)` — grouped by status.
- `selectAnalysesForPatient(s, patientId?)` — sorted desc by `uploadedAt`.
- `selectDocumentsForPatient(s, patientId?)`.
- `selectComplaintsForPatient(s, patientId?)`.
- `selectAppointmentsForPatient(s, patientId?)`.
- `selectAppointmentForPatient(s, patientId?)` — first `main` appointment.
- `selectDocumentReadiness(s)` — `{uploaded, total, percent}` for required docs.
- `selectPrepIsComplete(s)` — boolean rollup for the patient surface.
- `selectPrepProgress(s)` — `{done, total, label}` for the prep banner.

New (shared):
- `selectActiveAccessGrants(s)` — grants without `revokedAt`.
- `selectAccessGrantsForPatient(s, patientId?)`.

New (admin):
- `selectKpiTrend(s, kpi)` — sorted ascending by date for a single KPI.
- `selectRecentAuditEvents(s, limit?)` — most-recent journal entries.
- `selectComputedComplianceState(s)` — derives green/amber/red from `complianceChecks`; falls back to `complianceState`.

Hooks live in `src/store/hooks.ts`. Coder agents may add new local hooks
under `src/components/<surface>/` but should reuse the selectors above.

---

## 4. Action inventory (`src/store/actions.ts`)

Existing (DO NOT change signatures):
- `saveAccountDraft(draft)`
- `signAccessGrant({ draft? })` → `{ patient, esign, grantId }`
- `submitConsentBundle(consents)`
- `clearOnboarding()`
- `completeEntryFlow({ name, dob, gender, phone, email? })` — fast-forward used by `segments.ts`.
- `uploadAnalysis({ type, planItemId?, fileUrl? })`
- `editOcrField(analysisId, field, value)`
- `uploadDocument({ type, label, fileUrl? })`
- `addComplaint(text)`
- `openPatientRecord(patientId)`
- `sendRequest({ title, body, items })`
- `openNotification(requestId)`
- `acknowledgeAnalysis(analysisId)`
- `bookMainAppointment({ date })`
- `resetToSeed()`

New:
- `setComplaintTags(complaintId, tags: ComplaintTag[])` — patient surface.
- `revokeAccess(grantId)` — patient surface, also writes an `AuditEvent`.
- `extendAccess(grantId, newExpiresAt)` — patient surface, also writes an `AuditEvent`.
- `logAdminEvent(type, target, note?)` — admin surface, append to journal.
- `markIncidentSeen(type)` — admin surface, analytics-only (no state change).

---

## 5. Frozen shared components

Components in **`src/components/*.tsx` (root level)** are frozen. Coder
agents may import and compose them but must NOT modify them inside this
freeze:

```
AccessCard.tsx        ActionCard.tsx        AnalysisListItem.tsx
AppShell.tsx          AppointmentCard.tsx   BottomCTA.tsx
ChecklistStep.tsx     MetricRow.tsx         NotificationBanner.tsx
PartnerHeader.tsx     PlanItemRow.tsx       PrimaryButton.tsx
SecondaryButton.tsx   StatusChip.tsx        VasiliyTip.tsx
```

Also frozen: `src/components/primitives/*` (Avatar, BottomSheet, Button,
Card, Chip, FAB, Input, StatusBadge, TabBar) and `src/components/system/*`.

Surface-owned (each agent writes inside their own folder):
- Patient: `src/components/patient/*` and `src/routes/patient/*`.
- Doctor: `src/components/doctor/*` and `src/routes/doctor/*`.
- Admin: `src/components/admin/*` (NEW — coder agent may create) and
  `src/routes/admin/*` (NEW — coder agent may create).

If a shared root-level component is missing a needed prop variant, write a
follow-up note (see §7) instead of editing in-place.

---

## 6. Routing convention

- Patient routes → `/patient/*` (existing — owned by patient agent).
- Doctor routes → `/doctor/*` (existing — owned by doctor agent).
- Admin routes → `/admin/*` (NEW — owned by admin agent).

`App.tsx` is **out of bounds** for the freeze. Coder agents do NOT edit it.
Instead, write the proposed routes table to:

```
docs/contract-followups/<surface>-routes.md
```

Format example:

```markdown
# admin-routes

| Path | Component | Notes |
|------|-----------|-------|
| /admin | <AdminOverview /> | KPI cards + trend |
| /admin/access | <AdminAccess /> | departments + incidents + compliance |
| /admin/kpi/:id | <AdminKpiPlaceholder /> | drill-down stub |
```

The human integrator merges these into `App.tsx` after the freeze.

---

## 7. Followup mechanism

If you (a coder agent) discover a contract gap mid-implementation, do not
modify the shared store. Instead create / append:

```
docs/contract-followups/<surface>.md
```

Each entry must include:

```markdown
## <field-or-action-name>
- **why**: one-sentence rationale tied to a spec id.
- **proposed-shape**: ts type or signature.
- **callsites**: where you would use it.
- **fallback**: what you implemented locally as a stopgap.
```

The freeze owner reviews follow-ups and either lifts them into the contract
or pushes back with an alternative.

---

## 8. Russian copy reminder

- Primary UI language: **Russian**, formal Вы.
- Partner context (ЭНЦ) must be visible on every patient screen.
- Forbidden vocabulary: «диагноз», «назначение лечения», «рецепт» (as a
  core function), «срочно / угрожает» style alarmism.
- Allowed AI-style copy: summaries, clarifications, examination guidance,
  preparation help — always with a disclaimer (e.g.
  «Это не заменяет консультацию врача»).
- Admin copy is operational only: «адопшн», «доля подготовленных визитов»,
  «доля распознанных документов», «истекают в ближайшие 7 дней». Never
  show patient names or ids in the admin surface.

---

## 9. Mock-data anchors

- Partner clinic: `id: 'enc'`, ЭНЦ, «Эндокринологический научный центр».
- Doctor: `id: 'd1'`, Иванов Сергей Петрович (демо-кокпит).
- Demo patient created by onboarding: `id: 'p1'`, Анна Петрова.
- Cockpit list: `p2` (Волков С. Н.), `p3` (Михайлова Е. В.).
- Admin departments: «Эндокринология», «Терапия», «Лабдиагностика»
  (see `src/data/adminMockData.ts`).
- KPI seed values: `onboarded: 128`, `prepRate: 72`, `ocrRate: 89` for the
  пилот ЭНЦ, апрель 2026 period.

---

## 10. Verification commands

Coder agents MUST keep the following green at all times:

```bash
npx tsc --noEmit
npm run build
```

The freeze was sealed against these passing.
