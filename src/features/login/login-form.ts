import type { Page } from '@/core';
import { BaseComponent, Router, SupabaseClient } from '@/core';

import { login, registration } from '@/store/auth-store';

import welcomeImageUrl from '@/assets/images/brains/welcome.png';
import welcomeAnimationUrl from '@/assets/video/welcome.webm';
import { createClipboardIcon, createLockIcon, createBackArrow } from '@/utils/svg-icon';

import './login-form.scss';

type ButtonConfig = {
  text: string;
  icon: SVGElement;
  onClick?: () => void;
};

/**
 * Страница входа/регистрации.
 * Управляет отображением форм, аутентификацией через Supabase и навигацией.
 */
export class LoginForm implements Page {
  private router: Router;

  // Корневой компонент страницы
  private component?: BaseComponent;

  // Контейнеры форм
  private loginContainer?: BaseComponent;
  private registerContainer?: BaseComponent;

  // Кнопки выбора действия
  private loginButton?: BaseComponent<'button'>;
  private registerButton?: BaseComponent<'button'>;

  // Поля и элементы формы входа
  private loginEmailInput?: BaseComponent<'input'>;
  private loginPasswordInput?: BaseComponent<'input'>;
  private loginSubmitButton?: BaseComponent<'button'>;
  private loginErrorMessage?: BaseComponent;

  // Поля и элементы формы регистрации
  private registerFieldsContainer?: BaseComponent;
  private regEmailInput?: BaseComponent<'input'>;
  private regPasswordInput?: BaseComponent<'input'>;
  private regConfirmPasswordInput?: BaseComponent<'input'>;
  private regSubmitButton?: BaseComponent<'button'>;
  private regErrorMessage?: BaseComponent;

  // Сообщение от Supabase
  private registerMessageContainer?: BaseComponent;
  private registerMessageText?: BaseComponent<'p'>;

  private readonly ANIMATION_DURATION = 150;

  constructor(router: Router) {
    this.router = router;
  }

  render(): BaseComponent {
    this.component = new BaseComponent({
      tag: 'div',
      className: ['welcome-page'],
    });

    this.component.append(this.createImageWrapper(), this.createButtonWrapper());
    return this.component;
  }

  async onMount(): Promise<void> {
    console.log('Login page mounted');
    await this.checkAndRedirectIfLoggedIn();
  }

  onDestroy(): void {
    console.log('Login page destroyed');
  }

  // ==========================================
  // Приватные методы рендеринга
  // ==========================================

  private createImageWrapper(): BaseComponent {
    const wrapper = new BaseComponent({
      tag: 'div',
      className: ['welcome-page__wrapper'],
    });

    const message = new BaseComponent({
      tag: 'p',
      text: 'Welcome stranger!',
      className: ['welcome-page__header'],
    });

    wrapper.append(message, this.renderWelcomeVideo());
    return wrapper;
  }

  private renderWelcomeVideo(): BaseComponent {
    const container = new BaseComponent({
      tag: 'div',
      className: ['welcome-page__image-wrapper'],
    });

    const videoElement = new BaseComponent({
      tag: 'video',
      className: ['welcome-page__video'],
      attrs: {
        src: welcomeAnimationUrl,
        autoplay: true,
        loop: true,
        muted: true,
        volume: '0',
        playsinline: true,
      },
    });

    videoElement.addEventListener('error', () => {
      const fallbackImg = new BaseComponent<'img'>({
        tag: 'img',
        className: ['welcome-page__image'],
        attrs: { src: welcomeImageUrl, alt: 'Brain welcome' },
      });
      container.clear();
      container.append(fallbackImg);
    });

    container.append(videoElement);
    return container;
  }

  private createLoginFields(): BaseComponent {
    const container = new BaseComponent({
      tag: 'div',
      className: ['login-fields-container'],
    });

    this.loginEmailInput = new BaseComponent({
      tag: 'input',
      attrs: { type: 'email', placeholder: 'Email', autocomplete: 'email' },
      className: ['login-field'],
    });
    this.loginEmailInput.element.addEventListener('keypress', this.handleEnterInLogin);

    this.loginPasswordInput = new BaseComponent({
      tag: 'input',
      attrs: { type: 'password', placeholder: 'Password', autocomplete: 'current-password' },
      className: ['login-field'],
    });
    this.loginPasswordInput.element.addEventListener('keypress', this.handleEnterInLogin);

    this.loginErrorMessage = new BaseComponent({
      tag: 'div',
      className: ['error-message'],
    });

    const buttonsContainer = new BaseComponent({
      tag: 'div',
      className: ['login-buttons-container'],
    });

    this.loginSubmitButton = new BaseComponent({
      tag: 'button',
      text: 'Sign In',
      className: ['login-submit-btn'],
    });
    this.loginSubmitButton.addEventListener('click', this.handleSignIn);

    const backButton = this.createButton({
      text: 'Back',
      icon: createBackArrow(),
      onClick: () => this.backToMain(),
    });

    buttonsContainer.append(backButton, this.loginSubmitButton);
    container.append(this.loginEmailInput, this.loginPasswordInput, buttonsContainer, this.loginErrorMessage);
    return container;
  }

  private createRegisterFields(): BaseComponent {
    const container = new BaseComponent({
      tag: 'div',
      className: ['register-fields-container'],
    });

    // --- Контейнер с полями и кнопками ---
    this.registerFieldsContainer = new BaseComponent({
      tag: 'div',
      className: ['register-fields-wrapper'],
    });

    this.regEmailInput = new BaseComponent({
      tag: 'input',
      attrs: { type: 'email', placeholder: 'Email', autocomplete: 'email' },
      className: ['login-field'],
    });
    this.regEmailInput.element.addEventListener('keypress', this.handleEnterInRegister);
    this.regEmailInput.addEventListener('input', () => {
      if (!this.regEmailInput) return;

      const email = this.regEmailInput.element.value.trim();
      if (email && !this.isValidEmail(email) && this.regErrorMessage) {
        this.showError(this.regErrorMessage, 'Enter a valid email address (e.g., name@example.com)');
      }
    });

    this.regPasswordInput = new BaseComponent({
      tag: 'input',
      attrs: { type: 'password', placeholder: 'Password', autocomplete: 'new-password' },
      className: ['login-field'],
    });
    this.regPasswordInput.element.addEventListener('keypress', this.handleEnterInRegister);
    this.regPasswordInput.addEventListener('input', () => {
      if (!this.regPasswordInput) return;

      const pwd = this.regPasswordInput.element.value;
      if (pwd && !this.isStrongPassword(pwd) && this.regErrorMessage) {
        this.showError(this.regErrorMessage, 'Password must be at least 6 characters');
      }
    });

    this.regConfirmPasswordInput = new BaseComponent({
      tag: 'input',
      attrs: { type: 'password', placeholder: 'Confirm Password', autocomplete: 'new-password' },
      className: ['login-field'],
    });
    this.regConfirmPasswordInput.element.addEventListener('keypress', this.handleEnterInRegister);

    this.regErrorMessage = new BaseComponent({
      tag: 'div',
      className: ['error-message'],
    });

    this.regSubmitButton = new BaseComponent({
      tag: 'button',
      text: 'Register',
      className: ['login-submit-btn'],
    });
    this.regSubmitButton.addEventListener('click', this.handleSignUp);

    const buttonsContainer = new BaseComponent({
      tag: 'div',
      className: ['login-buttons-container'],
    });

    const backButton = this.createButton({
      text: 'Back',
      icon: createBackArrow(),
      onClick: () => this.backToMain(),
    });

    buttonsContainer.append(backButton, this.regSubmitButton);
    this.registerFieldsContainer.append(
      this.regEmailInput,
      this.regPasswordInput,
      this.regConfirmPasswordInput,
      buttonsContainer,
      this.regErrorMessage
    );

    // --- Контейнер с сообщением об успехе ---
    this.registerMessageContainer = new BaseComponent({
      tag: 'div',
      className: ['register-message-container', 'hidden'],
    });

    this.registerMessageText = new BaseComponent({
      tag: 'p',
      text: 'Registration successful! ✨ Please check your email to confirm.',
      className: ['register-message-text'],
    });

    const okButton = this.createButton({
      text: 'OK',
      icon: createBackArrow(),
      onClick: () => {
        if (this.registerMessageContainer) {
          this.registerMessageContainer.hide();
        }

        if (this.registerFieldsContainer) {
          this.registerFieldsContainer.show();
        }
        this.clearFormsData();
        this.backToMain();
      },
    });

    this.registerMessageContainer.append(this.registerMessageText, okButton);

    container.append(this.registerFieldsContainer, this.registerMessageContainer);
    return container;
  }

  private createButtonWrapper(): BaseComponent {
    const wrapper = new BaseComponent({
      tag: 'div',
      className: ['welcome-page__wrapper'],
    });

    this.registerButton = this.createButton({
      text: 'Register',
      icon: createClipboardIcon(),
      onClick: () => this.showRegisterForm(),
    });

    this.loginButton = this.createButton({
      text: 'Log In',
      icon: createLockIcon(),
      onClick: () => this.showLoginForm(),
    });

    this.loginContainer = this.createLoginFields();
    this.registerContainer = this.createRegisterFields();

    // Изначально обе формы скрыты
    this.loginContainer.element.classList.remove('show');
    this.registerContainer.element.classList.remove('show');

    wrapper.append(this.registerButton, this.loginButton, this.loginContainer, this.registerContainer);
    return wrapper;
  }

  private createButton(config: ButtonConfig): BaseComponent<'button'> {
    const button = new BaseComponent({
      tag: 'button',
      className: ['welcome-page__button'],
    });

    const buttonContent = new BaseComponent({
      tag: 'span',
      className: ['welcome-page__button-content'],
    });

    const iconWrapper = new BaseComponent({
      tag: 'span',
      className: ['welcome-page__button-image'],
    });
    iconWrapper.element.append(config.icon);

    const buttonSpan = new BaseComponent({
      tag: 'span',
      text: config.text,
    });

    buttonContent.append(iconWrapper, buttonSpan);
    button.append(buttonContent);

    if (config.onClick) {
      button.addEventListener('click', config.onClick);
    }

    return button;
  }

  // ==========================================
  // Обработчики событий
  // ==========================================

  private handleSignIn = async (): Promise<void> => {
    if (!this.loginEmailInput || !this.loginPasswordInput || !this.loginSubmitButton || !this.loginErrorMessage) {
      console.error('Login form elements not initialized');
      return;
    }

    const email = this.loginEmailInput.element.value.trim();
    const password = this.loginPasswordInput.element.value;

    if (!email || !password) {
      this.showError(this.loginErrorMessage, 'Please fill in both fields');
      return;
    }
    if (!this.isValidEmail(email)) {
      this.showError(this.loginErrorMessage, 'Invalid email format');
      return;
    }
    if (!this.isStrongPassword(password)) {
      this.showError(this.loginErrorMessage, 'Password must be at least 6 characters');
      return;
    }

    this.setLoading(this.loginSubmitButton, true);

    try {
      await login(email, password);
      this.router.navigate('/dashboard');
    } catch (error) {
      this.showError(this.loginErrorMessage, this.getFriendlyErrorMessage(error));
    } finally {
      this.setLoading(this.loginSubmitButton, false);
    }
  };

  private handleSignUp = async (): Promise<void> => {
    if (
      !this.regEmailInput ||
      !this.regPasswordInput ||
      !this.regConfirmPasswordInput ||
      !this.regSubmitButton ||
      !this.regErrorMessage
    ) {
      console.error('Register form elements not initialized');
      return;
    }

    const email = this.regEmailInput.element.value.trim();
    const password = this.regPasswordInput.element.value;
    const confirm = this.regConfirmPasswordInput.element.value;

    if (!email || !password || !confirm) {
      this.showError(this.regErrorMessage, 'Please fill in all fields');
      return;
    }

    if (password !== confirm) {
      this.showError(this.regErrorMessage, 'Passwords do not match');
      return;
    }

    if (!this.isValidEmail(email)) {
      this.showError(this.regErrorMessage, 'Invalid email format');
      return;
    }
    if (!this.isStrongPassword(password)) {
      this.showError(this.regErrorMessage, 'Password must be at least 6 characters');
      return;
    }

    this.setLoading(this.regSubmitButton, true);

    try {
      await registration(email, password);
      this.registerFieldsContainer?.hide();
      this.registerMessageContainer?.show();
    } catch (error) {
      this.showError(this.regErrorMessage, this.getFriendlyErrorMessage(error));
    } finally {
      this.setLoading(this.regSubmitButton, false);
    }
  };

  handleEnterInLogin = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.handleSignIn();
    }
  };

  handleEnterInRegister = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.handleSignUp();
    }
  };

  // ==========================================
  // Вспомогательные методы UI
  // ==========================================

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isStrongPassword(password: string): boolean {
    return password.length >= 6;
  }

  private showError(messageComponent: BaseComponent, message: string): void {
    messageComponent.element.textContent = message;

    setTimeout(() => {
      if (messageComponent.element.textContent === message) {
        messageComponent.element.textContent = '';
      }
    }, 5000);
  }

  private getFriendlyErrorMessage(error: unknown): string {
    if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
      const message = error.message;
      if (message.includes('Invalid login credentials')) {
        return 'Incorrect email or password. Please try again.';
      }
      if (message.includes('User already registered')) {
        return 'This email is already registered. Please sign in.';
      }
      if (message.includes('Email not confirmed')) {
        return 'Please confirm your email address before signing in.';
      }
      if (message.includes('Password should be at least 6 characters')) {
        return 'Password must be at least 6 characters.';
      }
      return message;
    }

    return 'An unknown error occurred. Please try again.';
  }

  private setLoading(button: BaseComponent<'button'>, isLoading: boolean): void {
    if (isLoading) {
      button.element.dataset.originalText = button.element.textContent || '';
      button.element.setAttribute('disabled', 'true');
      button.element.textContent = 'Loading...';
    } else {
      button.element.removeAttribute('disabled');

      button.element.textContent =
        button.element.dataset.originalText ||
        (button.element.classList.contains('login-submit-btn') ? 'Sign In' : 'Submit');

      delete button.element.dataset.originalText;
    }
  }

  private showLoginForm = async (): Promise<void> => {
    if (!this.loginContainer || !this.loginEmailInput) {
      console.error('Login container or email input not initialized');
      return;
    }

    await this.animateHideButtons();
    if (this.registerContainer) {
      await this.animateHideForm(this.registerContainer);
    }
    await this.animateShowForm(this.loginContainer);

    this.loginEmailInput.element.focus();
  };

  private showRegisterForm = async (): Promise<void> => {
    if (!this.registerContainer || !this.regEmailInput) {
      console.error('Register container or email input not initialized');
      return;
    }

    await this.animateHideButtons();
    if (this.loginContainer) {
      await this.animateHideForm(this.loginContainer);
    }
    await this.animateShowForm(this.registerContainer);

    this.regEmailInput.element.focus();
  };

  private backToMain = async (): Promise<void> => {
    if (this.loginContainer?.element.classList.contains('show')) {
      await this.animateHideForm(this.loginContainer);
    } else if (this.registerContainer?.element.classList.contains('show')) {
      await this.animateHideForm(this.registerContainer);
    }

    await this.animateShowButtons();
    this.clearFormsData();
  };

  private clearFormsData(): void {
    if (this.loginErrorMessage) this.loginErrorMessage.element.textContent = '';
    if (this.regErrorMessage) this.regErrorMessage.element.textContent = '';
    if (this.loginEmailInput) this.loginEmailInput.element.value = '';
    if (this.loginPasswordInput) this.loginPasswordInput.element.value = '';
    if (this.regEmailInput) this.regEmailInput.element.value = '';
    if (this.regPasswordInput) this.regPasswordInput.element.value = '';
    if (this.regConfirmPasswordInput) this.regConfirmPasswordInput.element.value = '';
  }

  private async checkAndRedirectIfLoggedIn(): Promise<void> {
    const { data } = await SupabaseClient.auth.getSession();
    if (data.session) {
      this.router.navigate('/dashboard');
    }
  }

  // ==========================================
  // Анимации
  // ==========================================
  private async animateHideButtons(): Promise<void> {
    if (!this.loginButton || !this.registerButton) return;

    this.loginButton.element.classList.add('fade-out');
    this.registerButton.element.classList.add('fade-out');

    await new Promise((resolve) => setTimeout(resolve, this.ANIMATION_DURATION));
  }

  private animateShowButtons(): Promise<void> {
    if (!this.loginButton || !this.registerButton) return Promise.resolve();

    this.loginButton.element.classList.remove('fade-out');
    this.registerButton.element.classList.remove('fade-out');

    return Promise.resolve();
  }

  private async animateShowForm(formContainer: BaseComponent): Promise<void> {
    formContainer.element.classList.add('show');
    await new Promise((resolve) => setTimeout(resolve, this.ANIMATION_DURATION));
  }

  private async animateHideForm(formContainer: BaseComponent): Promise<void> {
    formContainer.element.classList.remove('show');
    await new Promise((resolve) => setTimeout(resolve, this.ANIMATION_DURATION));
  }
}
