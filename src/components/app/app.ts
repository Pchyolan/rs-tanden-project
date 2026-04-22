import { BaseComponent, Router } from '@/core';
import { Header } from '../header.ts';
import { Footer } from '../footer.ts';

import { routes } from '@/constants';
import { ToastContainer } from '@/components';
import { logoutApi, user$ } from '@/store/auth-store';

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

export class App extends BaseComponent {
  private readonly header: Header;
  public mainContainer: BaseComponent;
  private readonly contentContainer: BaseComponent;
  private readonly footer: Footer;

  public router: Router;
  private unsubscribeUser: (() => void) | null = null;

  private readonly toastContainer: ToastContainer;

  constructor() {
    super({ tag: 'div', className: ['app-container'] });

    this.mainContainer = new BaseComponent({
      tag: 'div',
      className: ['app-main'],
    });

    this.contentContainer = new BaseComponent({
      tag: 'div',
      className: ['app-content'],
    });

    this.mainContainer.append(this.contentContainer);

    this.router = new Router(this.contentContainer);

    this.header = new Header(this.router, {
      onHome: () => this.router.navigate(routes.home),
      onSignIn: () => this.router.navigate(routes.login),
      onSettings: () => this.router.navigate(routes.settings),
      onLogout: async () => {
        await logoutApi();
        this.router.navigate(routes.login);
      },
    });

    this.footer = new Footer();

    this.toastContainer = new ToastContainer();
    this.append(this.header, this.mainContainer, this.footer, this.toastContainer);

    this.setupRoutes();
    this.setupAuthGuard();
  }

  // Публичный метод для старта роутера (вызывается после монтирования)
  public start() {
    this.router.start();
  }

  private setupRoutes(): void {
    this.router.addRoute(routes.login, () => loginPage(this.router));
    this.router.addRoute(routes.reset_password, () => new ResetPasswordPage(this.router));
    this.router.addRoute(routes.not_found, () => notFoundPage((path) => this.router.navigate(path)));

    this.router.addRoute(routes.home, homePage);
    this.router.addRoute(routes.api_test, apiTestPage);
    this.router.addRoute(routes.widget_engine, widgetEnginePage);
    this.router.addRoute(routes.memory_game, memoryGamePage);
    this.router.addRoute(routes.settings, settingsPage);

    this.router.setNotFound(() => notFoundPage((path) => this.router.navigate(path)));
  }

  private setupAuthGuard() {
    this.unsubscribeUser = user$.subscribe(() => {
      const isAuthPage = ['/login', '/reset-password'].includes(location.pathname);
      const isProtected = this.isProtectedRoute(location.pathname);
      if (user$.value && isAuthPage) {
        this.router.navigate(routes.home);
      } else if (!user$.value && isProtected) {
        this.router.navigate(routes.login);
      }
    });
  }

  private isProtectedRoute(path: string): boolean {
    const protectedPaths: string[] = [
      routes.home,
      routes.settings,
      routes.api_test,
      routes.widget_engine,
      routes.memory_game,
    ];
    return protectedPaths.includes(path);
  }

  public override remove(): void {
    this.unsubscribeUser?.();
    super.remove();
  }
}
