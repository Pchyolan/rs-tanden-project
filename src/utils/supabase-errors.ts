import { language$ } from '@/store/language-store';
import { translations } from '@/i18n';

export function getFriendlyErrorMessage(error: unknown): string {
  const lang = language$.value;
  const errorMessages = translations[lang];

  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    const message = error.message;
    if (message.includes('Invalid login credentials')) {
      return errorMessages.invalidCredentials;
    }
    if (message.includes('User already registered')) {
      return errorMessages.userAlreadyRegistered;
    }
    if (message.includes('Email not confirmed')) {
      return errorMessages.emailNotConfirmed;
    }
    if (message.includes('Password should be at least 6 characters')) {
      return errorMessages.passwordTooShort;
    }
    if (message.includes('email rate limit exceeded')) {
      return errorMessages.rateLimit;
    }
    return message;
  }

  return errorMessages.unknown;
}
