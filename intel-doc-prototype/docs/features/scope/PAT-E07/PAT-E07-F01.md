---
id: PAT-E07-F01
epic: PAT-E07
epic_title: История анализов и карточка анализа
surface: PAT
surface_title: Приложение пациента
journey: J2
journey_title: Ежедневная подготовка пациента
screen: Analysis card
step: 1
state: default
priority: Must-have
must_demo: true
status: Готово
---

# PAT-E07-F01 — Analysis card

> Эпик: **PAT-E07** История анализов и карточка анализа
> Поверхность: Приложение пациента (PAT) · Путешествие: Ежедневная подготовка пациента (J2)

## 1. Что делает фича

- **Шаг:** 1
- **Экран:** Analysis card
- **Действия пользователя:** Открывает карточку одного анализа
- **Данные системы:** analysis: {id, title, date, source, metrics, originalUrl, accessStatus}
- **Happy path:** Видит структурированные значения и оригинал
- **JTBD:** Видеть что именно увидит врач

## 2. Контекст эпика

- **Initiative flow:** Пациент открывает историю или карточку → видит документ и структурированные значения → понимает что уже доступно врачу
- **JTBD functional:** Видеть, что уже загружено и доступно врачу
- **JTBD emotional:** Доверие, что данные не потерялись
- **Состояние эпика в прототипе:** Готово
- **Комментарий из реестра:** История + analysis card

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

- **default** — Базовый вид экрана «Analysis card» с заполненными mock-данными. ★ обязательно для демо
- **loading** — (не применимо к этой фиче)
- **empty** — (не применимо к этой фиче)
- **error** — (не применимо к этой фиче)
- **success** — Шаг завершён, переход к следующему экрану/возврату.

> ★ Обязательно показать в демо: **default**

## 6. Рекомендуемые компоненты прототипа

- `AnalysisListItem` — `src/components/AnalysisListItem.tsx`
- `AppShell` — `src/components/AppShell.tsx`

## 7. Mock-данные

Сырые поля из источника: `analysis: {id, title, date, source, metrics, originalUrl, accessStatus}`

```ts
{
  analysis: { id: "a-001", title: "Биохимия крови", date: "2026-04-20", source: "СМ-Клиника", metrics: [], originalUrl: "/mock/lab-result-1.jpg", accessStatus: "shared" },
  date: "2026-04-25",
  metrics: [{ name: "Глюкоза", value: 6.4, unit: "ммоль/л", confidence: 0.95 }, { name: "HbA1c", value: 6.8, unit: "%", confidence: 0.71 }],
}
```

## 8. Copy guidance

**Тон:** спокойный, практичный, не алармистский. Короткие лейблы, поддерживающий helper-текст.

**Хорошие примеры:**
- «История анализов»
- «Распознано»
- «Только оригинал»

**Избегать:**
- «диагноз»
- «назначение лечения»
- «рецепт» как ключевая функция AI/app
- алармистские формулировки


## 9. Definition of Done

- [ ] Карточка показывает: title
- [ ] date
- [ ] source
- [ ] metrics
- [ ] original preview
- [ ] access status
- [ ] Реализованы релевантные состояния (см. §5)
- [ ] Соблюдены применимые NFR (см. §4)
- [ ] Copy на русском, без diagnosis/treatment-wording
- [ ] Используются переиспользуемые компоненты из `src/components/` (см. §6)
- [ ] Работает на iPhone 390×844

## 10. Открытые вопросы

Нет открытых вопросов

## 11. Куда вписать в текущий прототип

- **Маршрут:** `src/routes/patient/...`
- **Кандидаты файлов:** `src/routes/patient/AnalysisCardScreen.tsx`

---

## Источник

- Файл: `/Users/egordranev/Downloads/ИнтелДок_прототип.pdf` (pdf), секция «Декомпозиция фич»
- Сгенерировано агентом `scope-to-feature-specs`, 2026-04-25T13:22:41Z
