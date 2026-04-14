import { AuthError, type Session, type User } from '@supabase/supabase-js';

export function createMockUser(id: string, email: string): User {
  return {
    id,
    email,
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  };
}

export function createMockSession(userId: string, email: string): Session {
  return {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    token_type: 'bearer',
    user: createMockUser(userId, email),
  };
}

export function createMockAuthError(message: string, status: number = 400, code: string = 'mock_error'): AuthError {
  return new AuthError(message, status, code);
}
