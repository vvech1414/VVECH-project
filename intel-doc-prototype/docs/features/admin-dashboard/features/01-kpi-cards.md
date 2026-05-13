# KPI-карточки пилота

## 1. Title
- Feature name: KPI-карточки пилота
- Source feature name, if different: KPI cards (ADM-E01-F01)
- Feature layer / epic / product area: Admin dashboard / Мониторинг адопшна и KPI пилота / ADM-E01 / Core

## 2. Purpose
Раздел поддерживает работу администратора пилота ЭНЦ: на одном экране видны три ключевые карточки KPI (онбординг, prep-rate, OCR-rate). Существует, чтобы команда пилота могла отслеживать адопшн без обращения к сырым пациентским данным и без выгрузок в стороннем инструменте.

## 3. Source normalization notes
- Source row/block: ADM-E01-F01; Epic = ADM-E01 «Мониторинг адопшна и KPI пилота»; Feature = KPI cards; Состояние = default; Приоритет = Must-have.
- Normalized feature name: KPI-карточки пилота.
- Source fields used: ID, Epic, Step, Feature, User action, System data, System response, Acceptance, User goal, Состояние, Epic name.
- Source ambiguity: CSV не задаёт точные пороги «зелёный/жёлтый/красный», частоту обновления и точную типографику.
- Assumptions made: Прототип использует мок-данные пилотного периода ЭНЦ; обновление по ручному mock-refresh; цифры показываются агрегированно без PII.

## 4. Recommended use in Claude Code
- How Claude Code should use this file: как контекст для верстки трёх KPI-карточек верхнего ряда дашборда администратора и подключения к мок-стору `kpis`.
- Expected implementation target: Admin dashboard / экран обзора пилота, верхняя секция «Ключевые показатели».
- Related files or areas: ADM-E01-F02 (тренд по периоду), ADM-E01-F03 (drill-down placeholder), общий AppShell/layout админки.
- What Claude Code should not infer: не показывать списки пациентов, не выводить ФИО, не вычислять прогнозы или клинические индикаторы.

## 5. Product guardrails
- Minimal integration assumptions: данные KPI приходят из локального мок-стора, без backend и API.
- Access control expectations: экран доступен только роли «администратор пилота»; пациентские записи не отображаются.
- Auditability expectations: открытие экрана и просмотр KPI логируется как продуктовая аналитика; записи о пациентах не создаются.
- AI/medical wording restrictions: формулировки только операционные («адопшн», «доля подготовленных визитов», «доля распознанных документов»); никаких медицинских интерпретаций.
- Original vs structured data handling: KPI — это агрегаты; исходные документы и OCR-данные пациентов в админке не показываются.

## 6. Open product decisions
- Decision: точные пороговые значения для цветовой индикации KPI и частота refresh.
- Why it is open: пилот ЭНЦ ещё не зафиксировал цели; CSV даёт только формат метрики.
- Recommended default for MVP: статичные мок-значения с нейтральным акцентом electric blue, без светофоров до согласования порогов.

## 7. Clean block table
| Block | Description | Actor | Input | System behavior | Output / next state |
|-------|-------------|-------|-------|-----------------|---------------------|
| Entry | Администратор открывает дашборд пилота. | Админ | Авторизованная сессия админ-роли. | Проверка роли, загрузка мок-стора `kpis`. | Default-состояние с тремя карточками. |
| Primary behavior | Админ просматривает три KPI-карточки. | Админ | Просмотр без действий. | Рендер трёх карточек: онбординг %, prep-rate %, OCR-rate %. | Видны три актуальных значения и подписи периода. |
| Recovery | Мок-стор недоступен или возвращает пусто. | Система | Ошибка/empty. | Показать состояние «Данные недоступны» с кнопкой «Обновить». | Recoverable error / empty state. |
| Audit and analytics | Просмотр KPI-секции. | Система | actor_id, surface, timestamp. | Запись аналитического события `admin_kpi_viewed`. | Метрика адопшна админки измерима. |

## 8. Screen role in the product
- Product surface: Admin dashboard / обзор пилота, верхняя секция.
- Upstream step: вход администратора в дашборд пилота ЭНЦ.
- Downstream step: переход к тренду по периоду (ADM-E01-F02) или drill-down (ADM-E01-F03).
- Role in patient / doctor / admin workflow: только админ; пациент и врач этот экран не видят.

## 9. Scope
### In scope
- Три карточки: «Онбординг», «Prep-rate», «OCR-rate» с числом, единицей (%), подписью периода.
- Состояния default, loading, empty, error.
- Аналитическое событие просмотра.

### Out of scope
- Сравнение KPI между ЛПУ.
- Прогнозы, ML-метрики, персональные дашборды.
- Любые персональные данные пациентов.

### Dependencies
- Мок-стор `kpis` в локальном state.
- Общий AppShell админ-дашборда.
- Шрифтовая шкала и цветовые токены проекта (navy + electric blue).

## 10. User flow
### Entry conditions
- Админ авторизован (мок-роль).
- Мок-стор содержит объект `kpis` или возвращает пусто.

### Happy path
1. Админ открывает экран обзора пилота.
2. Система загружает `kpis` и валидирует структуру.
3. Рендерятся три карточки в одну строку (на десктопе) или столбиком (на узком экране).
4. Каждая карточка содержит метрику, %-значение, подпись периода.
5. Пишется событие `admin_kpi_viewed`.

### Alternative / edge paths
- Trigger: `kpis` отсутствует/пустой. Behavior: показать empty-state «Данные пилота ещё не поступили». Outcome: нет ложных нулей.
- Trigger: ошибка загрузки. Behavior: error-state с кнопкой «Повторить». Outcome: нет частичного или сломанного UI.

## 11. UX requirements
- Layout: три карточки на светлом фоне, navy-заголовок, число крупным начертанием, подпись периода серой подписью; акцент electric blue только на иконке/индикаторе.
- Primary actions: нет (read-only); тап по карточке ведёт в drill-down placeholder.
- Secondary actions: «Обновить» в error/empty.
- Copy: «Онбординг», «Готовность к визиту», «Распознавание документов»; подпись «За период пилота».
- Accessibility: контраст AA, читаемость для 35–65, минимум 16px подписи, 32–40px число.

## 12. States
### Default
- Три карточки с актуальными мок-значениями и подписью периода.
### Loading
- Скелетоны трёх карточек одинаковой высоты; не мигать значениями.
### Empty
- Один блок с пояснением «Данные пилота ещё не поступили».
### Error
- Сообщение «Не удалось загрузить показатели» + «Повторить».

## 13. Functional requirements
### FR1. Загрузка KPI
- Description: получить объект `kpis` из мок-стора и отрендерить три карточки.
- Rules: не показывать карточку, если поле отсутствует; вместо этого показать «—».
- Validation: значения 0–100 (%), целое или 1 знак после запятой.

### FR2. Состояния
- Description: реализовать default/loading/empty/error.
- Rules: не блокировать весь экран при ошибке одной карточки.

### FR3. Аналитика
- Description: событие `admin_kpi_viewed` при первом рендере секции.
- Rules: одно событие на сессию просмотра.

## 14. Definition of Done
- Три карточки отображаются с мок-данными.
- Реализованы все четыре состояния.
- Нет PII пациентов.
- Тап по карточке ведёт в placeholder ADM-E01-F03.
- Аналитическое событие подключено или задокументировано как stub.

## 15. Suggested analytics events
| Event | Trigger | Properties | Success signal |
|-------|---------|------------|----------------|
| admin_kpi_viewed | Первый рендер секции KPI. | actor_role, surface, period_label | Адопшн админ-обзора измерим. |
| admin_kpi_card_tapped | Тап по карточке. | kpi_id (onboarded/prepRate/ocrRate) | Интерес к drill-down измерим. |

## 16. Suggested implementation notes for Claude Code
- Suggested components/modules: `AdminKpiSection`, `KpiCard`, общий `Skeleton`.
- Suggested data objects: `Kpis = { onboarded: number; prepRate: number; ocrRate: number; periodLabel: string }`.
- Mock data snippet:
  ```ts
  const kpis: Kpis = {
    onboarded: 128,
    prepRate: 72,
    ocrRate: 89,
    periodLabel: 'Пилот ЭНЦ, апрель 2026',
  };
  ```
- Suggested state model: `idle | loading | ready | empty | error`.
- Implementation cautions: не подключать backend, не показывать ФИО, не вводить «зоны риска» без согласованных порогов.

## 17. Suggested file role inside project
- Suggested path: docs/features/admin-dashboard/features/01-kpi-cards.md
- File role: spec для секции KPI на верху админ-дашборда.
- Related specs: 02-period-trend, 03-drill-down-placeholder.
- Ownership notes: продукт владеет порогами и копирайтом, инжиниринг — стейтами и аналитикой.
