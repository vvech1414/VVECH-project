# Инциденты revoke / expire

## 1. Title
- Feature name: Инциденты revoke / expire
- Source feature name, if different: Инциденты revoke / expire (ADM-E02-F02)
- Feature layer / epic / product area: Admin dashboard / Контроль роллаута и состояния доступов / ADM-E02 / Core

## 2. Purpose
Раздел показывает агрегированный recent-список инцидентов по доступам пациентов (отзыв доступа, истечение срока), чтобы администратор пилота мог заметить аномалии в роллауте без чтения сырого журнала. Существует, чтобы команда пилота ЭНЦ могла оперативно реагировать на отклонения, оставаясь в рамках агрегатных метрик и без доступа к ФИО пациентов.

## 3. Source normalization notes
- Source row/block: ADM-E02-F02; Epic = ADM-E02; Feature = «Инциденты revoke / expire»; Состояние = error (выделенный сценарий); Приоритет = Must-have.
- Normalized feature name: Инциденты revoke / expire.
- Source fields used: ID, Step, Feature, User action, System data (`incidents: [{type, count, lastEventAt}]`), System response, Acceptance («Список инцидентов с timestamps (N5)»).
- Source ambiguity: CSV не описывает гранулярность (день/час), глубину истории и пороги «аномалий».
- Assumptions made: данные приходят как агрегаты по типу инцидента за окно 24–72 ч; нет drill-down к конкретным пациентам.
- N3/N4/N5/N7 mapping: блок реализует N5 — журнал событий доступа. Гарантирует трассируемость без раскрытия PII.

## 4. Recommended use in Claude Code
- How Claude Code should use this file: как контекст для блока «Инциденты» на экране «Доступы и роллаут».
- Expected implementation target: Admin dashboard / экран «Доступы и роллаут» / правая колонка или нижний блок «Инциденты».
- Related files or areas: ADM-E02-F01 (список отделений), ADM-E02-F03 (compliance summary).
- What Claude Code should not infer: не показывать ФИО, id пациентов или конкретные записи; не предлагать «откатить» инцидент.

## 5. Product guardrails
- Minimal integration assumptions: данные из локального мок-стора `incidents`.
- Access control expectations: только админ-роль; никаких индивидуальных пациентских данных.
- Auditability expectations: блок сам — это поверхность журнала N5 в агрегате; просмотр блока логируется как продуктовая аналитика.
- AI/medical wording restrictions: только нейтральные операционные формулировки («доступ отозван», «срок доступа истёк»).
- Original vs structured data handling: блок не показывает оригинальные документы; только событийные агрегаты.

## 6. Open product decisions
- Decision: окно агрегации (24/48/72 ч) и нужно ли разделять auto-expire и manual revoke.
- Why it is open: пилот не закрепил SLA; CSV не уточняет.
- Recommended default for MVP: окно 72 ч, два типа: `revoked` и `expired`.

## 7. Clean block table
| Block | Description | Actor | Input | System behavior | Output / next state |
|-------|-------------|-------|-------|-----------------|---------------------|
| Entry | Админ открывает раздел роллаута. | Админ | Авторизованная сессия. | Загрузка `incidents`. | Default или error-подсветка. |
| Primary behavior | Админ просматривает recent-список. | Админ | Просмотр. | Рендер строк: тип, количество, время последнего события. | Видны последние события доступов. |
| Recovery | Пустой список или ошибка. | Система | Empty/error. | Показать стейт. | Empty / error. |
| Audit and analytics | Просмотр блока. | Система | actor_id, surface. | Событие `admin_incidents_viewed`. | Внимание к роллауту измеримо. |

## 8. Screen role in the product
- Product surface: Admin dashboard / экран «Доступы и роллаут» / блок «Инциденты».
- Upstream step: вход в раздел роллаута.
- Downstream step: переход к compliance summary (ADM-E02-F03).
- Role in patient / doctor / admin workflow: только админ; пациент видит свои собственные события в патиент-приложении.

## 9. Scope
### In scope
- Recent-список агрегатов: тип инцидента (`revoked` / `expired`), количество, `lastEventAt`.
- Подсветка строки, если `count` выше нейтрального порога — мягкий amber.
- Состояния default, loading, empty, error.
- Особенно проработать состояние error/anomaly как ключевое для CSV.

### Out of scope
- Действия «отозвать», «продлить», «связаться с пациентом».
- Любые ФИО или id пациентов.
- Drill-down к конкретным записям журнала.

### Dependencies
- Мок-стор `incidents`.
- Часовой пояс/локаль для отображения времени.

## 10. User flow
### Entry conditions
- Админ авторизован.
- Мок-стор содержит массив `incidents`.

### Happy path
1. На экране «Доступы и роллаут» рендерится блок «Инциденты доступов».
2. Грузится массив `incidents`.
3. Каждая строка: иконка типа, заголовок («Доступ отозван», «Срок доступа истёк»), `count` за окно, время последнего события.
4. Если все `count = 0`, показать «За последние 72 часа инциденты не зафиксированы».
5. Пишется событие `admin_incidents_viewed`.

### Alternative / edge paths
- Trigger: ошибка загрузки. Behavior: «Не удалось загрузить инциденты» + «Повторить».
- Trigger: количество выше нейтрального порога. Behavior: подсветка строки amber и подпись «Возможна аномалия — проверьте»; не подсказывать конкретное действие.

## 11. UX requirements
- Layout: вертикальный список из 2–4 строк; navy-заголовок «Инциденты доступов»; справа в каждой строке — `count` и время.
- Primary actions: read-only.
- Secondary actions: «Повторить» в error.
- Copy: «Доступ отозван», «Срок доступа истёк», «Последнее событие: 25 апр, 14:32».
- Accessibility: время читаемо в коротком формате с поясняющим aria-label «Двадцать пятое апреля, четырнадцать часов тридцать две минуты».

## 12. States
### Default
- Список инцидентов с агрегатами.
### Loading
- Скелетон 2–4 строк.
### Empty
- «За последние 72 часа инциденты не зафиксированы».
### Error
- Сообщение + «Повторить».
- Дополнительно: визуальная подсветка строки при `count` выше нейтрального порога.

## 13. Functional requirements
### FR1. Загрузка инцидентов
- Description: получить `incidents` и отрендерить.
- Rules: типы ограничены `revoked | expired`; неизвестные типы исключаются.
- Validation: `count` ≥ 0; `lastEventAt` — валидная дата ISO.

### FR2. Состояния
- Description: реализовать default/loading/empty/error и amber-подсветку.

### FR3. Аналитика
- Description: событие `admin_incidents_viewed` при первом рендере; событие `admin_incident_row_focused` при hover/keyboard focus.

## 14. Definition of Done
- Recent-список инцидентов виден из мок-данных.
- Все стейты реализованы; error-стейт явно проработан.
- Время событий локализовано (ru-RU).
- ФИО и id пациентов отсутствуют.
- Никаких действий над инцидентами не предлагается в MVP.

## 15. Suggested analytics events
| Event | Trigger | Properties | Success signal |
|-------|---------|------------|----------------|
| admin_incidents_viewed | Первый рендер блока. | actor_role, total_count | Внимание к роллауту измеримо. |
| admin_incident_row_focused | Hover/focus по строке. | type | Какой тип привлекает внимание чаще. |

## 16. Suggested implementation notes for Claude Code
- Suggested components/modules: `IncidentsList`, `IncidentRow`, общий `StatusChip`.
- Suggested data objects: `Incident = { type: 'revoked' | 'expired'; count: number; lastEventAt: string }`.
- Mock data snippet:
  ```ts
  const incidents: Incident[] = [
    { type: 'revoked', count: 3, lastEventAt: '2026-04-25T14:32:00+03:00' },
    { type: 'expired', count: 7, lastEventAt: '2026-04-25T11:05:00+03:00' },
  ];
  ```
- Suggested state model: `idle | loading | ready | empty | error`.
- Implementation cautions: не выдумывать «связаться с пациентом»; этот блок — индикатор, не операционный инструмент.

## 17. Suggested file role inside project
- Suggested path: docs/features/admin-dashboard/features/05-revoke-expire-incidents.md
- File role: spec для блока «Инциденты доступов» на экране роллаута.
- Related specs: 04-active-accesses-by-department, 06-compliance-summary.
- Ownership notes: продукт владеет порогом аномалии и копирайтом, инжиниринг — рендером и аналитикой.
