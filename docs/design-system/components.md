# IntelDoc — Components Catalogue

Inventory derived from `intel-doc-prototype/src/components/` (commit `5d2f703`). Scope: Patient app only. Components in `src/components/doctor/` and `src/components/admin/` exist on disk but are not mounted in `App.tsx` — excluded.

Each entry lists path · props (with TS types) · variants/states · where it's used.

---

## 1 · Primitives (`src/components/primitives/`)

The modern, canonical layer. New product code should consume these and not the legacy shared/components/* equivalents.

### Button
- **Path:** `primitives/Button.tsx`
- **Props:**
  - `variant?: 'primary' | 'secondary' | 'ghost' | 'dark'` — default `primary`
  - `size?: 'md' | 'lg'` — default `lg`
  - `full?: boolean` — full-width
  - `icon?: ReactNode` / `iconRight?: ReactNode`
  - `disabled?: boolean`, plus all native `<button>` attrs
- **Visual states:**
  - **primary** — bg `blue-600` / text white · hover `blue-700` · active `blue-800` · disabled `slate-200`/`slate-400`
  - **secondary** — bg white + inset 1.5px primary border · hover `blue-50` fill
  - **ghost** — transparent · hover `blue-50` fill
  - **dark** — bg `slate-900` / text white · hover `slate-800` · active `slate-950`
- **Mechanics:** universal `active:scale-[0.98]` press feedback, `transition-all 200ms ease-out`, `rounded-xl` (16px), `font-bold tracking-ui`.
- **Used in:** every onboarding screen primary CTA, BottomCTA pattern, ConsentModal acknowledge, RevokeAccessSheet confirm — **canonical primary button** across the app.

### Card
- **Path:** `primitives/Card.tsx`
- **Props:** `title?`, `action?`, `children?`, `className?`, `style?`, `unstyled?: boolean`, `onClick?`.
- **Behaviour:** `flex-col gap-3 rounded-2xl p-5`. Default fills `surface-sunken` (= blue-050); `unstyled` drops the fill when parent already provides bg. When `onClick` set, adds `cursor-pointer hover:bg-cyan-50` and acts as a button.
- **Used in:** secondary content groupings; less common than direct `<section className="rounded-2xl bg-white p-4">` patterns in routes.

### Chip
- **Path:** `primitives/Chip.tsx`
- **Props:** `children`, `active?: boolean`, `onClick?`, `className?`.
- **States:**
  - **idle** — bg `blue-050` / text `blue-600` / inset border `blue-100`
  - **active** — bg `blue-600` / text white / inset border `blue-600`
- **Used in:** filter chips, period-filter UI on History.

### Input
- **Path:** `primitives/Input.tsx`
- **Props:** `label?`, `helper?: ReactNode`, `required?: boolean`, `error?: string`, plus all `<input>` attrs.
- **Composition:** uppercase 10px micro-label · 16px body-lg input · 12px helper or error message.
- **Mechanics:** inset 1.5px border switches between `slate-200` (idle), `blue-600` (focus, via `:focus`), `error` (rose-600 when `error` prop set). No outline ring — entirely shadow-based.
- **Used in:** Account onboarding (name, dob, phone, email), Vasily-chat composer (multiline variant), search bars.

### BottomSheet
- **Path:** `primitives/BottomSheet.tsx`
- **Props:** `open: boolean`, `onClose: () => void`, `title?`, `children`, `tall?: boolean` (full-height vs auto).
- **Mechanics:** scrim `rgba(15,16,20,0.45)`, sheet `rounded-t-[20px]`, animation `ds-slide-up 320ms cubic-bezier(0.16,1,0.3,1)`. Body scroll locks while open.
- **Used in:** RevokeAccessSheet, DoctorViewSheet, ConsentModal (custom variant), QualityCheck step.

### FAB
- **Path:** `primitives/FAB.tsx`
- **Props:** `icon: ReactNode`, `label?: string`, `onClick`, `className?`.
- **Visual:** `h-14 w-14 rounded-full bg-cyan-500 shadow-lg`, white icon centred. Position is controlled by the consumer (typically `absolute bottom-24 right-5`).
- **Used in:** sparingly — Vasily-chat shortcut, "add complaint" composer.

### TabBar
- **Path:** `primitives/TabBar.tsx`
- **Props:** none — reads location via `useLocation`, fixed 4-slot model.
- **Tabs:** `Главная` (Home) · `Василий` (MessageCircle) · `Подготовка` (ListChecks) · `История` (FileText). Active tab: text `blue-600`, label font-bold. Inactive: slate-400, font-semibold, opacity 0.85.
- **Visual:** `position: absolute; bottom: 0; height: 89px`. Background `rgba(255,255,255,0.85)` + `backdrop-filter: blur(40px)`. Top border `slate-100`.

### Avatar
- **Path:** `primitives/Avatar.tsx`
- **Props:** `name: string`, `size?: number = 40`, `className?`.
- **Behaviour:** derives up to 2 initials from the first two words of `name`. Rendered on `blue-100` background with `blue-700` text, `rounded-2xl` (16px), font-bold. Font-size auto-scales to `Math.round(size * 0.36)`.
- **Used in:** TopHeader (size 40), Profile identity card (size 56).

### StatusBadge
- **Path:** `primitives/StatusBadge.tsx`
- **Props:** `tone: 'success' | 'warning' | 'danger' | 'info' | 'neutral'`, `children`, `size?: 'sm' | 'md'`, `pulse?: boolean`.
- **Variants:** identical palette to `StatusChip` (legacy) — see Gap 3.2 below.
- **Used in:** Notifications event rows, AnalysisCardScreen header, MainAppointmentSection confirmation.

---

## 2 · Shared components (`src/components/`)

Older layer — predates primitives/. Most are still in active use in routes; two (`PrimaryButton`, `SecondaryButton`) are legacy wrappers around the older button API and should be deprecated (see proposed-changes §1).

### PartnerHeader
- **Path:** `components/PartnerHeader.tsx`
- **Props:** `onBack?`, `showBack?: boolean`, `light?: boolean`, `title?: string`.
- **Variants:**
  - **dark default** — bg `navy-900`, white text, ЭНЦ-mark on `blue-600` square
  - **light** — bg white, slate-900 text, bottom border `slate-100`
- **Used in:** legacy onboarding chrome (predates `OnboardingChrome.tsx`).

### StatusChip
- **Path:** `components/StatusChip.tsx`
- **Props:** `label: string`, `variant: 'success' | 'warning' | 'error' | 'info' | 'neutral'`, `size?: 'sm' | 'md'`.
- **Pixel-identical** to `StatusBadge` except: no `pulse` mode, slightly different variant key (`danger` → `error`). **Two parallel implementations**, see proposed-changes §2.

### ActionCard
- **Path:** `components/ActionCard.tsx`
- **Props:** `icon: ReactNode`, `title: string`, `description?`, `onClick?`, `badge?`, `highlight?: boolean`.
- **States:** idle (white card, blue-050 icon-tint) and `highlight` (blue-600 bg, white text, shadow-lg).
- **Used in:** "Что увидит врач" rows on Home, NewAnalysesSection items.

### ChecklistStep
- **Path:** `components/ChecklistStep.tsx`
- **Props:** `step: number`, `label: string`, `done: boolean`, `active?: boolean`, `locked?: boolean`, `onClick?`.
- **States:**
  - **done** — bg `mint-050`, label `emerald-700` line-through with `emerald-300` strike
  - **active** (next-up) — bg `blue-050`, blue-600 step circle, chevron
  - **locked** — bg `slate-100`, opacity 0.6, disabled
  - **idle** — bg white, slate-200 step circle, chevron
- **Used in:** Checklist (onboarding progress + main-flow steps).

### AnalysisListItem
- **Path:** `components/AnalysisListItem.tsx`
- **Props:** `analysis: Analysis`, `onClick?`.
- **Composition:** 44px icon (FileText on `blue-050` tint) · title · source · date · OCR-status chip (success / warning / neutral) · chevron-right.
- **Used in:** History list items.

### MetricRow
- **Path:** `components/MetricRow.tsx`
- **Props:** `metric: MetricValue`, `editable?: boolean`, `onValueChange?`.
- **Behaviour:** parameter name + reference range on the left, value + flag-label on the right. Flag colour: `amber-600` (high), `rose-600` (low), `emerald-600` (in-range). Low-confidence values get a `Проверьте` pill before the value. `editable` swaps the value for an inline input.
- **Used in:** AnalysisCardScreen, OCRReviewPanel.

### AccessCard
- **Path:** `components/AccessCard.tsx`
- **Props:** `recipient: string`, `type: string`, `grantedOn: string`, `expiresOn: string`, `status: 'active' | 'expired'`, `viewedBy?`, `lastViewed?`.
- **States:** active (mint-050 bg, emerald-700 expiry) · expired (white bg, slate-500 expiry).
- **Used in:** Profile (active grants), Access entry screen preview.

### NotificationBanner
- **Path:** `components/NotificationBanner.tsx`
- **Props:** `type: 'info' | 'action' | 'reminder' | 'success'`, `title`, `body`, `cta?`, `onCta?`.
- **Type palette:** info+reminder use `blue-050`, action uses `amber-050`, success uses `mint-050`. Title uses tone-specific colour.

### PlanItemRow
- **Path:** `components/PlanItemRow.tsx`
- **Props:** `item: PlanItem`, `onClick?`.
- **Status circle:** `emerald-500` (done with check) · `amber-400` (todo with `!`) · `rose-500` (overdue with `!`).
- **Used in:** examination plan, Checklist deep-detail.

### AppointmentCard
- **Path:** `components/AppointmentCard.tsx`
- **Props:** `doctor`, `department`, `date`, `time`, `format`, `confirmed?: boolean`.
- **States:**
  - **confirmed** — bg `mint-050`, emerald palette, 100×100 icon tile mint-100, divider `emerald-200/60`
  - **upcoming** — bg `blue-600` (hero), white text, shadow-lg, divider `white/15`

### BottomCTA
- **Path:** `components/BottomCTA.tsx`
- **Behaviour:** sticky 24px-padded container with `bg-white/85 backdrop-blur` + top `slate-100` border, hosting a primary `<Button full>`. Lives at the screen bottom above the TabBar on action screens.

### VasiliyTip
- **Path:** `components/VasiliyTip.tsx`
- **Props:** `kind: 'tip' | 'reminder' | 'warning'`, `text`, optional dismiss callback.
- **Used in:** sprinkled hints throughout the patient flow, always with `aiDisclaimer` copy.

### PrimaryButton · SecondaryButton (LEGACY)
- **Path:** `components/PrimaryButton.tsx` · `components/SecondaryButton.tsx`
- **Status:** older single-purpose wrappers that predate the canonical `primitives/Button.tsx`. Still imported in 2–3 entry routes. **Deprecate** in favour of `<Button variant="primary" />` / `<Button variant="secondary" />` (proposed-changes §1).

---

## 3 · Patient flow components (`src/components/patient/`)

Screen-level building blocks composed inside routes. Higher-level than primitives — they encode flow-specific copy and store hooks, so they are not reusable outside patient routes.

| Component | Path | Purpose | Key visual |
|---|---|---|---|
| `PhoneFrame` | `patient/PhoneFrame.tsx` | Mobile shell wrapper. 390×844 on ≥640px, fullscreen edge-to-edge below. | `rounded-[40px] shadow-md` on desktop |
| `TopHeader` | `patient/TopHeader.tsx` | Sticky 64px top bar with co-brand lockup, bell (with unread dot), avatar. | flex row, white bg |
| `OnboardingChrome` | `patient/OnboardingChrome.tsx` | Onboarding top bar with back, centred co-brand pill, optional 3-segment progress bar + label. Supports `dark` variant. | segmented bar + caps-tracking label |
| `PrepBanner` | `patient/PrepBanner.tsx` | Hero CTA for unseen doctor requests. Only renders when there's an unread request. | bg `blue-600` · pulse dot · shadow-lg |
| `MainAppointmentSection` | `patient/MainAppointmentSection.tsx` | Booked vs absent appointment block. | `mint-050` confirmed / `white` absent |
| `NewAnalysesSection` | `patient/NewAnalysesSection.tsx` | Doctor-assigned analyses list with explicit `К загрузке` / `На проверке` / `Принято` status badges. |  |
| `ChecklistSection` | `patient/ChecklistSection.tsx` | Wrapper section with title + optional hint badge (e.g. `2/3`). | flex-col gap-3 |
| `OldAnalysesSection` · `DocumentsSection` · `ComplaintsSection` · `AdditionalDoctorsSection` | `patient/*.tsx` | Section-level building blocks for the Home and Checklist flow. | white card surfaces, varying inner layouts |
| `OnboardingChrome` (described above) |  |  |  |
| `ConsentModal` | `patient/ConsentModal.tsx` | Full-height read-and-acknowledge bottom sheet. Acknowledge button gated by `scroll-to-end` OR a11y-checkbox tick. | scrim + slide-up sheet |
| `RevokeAccessSheet` · `DoctorViewSheet` | `patient/*.tsx` | Profile-confirmation bottom sheets. |  |
| `CameraViewfinder` · `QualityCheck` · `OcrProgress` · `OCRReviewPanel` | `patient/*.tsx` | OCR document-upload pipeline screens. | full-bleed camera + sheet-driven steps |
| `ServicesCarousel` | `patient/ServicesCarousel.tsx` | Horizontal scroll-snap row of 200px-wide service cards (Школа диабета · Лекарства · Анализы · Сервисы · Страхование). | 5 pastel tint variants |
| `VasilyBlock` | `patient/VasilyBlock.tsx` | Compact mascot CTA row with text + voice entry buttons. | white card, 40px mascot inline |

---

## 4 · System / co-branding (`src/components/system/`)

### CoBrandLockup
- **Path:** `system/CoBrandLockup.tsx`
- **Props:** `variant?: 'pill' | 'plain'`, `dark?: boolean`, `size?: 'sm' | 'md' | 'lg'`, `partnerShortName?: string | null`.
- **Composition:** Partner mark (round, `blue-600` fill, white initial) — `×` separator (slate-muted, font-bold) — IntelDoc mark (`rounded-md`, `navy-900` fill, "iD" white) — label.
- **Variants:** `pill` wraps each brand in a tonal pill (`blue-050` partner / `slate-100` IntelDoc); `plain` is flush text. `dark` switches both pills to `bg-white/10`.

### VasilyMascot
- **Path:** `system/VasilyMascot.tsx`
- **Props:** `size?: number = 120`, `halo?: boolean`, `className?`.
- **Behaviour:** renders `design/vasiliy-mascot.png` at `width: size, height: size`. When `halo`, paints `--gradient-mascot-halo` (radial soft cyan glow) behind the image.

### DemoToolbar (DEV-only)
- **Path:** `system/DemoToolbar.tsx`
- **Status:** development-only segment switcher; not visible in any user-facing build.

---

## 5 · Inventory totals

- **Primitives:** 9 components (Button, Card, Chip, Input, BottomSheet, FAB, TabBar, Avatar, StatusBadge)
- **Shared:** 15 components (PartnerHeader, StatusChip, ActionCard, ChecklistStep, AnalysisListItem, MetricRow, AccessCard, NotificationBanner, PlanItemRow, AppointmentCard, BottomCTA, VasiliyTip, PrimaryButton-LEGACY, SecondaryButton-LEGACY, AppShell)
- **Patient-flow:** 20 components — screen-section building blocks
- **System:** 3 components (CoBrandLockup, VasilyMascot, DemoToolbar)
- **Total in-scope:** ~47 components

## 6 · Component → route usage map

| Route | Primary components |
|---|---|
| `/patient/entry/welcome` | OnboardingChrome (dark), Button(primary), dark hero with `bg-navy-900` + cyan-400/20 blur halos |
| `/patient/entry/account` | OnboardingChrome (step 1/3), Input × 5, Button(primary) |
| `/patient/entry/access` | OnboardingChrome (step 2/3), AccessCard preview, Button(primary), bottom sheet for sign |
| `/patient/entry/consents` | OnboardingChrome (step 3 — «Последний шаг»), ConsentModal, Button(primary) |
| `/patient/home` | TopHeader, PrepBanner (conditional), VasilyMascot+halo (64px), VasilyBlock, ServicesCarousel, TabBar |
| `/patient/checklist` | TopHeader, ChecklistSection, NewAnalysesSection, OldAnalysesSection, DocumentsSection, ComplaintsSection, MainAppointmentSection |
| `/patient/history` | header w/ back, AnalysisListItem (grouped by period), Chip (period filter) |
| `/patient/history/:analysisId` | header w/ back, MetricRow × N (in OCRReviewPanel), StatusBadge, MiniFact 3-up |
| `/patient/notifications` | header w/ back, grouped event rows with category-tinted icons, StatusBadge |
| `/patient/notification/:requestId` | header w/ back, NotificationBanner(action), BottomCTA |
| `/patient/profile` | TopHeader, Avatar (56), Toggle × 3, Button(secondary), RevokeAccessSheet, DoctorViewSheet, TabBar |
| `/patient/upload/:type` | CameraViewfinder, QualityCheck, OcrProgress, OCRReviewPanel — full multi-step flow |
| `/patient/vasily` | PhoneFrame, VasilyMascot (120 + halo), Input (chat composer), FAB(mic) |
