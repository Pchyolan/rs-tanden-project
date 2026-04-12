import type { Page } from '@/core';
import { BaseComponent, Router } from '@/core';

import { passwordRules } from '@/constants';
import { createButtonWithIcon } from '@/components';

import { updatePasswordApi } from '@/store/auth-store';
import { authService } from '@/services/auth-service';
import { getFriendlyErrorMessage } from '@/utils/supabase-errors';
import { isStrongPassword } from '@/utils/login-helpers';

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

  constructor(router: Router) {
    this.router = router;
  }

  render(): BaseComponent {
    this.container = new BaseComponent({
      tag: 'div',
      className: ['reset-password-page'],
    });

    const loadingText = new BaseComponent({
      tag: 'p',
      text: 'Verifying reset link...',
      className: ['reset-password-loading'],
    });
    this.container.append(loadingText);

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

  onDestroy() {}

  private showResetForm(): void {
    if (!this.container) return;
    this.container.clear();

    const title = new BaseComponent({
      tag: 'h1',
      text: 'Set new password',
      className: ['reset-password-title'],
    });

    const image = new BaseComponent<'img'>({
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
      attrs: { type: 'password', placeholder: 'New password', autocomplete: 'new-password' },
      className: ['reset-password-field'],
    });

    this.confirmInput = new BaseComponent({
      tag: 'input',
      attrs: { type: 'password', placeholder: 'Confirm password', autocomplete: 'new-password' },
      className: ['reset-password-field'],
    });

    inputContainer.append(this.passwordInput, this.confirmInput);

    this.submitButton = new BaseComponent({
      tag: 'button',
      text: 'Update password',
      className: ['reset-password-button'],
    });
    this.submitButton.addEventListener('click', this.handleUpdatePassword);

    this.message = new BaseComponent({
      tag: 'div',
      className: ['reset-password-message'],
    });

    this.container.append(title, image, inputContainer, this.submitButton, this.message);
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

    const title = new BaseComponent({
      tag: 'h2',
      text: 'Invalid or expired link 🔐',
      className: ['reset-password-title'],
    });

    const description = new BaseComponent({
      tag: 'p',
      text: 'The password reset link is invalid or has expired. Please request a new one.',
      className: ['reset-password-description'],
    });

    const backButton = createButtonWithIcon({
      text: 'Back to Sign In',
      icon: createBackArrow(),
      className: 'reset-password-back-btn',
      onClick: () => this.router.navigate('/login'),
    });

    messageCard.append(title, description, backButton);
    this.container.append(image, messageCard);
  }

  private handleUpdatePassword = async () => {
    const password = this.passwordInput?.element.value;
    const confirm = this.confirmInput?.element.value;

    if (!password || !confirm) {
      this.showMessage('Please fill in both fields', 'error');
      return;
    }
    if (password !== confirm) {
      this.showMessage('Passwords do not match', 'error');
      return;
    }
    if (!isStrongPassword(password)) {
      this.showMessage(`Password must be at least ${passwordRules.minLength} characters`, 'error');
      return;
    }

    this.setLoading(true);
    try {
      await updatePasswordApi(password);

      this.showMessage('Password updated successfully! You can now sign in.', 'success');
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
      this.submitButton.element.textContent = 'Updating...';
      this.submitButton.element.setAttribute('disabled', 'true');
    } else {
      this.submitButton.element.textContent = 'Update password';
      this.submitButton.element.removeAttribute('disabled');
    }
  }
}
