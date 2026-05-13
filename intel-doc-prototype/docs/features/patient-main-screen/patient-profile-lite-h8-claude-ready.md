# IntelDoc — H8 Профиль lite пациента (Claude Code Input)

## Purpose

This file converts the **H8 epic / patient profile lite** into a Claude Code-friendly product spec for implementation inside the IntelDoc patient app prototype.

The goal of this file is to describe the **lightweight patient profile and settings entry point** of the patient app as a product artifact, not as final UX copy. It should be used as implementation context for the first prototype iteration.

## Source normalization notes

- This spec is derived from the approved H8 epic for the patient home screen and broader patient app shell.
- The profile is expected to be opened from the top-right profile icon in the home header.
- In v1, this is a **profile lite** surface, not a fully expanded medical account center.
- The profile must support the core IntelDoc MVP logic: patient control, simple settings access, visibility of key user data, and safe entry into consent / notification / account-related areas.
- **AI materials visibility settings are explicitly out of scope for the prototype version.**
- UI language must be **Russian**.
- The target device for prototype layout is **iPhone 16**.
- The target audience is adult patients, so the UI must use **large tap areas, large typography, and low visual density**.

## Recommended use in Claude Code

- Use this file as a **screen specification** for the lightweight patient profile.
- Treat this screen as the patient control and settings layer of the app.
- Prioritize clarity, editability of key preferences, and trust.
- Implement the happy path first.
- Add explicit loading, empty, and fallback states.

## Product guardrails

- The screen must answer the question: **“Где мои основные данные и настройки?”**
- The profile must not become a dense settings dump in v1.
- The screen must give the patient a sense of control without overwhelming them with system detail.
- Key preference management must be visible and simple.
- The profile must not duplicate the full preparation flow, history feed, or document catalog.
- If some account data is incomplete, the screen must guide the user calmly rather than look broken.
- The screen must remain readable and comfortable for adult users.
- Settings and controls must use clear, non-technical Russian language.
- Do not include any settings related to AI explanations, AI materials, or Vasiliy visibility in the prototype version.

## Open product decisions

1. **Edit depth:** whether some fields are editable inline or lead to sub-screens is still open; assume simple edit entry points in v1.
2. **Consent visibility depth:** whether full consent details are shown directly here or behind a secondary entry is still open.
3. **Partner context visibility:** whether partner / clinic context is shown inside profile lite is still open; assume a compact visibility section in v1.
4. **Logout placement:** whether explicit logout is included in profile lite is still open; assume yes, but as a low-emphasis action.

## Clean block table

| Block | User action | System result | Happy path | Definition of Done | JTBD |
|---|---|---|---|---|---|
| H8 | открывает профиль из иконки в шапке | пользователь видит свои базовые данные, ключевые настройки и простые точки управления приложением | Пользователь нажимает на иконку профиля, открывает профиль lite, видит основные данные аккаунта, настройки уведомлений и базовые элементы управления, при необходимости меняет нужную настройку и возвращается назад без потери общего контекста | Профиль lite открывается в 1 тап; экран показывает базовые данные пользователя, простые настройки и ключевые account-related entry points; экран не перегружен; поддерживаются loading / empty / error states; пользователь может изменить базовые настройки без сложности; интерфейс остаётся понятным взрослой аудитории | “Когда я пользуюсь приложением для здоровья, я хочу быстро найти свои основные данные и настройки, чтобы понимать, что используется, и при необходимости управлять своим опытом.” |

## Screen role in the product

The H8 profile lite screen is the **patient control, account visibility, and basic settings layer** of the app.

It answers 3 immediate questions:
1. **Какие мои базовые данные используются в приложении?**
2. **Где я могу управлять своими настройками?**
3. **Где находятся основные account-related действия?**

This screen should not feel like a complex account center or admin panel.  
Its purpose is confidence, control, and quick settings access.

## Scope

### Included

- profile lite screen
- patient basic identity section
- notification settings
- compact account / clinic context visibility
- entry points into consent / legal / account-related details
- optional logout action
- loading / empty / error states
- accessibility-friendly spacing and sizing

### Included sections in v1

- имя / базовый профиль
- контактные или account-level данные, если они есть
- настройки уведомлений
- компактный блок “Связь с клиникой” or similar context
- entry to consents / legal details
- low-emphasis logout or account action

### Excluded

- AI materials visibility settings
- Vasiliy explanation visibility settings
- full medical profile editing
- document management center
- full event history
- complex security center
- deep admin settings
- payment center
- detailed device integration management
- large multi-step legal workflow inside the same screen

## User flow

### Happy path

1. Пользователь находится на главном экране.
2. Нажимает на иконку профиля в правом верхнем углу.
3. Открывается экран профиля lite.
4. Пользователь видит:
   - основные данные аккаунта
   - настройки уведомлений
   - базовые account-related entry points
5. Пользователь при необходимости меняет настройку, например:
   - включает или выключает уведомления
6. Изменение сохраняется сразу или через простой action.
7. Пользователь возвращается назад на главный экран без потери общего контекста.

### Failure paths

#### A. Профиль загружается слишком долго
- Показывается спокойный loading state
- Layout сохраняет структуру будущего экрана
- Пользователь не видит хаотический скачок элементов

#### B. Некоторые данные профиля отсутствуют
- Экран показывает safe incomplete state:
  - `Некоторые данные ещё не заполнены`
  - optional CTA `Дополнить`
- Экран не выглядит сломанным

#### C. Не удалось загрузить профиль
- Показывается error state:
  - `Не удалось загрузить профиль`
  - CTA `Повторить`
- Пользователь может вернуться назад на главный экран

#### D. Не удалось сохранить настройку
- Пользователь получает понятное сообщение об ошибке
- Настройка либо откатывается, либо помечается как не сохранённая
- Доступен retry

#### E. Пользователь не понимает назначение раздела
- Section labels должны быть короткими и буквальными
- Не использовать внутренний продуктовый jargon

## UX requirements

### Layout

- The profile lite screen should open as a full screen or a clearly readable dedicated surface
- Use a calm vertical section structure
- Prefer large section cards or grouped blocks
- Keep controls visually separated and easy to scan
- Avoid long dense settings lists
- Maintain comfortable spacing and strong hierarchy

### Content priority

1. basic account identity
2. settings the user is likely to change
3. clinic / app relationship visibility
4. secondary legal / account actions

### Russian UI direction

Example section titles:
- `Профиль`
- `Основные данные`
- `Уведомления`
- `Связь с клиникой`
- `Согласия и документы`

Example setting labels:
- `Получать напоминания`
- `Открыть согласия`

Example helper text:
- `Вы можете изменить эти параметры в любой момент`
- `Некоторые данные используются для подготовки к приёму`
- `Настройки применяются сразу`

Do not use dense technical copy.

### Accessibility

- large section rows
- readable Russian text
- clear toggle / control areas
- generous spacing between settings
- strong contrast
- easy scannability for 35–65+ segment
- no tiny secondary controls

## States

### Default state
- visible profile identity
- visible settings sections
- clear section hierarchy
- easy back navigation

### Loading state
- skeleton profile sections
- stable layout rhythm
- avoid layout jumps

### Empty / incomplete state
- some fields missing
- calm explanation
- optional CTA to complete data

### Error state
- retry CTA
- return path back to previous screen remains available

### Unsaved-change risk state
- if save is not instant, the UI must clearly show pending / failed save
- do not silently lose changes

## Functional requirements

### Profile visibility
- show basic patient account information in a readable form
- do not overload the screen with deep medical data
- keep the surface account-oriented, not record-oriented

### Settings behavior
- notification preferences must be easy to update
- settings labels must be understandable without training
- save behavior must be predictable
- exclude all AI-visibility related settings from the prototype version

### Navigation behavior
- profile opens in 1 tap from the header icon
- user can return back simply
- secondary entry points inside profile lead to clear destinations

### Trust and control
- patient should feel the app is transparent and controllable
- profile must reinforce ownership and clarity, not bureaucracy

## Definition of Done

The H8 epic is complete when:

- the patient can open profile lite in 1 tap from the header
- the screen shows readable basic account information
- notification settings are visible and changeable
- the screen remains lightweight and not overloaded
- AI-visibility related settings are absent from the prototype
- loading / incomplete / error / save-failure states are present
- the layout works on iPhone 16 prototype width
- the screen is readable and comfortable for adult users
- the user feels in control of their basic profile and settings

## Suggested analytics events

- profile_lite_viewed
- profile_lite_loaded
- profile_lite_failed
- profile_notifications_toggled
- profile_incomplete_viewed
- profile_secondary_entry_tapped
- profile_logout_tapped

## Suggested implementation notes for Claude Code

For this screen, Claude should produce:

- screen goal
- profile lite structure
- Russian placeholder content
- section list
- toggle and save behavior
- loading / incomplete / error / save-failure states
- analytics hooks

Implementation guidance:
- Use a calm mobile settings/profile pattern
- Prefer grouped readable sections over long dense menus
- Keep settings count limited in v1
- Use short Russian labels
- Optimize for “I quickly found my settings and understood them”
- Do not add AI explanation visibility controls in the prototype version

## Suggested file role inside project

Place this file under something like:

`/product/screens/patient-profile-lite-h8.md`
