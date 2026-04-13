import { BaseComponent, Router } from '@/core';
import { Header } from '../header.ts';
import { Footer } from '../footer.ts';

import { routes } from '@/constants';
import { initAuth, logoutApi } from '@/store/auth-store';
import {
  apiTestPage,
  homePage,
  loginPage,
  memoryGamePage,
  notFoundPage,
  ResetPasswordPage,
  settingsPage,
  widgetEnginePage,
} from '@/pages';

import './app.scss';

export class App extends BaseComponent<'div'> {
  private readonly header: Header;
  public mainContainer: BaseComponent<'div'>;
  private contentContainer: BaseComponent<'div'>;
  private readonly footer: Footer;
  public router: Router;

  constructor() {
    super({ tag: 'div', className: ['app-container'] });

    this.header = new Header({
      onHome: () => this.router.navigate(routes.home),
      onSignIn: () => this.router.navigate(routes.login),
      onTestApi: () => this.router.navigate(routes.api_test),
      onWidgetClick: () => this.router.navigate(routes.widget_engine),
      onMemoryClick: () => this.router.navigate(routes.memory_game),
      onSettings: () => this.router.navigate(routes.settings),
      onLogout: async () => {
        await logoutApi();
        this.router.navigate(routes.login);
      },
    });

    this.mainContainer = new BaseComponent({
      tag: 'div',
      className: ['app-main'],
    });

    this.contentContainer = new BaseComponent({
      tag: 'div',
      className: ['app-content'],
    });

    this.mainContainer.append(this.contentContainer);

    this.footer = new Footer();

    this.append(this.header, this.mainContainer, this.footer);

    this.router = new Router(this.contentContainer);
    this.setupRoutes();
  }

  static async create(): Promise<App> {
    await initAuth();
    return new App();
  }

  private setupRoutes(): void {
    this.router.addRoute(routes.home, homePage);

    this.router.addRoute(routes.login, () => loginPage(this.router));
    this.router.addRoute(routes.reset_password, () => new ResetPasswordPage(this.router));

    this.router.addRoute(routes.api_test, apiTestPage);
    this.router.addRoute(routes.widget_engine, widgetEnginePage);
    this.router.addRoute(routes.memory_game, memoryGamePage);

    this.router.addRoute(routes.settings, settingsPage);
    this.router.setNotFound(() => notFoundPage((path) => this.router.navigate(path)));

    this.router.start();
  }
}
