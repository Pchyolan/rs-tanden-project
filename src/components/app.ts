import { BaseComponent, Router } from '@/core';
import { Header } from './header.ts';
import { Footer } from './footer.ts';

import { homePage, loginPage, apiTestPage, notFoundPage, widgetEnginePage, memoryGamePage } from '@/pages';
import { routes } from '@/constants';

import './app.scss';

export class App extends BaseComponent<'div'> {
  private readonly header: Header;
  public mainContainer: BaseComponent<'div'>;
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
    this.router.addRoute(routes.home, homePage);
    this.router.addRoute(routes.login, loginPage);
    this.router.addRoute(routes.api_test, apiTestPage);
    this.router.addRoute(routes.widget_engine, widgetEnginePage);
    this.router.addRoute(routes.memory_game, memoryGamePage);
    this.router.setNotFound(notFoundPage);
    this.router.start();
  }
}
