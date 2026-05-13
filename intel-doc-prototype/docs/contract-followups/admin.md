# Admin contract follow-ups

Status: **no contract changes required for the MVP admin dashboard.**

The pre-extended store (`pilotKpis`, `kpiTrend`, `accessByDepartment`,
`accessIncidents`, `auditEvents`, `complianceState`, `complianceChecks`) was
sufficient to build all six features without store mutation. All admin
components read defensively (`?? defaultValue`) so older persisted state from
localStorage continues to render gracefully.

## Optional follow-ups (post-MVP, not blocking)

### 1. Anomaly threshold for incident rows
`IncidentRow` currently hard-codes `anomalyThreshold = 5` for the soft amber
highlight. If the pilot team agrees on a formal SLA, expose this as a store
config field (e.g. `adminConfig.incidentAnomalyThreshold`) so the rule is
auditable from a single place rather than scattered in component props.

### 2. Per-KPI sparkline overrides
`Dashboard.tsx` only renders the sparkline under the prep-rate card per
spec 02. If the team later wants togglable trends, expose a
`selectedTrendKpi: KpiId` slice and a setter so the choice survives reloads.

### 3. Period boundaries
`pilotKpis.periodLabel` is a free-form string. If the admin gains period
filtering, replace with `{ from: ISO; to: ISO; label: string }` so derived
formatting is consistent across surfaces. No urgency for the MVP demo.

### 4. Audit event analytics surface
Spec 02–06 list `admin_*` analytics events. Currently the prototype emits
none — events are documented but not wired. If desired, add a tiny
`logAdminEvent(type, props)` action stub in `store/actions.ts` that pushes
into `auditEvents`. Not strictly necessary for the demo.
