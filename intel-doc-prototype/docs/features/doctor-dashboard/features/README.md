# Feature Specs Index

## Source
- File: /Users/egordranev/Documents/IntelDoc/product/input/d_dashboard_feature_table.md
- Processed at: 2026-04-22
- Total detected: 25
- Total generated: 25
- Total skipped: 0

## Generated Specs
| # | Source ID | Feature | Area | Priority | Status | File |
|---|-----------|---------|------|----------|--------|------|
| 1 | row 1 | Список старых анализов | Старые анализы | Must-have | generated | product/features/doctor-dashboard/01-old-analyses-list.md |
| 2 | row 2 | Карточка старого анализа | Старые анализы | Must-have | generated | product/features/doctor-dashboard/02-old-analysis-card.md |
| 3 | row 3 | Фильтрация старых анализов по периоду | Старые анализы | Should-have | generated | product/features/doctor-dashboard/03-old-analyses-period-filter.md |
| 4 | row 4 | Поиск по названию / типу анализа | Старые анализы | Should-have | generated | product/features/doctor-dashboard/04-old-analyses-name-type-search.md |
| 5 | row 5 | План новых анализов от врача | План новых анализов | Must-have | generated | product/features/doctor-dashboard/05-doctor-new-analysis-plan.md |
| 6 | row 6 | Список новых анализов | План новых анализов | Must-have | generated | product/features/doctor-dashboard/06-new-analyses-list.md |
| 7 | row 7 | Статусы новых анализов | План новых анализов | Must-have | generated | product/features/doctor-dashboard/07-new-analysis-statuses.md |
| 8 | row 8 | Загрузка результата по назначенному анализу | План новых анализов | Must-have | generated | product/features/doctor-dashboard/08-assigned-analysis-result-upload.md |
| 9 | row 9 | Привязка результата к пункту плана | План новых анализов | Must-have | generated | product/features/doctor-dashboard/09-result-to-plan-item-linking.md |
| 10 | row 10 | Агрегация новых анализов в досье | План новых анализов | Must-have | generated | product/features/doctor-dashboard/10-new-analyses-dossier-aggregation.md |
| 11 | row 11 | Чеклист документов для подготовки | Подготовка документов | Must-have | generated | product/features/doctor-dashboard/11-document-preparation-checklist.md |
| 12 | row 12 | Загрузка документов | Подготовка документов | Must-have | generated | product/features/doctor-dashboard/12-document-upload.md |
| 13 | row 13 | Статус готовности документов | Подготовка документов | Must-have | generated | product/features/doctor-dashboard/13-document-readiness-status.md |
| 14 | row 14 | ОМС | Подготовка документов | Should-have | generated | product/features/doctor-dashboard/14-oms-document.md |
| 15 | row 15 | Направление от другого ЛПУ | Подготовка документов | Should-have | generated | product/features/doctor-dashboard/15-external-lpu-referral.md |
| 16 | row 16 | Отображение жалоб | Жалобы | Must-have | generated | product/features/doctor-dashboard/16-complaints-display.md |
| 17 | row 17 | Теги / категории жалоб | Жалобы | Must-have | generated | product/features/doctor-dashboard/17-complaint-tags-categories.md |
| 18 | row 18 | Редактирование актуальных жалоб | Жалобы | Should-have | generated | product/features/doctor-dashboard/18-current-complaints-editing.md |
| 19 | row 19 | Блок "какие еще врачи могут понадобиться" | Запись к другим врачам для подготовки | Must-have | generated | product/features/doctor-dashboard/19-additional-doctors-needed-block.md |
| 20 | row 20 | Список / выбор других врачей | Запись к другим врачам для подготовки | Must-have | generated | product/features/doctor-dashboard/20-other-doctors-list-selection.md |
| 21 | row 21 | Запись к другому врачу | Запись к другим врачам для подготовки | Must-have | generated | product/features/doctor-dashboard/21-book-other-doctor.md |
| 22 | row 22 | Связка "подготовительный визит -> основной врач" | Запись к другим врачам для подготовки | Must-have | generated | product/features/doctor-dashboard/22-preparatory-visit-main-doctor-link.md |
| 23 | row 23 | Состояние "основная запись отсутствует" | Запись к основному врачу | Must-have | generated | product/features/doctor-dashboard/23-main-appointment-absent-state.md |
| 24 | row 24 | Запись к основному врачу | Запись к основному врачу | Must-have | generated | product/features/doctor-dashboard/24-book-main-doctor.md |
| 25 | row 25 | Переход из подготовки в запись | Запись к основному врачу | Must-have | generated | product/features/doctor-dashboard/25-preparation-to-booking-transition.md |

## Skipped / Unclear Items
| Source reference | Reason | Suggested next step |
|------------------|--------|---------------------|
| None | No rows skipped; every table row had clear feature intent. | Run feature-review separately if review artifacts are required. |

## Extraction Warnings
- Source is derived from a handwritten board image and normalized into a markdown feature table; exact visual UI, backend schema, operational partner flow, and copy are not defined.
- The source table scope says patient app MVP dashboard / preparation journey, while the requested output folder is `doctor-dashboard`; generated specs preserve the patient-dashboard source behavior and do not reinterpret it as doctor-side cockpit functionality.
- Feature names and epic flows are in Russian; filenames use English kebab-case slugs while each spec preserves the original source feature name and row fields.
- No source row defines external EHR, lab, insurance, LPU, or live scheduling integrations. These are marked as future dependency / out of scope for MVP unless explicitly approved.
- Booking-related rows are treated as pilot-safe internal booking requests or partner handoffs, not direct external scheduling integrations.
- Document and analysis rows distinguish original uploaded files from structured/extracted metadata.
- Complaint and doctor-preparation rows avoid diagnostic, prescription, treatment-decision, urgency-ranking, and medical certainty language.
