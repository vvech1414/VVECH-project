# CLAUDE.md — IntelDoc Educational Defense Project

> Контекст для Claude Code. Читать первым в каждой новой сессии.
> Strategic content: Russian. Technical (commands, file names, code): English.

---

## 0. Tooling Roles (важно понимать перед стартом)

В этом проекте используются **два разных AI-инструмента** с чётким разделением ролей. Не путать.

### Claude Design (`claude.ai/design`) — Дизайн-аналитик
- **Что делает:** извлекает design system из кодбейза, визуально работает с компонентами, **предлагает доработки** где система неполная
- **Когда вызывается:** вручную пользователем, не Claude Code
- **Output:** `tokens.json`, `components.md`, `patterns.md` (пользователь сохраняет в `docs/design-system/`)
- **Сильная сторона:** визуальное понимание дизайн-системы как целого

### Claude Code (этот инструмент) — Технический исполнитель
- **Что делает:** работает с Git-репо, читает код, заполняет `docs/`, имплементирует изменения в коде, деплоит
- **Когда вызывается:** через терминал, агентский режим
- **Output:** обновления в `src/` и `docs/`, deployment на Vercel
- **Сильная сторона:** автономная работа с файловой системой и кодом

**Главное правило:** Claude Code **не делает** design system extraction самостоятельно. Эта роль закреплена за Claude Design. Claude Code **готовит почву** до extraction и **внедряет результаты** после.

---

## 1. Read-First Protocol for Claude Code

**При первом запуске в этом репозитории выполни в указанном порядке:**

1. Прочитай этот файл целиком.
2. Прочитай все файлы в `docs/` в порядке нумерации (01 → 05).
3. Проверь наличие `src/` (см. Section 2 — Git Setup). Если папка пустая или отсутствует — обратись к пользователю для настройки доступа к GitHub-репо.
4. После клонирования — просканируй `src/` и сверь с описаниями в `docs/`.
5. **Найди все метки `[VERIFY_WITH_CODE]` в `docs/`** и замени их фактами из кода.
6. **Найди все метки `[FILL_IN]`, `[USER_DECISION_NEEDED]`, `[USER_INPUT]`** и собери их в один список для запроса автору.
7. Создай `docs/design-system/current-state.md` — сводку того, что уже есть в коде на момент стартовой точки (см. Section 4 Track B — шаг 2).
8. Сообщи краткий отчёт: что подтверждено, что обновлено, какие противоречия, какие вопросы к автору.

---

## 2. Git Setup (Первая сессия)

Код IntelDoc находится в GitHub-репозитории. При первом запуске Claude Code должен:

1. Запросить у пользователя:
   - URL репозитория (HTTPS или SSH)
   - Ветку для работы (обычно `main` или `develop`)
   - Способ авторизации: SSH-ключ уже настроен? Используется ли `gh` CLI? Personal Access Token?

2. Клонировать репозиторий **в эту же директорию** (где лежит CLAUDE.md):
   ```bash
   # Если репо клонируется как подпапка
   git clone <repo-url> intel-doc-prototype
   
   # ИЛИ если CLAUDE.md и docs/ должны лежать ВНУТРИ репозитория
   # — переместить CLAUDE.md и docs/ в существующий репо после клонирования
   ```

3. Подтвердить структуру с пользователем перед изменением файлов.

4. Установить зависимости и запустить локально для проверки:
   ```bash
   cd intel-doc-prototype
   npm install
   npm run dev
   ```

5. Только после успешного запуска — переходить к Read-First Protocol.

---

## 3. Project Context

**Что это:** защита выпускного проекта **IntelDoc** в рамках ДПП **HINC SANITAS** ("Основы дизайна и разработки медицинских сервисов на JavaScript").

**IntelDoc (текущий scope защиты):**
- **Только Patient App** — пациентское React-приложение
- Domain: эндокринологическая клиника (на публичной защите — "Клиника N")
- Направление по шаблону HINC SANITAS: **лечебное дело**
- Источник истины — код в GitHub-репо

**Out of scope:** Doctor dashboard, Admin panel, Analytics/BI

---

## 4. Three-Track Workflow

### Track A — Clickable Prototype (Claude Code)
- Клонирование репо и проверка работоспособности
- Доводка 2–3 сквозных сценариев pa journey:
  - Онбординг и consent на 152-ФЗ
  - Загрузка медицинского документа → OCR → preview
  - Consent-flow для передачи документа врачу
- Имплементация изменений из Track B (что Claude Design предложил доделать)
- Деплой на Vercel → внешняя ссылка для защиты

### Track B — Design System Extraction (гибрид Claude Code + Claude Design)

**Шаг 1 (Claude Code):** инвентаризация текущего состояния
- Прочитать весь `src/`
- Создать `docs/design-system/current-state.md` со списком:
  - Все компоненты (имя, путь, props, варианты)
  - Все CSS-переменные / Tailwind tokens / inline-стили
  - Layout patterns по страницам
- Этот файл — **input для Claude Design**, чтобы он не работал вслепую

**Шаг 2 (Ты вручную):** запуск Claude Design
- Открыть `claude.ai/design`
- Загрузить репозиторий (или ключевые файлы кода)
- Прогнать Prompt 1 (см. Section 10)
- Получить output: `tokens.json` + `components.md` + `patterns.md`
- Сохранить в `docs/design-system/`
- **Если Claude Design предлагает доработки** (например, "не хватает токенов для error states, не хватает варианта компонента Button для consent") — зафиксировать список в `docs/design-system/proposed-changes.md`

**Шаг 3 (Claude Code):** имплементация доработок
- Прочитать `docs/design-system/proposed-changes.md`
- Имплементировать изменения в коде (новые токены в CSS variables, новые варианты компонентов)
- Закоммитить с понятным сообщением
- Обновить `docs/design-system/current-state.md` под новый статус

**Шаг 4 (Ты вручную):** генерация Figma-файла
- Открыть обычный Claude (этот чат) с подключённым Figma MCP
- Прогнать Prompt 2 (см. Section 10)
- Получить Figma-файл с 3 страницами (Design System / Screens / User Flow)
- Финальная доводка вручную (~1–2 часа)

**Шаг 5 (Claude Code):** скриншоты для презентации
- После Vercel-деплоя сделать screenshots для слайдов 07-08 (desktop 1440×900 + mobile 390×844)
- Сохранить в `prototypes/figma-export/`

### Track C — Presentation (Claude Code как помощник)
- Структура слайдов — в `docs/05-presentation.md`
- Claude Code: заполнить все `[FILL_IN]` и `[VERIFY_WITH_CODE]` после первой итерации
- Финальная сборка PPTX по шаблону HINC SANITAS — пользователь вручную (template-driven)

---

## 5. Documentation Map

Полные спецификации в `docs/`:

| Файл | Содержание | Когда читать |
|---|---|---|
| `docs/01-scope-and-vision.md` | Scope, vision, value proposition, initiatives | Всегда первым |
| `docs/02-jtbd.md` | JTBD (functional/social/emotional) | Перед работой над фичей или User Story |
| `docs/03-requirements.md` | Функциональные + нефункциональные требования | Перед изменением кода или UI |
| `docs/04-constraints-and-metrics.md` | Ограничения, регуляторика, метрики | При планировании архитектуры |
| `docs/05-presentation.md` | Маппинг шаблона HINC SANITAS (12 слайдов) | При работе над Track C |
| `docs/design-system/current-state.md` | Создаётся Claude Code на шаге 1 Track B | После первого сканирования кода |
| `docs/design-system/tokens.json` | Output Claude Design | После шага 2 Track B |
| `docs/design-system/components.md` | Output Claude Design | После шага 2 Track B |
| `docs/design-system/patterns.md` | Output Claude Design | После шага 2 Track B |
| `docs/design-system/proposed-changes.md` | Доработки от Claude Design (если есть) | Между шагами 2 и 3 Track B |

---

## 6. Tech Stack & Tools

### Codebase
- **Frontend:** React (`[VERIFY_WITH_CODE]` — версия, TypeScript, framework)
- **Language:** JavaScript (обязательно по программе ДПП)
- **Deployment:** Vercel
- **IDE для пользователя:** Antigravity (с Gemini 3 Pro) — но Claude Code работает через CLI

### Design Workflow Stack
- **Claude Design** (`claude.ai/design`) — primary extraction tool + дизайн-доработки
- **Claude Code** — Git operations, code changes, deployment
- **Figma MCP** в обычном Claude — финальная Figma-сборка
- **Anima / html.to.design** — fallback мосты в Figma если основной путь не сработает

### НЕ использовать
- Claude Code для design system extraction (это роль Claude Design)
- Прямой "Export to Figma" из Claude Design (фичи нет)
- Технологии вне JavaScript-экосистемы (нарушит требование программы)

---

## 7. Conventions

### Language Split
- Strategic / project / docs: **Russian**
- Code, commits, file names, commands: **English**
- User-facing UI strings: **Russian**
- Slide content: **Russian** (требование шаблона HINC SANITAS)
- Component names, props, comments: **English**

### File Structure (ожидаемая после клонирования репо)
```
/
├── CLAUDE.md
├── README.md
├── intel-doc-prototype/             # cloned Git repo
│   ├── src/                         # React patient app
│   ├── package.json
│   └── ...
├── docs/
│   ├── 01-scope-and-vision.md
│   ├── 02-jtbd.md
│   ├── 03-requirements.md
│   ├── 04-constraints-and-metrics.md
│   ├── 05-presentation.md
│   └── design-system/
│       ├── current-state.md         # by Claude Code (Track B step 1)
│       ├── tokens.json              # by Claude Design (Track B step 2)
│       ├── components.md            # by Claude Design (Track B step 2)
│       ├── patterns.md              # by Claude Design (Track B step 2)
│       └── proposed-changes.md      # by Claude Design (optional)
├── presentation/
│   ├── template.pptx                # HINC SANITAS template
│   └── final.pdf
└── prototypes/
    └── figma-export/                # screenshots для слайдов 07-08
```

---

## 8. Skills Available

В этом репо доступны skills (через `/mnt/skills/user/`):

| Skill | Когда использовать |
|---|---|
| `epic-scope` | Драфт/доработка initiatives и epics (для слайда 02) |
| `information-architecture` | Структура patient app, навигация, user flow (слайд 06) |
| `design-tokens` | Track B шаг 1 — инвентаризация tokens из React-кода |
| `design-brief` | Если нужно зафиксировать дизайн-направление перед Claude Design |
| `design-review` | QA-пасс по Figma-файлу перед защитой |
| `frontend-design` | Доводка React-экранов в Track A |
| `project-brief` | Финальный SOW для портфолио (опционально) |
| `market-research` | Конкурентный анализ для слайда 03 |

---

## 9. Key Commands

```bash
# Git setup (первая сессия)
git clone <repo-url> intel-doc-prototype
cd intel-doc-prototype

# Dev
npm install
npm run dev
npm run build
npm run lint
npm run typecheck

# Deploy
vercel                              # preview
vercel --prod                       # production → внешняя ссылка для защиты
```

---

## 10. Prompts Library

### Prompt 1 — Design System Extraction (для Claude Design, **ручной запуск**)
```
Analyze this React codebase (IntelDoc — patient app for endocrinology clinic).
Extract a complete design system AND identify gaps.

1. Design tokens — colors, typography, spacing, border-radius, shadows.
   Output as JSON (Tokens Studio compatible).

2. Components catalog — for each component:
   - Name, file path
   - Props with types
   - All variants and states
   - Usage frequency across the codebase

3. Layout patterns — recurring page-level compositions.

4. Rationale — link variant existence to product context
   (e.g., "Button: consent variant exists because 152-FZ audit requires it").

5. GAPS & PROPOSED ADDITIONS — what's MISSING from the current system:
   - Missing tokens (e.g., no error state colors, no spacing for compact layouts)
   - Missing component variants (e.g., Button without disabled state)
   - Missing patterns (e.g., no consistent empty-state pattern)
   - For each gap: propose addition with rationale tied to medical patient app context

Output 4 files:
- tokens.json
- components.md
- patterns.md  
- proposed-changes.md (the gaps section)
```

### Prompt 2 — Figma File Generation (для Claude с Figma MCP, **ручной запуск**)
```
Using the attached design system (tokens.json + components.md + patterns.md),
create a Figma file with three pages:

1. "01 — Design System": tokens as Figma Styles + Variables,
   components as native Figma Components with variants and auto-layout.

2. "02 — Screens": rebuild 4–6 key IntelDoc patient screens.

3. "03 — User Flow": arrows connecting screens with action labels.

Use the Figma MCP connector.
```

### Prompt 3 — Slide Content Finalization (для Claude Code)
```
Использовать docs/05-presentation.md как шаблон.
Для каждого слайда (01-12) сгенерировать финальный контент,
заменив все [FILL_IN] и [VERIFY_WITH_CODE] placeholders
фактами из реального кода и проектного контекста.

Output: docs/05-presentation-final.md (с заполненным контентом)
```

---

## 11. First-Session Command (что сказать Claude Code в первый раз)

После размещения CLAUDE.md в директории, первая команда пользователя:

> *"Прочитай CLAUDE.md и выполни Read-First Protocol. Для шага 2 Git Setup — вот URL репозитория: [ВСТАВИТЬ_URL]. Авторизация: [SSH/HTTPS+token]. Ветка: [main/develop]."*

Claude Code дальше работает автономно до точки, где требуется решение от пользователя или нужно запустить Claude Design.

---

## 12. Defense-Day Checklist

За день до защиты:
- [ ] Vercel production URL стабильно работает (тест на 2 устройствах)
- [ ] Figma-файл доступен по share-ссылке (view-only)
- [ ] Презентация по шаблону HINC SANITAS в PDF
- [ ] Все 12 слайдов заполнены (без `*ВАШ ТЕКСТ*`)
- [ ] Направление на слайде 01: только "лечебное дело"
- [ ] Demo flow прорепетирован
- [ ] Готовы ответы на 5 ожидаемых вопросов:
  1. "Почему именно такие токены?" → нарратив из JTBD
  2. "Как валидировали требования?" → JTBD-интервью
  3. "Что бы сделали иначе?" → честный ретро
  4. "Как это масштабируется?" → 17 initiatives roadmap
  5. "Почему такой стек?" → JavaScript обязателен + AI-tools как ускоритель

---

## 13. Out of Scope / Don'ts

- Реальная интеграция с медицинскими API клиники
- Реальное название клиники-пилота на публичной защите — "Клиника N"
- Claude Code не делает design system extraction (это роль Claude Design)
- Рисование design system с нуля в Figma — extract-first
- 100% покрытие компонентов — достаточно 6–10 ключевых
- Doctor / admin функциональность — out of scope
- Технологии вне JavaScript-экосистемы

---

*Last updated: tooling roles clarified, Git workflow added, first-session command included.*
