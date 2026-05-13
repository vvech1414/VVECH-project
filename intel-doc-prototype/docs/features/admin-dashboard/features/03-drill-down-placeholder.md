# Drill-down заглушка по KPI

## 1. Title
- Feature name: Drill-down заглушка по KPI
- Source feature name, if different: Drill-down placeholder (ADM-E01-F03)
- Feature layer / epic / product area: Admin dashboard / Мониторинг адопшна и KPI пилота / ADM-E01 / Core

## 2. Purpose
При тапе по KPI-карточке или точке тренда администратор переходит на заглушку, которая аккуратно объявляет, что детальный разбор появится в следующей версии. Существует, чтобы избежать «битых» ссылок и сохранить ожидание у пилот-стейкхолдера, не имитируя несуществующую аналитику.

## 3. Source normalization notes
- Source row/block: ADM-E01-F03; Epic = ADM-E01; Feature = «Drill-down placeholder»; Состояние = empty; Приоритет = Must-have.
- Normalized feature name: Drill-down заглушка по KPI.
- Source fields used: ID, Step, Feature, User action, System data (`selectedKpi`), System response, Acceptance.
- Source ambiguity: CSV не описывает визуал заглушки и наличие подписки/уведомления.
- Assumptions made: одна общая заглушка для всех трёх KPI, без подписки на «уведомить, когда появится».

## 4. Recommended use in Claude Code
- How Claude Code should use this file: как контекст для отдельного экрана-заглушки, на который ведут KPI-карточки и тренд.
- Expected implementation target: Admin dashboard / экран `kpi/:id` (мок-роутинг или state-based).
- Related files or areas: ADM-E01-F01 (карточки), ADM-E01-F02 (тренд).
- What Claude Code should not infer: не делать настоящую аналитику; не строить таблицы пациентов.

## 5. Product guardrails
- Minimal integration assumptions: всё локально, без backend.
- Access control expectations: только админ-роль.
- Auditability expectations: переход на заглушку логируется как продуктовая аналитика.
- AI/medical wording restrictions: только нейтральные операционные формулировки.
- Original vs structured data handling: на этом экране нет данных пациентов вообще.

## 6. Open product decisions
- Decision: добавлять ли «Сообщить, когда появится» в MVP.
- Why it is open: CSV не требует, но команда пилота может попросить.
- Recommended default for MVP: только текст и кнопка «Назад», без подписки.

## 7. Clean block table
| Block | Description | Actor | Input | System behavior | Output / next state |
|-------|-------------|-------|-------|-----------------|---------------------|
| Entry | Админ тапает KPI-карточку или точку тренда. | Админ | `selectedKpi`. | Навигация к экрану заглушки. | Empty-state экран. |
| Primary behavior | Админ читает заглушку. | Админ | Просмотр. | Показ статичного текста и иконки. | Понимание, что детальный разбор будет позже. |
| Recovery | Нет — экран статичный. | — | — | — | — |
| Audit and analytics | Открытие placeholder. | Система | actor_id, selectedKpi. | Событие `admin_drilldown_placeholder_viewed`. | Спрос на drill-down измерим. |

## 8. Screen role in the product
- Product surface: Admin dashboard / экран заглушки KPI.
- Upstream step: тап по KPI-карточке (ADM-E01-F01) или точке тренда (ADM-E01-F02).
- Downstream step: «Назад» в обзор пилота.
- Role in patient / doctor / admin workflow: только админ.

## 9. Scope
### In scope
- Один общий экран с понятной заглушкой.
- Заголовок KPI, краткая подпись периода, иконка/иллюстрация.
- Кнопка «Назад».
- Аналитическое событие.

### Out of scope
- Реальный drill-down, фильтры, сегментация.
- Подписка/уведомления.

### Dependencies
- Параметр `selectedKpi` из стейта или роута.
- Общий AppShell админки.

## 10. User flow
### Entry conditions
- Админ открыл секцию KPI или тренд и тапнул элемент.

### Happy path
1. Открывается экран `kpi/:id` (или меняется состояние).
2. В заголовке отображается понятное имя KPI (например, «Готовность к визиту»).
3. Под заголовком — краткая подпись «Подробный разбор появится в следующей версии».
4. Снизу — кнопка «Назад к обзору пилота».
5. Пишется событие `admin_drilldown_placeholder_viewed`.

### Alternative / edge paths
- Trigger: `selectedKpi` не передан/невалиден. Behavior: показать общий текст без названия KPI и кнопку «Назад».

## 11. UX requirements
- Layout: центрированный блок: иконка, заголовок (navy), подпись (серая), кнопка «Назад» (electric blue secondary).
- Primary actions: «Назад к обзору пилота».
- Secondary actions: нет.
- Copy: «Подробный разбор появится в следующей версии», «Сейчас доступны общие показатели пилота».
- Accessibility: контраст AA, достаточный размер кнопки (≥44px), фокус-стейт.

## 12. States
### Default
- Экран отрисован с названием выбранного KPI.
### Empty
- Если `selectedKpi` отсутствует — общий текст без имени KPI.
### Error
- Не применяется (статичный экран).

## 13. Functional requirements
### FR1. Рендер заглушки
- Description: отрисовать заголовок, подпись и кнопку «Назад».
- Rules: ссылка/кнопка не должна вести на 404; всегда есть рабочий путь обратно.

### FR2. Аналитика
- Description: событие `admin_drilldown_placeholder_viewed` при открытии экрана.
- Rules: одно событие на просмотр.

## 14. Definition of Done
- Экран не «битый», доступен из карточек и тренда.
- Кнопка «Назад» возвращает на обзор пилота.
- Аналитическое событие подключено или задокументировано.
- Никаких пациентских данных не показывается.

## 15. Suggested analytics events
| Event | Trigger | Properties | Success signal |
|-------|---------|------------|----------------|
| admin_drilldown_placeholder_viewed | Открытие заглушки. | actor_role, selectedKpi | Спрос на drill-down измерим, питает планирование v2. |

## 16. Suggested implementation notes for Claude Code
- Suggested components/modules: `KpiDrilldownPlaceholder`.
- Suggested data objects: `selectedKpi: 'onboarded' | 'prepRate' | 'ocrRate' | undefined`.
- Mock data snippet:
  ```ts
  const kpiLabels = {
    onboarded: 'Онбординг',
    prepRate: 'Готовность к визиту',
    ocrRate: 'Распознавание документов',
  } as const;
  ```
- Suggested state model: `ready | empty`.
- Implementation cautions: не имитировать графики/таблицы; ясно объявить, что это заглушка.

## 17. Suggested file role inside project
- Suggested path: docs/features/admin-dashboard/features/03-drill-down-placeholder.md
- File role: spec для placeholder-экрана KPI в админ-дашборде.
- Related specs: 01-kpi-cards, 02-period-trend.
- Ownership notes: продукт владеет копирайтом, инжиниринг — навигацией и аналитикой.
