# doctor — contract follow-ups

All entries below are stop-gaps; nothing in `src/store/**` was modified.
Each item lists the local fallback that ships in this iteration.

## preparatory `Appointment` rendering

- **why**: Spec 22 («подготовительный визит → основной врач») requires the
  cockpit to surface the link between preparatory visits and the main
  appointment. The store already supports `Appointment.type === 'preparatory'`
  but neither the patient surface nor `bookMainAppointment` writes one,
  and the seed leaves the bucket empty.
- **proposed-shape**: a thin `bookPreparatoryAppointment({ date, specialty })`
  action plus a few preparatory rows in `seed.ts` for `p2`/`p3` so the doctor
  view has something to display in the demo.
- **callsites**: `AdditionalDoctorsSection.tsx` and `AppointmentSection.tsx`
  read `selectAppointmentsForPatient(s, patientId)` and filter for
  `type === 'preparatory'`.
- **fallback**: The cockpit reads whatever preparatory rows exist; if there
  are none (current default), it shows the empty state «Пациент пока не
  записан к дополнительным специалистам» and skips the linkage block.

## specialist catalogue

- **why**: Specs 19/20 list partner-curated specialty options in the doctor
  cockpit. There is no store slice for this catalogue.
- **proposed-shape**: `Clinic.specialties: string[]` or a separate
  `specialists: Specialist[]` collection in the seed.
- **callsites**: `AdditionalDoctorsSection.tsx`.
- **fallback**: Static const `SPECIALIST_OPTIONS` in
  `src/components/doctor/doctorConstants.ts` (Офтальмолог · Кардиолог ·
  Нефролог · Невролог). The doctor's «Рекомендовать» toggle is
  component-local state only — it does NOT persist to the store, which
  matches the «patient owns booking» rule but means the recommendation
  doesn't survive a tab change. Promoting this to a store field would
  require a `recommendedSpecialistIds: string[]` per-patient slice.

## complaint editing trail

- **why**: Spec 18 mentions edit history for current complaints. The
  Complaint type has no `editedAt` / version trail.
- **proposed-shape**: `Complaint.editedAt?: string` and an `editComplaint`
  action — patient-side write, doctor-side read.
- **callsites**: `ComplaintsSection.tsx` would render «изменено …».
- **fallback**: Doctor surface treats complaints as immutable for the
  pilot — only `createdAt` is shown. No cockpit-side edit affordance.

## external-LPU referral metadata

- **why**: Spec 15 wants the cockpit to distinguish referrals issued by
  the partner clinic vs. external clinics, with the issuing-LPU label
  visible.
- **proposed-shape**: `Document.issuer?: string` for `type === 'referral'`.
- **callsites**: `DocumentsSection.tsx` referral row badge.
- **fallback**: Renders a generic «Сторонний ЛПУ» badge whenever a
  document of `type === 'referral'` exists, without the issuer's name.

## plan-item reason → request body separation

- Not a contract change, but worth noting for the patient surface: the
  cockpit currently relies on `PlanItem.reason` to render the rationale
  line in the new-analyses list. If the patient surface starts truncating
  this, the cockpit would lose the per-item explanation. Keeping the
  field load-bearing is recommended.
