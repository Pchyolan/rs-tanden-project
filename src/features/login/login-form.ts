import type { Page } from '@/core';
import { BaseComponent, Router } from '@/core';

import { createButtonWithIcon } from '@/components';
import { loginApi, registrationApi, sendResetPasswordEmailApi, user$ } from '@/store/auth-store';
import { getFriendlyErrorMessage } from '@/utils/supabase-errors';
import { isStrongPassword, isValidEmail, setButtonLoading, showTemporaryError } from '@/utils/login-helpers';

import welcomeImageUrl from '@/assets/images/brains/welcome.png';
import welcomeAnimationUrl from '@/assets/video/welcome.webm';
import { createClipboardIcon, createLockIcon, createBackArrow } from '@/utils/svg-icon';

import './login-form.scss';
import { passwordRules } from '@/constants';

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
  private resetContainer?: BaseComponent;

  // Кнопки выбора действия
  private loginButton?: BaseComponent<'button'>;
  private registerButton?: BaseComponent<'button'>;

  // Поля и элементы формы входа
  private loginEmailInput?: BaseComponent<'input'>;
  private loginPasswordInput?: BaseComponent<'input'>;
  private loginSubmitButton?: BaseComponent<'button'>;
  private loginErrorMessage?: BaseComponent;
  private loginResetLink?: BaseComponent<'a'>;

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

  // Поля и элементы формы восстановления пароля
  private resetFieldsContainer?: BaseComponent;
  private resetHeaderText?: BaseComponent<'p'>;
  private resetEmailInput?: BaseComponent<'input'>;
  private resetButton?: BaseComponent<'button'>;
  private resetErrorMessage?: BaseComponent;

  // Сообщение об отправке email
  private resetMessageContainer?: BaseComponent;
  private resetMessageText?: BaseComponent<'p'>;

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

    buttonsContainer.append(this.createBackButton(), this.loginSubmitButton);

    this.loginResetLink = new BaseComponent({
      tag: 'a',
      text: 'Forgot Password? Reset',
      className: ['login-reset-link'],
      attrs: {
        href: '#',
      },
    });
    this.loginResetLink.addEventListener('click', this.showResetForm);

    container.append(
      this.loginEmailInput,
      this.loginPasswordInput,
      buttonsContainer,
      this.loginResetLink,
      this.loginErrorMessage
    );
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
      if (email && !isValidEmail(email) && this.regErrorMessage) {
        showTemporaryError(this.regErrorMessage, 'Enter a valid email address (e.g., name@example.com)');
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
      if (pwd && !isStrongPassword(pwd) && this.regErrorMessage) {
        showTemporaryError(this.regErrorMessage, `Password must be at least ${passwordRules.minLength} characters`);
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

    buttonsContainer.append(this.createBackButton(), this.regSubmitButton);
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

    const okButton = createButtonWithIcon({
      text: 'OK',
      icon: createBackArrow(),
      onClick: async () => {
        if (this.registerMessageContainer) {
          this.registerMessageContainer.hide();
        }

        this.clearFormsData();
        await this.backToMain();
      },
    });

    this.registerMessageContainer.append(this.registerMessageText, okButton);

    container.append(this.registerFieldsContainer, this.registerMessageContainer);
    return container;
  }

  private createResetFields(): BaseComponent {
    const container = new BaseComponent({
      tag: 'div',
      className: ['reset-fields-container'],
    });

    this.resetFieldsContainer = new BaseComponent({
      tag: 'div',
      className: ['reset-fields-wrapper'],
    });

    this.resetHeaderText = new BaseComponent({
      tag: 'p',
      text: 'Enter your email to reset password:',
      className: ['login-reset-link'],
    });

    this.resetEmailInput = new BaseComponent({
      tag: 'input',
      attrs: { type: 'email', placeholder: 'Email', autocomplete: 'email' },
      className: ['login-field'],
    });
    this.resetEmailInput.element.addEventListener('keypress', this.handleEnterInReset);

    this.resetErrorMessage = new BaseComponent({
      tag: 'div',
      className: ['error-message'],
    });

    const buttonsContainer = new BaseComponent({
      tag: 'div',
      className: ['login-buttons-container'],
    });

    this.resetButton = new BaseComponent({
      tag: 'button',
      text: 'Reset',
      className: ['login-submit-btn'],
    });
    this.resetButton.addEventListener('click', this.handleResetPassword);

    buttonsContainer.append(this.createBackButton(), this.resetButton);

    // --- Контейнер с сообщением об отправке письма ---
    this.resetMessageContainer = new BaseComponent({
      tag: 'div',
      className: ['register-message-container', 'hidden'],
    });

    this.resetMessageText = new BaseComponent({
      tag: 'p',
      text: 'Reset mail successfully sent! 🚀 Please check your email.',
      className: ['register-message-text'],
    });

    const okButton = createButtonWithIcon({
      text: 'OK',
      icon: createBackArrow(),
      onClick: () => {
        if (this.resetMessageContainer) {
          this.resetMessageContainer.hide();
        }

        this.clearFormsData();
        this.backToMain();
      },
    });

    this.resetMessageContainer.append(this.resetMessageText, okButton);

    this.resetFieldsContainer.append(
      this.resetHeaderText,
      this.resetEmailInput,
      buttonsContainer,
      this.resetErrorMessage
    );

    container.append(this.resetFieldsContainer, this.resetMessageContainer);
    return container;
  }

  private createButtonWrapper(): BaseComponent {
    const wrapper = new BaseComponent({
      tag: 'div',
      className: ['welcome-page__wrapper'],
    });

    this.registerButton = createButtonWithIcon({
      text: 'Register',
      icon: createClipboardIcon(),
      onClick: () => this.showRegisterForm(),
    });

    this.loginButton = createButtonWithIcon({
      text: 'Log In',
      icon: createLockIcon(),
      onClick: () => this.showLoginForm(),
    });

    this.loginContainer = this.createLoginFields();
    this.registerContainer = this.createRegisterFields();
    this.resetContainer = this.createResetFields();

    // Изначально все формы скрыты
    this.loginContainer.element.classList.remove('show');
    this.registerContainer.element.classList.remove('show');
    this.resetContainer.element.classList.remove('show');

    wrapper.append(
      this.registerButton,
      this.loginButton,
      this.loginContainer,
      this.registerContainer,
      this.resetContainer
    );
    return wrapper;
  }

  private createBackButton(): BaseComponent<'button'> {
    return createButtonWithIcon({
      text: 'Back',
      icon: createBackArrow(),
      onClick: () => this.backToMain(),
    });
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
      showTemporaryError(this.loginErrorMessage, 'Please fill in both fields');
      return;
    }
    if (!isValidEmail(email)) {
      showTemporaryError(this.loginErrorMessage, 'Invalid email format');
      return;
    }
    if (!isStrongPassword(password)) {
      showTemporaryError(this.loginErrorMessage, `Password must be at least ${passwordRules.minLength} characters`);
      return;
    }

    setButtonLoading(this.loginSubmitButton, true);

    try {
      await loginApi(email, password);
      this.router.navigate('/settings');
    } catch (error) {
      showTemporaryError(this.loginErrorMessage, getFriendlyErrorMessage(error));
    } finally {
      setButtonLoading(this.loginSubmitButton, false);
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
      showTemporaryError(this.regErrorMessage, 'Please fill in all fields');
      return;
    }

    if (password !== confirm) {
      showTemporaryError(this.regErrorMessage, 'Passwords do not match');
      return;
    }

    if (!isValidEmail(email)) {
      showTemporaryError(this.regErrorMessage, 'Invalid email format');
      return;
    }
    if (!isStrongPassword(password)) {
      showTemporaryError(this.regErrorMessage, `Password must be at least ${passwordRules.minLength} characters`);
      return;
    }

    setButtonLoading(this.regSubmitButton, true);

    try {
      await registrationApi(email, password);
      this.registerFieldsContainer?.hide();
      this.registerMessageContainer?.show();
    } catch (error) {
      showTemporaryError(this.regErrorMessage, getFriendlyErrorMessage(error));
    } finally {
      setButtonLoading(this.regSubmitButton, false);
    }
  };

  private handleResetPassword = async () => {
    const email = this.resetEmailInput?.element.value.trim();

    if (this.resetErrorMessage) {
      if (!email) {
        showTemporaryError(this.resetErrorMessage, 'Please enter your email address first.');
        return;
      }
      if (!isValidEmail(email)) {
        showTemporaryError(this.resetErrorMessage, 'Invalid email format.');
        return;
      }
    }

    if (this.resetButton && email) {
      setButtonLoading(this.resetButton, true);
      try {
        await sendResetPasswordEmailApi(email);
        this.resetFieldsContainer?.hide();
        this.resetMessageContainer?.show();
      } catch (error) {
        if (this.resetErrorMessage) {
          showTemporaryError(this.resetErrorMessage, getFriendlyErrorMessage(error));
        }
      } finally {
        setButtonLoading(this.resetButton, false);
      }
    }
  };

  handleEnterInLogin = async (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      await this.handleSignIn();
    }
  };

  handleEnterInRegister = async (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      await this.handleSignUp();
    }
  };

  handleEnterInReset = async (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      await this.handleResetPassword();
    }
  };

  // ==========================================
  // Вспомогательные методы UI
  // ==========================================

  private async switchToForm(targetForm?: BaseComponent, focusInput?: BaseComponent<'input'>): Promise<void> {
    if (!targetForm) return;

    const allForms = [this.loginContainer, this.registerContainer, this.resetContainer].filter(Boolean);
    await this.animateHideButtons();

    for (const form of allForms) {
      if (form && form !== targetForm && form.element.classList.contains('show')) {
        await this.animateHideForm(form);
      }
    }

    if (!targetForm.element.classList.contains('show')) {
      await this.animateShowForm(targetForm);
    }

    focusInput?.element.focus();
  }

  private showLoginForm = async () => {
    await this.switchToForm(this.loginContainer, this.loginEmailInput);
  };

  private showRegisterForm = async (): Promise<void> => {
    await this.switchToForm(this.registerContainer, this.regEmailInput);
  };

  private showResetForm = async (): Promise<void> => {
    await this.switchToForm(this.resetContainer, this.resetEmailInput);
  };

  private backToMain = async (): Promise<void> => {
    if (this.loginContainer?.element.classList.contains('show')) {
      await this.animateHideForm(this.loginContainer);
    } else if (this.registerContainer?.element.classList.contains('show')) {
      await this.animateHideForm(this.registerContainer);
    } else if (this.resetContainer?.element.classList.contains('show')) {
      await this.animateHideForm(this.resetContainer);
    }

    await this.animateShowButtons();
    this.clearFormsData();
  };

  private clearFormsData(): void {
    if (this.loginErrorMessage) this.loginErrorMessage.element.textContent = '';
    if (this.regErrorMessage) this.regErrorMessage.element.textContent = '';
    if (this.resetErrorMessage) this.resetErrorMessage.element.textContent = '';

    if (this.loginEmailInput) this.loginEmailInput.element.value = '';
    if (this.loginPasswordInput) this.loginPasswordInput.element.value = '';

    if (this.regEmailInput) this.regEmailInput.element.value = '';
    if (this.regPasswordInput) this.regPasswordInput.element.value = '';
    if (this.regConfirmPasswordInput) this.regConfirmPasswordInput.element.value = '';

    if (this.resetEmailInput) this.resetEmailInput.element.value = '';
  }

  private async checkAndRedirectIfLoggedIn(): Promise<void> {
    if (user$.value) {
      this.router.navigate('/settings');
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
