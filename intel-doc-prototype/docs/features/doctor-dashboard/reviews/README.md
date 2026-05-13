# Doctor Dashboard Feature Spec Reviews

## Scope
- Reviewed folder: `product/features/doctor-dashboard/`
- Total specs reviewed: 25
- Skipped as non-feature spec: `product/features/doctor-dashboard/README.md`
- Review standard used: `product/instructions/feature-review-agent.md`

## Verdict Counts
- PASS: 0
- PASS WITH FIXES: 25
- BLOCKED: 0

## Reviewed Specs
| Spec file | Review file | Verdict | Top issue |
|---|---|---|---|
| `product/features/doctor-dashboard/01-old-analyses-list.md` | `product/reviews/01-old-analyses-list.review.md` | PASS WITH FIXES | List behavior is still too generic for implementation |
| `product/features/doctor-dashboard/02-old-analysis-card.md` | `product/reviews/02-old-analysis-card.review.md` | PASS WITH FIXES | Original document and extracted metadata review states are underspecified |
| `product/features/doctor-dashboard/03-old-analyses-period-filter.md` | `product/reviews/03-old-analyses-period-filter.review.md` | PASS WITH FIXES | Filter rules and boundary cases are not precise enough |
| `product/features/doctor-dashboard/04-old-analyses-name-type-search.md` | `product/reviews/04-old-analyses-name-type-search.review.md` | PASS WITH FIXES | Search matching behavior is too ambiguous |
| `product/features/doctor-dashboard/05-doctor-new-analysis-plan.md` | `product/reviews/05-doctor-new-analysis-plan.review.md` | PASS WITH FIXES | Doctor-authored plan rules are not actionable enough |
| `product/features/doctor-dashboard/06-new-analyses-list.md` | `product/reviews/06-new-analyses-list.review.md` | PASS WITH FIXES | Patient-facing plan list lacks item-level display and action rules |
| `product/features/doctor-dashboard/07-new-analysis-statuses.md` | `product/reviews/07-new-analysis-statuses.review.md` | PASS WITH FIXES | Status state machine is incomplete |
| `product/features/doctor-dashboard/08-assigned-analysis-result-upload.md` | `product/reviews/08-assigned-analysis-result-upload.review.md` | PASS WITH FIXES | Upload validation and recovery rules are underdefined |
| `product/features/doctor-dashboard/09-result-to-plan-item-linking.md` | `product/reviews/09-result-to-plan-item-linking.review.md` | PASS WITH FIXES | Linking rules do not cover conflicts or unlinking |
| `product/features/doctor-dashboard/10-new-analyses-dossier-aggregation.md` | `product/reviews/10-new-analyses-dossier-aggregation.review.md` | PASS WITH FIXES | Dossier aggregation boundaries and freshness are vague |
| `product/features/doctor-dashboard/11-document-preparation-checklist.md` | `product/reviews/11-document-preparation-checklist.review.md` | PASS WITH FIXES | Checklist item model and readiness logic are not defined |
| `product/features/doctor-dashboard/12-document-upload.md` | `product/reviews/12-document-upload.review.md` | PASS WITH FIXES | Document upload constraints and quality states are missing |
| `product/features/doctor-dashboard/13-document-readiness-status.md` | `product/reviews/13-document-readiness-status.review.md` | PASS WITH FIXES | Readiness calculation is not testable as written |
| `product/features/doctor-dashboard/14-oms-document.md` | `product/reviews/14-oms-document.review.md` | PASS WITH FIXES | OMS-specific document requirements are missing |
| `product/features/doctor-dashboard/15-external-lpu-referral.md` | `product/reviews/15-external-lpu-referral.review.md` | PASS WITH FIXES | External referral source and metadata rules are vague |
| `product/features/doctor-dashboard/16-complaints-display.md` | `product/reviews/16-complaints-display.review.md` | PASS WITH FIXES | Complaint display source/version rules are underdefined |
| `product/features/doctor-dashboard/17-complaint-tags-categories.md` | `product/reviews/17-complaint-tags-categories.review.md` | PASS WITH FIXES | Tag taxonomy and edit rules are not defined |
| `product/features/doctor-dashboard/18-current-complaints-editing.md` | `product/reviews/18-current-complaints-editing.review.md` | PASS WITH FIXES | Editing permissions and versioning are not implementation-ready |
| `product/features/doctor-dashboard/19-additional-doctors-needed-block.md` | `product/reviews/19-additional-doctors-needed-block.review.md` | PASS WITH FIXES | Specialist recommendation source is not constrained enough |
| `product/features/doctor-dashboard/20-other-doctors-list-selection.md` | `product/reviews/20-other-doctors-list-selection.review.md` | PASS WITH FIXES | Selection list data and persistence rules are vague |
| `product/features/doctor-dashboard/21-book-other-doctor.md` | `product/reviews/21-book-other-doctor.review.md` | PASS WITH FIXES | Booking request lifecycle is underdefined |
| `product/features/doctor-dashboard/22-preparatory-visit-main-doctor-link.md` | `product/reviews/22-preparatory-visit-main-doctor-link.review.md` | PASS WITH FIXES | Link semantics between preparatory and main visit are incomplete |
| `product/features/doctor-dashboard/23-main-appointment-absent-state.md` | `product/reviews/23-main-appointment-absent-state.review.md` | PASS WITH FIXES | Absent-state criteria and CTA gating are unclear |
| `product/features/doctor-dashboard/24-book-main-doctor.md` | `product/reviews/24-book-main-doctor.review.md` | PASS WITH FIXES | Main booking lifecycle and scheduling boundary are too vague |
| `product/features/doctor-dashboard/25-preparation-to-booking-transition.md` | `product/reviews/25-preparation-to-booking-transition.review.md` | PASS WITH FIXES | Transition gate and carried context are not deterministic |

## Recurring Issues
- Most specs follow the required 17-section structure but remain partly templated in FR2, states, UX details, and DoD.
- Access control is acknowledged but not lifecycle-complete: grant source, expiration, revocation, role-specific invalid-access behavior, and exact audit event names need to be specified.
- Analytics are present but too generic; `*_primary_action` should be replaced or extended with feature-specific events and de-identified properties.
- Document and lab specs need stronger original-vs-structured handling for upload quality, OCR fallback, metadata edits, replacement, and source verification.
- Booking and specialist-selection specs need pilot-safe request lifecycles, duplicate prevention, notification/handoff expectations, and explicit limits on shared preparation context.
- Complaint and specialist suggestion specs must keep source labels and UI copy non-diagnostic and avoid implying medical necessity.

## Specs To Fix Before Implementation
All 25 reviewed specs should be fixed before implementation because each is `PASS WITH FIXES`, not `PASS`.

Priority fixes:
- `05-doctor-new-analysis-plan.md`, `06-new-analyses-list.md`, `07-new-analysis-statuses.md`, `08-assigned-analysis-result-upload.md`, `09-result-to-plan-item-linking.md`, and `10-new-analyses-dossier-aggregation.md` because they define the new-analysis preparation loop.
- `11-document-preparation-checklist.md`, `12-document-upload.md`, `13-document-readiness-status.md`, `14-oms-document.md`, and `15-external-lpu-referral.md` because they touch sensitive originals, structured metadata, and readiness signals.
- `19-additional-doctors-needed-block.md`, `20-other-doctors-list-selection.md`, `21-book-other-doctor.md`, `22-preparatory-visit-main-doctor-link.md`, `23-main-appointment-absent-state.md`, `24-book-main-doctor.md`, and `25-preparation-to-booking-transition.md` because they affect booking/request workflows and could accidentally imply external scheduling or clinical necessity if left vague.
