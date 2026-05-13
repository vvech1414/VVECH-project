# Review Verdict
- Status: PASS WITH FIXES
- Summary: Structurally complete 17-section feature spec for `Загрузка результата по назначенному анализу` and aligned with the broad IntelDoc guardrails. It is not fully implementation-ready because key behavior remains templated/generic, especially feature-specific state logic, access lifecycle, audit details, and analytics acceptance criteria.

## What is strong
- The artifact type is clear enough for review as a flow step and the file follows the canonical section structure.
- The spec preserves original result documents and links upload intent to the assigned plan item.
- The spec avoids EHR/lab/insurance/scheduling integration assumptions and avoids diagnostic, prescription, or treatment-decision language.

## Critical issues
1. Upload validation and recovery rules are underdefined
- Severity: Medium
- Where: Sections 7, 10, 11, 12, 13, and 14.
- Problem: The spec does not define accepted file types/sizes, duplicate handling, upload progress, cancellation, replacement, poor OCR handling, or whether a result can be uploaded before link confirmation.
- Why it matters: Uploads are sensitive and failure-prone; vague handling risks duplicate records, lost originals, or unreadable result states.
- Recommended fix: Specify upload constraints, progress/retry/cancel behavior, duplicate/replacement rules, and original preservation.

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
- File type/size constraints; progress/cancel/retry states; duplicate handling; replacement behavior; OCR quality fallback.
- Role-specific access lifecycle: grant source, expiration, revocation, and invalid-access outcome.
- Explicit audit event names for sensitive view/create/update actions and blocked access where security review requires it.
- Feature-specific analytics properties beyond generic `primary_action`.
- DoD checks that assert the concrete feature rules, not only the shared template guarantees.

## Guardrail violations
- Potential source-data risk: original documents are mentioned, but quality/OCR failure and structured-metadata edit rules need explicit acceptance criteria.
- Minimal integration guardrail is respected at a high level.
- Access control and auditability are acknowledged but need explicit lifecycle and event detail before implementation.
- Analytics should use de-identified identifiers and must not include raw patient text, document contents, or extracted clinical values.

## Patch suggestions
### Patch 1
```md
Add to FR2: Upload from an assigned analysis item must store the original file before any extraction. MVP must define accepted file types and max size in implementation config, show upload progress, support retry after failure, and prevent duplicate successful submissions for the same file/plan item. Replacement requires explicit user action and must retain audit history for the prior original.
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
