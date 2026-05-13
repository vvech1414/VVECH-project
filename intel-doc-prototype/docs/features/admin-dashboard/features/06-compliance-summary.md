# Сводный индикатор compliance

## 1. Title
- Feature name: Сводный индикатор compliance
- Source feature name, if different: Сводка compliance (ADM-E02-F03)
- Feature layer / epic / product area: Admin dashboard / Контроль роллаута и состояния доступов / ADM-E02 / Core

## 2. Purpose
Раздел показывает один обобщающий индикатор соблюдения требований согласия и доступов (N3, N4, N5, N7) в формате «зелёный / жёлтый / красный». Существует, чтобы администратор пилота ЭНЦ одним взглядом понимал, всё ли в норме по работе с согласием, областью доступа, журналированием и сроками доступа, без чтения сырых событий.

## 3. Source normalization notes
- Source row/block: ADM-E02-F03; Epic = ADM-E02; Feature = «Сводка compliance»; Состояние = default; Приоритет = Must-have.
- Normalized feature name: Сводный индикатор compliance.
- Source fields used: ID, Step, Feature, User action, System data (`complianceState: green|amber|red`), System response, Acceptance («Один индикатор compliance по N3/N4/N7»).
- Source ambiguity: CSV упоминает N3/N4/N7; пилотные артефакты также включают N5 (журнал доступа). MVP агрегирует N3 + N4 + N5 + N7 в один индикатор и явно перечисляет проверки.
- Assumptions made: правила агрегации детерминированные и заданы локально на стороне мок-стора.
- N3/N4/N5/N7 mapping:
  - N3 — версионирование согласия и временна́я метка принятия;
  - N4 — явная область доступа (что и кому открыто);
  - N5 — журнал событий доступа (revoke/expire);
  - N7 — длительность и срок истечения доступа.

## 4. Recommended use in Claude Code
- How Claude Code should use this file: как контекст для верхнего «единого индикатора» на экране «Доступы и роллаут».
- Expected implementation target: Admin dashboard / экран «Доступы и роллаут» / верхний блок compliance.
- Related files or areas: ADM-E02-F01 (отделения), ADM-E02-F02 (инциденты).
- What Claude Code should not infer: не превращать индикатор в «диагноз» процесса; не показывать пациентов; не предлагать автоматические действия.

## 5. Product guardrails
- Minimal integration assumptions: данные из локального мок-стора `complianceState` и сопутствующих флагов чек-листа.
- Access control expectations: только админ-роль.
- Auditability expectations: просмотр сводки логируется как продуктовая аналитика; никакие пациентские записи не отображаются.
- AI/medical wording restrictions: только операционные формулировки; никаких медицинских интерпретаций.
- Original vs structured data handling: индикатор работает с булевыми/перечислимыми флагами правил, без обращения к содержанию документов.

## 6. Open product decisions
- Decision: точные правила перехода green → amber → red (например, какой порог `expiringSoon` уводит в amber).
- Why it is open: пилотные SLA не зафиксированы.
- Recommended default for MVP: green — все четыре проверки прошли; amber — есть мягкие предупреждения (например, `expiringSoon > 0` или активные события N5); red — есть нарушения N3 (отсутствует версия/метка) или N4 (область не задана).

## 7. Clean block table
| Block | Description | Actor | Input | System behavior | Output / next state |
|-------|-------------|-------|-------|-----------------|---------------------|
| Entry | Админ открывает раздел роллаута. | Админ | Авторизованная сессия. | Загрузка `complianceState` и чек-листа N3/N4/N5/N7. | Default-индикатор. |
| Primary behavior | Админ видит индикатор и список проверок. | Админ | Просмотр. | Рендер цветовой плашки и четырёх строк проверок. | Понятен общий статус и какая проверка тянет вниз. |
| Recovery | Данных нет / ошибка. | Система | Empty/error. | Показать соответствующий стейт. | Empty / error. |
| Audit and analytics | Просмотр блока. | Система | actor_id, complianceState. | Событие `admin_compliance_summary_viewed`. | Внимание к compliance измеримо. |

## 8. Screen role in the product
- Product surface: Admin dashboard / экран «Доступы и роллаут» / верхний блок.
- Upstream step: вход в раздел роллаута.
- Downstream step: чтение деталей по отделениям (ADM-E02-F01) или инцидентам (ADM-E02-F02).
- Role in patient / doctor / admin workflow: только админ; пациент управляет своим согласием и доступом в патиент-приложении.

## 9. Scope
### In scope
- Цветовой индикатор: green / amber / red с понятной подписью.
- Чек-лист из четырёх строк: N3 «Согласие зафиксировано», N4 «Область доступа задана», N5 «Журнал событий ведётся», N7 «Сроки доступа в норме».
- Состояния default, loading, empty, error.

### Out of scope
- Полноценный compliance-аудит, отчёты, экспорт.
- Любые пациентские данные.
- Автоматические действия «исправить нарушение».

### Dependencies
- Мок-стор `complianceState` и булевые флаги по N3/N4/N5/N7.
- Общий компонент плашки/чипа.

## 10. User flow
### Entry conditions
- Админ авторизован.
- В мок-сторе есть `complianceState` и чек-лист.

### Happy path
1. На экране «Доступы и роллаут» рендерится верхний блок «Состояние compliance».
2. Грузится `complianceState` и флаги N3/N4/N5/N7.
3. Большая плашка показывает цвет и подпись («Всё в норме» / «Требуется внимание» / «Есть нарушения»).
4. Под плашкой — четыре строки проверок с зелёной/амбер/красной точкой и коротким описанием.
5. Пишется событие `admin_compliance_summary_viewed`.

### Alternative / edge paths
- Trigger: данные отсутствуют. Behavior: empty-state «Данные compliance ещё не поступили».
- Trigger: ошибка загрузки. Behavior: «Не удалось загрузить состояние compliance» + «Повторить».

## 11. UX requirements
- Layout: широкая плашка наверху блока, цвет фоновой подложки = текущий `complianceState`; ниже — чек-лист из четырёх строк.
- Primary actions: read-only.
- Secondary actions: «Повторить» в error.
- Copy:
  - green: «Всё в норме».
  - amber: «Требуется внимание».
  - red: «Есть нарушения — свяжитесь с командой пилота».
  - N3: «Согласие зафиксировано (версия и время)».
  - N4: «Область доступа задана и видна пациенту».
  - N5: «Журнал событий доступа ведётся».
  - N7: «Сроки доступа отслеживаются и не просрочены массово».
- Accessibility: цвет дополняется текстом и иконкой (не только цвет); контраст AA.

## 12. States
### Default
- Плашка нужного цвета и чек-лист из четырёх строк.
### Loading
- Скелетон плашки и четырёх строк.
### Empty
- «Данные compliance ещё не поступили».
### Error
- Сообщение + «Повторить».

## 13. Functional requirements
### FR1. Расчёт сводного состояния
- Description: вычислить итоговый цвет на основе четырёх проверок.
- Rules: red, если хотя бы одна из N3/N4 = false; amber, если все N3/N4 = true, но N5 или N7 имеют предупреждения; green иначе.
- Validation: запрещены неизвестные значения; неизвестное → red как fail-safe.

### FR2. Чек-лист
- Description: отрисовать четыре строки с per-check статусом.
- Rules: каждая строка имеет независимую иконку и текст.

### FR3. Состояния
- Description: default/loading/empty/error реализованы.

### FR4. Аналитика
- Description: событие `admin_compliance_summary_viewed` при первом рендере, с полем `complianceState`.

## 14. Definition of Done
- Один сводный индикатор виден на экране роллаута.
- Чек-лист N3/N4/N5/N7 явно отрисован.
- Цветовое состояние подкреплено текстом и иконкой.
- Все четыре стейта реализованы.
- Никаких пациентских данных.

## 15. Suggested analytics events
| Event | Trigger | Properties | Success signal |
|-------|---------|------------|----------------|
| admin_compliance_summary_viewed | Рендер блока. | actor_role, complianceState | Внимание к compliance измеримо. |
| admin_compliance_check_focused | Hover/focus по строке проверки. | check_id (N3/N4/N5/N7) | Видимость конкретных проверок измерима. |

## 16. Suggested implementation notes for Claude Code
- Suggested components/modules: `ComplianceSummary`, `ComplianceChecklistRow`, `StatusChip`.
- Suggested data objects:
  ```ts
  type ComplianceState = 'green' | 'amber' | 'red';
  interface ComplianceChecks {
    n3ConsentRecorded: boolean;
    n4ScopeDefined: boolean;
    n5AuditLogEnabled: boolean;
    n7ExpiryHealthy: boolean;
  }
  ```
- Mock data snippet:
  ```ts
  const complianceState: ComplianceState = 'amber';
  const checks: ComplianceChecks = {
    n3ConsentRecorded: true,
    n4ScopeDefined: true,
    n5AuditLogEnabled: true,
    n7ExpiryHealthy: false, // 8 доступов истекают в ближайшие 7 дней
  };
  ```
- Suggested state model: `idle | loading | ready | empty | error`.
- Implementation cautions: не маскировать red под amber; цвет всегда сопровождать текстом; не предлагать автоматических исправлений.

## 17. Suggested file role inside project
- Suggested path: docs/features/admin-dashboard/features/06-compliance-summary.md
- File role: spec для верхнего сводного индикатора compliance на экране роллаута.
- Related specs: 04-active-accesses-by-department, 05-revoke-expire-incidents.
- Ownership notes: продукт владеет правилами агрегации и копирайтом, инжиниринг — детерминированной логикой и аналитикой.
