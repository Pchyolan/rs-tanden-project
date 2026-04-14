# RS Tandem Project
## Приложение "Brainiac"

## 📖 Описание
```
A tiny web project fueled by coffee and optimism ☕️
We write code, occasionally debug, and mostly survive stage 2.  
```
«Байты памяти» — это интерактивная платформа, где вы тренируете мозг, проходя «билеты» с заданиями по JavaScript. Играйте в викторины, собирайте мусор в памяти, разбирайтесь с асинхронностью — и всё это в стильном космическом интерьере с анимированным мозгом-помощником.

Проект написан на TypeScript с собственной компонентной системой, реактивными `Observable`, роутером и полной локализацией (русский/английский). Бэкенд — Supabase (авторизация, хранение виджетов и прогресса).

## 🌱 Deploy & Demo
- [Deploy Link](https://tranquil-froyo-550c45.netlify.app/)  
- [Demo video](https://youtu.be/Vk_MvrETp9Q?si=R3sT1_7hyuWviuF4)  

## 🌟 JustBuildIt Team
- Pchyolan – [GitHub](https://github.com/pchyolan) - [Дневники](./development-notes/Pchyolan)
- Anna Demyanovich – [GitHub](https://github.com/thefoxtale) - [Дневники](./development-notes/theFoxTale) - [Self-assessment](./development-notes/theFoxTale/self-assessment.md)

**Чем гордимся:**
- 👻 **Мы выжили** - и даже кажется доползли до сдачи проекта, хотя было огромное желание бросить всё и сдаться.
- 🧠 **Живой граф памяти** — объекты, ссылки, анимация сборки мусора и интерактивное выделение.
- 🎛️ **Гибкая система виджетов** — фабрика и единый интерфейс для добавления новых типов заданий.
- 🌍 **Полная локализация** — динамическое переключение между русским и английским без перезагрузки.
- 🎨 **Кастомный дизайн** — все кнопки, панели, тултипы и блики сделаны вручную, без UI-библиотек.

## ⚙️ Технологический стек
- **Язык:** TypeScript
- **Сборщик:** Vite, хуки Husky на push и commit
- **Стили:** SCSS
- **Тестирование:** Vitest + Playwright
- **Линтер/форматтер:** ESLint с Unicorn, Prettier, Stylelint
- **База данных/аутентификация:** Supabase
- **CI / CD:** Git Actions + Netlify

## 🤹‍♀️ Kanban-доска разработки проекта
Все задачи, связанные с разработкой и развитием проекта, занесены на Kanban-доску - [ссылка](https://github.com/users/Pchyolan/projects/1/views/1).
![kanban-desc.png](docs/assets/kanban-desc.png)

## 📝 Записи встреч команды
Иногда мы встречаемся командой для обсуждения нашего проекта и ведём дневниковые записи наших встреч. Всё, что есть, лежит [тут](./docs/meeting-notes/index.md)

## Интересные PR с Code Review
На самом деле мы чаще всего обсуждали их на встречах голосом (так просто быстрее, а времени нам не хватало катастрофически), но кое-что есть в виде записей. Например:
- [Пример №1](./development-notes/Pchyolan/Pchyolan-2026-03-17.md)
- [Пример №2](./development-notes/Pchyolan/Pchyolan-2026-03-30.md)
- [Пример №3](./development-notes/Pchyolan/Pchyolan-2026-03-31.md)
- [Пример №4](https://github.com/Pchyolan/rs-tandem-project/pull/46)

## 🚀 Запуск проекта для разработчиков
Для запуска проекта требуется Node миниум 20-ой версии.

1. Клонирование репозитория
```bash
git clone https://github.com/Pchyolan/rs-tandem-project.git
cd rs-tandem-project
```

2. Установка зависимостей
```bash
npm install
```

3. Настройка переменных окружения

Создайте файл .env в корне. Примерное содержание приведено ниже, точное содержание файла смотрите в примере ```./env.example```. Замените значения ключей базы данных на свои из Supabase. Пример файла:
```env
VITE_DEFAULT_LANGUAGE=en   # или ru
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_USE_MOCK=true
```

4. Запуск в режиме разработки
```bash
npm run dev
```

После запуска приложение будет доступно по адресу http://localhost:3000 (порт может измениться, если 3000 занят). Тестовый пользователь для запуска в режиме моков: 
- логин test@test.com
- пароль: 123456

## 🛠️ Хуки Husky
Проект использует Husky и lint-staged:
- При коммите автоматически запускается lint-staged, который проверяет и форматирует изменённые файлы.
- При пуше запускается проверка типов и сборка проекта (см. .husky/pre-push).

## 💻 Команды для разработки

### 🚀 Базовые команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск дев‑сервера Vite с горячей заменой модулей |
| `npm run build` | Сборка проекта |
| `npm run preview` | Локальный просмотр собранной версии (из папки `dist`) |

### 🔍 Проверка качества кода

| Команда | Описание |
|---------|----------|
| `npm run type-check` | Проверка типов TypeScript без сборки |
| `npm run lint` | Проверка ESLint с автоматическим исправлением ошибок |
| `npm run lint:check` | Только проверка ESLint (без исправлений) |
| `npm run format` | Форматирование кода через Prettier |
| `npm run format:check` | Проверка форматирования (без записи) |
| `npm run lint:styles` | Проверка SCSS/CSS с помощью Stylelint |
| `npm run lint:styles:fix` | Проверка и автоматическое исправление стилей SCSS/CSS |

### 🧪 Unit‑тесты (Vitest)

| Команда | Описание |
|---------|----------|
| `npm run test` | Запуск unit‑тестов (Vitest) |
| `npm run test:ui` | Запуск unit‑тестов с UI‑интерфейсом |
| `npm run test:coverage` | Запуск unit‑тестов с отчётом о покрытии |

### 🔗 Интеграционные тесты (Vitest)

| Команда | Описание |
|---------|----------|
| `npm run test:integration` | Запуск интеграционных тестов |
| `npm run test:integration:ui` | Запуск интеграционных тестов с UI‑интерфейсом |
| `npm run test:integration:coverage` | Запуск интеграционных тестов с отчётом о покрытии |

### 🌐 End‑to‑end тесты (Playwright)

| Команда | Описание                                                   |
|---------|------------------------------------------------------------|
| `npm run test:e2e` | Запуск end‑to‑end тестов (Playwright)                      |
| `npm run test:e2e:debug` | Запуск e2e тестов в режиме отладки                         |
| `npm run test:all` | Последовательный запуск тестов: unit, интеграционные и E2E |

### ✅ Комплексная проверка (для CI)

| Команда | Описание |
|---------|----------|
| `npm run check-all` | Полная проверка: типы → линтер → формат → тесты |



# 🤿 Правила работы с ветками
Ветки разработки в проекте сгруппированы по папкам:
- notes - для дневников, записей встреч и документации
- feature - для новых фич и разработок
- fix - для правки багов


