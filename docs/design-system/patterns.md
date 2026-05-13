# IntelDoc — Layout & Interaction Patterns

Recurring page-level compositions and interaction patterns extracted from the patient-app routes. Each pattern is named, anatomy-decomposed, and tied back to the product context (consent regime, 35–65 audience, RU UI).

---

## 1 · Mobile shell (the canonical patient screen)

Every signed-in patient route lives inside `PhoneFrame` and follows this anatomy from top to bottom:

```
┌──────────────────────────────────────┐  PhoneFrame
│ TopHeader          (h ≈ 64, sticky)  │  ← lockup + bell + avatar
├──────────────────────────────────────┤
│                                      │
│   scrollable section stack           │  ← px-5, flex flex-col gap-4
│     - hero / urgent banner           │     pb-[108–110px] to clear TabBar
│     - context cards (bg-white)       │
│     - nested sunken panels           │
│     - service carousel               │
│                                      │
├──────────────────────────────────────┤
│ TabBar             (h = 89, sticky)  │  ← frosted white, blur(40px)
└──────────────────────────────────────┘
```

**Rules:**
- Page background is **always** `--slate-050`. Never gradient, never image.
- Outer horizontal padding is **always** `px-5` (20px) on the scroll container. Inner cards use their own `p-4` or `p-5`.
- Vertical rhythm between sibling sections inside one screen is **always** `gap-4` (16px). Inside one card the rhythm is `gap-3` (12px).
- The last section gets bottom padding ≥ `pb-[108px]` so it doesn't get hidden under the TabBar.
- TabBar **floats** as an `absolute bottom-0` (sticky relative to PhoneFrame). It is part of the shell, not the route. Routes never render their own bottom navigation.

**When NOT to use this shell:**
- Onboarding (Welcome → Account → Access → Consents → Setup) uses `OnboardingChrome` instead of `TopHeader` and never shows `TabBar`.
- Action-modal routes (DocUpload / camera) use `PhoneFrame` but suppress both TabBar and TopHeader to give the camera full-bleed.

---

## 2 · Onboarding chrome (pre-flow + 4-step)

Each onboarding step shares the same chrome:

```
┌──────────────────────────────────────┐
│ [← back]  IntelDoc × ЭНЦ pill  [.]   │  ← centred co-brand
│                                      │
│  ── ── ── ── (3-segment progress)    │  ← step / totalSteps
│  ПРОФИЛЬ · ШАГ 1 ИЗ 3                │  ← caps tracking 0.04em
└──────────────────────────────────────┘
```

**Decisions encoded in `OnboardingChrome.tsx`:**
- The **back arrow is hidden on Screen 1** (Welcome) — there's no exit point. From Screen 2 onward it's always present.
- The **progress bar is omitted on Screen 1** (pre-flow).
- Label always uses Sentence-cased step name + middle-dot + step number: `Профиль · Шаг 1 из 3`.
- The label for the final step is `«Согласия · Последний шаг»` — not «Шаг 3 из 3» — to signal "almost done".
- `dark` variant inverts the chrome for hero screens that sit on a dark surface (Welcome).

**Rationale.** The audience is 35–65, often using a clinic app for the first time. A visible step counter + step name is more reassuring than a generic spinner-style progress dot.

---

## 3 · Read-and-acknowledge consent pattern (152-FZ)

The 152-FZ separation requires the patient to consent **separately** to each ground of data processing. Every consent block (A/B/D) uses the same modal pattern:

```
┌──────────────────────────────────────┐  bottom-sheet, calc(100vh - 40px)
│  Согласие · блок A          [×]      │
│  ───────────────────────────────────  │
│                                      │
│  (scrollable text body)              │  ← whitespace-pre-line
│                                      │
│                                      │
│  ┌───────────────────────────────┐  │
│  │ ☐ Я ознакомился(ась) с пол-   │  │  ← a11y alternative
│  │   ным текстом…                 │  │
│  └───────────────────────────────┘  │
│  ───────────────────────────────────  │
│  Чтобы продолжить, прочитайте текст… │  ← shown when CTA disabled
│  [   Я прочитал(а) и согласен(а)  ]  │  ← Button(full), gated
└──────────────────────────────────────┘
```

**Mechanics (`ConsentModal.tsx`):**
- The acknowledge button is **disabled** until one of two gates fires:
  1. The scroll container reaches the bottom (24px tolerance).
  2. The user manually ticks the «Я ознакомился(ась)» checkbox.
- If the text is short enough that no scroll is needed, the gate fires immediately on open (otherwise users would be permanently blocked).
- Body scroll is locked while the sheet is open.
- On acknowledge, an analytics event fires with the gate that satisfied the requirement (`scroll_to_end` vs `a11y_checkbox`) — needed for audit.
- `directTick: true` consents (lightweight marketing-channel sub-consents) skip this modal entirely and use a simple checkbox.

**Why two gates.** Scroll-to-end is the default UX but accessibility users (screen-reader, switch-control) may not trigger scroll events the same way. The visible checkbox provides an a11y-equivalent acknowledgement path that an audit can verify.

---

## 4 · List + detail pair

The History → AnalysisCard pair is the canonical "list of items → detail" pattern:

```
List route                              Detail route
────────────                            ────────────
TopHeader                               header (back + title + spacer)
Chip filter row (period)                h1 ("Гликированный гемоглобин")
                                        meta line: date · StatusBadge
Group label (caps tracking)             3-up MiniFact grid (date / OCR / access)
  AnalysisListItem ──────────────────▶  Original-doc sunken card with thumbnail
  AnalysisListItem                      ───
  AnalysisListItem                      «РАСПОЗНАННЫЕ ЗНАЧЕНИЯ»
                                        MetricRow × N
                                        ───
                                        «Это не медицинское заключение…» footer
TabBar                                  (no TabBar — modal-feel detail)
```

**Rules:**
- The list route keeps the TabBar (it's a main destination).
- The detail route drops the TabBar (it's a stack-pushed view); back goes via header arrow → `nav(-1)`.
- Group labels in lists are always `text-[10px] font-bold uppercase tracking-caps text-ink-muted px-1` — sit above their group, not inside the first card.

---

## 5 · Empty state

```
┌──────────────────────────────────────┐
│                                      │
│         ┌─────────┐                  │
│         │  Bell   │  ← 64px tile,    │
│         │  icon   │     bg-cyan-50    │
│         └─────────┘     text-cyan-500 │
│                                      │
│    Пока ничего нового                │  ← t-h2 / 20px bold
│                                      │
│    Мы сообщим о запросах врача и     │  ← t-caption, max-w-[280px]
│    обновлениях плана.                │     text-center
│                                      │
│       [ Открыть историю ]            │  ← optional secondary action
│                                      │
└──────────────────────────────────────┘
```

Universal structure:
1. **Icon tile** — 64×64px, `rounded-2xl bg-cyan-50 text-cyan-500`, Lucide icon @ 28px / stroke 2.
2. **Heading** — `t-h2` (20px bold), Sentence case, no exclamation point.
3. **Single sentence** — `t-caption`, slate-500, max ~280px wide, text-center, never apologetic.
4. **Optional inline action** — uppercase 12px caps-tracking link, no chevron.

Empty states **never** say "к сожалению" / "ой" / "что-то пошло не так". They state the fact and (when applicable) point to the next thing the user can do.

---

## 6 · Document upload / OCR pipeline

A 4-step modal-feel flow that hijacks the entire PhoneFrame:

```
1. CameraViewfinder       (full-bleed black, viewfinder mask)
       │
       ▼
2. QualityCheck sheet     (BottomSheet, contrast / blur / cut-off badges)
       │  retake → 1
       │  accept → 3
       ▼
3. OcrProgress            (animated progress, mocked branches: high / low / no-confidence)
       │
       ▼
4. OCRReviewPanel         (MetricRow list, editable)
```

**Conventions:**
- Each step's primary action lives in a `BottomCTA` sticky bar at the bottom.
- Step 2 may emit retakes — never silently. The QualityCheck sheet **always** tells the user *what's wrong* (`Изображение размыто`, `Документ обрезан`) before offering retake.
- After acceptance, the OCR pipeline is opaque — the user sees animated progress with named sub-steps ("Распознаём текст…", "Сверяем с эталоном…"). No raw confidence scores leak.
- Low-confidence values surface inline in the OCRReviewPanel with a `Проверьте` amber pill next to them, NOT as a blocking error.

---

## 7 · Access / sharing pattern

The patient is always in explicit control of who sees what:

- **Initial grant** is collected in onboarding (Access screen) with: recipient (ЭНЦ) · scope checklist · "Доступ можно отозвать в любой момент" footer · signed-PEP CTA.
- **Active grants** live on Profile inside the "Связь с клиникой" card with three metadata rows: `Получатель`, `Срок` (`до …` or `бессрочно`), `Распространяется на` (`всех врачей клиники`).
- **Revocation** is always a 2-step confirmation via `RevokeAccessSheet`: explanation of consequences ("клиника увидит, что данные больше не передаются") + destructive primary button.
- **Audit transparency**: when `lastViewedAt` is set, a row "Последний просмотр: 12.05.2026" appears inside the grant card. This is the visual hook for the audit-log story.

---

## 8 · Doctor-request notification pattern

A patient may receive request notifications from a doctor (e.g. "Загрузите HbA1c за последние 3 месяца"). These follow a unified visual pattern:

- **Inline on Home** — `PrepBanner` hero CTA (`bg-blue-600` + pulse dot + "Перейти к загрузке" caps-cta) when there's at least one unseen request.
- **Inbox row** — Notifications screen renders the request grouped by date, with `category-tinted` icon (analysis/imaging/consult/note), title, brief body, and an optional `StatusBadge`.
- **Detail screen** — full request with `NotificationBanner type="action"` (amber tonality) at the top, doctor context, scope/limit, and a `BottomCTA` to begin the upload flow.

Only **one** PrepBanner shows at a time even if there are multiple unseen requests — the first by recency. The TabBar's history-tab unread dot remains until everything is acknowledged.

---

## 9 · Co-brand lockup placement

The IntelDoc × Partner lockup follows strict placement rules:

- **Onboarding** — pill variant, centred on the chrome row. Dark variant on Welcome hero, light variant on white-bg subsequent steps.
- **Main app** — plain variant inside `TopHeader`, left-aligned, replaces the title.
- **Partner header (legacy)** — single partner mark only (no IntelDoc side), used in nested deep pages where the IntelDoc side is implicit.

The lockup is **never** displayed bare — partner mark always shows on the *left* of `×`, IntelDoc on the right. The order communicates "you're in the clinic's space, powered by IntelDoc".

---

## 10 · Status colour usage

Across the system, a single semantic colour palette is reused without remapping. The same `mint-050 / emerald-700` pair is success in every context:

| Sense | bg | fg | Examples |
|---|---|---|---|
| **Готовность / приняли** | `mint-050` | `emerald-700` | AppointmentCard confirmed, StatusBadge success, ChecklistStep done |
| **Внимание / к загрузке** | `amber-050` | `amber-700` | NewAnalysesSection assigned, NotificationBanner action |
| **Ошибка / истёк** | `rose-050` | `rose-700` | AccessCard expired, MetricRow low-flag, OCR failure |
| **Информация / акцент** | `blue-050` | `blue-700` | Chip filter idle, AccessCard active sunken row |
| **Нейтральный** | `slate-100` | `slate-600` | StatusBadge neutral, "Без OCR" |

**Rule:** never map the same status to two different colour pairs across the app. If a new context arises that needs a fifth tonality (e.g. "imaging"), introduce a new semantic key (`category-imaging`) and add it to `tokens.json`. Don't reuse an existing pair with adjusted meaning.

---

## 11 · Sticky bottom CTA pattern

When a route's primary action lives at the bottom of a scroll (e.g. Welcome's "Продолжить из ЭНЦ"), the CTA is **outside** the scroll container:

```
<div class="flex-1 overflow-y-auto …">
  …scrolling content…
</div>

<!-- BottomCTA -->
<div class="px-5 pb-8 pt-3 border-t border-slate-100 bg-white/85 backdrop-blur">
  <Button full>…</Button>
</div>
```

- Top border is `slate-100` (divider, not full border).
- Background is `white/85 + backdrop-blur` so a hint of scrolling content is visible underneath.
- Bottom padding is `pb-8` (40px) to clear iOS home-indicator bezel.
- The CTA bar is sticky relative to PhoneFrame, *not* the viewport — it works in both fullscreen mobile and centred 390×844 desktop preview.

---

## 12 · Greeting + context pattern (Home)

The Home top section is uniquely composed: greeting on the left, Vasily mascot on the right.

```
┌──────────────────────────────────────┐
│ Здравствуйте, Анна               🩹 │  ← greeting + 64px mascot+halo
│ Сегодня приём в ЭНЦ. Я рядом.        │  ← context line, slate-muted
├──────────────────────────────────────┤
│ (optional) PrepBanner blue-600 hero  │  ← only when unseen request
├──────────────────────────────────────┤
│ Appointment card                     │
│ Prep agenda card                     │
│ VasilyBlock (chat entry)             │
│ Services carousel                    │
└──────────────────────────────────────┘
```

The **context line** is dynamically composed:
- No appointment → "Запланируем приём — и я помогу подготовиться к нему."
- All prep done → "Вы готовы к приёму в ЭНЦ. Можно выдохнуть."
- Same-day → "Сегодня приём в ЭНЦ. Я рядом."
- Day-before → "Завтра приём в ЭНЦ. Финишируем подготовку."
- Otherwise → "До приёма в ЭНЦ — N дней. Помогу подготовиться."

This is the only place in the app where the system speaks in the first person ("Я рядом"). Everywhere else, "мы" (system) or no pronoun.
