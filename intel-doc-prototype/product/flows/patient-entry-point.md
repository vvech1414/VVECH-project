# IntelDoc — Partner Entry Point Flow (Claude Code Input) — v4

## Changelog vs v3

- **Expanded Screen 4 consent structure** from 3 simple blocks to a legally-granular set aligned with 152-ФЗ, 38-ФЗ, and the 2022 cross-border transfer amendments:
  - `A` — Обработка персональных данных (general, 152-ФЗ ст. 9) — **required**
  - `B` — Обработка специальных категорий ПДн / медицинских данных (152-ФЗ ст. 10) — **required**
  - `C` — Трансграничная передача (152-ФЗ ст. 12) — **conditional/required** (include only if infrastructure requires)
  - `D` — Рекламные и информационные рассылки (38-ФЗ ст. 18) — **optional**
- Clarified the relationship between Screen 3 and the "передача/предоставление данных конкретному ЛПУ" consent: **Screen 3's e-signed grant IS this consent** — it serves the legal function of the specific-recipient transfer consent under 152-ФЗ ст. 9.
- Added **Appendix A — Legal Text Placeholders** with full Russian text for each consent's modal, designed for legal review and production copy replacement.
- Updated analytics events to cover per-block consent acknowledgments.
- Modal read-and-acknowledge pattern now applies to all three required consents (A, B, C if included). Optional consent (D) does not require scroll-to-read.
- Phone number is now **required** in Screen 2 (not optional), because it is used for OTP-based e-signature in Screen 3.

## Open questions flagged for review

1. **Ordering of access grant vs. additional consents.** Verbal instruction places Screen 3 (access grant) before Screen 4 (data-processing consents). Conventional legal pattern is the inverse — foundational processing consents establish the legal basis first, then third-party transfer is granted on top. Recommend review with legal counsel before pilot. Current spec follows the verbal instruction.
2. **Cross-border transfer consent (Block C) inclusion.** All processing occurs within RF, remove Block C from Screen 4 and update the progress indicator accordingly.
3. **E-signature method.** Currently OTP-based ПЭП (simple electronic signature) under 63-ФЗ. Legal may require УКЭП (qualified electronic signature) instead, especially given medical data handling — reconfirm before pilot.
4. **Marketing consent scope (Block D).** Verify whether the sender will be IntelDoc alone or IntelDoc + partner clinics / partner labs. This affects the receiver list in the legal text.

## Purpose

This file is the implementation context for the **patient entry point / onboarding flow**. It is partner-aware, starts with a co-branded Vasily welcome, moves through a minimal account step, grants lifetime clinic-level access with an e-signature, collects the foundational legal consents via a read-and-acknowledge modal pattern, and hands the user off to the main prep home via a short branded transition state.

## Source notes

- Access model is fixed as **бессрочный доступ на уровне всей клиники** (lifetime, clinic-level). Do not introduce selectable durations or doctor-level grant logic.
- All consent legal text in this document is **placeholder** — final wording must be produced and approved by legal counsel before pilot launch.
- Vasily mascot artwork not yet produced; text fallback acceptable for prototype.
- All UI copy is in Russian; code and comments in English.

## Recommended use in Claude Code

- Use this as a product requirements context file, not final UX copy.
- Implement the happy path first; handle legal/compliance and error states after.
- Visual direction: follow the reference screenshot exactly — Ada Health + Linear aesthetic, 390px mobile viewport.

## Product guardrails

- **Screen 1 is the first visible screen on the very first launch.** On subsequent launches (post-account-creation), skip directly to the authenticated main screen. Persist a `hasCompletedOnboarding` flag locally.
- Partner co-branding (`ЭНЦ × IntelDoc`) is present on every onboarding screen top chrome.
- Vasily is framed consistently as an **informational assistant**, never as a doctor or diagnostic tool. Safety footer persists on Screen 1 and throughout the flow.
- Required consents must block progress.
- Access grant must be explicit, e-signed, and logged — lifetime and whole-clinic-level only.
- The final main screen must not be empty; it should immediately direct the user to upload analyses or start the prep checklist.
- All error states must have a clear fallback.
- All progress indicators use the format `<section> · Шаг N из M` or `<section> · Последний шаг`.
- All consent metadata (version, timestamp, user ID, acknowledgment mechanism) must be persisted with an immutable audit trail.

## Clean flow table

| # | Screen | Progress | Primary CTA | Goal |
|---|---|---|---|---|
| 1 | Vasily welcome + 3 USPs | none (pre-flow) | Создать профиль | Introduce brand, partner, Vasily persona, and core value before any data collection. |
| 2 | Аккаунт (minimum account setup) | Профиль · Шаг 1 из 3 | Далее | Collect minimum identifying fields to create a draft patient profile. |
| 3 | Доступ для клиники (lifetime access grant with e-signature) | Доступ · Шаг 2 из 3 | Предоставить доступ клинике | Explicitly grant lifetime, clinic-wide access to the partner, legally binding via e-signature. Serves as the 152-ФЗ consent for data transfer to a specific ЛПУ. |
| 4 | Согласия (foundational legal consents, modal read-pattern) | Согласия · Последний шаг | Принять и продолжить | Collect foundational data-processing consents (ПДн, специальные категории, трансграничная передача) and optional marketing consent. |
| — | Transition state (setup) | indeterminate | (auto) | Bridge the legal step and the product surface with a warm, branded beat. |
| — | Main prep home | — | (out of scope) | First meaningful product surface — upload analyses / start checklist. |

---

## Screen 1 — Vasily welcome + 3 USPs

### Goal
Establish partner context (`ЭНЦ × IntelDoc`), introduce Vasily as the assistant persona, and land the three core value messages before any data collection.

### Visual direction (follows reference screenshot exactly)
- **Top chrome:** back arrow (only if user can exit) + partner pill `Э ЭНЦ`. Small `× IntelDoc` lockup adjacent.
- **Hero card (dark surface):** small label `ЗАЧЕМ INTELDOC`, headline with Vasily's greeting voice, supporting one-liner.
- **3 USP cards** (soft tinted surfaces, icon + title + 2-line description).
- **Info footer** (muted surface): informational-only disclaimer.
- **Primary CTA:** fixed bottom, full-width — «Создать профиль».
- **No progress indicator** (this is pre-flow).
- 390px viewport. Inter font. Ada Health + Linear aesthetic.

### Copy (Russian — production copy, matches screenshot)

**Hero card — label:** `ЗАЧЕМ INTELDOC`

**Hero card — headline (Vasily's voice):**
> Подготовьтесь к приёму — без лишних шагов

**Hero card — body:**
> Вместо того чтобы искать бланки и пересказывать историю на каждом визите — загрузите один раз, и данные будут там, где нужно.

**USP 1 — `[icon: grid]` Всё в одном месте**
> Загружайте анализы из любых лабораторий — Инвитро, Гемотест, KDL. Все данные хранятся вместе.

**USP 2 — `[icon: clipboard]` Подготовьтесь к приёму**
> Следуйте чек-листу, выполните план обследования врача и приходите на визит полностью подготовленными.

**USP 3 — `[icon: shield-check]` Вы контролируете доступ**
> Только вы решаете, кто и как долго видит ваши данные. Доступ можно отозвать в любой момент.

**Info footer:**
> Приложение помогает собрать и структурировать данные для визита. Это не заменяет консультацию врача.

**Primary CTA:** `Создать профиль`

### States
- **Loading:** skeleton for hero + USP cards (max 500 ms).
- **Error (partner context unresolved):** fallback card — «Не удалось определить клинику. Попросите персонал помочь со входом.» CTA disabled.
- **Show/skip:** first launch only; skip on subsequent launches.

### Success transition
Tap `Создать профиль` → Screen 2. Log `welcome_cta_tapped` with `dwell_ms`.

### Analytics
- `welcome_viewed`
- `usp_in_view` (per card, on scroll)
- `welcome_cta_tapped` (with `dwell_ms`)

---

## Screen 2 — Аккаунт (account setup)

### Goal
Create a minimum draft patient profile. Keep fields to the legal/operational minimum.

### Visual direction
- **Top chrome:** back arrow + `Э ЭНЦ` pill.
- **Progress:** segmented bar + label `Профиль · Шаг 1 из 3`.
- **Title:** `Аккаунт`
- **Subtitle:** `Только необходимое. Медицинские данные заполним на следующем шаге.`
- Form fields stacked.
- Fixed bottom primary CTA `Далее`.

### Fields

| Field | Type | Required | Validation |
|---|---|---|---|
| `ПОЛНОЕ ИМЯ` | text | yes | ≥2 words, Cyrillic + hyphens + spaces |
| `ДАТА РОЖДЕНИЯ` | native date picker | yes | age ≥ 14 (or per legal guidance); not in future |
| `ПОЛ` | segmented toggle: `Женский` / `Мужской` | yes | one selected |
| `ТЕЛЕФОН` | phone | yes | RU format; used for OTP-based e-signature in Screen 3 |
| `EMAIL (НЕОБЯЗАТЕЛЬНО)` | email | no | RFC 5322 format if provided |

### States
- **Empty (initial):** all fields blank, CTA disabled.
- **Validation error:** inline error under field; CTA disabled until resolved.
- **Saving:** CTA shows spinner; inputs disabled.

### Success transition
On `Далее` tap → validate → persist draft profile → Screen 3.

### Analytics
- `account_viewed`
- `account_field_blurred` (per field, with `valid: bool`)
- `account_submitted`
- `account_validation_error` (with field names)

---

## Screen 3 — Доступ для клиники (lifetime access grant, e-signed)

### Goal
Explicitly grant `ЭНЦ` lifetime, clinic-wide access to the patient's data, legally binding via electronic signature. **This screen also serves as the 152-ФЗ-compliant consent for data transfer to a specific ЛПУ** — the e-signed grant record constitutes the specific-recipient consent.

### Visual direction
- **Top chrome:** back arrow + `Э ЭНЦ` pill.
- **Progress:** `Доступ · Шаг 2 из 3`.
- **Title:** `Доступ для клиники`
- **Intro:** `Один раз разрешите клинике видеть ваши данные. Врачи внутри ЭНЦ смогут работать с вашими анализами без дополнительных действий с вашей стороны.`
- **Recipient card** (dark surface):
  - Label `ПОЛУЧАТЕЛЬ ДОСТУПА`
  - Partner avatar + name + full legal name
  - Mechanics list (green checks):
    - `Доступ действует бессрочно`
    - `Распространяется на всех врачей клиники`
    - `Можно отозвать в любой момент в Настройках`
- **Scope list** `ЧТО ВОЙДЁТ В ДОСТУП`:
  - Загруженные результаты анализов
  - Структурированные данные (OCR)
  - Оригиналы документов
  - Базовый профиль пациента
- **Confirmation checkbox** (required to enable CTA):
  > `Я подтверждаю, что предоставляю Эндокринологическому научному центру постоянный доступ к моим медицинским данным в IntelDoc, и даю согласие на передачу этих данных указанному ЛПУ в соответствии со статьёй 9 Федерального закона № 152-ФЗ.`
- **E-signature step** (see below).
- **Legal footer note:** `Факт выдачи доступа и согласия на передачу данных будет сохранён с временной меткой. Отозвать доступ можно в разделе «Настройки → Доступы».`
- **Primary CTA:** `Предоставить доступ клинике` (disabled until checkbox ticked AND e-signature completed).

### E-signature mechanism
OTP-based simple electronic signature (ПЭП) under 63-ФЗ when bound to an identified user.

**Flow:**
1. User ticks confirmation checkbox.
2. User taps `Подписать и продолжить`.
3. System sends 6-digit OTP to the phone number captured in Screen 2.
4. OTP entry sheet appears. User enters code.
5. On success: e-signature record created with timestamp, user ID, document hash, OTP transaction ID. Primary CTA `Предоставить доступ клинике` becomes enabled.

### States
- **Checkbox unticked:** e-signature step and primary CTA disabled.
- **Checkbox ticked, signature pending:** e-signature action highlighted.
- **OTP sent:** countdown timer (60s) + resend option.
- **OTP incorrect:** inline error, 3 attempts before lockout (5 min).
- **Signed:** checkbox and scope locked visually; primary CTA enabled.
- **Loading (grant submission):** spinner on CTA.
- **Error (server):** toast + retry.

### Success transition
Grant persisted (clinic-level, lifetime, revocable), e-signature record linked → Screen 4.

### Analytics
- `access_grant_viewed`
- `access_grant_confirm_checked`
- `esign_otp_sent`
- `esign_otp_verified` (with `attempts`)
- `esign_otp_failed`
- `access_granted` (with `grant_id`, `esign_id`)

---

## Screen 4 — Согласия (foundational legal consents, modal pattern)

### Goal
Collect the foundational data-processing consents required under 152-ФЗ and 38-ФЗ using a read-and-acknowledge modal pattern. Each required consent is a distinct legal artifact with its own text, its own acknowledgment, and its own revocation path.

### Visual direction
- **Top chrome:** back arrow + `Э ЭНЦ` pill.
- **Progress:** `Согласия · Последний шаг` (or `Шаг 3 из 3`).
- **Title:** `Согласия`
- **Intro:** `Для работы с вашими медицинскими данными нам нужны отдельные согласия по каждому основанию обработки. Нажмите на блок, чтобы прочитать полный текст.`
- **Reassurance card** (dark surface): `Данные защищены. Согласия разнесены по закону, чтобы вы осознанно контролировали каждое основание обработки своих данных.`
- **Consent blocks** (stacked, see below).
- **Footer note:** `Любое из согласий можно отозвать в разделе «Настройки → Согласия». Отзыв некоторых согласий может ограничить работу сервиса — мы предупредим вас об этом.`
- **Primary CTA:** `Принять и продолжить` (disabled until all required consents are acknowledged and ticked).

### Consent blocks

| Block | Title | Required | Modal acknowledgment | Summary copy |
|---|---|---|---|---|
| A | `Обработка персональных данных` | yes | scroll-to-end + tap | `Я соглашаюсь на обработку моих персональных данных (ФИО, дата рождения, пол, контакты) в целях работы сервиса IntelDoc. Основание: 152-ФЗ ст. 9.` |
| B | `Обработка медицинских данных (специальная категория)` | yes | scroll-to-end + tap | `Я даю отдельное согласие на обработку моих данных о состоянии здоровья: результаты анализов, заключения, выписки. Основание: 152-ФЗ ст. 10.` |
| C | `Трансграничная передача данных` | conditional (required if included) | scroll-to-end + tap | `Я соглашаюсь на передачу моих данных за пределы Российской Федерации в страны, где расположена облачная инфраструктура сервиса. Основание: 152-ФЗ ст. 12.` |
| D | `Рекламные и информационные рассылки` | **optional** | direct tick (no modal scroll required) | `Получать напоминания о подготовке к визиту, обновления сервиса и предложения партнёрских лабораторий. Основание: 38-ФЗ ст. 18.` |

> **Note on Block C.** Include only if the production infrastructure involves data processors outside the Russian Federation. If all processing occurs within RF, remove Block C and the progress label remains `Шаг 3 из 3` (or `Последний шаг`). This decision must be made based on infrastructure review before pilot.

### Relationship to Screen 3
The 152-ФЗ consent for **data transfer to a specific ЛПУ** is covered by the e-signed grant in Screen 3 — it is not duplicated as a block in Screen 4. The audit trail must reference both the Screen 3 e-signature record and the Screen 4 consent records as a single onboarding consent package for that user.

### Modal read-and-acknowledge pattern (required for Blocks A, B, and C)

**Block default state:**
- Disabled checkbox (visually greyed).
- Summary copy visible.
- Tappable block surface (entire card).

**On block tap:**
- Full-height bottom-sheet modal opens.
- Full legal text rendered inside, scrollable (see Appendix A for placeholder text).
- Modal has a persistent header with consent title and a close (×) button.
- The acknowledgment CTA inside the modal (`Я прочитал(а) и согласен(а)`) is **disabled until the user scrolls to the bottom** of the agreement text.
- Alternative a11y affordance: a "mark as read" checkbox at the bottom of the text, for screen reader users who may not trigger scroll events normally.
- On tap of `Я прочитал(а) и согласен(а)`:
  - Modal closes.
  - Block's checkbox becomes enabled and auto-ticked.
  - Block visually shifts to "accepted" state (subtle green indicator, timestamp).
  - Acknowledgment event logged with `consent_id`, `version_id`, and acknowledgment mechanism (`scroll_to_end` | `a11y_checkbox`).

**If user closes the modal without acknowledgment:**
- Checkbox remains disabled.
- Block shows a small `не прочитано` hint.

### Optional consent (Block D)
- Can be ticked directly without the modal (no legal scroll-to-read requirement for optional marketing consent).
- Tapping the block optionally opens a short detail sheet with channel selection (see below), but acknowledgment is not required.

### Subscription channels detail (Block D)
Inside the optional detail sheet:
- Toggle: `Email` (default off)
- Toggle: `SMS` (default off)
- Toggle: `Push-уведомления` (default on — transactional only; marketing push requires this consent)
- Save / Close.

### States
- **Nothing ticked:** primary CTA disabled.
- **Some required ticked:** CTA still disabled.
- **All required ticked:** CTA enabled. Optional consent may or may not be ticked.
- **Submitting:** CTA spinner; blocks locked.
- **Error:** toast + retry.

### Success transition
On `Принять и продолжить` → persist all consents with timestamps, version IDs, and acknowledgment mechanism → **Transition state**.

### Analytics
- `consents_viewed`
- `consent_block_tapped` (with `consent_id`)
- `consent_modal_scrolled_to_end` (with `consent_id`)
- `consent_acknowledged` (with `consent_id`, `version_id`, `ack_mechanism`)
- `consent_opt_in_toggled` (with `consent_id`, `channels[]`)
- `consents_submitted` (with array of all consent records)

---

## Transition state — «Готовлю ваше пространство…»

### Goal
Bridge the legal flow and the product surface with a short, warm, branded beat that signals the service is personalizing for the user.

### Visual direction
- Full-screen centered composition.
- Vasily mascot centered.
- Indeterminate progress indicator below mascot, or a sequenced list of micro-steps that tick off.
- Headline: `Готовлю ваше пространство…`
- Optional sub-sequence:
  - `Сохраняю профиль…`
  - `Подключаю клинику…`
  - `Открываю главный экран…`

### Timing
- Min display: 1500 ms.
- Max display: 4000 ms before forced advance with a silent log event.
- Advances automatically when backend setup is complete.

### States
- **Normal:** animated.
- **Backend error:** replace with `Что-то пошло не так. Попробуем ещё раз?` + retry CTA. Onboarding data is already persisted; retry only re-attempts the main-screen bootstrap.

### Analytics
- `transition_shown`
- `transition_completed` (with `duration_ms`)
- `transition_error` (with `error_code`)

---

## Build instructions for Claude Code

Implement **4 onboarding screens + 1 transition state**:

1. Vasily welcome (first launch only)
2. Аккаунт (profile · step 1/3)
3. Доступ для клиники (access · step 2/3, e-signature)
4. Согласия (consents · last step, modal read-pattern, 3 required + 1 optional)
5. Transition state (auto-advances to main)

Then hand off to the main prep home (out of scope of this document).

For each screen, Claude should produce:
- screen goal
- primary CTA
- required fields / required actions
- validation / acknowledgment rules
- empty / loading / error states
- success transition
- analytics events

## Suggested analytics events (consolidated)

- `welcome_viewed`, `usp_in_view`, `welcome_cta_tapped`
- `account_viewed`, `account_field_blurred`, `account_submitted`, `account_validation_error`
- `access_grant_viewed`, `access_grant_confirm_checked`
- `esign_otp_sent`, `esign_otp_verified`, `esign_otp_failed`
- `access_granted`
- `consents_viewed`, `consent_block_tapped`, `consent_modal_scrolled_to_end`, `consent_acknowledged`, `consent_opt_in_toggled`, `consents_submitted`
- `transition_shown`, `transition_completed`, `transition_error`
- `prep_home_viewed`

## Suggested file role inside project

Place this file under:

`/product/flows/patient-entry-point.md`

Previous versions: `patient-entry-point-claude-ready-v1.md`, `v2.md`, `v3.md` (superseded).

---

## Appendix A — Legal Text Placeholders (Russian)

> **Disclaimer.** Все тексты ниже являются **заготовкой для юридической проверки** и не должны использоваться в продакшене без ревью профильного юриста. Реквизиты оператора, перечень подрядчиков, страны трансграничной передачи, сроки и адреса — **обязательны к уточнению**.

### A.1 — Блок A · Согласие на обработку персональных данных

**СОГЛАСИЕ НА ОБРАБОТКУ ПЕРСОНАЛЬНЫХ ДАННЫХ**

В соответствии со статьёй 9 Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных», я, субъект персональных данных (далее — Пользователь), свободно, своей волей и в своём интересе даю согласие оператору — [ООО «IntelDoc», ИНН __________, ОГРН __________, адрес: __________] (далее — Оператор) на обработку моих персональных данных.

**1. Перечень персональных данных**
— Фамилия, имя, отчество
— Дата рождения
— Пол
— Номер мобильного телефона
— Адрес электронной почты (при наличии)
— Идентификаторы устройства и сессии, IP-адрес
— Данные об использовании приложения (логи, действия в интерфейсе)

**2. Цели обработки**
— Создание и ведение учётной записи в сервисе IntelDoc
— Обеспечение функционирования сервиса и аутентификации Пользователя
— Подготовка Пользователя к врачебному приёму
— Подтверждение юридически значимых действий, включая формирование простой электронной подписи
— Техническая поддержка, обратная связь и рассмотрение обращений
— Исполнение требований законодательства Российской Федерации

**3. Перечень действий с персональными данными**
Сбор, запись, систематизация, накопление, хранение, уточнение (обновление, изменение), извлечение, использование, передача (предоставление, доступ), обезличивание, блокирование, удаление, уничтожение.

**4. Способы обработки**
Автоматизированная и неавтоматизированная обработка. Обработка осуществляется на территории Российской Федерации. Случаи трансграничной передачи регулируются отдельным согласием.

**5. Срок действия согласия**
Согласие действует с момента его предоставления и до момента отзыва. Отзыв осуществляется Пользователем самостоятельно в разделе «Настройки → Согласия» или письменным заявлением в адрес Оператора.

**6. Права субъекта персональных данных**
Пользователь подтверждает, что ознакомлен с правами, предусмотренными главой 3 Федерального закона № 152-ФЗ, в том числе правом на доступ к своим персональным данным, их уточнение, блокирование или уничтожение, а также правом на отзыв согласия.

**7. Последствия отзыва согласия**
После отзыва настоящего согласия использование сервиса IntelDoc становится невозможным. Оператор прекращает обработку и уничтожает персональные данные в срок, не превышающий 30 календарных дней с момента получения заявления об отзыве, за исключением данных, обязанность по хранению которых установлена законодательством.

---

### A.2 — Блок B · Согласие на обработку специальных категорий персональных данных (медицинских)

**СОГЛАСИЕ НА ОБРАБОТКУ СПЕЦИАЛЬНЫХ КАТЕГОРИЙ ПЕРСОНАЛЬНЫХ ДАННЫХ**
**(данные о состоянии здоровья)**

В соответствии со статьёй 10 Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных», я даю **отдельное письменное согласие** на обработку специальных категорий моих персональных данных, относящихся к состоянию здоровья.

**1. Категории обрабатываемых данных**
— Результаты лабораторных и инструментальных исследований
— Заключения, выписки и направления медицинских специалистов
— Информация о перенесённых и хронических заболеваниях, поставленных диагнозах
— Сведения о назначенном лечении, лекарственных препаратах и их приёме
— Иные медицинские документы, самостоятельно загружаемые Пользователем в сервис
— Ответы Пользователя на медицинские вопросы в ходе подготовки к приёму

**2. Цели обработки**
— Структурирование и хранение медицинских документов в личном кабинете Пользователя
— Автоматическое извлечение данных из загруженных документов (оптическое распознавание, OCR)
— Подготовка обобщённой сводки для врачебного приёма
— Выявление отсутствующих показателей и формирование информационных рекомендаций о том, какие данные стоит подготовить
— Формирование чек-листа подготовки к визиту

**3. Особые условия**
Обработка осуществляется исключительно в интересах Пользователя и для целей его подготовки к медицинскому приёму. Сервис IntelDoc не является медицинским изделием, не ставит диагнозов и не выдаёт клинических рекомендаций. Все материалы, формируемые сервисом, носят информационный характер и не заменяют консультацию врача.

**4. Передача данных**
Передача медицинских данных конкретному медицинскому учреждению осуществляется на основании отдельного согласия Пользователя — предоставления доступа ЛПУ, оформленного электронной подписью (см. раздел «Доступ для клиники»).

**5. Срок действия согласия**
До момента отзыва согласия в разделе «Настройки → Согласия» или письменным заявлением.

**6. Последствия отзыва**
После отзыва настоящего согласия Оператор прекращает обработку медицинских данных и удаляет или обезличивает их в срок, не превышающий 30 календарных дней. После отзыва дальнейшая подготовка к приёмам через сервис становится невозможной.

**7. Подтверждение информированности**
Пользователь подтверждает, что ознакомлен с объёмом обрабатываемых данных, целями обработки и последствиями отказа или отзыва согласия.

---

### A.3 — Блок C · Согласие на трансграничную передачу персональных данных

> Включается в онбординг **только если** инфраструктура решения предусматривает обработку за пределами РФ. Если все подрядчики и хранилища находятся в РФ — блок C исключается.

**СОГЛАСИЕ НА ТРАНСГРАНИЧНУЮ ПЕРЕДАЧУ ПЕРСОНАЛЬНЫХ ДАННЫХ**

В соответствии со статьёй 12 Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных», я даю **отдельное согласие** на трансграничную передачу моих персональных данных, включая специальные категории.

**1. Страны получателей**
Передача осуществляется в: [перечень стран — уточняется в зависимости от используемой облачной инфраструктуры и подрядчиков Оператора].

**2. Уровень защиты персональных данных в странах получателей**
Пользователь проинформирован о том, что страны получателей [обеспечивают / не обеспечивают] адекватный уровень защиты прав субъектов персональных данных в соответствии с перечнем Роскомнадзора.

**3. Цели трансграничной передачи**
— Хранение данных в облачной инфраструктуре
— Резервное копирование и обеспечение отказоустойчивости
— Вычислительная обработка (OCR, структурирование, подготовка сводок)
— Техническая поддержка сервиса подрядчиками Оператора

**4. Категории передаваемых данных**
Все категории данных, на обработку которых получены согласия Пользователя (блоки A и B).

**5. Получатели**
[Перечень обрабатывающих лиц и подрядчиков — уточняется. Актуальный перечень доступен в разделе «Настройки → Согласия → Подрядчики».]

**6. Информированность о рисках**
Пользователь подтверждает, что ознакомлен с возможными рисками трансграничной передачи, в том числе с тем, что в странах получателей могут применяться иные режимы защиты персональных данных.

**7. Срок действия и отзыв**
Согласие действует до отзыва. После отзыва передача прекращается; ранее переданные данные удаляются или возвращаются в инфраструктуру на территории РФ в срок не более 30 календарных дней.

**8. Последствия отзыва**
Отзыв настоящего согласия может существенно ограничить функциональность сервиса. Оператор уведомит Пользователя о конкретных ограничениях до подтверждения отзыва.

---

### A.4 — Блок D · Согласие на получение информационных и рекламных рассылок

**СОГЛАСИЕ НА ПОЛУЧЕНИЕ ИНФОРМАЦИОННЫХ И РЕКЛАМНЫХ МАТЕРИАЛОВ**

В соответствии с частью 1 статьи 18 Федерального закона от 13.03.2006 № 38-ФЗ «О рекламе», я даю согласие на получение от Оператора и его партнёров информационных и рекламных сообщений.

**1. Каналы коммуникации**
— Push-уведомления в приложении
— Электронная почта (Email)
— SMS-сообщения
— Мессенджеры (при наличии интеграции)

**2. Содержание сообщений**
— Напоминания о предстоящих визитах и подготовке к ним
— Новости, обновления и новые возможности сервиса IntelDoc
— Предложения партнёрских медицинских лабораторий и клиник
— Образовательные материалы по подготовке к приёму и хроническим заболеваниям
— Опросы об удовлетворённости сервисом

**3. Отправители**
— [ООО «IntelDoc»]
— Партнёрские медицинские организации и лаборатории — **перечень подлежит уточнению**

**4. Отказ от рассылок**
Пользователь может отказаться от получения рассылок в любой момент:
— в разделе «Настройки → Уведомления» приложения
— по ссылке «Отписаться» в каждом email-сообщении
— ответом «СТОП» на SMS-сообщение
— отключением push-уведомлений в настройках операционной системы устройства

**5. Срок действия**
До момента отзыва согласия или отписки от рассылок.

**6. Необязательность**
Настоящее согласие является **необязательным**. Отказ от его предоставления или отзыв не влияет на возможность пользоваться сервисом IntelDoc и не ограничивает функциональность основного флоу подготовки к приёму.

---

### A.5 — Консолидированная запись пакета согласий

При нажатии `Принять и продолжить` на Screen 4 система формирует единый consent bundle следующей структуры (храним неизменяемо):

| Поле | Описание |
|---|---|
| `bundle_id` | уникальный идентификатор пакета согласий |
| `user_id` | идентификатор пользователя |
| `captured_at` | UTC timestamp |
| `ip_address` | IP в момент выдачи |
| `user_agent` | строка user-agent |
| `consents[]` | массив записей по каждому блоку (A, B, C, D) |
| `consents[].id` | `pdn_general` / `pdn_special` / `cross_border` / `marketing` |
| `consents[].version` | версия правового текста (семантическая) |
| `consents[].accepted` | bool |
| `consents[].ack_mechanism` | `scroll_to_end` / `a11y_checkbox` / `direct_tick` / `not_applicable` |
| `consents[].channels[]` | для marketing — список выбранных каналов |
| `linked_esign_id` | ссылка на e-signature из Screen 3 (grant to clinic) |
| `partner_id` | `enc` (для данного пилота) |

Этот пакет вместе с e-signature записью из Screen 3 образует полный правовой след онбординга.
