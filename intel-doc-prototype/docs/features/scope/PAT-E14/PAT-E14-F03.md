---
id: PAT-E14-F03
epic: PAT-E14
epic_title: Состояние готовности / между визитами
surface: PAT
surface_title: Приложение пациента
journey: J2
journey_title: Ежедневная подготовка пациента
screen: Next-appointment confirmed
step: 3
state: success
priority: Must-have
must_demo: true
status: Готово
---

# PAT-E14-F03 — Next-appointment confirmed

> Эпик: **PAT-E14** Состояние готовности / между визитами
> Поверхность: Приложение пациента (PAT) · Путешествие: Ежедневная подготовка пациента (J2)

## 1. Что делает фича

- **Шаг:** 3
- **Экран:** Next-appointment confirmed
- **Действия пользователя:** Подтверждает следующий приём
- **Данные системы:** appointmentConfirmation: {datetime, status=confirmed}
- **Happy path:** Видит карточку confirmed
- **JTBD:** Закрыть петлю заботы

## 2. Контекст эпика

- **Initiative flow:** Пациент завершил подготовку или текущий запрос врача → главный показывает ready / no urgent tasks → пациент ждёт следующего шага врача или открывает поддержку
- **JTBD functional:** Понять, что подготовка завершена и можно ждать следующего шага врача
- **JTBD emotional:** Спокойствие и continuity между визитами
- **Состояние эпика в прототипе:** Готово
- **Комментарий из реестра:** Ready state на главном

## 3. Применимые гардрейлы

- **Прототип, не продакшн** — оптимизация под ясность демо, mock-state, без реальных API/OCR/auth/БД.
- **AI consultative only** — никаких diagnosis/treatment/prescription формулировок; разрешены summary, clarification, prep-guidance, neutral explanations.
- **Прозрачность доступа** — пациент видит recipient, scope, срок, статус доступа; никакой «тихой» передачи данных.
- **Партнёр-first UX** — ЭНЦ-контекст виден в экране, ощущение клинико-связанного канала.
- **A11y и возраст 35–65** — крупные tap-targets, читаемый шрифт, низкая когнитивная нагрузка.
- **Copy на русском** — короткие лейблы, supportive helper-тексты, без алармизма.
- **Reusable components** — использовать компоненты из `src/components/` (см. §6).

## 4. Применимые NFR

—

## 5. Состояния экрана (state coverage)

- **default** — Базовый вид экрана «Next-appointment confirmed» с заполненными mock-данными.
- **loading** — (не применимо к этой фиче)
- **empty** — (не применимо к этой фиче)
- **error** — (не применимо к этой фиче)
- **success** — Подтверждение завершения шага: status pill / зелёный баннер, переход к следующему шагу или возврат на главный. ★ обязательно для демо

> ★ Обязательно показать в демо: **success**

## 6. Рекомендуемые компоненты прототипа

- `AppointmentCard` — `src/components/AppointmentCard.tsx`
- `AppShell` — `src/components/AppShell.tsx`

## 7. Mock-данные

Сырые поля из источника: `appointmentConfirmation: {datetime, status=confirmed}`

```ts
{
  appointmentConfirmation: { datetime: "2026-05-08T10:00:00Z", status: "confirmed" },
  status: "active",
}
```

## 8. Copy guidance

**Тон:** спокойный, практичный, не алармистский. Короткие лейблы, поддерживающий helper-текст.

**Хорошие примеры:**
- «Подготовка завершена»
- «Приём подтверждён»
- «Ничего делать не нужно»

**Избегать:**
- «диагноз»
- «назначение лечения»
- «рецепт» как ключевая функция AI/app
- алармистские формулировки


## 9. Definition of Done

- [ ] Confirmation виден
- [ ] продолжается мониторинг доступа
- [ ] Реализованы релевантные состояния (см. §5)
- [ ] Соблюдены применимые NFR (см. §4)
- [ ] Copy на русском, без diagnosis/treatment-wording
- [ ] Используются переиспользуемые компоненты из `src/components/` (см. §6)
- [ ] Работает на iPhone 390×844

## 10. Открытые вопросы

Нет открытых вопросов

## 11. Куда вписать в текущий прототип

- **Маршрут:** `src/routes/patient/...`
- **Кандидаты файлов:** `src/routes/patient/Home.tsx`

---

## Источник

- Файл: `/Users/egordranev/Downloads/ИнтелДок_прототип.pdf` (pdf), секция «Декомпозиция фич»
- Сгенерировано агентом `scope-to-feature-specs`, 2026-04-25T13:22:41Z
