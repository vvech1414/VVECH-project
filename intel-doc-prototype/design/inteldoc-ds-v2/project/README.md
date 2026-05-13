# IntelDoc Design System

IntelDoc is a **B2B2C digital health platform for clinics** that helps patients with chronic diseases (primarily **Type 1 & Type 2 diabetes**) aggregate and share scattered lab results, and gives doctors a fast web cockpit with structured data and advisory AI to prepare for visits faster, improve follow-up monetization, and fit into clinic workflows with minimal integration.

The product has two complementary surfaces:

| Surface                | Audience        | Form        | Notes                                            |
| ---------------------- | --------------- | ----------- | ------------------------------------------------ |
| **IntelDoc (app)**     | Patients        | iOS, 440×956 | Daily log of glycemia, insulin, food, activity. Chat with AI assistant "Василий". Marketplace for consumables. |
| **IntelDok (cockpit)** | Clinicians      | Web 1920×1080 | Structured patient data, AI advisory to prepare for visits. (Surface present mostly as pitch-deck mockups in the Figma, not full UI yet.) |

The brand leans on a friendly blue mascot — **Vasiliy (Василий)**, a droplet/doctor hybrid — who acts as the AI assistant and appears across onboarding, empty states, and recommendations.

## Sources

- **Figma file** — attached as `My_projects.fig` (virtual FS).
  Relevant pages: `/IntelDoc_UI` (17 patient-app frames and bottom sheets), `/IntelDok` (64 frames; mostly pitch-deck slides and duplicates of the same patient screens), `/Souzniy` (social-cards), `/PitchDeck` (unrelated — different client/project, ignored).
- **Uploaded PNG mockups** in `uploads/` — high-fidelity renders of the 7 core patient screens and 9 bottom-sheets.
- **Brand tokens** — supplied directly in the prompt (primary/success/warning/error for light+dark mode).

The product is **Russian-language-first**; all copy is in Russian. Mascot is "Василий" (Vasiliy), patient persona is "Михалыч" (Mikhalych).

---

## CONTENT FUNDAMENTALS

**Language.** Russian throughout. Microcopy is casual and personal — addresses the user with the informal «ты» and nicknames ("Михалыч"), not the formal «Вы». The AI assistant speaks in the first person and signs messages with his name ("Василий").

**Tone.** Warm, empathetic, lightly humorous — never clinical or stern. Example chat snippet from the app:

> **Василий:** Наблюдается тенденция к изменению твоего фактора чувствительности, что приводит к гипогликемиям
> **Михалыч:** Охренеть. И что делать?
> **Василий:** Попробуйте меньше жрать

This is intentional: it lets users (often older patients managing chronic disease) feel spoken-to rather than managed. Keep humor dry, never condescending.

**Greeting style.** Time-of-day + first name: «Добрый день, Михалыч». Two-line layout, 18 px Manrope Bold.

**Casing.**
- Screen titles: **Title case in Russian convention** — first letter cap only: «Гликемия», «Дневник», «Маркет», «Профиль».
- Buttons: **Sentence case** — «Заказать», «Пополнить», «Задать вопрос».
- Small tags / chip labels: **UPPERCASE** (letter-spaced) — «ЗА 12 ЧАСОВ», «ПОПОЛНИТЬ», «БОЛЬШЕ».
- Category chips: **Sentence case** — «Гликемия», «Инсулин», «Еда», «Активность».

**Numerical values.** Always with units, space between number and unit: «4.5 ммоль/л», «10 мл», «633 ккал», «170 см», «70 кг», «₽ 8 669». Dates: «15 августа», «12 Августа 2003».

**Emoji.** None in core product UI. Occasional 🏆 / award imagery appears as a *rendered illustration* inside a card, never as an emoji glyph.

**Voice rules.**
- First person for the assistant («Я Василий, твой личный помощник»).
- Imperative for primary CTAs («Добавить», «Сохранить», «Обсудить», «Заказать»).
- Short copy — average card description = 1–2 sentences.
- No exclamation marks except greetings from Vasiliy («Привет!»).

---

## VISUAL FOUNDATIONS

### Color

IntelDoc runs a **dual-palette** system, reflecting the dual surfaces of v.1:

**Product palette (patient app + clinician cockpit) — medical B2B2C**
- Primary blue `#2563EB` (`--blue-600`) — medical indigo-blue. Drives every CTA, active tab pill, link, and the hero "appointment ready" card. Ramp 050 → 900; hover `#1D4ED8`, pressed `#1E3A8A`.
- Neutrals are the **slate-\*** cool scale: page bg `#F8FAFC`, card bg `#FFFFFF`, borders `#E2E8F0`, body text `#1E293B`, muted text `#64748B`.
- Sunken info panels use `#EFF6FF` (`--blue-050`) and avatar chips use `#DBEAFE` (`--blue-100`).

**Marketing palette (pitch deck + mascot) — kept as `--legacy-*`**
- The saturated Vasiliy blue `#006FFD`, cyan `#DCF2FF`, deck blue `#476DF6` — these stay in the deck and the Vasiliy mascot only.

**Semantic — soft & medical** (not the harsh reds/oranges of the original spec):
- `--success #10B981` (emerald) · bg `#ECFDF5` — "В норме" dot, "Активен" tag
- `--warning #F59E0B` (amber) · bg `#FFFBEB` — "Выше нормы" dot, reference-range banner
- `--error #E11D48` (rose) · bg `#FFF1F2` — "Просрочено" badge, overdue alerts

**Category pastel tints** drive the action tiles and timeline tags:
- Analyses → blue `#DBEAFE` / `#1D4ED8`
- Imaging (УЗИ / МРТ) → lavender `#EDE9FE` / `#7C3AED`
- Consults / notes → mint `#D1FAE5` / `#059669`
- Requests → orange cream `#FFEDD5` / `#C2410C`

All of these live as `--action-*` and `--cat-*` tokens in `colors_and_type.css`.

### Type

- **Manrope** is the product typeface (all weights, especially 400/500/700). Tight letter-spacing (+0.005 em), 100% line-height on headings, 20 px / 1.43 on body.
- **Montserrat + Montserrat Alternates** is the display typeface for marketing/pitch surfaces. Big, geometric, 500 weight, negative tracking.
- **Inter** is used for dense data tables and numbers in the cockpit.
- No italics. Headings are always weight 700. Numbers are set tabular-aligned.

### Spacing / Layout

4-pt grid. Screens are **440 × 956** iOS portrait. All content lives inside a 16 px side margin; cards are 408 px wide, 16 px internal corner radius. Cards stack with 24 px vertical gaps. Tab bar is 89 px tall with a 32 px bottom safe-area inset.

**Fixed elements:** status bar (44 px), top nav (50 px), floating + button (80 × 75 px circle, cyan-blue, 16 px above tab bar), tab bar.

### Backgrounds

- Product app/cockpit background is `#F8FAFC` (`--slate-050`). Cards sit on white.
- The marketing deck keeps its cyan bg `#DCF2FF`.
- Legacy Vasiliy radial halo (`rgba(147,197,253,0.55) → 0`) only appears around the mascot.
- No patterns, no textures, no photos as full-bleed backgrounds. The only imagery is Vasiliy-the-mascot, patient avatars (slate-blue initials on `--blue-100`), and marketplace product PNGs.

### Motion

- Transitions are short and gentle: **200 ms, ease-out cubic** `cubic-bezier(0.16, 1, 0.3, 1)`.
- Bottom sheets slide up with a subtle overshoot (~360 ms).
- No bouncy springs, no staggered list entrances. Feel is "medical-calm", not "app-marketing-playful".

### Hover / Press / Focus

Mobile-first, so hover is rare. Press states:
- Primary buttons: darken to `#1D4ED8` and shrink to `scale(0.98)`.
- Secondary (outline): fill tint to `#EFF6FF`.
- Chips: active chip fills with primary blue + white text; inactive chips have slate-200 border + slate-700 text.
- Focus ring: `0 0 0 4px rgba(37,99,235,0.16)` — only on web/cockpit, not mobile.

### Borders & Shadows

- **Borders** are used sparingly — 1.5 px on secondary buttons and chip outlines (exact Figma value), 1 px `#E8E9F1` for table dividers.
- **Shadow system:**
  - `xs` — faint 1 px line shadow for pinned chips
  - `sm` — `0 2 8 rgba(15,16,20,.06)` for floating elements
  - `md` — `0 8 24 rgba(15,16,20,.08)` for modals
  - `lg` — `0 18 40 rgba(3,65,180,.12)` — only for the floating + button (blue-tinted)

No inner shadows. No "bevel" or "glass" effects beyond one place:

### Transparency & Blur

The **tab bar** is the only glass surface: `rgba(255,255,255,0.3)` + `backdrop-filter: blur(40px)`. Gives the illusion the tab bar floats over the content during scroll.

### Corner radii

- 12 px — buttons, chips, inputs
- 16 px — cards, the avatar
- 20 px — large panels, bottom sheets (top corners only), chat bubbles
- 999 px — pills (category chips "ЗАВТРАК", "ОБЕД")

### Cards

Rounded 16 px, filled with `#F8F9FE` (very light blue-gray), **no border, no shadow**. Padding is 24 px on all sides. Title row is a flex row with title on the left and a link-chip («ЕЩЕ ›», «ПОПОЛНИТЬ +») on the right.

### Imagery vibe

Cool, flat, mildly stylized 3D — the Vasiliy mascot is a rendered 3D character with cyan skin, white doctor hat, and a blue-shield badge. Avatars are photographic, cropped circular-squared (16 px radius). Marketplace product images are PNG cutouts on soft blue tiles — no hard product-photo shadows.

---

## ICONOGRAPHY

The Figma file uses **Iconsax (Vuesax)** line/bold icons — visible in component names like `VuesaxBoldNotification`. Stroke weight is uniform, solid-filled variants used for active states (filled heart, filled bell for unread).

No icon font is bundled. Icons are stored as inline SVG paths. For this design system we:
- **Ship Lucide icons via CDN** as the primary set — same ~1.5 px stroke, same geometric vocabulary, covers every icon used in the product.
- Keep the original Vasiliy mascot PNG in `assets/` as the most important brand asset.
- The big "+ Add" FAB icon is custom — a thick white plus on a circular blue fill; we recreate it in CSS/SVG.
- The mascot-halo shape (5-point star behind Vasiliy's "37.5%" time-in-range badge on the home screen) is also custom SVG.

**Emoji is never used.** No unicode icon glyphs (✓ ★ → etc.) are used in core UI — everything is an SVG.

**Flag:** Iconsax was replaced with Lucide because no Iconsax CDN exists. If you want pixel-parity icons, export them from Figma or upload the Iconsax SVGs to `assets/icons/`.

---

## Index

- `README.md` — this file
- `SKILL.md` — Agent-Skills manifest so this folder can be used as a Claude-Code skill
- `colors_and_type.css` — token system (colors, type ramp, spacing, shadows, motion)
- `assets/` — brand imagery (Vasiliy mascot, founder portrait, app hero phone render)
- `preview/` — small Design-System-tab preview cards (one per token group / component)
- `ui_kits/mobile/` — IntelDoc patient-app UI kit (JSX components + interactive `index.html`)
- `ui_kits/cockpit/` — IntelDok doctor-cockpit UI kit (web, directional recreation — see its README)
- `slides/` — sample pitch slides (5 slides, 1920×1080, grounded in `New_pitch_ENC` visual DNA)
