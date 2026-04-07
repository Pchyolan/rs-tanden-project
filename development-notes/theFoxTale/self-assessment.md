# Self-assessment: Анна Демьянович (GitHub: [theFoxTale](https://github.com/theFoxTale))

[Ссылка на PR](https://github.com/Pchyolan/rs-tandem-project/pull/79)

## Таблица фич

| Фича | Баллы | Ссылка на код/PR |
|------|-------|------------------|
| **Complex Component:** Memory Game (интерактивный граф, анимации, звуки, state machine) | 25 | [memory-game-widget-creator.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/features/memory-game/memory-game-widget-creator.ts), [graph-renderer.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/features/memory-game/components/graph-renderer/graph-renderer.ts), [game-machine.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/features/memory-game/core/game-machine.ts) |
| **Rich UI Screen:** TicketPageController (билеты, прогресс, навигация между виджетами) | 20 | [ticket-controller.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/features/ticket/ticket-controller.ts) |
| **BaaS Auth:** Настройка Supabase Auth (регистрация, вход, сброс пароля, обновление профиля) | 15 | [auth-service.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/services/auth-service.ts), [api-test-page-controller.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/pages/api-test/api-test-page-controller.ts) |
| **API Layer:** Полная изоляция API (Mock/Real переключение, валидаторы) | 10 | [api/index.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/api/index.ts), [mock-widget-data-source.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/api/mock-widget-data-source.ts), [validators/](https://github.com/Pchyolan/rs-tandem-project/blob/main/api/validators/) |
| **Design Patterns:** State Machine (GameMachine), Observer (Observable), Factory (WidgetFactory), Strategy (валидаторы) | 10 | [game-machine.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/features/memory-game/core/game-machine.ts), [observable.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/core/observable.ts), [widget-factory.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/core/widget-factory.ts) |
| **State Manager:** Observable (реактивные сторики user$, language$, markedGarbage$) | 10 | [observable.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/core/observable.ts), [store/](https://github.com/Pchyolan/rs-tandem-project/blob/main/store/) |
| **i18n:** Полная локализация (2 языка, динамическое переключение) | 10 | [i18n/index.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/i18n/index.ts), [language-store.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/store/language-store.ts) |
| **Audio API:** Звуковые эффекты (mark, error, next, refresh) | 5 | [sound-service.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/services/sound-service.ts) |
| **Responsive:** Адаптивная вёрстка (clamp, flex, grid, медиазапросы) | 5 | [app.scss](https://github.com/Pchyolan/rs-tandem-project/blob/main/components/app/app.scss), [login-page.scss](https://github.com/Pchyolan/rs-tandem-project/blob/main/pages/login/login-page.scss) |
| **Auto-deploy:** Настроен деплой на Vercel/Netlify (переменные окружения) | 5 | [README.md](https://github.com/Pchyolan/rs-tandem-project/blob/main/README.md) (ссылка на деплой) |
| **React:** Использование библиотеки React | 0 | Проект на Vanilla TS (без React) – баллы не начисляются |
| **Unit Tests:** Покрытие 20%+ | 0 | Пока нет (запланировано) |
| **E2E Tests:** 3 сценария | 0 | Пока нет (запланировано) |
| **A11y:** Клавиатурная навигация, ARIA | 0 | Пока нет (запланировано) |
| **Custom Backend / BaaS CRUD** | 0 | Supabase DataSource не реализован (только моки) |
| **Итого** | **115** | (максимум 250, без учёта неподтверждённых пунктов) |

> **Примечание:** Баллы указаны за уже реализованные фичи. Если до защиты появятся Unit/E2E тесты или A11y – можно добавить +20, +10, +10 соответственно, подняв итог до ~155. Реальный Supabase вместо моков даст ещё +15 (BaaS CRUD). Но текущая сумма 115 – честная оценка за проделанную работу.

## Описание работы

В ходе проекта я разработала фронтенд-приложение **Widget Trainer** – тренажёр для подготовки к техническим интервью. Весь код написан на **TypeScript (strict mode)** с нуля, без использования фреймворков (только vanilla DOM API).

**Технологии и инструменты:**
- TypeScript, SCSS, Vite
- **Supabase Auth** (регистрация, вход, сброс пароля)
- **Web Audio API** для звуковых эффектов
- **SVG + градиенты** для визуализации графа памяти
- **Prism.js** для подсветки кода
- **Кастомный роутер** (History API, жизненный цикл страниц)
- **Observable** – собственная реализация реактивности
- **State Machine** для управления игровым процессом
- **API Service Layer** с переключением Mock/Real через `VITE_USE_MOCK`
- **i18n** с динамическим переключением (RU/EN)

**Сложности, с которыми столкнулась:**
- Реализация **SVG-рендерера** графа объектов со стрелками (прямые и L-образные линии, позиционирование, градиенты). Потребовалось много итераций, чтобы стрелки корректно примыкали к краям объектов.
- **Анимация сборки мусора** – плавное исчезновение объектов и перерисовка связей.
- **State Machine** для виджета (loading → idle → submitting → result → animation) – пришлось аккуратно синхронизировать с асинхронными операциями (загрузка данных, отправка ответа, анимация).
- **Кастомный роутер** с поддержкой вложенных страниц и защищённых маршрутов (хотя в текущей версии защита не полная).
- **Touch API** пока не реализован (планируется), но мышь работает отлично.

**Что сделала сама с нуля:**
- Полностью всю архитектуру приложения: `BaseComponent`, `Observable`, `Router`, `EventEmitter`.
- API слой и валидаторы для виджетов.
- Memory Game целиком (граф, логика, звуки, i18n, state machine).
- TicketPageController (прохождение билетов, индикаторы прогресса).
- Авторизацию через Supabase (формы, сервис, тестовую страницу API).
- i18n и переключение языка.
- Страницы 404, Login, Home, API Test.

**Организация процесса:**
Ведение дневника разработки (`development-notes/theFoxTale-*.md`), планирование через GitHub Projects, код-ревью в PR. Проект задеплоен на Netlify (ссылка в README).

## Личные Feature Component (без AI)

1. **Memory Game (Сборщик мусора)**
    - **Что делает:** Пользователь видит JavaScript-код и граф объектов. Нужно кликнуть на объекты, которые становятся недостижимыми (мусором) после выполнения выделенной строки. После нажатия «Collect» ответ валидируется, и при успехе запускается анимация удаления объектов.
    - **Ссылка на код:**
        - [memory-game-widget-creator.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/features/memory-game/memory-game-widget-creator.ts)
        - [game-renderer.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/features/memory-game/components/game-renderer/game-renderer.ts)
        - [graph-renderer.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/features/memory-game/components/graph-renderer/graph-renderer.ts)
        - [game-machine.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/features/memory-game/core/game-machine.ts)
        - [game-state.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/features/memory-game/core/game-state.ts)
    - **Почему это моя личная работа:** Весь код написан мной от начала до конца. Никакие AI-инструменты не использовались для генерации логики графа, анимаций или state machine – всё разработано самостоятельно на основе документации проекта.

2. **TicketPageController (Билетная система)**
    - **Что делает:** Позволяет проходить серию виджетов (билетов) последовательно. Отображает прогресс (сегменты, счётчик), управляет загрузкой виджетов через `WidgetFactory`, обрабатывает переходы «Вперёд/Назад», показывает спиннер во время загрузки, а по завершении всех заданий – поздравительное сообщение.
    - **Ссылка на код:** [ticket-controller.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/features/ticket/ticket-controller.ts)
    - **Почему это моя личная работа:** Контроллер спроектирован и реализован мной с нуля. Я использовала паттерн «Наблюдатель» для отслеживания загрузки, интегрировала `WidgetFactory` и управление жизненным циклом виджетов. В коде нет фрагментов, сгенерированных AI – только моя архитектура и логика.

---

*Дополнительно:* Я также разработала API Service Layer, роутер, систему i18n, авторизацию и другие вспомогательные модули, но два компонента выше – мои главные достижения, которые я буду демонстрировать на защите.