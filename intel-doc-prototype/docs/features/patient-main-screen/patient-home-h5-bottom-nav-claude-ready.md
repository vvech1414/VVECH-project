# IntelDoc — H5 Нижняя навигация главного экрана пациента (Claude Code Input)

## Purpose

This file converts the **H5 epic / bottom navigation** into a Claude Code-friendly product spec for implementation inside the IntelDoc patient app prototype.

The goal of this file is to describe the **persistent bottom navigation bar** of the patient app as a product artifact, not as final UX copy. It should be used as implementation context for the first prototype iteration.

## Source normalization notes

- This spec is derived from the approved H5 epic for the patient home screen.
- The bottom navigation is part of the broader **patient app shell**, not just one isolated screen block.
- The navigation must support the core IntelDoc MVP logic: clear movement between the main patient zones without cognitive overload.
- For the first iteration, the bottom navigation contains exactly **4 primary tabs**:
  1. `Главная`
  2. `Василий`
  3. `Подготовка`
  4. `История`
- UI language must be **Russian**.
- The target device for prototype layout is **iPhone 16**.
- The target audience is adult patients, so the UI must use **large tap areas, large typography, and low visual density**.

## Recommended use in Claude Code

- Use this file as a **navigation-shell specification** for the mobile patient prototype.
- Treat this block as persistent navigation across the main patient sections.
- Prioritize clarity, predictability, and low navigation friction.
- Implement the happy path first.
- Add explicit selected, unselected, and fallback states.

## Product guardrails

- The navigation must answer the question: **“Как мне быстро перейти в нужный раздел?”**
- The navigation must remain simple and stable across the core patient experience.
- Do not add more than 4 main tabs in v1.
- Each tab must have a clear Russian label; icon-only navigation is not enough.
- Navigation must work well for adult users and avoid tiny icons or ambiguous metaphors.
- The selected state must always be visually obvious.
- Navigation must not disappear on the main patient screens unless a very specific full-screen flow requires it.
- Returning between tabs should preserve a reasonable amount of user context.

## Open product decisions

1. **Preparation tab naming:** exact label may vary between `Подготовка`, `Чеклист`, or `Приём`.
2. **History scope:** whether `История` means only activity history or also document / event history is still open, but assume a broad patient history log in v1.
3. **Vasiliy tab entry:** whether it opens directly into chat or into an assistant landing screen is still open.
4. **Tab state preservation depth:** assume basic state preservation in v1, not full complex restoration.

## Clean block table

| Block | User action | System result | Happy path | Definition of Done | JTBD |
|---|---|---|---|---|---|
| H5 | использует нижнюю навигацию приложения | пользователь быстро переходит между главными разделами приложения и понимает, где находится | Пользователь открывает приложение, видит 4 понятных вкладки внизу, понимает активный раздел, нажимает на нужный таб и сразу переходит в соответствующий раздел, после чего может вернуться в другой таб без потери общей ориентации | Нижняя навигация содержит 4 стабильных таба с русскими подписями; активный раздел визуально ясен; переход между разделами работает в 1 тап; навигация читаема и удобна для взрослой аудитории; поддерживаются selected / unselected / fallback states; навигация не перегружена и остаётся предсказуемой | “Когда я пользуюсь приложением, я хочу быстро переходить между основными разделами, чтобы не теряться и не искать нужную функцию по экрану.” |

## Screen role in the product

The H5 bottom navigation is the **primary orientation and movement layer** of the patient app.

It answers 3 immediate questions:
1. **Где я сейчас нахожусь?**
2. **Куда я могу перейти в один тап?**
3. **Как вернуться к главному разделу без поиска?**

This block should remain stable across the core patient journey.  
Its purpose is navigation clarity, predictability, and fast access to key zones.

## Scope

### Included

- persistent sticky-bottom tab bar
- 4 primary tabs with icons and Russian labels
- selected and unselected states
- tap behavior for each tab
- safe-area-aware layout for iPhone 16
- accessibility-friendly sizing
- basic state preservation between tabs

### Excluded

- deep nested navigation
- more than 4 primary tabs
- hidden overflow navigation
- gesture-only navigation logic
- secondary actions inside the tab bar
- notification center inside bottom nav
- profile access inside bottom nav

## Navigation structure

### Tabs in v1

1. **Главная**
   - main patient home hub
   - header, prep banner, Vasiliy block, adjacent modules

2. **Василий**
   - assistant chat / assistant entry screen
   - text and possibly voice entry point

3. **Подготовка**
   - preparation flow
   - checklist / next steps / prep-related actions

4. **История**
   - patient activity history
   - logs, events, actions, possibly document-related history

## User flow

### Happy path

1. Пользователь попадает в приложение и видит нижнюю навигацию на основном экране.
2. Нижняя панель содержит 4 вкладки с подписями:
   - `Главная`
   - `Василий`
   - `Подготовка`
   - `История`
3. Пользователь видит, какой таб сейчас активен.
4. Пользователь нажимает на нужный раздел.
5. Приложение открывает соответствующий экран в 1 тап.
6. Пользователь может переключаться между разделами без потери общей ориентации.
7. При возврате в ранее открытый таб приложение сохраняет базовое состояние, если это возможно.

### Failure paths

#### A. Пользователь не понимает иконку
- Каждый таб обязательно сопровождается текстовой подписью
- Не допускается icon-only pattern

#### B. Не удалось открыть таб
- Пользователь остаётся в текущем разделе
- Появляется error state / toast / inline fallback
- Нижняя навигация остаётся доступной

#### C. Слишком длинная подпись таба
- Использовать короткие, понятные русские названия
- Не допускать multiline labels внизу

#### D. Потеря состояния при переключении между табами
- В v1 допускается базовое сохранение состояния
- При невозможности полного сохранения пользователь должен хотя бы возвращаться на root screen соответствующего таба

#### E. Слишком мелкие tap targets
- Таб-бар должен иметь крупные зоны нажатия и визуально комфортную высоту

## UX requirements

### Layout

- Bottom navigation must be fixed to the bottom of the screen
- It must respect iPhone 16 safe area
- Use 4 evenly distributed tabs
- Each tab must contain:
  - icon
  - Russian text label
- Selected state must be visually obvious
- The navigation bar should be calm, simple, and not too dense

### Content priority

1. active state clarity
2. readable labels
3. large tap targets
4. icon support

### Russian UI direction

Recommended tab labels for v1:
- `Главная`
- `Василий`
- `Подготовка`
- `История`

Possible future label discussion:
- `Чеклист` instead of `Подготовка`
- `Лента` instead of `История`
- Keep v1 labels simple and literal

Do not use abstract or brand-heavy labels that reduce clarity.

### Accessibility

- large touch areas for each tab
- readable Russian labels
- strong selected / unselected contrast
- avoid thin-line tiny icons
- easy scannability for 35–65+ segment
- no overloaded visual treatment

## States

### Default state
- one selected tab
- three unselected tabs
- stable bottom placement
- readable labels

### Selected state
- active tab clearly highlighted
- icon and/or label treatment shows current location

### Unselected state
- visible but visually secondary

### Error / fallback state
- if content behind a tab fails, the tab bar itself remains stable and usable
- user can switch to another section

### Re-entry state
- returning to a previously opened tab should restore at least a reasonable root or last-known screen state

## Functional requirements

### Navigation behavior
- each tab opens in 1 tap
- selected tab indicates current section
- repeated tap on current tab may optionally return to the root of that section
- navigation must remain persistent on core patient screens

### State preservation
- preserve simple per-tab state where possible
- do not create confusing resets on every switch
- if reset is unavoidable in prototype logic, return user to clear root state

### Consistency
- tab order must remain stable
- labels must remain stable
- no conditional disappearance of tabs in normal patient use

## Definition of Done

The H5 epic is complete when:

- the patient app displays a stable bottom navigation bar
- the bar contains exactly 4 main tabs in Russian
- the active tab is visually obvious
- switching between tabs works in 1 tap
- the navigation is readable for adult users
- layout works on iPhone 16 prototype width and safe area
- basic selected / unselected / fallback states are present
- the navigation does not feel overloaded
- the user does not need to guess how to move between core sections

## Suggested analytics events

- bottom_nav_viewed
- bottom_nav_home_tapped
- bottom_nav_vasiliy_tapped
- bottom_nav_prep_tapped
- bottom_nav_history_tapped
- bottom_nav_reselected_current_tab

## Suggested implementation notes for Claude Code

For this block, Claude should produce:

- navigation shell goal
- tab structure
- Russian labels
- icon placement
- selected / unselected states
- tap behavior
- basic state preservation behavior
- analytics hooks

Implementation guidance:
- Use a clean native-like mobile tab bar pattern
- Prefer clarity over novelty
- Keep labels short and literal
- Use large spacing and hit areas
- Optimize for “I know where to tap immediately”

## Suggested file role inside project

Place this file under something like:

`/product/navigation/patient-bottom-nav-h5.md`
