import type { Page } from '@/core';
import { BaseComponent, Router } from '@/core';

import { passwordRules } from '@/constants';
import { createButtonWithIcon } from '@/components';

import { updatePasswordApi } from '@/store/auth-store';
import { authService } from '@/services/auth-service';
import { getFriendlyErrorMessage } from '@/utils/supabase-errors';
import { isStrongPassword } from '@/utils/login-helpers';
import { language$ } from '@/store/language-store';
import { translations } from '@/i18n';

import failureImageUrl from '@/assets/images/brains/reset-failure.png';
import successImageUrl from '@/assets/images/brains/reset-success.png';
import { createBackArrow } from '@/utils/svg-icon';
import './reset-password-page.scss';

export class ResetPasswordPage implements Page {
  private router: Router;

  private container?: BaseComponent;

  private passwordInput?: BaseComponent<'input'>;
  private confirmInput?: BaseComponent<'input'>;
  private submitButton?: BaseComponent<'button'>;
  private message?: BaseComponent;
  private unsubscribeLanguage?: () => void;

  private loadingText?: BaseComponent<'p'>;
  private title?: BaseComponent<'h1'>;
  private successImage?: BaseComponent<'img'>;
  private submitButtonText?: string;
  private messageCardTitle?: BaseComponent<'h2'>;
  private messageCardDesc?: BaseComponent<'p'>;
  private backButton?: BaseComponent<'button'>;

  constructor(router: Router) {
    this.router = router;
  }

  render(): BaseComponent {
    this.container = new BaseComponent({
      tag: 'div',
      className: ['reset-password-page'],
    });

    this.loadingText = new BaseComponent({
      tag: 'p',
      text: translations[language$.value].verifyingLink,
      className: ['reset-password-loading'],
    });
    this.container.append(this.loadingText);

    this.unsubscribeLanguage = language$.subscribe(() => this.updateTexts());

    return this.container;
  }

  async onMount(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const { data } = await authService.getSession();
    if (data?.session) {
      this.showResetForm();
    } else {
      this.showNoTokenMessage();
    }
  }

  onDestroy() {
    this.unsubscribeLanguage?.();
  }

  private updateTexts(): void {
    const lang = language$.value;

    if (this.loadingText && this.loadingText.element.isConnected) {
      this.loadingText.element.textContent = translations[lang].verifyingLink;
    }

    if (this.title && this.title.element.isConnected) {
      this.title.element.textContent = translations[lang].setNewPassword;
    }

    if (this.passwordInput) {
      this.passwordInput.element.placeholder = translations[lang].newPasswordPlaceholder;
    }
    if (this.confirmInput) {
      this.confirmInput.element.placeholder = translations[lang].confirmPasswordPlaceholder;
    }

    if (this.submitButton && !this.submitButton.element.hasAttribute('disabled')) {
      this.submitButton.element.textContent = translations[lang].updatePassword;
      this.submitButtonText = translations[lang].updatePassword;
    }

    if (this.messageCardTitle && this.messageCardTitle.element.isConnected) {
      this.messageCardTitle.element.textContent = translations[lang].invalidLinkTitle;
    }
    if (this.messageCardDesc && this.messageCardDesc.element.isConnected) {
      this.messageCardDesc.element.textContent = translations[lang].invalidLinkDescription;
    }
    if (this.backButton && this.backButton.element.isConnected) {
      this.backButton.element.textContent = translations[lang].backToSignIn;
    }
  }

  private showResetForm(): void {
    if (!this.container) return;
    this.container.clear();

    this.title = new BaseComponent({
      tag: 'h1',
      text: translations[language$.value].setNewPassword,
      className: ['reset-password-title'],
    });

    this.successImage = new BaseComponent<'img'>({
      tag: 'img',
      className: ['reset-password__image'],
      attrs: { src: successImageUrl, alt: 'Reset Success' },
    });

    const inputContainer = new BaseComponent({
      tag: 'div',
      className: ['reset-password__input-container'],
    });

    this.passwordInput = new BaseComponent({
      tag: 'input',
      attrs: {
        type: 'password',
        placeholder: translations[language$.value].newPasswordPlaceholder,
        autocomplete: 'new-password',
      },
      className: ['reset-password-field'],
    });

    this.confirmInput = new BaseComponent({
      tag: 'input',
      attrs: {
        type: 'password',
        placeholder: translations[language$.value].confirmPasswordPlaceholder,
        autocomplete: 'new-password',
      },
      className: ['reset-password-field'],
    });

    inputContainer.append(this.passwordInput, this.confirmInput);

    this.submitButton = new BaseComponent({
      tag: 'button',
      text: translations[language$.value].updatePassword,
      className: ['reset-password-button'],
    });
    this.submitButton.addEventListener('click', this.handleUpdatePassword);
    this.submitButtonText = translations[language$.value].updatePassword;

    this.message = new BaseComponent({
      tag: 'div',
      className: ['reset-password-message'],
    });

    this.container.append(this.title, this.successImage, inputContainer, this.submitButton, this.message);
  }

  private showNoTokenMessage(): void {
    if (!this.container) return;
    this.container.clear();

    const image = new BaseComponent<'img'>({
      tag: 'img',
      className: ['reset-password__image'],
      attrs: { src: failureImageUrl, alt: 'Reset Failure' },
    });

    const messageCard = new BaseComponent({
      tag: 'div',
      className: ['reset-password-message-card'],
    });

    this.messageCardTitle = new BaseComponent({
      tag: 'h2',
      text: translations[language$.value].invalidLinkTitle,
      className: ['reset-password-title'],
    });

    this.messageCardDesc = new BaseComponent({
      tag: 'p',
      text: translations[language$.value].invalidLinkDescription,
      className: ['reset-password-description'],
    });

    this.backButton = createButtonWithIcon({
      text: translations[language$.value].backToSignIn,
      icon: createBackArrow(),
      className: 'reset-password-back-btn',
      onClick: () => this.router.navigate('/login'),
    });

    messageCard.append(this.messageCardTitle, this.messageCardDesc, this.backButton);
    this.container.append(image, messageCard);
  }

  private handleUpdatePassword = async () => {
    const password = this.passwordInput?.element.value;
    const confirm = this.confirmInput?.element.value;

    if (!password || !confirm) {
      this.showMessage(translations[language$.value].fillBothFields, 'error');
      return;
    }
    if (password !== confirm) {
      this.showMessage(translations[language$.value].passwordsDoNotMatch, 'error');
      return;
    }
    if (!isStrongPassword(password)) {
      const message = translations[language$.value].passwordTooShort.replace(
        '{{minLength}}',
        String(passwordRules.minLength)
      );
      this.showMessage(message, 'error');
      return;
    }

    this.setLoading(true);
    try {
      await updatePasswordApi(password);
      this.showMessage(translations[language$.value].passwordUpdated, 'success');
      setTimeout(() => this.router.navigate('/login'), 2000);
    } catch (error) {
      this.showMessage(getFriendlyErrorMessage(error), 'error');
    } finally {
      this.setLoading(false);
    }
  };

  private showMessage(text: string, type: 'success' | 'error') {
    if (!this.message) return;
    this.message.element.textContent = text;
    this.message.element.className = `reset-password-message ${type}`;
  }

  private setLoading(isLoading: boolean) {
    if (!this.submitButton) return;

    if (isLoading) {
      this.submitButton.element.textContent = translations[language$.value].updating;
      this.submitButton.element.setAttribute('disabled', 'true');
    } else {
      this.submitButton.element.textContent = this.submitButtonText || translations[language$.value].updatePassword;
      this.submitButton.element.removeAttribute('disabled');
    }
  }
}
