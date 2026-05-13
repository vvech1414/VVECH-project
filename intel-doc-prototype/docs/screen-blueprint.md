# IntelDoc Patient Prototype — Screen Blueprint

## Purpose
This document defines the **screen-level implementation blueprint** for the IntelDoc patient app prototype for the **ЭНЦ pilot**.

It is intended to help Claude Code build the React prototype with minimal ambiguity.

The prototype should support this golden-path flow:

**ЭНЦ QR/link entry → partner context confirmed → consent + basic user profile setup + granting access to the ЛПУ → prep home screen → visit checklist → upload analysis → document quality check → OCR review/correction → analysis history/card → receive doctor request or examination plan → notification → upload missing result / complete plan → confirm next appointment**

---

## Screen 1 — QR / Link Entry
### Purpose
Make it immediately clear that the patient entered from **ЭНЦ** partner context.

### Key UI blocks
- partner / ЭНЦ header or card
- short intro text
- clinic name
- department selector
- optional doctor selector
- helper note about how preparation works

### Primary CTA
**Продолжить**

### Next transition
Go to **Partner Context Confirmed**

### Notes
- This screen should feel like entry into a clinic-linked journey.
- Use partner context visually.

---

## Screen 2 — Partner Context Confirmed
### Purpose
Confirm clinic / ЛПУ context before consent and onboarding.

### Key UI blocks
- selected clinic / ЛПУ card
- selected department
- optional selected doctor
- short explanation of what the app will help the patient do
- trust / control note about data use

### Primary CTA
**Перейти к согласию**

### Next transition
Go to **Consent**

### Notes
- Keep it lightweight.
- This is a confidence-building screen, not a form.

---

## Screen 3 — Consent
### Purpose
Collect required consent for data processing and optional consent for reminders.

### Key UI blocks
- mandatory consent checkbox
- optional reminders checkbox
- short explanation of data handling
- short explanation of access transparency

### Primary CTA
**Принять и продолжить**

### Next transition
Go to **Basic Profile Setup**

### Notes
- Avoid long legal text walls.
- Keep language calm and readable.

---

## Screen 4 — Basic Profile Setup
### Purpose
Capture only the minimum patient profile information needed for the prototype.

### Key UI blocks
- name field
- age or date of birth field
- diagnosis context selector
- optional contact field
- simple progress indicator

### Primary CTA
**Сохранить профиль**

### Next transition
Go to **Grant Access to ЛПУ**

### Notes
- Keep the form short.
- Do not turn this into a full medical registration flow.

---

## Screen 5 — Grant Access to ЛПУ
### Purpose
Establish visible and explicit clinic-level access early in the journey.

### Key UI blocks
- recipient block: clinic / ЛПУ / department
- explanation of what access means
- duration selector
- access coverage note
- transparency / audit note

### Primary CTA
**Выдать доступ**

### Next transition
Go to **Prep Home**

### Notes
- Must clearly show who gets access and for how long.
- Never imply hidden sharing.

---

## Screen 6 — Prep Home
### Purpose
Act as the main control center for preparation-before-visit.

### Key UI blocks
- preparation status card
- quick actions
- checklist summary
- doctor request / plan entry point
- event feed
- partner context in header

### Primary CTA
**Начать подготовку** or **Продолжить подготовку**

### Next transition
Go to **Visit Checklist**

### Secondary paths
- open doctor plan
- open history
- upload analysis directly

### Notes
- The home screen should communicate value in 5–10 seconds.

---

## Screen 7 — Visit Checklist
### Purpose
Guide the patient through preparation using a clear sequence.

### Key UI blocks
- checklist steps list
- progress state
- per-step completion status
- helper text for what remains

### Primary CTA
**Загрузить анализ**

### Next transition
Go to **Add Analysis**

### Notes
- Keep the checklist simple and motivating.
- Use it as the main preparation framework.

---

## Screen 8 — Add Analysis
### Purpose
Let the patient choose how to submit an analysis.

### Key UI blocks
- upload by camera
- upload file
- share into app
- permissions explanation
- fallback note for saving without OCR

### Primary CTA
**Выбрать файл** or **Сделать фото**

### Next transition
Go to **Document Quality Check**

### Notes
- The screen should reduce friction and uncertainty.

---

## Screen 9 — Document Quality Check
### Purpose
Help the patient ensure the uploaded document is good enough before OCR.

### Key UI blocks
- document preview
- rotate action
- crop action
- contrast or quality enhancement action
- quality warning if needed
- save without OCR fallback

### Primary CTA
**Продолжить**

### Next transition
Go to **OCR Review / Correction**

### Notes
- The main goal is believable OCR preparation.
- This can be visually simple.

---

## Screen 10 — OCR Review / Correction
### Purpose
Show extracted values and let the patient confirm or correct them.

### Key UI blocks
- original document preview
- structured metric list
- confidence flags / low-confidence markers
- editable values where needed
- save original only option

### Primary CTA
**Сохранить результат**

### Next transition
Go to **Analysis Card**

### Notes
- This is one of the most important credibility screens in the prototype.
- Must feel understandable and trustworthy.

---

## Screen 11 — Analysis Card
### Purpose
Show one analysis as a combined structured + original artifact.

### Key UI blocks
- analysis title
- date and source
- structured values
- original preview
- access status
- included in preparation indicator

### Primary CTA
**Открыть историю анализов**

### Next transition
Go to **Analysis History**

### Notes
- The patient should understand what the doctor will later be able to see.

---

## Screen 12 — Analysis History
### Purpose
Let the patient view all uploaded analyses and understand readiness.

### Key UI blocks
- search
- filters
- list of analysis cards / items
- OCR status chips
- access status chips
- quick open action

### Primary CTA
**Открыть план обследования**

### Next transition
Go to **Doctor Request / Examination Plan**

### Secondary paths
- open one analysis card
- upload another analysis

### Notes
- This screen should not feel like a complex archive.
- Prioritize clarity over density.

---

## Screen 13 — Doctor Request / Examination Plan
### Purpose
Show the patient what the doctor is asking for next in compliant language.

### Key UI blocks
- doctor / department header
- plan or request title
- requested analysis items
- deadlines or due dates
- item status markers
- short explanation of why data is needed
- supportive disclaimer if needed

### Primary CTA
**Перейти к выполнению плана**

### Next transition
Go to **Notification / Action Page**

### Notes
- Use “запрос врача” or “план обследования” wording.
- Avoid prescription / treatment framing.

---

## Screen 14 — Notification / Action Page
### Purpose
Turn a doctor request, deadline, or new plan into one clear patient action.

### Key UI blocks
- notification banner / type
- what changed
- why it matters
- one main action
- optional secondary action

### Primary CTA
**Загрузить недостающий результат**

### Next transition
Go to **Add Analysis** or **Complete Plan / Plan Progress**

### Notes
- One screen, one decision.
- Keep this highly focused.

---

## Screen 15 — Complete Plan / Plan Progress
### Purpose
Show progress after the patient responds to the doctor plan.

### Key UI blocks
- plan item list
- completed vs pending states
- progress bar or progress summary
- timestamps or status updates
- next-step hint

### Primary CTA
**Подтвердить следующий приём**

### Next transition
Go to **Confirm Next Appointment**

### Notes
- This screen should create a sense of completion and continuity.

---

## Screen 16 — Confirm Next Appointment
### Purpose
Close the loop and reinforce continuity of care.

### Key UI blocks
- appointment summary card
- clinic / doctor info
- date and time placeholder
- short “what to prepare next” hint

### Primary CTA
**Подтвердить приём**

### Next transition
Go to **Success / Return Home**

### Notes
- Keep this simple.
- It can be a confirmation screen rather than a real booking flow.

---

## Screen 17 — Success / Return Home
### Purpose
End the journey with a clear success state.

### Key UI blocks
- success state
- plan completion summary
- next appointment confirmed state
- access still active note if relevant
- return home action

### Primary CTA
**Вернуться на главный экран**

### Next transition
Go to **Prep Home**

### Notes
- This should feel calm and complete.

---

## Reusable component suggestions
Prefer reusable components across screens:
- AppShell
- PartnerHeader
- StatusChip
- PrimaryButton / SecondaryButton
- ActionCard
- ChecklistStep
- AnalysisListItem
- MetricRow
- AccessCard
- NotificationBanner
- PlanItemRow
- AppointmentCard
- BottomCTA

---

## Key implementation reminders
- mobile-first only
- Russian UI copy
- calm, clinical, trustworthy tone
- one primary action per screen
- mocked data and local state
- no diagnosis or treatment language
- access control must be explicit and visible
- optimize for a 2–3 minute pilot demo
