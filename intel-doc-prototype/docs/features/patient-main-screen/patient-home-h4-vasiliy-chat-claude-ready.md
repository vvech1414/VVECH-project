# IntelDoc — H4 Экран/флоу чата с «Василием» (Claude Code Input)

## Purpose

This file converts the **H4 epic / Vasiliy chat experience** into a Claude Code-friendly product spec for implementation inside the IntelDoc patient app prototype.

This file must describe **only the new product instructions required for the actual chat flow** with Vasiliy and must **not duplicate H3 instructions** that are already covered by the home-screen Vasiliy entry block.

The goal of this file is to define the **text + voice assistant interaction layer after the user has already entered from H3**.

## Dependency on H3

Assume the following is already implemented in H3 and should **not be re-specified here**:

- Vasiliy teaser / intro block on home screen
- entry positioning below the preparation banner
- assistant identity at home-screen level
- first CTA from home to assistant
- home-screen loading / empty / unavailable card states
- home-screen visual hierarchy relative to other home blocks

H4 starts **after** the user has already tapped into the Vasiliy experience.

## Source normalization notes

- This spec is derived from the approved H4 epic for the patient home experience.
- The assistant supports **two input modes**:
  - text input
  - voice input
- The assistant is a **supportive navigation and preparation tool**, not a medical authority.
- The assistant may help with:
  - preparation to visit
  - understanding next steps
  - opening relevant flows
  - explaining missing data / status
- The assistant must not provide diagnosis, treatment, or medical назначения.
- UI language must be **Russian**.
- The target device for prototype layout is **iPhone 16**.
- The target audience is adult patients, so the UI must use **large controls, readable typography, and low cognitive load**.

## Recommended use in Claude Code

- Use this file as the specification for the **assistant chat screen / flow**.
- Build the happy path first:
  - user opens chat
  - user sees starter prompts
  - user types or records a message
  - assistant answers briefly
  - assistant gives a clear next-step CTA
- Prioritize **clarity, safe framing, and fast transition from question to action**.
- Add explicit states for recording, processing, empty, and error.

## Product guardrails

- The chat must answer the question: **“Что мне делать дальше?”**
- The assistant must help the user move into an action, not trap them in a long conversation.
- Assistant responses must be:
  - short
  - practical
  - calm
  - non-diagnostic
- The chat must support both:
  - free-form asking
  - guided prompting via starter chips / quick actions
- The user must always have a clear path from assistant answer → product action.
- Voice is a convenience layer, not a separate product mode.
- If voice fails, text remains fully available.
- If the assistant cannot answer safely, it must redirect to an allowed support scenario.

## Open product decisions

1. **Single screen or thread screen + composer footer:** open, but v1 should prefer a standard thread layout.
2. **Voice UX:** hold-to-talk vs tap-to-record is still open; choose the lower-friction option for prototype.
3. **Persistence scope:** v1 may keep session-level persistence only.
4. **Starter prompts set:** exact prompts may evolve after prototype review.
5. **Escalation copy:** final wording for “this does not replace doctor advice” may still be tuned.

## Clean flow table

| Block | User action | System result | Happy path | Definition of Done | JTBD |
|---|---|---|---|---|---|
| H4 | открывает чат с Василием, пишет текстом или говорит голосом, получает ответ и переходит в нужное действие | пользователь получает понятное сопровождение и следующий шаг без поиска по приложению | Пользователь открывает чат, видит стартовые подсказки, задаёт вопрос текстом или голосом, получает короткий ответ Василия и нажимает на предложенный CTA: открыть чек-лист / загрузить анализ / посмотреть план / проверить статус подготовки | В приложении есть отдельный экран чата с историей текущей сессии, текстовым полем, voice entry, стартовыми подсказками, safe-ответами и переходами в релевантные сценарии; поддерживаются recording / processing / empty / error / permission-denied states; чат не создаёт впечатление, что ИИ ставит диагнозы или назначает лечение | “Когда я не хочу искать нужный раздел вручную, я хочу просто спросить, что мне делать дальше, и сразу перейти к следующему шагу — текстом или голосом.” |

## Screen role in the product

The H4 chat is the **interactive assistant workflow** that begins after entry from H3.

It answers 4 immediate questions:
1. **Что я могу спросить прямо сейчас?**
2. **Можно ли сделать это голосом, если мне неудобно печатать?**
3. **Какой у меня следующий шаг внутри приложения?**
4. **Куда перейти из ответа Василия?**

The H4 flow should feel like a **practical guidance layer**, not like an open-ended AI playground.

## Scope

### Included

- dedicated assistant chat screen
- message thread for current conversation
- text composer
- voice entry trigger
- starter prompts / suggested questions
- assistant short-form replies
- inline CTA blocks to relevant product flows
- safe fallback responses
- recording / processing / error states
- microphone permission handling
- return path back to home
- session-level chat persistence
- accessibility-friendly controls

### Excluded

- redesign of H3 home block
- educational long-form AI onboarding
- doctor chat / clinic communication channel
- diagnosis language
- treatment recommendation logic
- medical prescription logic
- deep medical explanation engine
- multi-agent orchestration
- full longitudinal memory beyond prototype need

## User flow

### Happy path

1. Пользователь входит в чат с Василием из H3.
2. Открывается экран чата.
3. На первом экране чата пользователь видит:
   - короткое safe-intro
   - 3–4 стартовые подсказки
   - поле ввода текста
   - кнопку голосового ввода
4. Пользователь выбирает один из вариантов:
   - пишет сообщение
   - использует голосовой ввод
5. Система показывает состояние обработки.
6. Василий возвращает короткий, понятный ответ.
7. В ответе есть один главный следующий шаг:
   - `Открыть чек-лист`
   - `Загрузить анализ`
   - `Посмотреть план`
   - `Проверить статус подготовки`
8. Пользователь нажимает CTA и переходит в соответствующий экран.
9. При возврате в чат сохраняется текущая сессия и недавние сообщения.

### Failure paths

#### A. Нет доступа к микрофону
- При попытке голосового ввода система объясняет, зачем нужен доступ к микрофону
- Показываются:
  - краткое объяснение
  - CTA `Разрешить доступ`
  - fallback `Ввести текстом`
- Чат не блокируется

#### B. Голос не распознан
- После записи показывается сообщение:
  - `Не удалось распознать речь`
  - `Попробуйте ещё раз или напишите текстом`
- Пользователь остаётся в том же контексте
- Текстовый ввод остаётся доступным

#### C. Ошибка сети / ответ не загрузился
- Показать short fallback:
  - `Не удалось получить ответ`
  - CTA `Повторить`
- Не удалять уже введённый пользовательский запрос
- Не ломать историю текущей сессии

#### D. Недостаточно данных для содержательного ответа
- Василий честно говорит, чего не хватает
- Формат ответа:
  - что пока непонятно
  - какой следующий шаг нужен
- Пример:
  - `Пока не хватает результатов анализов за последние месяцы`
  - `Вы можете загрузить их сейчас`

#### E. Пользователь просит диагноз / лечение / назначение
- Василий не даёт назначений
- Safe framing:
  - объясняет ограничение
  - переводит в разрешённый сценарий
- Пример направлений:
  - подготовка к визиту
  - просмотр плана
  - загрузка анализов
  - проверка, чего не хватает

#### F. Слишком длинный ответ
- Ответ должен быть сокращён до:
  - 1 краткого объяснения
  - 1 следующего шага
- Длинные простыни текста не допускаются в v1

## UX requirements

### Layout

Prefer a standard chat layout:

- top bar
  - back
  - title `Василий`
  - optional trust/support label
- message thread area
- starter prompts area (only before or until first message)
- bottom composer
  - text input
  - send
  - voice input button

### Content priority

1. current conversation context
2. what the user can ask
3. assistant reply
4. next-step CTA
5. safe framing

### Russian UI direction

Example intro variants:
- `Я помогу понять, что делать дальше`
- `Можно спросить меня про подготовку к приёму, анализы и следующие шаги`
- `Я не заменяю врача, но помогу сориентироваться`

Example starter prompts:
- `Что мне делать перед приёмом?`
- `Каких данных сейчас не хватает?`
- `Где мой план анализов?`
- `Как загрузить результаты?`

Example voice affordance text:
- `Нажмите, чтобы сказать голосом`
- `Спросить голосом`

Example short response patterns:
- `Сейчас следующий шаг — загрузить недостающие анализы`
- `У вас уже есть план. Его можно открыть ниже`
- `Пока не хватает данных, чтобы собрать полную картину`

Example CTA variants:
- `Открыть чек-лист`
- `Загрузить анализ`
- `Посмотреть план`
- `Проверить статус`

Do not use AI hype language or overly anthropomorphic copy.

### Accessibility

- large input area
- large microphone button
- large send button / clear affordance
- readable line height
- strong contrast
- no tiny chips
- avoid clutter in starter prompt area
- thread must remain readable for 35–65+ segment

## States

### Default empty-chat state
- intro visible
- starter prompts visible
- composer visible
- voice button visible

### Active conversation state
- message thread visible
- latest assistant response visible
- relevant next-step CTA visible
- starter prompts may collapse or disappear

### Recording state
- visible microphone active state
- clear feedback that recording is happening
- easy cancel option
- no ambiguity whether app is listening

### Processing state
- visible temporary assistant loading state
- preserve user message in thread
- avoid blank waiting screen

### Permission-denied state
- clear explanation
- CTA to enable microphone
- fallback to text input

### Error state
- last attempt failed
- retry option
- conversation thread remains intact

### Safe refusal / redirect state
- no diagnosis / treatment content
- redirect to safe support actions

## Functional requirements

### Text input
- user can type a free-form message
- send action available from composer
- sent message appears immediately in thread
- assistant response appears after processing state

### Voice input
- user can start voice entry from chat composer area
- system requests microphone permission if needed
- captured speech is transformed into a user message representation
- if transcription is unavailable in prototype, simulate with placeholder recognized text flow
- voice is not a separate screen if avoidable

### Starter prompts
- show 3–4 high-value prompts in initial state
- tapping prompt inserts or sends that question
- prompts should reduce blank-page anxiety

### Response structure
Every assistant answer in v1 should preferably contain:
1. short explanation
2. one clear next action
3. safe tone

### Deep-link / navigation behavior
Assistant responses must be able to route user into key flows:
- checklist
- upload
- plan
- prep status
- possibly document history later

### Conversation persistence
- keep current session thread when user navigates away and returns
- prototype does not need full account-level history unless already available

### Trust framing
- assistant is supportive and explanatory
- no clinical authority implied
- no diagnosis / no treatment / no prescriptions
- if relevant, a discreet disclaimer may be shown in intro or first response

## Definition of Done

The H4 epic is complete when:

- there is a dedicated Vasiliy chat screen
- user can ask via text
- user can ask via voice or prototype-equivalent voice interaction
- starter prompts are present
- assistant replies are short and actionable
- every core reply can route user into a relevant product flow
- microphone permission-denied flow exists
- recording / processing / error states exist
- current conversation persists across back-navigation within session
- the chat remains readable for adult users on iPhone 16 width
- the assistant never appears to diagnose or prescribe

## Suggested analytics events

- vasiliy_chat_opened
- vasiliy_chat_starter_prompt_tapped
- vasiliy_chat_text_sent
- vasiliy_chat_voice_tapped
- vasiliy_chat_voice_permission_requested
- vasiliy_chat_voice_permission_denied
- vasiliy_chat_voice_recognition_failed
- vasiliy_chat_response_loaded
- vasiliy_chat_response_failed
- vasiliy_chat_cta_tapped
- vasiliy_chat_safe_redirect_shown
- vasiliy_chat_returned_to_after_navigation

## Suggested implementation notes for Claude Code

For this screen / flow, Claude should produce:

- chat screen goal
- layout structure
- Russian placeholder content
- starter prompt set
- text composer behavior
- voice entry behavior
- state handling
- safe response framing
- deep-link CTA behavior
- analytics hooks

Implementation guidance:
- use a standard, familiar chat pattern
- keep replies short
- prefer action-oriented assistant output over conversational flourish
- keep voice as a lightweight convenience layer
- optimize for “ask → understand → act”
- do not rebuild H3 inside this screen

## Suggested file role inside project

Place this file under something like:

`/product/screens/patient-home-h4-vasiliy-chat.md`
