import { BaseComponent } from '@/core';
import { passwordRules } from '@/constants';

export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(email);
};

export const isStrongPassword = (password: string): boolean => {
  return password.length >= passwordRules.minLength;
};

export const showTemporaryError = (component: BaseComponent, message: string, duration = 5000): void => {
  component.element.textContent = message;
  setTimeout(() => {
    if (component.element.textContent === message) {
      component.element.textContent = '';
    }
  }, duration);
};

export const setButtonLoading = (button: BaseComponent<'button'>, isLoading: boolean): void => {
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
};
