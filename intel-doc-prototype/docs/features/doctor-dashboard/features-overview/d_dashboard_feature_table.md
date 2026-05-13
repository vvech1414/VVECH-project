# IntelDoc dashboard feature table

## Source
- Source image: `/Users/egordranev/Desktop/IntelDoc/pictures/d_dashboard.jpg`
- SOP: `/Users/egordranev/Downloads/inteldoc_feature_table_sop.md`
- Derived at: 2026-04-22

## Table purpose
- Scope logic: patient app MVP dashboard / preparation journey
- Primary user: patient
- Secondary stakeholder: doctor / clinic partner
- Main JTBD: prepare for an upcoming main doctor visit with relevant analyses, documents, complaints, and booking steps ready.
- Trigger: patient opens the IntelDoc dashboard before or after receiving a preparation plan.
- Desired outcome: patient understands what is already available, what is missing, and what actions are needed before the visit.

## Extraction notes
- The source is a handwritten board photo, so row names are normalized into implementation-reviewable feature names.
- The table follows the SOP columns: Epic, Epic Flow, Feature, Happy path, Priority.
- `Core` features are treated as `Must-have` when they are required for pilot value, controlled patient flow, doctor prep, or end-to-end usability.
- `Supporting` features are treated as `Should-have` when the main journey can still run without them.
- No heavy EHR, lab, insurance, or external scheduling integration is assumed.
- AI-related behavior is not inferred from the image; no diagnostic or treatment language is introduced.

## Feature table

| # | Epic | Epic Flow | Feature | Happy path | Priority |
|---|------|-----------|---------|------------|----------|
| 1 | Старые анализы | Пациент открывает историю анализов и использует ранее загруженные результаты для подготовки к основному приему. | Список старых анализов | Core | Must-have |
| 2 | Старые анализы | Пациент открывает конкретный анализ и видит его содержимое и контекст. | Карточка старого анализа | Core | Must-have |
| 3 | Старые анализы | Пациент быстро находит нужные анализы для подготовки. | Фильтрация старых анализов по периоду | Supporting | Should-have |
| 4 | Старые анализы | Пациент быстро находит нужные анализы для подготовки. | Поиск по названию / типу анализа | Supporting | Should-have |
| 5 | План новых анализов | Врач формирует план новых анализов, а пациент получает его в приложении. | План новых анализов от врача | Core | Must-have |
| 6 | План новых анализов | Пациент открывает план и видит, какие новые анализы нужно сдать. | Список новых анализов | Core | Must-have |
| 7 | План новых анализов | Пациент отслеживает выполнение плана подготовки. | Статусы новых анализов | Core | Must-have |
| 8 | План новых анализов | Пациент завершает пункт плана и добавляет результат анализа. | Загрузка результата по назначенному анализу | Core | Must-have |
| 9 | План новых анализов | Система связывает загруженный результат с соответствующим пунктом плана. | Привязка результата к пункту плана | Core | Must-have |
| 10 | План новых анализов | Новые результаты попадают в единый контур подготовки к визиту. | Агрегация новых анализов в досье | Core | Must-have |
| 11 | Подготовка документов | Пациент открывает раздел документов и понимает, что нужно подготовить до приема. | Чеклист документов для подготовки | Core | Must-have |
| 12 | Подготовка документов | Пациент добавляет обязательные документы. | Загрузка документов | Core | Must-have |
| 13 | Подготовка документов | Пациент видит, насколько пакет документов готов. | Статус готовности документов | Core | Must-have |
| 14 | Подготовка документов | Пациент хранит документ, который может понадобиться при визите. | ОМС | Supporting | Should-have |
| 15 | Подготовка документов | Пациент прикладывает внешний медицинский документ для подготовки к визиту. | Направление от другого ЛПУ | Supporting | Should-have |
| 16 | Жалобы | Пациент открывает блок жалоб и фиксирует текущее состояние перед приемом. | Отображение жалоб | Core | Must-have |
| 17 | Жалобы | Пациент структурирует свои жалобы в удобной форме. | Теги / категории жалоб | Core | Must-have |
| 18 | Жалобы | Пациент уточняет жалобы перед визитом. | Редактирование актуальных жалоб | Supporting | Should-have |
| 19 | Запись к другим врачам для подготовки | Пациент понимает, что до основного врача могут понадобиться дополнительные консультации. | Блок "какие еще врачи могут понадобиться" | Core | Must-have |
| 20 | Запись к другим врачам для подготовки | Пациент выбирает нужного смежного специалиста. | Список / выбор других врачей | Core | Must-have |
| 21 | Запись к другим врачам для подготовки | Пациент инициирует дополнительную консультацию. | Запись к другому врачу | Core | Must-have |
| 22 | Запись к другим врачам для подготовки | Пациент понимает, зачем подготовительный визит нужен в общем сценарии подготовки. | Связка "подготовительный визит -> основной врач" | Core | Must-have |
| 23 | Запись к основному врачу | Пациент видит, что основной записи еще нет. | Состояние "основная запись отсутствует" | Core | Must-have |
| 24 | Запись к основному врачу | Пациент инициирует запись к основному специалисту. | Запись к основному врачу | Core | Must-have |
| 25 | Запись к основному врачу | Пациент понимает, что запись является финальным шагом после подготовки. | Переход из подготовки в запись | Core | Must-have |

