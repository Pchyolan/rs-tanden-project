import { BaseComponent } from '@/core';
import { RoundButton } from '@/components';
import { user$ } from '@/store/auth-store';

import { translations } from '@/i18n';
import { language$ } from '@/store/language-store';

import loginIconUrl from '@/assets/images/icons/info.png';
import settingsIconUrl from '@/assets/images/icons/settings.png';
import achievementsIconUrl from '@/assets/images/icons/user.png';
import { getElementWithType } from '@/utils/selectors.ts';

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

  private readonly unsubscribeLang: () => void;
  private readonly unsubscribeUser: () => void;

  constructor(callbacks: HeaderCallbacks) {
    super({ tag: 'header', className: ['app-header'] });

    const contentContainer = new BaseComponent({ tag: 'div', className: ['header-content'] });

    const appName = new BaseComponent({
      tag: 'span',
      text: translations[language$.value].appName,
      className: ['header-app-name'],
    });

    const buttonsContainer = new BaseComponent({ tag: 'div', className: ['header-buttons-container'] });

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
      iconSrc: settingsIconUrl,
      alt: 'Logout',
      tooltip: translations[language$.value].logout,
      onClick: callbacks.onLogout,
      showSparkle: true,
      tooltipPlacement: 'bottom',
    });
    this.logoutButton.hide();

    buttonsContainer.append(this.signInButton, this.achievementsButton, this.settingsButton, this.logoutButton);

    contentContainer.append(appName, buttonsContainer);
    this.append(contentContainer);

    this.unsubscribeLang = language$.subscribe(() => this.updateTexts());
    this.unsubscribeUser = user$.subscribe((user) => {
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
      this.updateTexts();
    });

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

  public override remove(): void {
    this.unsubscribeLang();
    this.unsubscribeUser();
    super.remove();
  }
}
