import { BaseComponent, Router } from '../core';
import { Header } from './header.ts';
import { Footer } from './footer.ts';

import { homePage, loginPage, apiTestPage, notFoundPage, widgetEnginePage, memoryGamePage } from '../pages';
import { Routes } from '../constants/routes';

import '../styles/app.scss';

export class App extends BaseComponent<'div'> {
  private readonly header: Header;
  public mainContainer: BaseComponent<'div'>;
  private readonly footer: Footer;
  public router: Router;

  constructor() {
    super({ tag: 'div', className: ['app-container'] });

    this.header = new Header({
      onHome: () => this.router.navigate(Routes.HOME),
      onSignIn: () => this.router.navigate(Routes.LOGIN),
      onTestApi: () => this.router.navigate(Routes.API_TEST),
      onWidgetClick: () => this.router.navigate(Routes.WIDGET_ENGINE),
      onMemoryClick: () => this.router.navigate(Routes.MEMORY_GAME),
    });

    this.mainContainer = new BaseComponent({
      tag: 'div',
      className: ['app-main'],
    });

    this.footer = new Footer();

    this.append(this.header, this.mainContainer, this.footer);

    this.router = new Router(this.mainContainer);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.addRoute(Routes.HOME, homePage);
    this.router.addRoute(Routes.LOGIN, loginPage);
    this.router.addRoute(Routes.API_TEST, apiTestPage);
    this.router.addRoute(Routes.WIDGET_ENGINE, widgetEnginePage);
    this.router.addRoute(Routes.MEMORY_GAME, memoryGamePage);
    this.router.setNotFound(notFoundPage);
    this.router.start();
  }
}
