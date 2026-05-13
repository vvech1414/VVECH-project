# doctor-routes

The doctor cockpit currently routes through the four pre-existing
`/doctor/*` paths registered in `App.tsx`. This implementation iteration
extends `PatientRecord.tsx` with eight tabs (Обзор · Старые анализы ·
Назначенные · Документы · Жалобы · Доп. врачи · Запись · Запросы) and
no new top-level routes are required.

If/when the cockpit grows a dedicated all-requests inbox or a doctor
settings page (both currently shown as disabled stubs in
`CockpitShell.tsx`), the proposed mapping is:

| Path | Component | Notes |
|------|-----------|-------|
| /doctor/patients | <PatientList /> | (existing) — adds search + status filter chips |
| /doctor/patients/:patientId | <PatientRecord /> | (existing) — now an 8-tab record |
| /doctor/patients/:patientId/compose | <ComposeRequest /> | (existing) — unchanged signature |
| /doctor/patients/:patientId/sent | <RequestConfirmation /> | (existing) — unchanged |
| /doctor/requests | (future) DoctorInbox | currently disabled in sidebar |
| /doctor/settings | (future) DoctorSettings | currently disabled in sidebar |

No App.tsx edits are required for this freeze. The new tabs inside
`PatientRecord.tsx` are pure component composition.
