import { BaseComponent } from '../../core';

import { user$ } from '../../store/auth-store';
import { authService } from '../../services/auth-service';
import type { AuthError } from '@supabase/supabase-js';

import '../../styles/api-test.scss';

export class ApiTestPageController {
  private container!: BaseComponent<'div'>;
  private leftPanel!: BaseComponent<'div'>;
  private rightPanel!: BaseComponent<'div'>;
  private textarea!: BaseComponent<'textarea'>;
  private emailInput!: BaseComponent<'input'>;
  private passwordInput!: BaseComponent<'input'>;
  private displayNameInput!: BaseComponent<'input'>;

  // Вспомогательные функции
  private execute = async <T>(action: () => Promise<{ data: T | null; error: AuthError | null }>) => {
    this.printResult('Loading...', null);
    try {
      const { data, error } = await action();
      this.printResult(data, error);
    } catch (error) {
      this.printResult(null, {
        message: `Unexpected error:\n${JSON.stringify(error, null, 2)}`,
      });
    }
  };

  private printResult = (data: unknown, error: unknown | null = null) => {
    this.textarea.element.value = error
      ? `Error:\n${JSON.stringify(error, null, 2)}`
      : `Success:\n${JSON.stringify(data, null, 2)}`;
  };

  // Обработчики
  private handleRegistration = async () => {
    const email = this.emailInput.element.value;
    const password = this.passwordInput.element.value;
    const displayName = this.displayNameInput.element.value;

    if (!email || !password) {
      this.printResult(null, { message: 'Email and password are required' });
      return;
    }

    await this.execute(() => authService.registration(email, password, displayName));
  };

  private handleSignIn = async () => {
    const email = this.emailInput.element.value;
    const password = this.passwordInput.element.value;
    if (!email || !password) {
      this.printResult(null, { message: 'Email and password are required' });
      return;
    }

    await this.execute(() => authService.signIn(email, password));
  };

  private handleSignOut = async () => {
    await this.execute(() => authService.signOut());
  };

  private handleUpdateDisplayName = async () => {
    const newName = this.displayNameInput.element.value;
    if (!newName) {
      this.printResult(null, { message: 'New display name is required' });
      return;
    }

    await this.execute(() => authService.updateDisplayName(newName));
  };

  private handleGetSession = async () => {
    await this.execute(() => authService.getSession());
  };

  private handleResetPassword = async () => {
    const email = this.emailInput.element.value;
    if (!email) {
      this.printResult(null, { message: 'Email is required' });
      return;
    }

    await this.execute(() => authService.resetPassword(email));
  };

  private handleGetCurrentUser = () => {
    const user = user$.value;
    if (user) {
      this.printResult(user, null);
    } else {
      this.printResult(null, { message: 'No user logged in' });
    }
  };

  private handleCopy = () => {
    const text = this.textarea.element.value;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        const copyButton = document.querySelector('.copy-btn');
        if (copyButton) {
          const originalText = copyButton.textContent;
          copyButton.textContent = 'Copied!';
          setTimeout(() => {
            copyButton.textContent = originalText;
          }, 1500);
        }
      })
      .catch((error) => {
        console.error('Failed to copy:', error);
      });
  };

  // Создание элементов
  private createInput = (type: string, placeholder: string, initialValue = '') => {
    return new BaseComponent({
      tag: 'input',
      attrs: { type, placeholder, value: initialValue },
    });
  };

  private createButton = (text: string, onClick: () => void) => {
    const button = new BaseComponent({ tag: 'button', text });
    button.addEventListener('click', onClick);
    return button;
  };

  // Сборка панелей
  private buildLeftPanel = () => {
    const panel = new BaseComponent({
      tag: 'div',
      className: ['api-test-left'],
    });

    const authTitle = new BaseComponent({
      tag: 'h3',
      className: ['auth-title'],
      text: 'Authorization Service',
    });

    this.displayNameInput = this.createInput('text', 'Display Name (optional)');
    this.emailInput = this.createInput('email', 'Email');
    this.passwordInput = this.createInput('password', 'Password');

    const buttonsConfig = [
      { text: 'Registration', handler: this.handleRegistration },
      { text: 'Sign In', handler: this.handleSignIn },
      { text: 'Sign Out', handler: this.handleSignOut },
      { text: 'Get Current User', handler: this.handleGetCurrentUser },
      { text: 'Update Display Name', handler: this.handleUpdateDisplayName },
      { text: 'Get Session', handler: this.handleGetSession },
      { text: 'Reset Password', handler: this.handleResetPassword },
    ];

    const buttons = buttonsConfig.map(({ text, handler }) => this.createButton(text, handler));

    panel.append(authTitle, this.displayNameInput, this.emailInput, this.passwordInput, ...buttons);

    return panel;
  };

  private buildRightPanel = () => {
    const panel = new BaseComponent({
      tag: 'div',
      className: ['api-test-right'],
    });

    const textareaHeader = new BaseComponent({
      tag: 'div',
      className: ['textarea-header'],
    });

    const documentLink = new BaseComponent({
      tag: 'a',
      attrs: {
        href: 'https://supabase.com/docs/reference/javascript/auth-signup',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      text: 'Supabase Auth Docs',
    });

    const copyButton = new BaseComponent({
      tag: 'button',
      className: ['copy-btn'],
      text: 'Copy',
    });
    copyButton.addEventListener('click', this.handleCopy);

    textareaHeader.append(documentLink, copyButton);

    this.textarea = new BaseComponent({
      tag: 'textarea',
      attrs: {
        rows: '20',
        cols: '50',
        placeholder: 'Output will appear here...',
        readonly: true,
      },
    });

    panel.append(textareaHeader, this.textarea);
    return panel;
  };

  // Публичные методы для страницы
  public render = () => {
    this.container = new BaseComponent({
      tag: 'div',
      className: ['api-test-container'],
    });
    this.leftPanel = this.buildLeftPanel();
    this.rightPanel = this.buildRightPanel();
    this.container.append(this.leftPanel, this.rightPanel);
    return this.container;
  };

  public onMount = () => {
    console.log('NOTE: API Test page mounted');
  };

  public onDestroy = () => {
    console.log('NOTE: API Test page destroyed');
  };
}
