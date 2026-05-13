# IntelDoc — Proposed Changes (Track B gaps → resolutions)

This document closes out the 8 known gaps surfaced in `docs/design-system/current-state.md §6` and adds a few extras Claude Design found while extracting the system. Each item has a **rationale tied to the medical patient-app context** so the team can decide intentionally rather than mechanically. Most map cleanly to either a code refactor (Track B step 3) or a Figma-library decision (step 4).

The list is ordered by **load-bearing impact for the 2026-05-16 defence**, not by code size.

---

## 1 · Two parallel button systems → deprecate the legacy pair

**State.** `primitives/Button.tsx` is the modern canonical (4 variants, 2 sizes, icon slots, universal `active:scale-[0.98]` feedback). `components/PrimaryButton.tsx` + `components/SecondaryButton.tsx` are older single-purpose wrappers still imported in a handful of entry routes.

**Decision.** Deprecate the legacy pair. The canonical Button covers every legacy use:

| Legacy | Replace with |
|---|---|
| `<PrimaryButton …>` | `<Button variant="primary" size="lg" full …>` |
| `<SecondaryButton …>` | `<Button variant="secondary" size="lg" full …>` |

**Migration**, single PR (low risk, ~30 LoC touched):
1. `grep -rn "PrimaryButton\|SecondaryButton" src/`
2. Replace at each call-site.
3. Delete `components/PrimaryButton.tsx`, `components/SecondaryButton.tsx`.
4. Visual regression: run `Welcome → Account → Access → Consents` flow — all four screens have a legacy CTA. Should be pixel-identical because the legacy wrappers themselves call into Tailwind classes equivalent to `Button(primary)`.

**Rationale.** Carrying two button surfaces makes the Figma library confusing for the defence committee — they'll see two component cards that look the same and ask why. One canonical button removes that question.

---

## 2 · Two parallel status-chip components → keep `StatusBadge`, remove `StatusChip`

**State.** Both `primitives/StatusBadge.tsx` and `components/StatusChip.tsx` render the same five tonalities (success / warning / error or danger / info / neutral) with pixel-identical Tailwind classes. The only differences: `StatusBadge` has a `pulse` mode for active-state dots; `StatusChip` uses `error` where `StatusBadge` uses `danger`.

**Decision.** Keep `StatusBadge` (it's the newer, richer implementation). Rename `danger` → `error` to align with the rest of the semantic palette (`--color-error`, `errorBg`, etc).

**Migration:**
1. In `StatusBadge.tsx`, rename `StatusTone` union: `'danger'` → `'error'`. Update internal `TONE` map.
2. `grep -rn "tone=\"danger\"" src/` → swap to `tone="error"`.
3. `grep -rn "StatusChip" src/types.ts src/components/` → swap each call to `StatusBadge` (adjust prop name `variant` → `tone`, `label` → children).
4. Delete `components/StatusChip.tsx` and the `ChipVariant` type from `src/types.ts`.

**Rationale.** Same as §1 — one canonical badge for status semantics. Aligns the chip API with the rest of the semantic naming (`error`, not `danger`).

---

## 3 · Spacing tokens declared but not consumed → alias into Tailwind

**State.** `--space-1` through `--space-10` are defined as CSS variables in `colors_and_type.css`, but the Tailwind config doesn't reference them — instead, code uses raw Tailwind classes like `p-3`, `gap-4`, `pb-8`. The token layer and the consumption layer have drifted.

**Decision.** Tailwind's default `0.25rem` (=4px) spacing scale **already coincides** with the IntelDoc `--space-*` scale (4 / 8 / 12 / 16 / 20 / 24px). The pragmatic fix is to **declare equivalence and document it**, not refactor every `p-3` to `p-[var(--space-3)]`.

In `tailwind.config.js`, add a *minimal* alias under `theme.extend.spacing` for the values that DON'T match Tailwind default (`--space-7` = 32px ≠ `7` = 28px; `--space-8` = 40px ≠ `8` = 32px; `--space-9` = 48px ≠ `9` = 36px; `--space-10` = 64px ≠ `10` = 40px):

```js
extend: {
  spacing: {
    '7-token': '32px',   // --space-7
    '8-token': '40px',   // --space-8
    '9-token': '48px',   // --space-9
    '10-token': '64px',  // --space-10
  }
}
```

For values 1–6 (4–24px), Tailwind defaults are already on-grid — keep `p-3`, `gap-4` etc.

**Migration:** none required for existing code; document the equivalence in `components.md` § Spacing and the Figma System page.

**Rationale.** Refactoring ~200 spacing class occurrences before the defence would burn risk for zero visual change. A documented equivalence is enough to defend the claim "the system uses an 8/4 grid".

---

## 4 · Chart tokens declared but no chart component shipped → scope as post-MVP

**State.** `--chart-in-range`, `--chart-low`, `--chart-high`, `--chart-band`, `--chart-grid` are defined; no chart component exists; `AnalysisCardScreen` renders metric rows only.

**Decision.** **Remove chart tokens from the defence Figma System page**. Re-introduce them when a trend/sparkline component lands (post-MVP).

The defence narrative for HbA1c trend is already covered by the metric-row + status-badge pattern (`5.4 ммоль/л · В норме`). Showing chart tokens without a chart implementation invites the question "where is it used?" — which has no answer today.

**If the team disagrees** and wants chart tokens to remain visible: add a 60×60 placeholder svg sparkline to the AnalysisCardScreen prototype showing 3 points coloured by the existing `chart-*` tokens. The shipping bar is "user sees one example in the prototype before the chart tokens appear in the Figma library".

**Rationale.** Defending tokens that aren't used in code makes the system look like a wishlist. The 17-initiative roadmap covers the chart story for post-MVP.

---

## 5 · Dark-mode tokens declared but never visually tested → strip from defence Figma

**State.** `@media (prefers-color-scheme: dark)` block in `colors_and_type.css` overrides the semantic layer with dark values. Never tested visually; no QA pass; no screen shipped with dark mode in mind.

**Decision.** **Keep the dark-mode block in code** (low cost, gives the team optionality), **omit from the defence Figma library**. The Figma System page should declare "light mode only — dark mode planned for post-MVP".

When dark mode is properly designed (separate pass), Add the colours to the Figma library as a second mode using Figma Variables modes.

**Rationale.** Dark-mode endurance testing on health UIs is non-trivial (status colours often look wrong against dark surfaces). Shipping it untested makes the system fragile.

---

## 6 · Legacy Vasiliy palette → keep, isolate to a "Marketing" subsection

**State.** `--legacy-blue-*`, `--legacy-mint-*`, `--legacy-peach-*`, `--legacy-amber-*`, `--legacy-violet-*` are kept for the marketing deck + mascot illustration support.

**Decision.** **Keep them.** Isolate to a clearly-labeled "Marketing / Vasiliy" subsection in the Figma System page (and in `tokens.json` under a separate `marketing` token group if Tokens Studio import is in scope).

Within the product surfaces (patient app), there is **no path** to use a legacy token. If a future component imports `--legacy-blue-700`, a lint rule should warn — that's a follow-up nice-to-have.

**Rationale.** The mascot illustration is brand-defining (it's literally the IntelDoc icon). Stripping the supporting palette would orphan the asset.

---

## 7 · No empty-state pattern → add `<EmptyState>` primitive

**State.** Empty states are rendered ad-hoc per route. Notifications screen has a hand-rolled one with the right anatomy (icon tile + heading + caption + inline action). History, Profile/access list, and ServicePlaceholder all have similar-but-not-identical structures.

**Decision.** Add a reusable `<EmptyState>` primitive in `primitives/EmptyState.tsx`. API:

```ts
interface EmptyStateProps {
  Icon: LucideIcon
  tone?: 'info' | 'neutral'           // controls tile colour
  title: string
  body: string
  action?: { label: string; onClick: () => void }
}
```

Composition mirrors `patterns.md §5`:
- 64×64 `rounded-2xl` tile, `bg-cyan-50 text-cyan-500` for info (default) or `bg-slate-100 text-slate-500` for neutral.
- `t-h2` title.
- `t-caption` body, max-w-[280px], text-center.
- Optional `t-micro` uppercase tracking-caps action (just a button, no chevron).

**Migration:** drop-in replace 3 places: `Notifications` (empty inbox), `History` (no analyses yet), `Profile` (no email contact added).

**Rationale.** Empty states are the most common place inconsistency creeps in. Hard-coding the canonical anatomy as a primitive prevents future drift.

---

## 8 · Consent variant of Button → NOT justified, keep current

**State.** The consent modals reuse `Button variant="primary"`. The question was whether 152-FZ audit needs a visually distinct variant.

**Decision.** **No new variant.** The current solution is already audit-compliant:

1. The button is **gated** by either scroll-to-end OR a11y-checkbox (see `patterns.md §3`).
2. An analytics event with the gate mechanism fires on acknowledgement (`consent_acknowledged: { mech: 'scroll_to_end' | 'a11y_checkbox' }`).
3. The button copy is explicit: «Я прочитал(а) и согласен(а)» — not generic «Продолжить».

Adding a fifth visual variant would dilute the meaning of "primary action" without strengthening the audit. The gate + explicit copy + event log carries the legal weight.

**Optional copy guideline**: when the parent screen is a consent step (Consents.tsx), the *bottom-CTA* button below the list of blocks reads «Принять и продолжить», not «Далее» — to reinforce the affirmative act.

**Rationale.** 152-FZ doesn't prescribe visual semiotics for the consent CTA; it prescribes informed and recorded affirmative consent. The current behaviour satisfies the substance.

---

## 9 · Extra · Tailwind `bg-cyan-*` is actually blue-* — document the override

**State.** The Tailwind config rewrites the `cyan-*` palette to the medical-blue scale (`#EFF6FF` → `#1E3A8A`) so historical class names continue to resolve correctly. This is an intentional hack — but it is **non-obvious** to a new contributor who would expect `bg-cyan-500` to be Tailwind's bright cyan `#06B6D4`.

**Decision.** Two-step:
1. Add a one-line comment at the top of `tailwind.config.js` explaining the override (currently buried in a code comment).
2. In the Figma System page, label the colour scale "Brand blue (Tailwind alias: `cyan-*`)" so reviewers don't trip on it.

**Migration:** doc-only.

**Rationale.** This is the single biggest "wait what?" moment for anyone reading the code without context. Disclosing it explicitly de-risks the public defence ("Why is it called cyan if it's blue?" — answer is rehearsed).

---

## 10 · Extra · `--blue-075` token has unusual naming — rename to `--blue-100-soft` or remove

**State.** Between `--blue-050` (#EFF6FF) and `--blue-100` (#DBEAFE), the file declares an intermediate `--blue-075` (#E7EFFE). The "075" naming is unusual (no other ramp uses fractional steps) and there's only ONE place this token is used (a non-load-bearing accent in a chart-band variant).

**Decision.** Either rename to `--blue-100-soft` for clarity, OR remove it and reuse `--blue-050` in its single site. Recommended: **remove** — the visual difference at that opacity is below perception threshold against the surrounding `blue-050` band.

**Migration:** trivial.

**Rationale.** A clean ramp tells a clearer story in the Figma library. One-off intermediate steps are technical debt.

---

## 11 · Extra · `--font-mono` declared but no brand monospace → keep system fallback, drop from library

**State.** The mono family is declared as `ui-monospace, SFMono-Regular, Menlo, monospace` — system fallback only. No brand monospace is licensed. No place in the patient app uses mono (data uses Inter with tabular-nums).

**Decision.** Drop from the Figma library text-styles page. Keep in CSS as a fallback for any future devtools/debugging surface.

**Migration:** doc-only.

**Rationale.** Listing a family in the library implies it's used. It isn't.

---

## 12 · Extra · Card border-radius drift

**State.** Cards across the system use a mix of `rounded-2xl` (20px per Tailwind config), `rounded-xl` (16px), and `rounded-[20px]` (literal). The `--radius-lg` token says 16px; `--radius-xl` says 20px. Code drift.

**Decision.** **Standardize on 20px (`--radius-xl`) for primary cards, 12px (`--radius-md`) for nested elements**, matching what the Home/Profile/Notifications majority actually use. Update `--radius-lg` description in `colors_and_type.css` to say "secondary cards, list items" and `--radius-xl` to say "primary content cards".

**Migration:** in `primitives/Card.tsx`, the default is already `rounded-2xl`. No change. Document the convention.

**Rationale.** The drift exists because the system was extracted post-facto. Documenting "what 2xl actually means" lets reviewers verify the system matches the screens.

---

## Summary of recommendations

| Type | Count | Effort |
|---|---|---|
| Code refactor (single PR) | 3 | §1 deprecate buttons · §2 unify badges · §7 add EmptyState |
| Tailwind config edits | 1 | §3 spacing alias |
| Documentation only | 6 | §4 chart placeholder · §5 dark mode out · §6 marketing isolation · §8 keep consent · §9 cyan note · §10 0.075 remove · §11 mono · §12 radius |
| Out-of-scope (post-MVP) | 2 | dark mode + chart component |

**Before defence:** items §1, §2, §7 should be code-merged (low-risk, visible quality wins). Items §9, §12 should be in the README. Everything else can be documentation-only.
