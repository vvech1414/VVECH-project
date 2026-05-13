# IntelDoc — H3 Блок «Василий» на главном экране пациента (Claude Code Input)

## Purpose

This file converts the **H3 epic / Vasiliy assistant block** into a Claude Code-friendly product spec for implementation inside the IntelDoc patient app prototype.

The goal of this file is to describe the **Vasiliy entry block** on the patient home screen as a product artifact, not as final UX copy. It should be used as implementation context for the first prototype iteration.

## Source normalization notes

- This spec is derived from the approved H3 epic for the patient home screen.
- The block is part of the broader **home hub** and must support the core IntelDoc MVP logic: patient orientation, low-friction access to help, and safe entry into the assistant/chat flow.
- The block represents **Vasiliy as a digital patient assistant**, not as an autonomous medical authority.
- The block must work as the main entry point into either dialogue mode or chat mode.
- UI language must be **Russian**.
- The target device for prototype layout is **iPhone 16**.
- The target audience is adult patients, so the UI must use **large tap areas, large typography, and low visual density**.

## Recommended use in Claude Code

- Use this file as a **screen-block specification** for the Vasiliy block on the patient home screen.
- Treat this block as a supportive but visible module below the preparation banner.
- Prioritize clarity of role, trust, and easy entry into the assistant flow.
- Implement the happy path first.
- Add explicit loading, empty, and fallback states.

## Product guardrails

- The block must answer the question: **“Какую помощь я могу получить прямо сейчас?”**
- Vasiliy must be presented as a **digital assistant**, not as a replacement for a doctor.
- The block must not imply diagnosis, treatment, or medical назначения.
- The block must not contain overly long explanations or a dense feature list.
- The block must provide one clear primary entry into the assistant/chat experience.
- The block must remain visually secondary to the main preparation banner.
- If the assistant is temporarily unavailable, the screen must fail gracefully and not block the rest of the home experience.

## Open product decisions

1. **Primary CTA naming:** exact button label may vary between `Открыть чат`, `Написать Василию`, `Спросить Василия`.
2. **Secondary CTA:** whether to include `Что я умею` in v1 is still open.
3. **Mode naming:** whether the next screen is framed as chat mode, dialogue mode, or a unified assistant screen is still open.
4. **Avatar style:** exact visual representation of Vasiliy is open, but should remain calm, friendly, and non-childish.

## Clean block table

| Block | User action | System result | Happy path | Definition of Done | JTBD |
|---|---|---|---|---|---|
| H3 | открывает главный экран приложения и видит блок Василия | пользователь понимает, кто такой Василий, какую помощь он может дать, и может перейти в чат / диалог | Пользователь открывает главный экран, видит блок Василия с коротким представлением и понятным обещанием помощи, нажимает на основной CTA и переходит в экран общения с ассистентом, после чего может вернуться назад без потери состояния | На главном экране отображается блок Василия с аватаром / визуальным образом, коротким intro-текстом, кратким объяснением возможностей и одним основным CTA; блок визуально понятен взрослой аудитории; поддерживаются loading / empty / error states; блок не создаёт впечатление, что ИИ ставит диагнозы или назначает лечение | “Когда я не понимаю, что делать дальше или где найти нужное, я хочу быстро обратиться к цифровому помощнику, чтобы получить понятное объяснение и следующий шаг без звонка в клинику.” |

## Screen role in the product

The H3 Vasiliy block is the **assistant entry and guidance layer** of the patient home screen.

It answers 3 immediate questions:
1. **Кто может мне помочь внутри приложения?**
2. **С чем может помочь Василий?**
3. **Куда нажать, чтобы начать диалог?**

This block should not compete with the preparation banner above it.  
Its purpose is guidance, reassurance, and quick entry into the assistant flow.

## Scope

### Included

- Vasiliy avatar / visual identity area
- short intro text
- short explanation of what Vasiliy can help with
- one primary CTA
- optional secondary CTA
- loading / empty / error states
- accessibility-friendly sizing

### Excluded

- full chat interface
- long onboarding about AI
- medical diagnosis language
- treatment recommendations
- deep educational module content
- preparation banner logic
- timeline / notification content

## User flow

### Happy path

1. Пользователь попадает на главный экран.
2. Ниже баннера подготовки он видит блок Василия.
3. Блок показывает:
   - кто такой Василий
   - чем он может помочь
   - куда нажать, чтобы начать общение (текстовый и голосовй entry point в чат).
4. Пользователь, если жмет на CTA "что умеет Василий", переходит в отдельный экран чата
5. Пользователь читает краткий intro.
6. Пользователь начинает общение и получает стартовые подсказки.
8. При необходимости пользователь возвращается на главный экран без потери контекста чата с Василием.

### Failure paths

#### A. Ассистент временно недоступен
- Блок показывает safe fallback:
  - `Василий сейчас недоступен`
  - `Попробуйте позже`
- Основной CTA либо скрывается, либо заменяется на неактивное состояние
- Остальная часть home screen остаётся доступной

#### B. Не удалось загрузить intro state
- Показывается fallback block:
  - аватар / placeholder
  - короткий safe text
  - CTA `Повторить` или стандартный вход в чат, если это допустимо

#### C. Пользователь ожидает медицинского назначения
- Копирайтинг блока и следующего экрана удерживает рамку:
  - помощь с навигацией
  - пояснения
  - подготовка к визиту
  - ответы в справочном формате
- Не допускается язык диагностики или назначения

#### D. Слишком длинный explanatory text
- Текст обрезается до короткой и понятной формулировки
- Детальное объяснение уходит на следующий экран или в secondary CTA

#### E. Аватар / визуальный стиль воспринимается слишком “детским”
- В прототипе следует использовать спокойный, нейтральный визуальный стиль
- Не использовать overly playful representation

## UX requirements

### Layout

- The block must sit below the preparation banner
- It should be a large, calm card or module
- Prefer a simple composition:
  - avatar / visual signifier
  - title or assistant name
  - short intro text
  - one primary CTA
- Optional secondary CTA may be added only if it does not create clutter

### Content priority

1. Vasiliy identity
2. what he can help with
3. primary CTA
4. optional secondary explanation

### Russian UI direction

Example title variants:
- `Василий`
- `Ваш цифровой помощник`
- `Василий — цифровой помощник IntelDoc`

Example supporting text variants:
- `Помогу понять, что делать дальше перед приёмом`
- `Подскажу, где найти нужный раздел и как продолжить подготовку`
- `Могу помочь с навигацией, следующими шагами и пояснениями`

Example CTA variants:
- `Открыть чат`
- `Спросить Василия`
- `Написать Василию`

Optional secondary CTA:
- `Что я умею`

Do not overload the block with AI marketing language.

### Accessibility

- large touch target for CTA
- readable Russian text
- strong contrast
- calm and simple information hierarchy
- no tiny chips or dense capability list
- easy scannability for 35–65+ segment

## States

### Default state
- Vasiliy visible
- intro text visible
- helper text visible
- one primary CTA

### Loading state
- skeleton / placeholder avatar
- reserved card height to avoid layout jump
- CTA may be hidden or replaced with placeholder

### Empty state
- if no personalized intro is available, show generic safe intro text

### Error state
- assistant metadata failed to load
- show fallback text and optional retry
- home screen remains usable

### Unavailable state
- assistant temporarily unavailable
- clear message without technical jargon
- avoid blocking the rest of the app

## Functional requirements

### Assistant presentation
- show Vasiliy consistently as a digital assistant
- explain role briefly and clearly
- do not imply clinical authority

### CTA behavior
- one main CTA only in v1
- CTA leads to assistant/chat destination
- return path back to home screen
- analytics event on tap

### Trust framing
- messaging should reinforce help, guidance, and explanation
- messaging should avoid diagnosis / treatment / medical prescriptions
- tone should be calm and founder-approved, not “magical AI”

## Definition of Done

The H3 epic is complete when:

- the patient home screen displays a stable Vasiliy block below the preparation banner
- the user understands who Vasiliy is
- the user understands how Vasiliy can help
- the primary CTA works in 1 tap
- the CTA leads into the correct assistant flow
- the block is visually readable for adult users
- layout works on iPhone 16 prototype width
- loading / empty / error / unavailable states are present
- the block does not visually overpower the preparation banner
- the copy does not imply diagnosis or treatment recommendations

## Suggested analytics events

- home_vasiliy_block_viewed
- home_vasiliy_loaded
- home_vasiliy_failed
- home_vasiliy_unavailable
- home_vasiliy_cta_tapped
- home_vasiliy_secondary_cta_tapped

## Suggested implementation notes for Claude Code

For this block, Claude should produce:

- block goal
- layout structure
- Russian placeholder content
- avatar / visual placement
- CTA behavior
- loading / empty / error / unavailable states
- safe assistant framing
- analytics hooks

Implementation guidance:
- Use a calm, friendly, minimal card pattern
- Keep copy short and directional
- Prefer one main CTA
- Avoid capability overload
- Optimize for “understand in 2 seconds”
- Keep Vasiliy supportive, not authoritative

## Suggested file role inside project

Place this file under something like:

`/product/screens/patient-home-h3-vasiliy-block.md`
