# IntelDoc Patient Prototype — Claude Project Instructions

## Project purpose

Build a **mobile-first React prototype** for the IntelDoc patient app for the **ЭНЦ pilot**.

The prototype must support this pilot story:

**ЭНЦ QR/link entry → partner context confirmed → consent + basic profile setup + granting access to the ЛПУ → prep home screen → visit checklist → upload analysis → document quality check → OCR review/correction → analysis history/card → receive doctor request or examination plan → notification → upload missing result / complete plan → confirm next appointment**

This flow reflects partner-first onboarding, preparation-before-visit, OCR-based document structuring, explicit access control, and the doctor follow-up loop required by the MVP pilot.

---

## Product guardrails

Always follow these rules:

### 1. Patient app only

* Do not build the doctor cockpit in this repo.
* Doctor-side behavior may appear only as simulated incoming states:

  * doctor request
  * examination plan
  * notification

### 2. Prototype, not production

* Optimize for demo clarity, not backend completeness.
* Use mocked data and local state.
* No real OCR, auth, API, database, or payment integration.

### 3. Minimal integration

* Assume photo/PDF upload + simulated OCR only.
* No EHR / MIS / API integration.

### 4. Transparent access control

The patient must clearly see:

* who has access
* what access covers
* duration / expiry
* status of access

Never imply silent automatic sharing.

### 5. AI is consultative only

Forbidden:

* diagnosis language
* treatment language
* prescriptions
* medication advice

Allowed:

* summaries
* clarification requests
* examination guidance
* preparation help
* neutral explanations

Include disclaimers where AI-like summaries appear.

### 6. Partner-first UX

* ЭНЦ context must be visible in the app.
* The product should feel like a clinic-linked preparation channel.
* The prototype should create immediate visible value for the partner without heavy process change.

### 7. Accessibility and age fit

* Design primarily for users aged **35–65**.
* Use readable typography, large tap targets, low cognitive load, and calm hierarchy.
* Avoid overloaded dashboards and dense medical admin-style UI.

---

## Design reference usage

Use files in `/design` as the visual reference for this prototype.

Implementation priority:

1. Match **interaction clarity** and component logic.
2. Match **layout hierarchy** and spacing rhythm.
3. Match **brand tone**, accent usage, and color behavior.
4. Match exact decorative visuals only when they do not hurt usability.

If design artifacts conflict with prototype usability or product requirements, prioritize:

* pilot flow clarity
* accessibility
* compliance-safe wording
* mobile readability

Do **not** invent a flashy startup visual language unless necessary.
Reuse existing patterns from the design materials and preserve consistency across screens.

---

## Visual direction to preserve

Preserve these traits from the design materials:

* dark blue / navy brand surfaces
* bright cyan / electric blue highlights
* white mobile cards and panels on top of dark brand contexts
* simple rounded mobile UI
* calm, clinical, trustworthy tone
* QR / onboarding cards as a recurring entry pattern
* brand mascot elements are optional and secondary

---

## Preferred technical approach

* React prototype
* mobile-first
* component-driven
* local mocked state
* clean reusable UI patterns
* simple routing or state-based screen switching

### Technical implementation constraints

* Use **React + Vite**
* Use **TypeScript**
* Use **Tailwind CSS**
* Use **local mocked state only**
* Do **not** build a backend
* Do **not** add an API layer
* Keep the file structure simple and easy to iterate
* Prioritize speed, clarity, and demo readiness over technical completeness

---

## Required screens

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

## Reusable component expectations

Prefer these reusable components:

* AppShell
* PartnerHeader
* StatusChip
* PrimaryButton
* SecondaryButton
* ActionCard
* ChecklistStep
* AnalysisListItem
* MetricRow
* AccessCard
* NotificationBanner
* PlanItemRow
* AppointmentCard
* BottomCTA

---

## Content and copy rules

* Primary UI language: **Russian**
* Tone: calm, practical, readable, non-alarming
* Prefer short labels and supportive helper text
* Avoid legalistic walls of text

Preferred examples:

* «Подготовьтесь к приёму»
* «Проверьте распознанные данные»
* «Выдайте доступ ЛПУ»
* «Откройте план обследования»
* «Это не заменяет консультацию врача»

Avoid:

* «диагноз»
* «назначение лечения»
* «рецепт» as a core AI/app function
* alarmist phrasing

---

## Mock data rules

Use realistic Russian dummy data:

* patient names
* department names
* doctor names
* common endocrinology-relevant lab values
* realistic dates and statuses

Preferred analysis types:

* HbA1c
* glucose
* creatinine
* cholesterol

---

## State coverage

Every important screen should support where relevant:

* default
* loading
* empty
* error
* success

Especially important states:

* access active / expired
* OCR low confidence
* saved without OCR
* request received
* overdue item
* appointment confirmed

---

## Scope exclusions

Do not implement in the first prototype:

* telemedicine booking flow
* chat
* payments
* subscriptions
* medication management
* emergency layer
* device integrations
* social features
* full doctor web UI

---

## Working style

When asked to build or revise:

* make reasonable assumptions
* label assumptions clearly
* keep files organized
* prefer small coherent iterations over massive rewrites
* optimize for a **2–3 minute pilot demo**

---

## Definition of success

The prototype is successful if:

* a clinic stakeholder can understand the flow in under 3 minutes
* the patient journey feels coherent end-to-end
* access control feels explicit and trustworthy
* the upload → OCR → plan loop feels believable
* nothing implies diagnosis or treatment
