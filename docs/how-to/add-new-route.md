# Добавление новой страницы в приложение

На текущий момент в проект добавлен простой хэш-роутер (`router.ts`), совместимый с Github Pages. Маршруты определяются по пути после `#` (например, `#/login`).

## 1. Создание компонента новой страницы

Файлы с кодом для создания страниц лежат в папке `src/pages/`. Пока что там один файл - одна страница, в теории большие страницы нужно будет бить на части. Пример самого минимального файла с подключением словаря (EN-RU):

### Создание страницы со словарём
```typescript
import { BaseComponent, type Page } from '../core';
import { language$ } from '../store/language-store.ts';
import { translations, type TranslationKey } from '../i18n';

export function homePage(): Page {
  let container: BaseComponent<'div'>;
  let textComponent: BaseComponent<'p'>;
  let unsubscribe: () => void;

  const updateTexts = () => {
    const lang = language$.value;
    const dictionary = (key: TranslationKey) => translations[lang][key];
    textComponent.element.textContent = dictionary('tempText');
  };

  return {
    render() {
      container = new BaseComponent({ tag: 'div', className: ['home-page'] });
      textComponent = new BaseComponent({ tag: 'p', className: ['home-text'] });

      container.append(textComponent);

      unsubscribe = language$.subscribe(updateTexts);
      updateTexts();

      return container;
    },
    onMount() {
      console.log('NOTE: Home page mounted');
    },
    onDestroy() {
      if (unsubscribe) unsubscribe();
      console.log('NOTE: Home page destroyed');
    },
  };
}
```

### Создание страницы без подключения словаря:

```typescript
import { BaseComponent } from '../core';
import type { Page } from '../core';

export function loginPage(): Page {
  let component: BaseComponent;

  return {
    render() {
      component = new BaseComponent({
        tag: 'div',
        className: ['login-page'],
        text: 'Login Page is here',
      });
      return component;
    },
    onMount() {
      console.log('NOTE: Login page mounted');
    },
    onDestroy() {
      console.log('NOTE: Login page destroyed');
    },
  };
}
```
### Создание страницы с использованием нативного DOM

Если вы не хотите использовать `BaseComponent` для вёрстки, вы можете создать элемент через `document.createElement`, а затем обернуть его в `BaseComponent`:

```typescript
import { BaseComponent, type Page } from '../core';

export function myPage(): Page {
  return {
    render: () => {
        const div = document.createElement('div');
        div.className = 'my-page';
        div.innerHTML = '<h1>Hello</h1>';

        const component = new BaseComponent(div);
    },
    onMount() { /* ... */ },
    onDestroy() { /* ... */ },
  };
}
```

Основные моменты:

- Основная функция в файле должна возвращать объект с методами render(), onMount?, onDestroy?.
- Функция render() возвращает корневой компонент страницы.
- Подписка на language$ нужна только если страница содержит текст, которые нужно переводить на английский / русский. От неё нужно отписаться в onDestroy.
- Стиль className предназначен для стилизации страницы в целом, если она нужна.

## 2. Добавление новой страницы в файл index.ts (для удобства импорта)
```typescript
export { homePage } from './home-page';
export { loginPage } from './login-page';
export { apiTestPage } from './api-test-page';
export { notFoundPage } from './not-found-page';
```

## 3. Добавление словаря с переводами (если нужен)

Если на новой странице есть текст, нужно добавить соответствующие ключи в папку интернационализации i18n.

Для этого нужно создать отдельный файл с таким содержимым:

```typescript
import type { Language } from '../types/language';

export type HomePageTranslationKey = 'tempText';

export const mainTranslations: Record<
  Language,
  Record<HomePageTranslationKey, string>
> = {
  en: {
    tempText: 'TODO...',
  },
  ru: {
    tempText: 'Когда-нибудь тут будет посадочная страница...',
  },
};
```

Здесь:

- HomePageTranslationKey содержит все ключи, которые используеются в фале словаря
- mainTranslations содержит переводы на en и ru языки в соответствующих объектах, по ключам из HomePageTranslationKey

Затем нужно добавить свой файл в `src/i18n/index.ts`. После этого он станет доступен для использования в приложении.

## 4. Добавление константы для маршрута

В файле `src/constants/routes.ts` нужно добавить в константу новый маршрут, например `API_TEST: '/api-test'`

## 5. Добавление нового маршрута и новой страницы в роутер

В файле `src/components/app.ts` нужно найти метод setupRoutes() и добавить в него новую строку для своей страницы:

```typescript
private setupRoutes(): void {
  this.router.addRoute(Routes.HOME, homePage);
  this.router.addRoute(Routes.LOGIN, loginPage);
  this.router.addRoute(Routes.API_TEST, apiTestPage);
  this.router.setNotFound(notFoundPage);
  this.router.start();
}
```

Также нужно импортировать компонент страницы.

## 6. Добавление кнопки в header (если нужно)

Для разработки можно добавлять кнопку для перехода на страницу в header. Для этого нужно выполнить несколько шагов:

- в файле `src/components/header.ts` в компоненте Header создать новую кнопку:

```typescript
this.testApiBtn = new BaseComponent({ tag: 'button' });
this.testApiBtn.addEventListener('click', this.callbacks.onTestApi);
```

Если кнопка предназначена только для разработки, проще всего добавить тут textContent и задать нужный текст кнопки, чтобы меньше заморачиваться. Если это кнопка для пользователя, то в методе updateTexts() нужно менять текст кнопки в зависимости от выбранного языка (перед этим нужно добавить в словарь для header-a соответсвующий ключ):

```typescript
this.testApiBtn.element.textContent = dictionary('testApi');
```

- в тип HeaderCallbacks нужно добавить новый callback `onTestApi: () => void;`;
- в файле `src/components/app.ts` передать функцию отрисовки callback в header:

```typescript
this.header = new Header({
  onHome: () => this.router.navigate(Routes.HOME),
  onSignIn: () => this.router.navigate(Routes.LOGIN),
  onTestApi: () => this.router.navigate(Routes.API_TEST),
});
```
- добавить новую кнопку в блок navButtons в файле `src/components/header.ts`

Когда кнопка для разработки станет не нужна, выпилить код из header и app в обратном порядке.

## Проверка

Всё, после этих шагов можно проверять что путь работает:

- либо нажать кнопку и посмотнеть, что она ведёт куда надо
- либо ввести путь в адресную строку вручную, и посмотреть что выведется Ваша страница. Например, `http://localhost:5173/#/api-test`
