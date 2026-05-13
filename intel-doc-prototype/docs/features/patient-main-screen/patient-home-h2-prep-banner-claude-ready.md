# IntelDoc — H2 Баннер статуса подготовки к приёму (Claude Code Input)

## Purpose

This file converts the **H2 epic / preparation status banner** into a Claude Code-friendly product spec for implementation inside the IntelDoc patient app prototype.

The goal of this file is to describe the **main preparation status banner** on the patient home screen as a product artifact, not as final UX copy. It should be used as implementation context for the first prototype iteration.

## Source normalization notes

- This spec is derived from the approved H2 epic for the patient home screen.
- The banner is part of the broader **home hub** and must support the core IntelDoc MVP logic: preparation before visit, guided next step, and low-friction movement into the checklist / prep flow.
- The banner is the **primary action block** of the home screen and should carry more visual weight than adjacent modules.
- The banner must reflect the current preparation state for the upcoming doctor appointment or the current prep cycle.
- UI language must be **Russian**.
- The target device for prototype layout is **iPhone 16**.
- The target audience is adult patients, so the UI must use **large tap areas, large typography, and low visual density**.

## Recommended use in Claude Code

- Use this file as a **screen-block specification** for the main preparation banner on the patient home screen.
- Treat this block as the primary CTA area below the header.
- Prioritize clarity of current status and the next useful action.
- Implement the happy path first.
- Add explicit loading, empty, and fallback states.

## Product guardrails

- The banner must answer the question: **“Что мне делать дальше перед приёмом?”**
- The banner must not be generic marketing content.
- The banner must not try to display too many detailed checklist items at once.
- The banner must always provide a clear next action or a clear status explanation.
- The banner must support the broader MVP logic: patient preparation, data readiness, and transition into the prep/checklist flow.
- If there is no active visit or no active prep cycle, the user must still see a meaningful neutral state.
- The block must work well for adult users with simple wording and strong visual hierarchy.

## Open product decisions

1. **Primary CTA naming:** exact button label may vary between `Продолжить`, `Открыть подготовку`, `Перейти к чеклисту`.
2. **Status granularity:** whether to show only 4 broad states or a more detailed percentage/progress count is still open.
3. **Visit date visibility:** the banner should always display the next visit date.
4. **Single CTA vs CTA + secondary link:** assume one main CTA in v1.

## Clean block table

| Block | User action | System result | Happy path | Definition of Done | JTBD |
|---|---|---|---|---|---|
| H2 | открывает главный экран приложения и видит баннер подготовки | пользователь понимает текущий статус подготовки к приёму и может перейти к следующему нужному действию | Пользователь открывает главный экран, видит понятный статус подготовки к приёму, читает короткое описание следующего шага, нажимает на основной CTA и переходит в экран подготовки / чеклист, после чего статус на главном экране обновляется | Баннер отображает один понятный статус подготовки; есть краткое объяснение next step; есть один основной CTA; поддерживаются meaningful states: не начато / в процессе / почти готово / готово / нет активного плана; есть loading / empty / error states; баннер визуально доминирует над secondary modules, но не перегружен | “Когда у меня скоро приём, я хочу сразу понять, готов ли я и что мне делать дальше, чтобы не забыть важные шаги перед визитом.” |

## Screen role in the product

The H2 banner is the **primary action and progress layer** of the patient home screen.

It answers 3 immediate questions:
1. **Готов ли я к приёму?**
2. **Что мне нужно сделать дальше?**
3. **Куда нажать, чтобы продолжить подготовку?**

This block is the core entry point into the patient prep journey.  
Its purpose is progress visibility, action prioritization, and friction reduction.

## Scope

### Included

- preparation status banner
- short status title
- short supporting explanation
- one primary CTA
- progress indicator
- next visit date / prep deadline
- loading / empty / error states
- large-card accessibility-friendly sizing

### Excluded

- full checklist breakdown
- detailed event feed
- document history
- assistant chat UI
- marketplace / adjacent services content
- legal / profile settings
- multi-step task manager inside the banner itself

## User flow

### Happy path

1. Пользователь после онбординга / после возвращения в приложение попадает на главный экран.
2. Под шапкой он видит крупный баннер подготовки к приёму.
3. Баннер показывает текущий статус, например:
   - `Подготовка не начата`
   - `Подготовка в процессе`
   - `Почти готово`
   - `Вы готовы к приёму`
4. Пользователь читает короткое объяснение следующего шага.
5. Пользователь нажимает на основной CTA.
6. Приложение переводит его в экран подготовки / чеклист / связанный prep flow.
7. После выполнения действия пользователь возвращается на главный экран.
8. Баннер отражает обновлённый статус.

### Failure paths

#### A. Нет активного приёма или активного плана подготовки
- Баннер показывает нейтральное состояние:
  - `Подготовка пока не требуется`
  - `Когда появится новый план, он будет здесь`
- CTA может вести в общий раздел подготовки или быть заменён на менее активное действие

#### B. Не удалось загрузить статус подготовки
- Показывается error state:
  - `Не удалось загрузить статус подготовки`
  - CTA `Повторить`
- Layout не ломается
- Пользователь может продолжить использовать другие части home screen

#### C. Подготовка не начата, но нет достаточных данных для старта
- Баннер показывает стартовый сценарий:
  - `Начните подготовку`
  - пояснение, что нужно открыть чеклист и пройти первые шаги
- Пользователь попадает в prep entry state

#### D. Статус есть, но связанный prep screen временно недоступен
- По нажатию на CTA пользователь видит error state с retry
- Главный экран остаётся доступным

#### E. Слишком длинный explanatory text
- Supporting text обрезается до короткой, понятной формулировки
- Вся глубина раскрывается уже в следующем экране, а не в баннере

## UX requirements

### Layout

- Banner must sit directly below the home header
- It should be the visually dominant content block in the upper viewport
- Use a large card with comfortable padding
- Prefer a simple vertical information hierarchy:
  - title / current status
  - short explanation
  - primary CTA
- Optional progress row may be added only if it stays visually simple

### Content priority

1. current preparation status
2. next step explanation
3. primary CTA
4. optional visit date / progress cue

### Russian UI direction

Example status variants:
- `Подготовка к приёму`
- `Подготовка не начата`
- `Подготовка в процессе`
- `Остался последний шаг`
- `Вы готовы к приёму`

Example supporting text variants:
- `Загрузите анализы и проверьте, всё ли готово к визиту`
- `Откройте чеклист и завершите следующие шаги`
- `Проверьте, что все нужные данные уже загружены`
- `Все основные шаги выполнены`

Example CTA variants:
- `Продолжить`
- `Открыть подготовку`
- `Перейти к чеклисту`

Do not overload the banner with medical detail or long body copy.

### Accessibility

- large touch target for the full banner and CTA
- strong title hierarchy
- readable Russian text
- clear contrast between status and helper text
- no dense checklists inside the card
- easy scannability for 35–65+ segment

## States

### Default state
- clear preparation title
- visible current status
- short supporting text
- one primary CTA

### Loading state
- skeleton banner
- reserved height to avoid layout jump
- CTA may be hidden or replaced with placeholder

### Empty / neutral state
- no active preparation plan
- neutral message
- optional soft CTA to open prep area

### Error state
- failed to load preparation status
- retry CTA
- user can still navigate elsewhere

### Completed state
- banner clearly says user is ready / key steps completed
- CTA may still lead to review the checklist

## Functional requirements

### Status logic
- show one primary status only
- status should reflect prep progress, not generic system health
- status text must be understandable without medical expertise

### CTA behavior
- one main CTA only in v1
- CTA leads to the preparation destination
- return path back to home screen
- analytics event on tap

### Progress reflection
- after completing prep steps, banner state must update
- state refresh should happen on return to home or after data refresh
- avoid stale status if possible in prototype logic

## Definition of Done

The H2 epic is complete when:

- the patient home screen displays a stable preparation banner below the header
- the banner communicates one clear preparation state
- the user understands the next useful action
- the primary CTA works in 1 tap
- the CTA leads into the correct preparation flow
- the banner updates after preparation progress changes
- the block is visually readable for adult users
- layout works on iPhone 16 prototype width
- loading / empty / error states are present
- the banner is the most important actionable card on the home screen

## Suggested analytics events

- home_prep_banner_viewed
- home_prep_status_loaded
- home_prep_status_failed
- home_prep_cta_tapped
- home_prep_neutral_state_viewed
- home_prep_completed_state_viewed

## Suggested implementation notes for Claude Code

For this block, Claude should produce:

- block goal
- layout structure
- Russian placeholder content
- status variants
- CTA behavior
- loading / empty / error states
- progress refresh behavior
- analytics hooks

Implementation guidance:
- Use a large, calm, high-clarity card pattern
- Keep copy short and directional
- Prefer one main CTA
- Avoid turning the banner into a mini-dashboard
- Optimize for “understand in 2 seconds”

## Suggested file role inside project

Place this file under something like:

`/product/screens/patient-home-h2-prep-banner.md`
