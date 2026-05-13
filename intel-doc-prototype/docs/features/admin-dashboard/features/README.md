# Feature Specs Index — Admin Dashboard

## Source
- File: Фичи.csv (rows ADM-E01-F01 … ADM-E02-F03)
- Processed at: 2026-04-25
- Total detected: 6
- Total generated: 6
- Total skipped: 0

## Generated Specs
| # | Source ID | Feature | Area | Priority | Status | File |
|---|-----------|---------|------|----------|--------|------|
| 1 | ADM-E01-F01 | KPI-карточки пилота | ADM-E01 Мониторинг адопшна и KPI пилота | Must-have | generated | docs/features/admin-dashboard/features/01-kpi-cards.md |
| 2 | ADM-E01-F02 | Тренд KPI по периоду | ADM-E01 Мониторинг адопшна и KPI пилота | Must-have | generated | docs/features/admin-dashboard/features/02-period-trend.md |
| 3 | ADM-E01-F03 | Drill-down заглушка по KPI | ADM-E01 Мониторинг адопшна и KPI пилота | Must-have | generated | docs/features/admin-dashboard/features/03-drill-down-placeholder.md |
| 4 | ADM-E02-F01 | Активные доступы по отделениям | ADM-E02 Контроль роллаута и состояния доступов | Must-have | generated | docs/features/admin-dashboard/features/04-active-accesses-by-department.md |
| 5 | ADM-E02-F02 | Инциденты revoke / expire | ADM-E02 Контроль роллаута и состояния доступов | Must-have | generated | docs/features/admin-dashboard/features/05-revoke-expire-incidents.md |
| 6 | ADM-E02-F03 | Сводный индикатор compliance | ADM-E02 Контроль роллаута и состояния доступов | Must-have | generated | docs/features/admin-dashboard/features/06-compliance-summary.md |

## Skipped / Unclear Items
| Source reference | Reason | Suggested next step |
|------------------|--------|---------------------|
| None | Все 6 ADM-строк имели понятный feature intent. | Запустить feature-review отдельно при необходимости. |

## Extraction Warnings
- Источник — таблица ADM-фич Фичи.csv (эпики ADM-E01 «Мониторинг адопшна и KPI пилота», ADM-E02 «Контроль роллаута и состояния доступов»); точная визуальная UI, бэкенд-схема, операционные процессы не определены.
- Все спецификации описывают только админ-поверхность пилота ЭНЦ; пациентские и врачебные поверхности здесь не затрагиваются.
- Имена файлов используют английский kebab-case; внутри спецификаций сохраняются исходные русские названия фич и подписи.
- Никакие внешние интеграции (EHR, LIS, BI) не подразумеваются; данные приходят из локального мок-стора.
- Пороги «expiring soon», «аномалии», «green/amber/red» оставлены как открытые продуктовые решения с явными MVP-дефолтами.
- N3/N4/N5/N7 явно перечислены в спецификациях, относящихся к доступам и compliance: N3 — версионирование согласия и временна́я метка, N4 — явная область доступа, N5 — журнал событий доступа, N7 — длительность и срок истечения доступа.
- Админ-поверхность строго aggregate-only: ФИО, id и любые персональные пациентские записи не отображаются.
