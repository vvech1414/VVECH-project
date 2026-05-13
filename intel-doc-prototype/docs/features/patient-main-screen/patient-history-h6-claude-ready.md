# IntelDoc — H6 История активности пациента (Claude Code Input)

## Purpose

This file converts the **H6 epic / patient activity history** into a Claude Code-friendly product spec for implementation inside the IntelDoc patient app prototype.

The goal of this file is to describe the **History section / activity log** of the patient app as a product artifact, not as final UX copy. It should be used as implementation context for the first prototype iteration.

## Source normalization notes

- This spec is derived from the approved H6 epic for the patient home screen and bottom navigation structure.
- The History screen is part of the broader **patient app shell** and is expected to be opened from the `История` tab in the bottom navigation.
- The screen must support the core IntelDoc MVP logic: transparency of actions, visibility of what happened to patient data, and a clear patient-facing event trail.
- In v1, `История` should be treated as a **broad activity history**, not only as document history.
- UI language must be **Russian**.
- The target device for prototype layout is **iPhone 16**.
- The target audience is adult patients, so the UI must use **large tap areas, large typography, and low visual density**.

## Recommended use in Claude Code

- Use this file as a **screen specification** for the patient history section.
- Treat this screen as the trust and transparency layer of the patient app.
- Prioritize readability, chronology, and meaningful event grouping.
- Implement the happy path first.
- Add explicit loading, empty, and fallback states.

## Product guardrails

- The screen must answer the question: **“Что происходило с моими данными и действиями в приложении?”**
- The screen must not feel like a raw technical audit log.
- Events must be understandable to an adult non-technical patient.
- The screen must emphasize transparency, not complexity.
- The history must include meaningful patient-facing events, not every low-level system action.
- Access-related events should be especially visible because trust and control are central to IntelDoc.
- If the user taps on an event, the destination should be clear and safe.
- If a linked object is no longer available, the event itself must remain visible in history.

## Open product decisions

1. **History depth:** whether v1 includes only key milestones or a fuller event stream is still open; assume a focused but broad activity log.
2. **Grouping:** whether events are grouped by day, week, or shown as a pure reverse-chronological feed is still open; assume date-grouped chronology in v1.
3. **Filtering:** filters are visible in v1.
4. **Document/event overlap:** if a document appears in both history and separate document flows, history should still prioritize “what happened” rather than “document catalog”.

## Clean block table

| Block | User action | System result | Happy path | Definition of Done | JTBD |
|---|---|---|---|---|---|
| H6 | открывает раздел `История` в приложении | пользователь видит понятную хронологию ключевых событий и может перейти в связанный объект или экран | Пользователь открывает вкладку `История`, видит список ключевых событий в обратной хронологии, понимает, что происходило с его действиями, документами, доступом и запросами, нажимает на нужное событие и переходит в связанный экран, после чего может вернуться назад без потери контекста | Раздел `История` показывает понятную ленту ключевых пациентских событий; события имеют тип, время и короткое описание; события доступа и запросов врача видимы явно; поддерживаются loading / empty / error states; при нажатии событие либо открывает связанный экран, либо безопасно объясняет, что объект недоступен; экран остаётся понятным взрослой аудитории | “Когда я делюсь медицинскими данными и пользуюсь приложением, я хочу видеть историю действий и изменений, чтобы чувствовать контроль, прозрачность и понимать, что происходило.” |

## Screen role in the product

The H6 History screen is the **trust, transparency, and traceability layer** of the patient app.

It answers 3 immediate questions:
1. **Что происходило в приложении?**
2. **Что происходило с моими документами и доступом?**
3. **Куда перейти, если я хочу открыть связанный объект?**

This screen should not feel like a developer log or a compliance console.  
Its purpose is patient-facing visibility, confidence, and easy lookup of past actions.

## Scope

### Included

- patient-facing activity history screen
- reverse-chronological event feed
- event title / type / time
- short human-readable description
- date grouping or clear chronology
- deeplink into related screens when relevant
- loading / empty / error states
- accessibility-friendly spacing and sizing

### Included event types in v1

- загрузка документа / анализа
- результат OCR готов
- OCR не распознан / нужна проверка
- выдача доступа клинике
- просмотр данных врачом / клиникой
- запрос данных от врача
- новый план / обновлённый план
- напоминание / дедлайн / статус выполнения шага
- ключевые действия пользователя внутри prep flow

### Excluded

- full raw audit log
- low-level technical events
- advanced admin/security controls
- complex filtering UI in v1
- hidden metadata fields
- internal-only medical workflow details
- nested multi-action timeline controls

## User flow

### Happy path

1. Пользователь открывает вкладку `История` через нижнюю навигацию.
2. На экране он видит хронологическую ленту событий.
3. Каждое событие содержит:
   - понятный тип
   - короткое описание
   - дату / время
4. Пользователь просматривает список и понимает, что происходило:
   - какие документы были загружены
   - что было распознано
   - когда был выдан доступ
   - когда врач запросил данные
   - когда появился новый план или напоминание
5. Пользователь нажимает на конкретное событие.
6. Приложение открывает связанный экран, например:
   - карточку документа
   - запрос от врача
   - экран плана
   - экран, объясняющий событие доступа
7. Пользователь возвращается назад в историю без потери общей позиции или с понятным root-return.
8. Пользователь продолжает просмотр истории.

### Failure paths

#### A. История пуста
- Показывается meaningful empty state:
  - `Здесь будет история ваших действий`
  - `Когда вы начнёте загружать анализы и получать обновления, они появятся здесь`
- Экран не должен выглядеть сломанным или техническим

#### B. Не удалось загрузить историю
- Показывается error state:
  - `Не удалось загрузить историю`
  - CTA `Повторить`
- Нижняя навигация остаётся доступной
- Пользователь может перейти в другие разделы

#### C. Связанный объект больше недоступен
- Само событие остаётся видимым в истории
- При нажатии показывается safe fallback:
  - `Этот объект сейчас недоступен`
  - при необходимости объяснение причины
- Пользователь не теряет сам экран истории

#### D. Слишком много событий
- В v1 история должна оставаться читаемой:
  - группировка по датам
  - короткие заголовки
  - понятные типы событий
- Не превращать экран в dense audit stream

#### E. Пользователь не понимает событие
- События должны иметь человеческий текст, а не технические коды
- При необходимости добавить короткий secondary description

## UX requirements

### Layout

- History screen should be opened from the `История` tab
- Use a simple vertical feed
- Prefer reverse chronology
- Group events by date if this improves readability
- Each event card / row should contain:
  - event title
  - short description
  - timestamp
  - optional affordance for opening the related object

### Content priority

1. event meaning
2. date / time
3. access / trust relevance
4. related destination

### Russian UI direction

Example event titles:
- `Загружен новый анализ`
- `Результаты распознаны`
- `Нужна проверка документа`
- `Выдан доступ клинике`
- `Врач просмотрел данные`
- `Получен запрос от врача`
- `Появился новый план анализов`
- `Срок по шагу подготовки скоро истекает`

Example descriptions:
- `Файл добавлен в ваш профиль`
- `Мы подготовили данные для просмотра`
- `Некоторые данные нужно проверить`
- `Клиника получила доступ к вашему профилю`
- `Врач открыл ваши данные для подготовки к приёму`
- `Врач попросил добавить недостающие результаты`

Do not use technical jargon or raw system language.

### Accessibility

- large event rows
- readable Russian text
- generous spacing between items
- clear visual separation by date or card groups
- no tiny metadata-only feed
- easy scannability for 35–65+ segment

## States

### Default state
- visible event feed
- clear ordering
- readable event labels
- tap targets for events

### Loading state
- skeleton event rows
- preserved layout rhythm to avoid jumpiness

### Empty state
- no events yet
- human-readable explanation
- optional soft guidance back to `Главная` or `Подготовка`

### Error state
- retry CTA
- rest of app remains navigable

### Archived / unavailable-linked-object state
- event visible
- linked destination unavailable
- safe explanation shown on tap

## Functional requirements

### Event feed behavior
- show meaningful patient-facing events only
- newest events first
- each event must be understandable without technical knowledge
- access-related events should be especially visible

### Tap behavior
- if event has linked destination, open it in 1 tap
- if destination unavailable, show safe fallback
- return path back to history should remain simple

### Chronology and readability
- preserve clear time context
- avoid mixing unrelated metadata into primary text
- support enough events to show meaningful history without visual overload

## Definition of Done

The H6 epic is complete when:

- the patient app displays a stable `История` section
- the screen shows a readable patient-facing activity feed
- the user understands what happened in the app without technical interpretation
- key events about uploads, OCR, access, requests, and plans are represented
- tapping on an event opens the related screen or safe fallback
- the history remains readable for adult users
- layout works on iPhone 16 prototype width
- loading / empty / error / unavailable-linked-object states are present
- the screen increases transparency rather than confusion

## Suggested analytics events

- history_screen_viewed
- history_loaded
- history_failed
- history_empty_viewed
- history_event_tapped
- history_unavailable_object_opened
- history_scrolled

## Suggested implementation notes for Claude Code

For this screen, Claude should produce:

- screen goal
- history feed structure
- Russian placeholder content
- event types and sample rows
- tap behavior
- loading / empty / error / unavailable-linked-object states
- analytics hooks

Implementation guidance:
- Use a calm, readable mobile activity feed pattern
- Prefer clarity over density
- Keep event titles literal and human
- Emphasize trust-related events
- Optimize for “I understand what happened here immediately”

## Suggested file role inside project

Place this file under something like:

`/product/screens/patient-history-h6.md`
