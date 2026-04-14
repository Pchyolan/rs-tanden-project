import { BaseComponent } from '@/core';
import { user$ } from '@/store/auth-store';
import { translations } from '@/i18n';
import { language$ } from '@/store/language-store';

type HeaderCallbacks = {
  onHome: () => void;
  onSignIn: () => void;
  onTestApi: () => void;
  onWidgetClick: () => void;
  onMemoryClick: () => void;
  onLogout: () => void;
  onSettings: () => void;
};

export class Header extends BaseComponent<'header'> {
  private readonly logo: BaseComponent<'span'>;
  private readonly homeBtn: BaseComponent<'button'>;
  private readonly signInBtn: BaseComponent<'button'>;
  private readonly testApiBtn: BaseComponent<'button'>;
  private readonly widgetEngineBtn: BaseComponent<'button'>;
  private readonly memoryGameBtn: BaseComponent<'button'>;
  private readonly settingsBtn: BaseComponent<'button'>;
  private readonly logoutBtn: BaseComponent<'button'>;

  private callbacks: HeaderCallbacks;

  private readonly unsubscribeLang: () => void;
  private readonly unsubscribeUser: () => void;

  constructor(callbacks: HeaderCallbacks) {
    super({ tag: 'header', className: ['app-header'] });
    this.callbacks = callbacks;

    const contentContainer = new BaseComponent({ tag: 'div', className: ['header-content'] });

    this.logo = new BaseComponent({ tag: 'span', className: ['logo'] });

    const navButtons = new BaseComponent({ tag: 'div', className: ['nav-buttons'] });

    this.homeBtn = new BaseComponent({ tag: 'button' });
    this.homeBtn.addEventListener('click', this.callbacks.onHome);

    this.signInBtn = new BaseComponent({ tag: 'button' });
    this.signInBtn.addEventListener('click', this.callbacks.onSignIn);

    this.testApiBtn = new BaseComponent({ tag: 'button' });
    this.testApiBtn.addEventListener('click', this.callbacks.onTestApi);

    this.widgetEngineBtn = new BaseComponent({ tag: 'button', text: 'Widget Engine' });
    this.widgetEngineBtn.addEventListener('click', this.callbacks.onWidgetClick);

    this.memoryGameBtn = new BaseComponent({ tag: 'button', text: 'Memory Game' });
    this.memoryGameBtn.addEventListener('click', this.callbacks.onMemoryClick);

    this.settingsBtn = new BaseComponent({ tag: 'button' });
    this.settingsBtn.addEventListener('click', this.callbacks.onSettings);

    this.logoutBtn = new BaseComponent({ tag: 'button' });
    this.logoutBtn.addEventListener('click', this.callbacks.onLogout);
    this.logoutBtn.hide();

    navButtons.append(
      this.homeBtn,
      this.signInBtn,
      this.testApiBtn,
      this.widgetEngineBtn,
      this.memoryGameBtn,
      this.settingsBtn,
      this.logoutBtn
    );

    contentContainer.append(this.logo, navButtons);
    this.append(contentContainer);

    this.unsubscribeLang = language$.subscribe(() => this.updateTexts());
    this.unsubscribeUser = user$.subscribe((user) => {
      if (user) {
        this.signInBtn.hide();
        this.logoutBtn.show();
      } else {
        this.signInBtn.show();
        this.logoutBtn.hide();
      }
      this.updateTexts();
    });

    this.updateTexts();
  }

  private updateTexts(): void {
    this.logo.element.textContent = translations[language$.value].appName;
    this.homeBtn.element.textContent = translations[language$.value].home;
    this.signInBtn.element.textContent = translations[language$.value].signIn;
    this.testApiBtn.element.textContent = translations[language$.value].testApi;
    this.settingsBtn.element.textContent = translations[language$.value].settings;
    this.logoutBtn.element.textContent = translations[language$.value].logout;
  }

  public override remove(): void {
    this.unsubscribeLang();
    this.unsubscribeUser();
    super.remove();
  }
}
