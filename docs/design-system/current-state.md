# Design System — Current State (snapshot 2026-05-13)

> **Purpose:** input for Claude Design (Track B step 2) so it doesn't extract blind. Compiled from `intel-doc-prototype/src/` at branch `main`, originally seeded at commit `5d2f703`; updated below to reflect the Track B step 3 application pass.
> **Scope:** Patient app only (defence scope). Components in `src/components/doctor/` and `src/components/admin/` exist on disk but are not mounted in `App.tsx` and are out of scope for the defence on 2026-05-16.
> **Step-3 status (2026-05-13):** code changes from `proposed-changes.md` items §1, §2, §3, §7, §9, §10, §12 have been applied; §4, §5, §6, §11 are doc-only / Figma-only and left untouched in code; §13 (unannounced emerald ramp) rejected and recorded.

---

## 1. Stack & tooling

- **Bundler/runtime:** Vite 5.4, React 18.3, TypeScript 5.6, React Router 7.14.
- **State:** Zustand 5 (`src/store/store.ts` + `seed.ts` + `selectors.ts` + `actions.ts`).
- **Styling:** Tailwind CSS 3.4 (`tailwind.config.js`) + CSS custom properties (`src/design/colors_and_type.css`, 315 LoC) + `src/index.css`.
- **Motion:** Framer Motion 12.
- **Icons:** Lucide React.
- **Fonts:** Manrope (UI), Montserrat / Montserrat Alternates (display), Inter (data/tables). Loaded from Google Fonts.

---

## 2. Design tokens

All tokens are declared as CSS custom properties in `src/design/colors_and_type.css` and aliased into Tailwind via `tailwind.config.js`. Dark-mode overrides live in the `@media (prefers-color-scheme: dark)` block at the bottom of the CSS file.

### 2.1 Color primitives

**Ink scale (warm neutrals, 11 stops):** `--ink-050` → `--ink-900`.
**Slate scale (cool neutrals, 10 stops):** `--slate-050` → `--slate-900` — the actual UI surfaces use this scale.

**Brand blue (medical indigo, 11 stops):** `--blue-050` → `--blue-900`.

- Primary CTA: `--blue-600` (#2563EB)
- Active hero card: `--blue-500`
- Chart highlight: `--blue-300`
- Chip surface: `--blue-200` / `--blue-100`

**Category tints (each = pastel bg + dark glyph fg):**

- Mint (success / "в норме"): `--mint-050` → `--mint-500`
- Amber (warning / out-of-range): `--amber-050` → `--amber-500`
- Rose (error / "просрочено"): `--rose-050` → `--rose-600`
- Violet (imaging): `--violet-050` → `--violet-600`
- Peach (requests / hypo on chart): `--peach-100` → `--peach-500`

**Semantic roles:** `--success` / `--success-dark` / `--success-bg`, `--warning` / `--warning-dark` / `--warning-bg`, `--error` / `--error-dark` / `--error-bg`.

**Legacy tokens** (marketing deck / Vasily mascot only, not used in product surfaces): `--legacy-blue-*`, `--legacy-mint-*`, `--legacy-peach-*`, `--legacy-amber-*`, `--legacy-violet-*`.

**Light-mode semantic aliases** (the layer most components consume): `--color-primary`, `--color-bg`, `--color-surface`, `--color-surface-sunken`, `--color-text`, `--color-text-strong`, `--color-text-muted`, `--color-border`, `--color-divider`, `--color-success`, `--color-warning`, `--color-error`, plus `--bg-page`.

**Data-viz tokens:** `--chart-in-range`, `--chart-low` (hypo), `--chart-high` (hyper), `--chart-band`, `--chart-grid`.

**Action-button tints** (patient-detail quick actions, paired bg/fg): `--action-timeline-*`, `--action-documents-*`, `--action-requests-*`, `--action-notes-*`.

**Category tag tints** (analyses / imaging / consult / notes): `--cat-analysis-*`, `--cat-imaging-*`, `--cat-consult-*`, `--cat-note-*`.

### 2.2 Radii

- `--radius-xs` 6px
- `--radius-sm` 8px
- `--radius-md` 12px (buttons, chips)
- `--radius-lg` 16px (cards)
- `--radius-xl` 20px (large panels)
- `--radius-2xl` 24px
- `--radius-pill` 999px

Tailwind aliases: `rounded-md/lg/xl/2xl/3xl` re-mapped onto these values.

### 2.3 Spacing (4-pt grid)

`--space-1` 4px → `--space-10` 64px (1, 2, 3, 4, 5, 6, 7=32, 8=40, 9=48, 10=64).

### 2.4 Elevation / shadow

- `--shadow-xs` very subtle 1-pt
- `--shadow-sm` 8-pt soft
- `--shadow-md` 24-pt card lift
- `--shadow-lg` 40-pt branded-blue tint (used on hero / featured CTAs)
- `--shadow-focus` 4-pt blue focus ring

### 2.5 Motion

- Easings: `--ease-standard` (cubic-bezier(0.2, 0.8, 0.2, 1)), `--ease-out` (cubic-bezier(0.16, 1, 0.3, 1)).
- Durations: `--dur-fast` 120ms, `--dur-base` 200ms, `--dur-slow` 360ms.

### 2.6 Type ramp

Families: `--font-ui` (Manrope), `--font-display` (Montserrat Alt → Montserrat), `--font-data` (Inter), `--font-mono` (system).

Sizes:

- `--fs-display-xl/lg/display` — fluid `clamp()` for marketing/hero (44–96px range).
- `--fs-h1` 24, `--fs-h2` 20, `--fs-h3` 18.
- `--fs-body-lg` 16, `--fs-body` 14, `--fs-caption` 12, `--fs-micro` 10.

Tailwind exposes the body/heading sizes as `text-micro`, `text-caption`, `text-body`, `text-body-lg`, `text-h1-ui`, `text-h2-ui`, `text-h3-ui`.

Line-heights: `--lh-tight` 1, `--lh-snug` 1.2, `--lh-body` 1.4, `--lh-loose` 1.6.
Tracking: `--tracking-tight` -0.02em, `--tracking-ui` 0.005em, `--tracking-caps` 0.04em.

**Utility classes already shipped in `colors_and_type.css`:** `.t-display-xl`, `.t-display-lg`, `.t-display`, `.t-h1/h2/h3`, `.t-body-lg`, `.t-body`, `.t-caption`, `.t-micro`, `.t-link`, `.t-data-xl/lg/data` (tabular-nums for metric values).

---

## 3. Component catalogue (patient-app subset)

> Naming convention: `src/components/<group>/<Name>.tsx`. All components are TypeScript function components with explicit prop interfaces.

### 3.1 Primitives (`src/components/primitives/`)

| Component | Path | Variants / states | Notes |
| --- | --- | --- | --- |
| `Button` | `primitives/Button.tsx` | `variant`: primary / secondary / ghost / dark · `size`: md / lg · `full`, `icon`, `iconRight`, `disabled` | Canonical button used across the app. Built on Tailwind utility composition. |
| `Card` | `primitives/Card.tsx` | base surface card | white surface, `rounded-lg`, `shadow-sm` |
| `Chip` | `primitives/Chip.tsx` | tonal chip with optional icon | filter/tag UI |
| `Input` | `primitives/Input.tsx` | text input | label + helper text slots |
| `BottomSheet` | `primitives/BottomSheet.tsx` | modal-from-bottom | Framer-Motion driven |
| `FAB` | `primitives/FAB.tsx` | floating action button | bottom-right of mobile shell |
| `TabBar` | `primitives/TabBar.tsx` | bottom tab navigation | 4-slot mobile bar |
| `Avatar` | `primitives/Avatar.tsx` | round image / initials | size variants |
| `StatusBadge` | `primitives/StatusBadge.tsx` | `tone`: success / warning / error / info / neutral · sizes sm/md · optional `pulse` | **canonical** status pill after §2 merge (legacy `StatusChip` removed) |
| `EmptyState` | `primitives/EmptyState.tsx` | tone: info / neutral · action variant: link / button (with optional icon) | added §7, drop-in for empty inboxes/lists |

### 3.2 Shared components (`src/components/`)

| Component | Path | Purpose |
| --- | --- | --- |
| `AppShell` | `components/AppShell.tsx` | mobile shell variant (top header + bottom tab) |
| `PartnerHeader` | `components/PartnerHeader.tsx` | sticky clinic-context header (ЭНЦ name, logo slot) |
| `ActionCard` | `components/ActionCard.tsx` | tappable card with icon + title + helper text |
| `ChecklistStep` | `components/ChecklistStep.tsx` | row used in visit prep / plan progress |
| `AnalysisListItem` | `components/AnalysisListItem.tsx` | row in analyses history |
| `MetricRow` | `components/MetricRow.tsx` | label + value pair (compact) |
| `AccessCard` | `components/AccessCard.tsx` | shared representation of an access grant |
| `NotificationBanner` | `components/NotificationBanner.tsx` | inline announcement / alert banner |
| `PlanItemRow` | `components/PlanItemRow.tsx` | row in examination plan |
| `AppointmentCard` | `components/AppointmentCard.tsx` | upcoming-visit card |
| `BottomCTA` | `components/BottomCTA.tsx` | sticky bottom CTA pattern |
| `VasiliyTip` | `components/VasiliyTip.tsx` | mascot hint (patient-only) |

### 3.3 Patient-flow components (`src/components/patient/`)

OnboardingChrome, PrepBanner, ServicesCarousel, TopHeader, MainAppointmentSection, ChecklistSection, NewAnalysesSection, OldAnalysesSection, DocumentsSection, ComplaintsSection, AdditionalDoctorsSection, ConsentModal, RevokeAccessSheet, DoctorViewSheet, CameraViewfinder, QualityCheck, OcrProgress, OCRReviewPanel, PhoneFrame, VasilyBlock.

These are screen-level building blocks composed inside the routes in §3.5.

### 3.4 System / co-branding (`src/components/system/`)

`CoBrandLockup` (IntelDoc × Clinic N lockup), `DemoToolbar` (dev-only role/segment switcher), `VasilyMascot`.

### 3.5 Feature modules (`src/features/`)

`vasily-onboarding/` — screen-level feature folder (`ui/VasilyOnboardingScreen.tsx` + `model/points.ts`, exported via `index.ts`). Mounted at `/patient/entry/vasily-onboarding`. This is the only feature folder currently; other onboarding screens live directly under `src/routes/patient/entry/`.

### 3.6 Routes (`src/routes/patient/`)

Mounted in `src/App.tsx` — **21 screen routes** (6 onboarding + 15 main app) plus 3 redirect-only Route elements (root, `/patient/entry`, catch-all). See `docs/01-scope-and-vision.md` §1 for the full list.

Onboarding (6): `entry/Welcome`, `entry/Account`, `entry/Access`, `entry/Consents`, `features/vasily-onboarding/ui/VasilyOnboardingScreen`, `entry/Setup`.

Main app (15): `Home`, `VasilyHelper`, `History`, `Notifications`, `AnalysisCardScreen` (`/patient/history/:analysisId`), `Checklist`, `UploadFlow` (and `:type` variant), `DocUpload` (and `:type` variant), `NotificationAction` (`/patient/notification/:requestId`), `BookMain`, `ExtraDoctors`, `ServicePlaceholder` (`/patient/service/:slug`), `Profile`.

---

## 4. Layout patterns

### 4.1 Mobile shell (390 px target)

- **Top:** `PartnerHeader` or `TopHeader` (sticky, white surface on slate-050 page bg).
- **Body:** scrollable vertical stack of sections; one section per concept (PrepBanner, NewAnalysesSection, etc.).
- **Bottom:** `TabBar` (4 slots: Главная / История / Уведомления / Профиль) + optional `BottomCTA` floating above the tab bar on action screens.

### 4.2 Onboarding chrome

- Full-bleed dark-blue brand surface (uses `--blue-700` / `--blue-800`).
- Centred single-card composition (white card on dark background, `--radius-lg`).
- One-action-per-screen pattern: a single `Button variant="primary"` at the bottom, plus optional ghost/secondary "пропустить" link.

### 4.3 Document-action screens

- Camera viewfinder full-bleed → quality check sheet → OCR progress → OCR review panel.
- Each step uses `BottomSheet` or `BottomCTA` as the action anchor.

### 4.4 List + detail pair

- `History` (`/patient/history`) — list of `AnalysisListItem` grouped by period.
- `AnalysisCardScreen` (`/patient/history/:analysisId`) — detail card with metric rows, range bands, source document preview.

### 4.5 Notification inbox

- `Notifications` (`/patient/notifications`) — inbox feed with `NotificationBanner` items.
- `NotificationAction` (`/patient/notification/:requestId`) — action detail with consent affordance and `BottomCTA`.

### 4.6 Access / sharing

- `Access` (`/patient/entry/access`) — initial grant: choice of scope + duration + consent.
- `Profile` exposes active grants via `AccessCard`; `RevokeAccessSheet` is the revocation modal.

---

## 5. Mock data & demo plumbing

- `src/data/mockData.ts` + `src/data/adminMockData.ts` — fixtures (admin file unused in patient defence).
- `src/store/seed.ts` — initial Zustand state.
- `src/store/segments.ts` + `DemoToolbar` — dev-only segment switcher (`?demo=home` deep-link, see `src/App.tsx:27`).
- `src/lib/ocr-mock.ts` — simulated OCR with high / low / no-confidence branches.
- `src/lib/consent-text.ts` — copy for separate consent purposes (152-FZ separation).
- `src/lib/onboarding-mocks.ts` — sample onboarding values.
- `src/lib/historyEvents.ts` — timeline event fixtures.
- `src/lib/analytics.ts` — analytics stub (no real telemetry).
- `src/copy/ru.ts` (799 LoC) — full RU UI copy. No EN dictionary.

---

## 6. Already-known gaps (for Claude Design to confirm/extend)

Items that look load-bearing for the defence narrative but feel incomplete on first read of the code. Claude Design should treat these as starting hypotheses for the `proposed-changes.md` output.

All 8 originally-known gaps have been triaged in `proposed-changes.md` and resolved as part of Track B step 3. Status as of 2026-05-13:

1. **Dead legacy button components.** **[APPLIED]** `components/PrimaryButton.tsx` and `components/SecondaryButton.tsx` removed. `primitives/Button.tsx` is the only Button surface.
2. **Two status-chip components.** **[APPLIED]** `components/StatusChip.tsx` removed; all call sites migrated to `primitives/StatusBadge.tsx`. `StatusTone` union renamed `danger` → `error` for naming consistency. `ChipVariant` type removed from `src/types/index.ts`.
3. **Spacing tokens declared but never consumed.** **[APPLIED]** Tailwind config gained 4 off-default aliases (`7-token` = 32px, `8-token` = 40px, `9-token` = 48px, `10-token` = 64px) so future layout code can opt in via `pb-8-token`. Existing `p-3/gap-4/pb-8` usage stays — Tailwind defaults already match `--space-1`..`--space-6`.
4. **Trends/graphs.** **[DOC-ONLY]** Chart tokens remain in CSS as preserved infrastructure for post-MVP. Resolution per `proposed-changes.md §4`: omit from the defence Figma System page; the patient demo narrative uses metric-row + status-badge.
5. **Dark-mode tokens declared but never visually tested.** **[DOC-ONLY]** `@media (prefers-color-scheme: dark)` kept in CSS (low cost, optionality). Will be excluded from the defence Figma library; reintroduced post-MVP via Figma Variables modes.
6. **Legacy Vasily palette still in source.** **[DOC-ONLY]** `--legacy-*` tokens kept. To be isolated in the Figma library under a "Marketing / Vasiliy" subsection in step 4.
7. **No empty-state pattern shipped explicitly.** **[APPLIED]** Added `primitives/EmptyState.tsx`. Migrated `routes/patient/Notifications.tsx` and `routes/patient/History.tsx`. `Profile` deliberately skipped — its "Add email" affordance is a small inline row, not a full-screen empty pattern, so EmptyState would visually overwhelm it.
8. **Consent variants of Button.** **[NO-OP]** No new variant needed. Verified at `Consents.tsx:271` that the bottom CTA already reads «Принять и продолжить» — the gate-by-scroll/checkbox + analytics event + explicit copy already satisfies 152-FZ.

**Three additional changes applied in the same pass:**
- `tailwind.config.js` — file-level comment now explains the intentional `cyan-*` → brand-blue palette override (`proposed-changes.md §9`).
- `colors_and_type.css` — orphan `--blue-075` token (zero consumers) removed (§10); `--radius-md/lg/xl` comments updated to document what each radius is actually used for in card vs nested-element contexts (§12).
- `proposed-changes.md` — new §13 records the **rejection** of an unannounced `--emerald-*` ramp Claude Design silently introduced in its CSS export but never declared as a proposed change.

---

## 7. How this maps onto Track B downstream

- **Step 2 (Claude Design):** **DONE.** Artifacts committed in `4d677cc` (2026-05-13): `tokens.json`, `components.md`, `patterns.md`, `proposed-changes.md`. Bundle was a tar.gz handoff from `claude.ai/design`; only the 4 canonical artifacts were promoted into the repo (HTML previews, ui_kits, and Claude Design's own `colors_and_type.css` not imported).
- **Step 3 (Claude Code):** **DONE.** §1, §2, §3, §7, §9, §10, §12 applied in code; §8 verified no-op; §4, §5, §6, §11 deferred to Figma decisions in step 4; §13 (silent emerald ramp) rejected and documented. Build verified clean via `npm run build`.
- **Step 4 (Figma MCP, manual):** **NEXT.** Build Figma file with three pages — `01 — Design System` (tokens + components), `02 — Screens` (4–6 patient screens), `03 — User Flow` (the consent-flow path used on slide 06). Must reflect the step-3 decisions: only one Button system, only `StatusBadge`, `EmptyState` as a primitive, chart/dark/mono omitted, legacy Vasiliy palette in a "Marketing" subsection.
- **Step 5 (screenshots):** desktop 1440×900 (`slide-07-*`) + mobile 390×844 (`slide-08-*`), saved into `prototypes/figma-export/`.

---

*Generated by Claude Code on 2026-05-13 from `intel-doc-prototype/src` at branch `main`. Re-run after any large component or token refactor before kicking off Claude Design again.*
