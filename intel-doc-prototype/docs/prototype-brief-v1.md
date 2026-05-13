# IntelDoc Patient Prototype — Product Brief

## Purpose
Build a **mobile-first React prototype** of the IntelDoc **patient app** for the **ЭНЦ pilot**.

This is a **prototype for pilot presentation and product validation**, not a production healthcare app. It should demonstrate the patient-side journey clearly enough that a clinic stakeholder can understand the product value in **2–3 minutes**.

---

## Prototype goal
The prototype should demonstrate this end-to-end pilot flow:

**ЭНЦ QR/link entry → partner context confirmed → consent + basic user profile setup + granting access to the ЛПУ → prep home screen → visit checklist → upload analysis → document quality check → OCR review/correction → analysis history/card → receive doctor request or examination plan → notification → upload missing result / complete plan → confirm next appointment**

This flow should communicate:
- partner-first onboarding
- preparation before doctor visit
- OCR-based structuring of uploaded documents
- explicit and transparent access control
- patient follow-up after doctor request / plan
- continuity of care via next appointment confirmation

---

## What success looks like
The prototype is successful if:
- a clinic stakeholder understands the patient flow in under 3 minutes
- the patient journey feels coherent and believable end-to-end
- the upload → OCR → request/plan → follow-up loop is clear
- access control feels explicit and trustworthy
- the app feels linked to ЭНЦ / ЛПУ, not like a generic health app
- nothing in the UI implies diagnosis or treatment

---

## Core user and context
### Primary user
Patient in endocrinology / diabetes care, primarily **35–65 years old**, using the app to prepare for a visit and respond to doctor follow-up.

### Partner context
The prototype is anchored in the **ЭНЦ pilot**. The product should feel like a clinic-linked preparation channel, not an independent wellness app.

### User mindset
The user should feel:
- guided
- calm
- in control
- confident about what happens next
- reassured that their data access is transparent

---

## Product principles
### 1. Two surfaces in scope
Both the patient mobile app and the doctor web dashboard are in scope for this prototype:
- **Patient mobile app** — primary surface, covers the full pilot flow
- **Doctor web dashboard** — thin demo surface, only what is needed to close the loop with the patient

Doctor-side scope is limited to what makes the patient flow believable end-to-end:
- view patient profile and granted access
- review uploaded analyses and OCR output
- send a request or examination plan back to the patient
- mark follow-up items as received / acknowledged

Full clinical workflows, multi-patient management, scheduling engines, billing, and EHR-style features remain **out of scope**. The dashboard exists to make the patient journey demonstrable, not to serve as a clinician product in its own right.

### 2. Prototype, not production
- Use mocked data and local state
- No real OCR, backend, authentication, API, database, or payment integration
- Optimize for presentation clarity and believable UX
- Shared mocked state should link the two surfaces (e.g. an analysis uploaded in the patient app appears in the doctor dashboard)

### 3. Minimal integration
- Assume photo/PDF upload only
- Simulate OCR results
- Do not model EHR / MIS / API integration

### 4. Transparent access control
The prototype must show clearly:
- who has access
- what access covers
- duration / expiry
- status of access

Never imply silent or invisible automatic sharing. The doctor dashboard should only display data for patients who have explicitly granted access, and the granted scope should be visible on the doctor side too.

### 5. AI is consultative only
Forbidden on both surfaces:
- diagnosis language
- treatment language
- prescriptions
- medication advice

Allowed:
- neutral summaries
- clarification requests
- examination guidance
- preparation support
- simple explanations

If AI-like content appears, it must be framed as supportive and non-decisive.

### 6. Accessible, calm UX
Each surface follows its own form factor:
- **Patient app:** mobile-first, large tap targets, one primary action per screen, low cognitive load
- **Doctor dashboard:** desktop web, denser but still calm, clear information hierarchy, no alarmist styling

Both should feel like part of the same product family — shared tone, shared visual language, shared terminology.

---

## In-scope screens
The prototype should include at minimum:
1. QR / link entry
2. Partner context confirmed
3. Consent
4. Basic profile setup
5. Grant access to ЛПУ
6. Prep home
7. Visit checklist
8. Add analysis
9. Document quality check
10. OCR review / correction
11. Analysis card
12. Analysis history
13. Doctor request / examination plan
14. Notification / action page
15. Complete plan / plan progress
16. Confirm next appointment
17. Success / return home

---

## Key jobs the prototype must demonstrate
### A. Enter the partner care journey
The patient should understand from the beginning that they arrived through **ЭНЦ / ЛПУ** context.

### B. Prepare for the visit
The patient should quickly understand what needs to be done before the appointment.

### C. Upload and structure analyses
The patient should be able to upload an analysis, see a quality check, and review structured OCR output.

### D. Control data sharing
The patient should explicitly grant access to the clinic / ЛПУ and understand that access is controlled.

### E. Respond to doctor follow-up
The patient should receive a request or examination plan and act on it.

### F. Close the loop
The patient should complete the plan and confirm the next appointment.

---

## Out of scope
Do **not** implement in the first prototype:
- telemedicine booking flow
- chat
- payments
- subscriptions
- medication management
- emergency layer
- device integrations
- social features
- full doctor clinical product (multi-patient management, scheduling, billing, EHR features)
- deep analytics

These can exist as future roadmap items but should not appear in the prototype unless explicitly requested.

---

## Content and copy rules
### Language
Primary UI language: **Russian**

### Tone
- calm
- practical
- readable
- non-alarming
- supportive

### Good example labels
- «Подготовьтесь к приёму»
- «Проверьте распознанные данные»
- «Выдайте доступ ЛПУ»
- «Откройте план обследования»
- «Это не заменяет консультацию врача»

### Avoid
- «диагноз»
- «назначение лечения»
- «рецепт» as a core app function
- alarmist or over-medicalized phrasing

---

## Mock data guidance
Use realistic Russian dummy data:
- patient names
- department names
- doctor names
- realistic dates and statuses
- common endocrine-relevant analyses

Preferred analysis types:
- HbA1c
- glucose
- creatinine
- cholesterol

---

## State coverage
Important screens should support where relevant:
- default
- loading
- empty
- error
- success

Especially important states:
- access active / expired
- OCR low confidence
- saved without OCR
- request received
- overdue item
- appointment confirmed

---

## Technical direction
Preferred technical approach:
- React prototype
- mobile-first
- component-driven
- local mocked state
- reusable UI patterns
- simple routing or state-based navigation

The prototype should be easy to demo, easy to revise, and easy to deploy later.

---

## Design usage
Use `/design` as the visual reference.

Implementation priority:
1. interaction clarity and component logic
2. layout hierarchy and spacing rhythm
3. brand tone and accent usage
4. decorative fidelity only when it does not hurt usability

If design artifacts conflict with usability, prioritize:
- pilot flow clarity
- accessibility
- compliance-safe wording
- mobile readability

---

## Working approach
When building:
- make reasonable assumptions
- label assumptions clearly
- keep files organized
- prefer small, coherent iterations over major rewrites
- optimize for a short pilot demo, not for technical completeness
