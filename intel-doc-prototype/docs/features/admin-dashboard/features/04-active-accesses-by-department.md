# Активные доступы по отделениям

## 1. Title
- Feature name: Активные доступы по отделениям
- Source feature name, if different: Активные доступы по отделениям (ADM-E02-F01)
- Feature layer / epic / product area: Admin dashboard / Контроль роллаута и состояния доступов / ADM-E02 / Core

## 2. Purpose
Раздел даёт администратору пилота единый список отделений ЛПУ-партнёра (ЭНЦ) с количеством активных доступов и подсказкой о тех, у которых истекает срок. Существует, чтобы команда пилота видела состояние роллаута без обращения к пациентским записям и без чтения логов.

## 3. Source normalization notes
- Source row/block: ADM-E02-F01; Epic = ADM-E02 «Контроль роллаута и состояния доступов»; Feature = «Активные доступы по отделениям»; Состояние = default; Приоритет = Must-have.
- Normalized feature name: Активные доступы по отделениям.
- Source fields used: ID, Epic, Step, Feature, User action, System data (`accessByDepartment: [{department, activeCount, expiringSoon}]`), System response, Acceptance.
- Source ambiguity: CSV не задаёт порог «expiring soon» (3, 7, 14 дней?) и сортировку.
- Assumptions made: «expiring soon» = N7 — истекает в течение 7 дней; сортировка по убыванию `activeCount`.

## 4. Recommended use in Claude Code
- How Claude Code should use this file: как контекст для списка отделений на экране «Доступы» админ-дашборда.
- Expected implementation target: Admin dashboard / экран «Доступы и роллаут» / список отделений.
- Related files or areas: ADM-E02-F02 (инциденты revoke/expire), ADM-E02-F03 (compliance summary).
- What Claude Code should not infer: не показывать ФИО пациентов, не показывать персональные id; работать только с агрегатами по отделениям.

## 5. Product guardrails
- Minimal integration assumptions: данные из локального мок-стора `accessByDepartment`.
- Access control expectations: только админ-роль; индивидуальные доступы пациентов в админке не отображаются.
- Auditability expectations: открытие списка и фильтрация логируются как продуктовая аналитика; админ не имеет операций над конкретными доступами здесь.
- AI/medical wording restrictions: только операционные термины («активные доступы», «истекает в ближайшие 7 дней»).
- N3/N4/N5/N7 mapping: блок опирается на N4 (явная область доступа: чьим врачам/отделениям) и N7 (длительность и срок истечения доступа). Поле `expiringSoon` визуализирует N7 в агрегате.

## 6. Open product decisions
- Decision: точный порог «expiring soon» и допустима ли фильтрация по ЛПУ.
- Why it is open: пилот ЭНЦ работает в одном ЛПУ; CSV не уточняет порог.
- Recommended default for MVP: 7 дней; без фильтра по ЛПУ.

## 7. Clean block table
| Block | Description | Actor | Input | System behavior | Output / next state |
|-------|-------------|-------|-------|-----------------|---------------------|
| Entry | Админ открывает раздел роллаута. | Админ | Авторизованная сессия. | Загрузка `accessByDepartment`. | Default-список отделений. |
| Primary behavior | Админ просматривает список. | Админ | Просмотр / сортировка. | Рендер строк: отделение, активных, истекают скоро. | Видна агрегированная картина роллаута. |
| Recovery | Список пуст или ошибка. | Система | Empty/error. | Показать соответствующий стейт. | Empty / error. |
| Audit and analytics | Просмотр списка. | Система | actor_id, surface. | Событие `admin_access_by_department_viewed`. | Использование раздела измеримо. |

## 8. Screen role in the product
- Product surface: Admin dashboard / экран «Доступы и роллаут» / основной список.
- Upstream step: вход админа в дашборд.
- Downstream step: переход к инцидентам (ADM-E02-F02) или сводке compliance (ADM-E02-F03).
- Role in patient / doctor / admin workflow: только админ; пациенты видят свои собственные доступы в патиент-приложении (ЭНЦ).

## 9. Scope
### In scope
- Список отделений с тремя колонками: «Отделение», «Активные», «Истекают (≤7 дн.)».
- Сортировка по умолчанию — по `activeCount` desc.
- Состояния default, loading, empty, error.
- Подсветка `expiringSoon > 0` нейтральным amber-чипом.

### Out of scope
- Управление конкретными доступами (revoke/extend) из админки — это патиент-операция.
- Любые ФИО или id пациентов.
- Многопартнёрский переключатель ЛПУ.

### Dependencies
- Мок-стор `accessByDepartment`.
- Общий компонент таблицы/списка.

## 10. User flow
### Entry conditions
- Админ авторизован.
- Мок-стор содержит массив отделений.

### Happy path
1. Админ открывает «Доступы и роллаут».
2. Загружается `accessByDepartment`.
3. Рендерится таблица: «Эндокринология — 84 активных, 6 истекают», «Терапия — 32 активных, 2 истекают», «Лабдиагностика — 12 активных, 0 истекают».
4. Если у строки `expiringSoon > 0`, рядом — amber-чип.
5. Пишется событие `admin_access_by_department_viewed`.

### Alternative / edge paths
- Trigger: пустой массив. Behavior: «Доступы пилота пока не оформлены».
- Trigger: ошибка загрузки. Behavior: «Не удалось загрузить список» + «Повторить».

## 11. UX requirements
- Layout: список карточек или таблица на светлом фоне; navy-заголовок; число активных — крупным; подзаголовок «Истекают в ближайшие 7 дней — N».
- Primary actions: read-only.
- Secondary actions: «Повторить» в error.
- Copy: «Активные доступы по отделениям», «Истекают в ближайшие 7 дней».
- Accessibility: каждая строка читается скринридером целиком («Эндокринология, активных доступов 84, истекают в ближайшие 7 дней — 6»).

## 12. States
### Default
- Список отделений с цифрами.
### Loading
- Скелетон 3–5 строк.
### Empty
- Текст «Доступы пилота пока не оформлены».
### Error
- Сообщение + «Повторить».

## 13. Functional requirements
### FR1. Загрузка списка
- Description: получить `accessByDepartment` и отрендерить.
- Rules: пустые/некорректные строки исключаются.
- Validation: `activeCount` ≥ 0; `expiringSoon` ≤ `activeCount`.

### FR2. Состояния
- Description: реализовать default/loading/empty/error.

### FR3. Аналитика
- Description: событие `admin_access_by_department_viewed` при первом рендере.

## 14. Definition of Done
- Список отделений отображается из мок-стора.
- Подсветка `expiringSoon > 0` работает.
- Все четыре состояния реализованы.
- ФИО и id пациентов отсутствуют.

## 15. Suggested analytics events
| Event | Trigger | Properties | Success signal |
|-------|---------|------------|----------------|
| admin_access_by_department_viewed | Рендер списка. | actor_role, total_departments | Использование раздела измеримо. |

## 16. Suggested implementation notes for Claude Code
- Suggested components/modules: `AccessByDepartmentList`, `DepartmentRow`, `StatusChip`.
- Suggested data objects: `DepartmentAccess = { department: string; activeCount: number; expiringSoon: number }`.
- Mock data snippet:
  ```ts
  const accessByDepartment: DepartmentAccess[] = [
    { department: 'Эндокринология', activeCount: 84, expiringSoon: 6 },
    { department: 'Терапия', activeCount: 32, expiringSoon: 2 },
    { department: 'Лабдиагностика', activeCount: 12, expiringSoon: 0 },
  ];
  ```
- Suggested state model: `idle | loading | ready | empty | error`.
- Implementation cautions: не давать действий над доступами; ничего, что выглядело бы как «отозвать» или «продлить» из админки в MVP.

## 17. Suggested file role inside project
- Suggested path: docs/features/admin-dashboard/features/04-active-accesses-by-department.md
- File role: spec для основного списка раздела «Доступы и роллаут».
- Related specs: 05-revoke-expire-incidents, 06-compliance-summary.
- Ownership notes: продукт владеет порогом «expiring soon», инжиниринг — рендером и аналитикой.
