# IntelDoc — H4 Карусель сервисов на главном экране пациента (Claude Code Input)

## Purpose

This file converts the **H4 epic / services carousel** into a Claude Code-friendly product spec for implementation inside the IntelDoc patient app prototype.

The goal of this file is to describe the **adjacent services carousel** on the patient home screen as a product artifact, not as final UX copy. It should be used as implementation context for the first prototype iteration.

## Source normalization notes

- This spec is derived from the approved H4 epic for the patient home screen.
- The carousel is part of the broader **home hub** and must support the core IntelDoc MVP logic: useful adjacent services for the patient without competing with the primary preparation journey.
- The carousel is a **secondary module** on the home screen and must sit below the main preparation banner and the Vasiliy block.
- The carousel should surface relevant partner / ecosystem services around diabetes and chronic care.
- UI language must be **Russian**.
- The target device for prototype layout is **iPhone 16**.
- The target audience is adult patients, so the UI must use **large tap areas, large typography, and low visual density**.

## Recommended use in Claude Code

- Use this file as a **screen-block specification** for the services carousel on the patient home screen.
- Treat this block as a supportive, retention-oriented, and monetization-adjacent module.
- Prioritize clarity, card readability, and easy exploration.
- Implement the happy path first.
- Add explicit loading, empty, and fallback states.

## Product guardrails

- The block must answer the question: **“Какие ещё полезные сервисы доступны мне в этом приложении?”**
- The carousel must not compete with the main preparation banner or become the dominant home-screen action.
- The carousel must not feel like a generic marketplace.
- Cards must remain relevant to the patient’s health context and partner ecosystem.
- The carousel must not overload the user with too many options at once.
- In the prototype, the carousel should focus on **discovery and navigation**, not on full monetization logic.
- If some services are not implemented yet, the block must fail gracefully and remain structurally useful.
- The carousel must remain readable and comfortable for adult users.

## Open product decisions

1. **Final service set:** the exact first-wave set of cards can still be tuned; assume 4–5 cards in v1.
2. **Card prioritization logic:** whether the order is static or personalized is still open; assume static order in v1.
3. **Card destination depth:** whether a card opens a teaser screen is still open.
4. **Partner branding visibility:** whether certain cards carry a partner badge is still open; assume optional partner markers in v1.

## Clean block table

| Block | User action | System result | Happy path | Definition of Done | JTBD |
|---|---|---|---|---|---|
| H4 | открывает главный экран и видит карусель сервисов | пользователь понимает, какие дополнительные полезные сервисы доступны, и может перейти в нужный модуль | Пользователь открывает главный экран, скроллит до карусели сервисов, видит понятные карточки с короткими названиями и описаниями, свайпает по карусели, выбирает интересующий сервис и переходит в связанный экран или модуль, после чего может вернуться назад без потери общей ориентации | На главном экране отображается горизонтальная карусель крупных карточек; карточки читаемы и понятны взрослой аудитории; каждая карточка имеет ясное название и короткое описание; поддерживаются loading / empty / error states; карусель не доминирует над primary prep flow и остаётся secondary but useful block | “Когда я уже нахожусь в приложении по своей болезни, я хочу видеть полезные дополнительные сервисы в одном месте, чтобы быстро находить то, что может пригодиться мне помимо подготовки к приёму.” |

## Screen role in the product

The H4 services carousel is the **adjacent value, discovery, and secondary engagement layer** of the patient home screen.

It answers 3 immediate questions:
1. **Какие ещё полезные сервисы доступны мне здесь?**
2. **Куда я могу перейти, если мне нужен не только сценарий подготовки к приёму?**
3. **Какие сервисы связаны с моей болезнью и контекстом клиники?**

This block should remain visually secondary to the preparation banner and Vasiliy block above it.  
Its purpose is discovery, helpful expansion of value, and soft entry into adjacent modules.

## Scope

### Included

- horizontal services carousel
- large service cards
- service title
- short supporting description
- optional partner / recommended badge
- horizontal swipe behavior
- tap-to-open behavior
- loading / empty / error states
- accessibility-friendly spacing and sizing

### Included service types in v1

- `Школа диабета`
- `Лекарства и расходники`
- `Анализы`
- `Полезные сервисы`
- optional `ДМС / страхование` or similar ecosystem card

### Excluded

- full marketplace catalog
- dense ecommerce grid
- advanced recommendation engine
- full personalization logic
- payment flow inside the carousel itself
- heavy promotional banners
- infinite card feed
- ad-like clutter or unrelated offers

## User flow

### Happy path

1. Пользователь находится на главном экране.
2. Прокручивает экран ниже основного prep-сценария.
3. Видит карусель сервисов с крупными карточками.
4. Каждая карточка показывает:
   - название сервиса
   - короткое описание
   - optional badge or marker
5. Пользователь свайпает карусель и просматривает доступные опции.
6. Пользователь нажимает на интересующую карточку.
7. Приложение открывает соответствующий экран, модуль или placeholder.
8. Пользователь возвращается назад на главный экран без потери общей ориентации.

### Failure paths

#### A. Нет доступных сервисов
- Показывается meaningful empty state:
  - `Сервисы скоро появятся`
  - `Здесь будут дополнительные полезные разделы`
- Блок не должен выглядеть сломанным

#### B. Не удалось загрузить карточки
- Показывается error state:
  - `Не удалось загрузить сервисы`
  - CTA `Повторить`
- Остальной home screen продолжает работать

#### C. Карточка ведёт в ещё неготовый модуль
- Открывается calm placeholder / teaser screen:
  - `Этот раздел скоро появится`
- Пользователь понимает, что сервис ещё не реализован полностью

#### D. Слишком много карточек
- В v1 нельзя перегружать карусель
- Ограничить количество visible services
- Использовать краткие названия и low-density card layout

#### E. Сервис выглядит как реклама
- Карточки должны быть полезными и релевантными, не промо-first
- Не использовать aggressive commercial tone

## UX requirements

### Layout

- The block must sit below the preparation banner and Vasiliy block
- Use a horizontal swipe carousel pattern
- Prefer large cards with clear titles and short descriptions
- Avoid showing too many small cards at once
- Keep the card rhythm calm and readable
- Maintain generous spacing between cards and surrounding blocks

### Content priority

1. service relevance
2. clear title
3. short supporting text
4. easy swipe and tap behavior
5. optional badge / partner context

### Russian UI direction

Example card titles:
- `Школа диабета`
- `Лекарства и расходники`
- `Анализы`
- `Полезные сервисы`
- `Страхование`

Example supporting text:
- `Материалы и программы для жизни с диабетом`
- `Подбор нужных товаров и расходников`
- `Запись и связанные сервисы по анализам`
- `Дополнительные предложения в вашем контексте`

Do not use long promo copy or aggressive commercial wording.

### Accessibility

- large card touch targets
- readable Russian text
- strong contrast between card and background
- calm card hierarchy
- enough spacing between cards
- easy scannability for 35–65+ segment
- no tiny chips or dense offer metadata

## States

### Default state
- visible horizontal carousel
- readable service cards
- clear swipe affordance
- tapable cards

### Loading state
- skeleton cards in horizontal layout
- preserved block height to avoid jumpiness

### Empty state
- no services available yet
- human-readable explanation
- block remains structurally calm

### Error state
- retry CTA
- rest of home screen remains usable

### Placeholder-destination state
- user taps a service that is not implemented yet
- app opens a safe “coming soon” destination instead of breaking

## Functional requirements

### Carousel behavior
- horizontal swipe must work predictably
- cards must remain large and readable
- card order is stable in v1
- the block must remain secondary to the prep journey

### Card behavior
- each card opens a clear destination in 1 tap
- cards must communicate service value without long descriptions
- optional badges must remain subtle and readable
- avoid mixing too many card styles

### Relevance and restraint
- include only relevant health / ecosystem services
- do not turn the block into a marketplace homepage
- keep discovery useful and lightweight in the prototype

## Definition of Done

The H4 epic is complete when:

- the patient home screen displays a stable services carousel
- the carousel sits below the primary prep-related blocks
- cards are readable and comfortable for adult users
- horizontal swipe works predictably
- each card opens a clear destination or a safe placeholder
- the block remains secondary, not dominant
- loading / empty / error / placeholder-destination states are present
- the layout works on iPhone 16 prototype width
- the carousel increases perceived usefulness without creating clutter

## Suggested analytics events

- services_carousel_viewed
- services_carousel_loaded
- services_carousel_failed
- services_card_swiped
- services_card_tapped
- services_empty_viewed
- services_placeholder_opened

## Suggested implementation notes for Claude Code

For this block, Claude should produce:

- block goal
- carousel structure
- service card list
- Russian placeholder content
- swipe behavior
- tap behavior
- loading / empty / error / placeholder-destination states
- analytics hooks

Implementation guidance:
- Use a calm, native-like horizontal card carousel
- Prefer fewer larger cards over many small ones
- Keep titles short and literal
- Keep this block secondary to preparation
- Optimize for “I quickly understand what else is available here”

## Suggested file role inside project

Place this file under something like:

`/product/screens/patient-home-h4-services-carousel.md`
