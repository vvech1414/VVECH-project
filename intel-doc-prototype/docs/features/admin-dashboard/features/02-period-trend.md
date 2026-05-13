# Тренд KPI по периоду

## 1. Title
- Feature name: Тренд KPI по периоду
- Source feature name, if different: Тренд по периоду (ADM-E01-F02)
- Feature layer / epic / product area: Admin dashboard / Мониторинг адопшна и KPI пилота / ADM-E01 / Core

## 2. Purpose
Даёт администратору пилота направление движения ключевого KPI с помощью простого спарклайна или мини-графика. Существует, чтобы команда пилота ЭНЦ понимала, растёт ли адопшн в динамике, не открывая внешние BI-инструменты и не получая доступ к пациентским данным.

## 3. Source normalization notes
- Source row/block: ADM-E01-F02; Epic = ADM-E01; Feature = «Тренд по периоду»; Состояние = default; Приоритет = Must-have.
- Normalized feature name: Тренд KPI по периоду.
- Source fields used: ID, Epic, Step, Feature, User action, System data (`trend: [{date, value}]`), System response, Acceptance.
- Source ambiguity: CSV не указывает, для какого именно KPI рисуем спарклайн, шаг периода и количество точек.
- Assumptions made: MVP рисует один спарклайн под выбранным KPI (по умолчанию prep-rate); шаг — день; ~14–30 точек.

## 4. Recommended use in Claude Code
- How Claude Code should use this file: как контекст для добавления sparkline-блока под секцией KPI и работы с мок-стором `trend`.
- Expected implementation target: Admin dashboard / обзор пилота / блок «Динамика».
- Related files or areas: ADM-E01-F01 (KPI-карточки), общий компонент графика.
- What Claude Code should not infer: не делать многосерийные графики, не добавлять прогнозы, не показывать пациентов.

## 5. Product guardrails
- Minimal integration assumptions: данные приходят из локального мок-стора, без backend.
- Access control expectations: только админ-роль; никаких пациентских записей.
- Auditability expectations: просмотр тренда логируется как продуктовая аналитика.
- AI/medical wording restrictions: подписи только операционные («доля подготовленных визитов»); никаких медицинских терминов.
- Original vs structured data handling: тренд — агрегат, без связи с конкретными пациентами или документами.

## 6. Open product decisions
- Decision: какой именно KPI визуализируется по умолчанию и можно ли переключать между тремя.
- Why it is open: CSV требует «минимум 1 sparkline на ключевой KPI».
- Recommended default for MVP: один спарклайн на prep-rate, без переключателя.

## 7. Clean block table
| Block | Description | Actor | Input | System behavior | Output / next state |
|-------|-------------|-------|-------|-----------------|---------------------|
| Entry | Админ открывает обзор пилота. | Админ | Авторизованная сессия. | Загрузка мок-стора `trend`. | Default с графиком. |
| Primary behavior | Админ просматривает динамику. | Админ | Просмотр / hover. | Рендер спарклайна с подписью периода. | Видна траектория значения. |
| Recovery | Точек < 2 или ошибка. | Система | Empty/error. | Показать заглушку или сообщение об ошибке. | Empty / error state. |
| Audit and analytics | Просмотр тренда. | Система | actor_id, kpi_id, surface. | Событие `admin_trend_viewed`. | Адопшн блока измерим. |

## 8. Screen role in the product
- Product surface: Admin dashboard / обзор пилота / блок «Динамика».
- Upstream step: просмотр KPI-карточек.
- Downstream step: тап по графику в drill-down placeholder.
- Role in patient / doctor / admin workflow: только админ.

## 9. Scope
### In scope
- Один спарклайн под выбранным KPI с подписью периода.
- Hover/тап по точке показывает дату и значение.
- Состояния default, loading, empty, error.

### Out of scope
- Множественные серии, легенды, экспорт.
- Сравнение между ЛПУ.
- Любые пациентские данные.

### Dependencies
- Мок-стор `trend: [{date, value}]`.
- Лёгкая графическая библиотека или собственный SVG-компонент.

## 10. User flow
### Entry conditions
- Админ авторизован.
- В мок-сторе есть массив `trend`.

### Happy path
1. Под секцией KPI рендерится блок «Динамика» с подписью KPI и периода.
2. Грузится массив `trend`.
3. Рисуется спарклайн: тонкая electric-blue линия, точки скрыты, последняя точка подсвечена.
4. Hover/тап показывает tooltip «12 апр — 71%».
5. Пишется событие `admin_trend_viewed`.

### Alternative / edge paths
- Trigger: меньше двух точек. Behavior: показать «Недостаточно данных для тренда». Outcome: нет визуального шума.
- Trigger: ошибка загрузки. Behavior: «Не удалось загрузить динамику» + «Повторить».

## 11. UX requirements
- Layout: карточка на светлом фоне, заголовок «Динамика prep-rate», справа — подпись периода; высота графика 56–72px.
- Primary actions: read-only; тап ведёт в placeholder.
- Secondary actions: «Повторить» в error.
- Copy: «Динамика готовности к визиту», «За последние 14 дней».
- Accessibility: текстовая альтернатива «Среднее значение 70%, тренд растущий»; контраст AA.

## 12. States
### Default
- Спарклайн с актуальной траекторией; справа — текущее значение.
### Loading
- Скелетон 56–72px, без анимации, имитирующей реальные значения.
### Empty
- «Недостаточно данных для тренда».
### Error
- Сообщение + «Повторить».

## 13. Functional requirements
### FR1. Рендер тренда
- Description: построить спарклайн по массиву `trend`.
- Rules: точки сортируются по дате; пропуски не интерполируются — рисуется разрыв.
- Validation: `value` в диапазоне 0–100; некорректные значения исключаются.

### FR2. Состояния
- Description: default/loading/empty/error реализованы независимо от KPI-карточек.

### FR3. Аналитика
- Description: событие `admin_trend_viewed` при первом рендере; событие `admin_trend_point_inspected` при hover/тапе.

## 14. Definition of Done
- Спарклайн рендерится из мок-данных.
- Все четыре состояния реализованы.
- Tooltip показывает дату и значение.
- Нет персональных данных пациентов.

## 15. Suggested analytics events
| Event | Trigger | Properties | Success signal |
|-------|---------|------------|----------------|
| admin_trend_viewed | Первый рендер блока «Динамика». | actor_role, kpi_id, period | Использование тренда измеримо. |
| admin_trend_point_inspected | Hover/тап по точке. | kpi_id, date | Глубина изучения тренда измерима. |

## 16. Suggested implementation notes for Claude Code
- Suggested components/modules: `KpiTrend`, `Sparkline`.
- Suggested data objects: `TrendPoint = { date: string; value: number }`.
- Mock data snippet:
  ```ts
  const trend: TrendPoint[] = [
    { date: '2026-04-11', value: 64 },
    { date: '2026-04-12', value: 66 },
    { date: '2026-04-13', value: 65 },
    { date: '2026-04-14', value: 68 },
    { date: '2026-04-15', value: 70 },
    { date: '2026-04-16', value: 71 },
    { date: '2026-04-17', value: 72 },
  ];
  ```
- Suggested state model: `idle | loading | ready | empty | error`.
- Implementation cautions: не использовать тяжёлые BI-библиотеки; SVG/canvas с минимальной зависимостью.

## 17. Suggested file role inside project
- Suggested path: docs/features/admin-dashboard/features/02-period-trend.md
- File role: spec для блока «Динамика» рядом с KPI-карточками.
- Related specs: 01-kpi-cards, 03-drill-down-placeholder.
- Ownership notes: продукт владеет копирайтом и выбором KPI по умолчанию, инжиниринг — рендером графика и аналитикой.
