# IntelDoc — H1 Шапка главного экрана пациента (Claude Code Input)

## Purpose

This file converts the **H1 epic / patient home header** into a Claude Code-friendly product spec for implementation inside the IntelDoc patient app prototype.

The goal of this file is to describe the **top header area of the patient main screen** as a product artifact, not as final UX copy. It should be used as implementation context for the first prototype iteration.

## Source normalization notes

- This spec is derived from the approved H1 epic for the patient home screen.
- The header is part of the broader **home hub** and must support the core IntelDoc MVP logic: partner-aware context, preparation-for-visit orientation, and quick access to notifications and profile.
- The header must reflect that the user is already inside the clinic-linked IntelDoc experience.
- UI language must be **Russian**.
- The target device for prototype layout is **iPhone 16**.
- The target audience is adult patients, so the UI must use **large tap areas, large typography, and low visual density**.

## Recommended use in Claude Code

- Use this file as a **screen-block specification** for the top header area of the patient home screen.
- Treat this block as part of the first visible screen state after successful onboarding / entry.
- Prioritize readability, clarity, and partner trust over decorative branding.
- Implement the happy path first.
- Add explicit loading, empty, and fallback states.

## Product guardrails

- The header must always make it clear that the patient is inside **IntelDoc in collaboration with a clinic partner**.
- The header must not feel like a public marketing landing page.
- The partner context must be visible but compact.
- Notifications and profile access must be reachable in **one tap**.
- The header must not overload the first screen with too much text.
- The header must work well for adult users with a simple visual hierarchy.
- If partner context is unavailable, the screen must fail gracefully and keep the user in a safe default state.

## Open product decisions

1. **Partner naming format:** exact copy format for the clinic co-branding is still open.
3. **Notification badge logic:** exact unread counting rules are still open.
4. **Profile entry depth:** whether profile icon opens full profile screen (assume basic UI + functioanlity from the context)

## Clean block table

| Block | User action | System result | Happy path | Definition of Done | JTBD |
|---|---|---|---|---|---|
| H1 | открывает главный экран приложения | пользователь видит бренд IntelDoc, контекст партнёра (бренд партнера), вход в уведомления и профиль | Пользователь открывает главный экран, сразу понимает, что находится внутри IntelDoc в связке с конкретной клиникой, при необходимости открывает уведомления или профиль и возвращается назад без потери контекста | В верхней части экрана отображаются бренд IntelDoc и контекст клиники-партнёра; есть иконка уведомлений и иконка профиля; элементы читаемы и достаточно крупные для взрослой аудитории; уведомления и профиль открываются в один тап; есть loading / empty / error states для partner context и notification state | “Когда я открываю приложение после входа через клинику, я хочу сразу убедиться, что нахожусь в правильном медицинском контексте, чтобы доверять приложению и понимать, с кем я взаимодействую.” |

## Screen role in the product

The H1 header is the **orientation and trust layer** of the patient home screen.

It answers 3 immediate questions:
1. **Где я нахожусь?** → IntelDoc + клиника-партнёр
2. **Есть ли у меня что-то новое?** → уведомления
3. **Где мои настройки / профиль?** → профиль

This block should not compete with the main preparation banner below it.  
Its purpose is orientation, trust, and fast utility.

## Scope

### Included

- IntelDoc wordmark / logo area
- compact partner context
- notification icon
- profile icon
- unread badge for notifications
- loading / empty / error states
- large-tap accessibility-friendly sizing

### Excluded

- full clinic description
- detailed doctor or department card
- long explanatory text
- timeline / feed content
- access-management details
- onboarding actions

## User flow

### Happy path

1. Пользователь после дачи юридических согласий попадает на главный экран.
2. В верхней части экрана он видит IntelDoc и логотип клиники-партнера.
3. Пользователь понимает, что находится в правильном контексте.
4. Если есть новое событие, он замечает badge на уведомлениях.
5. Пользователь может:
   - нажать на уведомления и перейти в центр уведомлений
   - нажать на профиль и перейти в профиль / настройки
   - ничего не нажимать и продолжить основной сценарий на home screen
6. После просмотра уведомлений или профиля пользователь возвращается назад на главный экран без потери состояния.

### Failure paths

#### A. Не загрузился контекст клиники
- Вместо клиники показывается безопасный fallback:
  - `IntelDoc`
  - `Контекст клиники недоступен`
- Иконки уведомлений и профиля остаются доступными
- Пользователь может продолжить использование home screen
- При следующей загрузке доступен retry

#### B. Не загрузились уведомления
- Иконка уведомлений отображается без badge
- При открытии центра уведомлений пользователь видит error state с CTA `Повторить`

#### C. Профиль временно недоступен
- По нажатию открывается экран ошибки / пустое состояние с retry
- Главный экран остаётся доступным

#### D. Слишком длинное название клиники
- Название обрезается по правилам truncation
- Полное название при необходимости доступно на следующем экране, но не ломает header layout

## UX requirements

### Layout

- Header must sit at the top of the home screen inside iPhone 16 safe area
- Use a clean horizontal structure:
  - left: brand + partner context
  - right: notifications + profile
- Do not add more than 2 action icons on the right side
- Keep vertical height comfortable for large tap targets

### Content priority

1. IntelDoc brand
2. clinic partner context
3. notifications
4. profile

### Russian UI direction

Example structure:
- `IntelDoc`
- `совместно с ЭНЦ`

Alternative compact variants:
- `IntelDoc × ЭНЦ`
- `IntelDoc · ЭНЦ`

Do not use long promotional text in the header.

### Accessibility

- large touch targets
- strong contrast
- readable Russian labels if labels are used
- no tiny badges or thin hit areas
- visual simplicity for 35–65+ segment

## States

### Default state
- IntelDoc visible
- partner visible
- notifications icon visible
- profile icon visible
- badge shown only if unread count > 0

### Loading state
- skeleton or placeholder for partner context
- icons may already be visible
- no layout jump after load

### Empty state
- no notifications -> icon without badge
- no resolved partner name -> neutral fallback text

### Error state
- partner context unavailable -> safe fallback text
- notification fetch failed -> error handled inside notification center
- profile fetch failed -> error handled inside profile entry

## Functional requirements

### Brand and partner context
- show IntelDoc brand consistently
- show partner context in compact form
- allow truncation for long partner names
- do not require user action to understand the context

### Notifications entry
- one-tap entry
- optional unread badge
- return path back to home screen
- analytics event on tap

### Profile entry
- one-tap entry
- opens patient profile or settings entry point
- return path back to home screen
- analytics event on tap

## Definition of Done

The H1 epic is complete when:

- the patient home screen displays a stable top header
- IntelDoc branding is visible
- clinic partner context is visible or handled with safe fallback
- notifications icon works in 1 tap
- profile icon works in 1 tap
- the block is visually readable for adult users
- layout works on iPhone 16 prototype width
- loading / empty / error states are present
- header does not visually overpower the preparation banner below it

## Suggested analytics events

- home_header_viewed
- home_partner_context_loaded
- home_partner_context_failed
- home_notifications_tapped
- home_profile_tapped
- home_notifications_badge_seen

## Suggested implementation notes for Claude Code

For this block, Claude should produce:

- block goal
- layout structure
- Russian placeholder content
- icon placement
- loading / empty / error states
- tap behavior
- analytics hooks

Implementation guidance:
- Use a minimal, clean mobile layout
- Keep spacing generous
- Avoid dense top navigation patterns
- Prefer one-line partner context over multi-line complexity
- Optimize for clarity first, aesthetics second

## Suggested file role inside project

Place this file under something like:

`/product/screens/patient-home-h1-header.md`
