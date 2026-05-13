# Review Verdict
- Status: PASS WITH FIXES
- Summary: Structurally complete 17-section feature spec for `План новых анализов от врача` and aligned with the broad IntelDoc guardrails. It is not fully implementation-ready because key behavior remains templated/generic, especially feature-specific state logic, access lifecycle, audit details, and analytics acceptance criteria.

## What is strong
- The artifact type is clear enough for review as a feature and the file follows the canonical section structure.
- The spec correctly makes plan creation audit-sensitive and keeps external lab/EHR integration out of MVP.
- The spec avoids EHR/lab/insurance/scheduling integration assumptions and avoids diagnostic, prescription, or treatment-decision language.

## Critical issues
1. Doctor-authored plan rules are not actionable enough
- Severity: Medium
- Where: Sections 5, 7, 10, 11, 13, and 14.
- Problem: The spec does not define required plan item fields, save/publish semantics, patient visibility timing, update/version rules, or doctor authority boundaries.
- Why it matters: Plan creation changes patient-facing preparation tasks; vague rules can create accidental visibility, unaudited edits, or plan items that cannot be completed.
- Recommended fix: Add explicit draft/publish/update behavior, required fields, author attribution, and audit events.

2. Access lifecycle and audit details are too generic
- Severity: Medium
- Where: Sections 5, 10, 13, 14, and 15.
- Problem: Access control says ownership or approved access is required, but does not define grant source, expiration/revocation, invalid-access behavior per actor, or exact audit event names for sensitive views/mutations.
- Why it matters: IntelDoc requires explicit access control and auditability for patient data; generic language leaves implementation and QA to infer security behavior.
- Recommended fix: Add role-specific access lifecycle rules, revocation/expiration behavior, and explicit audit events with actor, object, surface, and result.

3. Analytics and DoD are present but not sufficiently feature-specific
- Severity: Medium
- Where: Sections 14 and 15.
- Problem: The analytics events use generic viewed/primary_action/blocked patterns, and the DoD does not assert the feature-specific rules that make this spec testable.
- Why it matters: Product success and QA cannot distinguish meaningful actions, error causes, or readiness outcomes if instrumentation remains generic.
- Recommended fix: Add event properties tied to the feature-specific state model and extend DoD with concrete acceptance checks for this feature.

## Missing pieces
- Plan item schema; draft vs published state; patient notification/visibility timing; version/audit rules for updates; delete behavior.
- Role-specific access lifecycle: grant source, expiration, revocation, and invalid-access outcome.
- Explicit audit event names for sensitive view/create/update actions and blocked access where security review requires it.
- Feature-specific analytics properties beyond generic `primary_action`.
- DoD checks that assert the concrete feature rules, not only the shared template guarantees.

## Guardrail violations
- No direct AI diagnosis/prescription/treatment wording violation found; guardrail gaps are mostly missing specificity, not prohibited behavior.
- Minimal integration guardrail is respected at a high level.
- Access control and auditability are acknowledged but need explicit lifecycle and event detail before implementation.
- Analytics should use de-identified identifiers and must not include raw patient text, document contents, or extracted clinical values.

## Patch suggestions
### Patch 1
```md
Add to FR2: A doctor-created analysis plan item must include display name, optional preparation note, required/optional flag if supported, author doctor id, preparation case id, and status. Saving a draft does not notify the patient; publishing makes the plan visible to the owning patient and records an audit event. Updates must retain author/time metadata and should not delete patient-uploaded results without an explicit audited remove action.
```

### Patch 2
```md
Add to Product guardrails / Functional requirements: Access grants must be resolved before rendering sensitive fields. Define allowed actors for this surface, grant source, expiration/revocation behavior, and blocked-access result. Audit sensitive actions with actor_id, actor_type, patient/preparation_case id, object id, action, result, timestamp, and surface; do not include raw clinical text in analytics payloads.
```

### Patch 3
```md
Add to Suggested analytics events / DoD: Replace the generic primary_action event with a feature-specific event name and properties for result_state, reason_code, object/status count, and source surface. Extend DoD so QA verifies the feature-specific state model, blocked access, audit event emission for sensitive views/mutations, and no leakage of original document or patient-entered content into analytics.
```

## Final recommendation
- Ready after fixes
- Next best action: Apply the targeted patches above to the source spec before handing it to Claude Code for implementation.
- Owner: Product for unresolved workflow/access decisions; engineering for implementation mapping, tests, audit, and analytics wiring.
