# Редактирование актуальных жалоб

## 1. Title
- Feature name: Редактирование актуальных жалоб
- Source feature name, if different: Same as source.
- Feature layer / epic / product area: Patient dashboard / preparation journey / Жалобы / Supporting

## 2. Purpose
This flow step supports the patient dashboard preparation journey by letting the patient edits current self-reported complaints before the visit. It exists so the patient can understand preparation progress before the main doctor visit while keeping sensitive health data access-scoped and audit-ready.

## 3. Source normalization notes
- Source row/block: row 18; Epic = Жалобы; Epic Flow = Пациент уточняет жалобы перед визитом.; Feature = Редактирование актуальных жалоб; Happy path = Supporting; Priority = Should-have.
- Normalized feature name: Редактирование актуальных жалоб
- Source fields used: row number, Epic, Epic Flow, Feature, Happy path, Priority, source extraction notes.
- Source ambiguity: The handwritten-board-derived table defines intent and priority but not exact UI copy, component layout, backend schema, permission model names, or partner operational process.
- Assumptions made: MVP uses IntelDoc-owned preparation records, patient-controlled access, and internal/mocked service boundaries. Use IntelDoc-owned records or mocked/internal service boundaries; external systems are future dependency / out of scope for MVP unless explicitly approved.

## 4. Recommended use in Claude Code
- How Claude Code should use this file: Treat this as implementation context for behavior, states, permissions, audit expectations, analytics, and QA acceptance for this single feature.
- Expected implementation target: Patient dashboard / complaints.
- Related files or areas, if known: Patient dashboard, preparation case, analyses, documents, complaints, dossier, and booking/request modules if present.
- What Claude Code should not infer: Do not add external EHR, lab, insurance, LPU, or live scheduling integrations; do not add diagnosis, prescription, treatment recommendation, or autonomous medical decision logic.

## 5. Product guardrails
- Minimal integration assumptions: Use IntelDoc-owned records or mocked/internal service boundaries; external systems are future dependency / out of scope for MVP unless explicitly approved.
- Access control expectations: Patient can access only their own preparation case. Doctor, clinic staff, or admin access requires explicit patient grant, appointment-scoped access, or another approved IntelDoc policy before sensitive data is rendered.
- Auditability expectations: Creates, uploads, edits, links, or booking requests must be logged with actor, object, action, timestamp, and preparation case.
- AI/medical wording restrictions: UI and system messages must remain logistical and preparatory. They must not state diagnosis, prescribe actions, rank clinical urgency, or imply treatment decisions.
- Original vs structured data handling, if relevant: Patient-entered complaint text remains distinct from categories/tags and any derived display grouping.

## 6. Open product decisions
- Decision: Exact UI copy, visual placement on the dashboard, allowed role names, and final readiness/booking thresholds for this feature.
- Why it is open: The source table provides feature intent and priority but does not define detailed screen design, domain data model, or operational partner process.
- Recommended default for MVP: Implement the smallest usable version that supports the source flow, explicit access checks, clear states, pilot-safe persistence, and analytics instrumentation.

## 7. Clean block table
| Block | Description | Actor | Input | System behavior | Output / next state |
|-------|-------------|-------|-------|-----------------|---------------------|
| Entry | User reaches this feature from the patient dashboard preparation journey. | Patient | Authenticated session and preparation case id. | Verify ownership or approved access before loading sensitive content. | Default, loading, empty, or blocked state. |
| Primary behavior | Patient edits current self-reported complaints before the visit. | Patient | User action and relevant object ids or form values. | saves patient edits with timestamps and preserves audit history for sensitive changes. | current complaint entry reflects the latest patient-provided wording. |
| Recovery | Required data, upload, save, search, filter, or request operation is unavailable or fails. | Patient / System | Error reason and current unsaved state. | Preserve safe user input, avoid duplicate writes, and show retry/back/clear actions. | Recoverable error or previous safe state. |
| Audit and analytics | Sensitive view, mutation, link, upload, or funnel milestone occurs. | System | Actor id, object id, action, timestamp, surface, preparation case id. | Record audit event where required and analytics event with de-identified identifiers. | Traceable security/compliance record and measurable product event. |

## 8. Screen role in the product
- Product surface: Patient dashboard / complaints.
- Upstream step: Patient views existing complaints and chooses to edit.
- Downstream step: Updated complaint display appears in preparation context for approved doctor access.
- Role in patient / doctor / admin workflow: Patient-side preparation surface that may later provide source-backed context to a doctor only under approved access. Admin visibility, if needed, is limited to support/audit workflows and must not expose patient data without policy-backed access.

## 9. Scope
### In scope
- Implement the source feature intent for Редактирование актуальных жалоб inside the patient dashboard preparation journey.
- Enforce access checks before sensitive data is displayed, linked, uploaded, edited, or requested.
- Provide default, loading, empty, error, success, and blocked/disabled states.
- Record analytics for feature reach, primary action, and blocked/error outcomes.
- Keep originals, patient-entered data, structured metadata, and readiness/status indicators visually and technically distinguishable where relevant.

### Out of scope
- External EHR, laboratory, insurance, LPU, or live scheduling integrations unless separately approved.
- Clinical interpretation, diagnosis, treatment recommendations, prescriptions, urgency scoring, or automated medical decision logic.
- Broad admin tooling, partner back-office automation, payment, claims processing, or medical document validation beyond MVP pilot needs.
- AI-generated medical guidance or automatic transformation of uploaded documents into clinical conclusions.

### Dependencies
- Authenticated user session and preparation case access model.
- Internal or mocked service boundary for the relevant dashboard data.
- Shared audit and analytics event conventions.
- Existing dashboard navigation, error handling, and responsive UI primitives if present.
- Future dependency / out of scope for MVP unless explicitly approved: any undefined external system named or implied by the workflow.

## 10. User flow
### Entry conditions
- Patient is authenticated.
- A patient-owned preparation case exists or the feature can show a safe empty state.
- The system can verify access before rendering patient-sensitive fields.

### Happy path
1. Patient opens the relevant dashboard area for Жалобы.
2. System validates access to the preparation case and loads only data needed for Редактирование актуальных жалоб.
3. System shows the default state with source/status context and permitted actions.
4. Patient edits current self-reported complaints before the visit.
5. System saves patient edits with timestamps and preserves audit history for sensitive changes and records required analytics/audit events.
6. Patient sees the next state: current complaint entry reflects the latest patient-provided wording.

### Alternative / edge paths
- Trigger: Required source data is missing, empty, or not configured.
- Behavior: Show an empty or partial-data state with logistical next action; do not infer medical meaning.
- Outcome: Patient can continue, retry, clear input, upload missing material, or return to the dashboard.

- Trigger: Access cannot be verified.
- Behavior: Block sensitive content before render and show a non-revealing access message.
- Outcome: No patient data is exposed; blocked attempt is traceable according to policy.

- Trigger: Save, upload, link, search, filter, or booking request fails.
- Behavior: Preserve safe user input, avoid duplicate records/requests, and show retry/cancel/back actions.
- Outcome: Patient can recover without corrupting preparation data or losing originals.

## 11. UX requirements
- Layout/content requirements: Keep the block scannable on the dashboard with clear title, status, source context, and next action. Avoid dense medical wording and avoid hiding source/original availability.
- Primary actions: Expose only actions that are allowed by current permissions and prerequisites for Редактирование актуальных жалоб.
- Secondary actions: Back, retry, clear, view original, replace, edit, or continue actions should appear only when relevant to the current state.
- Empty/error/helper copy requirements: Copy must describe logistical preparation status and what the patient can do next. It must not imply diagnosis, treatment need, clinical urgency, or medical certainty.
- Accessibility/responsiveness notes: All controls must be keyboard accessible, screen-reader labeled, and usable on mobile without truncating critical dates, statuses, document names, or booking/request states.

## 12. States
### Default
- Show current feature data, source/status indicators, and permitted primary/secondary actions for Редактирование актуальных жалоб.

### Loading
- Show a skeleton or progress indicator while loading only the minimum required data; do not flash sensitive content before access checks complete.

### Empty
- Show a clear empty state when no relevant data exists; provide a safe next action if the source flow supports one.

### Error
- Show a recoverable error with retry/back/cancel where appropriate. Do not expose internal service, permission, partner, or storage details.

### Success
- Confirm the successful view, upload, link, edit, filter, selection, or request state and update related preparation/readiness indicators if applicable.

### Blocked / disabled
- Disable or hide actions when required data, permissions, or prerequisites are missing. Block sensitive data rendering when access is not verified.

## 13. Functional requirements
### FR1. Access-scoped feature load
- Description: Load Редактирование актуальных жалоб only for the current patient-owned or otherwise approved preparation case.
- Rules: Verify access before rendering sensitive fields; never expose another patient's data or object existence through error copy.
- Validation: Missing, invalid, or unauthorized preparation case ids produce blocked/not-found behavior with non-revealing messaging.
- Persistence: Access checks do not mutate feature data; blocked attempts may create audit/security events according to policy.

### FR2. Primary feature behavior
- Description: Support the core behavior where the patient edits current self-reported complaints before the visit.
- Rules: Keep the behavior limited to the source row intent and current preparation context. Use IntelDoc-owned records or mocked/internal service boundaries; external systems are future dependency / out of scope for MVP unless explicitly approved.
- Validation: Validate required object ids, form values, filters, file states, or request selections before persistence or state transition.
- Persistence: Persist only approved state changes. Keep source/original data separate from structured metadata and display/status fields where relevant.

### FR3. State and recovery handling
- Description: Provide deterministic default, loading, empty, error, success, and blocked/disabled states.
- Rules: Failed operations must not create duplicates, remove originals, overwrite patient-entered data, or silently change readiness/booking state.
- Validation: Error and blocked states must be testable through mocked service failures, missing prerequisites, and invalid access.
- Persistence: Retry operations should be idempotent where possible; partial uploads, edits, links, or requests must remain traceable.

### FR4. Audit and analytics instrumentation
- Description: Record sensitive actions and product funnel events relevant to Редактирование актуальных жалоб.
- Rules: Audit events include actor, action, object, timestamp, surface, and preparation case. Analytics events use de-identified or hashed identifiers where needed.
- Validation: Events fire once per successful meaningful action and are not duplicated on retry, re-render, or validation failure unless security audit requires it.
- Persistence: Audit logs must be append-only or follow the project-approved immutable audit pattern.

## 14. Definition of Done
- The feature follows this spec and preserves source row 18 intent.
- Access checks run before sensitive patient data is rendered or mutated.
- Default, loading, empty, error, success, and blocked/disabled states are implemented or explicitly stubbed for MVP.
- Original/source data remains distinguishable from structured, extracted, or derived data where documents, labs, complaints, or dossier entries are involved.
- Undefined external systems are not integrated; they are represented only as internal handoff/mock/future dependency boundaries.
- Audit-sensitive actions and analytics events are wired or documented as implementation stubs.
- UI copy avoids diagnosis, prescription, treatment-decision, urgency-ranking, or medical certainty language.
- Tests or QA checklist cover happy path, missing data, failed operation, blocked access, and no cross-patient data render.

## 15. Suggested analytics events
| Event | Trigger | Properties | Success signal |
|-------|---------|------------|----------------|
| current_complaints_editing_viewed | Patient opens the feature surface after access validation. | feature_id, source_row, epic, priority, actor_type, has_existing_data | Reach, empty rate, and error rate are measurable. |
| current_complaints_editing_primary_action | Patient completes the primary action for this feature. | feature_id, source_row, action_type, result_state, preparation_case_id_hash | Patient progresses through the preparation journey. |
| current_complaints_editing_blocked | System blocks access or disables the primary action. | feature_id, source_row, reason_code, actor_type, surface | Permission or prerequisite issues are visible without exposing sensitive data. |

## 16. Suggested implementation notes for Claude Code
- Suggested components/modules: Feature-specific dashboard block or flow component for Жалобы; shared status, empty/error, permission, audit, and analytics helpers if present.
- Suggested data objects: ComplaintEntry, ComplaintRevision, PreparationCase, AuditEvent.
- Suggested state model: `idle`, `loading`, `ready`, `empty`, `saving`, `success`, `error`, `blocked` with explicit reason codes for blocked/error states.
- Suggested tests: Access allowed, access blocked, empty data, primary action success, primary action failure, state recovery, analytics event emission, and no cross-patient data render.
- Implementation cautions: Keep MVP integration-light; do not add external partner APIs or clinical decision logic. Treat undefined external systems as future dependency / out of scope for MVP unless explicitly approved.

## 17. Suggested file role inside project
- Suggested path: product/features/doctor-dashboard/18-current-complaints-editing.md
- File role: Claude Code-ready feature specification for implementing and QA-checking this dashboard feature.
- Related specs: Other specs in `product/features/doctor-dashboard/` within the same epic and adjacent preparation journey rows.
- Ownership notes: Product/design owns unresolved workflow and copy decisions; engineering owns access checks, state handling, persistence boundaries, and audit/analytics implementation.
