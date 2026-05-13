# IntelDoc Patient Prototype — Dummy Data

## Purpose
This file defines the **mock data** for the IntelDoc patient app React prototype for the **ЭНЦ pilot**.

The goal is to keep the prototype consistent, believable, and easy to implement.

This is **demo data only**. It should support a calm, realistic, clinic-linked patient journey.

---

## General rules
- Use **Russian-language data** in the UI.
- Keep names, departments, and dates realistic.
- Prefer consistency over variety.
- Avoid overly dramatic medical values or alarming scenarios.
- Support the pilot story: preparation before visit, upload of analyses, OCR review, explicit access, doctor request / examination plan, plan completion, next appointment confirmation.

---

## Partner context
### Primary clinic / institution
- **ЭНЦ**
- Expanded label for UI if needed: **Эндокринологический научный центр**

### ЛПУ / clinic label examples
- **ЭНЦ / ЛПУ №1**
- **Отделение эндокринологии ЭНЦ**

### Department options
Use one or two only to avoid clutter:
- **Отделение эндокринологии**
- **Диабетологическое отделение**

### Doctor examples
Use one primary doctor consistently:
- **Иванова Елена Сергеевна** — эндокринолог

Optional secondary doctor:
- **Петров Алексей Викторович** — эндокринолог

---

## Primary patient persona
Use one main patient for the golden-path demo.

### Main patient
- **Name:** Смирнова Анна Викторовна
- **Age:** 46
- **Sex:** Женщина
- **Context:** Подготовка к контрольному визиту к эндокринологу
- **Diagnosis context label:** Диабет / эндокринология
- **Phone:** +7 (999) 123-45-67
- **Email:** anna.smirnova@example.com

### Optional secondary patient
Only if needed for a list or alternative state:
- **Name:** Кузнецов Сергей Андреевич
- **Age:** 54
- **Context:** Нужна догрузка результатов обследования

---

## Access data
### Default access recipient
- **Recipient:** Отделение эндокринологии ЭНЦ
- **Access type label:** Доступ к данным для подготовки к приёму
- **Duration options:** 7 дней / 30 дней / 90 дней

### Example active access
- **Status:** Активен
- **Granted on:** 10 апреля 2026
- **Expires on:** 10 мая 2026
- **Recipient:** Отделение эндокринологии ЭНЦ
- **Viewed status:** Просмотрено врачом
- **Last viewed:** 12 апреля 2026, 14:35

### Example expired access
- **Status:** Истёк
- **Granted on:** 1 марта 2026
- **Expires on:** 31 марта 2026
- **Recipient:** Диабетологическое отделение

---

## Analysis document list
Use 4 core analyses for the demo.

### Analysis 1 — HbA1c
- **Document title:** Гликированный гемоглобин (HbA1c)
- **Source:** Инвитро
- **Date:** 5 апреля 2026
- **Format:** PDF
- **OCR status:** Распознано
- **Quality status:** Хорошее качество
- **Access status:** Входит в доступ

#### Structured values
- **Parameter:** HbA1c
- **Value:** 7.2
- **Unit:** %
- **Reference range:** 4.0–6.0
- **Flag:** Выше нормы

### Analysis 2 — Glucose
- **Document title:** Глюкоза крови натощак
- **Source:** Гемотест
- **Date:** 3 апреля 2026
- **Format:** Фото
- **OCR status:** Требует проверки
- **Quality status:** Среднее качество
- **Access status:** Входит в доступ

#### Structured values
- **Parameter:** Глюкоза
- **Value:** 6.8
- **Unit:** ммоль/л
- **Reference range:** 3.9–5.5
- **Flag:** Выше нормы

### Analysis 3 — Creatinine
- **Document title:** Креатинин
- **Source:** KDL
- **Date:** 3 апреля 2026
- **Format:** PDF
- **OCR status:** Распознано
- **Quality status:** Хорошее качество
- **Access status:** Входит в доступ

#### Structured values
- **Parameter:** Креатинин
- **Value:** 81
- **Unit:** мкмоль/л
- **Reference range:** 44–97
- **Flag:** В норме

### Analysis 4 — Cholesterol
- **Document title:** Общий холестерин
- **Source:** Инвитро
- **Date:** 28 марта 2026
- **Format:** Фото
- **OCR status:** Сохранено без OCR
- **Quality status:** Низкое качество
- **Access status:** Только оригинал

#### Original-only state
- **Structured data available:** Нет
- **Display label:** Сохранён только оригинал

---

## OCR review examples
Use these examples to simulate OCR review states.

### High-confidence example
- HbA1c — 7.2 %
- Confidence: high
- UI label: **Проверено**

### Low-confidence example
- Glucose — 6.8 ммоль/л
- Confidence: low
- UI label: **Нужно проверить**

### Original-only fallback example
- Total cholesterol photo too blurry
- UI label: **Сохранить без распознавания**

---

## Checklist data
### Checklist steps
1. **Загрузите анализы**
2. **Проверьте распознанные данные**
3. **Выдайте доступ ЛПУ**
4. **Откройте план обследования**
5. **Догрузите недостающие результаты**
6. **Подтвердите следующий приём**

### Example completion state
- Step 1 — completed
- Step 2 — in progress
- Step 3 — completed
- Step 4 — available
- Step 5 — pending
- Step 6 — locked until plan completion

---

## Event feed examples
Use these for the home screen or activity feed.

- **Анализ HbA1c загружен** — 5 апреля, 10:14
- **Распознавание глюкозы требует проверки** — 5 апреля, 10:16
- **Доступ ЛПУ выдан** — 10 апреля, 09:30
- **Врач просмотрел данные** — 12 апреля, 14:35
- **Получен новый план обследования** — 12 апреля, 14:42

---

## Doctor request / examination plan
### Plan title
- **План обследования перед следующим приёмом**

### Plan sender
- **Иванова Елена Сергеевна**
- **Отделение эндокринологии ЭНЦ**

### Plan items
#### Item 1
- **Title:** Глюкоза крови натощак
- **Due date:** До 18 апреля 2026
- **Status:** Выполнено
- **Why needed:** Для обновления текущих показателей перед приёмом

#### Item 2
- **Title:** HbA1c
- **Due date:** До 18 апреля 2026
- **Status:** Выполнено
- **Why needed:** Для оценки динамики показателей

#### Item 3
- **Title:** Общий холестерин
- **Due date:** До 18 апреля 2026
- **Status:** Требуется загрузить результат
- **Why needed:** Для полноты обследования перед визитом

#### Item 4
- **Title:** Креатинин
- **Due date:** До 18 апреля 2026
- **Status:** Выполнено
- **Why needed:** Для оценки сопутствующих показателей

### Plan summary states
- **0/4 выполнено**
- **3/4 выполнено**
- **План выполнен**

---

## Notification examples
Use 3–4 recurring notification types.

### Notification 1 — new plan
- **Title:** Получен новый план обследования
- **Body:** Врач добавил план обследования перед следующим приёмом
- **Type:** informational
- **CTA:** Открыть план

### Notification 2 — missing result
- **Title:** Нужно добавить результат анализа
- **Body:** По плану обследования ещё не загружен результат: общий холестерин
- **Type:** action
- **CTA:** Загрузить результат

### Notification 3 — due soon
- **Title:** Срок загрузки результатов скоро истекает
- **Body:** Загрузите недостающие результаты до 18 апреля
- **Type:** reminder
- **CTA:** Продолжить выполнение плана

### Notification 4 — appointment confirmation
- **Title:** Следующий приём готов к подтверждению
- **Body:** Все основные результаты загружены, можно подтвердить следующий приём
- **Type:** success
- **CTA:** Подтвердить приём

---

## Appointment data
### Next appointment example
- **Doctor:** Иванова Елена Сергеевна
- **Department:** Отделение эндокринологии ЭНЦ
- **Date:** 22 апреля 2026
- **Time:** 11:30
- **Format:** Очный приём
- **Status:** Ожидает подтверждения

### Confirmed appointment state
- **Status:** Подтверждён
- **Support text:** Следующий приём подтверждён. При необходимости вы можете вернуться на главный экран и проверить статус подготовки.

---

## Screen labels and short helper copy
### Home screen labels
- **Main title:** Подготовка к приёму
- **Support text:** Загрузите результаты, проверьте данные и завершите план обследования

### Access card labels
- **Card title:** Доступ к данным
- **Active label:** Доступ активен
- **Expired label:** Срок доступа истёк
- **Recipient label:** Доступ выдан

### OCR review labels
- **Title:** Проверьте распознанные данные
- **Helper:** Убедитесь, что значения указаны верно
- **Fallback:** Сохранить только оригинал

### Plan labels
- **Title:** План обследования
- **Helper:** Выполните пункты плана до следующего приёма

### Appointment labels
- **Title:** Следующий приём
- **CTA:** Подтвердить приём

---

## Status labels
Use these exact or similar labels consistently.

### Access statuses
- Активен
- Истёк
- Просмотрено врачом
- Не выдан

### OCR statuses
- Распознано
- Требует проверки
- Сохранено без OCR

### Plan statuses
- Выполнено
- Требуется загрузить результат
- Скоро срок
- Просрочено
- План выполнен

### Appointment statuses
- Ожидает подтверждения
- Подтверждён

---

## Simplification rules
- Use one primary patient for the full golden-path demo.
- Reuse the same doctor, department, and clinic context across screens.
- Do not create too many alternative document types.
- Keep the plan focused on 3–4 analysis items.
- Prefer realistic but calm values and statuses.

---

## Implementation reminder
This dummy data should help the prototype feel:
- clinically plausible
- partner-linked
- consistent across screens
- easy to demo
- easy to extend later
