# Design System — Current State (snapshot 2026-05-13)

> **Purpose:** input for Claude Design (Track B step 2) so it doesn't extract blind. Compiled from `intel-doc-prototype/src/` at branch `main`, commit base `20782ec`.
> **Scope:** Patient app only (defence scope). Components in `src/components/doctor/` and `src/components/admin/` exist on disk but are not mounted in `App.tsx` and are out of scope for the defence on 2026-05-16.

---

## 1. Stack & tooling

- **Bundler/runtime:** Vite 5.4, React 18.3, TypeScript 5.6, React Router 7.14.
- **State:** Zustand 5 (`src/store/store.ts` + `seed.ts` + `selectors.ts` + `actions.ts`).
- **Styling:** Tailwind CSS 3.4 (`tailwind.config.js`) + CSS custom properties (`src/design/colors_and_type.css`, 316 LoC) + `src/index.css`.
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
| `StatusBadge` | `primitives/StatusBadge.tsx` | success / warning / error / info / neutral | mirrors `StatusChip` semantics for inline usage |

### 3.2 Shared components (`src/components/`)

| Component | Path | Purpose |
| --- | --- | --- |
| `AppShell` | `components/AppShell.tsx` | mobile shell variant (top header + bottom tab) |
| `PartnerHeader` | `components/PartnerHeader.tsx` | sticky clinic-context header (ЭНЦ name, logo slot) |
| `StatusChip` | `components/StatusChip.tsx` | small pill: success / warning / error / info / neutral · sizes sm/md |
| `PrimaryButton` | `components/PrimaryButton.tsx` | legacy primary CTA (older — `Button` is the new canonical) |
| `SecondaryButton` | `components/SecondaryButton.tsx` | legacy secondary CTA |
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

### 3.5 Routes (`src/routes/patient/`)

Mounted in `src/App.tsx` (22 routes total — 6 onboarding + 16 main app). See `docs/01-scope-and-vision.md` §1 for the full list.

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

1. **Two parallel button systems.** `primitives/Button.tsx` is the modern canonical (4 variants, 2 sizes, icon slots). `components/PrimaryButton.tsx` + `components/SecondaryButton.tsx` are older single-purpose wrappers still imported in some routes. → Decide: deprecate the legacy pair or formalise both?
2. **Two status-chip components.** `components/StatusChip.tsx` and `primitives/StatusBadge.tsx` share semantics (success / warning / error / info / neutral). → Pick one canonical.
3. **Spacing tokens declared but inconsistently consumed.** `--space-*` exists, but most components use raw Tailwind `p-3/p-4/gap-2` etc. → Decide whether to back Tailwind by token aliases (e.g., `spacing.4: 'var(--space-4)'`).
4. **Trends/graphs.** Chart tokens (`--chart-*`) are defined but no chart component is shipped — `AnalysisCardScreen` shows metric rows only. → Either add a minimal sparkline / trend component or scope it as post-MVP and remove the data-viz tokens from the System page in Figma.
5. **Dark-mode tokens declared but never visually tested.** `@media (prefers-color-scheme: dark)` block exists in `colors_and_type.css`. → Decide: include in defence Figma or strip for clarity.
6. **Legacy Vasily palette still in source.** `--legacy-*` tokens kept for the marketing deck / mascot. Should they appear in the Figma library (under "Marketing" subsection) or be excluded?
7. **No empty-state pattern shipped explicitly.** Routes likely render text-only fallbacks. → Worth proposing a reusable `EmptyState` component for `History`, `Notifications`, and `Profile/access list`.
8. **Consent variants of Button.** The consent modals reuse `Button variant="primary"`. → Track B should evaluate whether a dedicated `variant="consent"` is justified by 152-FZ audit requirements (visually distinct, slower acknowledgement) or whether the modal context is enough.

---

## 7. How this maps onto Track B downstream

- **Step 2 (Claude Design):** consume this file plus the React source to emit `tokens.json` (Tokens Studio compatible), `components.md`, `patterns.md`, and `proposed-changes.md` covering at minimum the 8 gaps above.
- **Step 3 (Claude Code):** apply `proposed-changes.md` in code (resolve duplicate Button / Chip pairs, decide spacing-token policy, add `EmptyState` if approved).
- **Step 4 (Figma MCP):** build Figma file with three pages — `01 — Design System` (tokens + components), `02 — Screens` (4–6 patient screens), `03 — User Flow` (the consent-flow path used on slide 06).
- **Step 5 (screenshots):** desktop 1440×900 (`slide-07-*`) + mobile 390×844 (`slide-08-*`), saved into `prototypes/figma-export/`.

---

*Generated by Claude Code on 2026-05-13 from `intel-doc-prototype/src` at branch `main`. Re-run after any large component or token refactor before kicking off Claude Design again.*
