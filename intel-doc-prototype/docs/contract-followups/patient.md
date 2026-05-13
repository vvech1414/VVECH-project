# patient — contract follow-ups

This file lists shape gaps the patient surface noticed while implementing the
checklist + main-screen specs. The store was NOT modified; everything below is
a request for the freeze owner.

## complaint update / replace

- **why**: Spec 018 «Редактирование актуальных жалоб» asks the patient to be
  able to refine an existing complaint. The current contract only exposes
  `addComplaint(text)` and `setComplaintTags(complaintId, tags)` — there is no
  way to change the text body of an existing complaint.
- **proposed-shape**:
  ```ts
  function updateComplaint(complaintId: ID, text: string): void
  ```
- **callsites**: `src/components/patient/ComplaintsSection.tsx` — the «Уточнить»
  flow that opens a bottom sheet with the existing complaint pre-populated.
- **fallback**: For the demo we treat the edit affordance as «Уточнить» and
  append a NEW complaint with the refined text and tags. The original entry
  stays in the list as historical context. This matches the doctor's expected
  behaviour (chronological log) but is not what 018 actually describes.

## booked appointment for additional specialists

- **why**: Spec 021 «Запись к другому врачу» asks the patient to book the
  ophthalmologist / cardiologist / etc. The contract's
  `bookMainAppointment({ date })` only persists `type: 'main'` and assigns to
  `currentDoctorId`. There is no public action for `type: 'preparatory'` or
  for booking against a non-active doctor.
- **proposed-shape**:
  ```ts
  function bookExtraAppointment(args: {
    date: string
    specialistSlug: string
    doctorName: string
  }): Appointment
  ```
- **callsites**: `src/routes/patient/ExtraDoctors.tsx` confirmation handler.
- **fallback**: The current implementation shows a local success animation
  («Запись оформлена») and routes back to `/patient/checklist` without writing
  to the store. The booking is therefore visible only as a transient demo
  state, not in the persisted journal.

## notification settings

- **why**: Spec H8 «Профиль lite» wants three notification toggles
  (push / email / reminders). The contract has no field for patient-level
  notification preferences.
- **proposed-shape**:
  ```ts
  interface NotificationPrefs { push: boolean; email: boolean; reminders: boolean }
  // on Patient: prefs?: NotificationPrefs
  function setNotificationPrefs(prefs: Partial<NotificationPrefs>): void
  ```
- **callsites**: `src/routes/patient/Profile.tsx`.
- **fallback**: Toggles use local component state and reset on remount.
