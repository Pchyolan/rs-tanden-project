import { BaseComponent } from './base-component';

export type Page = {
  render(): BaseComponent;
  onMount?(): void;
  onDestroy?(): void;
};

type Route = {
  path: string;
  page: () => Page;
};

export class Router {
  private root: BaseComponent;
  private routes: Route[] = [];
  private currentPage: Page | null = null;
  private notFoundPage: (() => Page) | null = null;

  constructor(root: BaseComponent) {
    this.root = root;
    globalThis.addEventListener('popstate', this.handlePopState.bind(this));
  }

  /**
   * Добавляет маршрут с фабричной функцией, которая создаёт экземпляр страницы.
   * @param path - путь маршрута
   * @param page - функция, возвращающая экземпляр Page
   */
  public addRoute(path: string, page: () => Page) {
    this.routes.push({ path, page });
  }

  /**
   * Устанавливает страницу для несуществующих маршрутов.
   * @param page - функция, возвращающая экземпляр Page
   */
  public setNotFound(page: () => Page): void {
    this.notFoundPage = page;
  }

  /**
   * Переходит на указанный путь, обновляя History API
   * @param path - целевой путь
   * @param state - дополнительные данные состояния
   */
  public navigate(path: string, state: object = {}) {
    if (path === globalThis.location.pathname) return;

    globalThis.history.pushState(state, '', path);
    this.render(path);
  }

  /**
   * Выполняет рендеринг страницы по указанному пути.
   * Управляет жизненным циклом страницы:
   * - уничтожает текущую страницу (если существует), вызывая её метод `onDestroy`;
   * - находит маршрут, соответствующий пути, или использует страницу 404;
   * - создаёт новый экземпляр страницы через фабричную функцию;
   * - очищает корневой контейнер и добавляет в него корневой элемент новой страницы;
   * - вызывает метод `onMount` новой страницы.
   *
   * Если маршрут не найден и страница 404 не задана, выводит ошибку в консоль и завершает работу.
   *
   * @param path - URL-путь для отображения (например, '/', '/login').
   */
  private render(path: string) {
    if (this.currentPage) {
      this.currentPage.onDestroy?.();
    }

    const route = this.routes.find((r) => r.path === path);

    if (route) {
      this.currentPage = route.page();
    } else if (this.notFoundPage) {
      this.currentPage = this.notFoundPage();
    } else {
      console.error(`No route for path "${path}" and no not-found page set.`);
      return;
    }

    this.root.clear();
    this.root.append(this.currentPage.render());
    this.currentPage.onMount?.();
  }

  /**
   * Обрабатывает событие `popstate` (срабатывает при нажатии кнопок назад/вперёд в браузере).
   * Выполняет повторный рендеринг страницы на основе текущего URL-пути.
   */
  private handlePopState() {
    this.render(globalThis.location.pathname);
  }

  /**
   * Инициализирует роутер, выполняя рендеринг начальной страницы по текущему URL-пути.
   * Должен быть вызван один раз после добавления всех маршрутов и установки страницы 404.
   */
  public start() {
    this.render(globalThis.location.pathname);
  }
}
