import { BaseComponent, Router } from '@/core';
import { RoundButton } from '@/components';
import { user$ } from '@/store/auth-store';
import { getElementWithType } from '@/utils/selectors';

import { translations } from '@/i18n';
import { language$ } from '@/store/language-store';

import loginIconUrl from '@/assets/images/icons/sign-in.png';
import achievementsIconUrl from '@/assets/images/icons/user.png';
import settingsIconUrl from '@/assets/images/icons/settings.png';
import logoutIconUrl from '@/assets/images/icons/sign-out.png';
import appImageUrl from '@/assets/images/app-header.png';

type HeaderCallbacks = {
  onSignIn: () => void;
  onLogout: () => void;
  onSettings: () => void;
};

export class Header extends BaseComponent<'header'> {
  private readonly signInButton: RoundButton;
  private readonly achievementsButton: RoundButton;
  private readonly settingsButton: RoundButton;
  private readonly logoutButton: RoundButton;

  private readonly router: Router;

  private readonly unsubscribeLang: () => void;
  private readonly unsubscribeUser: () => void;
  private readonly unsubscribeRouter: (() => void) | null = null;

  constructor(router: Router, callbacks: HeaderCallbacks) {
    super({ tag: 'header', className: ['app-header'] });
    this.router = router;

    const contentContainer = new BaseComponent({ tag: 'div', className: ['header-content'] });

    const appNameContainer = new BaseComponent({
      tag: 'div',
      className: ['header-name-container'],
    });

    const appImage = new BaseComponent<'img'>({
      tag: 'img',
      className: ['header-app-image'],
      attrs: { src: appImageUrl, alt: 'App Image' },
    });
    const appName = new BaseComponent({
      tag: 'span',
      text: translations[language$.value].appName,
      className: ['header-app-name'],
    });

    appNameContainer.append(appImage, appName);

    const buttonsContainer = new BaseComponent({
      tag: 'div',
      className: ['header-buttons-container'],
    });

    this.signInButton = new RoundButton({
      iconSrc: loginIconUrl,
      alt: 'Sign In',
      tooltip: translations[language$.value].signIn,
      onClick: callbacks.onSignIn,
      showSparkle: true,
      tooltipPlacement: 'bottom',
    });

    this.settingsButton = new RoundButton({
      iconSrc: settingsIconUrl,
      alt: 'Settings',
      tooltip: translations[language$.value].settings,
      onClick: callbacks.onSettings,
      showSparkle: true,
      tooltipPlacement: 'bottom',
    });

    this.achievementsButton = new RoundButton({
      iconSrc: achievementsIconUrl,
      alt: 'Achievements',
      tooltip: translations[language$.value].achievements,
      onClick: callbacks.onSettings,
      showSparkle: true,
      tooltipPlacement: 'bottom',
    });

    this.logoutButton = new RoundButton({
      iconSrc: logoutIconUrl,
      alt: 'Logout',
      tooltip: translations[language$.value].logout,
      onClick: callbacks.onLogout,
      showSparkle: true,
      tooltipPlacement: 'bottom',
    });
    this.logoutButton.hide();

    buttonsContainer.append(this.signInButton, this.achievementsButton, this.settingsButton, this.logoutButton);

    contentContainer.append(appNameContainer, buttonsContainer);
    this.append(contentContainer);

    this.unsubscribeLang = language$.subscribe(() => this.updateTexts());
    this.unsubscribeUser = user$.subscribe(() => {
      this.updateButtonsVisibility();
      this.updateTexts();
    });

    // Подписка на изменение пути
    this.unsubscribeRouter = router.currentPath$.subscribe(() => this.updateButtonsVisibility());

    this.updateButtonsVisibility();
    this.updateTexts();
  }

  private updateTexts(): void {
    if (this.signInButton) {
      const signInTooltip = getElementWithType(HTMLDivElement, 'icon-button__tooltip', this.signInButton.element);
      signInTooltip.textContent = translations[language$.value].signIn;
    }

    if (this.achievementsButton) {
      const achievementsTooltip = getElementWithType(
        HTMLDivElement,
        'icon-button__tooltip',
        this.achievementsButton.element
      );
      achievementsTooltip.textContent = translations[language$.value].achievements;
    }

    if (this.settingsButton) {
      const settingsTooltip = getElementWithType(HTMLDivElement, 'icon-button__tooltip', this.settingsButton.element);
      settingsTooltip.textContent = translations[language$.value].settings;
    }

    if (this.logoutButton) {
      const logoutTooltip = getElementWithType(HTMLDivElement, 'icon-button__tooltip', this.logoutButton.element);
      logoutTooltip.textContent = translations[language$.value].logout;
    }
  }

  /**
   * Обновляет видимость кнопок в зависимости от текущего пути и авторизации.
   * Приоритет: страницы логина/сброса пароля → все кнопки скрыты.
   * Иначе: показываем в зависимости от user$.
   */
  private updateButtonsVisibility(): void {
    const currentPath = this.router.currentPath$.value;
    const isAuthPage = currentPath === '/login' || currentPath === '/reset-password';

    if (isAuthPage) {
      this.signInButton.hide();
      this.achievementsButton.hide();
      this.settingsButton.hide();
      this.logoutButton.hide();
      return;
    }

    const user = user$.value;
    if (user) {
      this.signInButton.hide();
      this.achievementsButton.show();
      this.settingsButton.show();
      this.logoutButton.show();
    } else {
      this.signInButton.show();
      this.achievementsButton.hide();
      this.settingsButton.hide();
      this.logoutButton.hide();
    }
  }

  public override remove(): void {
    this.unsubscribeRouter?.();
    this.unsubscribeLang();
    this.unsubscribeUser();
    super.remove();
  }
}
