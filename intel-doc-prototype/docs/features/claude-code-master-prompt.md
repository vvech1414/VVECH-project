# IntelDoc Patient Prototype — Claude Code Master Prompt

Paste this whole file as the initial instruction to Claude Code. Treat it as the single source of truth for scope, stack, and implementation. If anything is ambiguous, prefer clarity over cleverness and ask before inventing.

---

## 1. Mission

Build a **React prototype** of the IntelDoc product for the **ЭНЦ pilot demo**. Two surfaces in one codebase:

- **Patient mobile app** — iPhone viewport (390×844), primary surface, 16 screens
- **Doctor web cockpit** — desktop web (1440×900), thin loop-closer, 4 screens

The prototype demonstrates a 2:30 pilot walkthrough:

| Segment | Time | Flow |
|---|---|---|
| 1 | 0:20 | Patient onboards from QR → partner context → consent → access grant → home |
| 2 | 0:40 | First prep: patient uploads an old analysis; OCR review is the magic moment |
| 3 | 0:30 | Doctor (on cockpit) reviews record and sends a plan |
| 4 | 0:40 | Patient receives notification, uploads requested analysis, prep completes |
| 5 | 0:20 | Patient books main doctor, returns home with appointment scheduled |

**Shared state** is load-bearing: what the patient uploads shows up on the doctor side; what the doctor sends shows up on the patient side.

This is a prototype for a pilot pitch, **not** production healthcare software. Mocked data, local state, simulated OCR. Optimize for demo clarity and visual fidelity.

---

## 2. Product rules (non-negotiable)

| Rule | Why |
|---|---|
| **Russian UI throughout.** Use the copy strings in this prompt verbatim | Demo audience is a Russian clinic director |
| **Formal «Вы» register** | Clinic-partnered product must feel professional |
| **Warm but not humorous** | "Calm, practical, non-alarming" per brief |
| **No diagnostic or treatment language anywhere** | Vasily helper is informational only |
| **No real OCR, no real backend, no real auth** | Prototype only |
| **Patient/doctor views read from the same store** | Cross-surface loop is the pitch's credibility |
| **Plan-driven model** (doctor issues → patient executes) | Not Vasily-as-decisionmaker |

---

## 3. Tech stack

| Layer | Choice |
|---|---|
| Framework | **React 18 + Vite** |
| Language | **TypeScript** |
| Routing | **React Router v6** |
| State | **Zustand** with `persist` middleware (localStorage) |
| Styling | **Tailwind CSS** for layout + utility + **CSS custom properties** (from `colors_and_type.css`) for brand tokens |
| Animation | **Framer Motion** for transitions and the OCR flow's reveal |
| Icons | **lucide-react** |
| Fonts | Manrope (UI), Montserrat Alternates (display), Inter (data) — Google Fonts CDN |

Install:
```bash
npm create vite@latest inteldoc-prototype -- --template react-ts
cd inteldoc-prototype
npm i zustand react-router-dom framer-motion lucide-react
npm i -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## 4. File structure (target)

```
src/
  design/
    colors_and_type.css      # copy verbatim from inteldoc-design-system
    vasiliy-mascot.png       # copy from inteldoc-design-system/assets
  store/
    types.ts
    store.ts
    actions.ts
    seed.ts
    selectors.ts
  lib/
    ocr-mock.ts              # simulated OCR — fixed outputs per analysis type
    formatters.ts            # date, numbers with Russian formatting
  components/
    primitives/
      Button.tsx
      Chip.tsx
      Card.tsx
      Input.tsx
      BottomSheet.tsx
      TabBar.tsx
      FAB.tsx
      Avatar.tsx
      StatusBadge.tsx
    patient/
      PhoneFrame.tsx         # renders children at 390×844 on desktop preview
      TopHeader.tsx
      PrepBanner.tsx
      VasilyBlock.tsx
      ServicesCarousel.tsx
      ChecklistSection.tsx
      AnalysisCard.tsx
      OCRReviewPanel.tsx
      NotificationBanner.tsx
    doctor/
      Sidebar.tsx
      PatientListRow.tsx
      PatientSummary.tsx
      AnalysisRow.tsx
      RequestCompose.tsx
    system/
      DemoToolbar.tsx
      VasilyMascot.tsx
  routes/
    patient/
      EntryFlow.tsx          # S01–S05 single component with internal steps
      Home.tsx               # S06
      VasilyHelper.tsx       # S07
      History.tsx            # S08
      AnalysisCardScreen.tsx # S09
      Checklist.tsx          # S10
      UploadFlow.tsx         # S11 → S12 integrated with OCR
      DocUpload.tsx          # S12a
      NotificationAction.tsx # S14
      BookMain.tsx           # S15
      ServicePlaceholder.tsx # S16
    doctor/
      PatientList.tsx        # D-S01
      PatientRecord.tsx      # D-S02 (+ D4)
      ComposeRequest.tsx     # D-S03
      RequestConfirmation.tsx# D-S04
  App.tsx
  main.tsx
  index.css                  # imports colors_and_type.css + tailwind directives
```

---

## 5. Design system setup

1. Copy `colors_and_type.css` into `src/design/`
2. Copy `vasiliy-mascot.png` into `src/design/`
3. In `src/index.css`:
```css
@import "./design/colors_and_type.css";
@tailwind base;
@tailwind components;
@tailwind utilities;
```
4. In `tailwind.config.js`, extend theme to reference tokens:
```js
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "var(--color-primary)",
        'brand-hover': "var(--color-primary-hover)",
        surface: "var(--color-surface)",
        'surface-sunken': "var(--color-surface-sunken)",
        'page-bg': "var(--color-bg)",
        ink: "var(--color-text)",
        'ink-strong': "var(--color-text-strong)",
        'ink-muted': "var(--color-text-muted)",
        border: "var(--color-border)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-error)",
      },
      fontFamily: {
        ui: ["Manrope", "system-ui", "sans-serif"],
        display: ["Montserrat Alternates", "Montserrat", "sans-serif"],
        data: ["Inter", "sans-serif"],
      },
      borderRadius: {
        md: "12px", lg: "16px", xl: "20px", "2xl": "24px",
      },
    },
  },
  plugins: [],
};
```
5. Use the existing Primitives API as reference. Our Primitives should match its variants:
   - **Button:** `primary | secondary | ghost | dark`, sizes `md | lg`, optional `icon` / `iconRight`, `full` for full-width
   - **Chip:** uppercase label, `active` state, pill radius
   - **Card:** `title`, `action` (right slot), padding 20px, radius 16px, slate-050 bg, no border/shadow

---

## 6. Data model (create in `src/store/types.ts`)

```ts
export type Patient = {
  id: string
  name: string
  dob: string
  identifiers: { snils?: string; oms?: string }
  partnerClinic: string
  department: string
  attendingDoctorId: string
  createdAt: string
}

export type AccessGrant = {
  id: string
  patientId: string
  clinicId: string
  scope: "lifetime-clinic"
  grantedAt: string
}

export type AnalysisType = "HbA1c" | "glucose" | "creatinine" | "cholesterol" | "other"

export type Analysis = {
  id: string
  patientId: string
  type: AnalysisType
  label: string
  date: string
  originalFileUrl: string
  qualityCheck: "clear" | "acceptable"
  ocrFields: Record<string, string>
  linkedPlanItemId?: string
  status: "uploaded" | "acknowledged"
  uploadedAt: string
}

export type Document = {
  id: string
  patientId: string
  type: "passport" | "snils" | "oms" | "referral" | "other"
  label: string
  originalFileUrl: string
  qualityCheck: "clear" | "acceptable"
  status: "uploaded"
  uploadedAt: string
}

export type Complaint = {
  id: string
  patientId: string
  text: string
  createdAt: string
}

export type PlanItem = {
  id: string
  patientId: string
  requestId: string
  analysisType: AnalysisType
  label: string
  reason?: string
  status: "assigned" | "uploaded" | "acknowledged"
  linkedAnalysisId?: string
  createdAt: string
}

export type DoctorRequest = {
  id: string
  patientId: string
  fromDoctorId: string
  title: string
  body: string
  planItemIds: string[]
  createdAt: string
  seenByPatient: boolean
}

export type Appointment = {
  id: string
  patientId: string
  doctorId: string
  type: "main" | "preparatory"
  date: string
  status: "scheduled" | "completed"
  createdAt: string
}

export type Doctor = {
  id: string
  name: string
  specialty: string
  clinicId: string
}
```

---

## 7. Store (`src/store/store.ts`)

- Zustand store with `persist` middleware (localStorage key: `inteldoc-demo-v1`)
- Slices can be flat — one store, all collections
- Expose `actions.*` for mutations (see §8)
- Expose selectors via `src/store/selectors.ts`

### Actions (implement in `src/store/actions.ts`)

| Action | Effect |
|---|---|
| `completeEntryFlow(fields)` | Create Patient + AccessGrant, set `currentPatientId` |
| `uploadAnalysis({ file, type, planItemId? })` | Run mock quality check + OCR, create Analysis, link PlanItem if provided, update statuses |
| `editOcrField(analysisId, field, value)` | Update ocrFields on that analysis |
| `uploadDocument({ file, type })` | Create Document |
| `addComplaint(text)` | Create Complaint |
| `openPatientRecord(patientId)` | Set doctor-side currentPatientId |
| `sendRequest({ title, body, items })` | Create DoctorRequest + PlanItems, `seenByPatient=false` |
| `openNotification(requestId)` | Set request.seenByPatient=true |
| `acknowledgeAnalysis(analysisId)` | Set analysis.status=acknowledged, linked PlanItem.status=acknowledged |
| `bookMainAppointment({ date })` | Create main Appointment |
| `resetToSeed()` | Clear store, re-apply seed |

### Selectors (`src/store/selectors.ts`)

| Selector | Returns |
|---|---|
| `selectActivePatient(state)` | Patient object |
| `selectUnseenRequests(state)` | `DoctorRequest[]` where `seenByPatient === false` |
| `selectPlanItemsForPatient(patientId)` | Array grouped by status |
| `selectDocumentReadiness()` | `{ uploaded, total, percent }` |
| `selectPrepIsComplete()` | boolean |

---

## 8. Seed data (`src/store/seed.ts`)

Demo starts with this state:

```ts
export const seed = {
  doctors: [
    { id: "d1", name: "Иванов Сергей Петрович", specialty: "Эндокринолог", clinicId: "enc" }
  ],
  patients: [
    // p1 = active demo patient (fresh onboard — actually created via entry flow)
    // p2 and p3 populate doctor's patient list
    { id: "p2", name: "Волков Сергей Николаевич", dob: "1968-03-12", /* ... */ },
    { id: "p3", name: "Михайлова Елена Викторовна", dob: "1975-11-02", /* ... */ },
  ],
  accessGrants: [/* for p2 and p3 */],
  analyses: [
    // 2 analyses for p2, 1 for p3 — so doctor list isn't empty
  ],
  // ... everything else empty for p1
}
```

After the entry flow completes, a fresh Анна Петрова (patient) is created and becomes `currentPatientId`. Use DOB 1973-06-15, ОМС 7700123456789012.

---

## 9. Mock OCR (`src/lib/ocr-mock.ts`)

Given an uploaded file + analysis type, return fixed structured values after a simulated 1200ms delay. Use realistic out-of-range values so the demo has clinical relevance.

| Type | ocrFields output |
|---|---|
| HbA1c | `{ "HbA1c": "7.2 %", "дата": "12.02.2026", "норма": "< 6.5 %" }` |
| glucose | `{ "Глюкоза": "8.4 ммоль/л", "дата": "14.02.2026", "норма": "3.9–5.6 ммоль/л" }` |
| creatinine | `{ "Креатинин": "92 мкмоль/л", "дата": "14.02.2026", "норма": "62–106 мкмоль/л" }` |
| cholesterol | `{ "Холестерин": "5.8 ммоль/л", "ЛПНП": "3.9 ммоль/л", "дата": "10.02.2026" }` |

Always return `qualityCheck: "clear"` in the happy path.

---

## 10. Voice & copy (Russian, formal «Вы», warm, no humor)

### Core CTAs
- «Продолжить» / «Начать» / «Сохранить» / «Отправить» / «Записаться» / «Загрузить» / «Готово»

### Navigation
- Home tab label: «Главная»
- Подготовка tab: «Подготовка»
- История tab: «История»
- Профиль tab: «Профиль»

### Greetings
- Partner welcome headline: «Вы подключились к IntelDoc вместе с ЭНЦ»
- Value explainer lines: «Соберите анализы в одном месте», «Подготовьтесь к приёму заранее», «Контролируйте, кому доступны данные»
- Consent block title: «Согласие на обработку данных»
- Access grant title: «Предоставьте доступ клинике ЭНЦ»
- Home greeting: «Здравствуйте, Анна»

### Prep banner states
- Not started: «Начните подготовку к приёму»
- In progress: «Продолжите подготовку — {X} из {N} шагов готово»
- Complete: «Вы готовы к приёму»
- With outstanding request: «Врач отправил новый запрос»

### Vasily helper
- Greeting: «Здравствуйте! Я Василий, ваш цифровой помощник. Чем могу помочь?»
- Suggested chips: «Что взять с собой на приём», «Как подготовиться к анализам», «Зачем нужны документы», «Что будет на приёме»
- Sample canned response: «На приём возьмите паспорт, полис ОМС, направление (если есть) и недавние результаты анализов. Все документы можно загрузить заранее в разделе «Подготовка»»
- Footer disclaimer on every reply: «Это информационная подсказка. Решения принимает ваш врач.»

### Checklist section headers
- «Назначил врач»
- «Документы»
- «Жалобы»
- «Какие ещё врачи могут понадобиться»
- «Старые анализы»

### OCR review
- Screen title: «Проверьте распознанные данные»
- Quality check success: «Изображение чёткое»
- Save CTA: «Сохранить»
- Edit hint: «Нажмите поле, чтобы изменить»

### Notification / action page
- Banner text: «Врач отправил запрос»
- Page title: «Запрос от врача»
- CTA: «Перейти к загрузке»

### Booking
- Main doctor booking title: «Запись к основному врачу»
- Slot format: «15 марта, 10:30»
- Confirm CTA: «Записаться»
- Success: «Приём запланирован»

### Completion
- Prep complete banner (post-completion): «Вы готовы к приёму. Запишитесь к основному врачу»
- Home return state: «Приём запланирован: {дата}»

### Services carousel cards (5, stable order)

| Card title | Supporting text |
|---|---|
| «Школа диабета» | «Материалы и программы для жизни с диабетом» |
| «Лекарства и расходники» | «Подбор нужных товаров и расходников» |
| «Анализы» | «Запись и сервисы по анализам» |
| «Полезные сервисы» | «Дополнительные предложения в вашем контексте» |
| «Страхование» | «ДМС и смежные программы» |

Placeholder destination copy: «Этот раздел скоро появится»

---

## 11. Patient screens (build all 16)

For each screen: layout, primary components, key copy, success state. Viewport 390×844 rendered inside `<PhoneFrame>` on desktop. All screens have a top header except during entry flow.

### S01–S05 — Entry flow (`EntryFlow.tsx`, step state internal)

- **S01 Partner welcome:** full-bleed intro screen, IntelDoc logo, partner badge «ЭНЦ · Отделение диабетологии · Иванов С.П.», headline «Вы подключились к IntelDoc вместе с ЭНЦ», primary button «Продолжить»
- **S02 Value explainer:** 3 value cards stacked, mascot PNG top-right, primary button «Продолжить»
- **S03 Profile setup:** fields «Имя», «Дата рождения», «ОМС» (optional), helper text under each
- **S04 Consents:** section title, plain-language summary, required checkboxes with labels, «Продолжить» disabled until required consents checked
- **S05 Access grant:** headline «Предоставьте доступ клинике ЭНЦ», explanation «Доступ выдаётся на уровне всей клиники, бессрочно», primary «Предоставить доступ»

Transition from S05 → S06 includes a brief 800ms loading state with mascot before home renders.

### S06 — Home (`Home.tsx`)

Vertical scroll:
1. **Top header** (H1) — small partner badge + avatar circle (initials)
2. **Prep banner** (H2) — dominant card, notification indicator if unseen requests
3. **Vasily block** (H3) — mascot + «Есть вопросы? Спросите Василия» + ghost CTA
4. **Services carousel** (H7) — horizontal scroll, 5 cards, stable order
5. **Bottom nav** (H5) — 4 tabs fixed

State: the prep banner's label and CTA change based on `selectPrepIsComplete()` and unseen requests.

### S07 — Vasily helper (`VasilyHelper.tsx`)

- Top bar with back arrow + title «Василий»
- Mascot centered + greeting bubble
- 4 suggested prompt chips
- Canned response appears below tapped chip with safety footer
- No text input field in v1

### S08 — History / old analyses (`History.tsx`)

- Title «История»
- List of analyses, reverse-chron
- Each row: icon, label (e.g. «HbA1c»), date, status badge
- Empty state: «Пока нет загруженных анализов» + «Добавить» FAB

### S09 — Analysis card (`AnalysisCardScreen.tsx`)

- Back arrow
- Header: analysis type + date
- Original file thumbnail
- Structured OCR fields as a dl/dt/dd list
- «Редактировать» ghost button (opens inline edit)

### S10 — Preparation checklist (`Checklist.tsx`) — main hub

Sections in order:
1. «Назначил врач» (plan items #5+#6+#7 merged) — list, each row shows label + status badge + arrow
2. «Документы» (#11 + #13) — list, each row shows doc type + readiness indicator
3. «Жалобы» (#16) — list + «Добавить жалобу» CTA
4. «Какие ещё врачи могут понадобиться» (#19 display only) — list of specialists with reason
5. **Completion banner** (#25) — appears only when `selectPrepIsComplete()` is true: «Вы готовы к приёму» + «Записаться к основному врачу»

### S11 → S12 — Upload flow with OCR (`UploadFlow.tsx`)

This is the **magic moment**. Sequence:
1. Bottom sheet: «Как загрузить?» → options «Сделать фото», «Из галереи», «Выбрать файл»
2. On select: full-screen upload view with placeholder + 1s simulated upload progress
3. Quality check card appears: green check + «Изображение чёткое»
4. OCR processing state: 1.2s with mascot + «Василий распознаёт данные»
5. OCR review screen: structured fields in a form; each field tappable to edit inline; «Сохранить» primary CTA
6. Save → brief success animation → back to checklist with updated status

Use Framer Motion for the state transitions. Keep the reveal of structured fields staggered (50ms delay per field) for delight.

### S12a — Document upload (`DocUpload.tsx`)

Simpler: upload sheet → quality check → direct save. No OCR review (documents aren't structured).

### S14 — Notification / action (`NotificationAction.tsx`)

- Top bar with back + title «Запрос от врача»
- Doctor name + date
- Request title + body (the doctor's message)
- List of requested plan items
- Primary CTA «Перейти к загрузке» routes to upload flow pre-bound to the first plan item

### S15 — Book main doctor (`BookMain.tsx`)

- Doctor info card (name, specialty, photo placeholder)
- 4–5 stub slots in a list
- Selected slot is highlighted
- Primary CTA «Записаться»
- On success: confirmation screen briefly shows «Приём запланирован», then auto-navigates home (RH)

### S16 — Service placeholder (`ServicePlaceholder.tsx`)

- Top bar with back + service name (from carousel tap)
- Centered mascot + «Этот раздел скоро появится»
- «Вернуться на главную» ghost button

---

## 12. Doctor screens (build 4)

Desktop layout, 1440×900, sidebar + main content pattern.

### D-S01 — Patient list (`PatientList.tsx`)

- Left sidebar: IntelDok logo, doctor name, nav (Patients | Requests | Settings)
- Main: data table with columns — Имя пациента, Дата приёма, Статус подготовки, Последнее действие
- Status badges: «Готов» (success green), «В работе» (warning amber), «Требует внимания» (error rose) with pulse animation for new uploads
- Row click → D-S02

### D-S02 — Patient record (`PatientRecord.tsx`)

Two-column layout:
- **Left 320px:** Patient summary card — avatar, name, DOB, access scope, next appointment
- **Right flex:** Tabs `Обзор | Анализы | Документы | Жалобы | Запросы`
  - **Обзор:** summary counts, last actions timeline
  - **Анализы:** list of uploaded analyses; click opens side panel with original file + OCR fields side-by-side; «Принять» button for new items
  - **Документы:** list with readiness indicators
  - **Жалобы:** list of patient-entered complaints
  - **Запросы:** list of requests sent + status
- Primary action button top-right: «Отправить запрос» → D-S03

### D-S03 — Compose request (`ComposeRequest.tsx`)

- Modal or full-page compose
- Template dropdown: «Дополнительные анализы», «Уточнение жалоб», «Повторная подготовка»
- Editable title + body
- Plan item builder: add rows with analysis type + reason
- Preview of how patient will see it (right side panel)
- Send button → creates Request + PlanItems → D-S04

### D-S04 — Request confirmation (`RequestConfirmation.tsx`)

- Success state: check icon + «Запрос отправлен»
- Summary of what was sent
- CTA «Вернуться к пациенту» routes to D-S02

---

## 13. Demo toolbar (`system/DemoToolbar.tsx`)

Small fixed pill at bottom-center of viewport, visible on all routes. Contains:

| Control | Action |
|---|---|
| 🔄 Сбросить | `actions.resetToSeed()` + navigate to `/patient/entry` |
| 👤 Пациент | navigate to `/patient/home` |
| 👨‍⚕️ Врач | navigate to `/doctor/patients` |
| ⏭ Сегмент {N} | Jumps state + route to pre-seeded mid-demo checkpoints (segments 2–5) |

The fast-forward should be implementable as: each segment has a "seed it" helper that calls the relevant actions in sequence.

---

## 14. Build order (recommended)

Build in this sequence — each step produces a working visual checkpoint:

1. **Setup** — Vite + TS + Tailwind + design tokens + fonts + mascot asset
2. **Primitives** — Button, Chip, Card, Input, BottomSheet, PhoneFrame (minimal, styled)
3. **Store** — types, Zustand store, seed, actions (just signatures with console.log)
4. **Router** — App.tsx with patient/doctor routes, DemoToolbar shell
5. **Entry flow** (S01–S05) — all 5 sub-screens, wire completeEntryFlow action
6. **Home** (S06) — header, banner, Vasily block, carousel, tab bar
7. **Checklist** (S10) — all 5 sections, static data first, then connected to store
8. **Upload flow + OCR** (S11→S12) — the magic moment. Take extra care here
9. **History + Analysis card** (S08 + S09)
10. **Vasily helper** (S07)
11. **Doctor cockpit** (D-S01 → D-S04)
12. **Notification + booking + return home** (S14, S15, RH)
13. **Service placeholder** (S16)
14. **Demo toolbar** — full implementation with fast-forward
15. **Polish pass** — transitions, micro-interactions, final copy review

---

## 15. Definition of done

The prototype is ready when:

- [ ] All 16 patient screens render at 390×844 inside PhoneFrame on desktop
- [ ] All 4 doctor screens render at 1440×900
- [ ] The 2:30 demo narrative runs end-to-end without manual state fixes
- [ ] Uploading an analysis on patient side appears in doctor's view of that patient
- [ ] OCR-edited fields update on both surfaces
- [ ] Doctor sending a plan creates notification indicator on patient home
- [ ] Patient tapping notification marks request seen on doctor side
- [ ] Patient uploading requested analysis updates PlanItem status on both surfaces
- [ ] Doctor acknowledging updates status to «Принято» on both surfaces
- [ ] Patient booking main doctor shows appointment in doctor's patient list
- [ ] Browser refresh preserves state (persist middleware working)
- [ ] Demo toolbar Reset returns to fresh-patient state
- [ ] Demo toolbar Fast-forward to any segment works without errors
- [ ] No action breaks state if called twice (idempotency)
- [ ] All copy is Russian, «Вы»-register, no humor, no diagnostic language
- [ ] OCR flow (S11→S12) has the staggered field reveal animation
- [ ] No console errors or warnings on the demo path
- [ ] Fonts (Manrope, Montserrat Alternates, Inter) load and render correctly

---

## 16. Clarification protocol

If anything in this prompt is ambiguous or conflicts with what you find in the design-system files, prefer in this order:
1. Tokens and component APIs from `inteldoc-design-system/` (truth for visuals)
2. This master prompt (truth for scope and flow)
3. Ask the user before inventing

Specifically: if you need a string that isn't in §10, don't make one up — ask. If you need a color that isn't in the tokens, don't add one — ask.

---

## 17. Reference files (include in project)

- `inteldoc-design-system/README.md` — design system narrative
- `inteldoc-design-system/colors_and_type.css` — token definitions
- `inteldoc-design-system/assets/vasiliy-mascot.png` — mascot
- `inteldoc-design-system/ui_kits/mobile/Primitives.jsx` — component reference

Copy these into `src/design/` (or similar) at the start. Keep them as reference throughout.
