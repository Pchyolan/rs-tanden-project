import { SupabaseClient } from '@/core';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { createMockAuthError, createMockSession, createMockUser } from '@/mocks/auth-mocks';
import { randomDelay } from '@/utils/delays';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

type AuthResult<T> = { data: T | null; error: AuthError | null };

class AuthService {
  async registration(
    email: string,
    password: string,
    displayName?: string
  ): Promise<AuthResult<{ user: User; session: Session }>> {
    const { data, error } = await SupabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });

    if (error) return { data: null, error };
    if (!data.user || !data.session) return { data: null, error: null };

    return { data: { user: data.user, session: data.session }, error: null };
  }

  async signIn(email: string, password: string): Promise<AuthResult<{ user: User; session: Session }>> {
    if (USE_MOCK) {
      await randomDelay();
      if (email === 'test@test.com' && password === '123456') {
        const user = createMockUser('1', email);
        const session = createMockSession('1', email);
        return { data: { user, session }, error: null };
      }
      return { data: null, error: createMockAuthError('Invalid credentials', 400, 'invalid_credentials') };
    }

    const { data, error } = await SupabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { data: null, error };
    if (!data.user || !data.session) return { data: null, error: null };

    return { data: { user: data.user, session: data.session }, error: null };
  }

  async signOut(): Promise<AuthResult<null>> {
    const { error } = await SupabaseClient.auth.signOut();
    return { data: null, error };
  }

  async getSession(): Promise<AuthResult<{ session: Session }>> {
    const { data, error } = await SupabaseClient.auth.getSession();

    if (error) return { data: null, error };
    if (!data.session) return { data: null, error: null };

    return { data: { session: data.session }, error: null };
  }

  async resetPassword(email: string): Promise<AuthResult<null>> {
    const redirectTo = `${globalThis.location.origin}/reset-password`;
    const { error } = await SupabaseClient.auth.resetPasswordForEmail(email, { redirectTo });
    return { data: null, error };
  }

  async updatePassword(password: string): Promise<AuthResult<{ user: User }>> {
    const { data, error } = await SupabaseClient.auth.updateUser({ password });

    if (error) return { data: null, error };
    if (!data.user) return { data: null, error: null };

    return { data: { user: data.user }, error: null };
  }

  async updateDisplayName(displayName: string): Promise<AuthResult<{ user: User }>> {
    const { data, error } = await SupabaseClient.auth.updateUser({
      data: { display_name: displayName },
    });

    if (error) return { data: null, error };
    if (!data.user) return { data: null, error: null };

    return { data: { user: data.user }, error: null };
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    return SupabaseClient.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });
  }
}

export const authService = new AuthService();
