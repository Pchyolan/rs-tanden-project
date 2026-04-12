export function getFriendlyErrorMessage(error: unknown): string {
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
    if (message.includes('email rate limit exceeded')) {
      return 'Too many requests. Please wait a moment and try again.';
    }
    return message;
  }

  return 'An unknown error occurred. Please try again.';
}
