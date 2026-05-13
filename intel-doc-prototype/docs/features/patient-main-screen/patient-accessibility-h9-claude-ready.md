# IntelDoc — H9 Accessibility / Large UI for Adult Patients (Claude Code Input)

## Purpose

This file converts the **H9 epic / accessibility and large UI** into a Claude Code-friendly product spec for implementation inside the IntelDoc patient app prototype.

The goal of this file is to describe the **cross-screen accessibility and large-UI rules** of the patient app as a product artifact, not as final UX copy. It should be used as implementation context for the first prototype iteration.

## Source normalization notes

- This spec is derived from the approved H9 epic for the patient home screen and applies across the core patient experience, not only one isolated block.
- H9 is a **cross-cutting UX layer** that should influence the implementation of H1, H2, H3, H5, H6, H8, and future patient screens.
- The design direction must support the IntelDoc MVP logic for adult patients, especially the 35–65+ segment, where clarity, legibility, and low cognitive load are essential.
- UI language must be **Russian**.
- The target device for prototype layout is **iPhone 16**.
- The prototype must prefer **clarity over density**, **large elements over compactness**, and **confidence over visual cleverness**.

## Recommended use in Claude Code

- Use this file as a **global UI/UX implementation ruleset** for the patient prototype.
- Treat it as a design-system behavior file that should influence all main patient screens.
- Prioritize readability, tap comfort, visual simplicity, and predictable interaction.
- Implement these rules from the beginning rather than retrofitting them later.
- Use this file together with screen-level specs such as H1, H2, H3, H5, H6, and H8.

## Product guardrails

- The interface must answer the question: **“Смогу ли я быстро понять экран и уверенно нажать туда, куда нужно?”**
- The product must not assume high digital confidence or perfect vision.
- The UI must not become visually dense, tiny, or overly app-like in a consumer-tech sense.
- The patient should not need to decipher icons, dense lists, or low-contrast text.
- Important actions must be visually obvious and easy to tap.
- Text must be short, plain, and readable in Russian.
- Layout must reduce cognitive load, not maximize information density.
- Accessibility here means **practical adult usability**, not only formal compliance.

## Open product decisions

1. **Exact type scale:** final font sizes can still be tuned in prototype, but must follow the “large readable hierarchy” principle.
2. **Card density:** the exact number of visible blocks per viewport can still be tuned, but should remain low.
3. **Icon style:** icons should be simple and readable, but the final icon set can still be chosen later.
4. **Voice support level:** voice-first patterns are not required in the first iteration, but the UI should remain compatible with future simplification.
5. **Contrast tokens:** exact color-token mapping can be finalized later, but status and CTA contrast must remain strong in all key screens.

## Clean block table

| Block | User action | System result | Happy path | Definition of Done | JTBD |
|---|---|---|---|---|---|
| H9 | использует основные экраны приложения | пользователь легко читает, понимает и нажимает ключевые элементы без напряжения и лишних ошибок | Пользователь открывает приложение, быстро считывает структуру экрана, понимает, где находится основной статус, где помощь, где навигация и куда нажать дальше, после чего без промахов и перегрузки выполняет нужное действие | На основных экранах используются крупные tap targets, читаемый русский текст, чёткая визуальная иерархия, достаточные отступы, понятные CTA, сильный контраст и минимальная перегрузка контентом; интерфейс остаётся удобным для взрослой аудитории на iPhone 16; правила large UI применяются последовательно ко всем основным экранным блокам | “Когда я пользуюсь медицинским приложением, я хочу, чтобы всё было крупно, понятно и спокойно, чтобы не уставать, не ошибаться и не бояться нажать не туда.” |

## Screen role in the product

The H9 accessibility layer is the **readability, comfort, and confidence layer** of the patient app.

It answers 3 immediate questions:
1. **Могу ли я быстро понять, что происходит на экране?**
2. **Смогу ли я легко нажать на нужное действие?**
3. **Не устану ли я от интерфейса и не запутаюсь ли я в нём?**

This layer should be visible across the whole app, not as a separate screen.  
Its purpose is usability confidence, comprehension speed, and error reduction for adult patients.

## Scope

### Included

- large type hierarchy
- large tap targets
- strong contrast
- generous spacing
- low-density screen composition
- simple icon usage
- short Russian copy
- obvious CTA hierarchy
- safe area and comfortable layout rhythm
- predictable interaction patterns
- consistent card sizing
- readable badges and status chips
- text + structure-based status communication

### Included screen surfaces in v1

- home header
- preparation banner
- Vasiliy block
- bottom navigation
- history screen
- profile lite
- future adjacent patient screens that belong to the same shell

### Excluded

- enterprise-level full accessibility audit
- legal accessibility certification workflow
- advanced assistive-tech integration in v1
- heavy motion system
- visually dense dashboards
- compact pro-user layouts
- experimental gesture-first navigation
- long-form typography system documentation beyond prototype needs

## User flow

### Happy path

1. Пользователь открывает приложение на iPhone 16 или подобном.
2. Он быстро различает основные зоны экрана:
   - верхний контекст
   - главный action block
   - блок помощи
   - навигацию
3. Пользователь без усилия читает тексты на русском.
4. Пользователь понимает, какое действие главное, а какие элементы вторичны.
5. Пользователь попадает по нужной кнопке, карточке или табу с первого раза.
6. Пользователь переходит между разделами без ощущения перегрузки.
7. Пользователь возвращается в приложение позже и снова быстро ориентируется без повторного обучения.

### Failure paths

#### A. Слишком мелкий текст
- Пользователь начинает напрягаться и терять уверенность.
- Решение: увеличивать base text, title scale, button labels and spacing.

#### B. Слишком плотный экран
- Пользователь не понимает, что важно, а что вторично.
- Решение: уменьшать количество одновременно видимых блоков, усиливать hierarchy, убирать вторичные элементы из первого viewport.

#### C. Слишком маленькие tap targets
- Пользователь промахивается или боится нажать.
- Решение: увеличивать clickable area, вертикальные отступы и высоту карточек / кнопок / строк.

#### D. Слабый контраст
- Пользователь хуже считывает смысл и статус.
- Решение: повышать контраст текста, активных состояний и CTA, не полагаться на цвет alone.

#### E. Перегруженные тексты
- Пользователь не читает, пропускает смысл или путается.
- Решение: сокращать copy, убирать маркетинговый шум, оставлять 1 main message per block.

#### F. Непонятные иконки
- Пользователь не понимает, куда нажимать.
- Решение: использовать иконки только вместе с понятными текстовыми подписями там, где это критично.

#### G. Слишком много визуальных акцентов на одном экране
- Пользователь теряет приоритет действия.
- Решение: ограничивать количество primary-style элементов и оставлять один главный CTA на блок / экран.

## UX requirements

### Layout

- Use comfortable vertical spacing between primary blocks.
- Avoid packing too many content zones into the first viewport.
- Prefer large cards over dense list fragments.
- Keep CTA placement predictable.
- Respect iPhone 16 safe areas.
- Maintain a calm visual rhythm across screens.
- Keep top-level sections visually separable without relying on hard borders everywhere.

### Content priority

1. primary action clarity
2. readability of titles and body text
3. tap comfort
4. low cognitive load
5. visual calmness

### Russian UI direction

- Use simple, literal Russian wording.
- Prefer short labels and short supporting text.
- Avoid overly technical medical language on primary screens.
- Avoid decorative copy and startup-style slogans.
- Each block should communicate one main idea fast.

Example tone qualities:
- calm
- clear
- direct
- non-technical
- non-patronizing

### Accessibility

- large text hierarchy
- strong text/background contrast
- large button and card tap zones
- readable labels in bottom navigation
- simple iconography
- generous line-height and spacing
- easy scannability for 35–65+ segment
- avoid relying on color alone to communicate status
- preserve readability in loading / empty / error states

## States

### Default state
- readable text
- clear CTA hierarchy
- large interactive zones
- calm layout rhythm

### Loading state
- skeletons must preserve layout structure
- avoid large layout jumps after content appears
- maintain predictable spacing
- placeholders must resemble final hierarchy, not random gray bars

### Empty state
- keep empty states readable and reassuring
- avoid technical emptiness
- provide one clear next step if appropriate

### Error state
- errors must be understandable in plain Russian
- provide clear retry path
- do not visually overload with technical details

### High-density risk state
- if a screen becomes too dense during implementation, content must be reduced or regrouped before prototype approval

### Low-contrast risk state
- if visual review shows weak CTA, text, or status readability, contrast must be increased before prototype approval

## Functional requirements

### Text and hierarchy
- headings must be clearly distinguishable from supporting text
- supporting text must remain readable without zoom
- CTA labels must be short and obvious
- no block should require reading a long paragraph to understand the next step

### Tap targets
- all primary actions must be easy to tap for adult users
- interactive rows and cards should feel comfortably sized
- avoid tight icon-only hotspots
- bottom navigation and top-right controls must remain safely tappable

### Consistency
- large UI rules must be applied consistently across screens
- do not mix one oversized screen with one overly compact screen
- hierarchy should feel stable across the app
- repeated elements should keep the same visual treatment and interaction expectations

### Status communication
- use text plus shape / structure, not color only
- active states must be readable without guessing
- badges and small status indicators must remain legible
- key statuses should be understandable in one quick glance

## Definition of Done

The H9 epic is complete when:

- core patient screens are readable and comfortable for adult users
- primary actions are easy to identify and tap
- text hierarchy is clear on iPhone 16 prototype width
- spacing reduces cognitive overload
- interactive elements do not feel cramped
- Russian copy remains short and legible
- color is not the only status signal
- loading / empty / error states remain readable
- the interface feels calm, trustworthy, and usable rather than dense or flashy
- the same large-UI logic is consistently visible across the main patient shell

## Suggested analytics events

- accessibility_large_ui_applied
- ui_primary_cta_tapped
- ui_misclick_detected_proxy
- ui_screen_scroll_depth
- ui_return_to_primary_action
- ui_error_retry_tapped
- ui_density_review_flagged

## Suggested implementation notes for Claude Code

For this cross-screen layer, Claude should produce:

- global accessibility / large UI rules
- typography hierarchy guidance
- spacing guidance
- button and card sizing rules
- CTA hierarchy rules
- loading / empty / error readability rules
- examples of good vs bad density
- analytics hooks where helpful

Implementation guidance:
- Prefer larger text and cards over more content on screen
- Use simple native-like mobile patterns
- Keep one main action per major block
- Reduce visual cleverness if it harms clarity
- Optimize for “understand and tap without hesitation”
- Treat this file as a foundation that influences all patient-facing blocks, not as an isolated feature

## Suggested file role inside project

Place this file under something like:

`/product/foundations/patient-accessibility-h9.md`
