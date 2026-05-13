# Поиск по названию / типу анализа

## 1. Title
- Feature name: Поиск по названию / типу анализа
- Source feature name, if different: Old analyses name and type search
- Feature layer / epic / product area: Layer 1 / Старые анализы / Supporting

## 2. Purpose
This feature / flow step lets the patient enter a search query so that пациент быстро находит нужные анализы для подготовки. It exists to support the IntelDoc preparation workflow with minimal integration assumptions and explicit handling of sensitive patient data.

## 3. Source normalization notes
- Source row/block: row 4; Feature layer = Layer 1; Epic = Старые анализы; Epic flow = Пациент быстро находит нужные анализы для подготовки; Feature = Поиск по названию / типу анализа; Epic path priority = Supporting.
- Normalized feature name: Old analyses name and type search
- Source fields used: Feature layer, Epic, Epic flow, Feature, Epic path priority.
- Source ambiguity: The CSV defines feature intent and priority but does not define exact UI copy, backend APIs, data schema, visual layout, or scheduling/document storage implementation.
- Assumptions made: MVP behavior uses IntelDoc-owned preparation records and mocked or internal services unless a project-approved integration is separately specified.

## 4. Recommended use in Claude Code
- How Claude Code should use this file: Treat this as implementation context for the feature behavior, states, access checks, analytics, and acceptance logic.
- Expected implementation target: Patient-side old analyses / preparation history.
- Related files or areas, if known: Existing patient preparation, document, analysis, complaint, dossier, and booking modules if present in the app.
- What Claude Code should not infer: Do not infer EHR, lab, insurance, or external scheduling integrations; do not add diagnostic, prescription, or treatment-decision logic.

## 5. Product guardrails
- Minimal integration assumptions: Use internal records, pilot-safe handoffs, or mocked service boundaries for MVP; external integrations are future dependency / out of scope for MVP unless explicitly approved.
- Access control expectations: Patient access must be scoped to the owning patient/preparation case; Doctor with explicit patient-granted or appointment-scoped access access requires explicit grant, appointment-scoped access, or another approved policy before sensitive data is rendered.
- Auditability expectations: Doctor/admin access to prior analysis content is audit-sensitive; patient self-view is product analytics unless project policy requires audit.
- AI/medical wording restrictions: The UI must not state or imply diagnosis, prescription, or treatment decisions. Any guidance wording must remain logistical, preparatory, or source-contextual.
- Original vs structured data handling, if relevant: Original analysis documents remain separate from structured extracted fields.

## 6. Open product decisions
- Decision: Exact UI copy, component placement, and whether this feature is required before main booking.
- Why it is open: The source CSV provides feature layers and flows but not detailed screen designs or business rules.
- Recommended default for MVP: Implement the smallest usable version that supports the stated flow, clear blocked/error states, explicit permissions, and analytics.

## 7. Clean block table
| Block | Description | Actor | Input | System behavior | Output / next state |
|-------|-------------|-------|-------|-----------------|---------------------|
| Entry | User reaches the feature from the preparation flow. | Patient | Authenticated session and preparation case id. | Verify ownership or approved access before loading sensitive content. | Feature default or blocked state. |
| Primary action | User performs the main action: enter a search query. | Patient | User selection, query, upload, status change, or request payload as applicable. | Matches query against title, document name, and analysis type fields. | Shows filtered results without changing source records. |
| Follow-through | User continues the preparation journey. | Patient | Current feature state and any saved object references. | Persist allowed changes and keep originals separate from structured data. | Lets patient open a matching result or clear search. |
| Audit/analytics | Sensitive action or product milestone occurs. | System | Actor id, object id, action, timestamp, source surface. | Record audit event where sensitive data is viewed or changed; record analytics for product behavior. | Traceable event and measurable funnel state. |

## 8. Screen role in the product
- Product surface: Patient-side old analyses / preparation history.
- Upstream step: Patient has uploaded or imported at least one prior analysis result, or opens the history area.
- Downstream step: Patient opens a specific analysis, narrows the list, or includes relevant results in visit preparation.
- Role in patient / doctor / admin workflow: Supports preparation while keeping patient-controlled access, source verification, and pilot practicality explicit.

## 9. Scope
### In scope
- Render or execute the feature described by the source row within the relevant preparation surface.
- Enforce ownership and explicit access before showing patient-sensitive content.
- Show clear default, loading, empty, error, success, and blocked states.
- Preserve source context and distinguish original/source data from structured or derived metadata where applicable.

### Out of scope
- External EHR, laboratory, insurance, or scheduling integrations unless separately approved.
- Clinical interpretation, diagnosis, prescription, or treatment recommendations.
- Broad admin tooling beyond the minimum access/audit behavior needed for pilot use.
- Complex automation that changes patient data without direct user action or approved workflow rules.

### Dependencies
- Authenticated user session and preparation case ownership/access model.
- Internal storage or mocked service boundary for previously uploaded analysis results.
- Shared audit/analytics event conventions for sensitive preparation actions.
- Existing navigation shell for patient preparation and booking flows.

## 10. User flow
### Entry conditions
- User is authenticated.
- A preparation case or appointment context exists when required by the surface.
- The system can verify patient ownership or approved doctor/admin access before rendering sensitive content.

### Happy path
1. Patient enters the feature from the relevant preparation surface.
2. System validates access and loads the minimum required data for Поиск по названию / типу анализа.
3. System displays the default state with clear source/status information and available actions.
4. Patient completes the primary action: enter a search query.
5. System persists the allowed state change or view state, records required audit/analytics events, and shows the next state.

### Alternative / edge paths
- Trigger: Required source data is missing or incomplete.
- Behavior: Show a partial-data state using available source labels, avoid hiding originals, and explain what is missing without clinical interpretation.
- Outcome: User can continue, retry, or provide missing data where supported.

- Trigger: Access cannot be verified.
- Behavior: Block sensitive content before render and show a non-revealing access message.
- Outcome: No patient data is exposed; blocked access is traceable where required.

- Trigger: Save, upload, search, filter, or booking request fails.
- Behavior: Preserve user input where safe, show retry/cancel options, and avoid duplicate records or duplicate requests.
- Outcome: User can recover without corrupting preparation data.

## 11. UX requirements
- Layout/content requirements: Keep the surface scannable, show the feature title/status, and expose source/status metadata needed for preparation without dense clinical language.
- Primary actions: Provide the main action for this feature only when prerequisites and permissions are satisfied.
- Secondary actions: Back, clear, retry, replace, view original, or continue actions should appear only where relevant to this feature state.
- Empty/error/helper copy requirements: Copy must explain logistical status and next action; it must not imply diagnosis, treatment, or medical certainty.
- Accessibility/responsiveness notes: Controls must be keyboard accessible, screen-reader labeled, and usable on mobile widths without truncating critical document, complaint, or booking status text.

## 12. States
### Default
- Show the feature with current data, source/status indicators, and permitted primary/secondary actions.

### Loading
- Show skeleton or spinner while loading only the data needed for this feature; do not flash sensitive data before access checks complete.

### Empty
- Show a clear empty state when no relevant previously uploaded analysis results exists; include the next safe action if available.

### Error
- Show a non-destructive error with retry. Do not expose internal storage, permission, or partner-system details.

### Success
- Confirm the user-visible state change or successful load, and update related preparation/readiness indicators if applicable.

### Blocked / disabled
- Disable actions when required data, permissions, or prerequisites are missing; block rendering of sensitive content when access is not verified.

## 13. Functional requirements
### FR1. Access-scoped feature load
- Description: Load only data the current actor is allowed to access for Поиск по названию / типу анализа.
- Rules: Verify patient ownership or approved access before rendering sensitive fields; patient data from other cases must never be shown.
- Validation: Missing or invalid preparation case id returns blocked or not-found behavior without revealing object existence across patients.
- Persistence: Access checks do not mutate feature data; blocked attempts may create audit/security events according to project policy.

### FR2. Primary feature behavior
- Description: Support the core behavior where the user can enter a search query.
- Rules: Keep behavior limited to the source feature intent and current preparation context.
- Validation: Validate required inputs, object ids, file states, query/filter values, or booking selections before persistence.
- Persistence: Persist only approved state changes and keep user-entered/source data distinct from derived structured metadata.

### FR3. State and recovery handling
- Description: Provide deterministic default, loading, empty, error, success, and blocked states.
- Rules: Failed operations must not create duplicates, remove originals, or silently change readiness/booking state.
- Validation: Error states must be reachable in tests through mocked service failures or invalid access.
- Persistence: Retry should be idempotent where possible; partial uploads or requests should remain traceable.

### FR4. Audit and analytics instrumentation
- Description: Record sensitive actions and product funnel events relevant to Поиск по названию / типу анализа.
- Rules: Audit events use actor, action, object, timestamp, and surface; analytics use de-identified or hashed identifiers where needed.
- Validation: Events fire once per successful meaningful action and are not emitted for blocked renders except where security audit requires it.
- Persistence: Audit logs must be append-only or follow the project-approved immutable audit pattern.

## 14. Definition of Done
- The feature follows the canonical behavior from this spec and preserves the source row intent.
- Access checks are implemented before sensitive patient data is rendered or mutated.
- Default, loading, empty, error, success, and blocked/disabled states are implemented or explicitly stubbed for MVP.
- Original/source data remains distinguishable from structured or derived data where documents, complaints, or dossier entries are involved.
- Audit-sensitive actions and analytics events are wired or documented as implementation stubs.
- No diagnostic, prescription, or treatment-decision wording is introduced.
- Tests or QA checklist cover happy path, missing data, failed operation, and blocked access.

## 15. Suggested analytics events
| Event | Trigger | Properties | Success signal |
|-------|---------|------------|----------------|
| old_analyses_name_type_search_viewed | User opens the feature surface after access validation. | feature_id, epic, layer, priority, actor_type, has_existing_data | Feature reach and empty/error rates are measurable. |
| old_analyses_name_type_search_primary_action | User completes the primary action for the feature. | feature_id, action_type, result_state, priority, preparation_case_id_hash | Users can progress through the preparation flow. |
| old_analyses_name_type_search_blocked | System blocks access or disables the primary action. | feature_id, reason_code, actor_type, surface | Permission or prerequisite issues are visible without exposing sensitive data. |

## 16. Suggested implementation notes for Claude Code
- Suggested components/modules: Feature-specific block or screen component inside the preparation surface; shared status, empty/error, audit, and analytics helpers if present.
- Suggested data objects: AnalysisRecord, OriginalDocument, StructuredExtraction, PreparationDossierReference.
- Suggested state model: `idle`, `loading`, `ready`, `empty`, `saving`, `success`, `error`, `blocked` with explicit reason codes for blocked/error states.
- Suggested tests: Access allowed, access blocked, empty data, primary action success, primary action failure, analytics event emission, and no cross-patient data render.
- Implementation cautions: Keep MVP integration-light; do not add external partner APIs, medical decision logic, or hidden automation beyond the source feature scope.

## 17. Suggested file role inside project
- Suggested path: product/features/004-old-analyses-name-type-search.md
- File role: Claude Code-ready feature specification for implementation planning and QA alignment.
- Related specs: Other specs in the same epic `Старые анализы` and adjacent source-order preparation features.
- Ownership notes: Product/design owns unresolved workflow decisions; engineering owns access checks, state handling, persistence boundaries, and audit/analytics implementation.
