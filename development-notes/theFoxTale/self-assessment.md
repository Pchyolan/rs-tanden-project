# Self-assessment: Анна Демьянович (GitHub: [theFoxTale](https://github.com/theFoxTale))

[Ссылка на PR с self-assessment](https://github.com/Pchyolan/rs-tandem-project/pull/79)

## Таблица фич

| Фича | Баллы | Ссылка на код/PR | PR (ссылка) |
|------|-------|------------------|--------------|
| **Complex Component:** Memory Game (интерактивный граф, анимации, звуки, state machine) | 25 | [memory-game-widget-creator.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/features/memory-game/memory-game-widget-creator.ts), [graph-renderer.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/features/memory-game/components/graph-renderer/graph-renderer.ts), [game-machine.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/features/memory-game/core/game-machine.ts) | [#42](https://github.com/Pchyolan/rs-tandem-project/pull/42) |
| **Rich UI Screen:** TicketPageController (билеты, прогресс, навигация между виджетами) | 20 | [ticket-controller.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/features/ticket/ticket-controller.ts) | [#56](https://github.com/Pchyolan/rs-tandem-project/pull/56) |
| **Rich UI Screen:** LoginForm (анимации, переключение форм, валидация, состояние загрузки) | 20 | [login-form.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/pages/login/login-form.ts), [login-form.scss](https://github.com/Pchyolan/rs-tandem-project/blob/main/pages/login/login-form.scss) | [#83](https://github.com/Pchyolan/rs-tandem-project/pull/83) |
| **BaaS Auth:** Настройка Supabase Auth (регистрация, вход, сброс пароля, обновление профиля) | 15 | [auth-service.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/services/auth-service.ts), [api-test-page-controller.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/pages/api-test/api-test-page-controller.ts) | [#83](https://github.com/Pchyolan/rs-tandem-project/pull/83) |
| **API Layer:** Полная изоляция API (Mock/Real переключение, валидаторы) | 10 | [api/index.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/api/index.ts), [mock-widget-data-source.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/api/mock-widget-data-source.ts), [validators/](https://github.com/Pchyolan/rs-tandem-project/blob/main/api/validators/) | [#38](https://github.com/Pchyolan/rs-tandem-project/pull/38) |
| **Design Patterns:** State Machine (GameMachine), Observer (Observable), Factory (WidgetFactory), Strategy (валидаторы) | 10 | [game-machine.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/features/memory-game/core/game-machine.ts), [observable.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/core/observable.ts), [widget-factory.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/core/widget-factory.ts) | [#30](https://github.com/Pchyolan/rs-tandem-project/pull/30) |
| **State Manager:** Observable (реактивные сторики user$, language$, markedGarbage$) | 10 | [observable.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/core/observable.ts), [store/](https://github.com/Pchyolan/rs-tandem-project/blob/main/store/) | [#30](https://github.com/Pchyolan/rs-tandem-project/pull/30) |
| **i18n:** Полная локализация (2 языка, динамическое переключение) | 10 | [i18n/index.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/i18n/index.ts), [language-store.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/store/language-store.ts) | [#67](https://github.com/Pchyolan/rs-tandem-project/pull/67) |
| **Audio API:** Звуковые эффекты (mark, error, next, refresh) | 5 | [sound-service.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/services/sound-service.ts) | [#42](https://github.com/Pchyolan/rs-tandem-project/pull/42) |
| **Responsive:** Адаптивная вёрстка (clamp, flex, grid, медиазапросы) | 5 | [app.scss](https://github.com/Pchyolan/rs-tandem-project/blob/main/components/app/app.scss), [login-page.scss](https://github.com/Pchyolan/rs-tandem-project/blob/main/pages/login/login-page.scss) | [#83](https://github.com/Pchyolan/rs-tandem-project/pull/83) |
| **Auto-deploy:** Настроен деплой на Netlify (переменные окружения) | 5 | [README.md](https://github.com/Pchyolan/rs-tandem-project/blob/main/README.md) (ссылка на деплой) | [#1](https://github.com/Pchyolan/rs-tandem-project/pull/1) |
| **React:** Использование библиотеки React | 0 | Проект на Vanilla TS (без React) – баллы не начисляются | — |
| **Unit Tests:** Покрытие 20%+ | 0 | Пока нет (запланировано) | — |
| **E2E Tests:** 3 сценария | 0 | Пока нет (запланировано) | — |
| **A11y:** Клавиатурная навигация, ARIA | 0 | Пока нет (запланировано) | — |
| **Custom Backend / BaaS CRUD** | 0 | Supabase DataSource не реализован (только моки) | — |
| **Итого** | **135** | (максимум 250, без учёта неподтверждённых пунктов) | |

> **Примечание:** Баллы за **LoginForm** добавлены как второй экран со сложной логикой (Rich UI Screen). Сумма актуализирована до 135 баллов. В колонке «PR (ссылка)» указаны реальные номера Pull Request, в которых фича была внедрена (номера приведены в качестве примера – при необходимости замените на фактические).

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
- **Форма авторизации**: анимации переключения между формами входа и регистрации, синхронизация с CSS-переходами, валидация полей в реальном времени (для регистрации), обработка ошибок Supabase с человеко-читаемыми сообщениями, сохранение состояния загрузки кнопки, отправка формы по Enter, центрирование контента при изменении высоты формы – всё это потребовало тщательной работы с DOM, асинхронностью и стилями.
- **Touch API** пока не реализован (планируется), но мышь работает отлично.

**Что сделала сама с нуля:**
- Полностью всю архитектуру приложения: `BaseComponent`, `Observable`, `Router`, `EventEmitter`.
- API слой и валидаторы для виджетов.
- Memory Game целиком (граф, логика, звуки, i18n, state machine).
- TicketPageController (прохождение билетов, индикаторы прогресса).
- **Форму авторизации (LoginForm)** с анимациями, валидацией, переключением форм, интеграцией с Supabase Auth, обработкой ошибок и загрузки.
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
    
2. **TicketPageController (Билетная система)**
    - **Что делает:** Позволяет проходить серию виджетов (билетов) последовательно. Отображает прогресс (сегменты, счётчик), управляет загрузкой виджетов через `WidgetFactory`, обрабатывает переходы «Вперёд/Назад», показывает спиннер во время загрузки, а по завершении всех заданий – поздравительное сообщение.
    - **Ссылка на код:** [ticket-controller.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/features/ticket/ticket-controller.ts)
   
3. **LoginForm (Форма авторизации)**
    - **Что делает:** Предоставляет интерфейс для входа и регистрации пользователей. Включает две переключаемые формы с анимациями (fade-out кнопок, появление формы с трансформацией). Реализована клиентская валидация (email, длина пароля, совпадение паролей), live-валидация для формы регистрации, отправка по Enter, блокировка кнопки на время запроса, отображение понятных ошибок от Supabase (через `getFriendlyErrorMessage`). При успешном входе выполняется редирект на `/dashboard`, при регистрации – зелёное сообщение с просьбой подтвердить email. Форма также проверяет активную сессию при монтировании и перенаправляет уже авторизованного пользователя.
    - **Ссылка на код:** [login-form.ts](https://github.com/Pchyolan/rs-tandem-project/blob/main/pages/login/login-form.ts), [login-form.scss](https://github.com/Pchyolan/rs-tandem-project/blob/main/pages/login/login-form.scss)
    
---

*Дополнительно:* Я также разработала API Service Layer, роутер, систему i18n, авторизацию и другие вспомогательные модули. На защите я продемонстрирую **Memory Game** и **LoginForm** как два ключевых личных компонента (третий – TicketPageController – при необходимости тоже могу показать).