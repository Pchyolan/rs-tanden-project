import { Observable } from '@/core';
import type { User } from '@supabase/supabase-js';
import { authService } from '../services/auth-service';
import { loadSettings } from '@/store/settings-store';

export const user$ = new Observable<User | null>(null);
export const authLoading$ = new Observable<boolean>(true);

const STORAGE_KEY = 'app_mock_user';

function saveMockUser(user: User | null): void {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function loadMockUser(): User | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function initAuth(): Promise<void> {
  // Сначала пробуем восстановить из localStorage
  const storedUser = loadMockUser();
  if (storedUser) {
    user$.set(storedUser);
    authLoading$.set(false);
    await loadSettings().catch(console.error);
    return;
  }

  // Иначе ждём реальной аутентификации (мок или Supabase)
  authService.onAuthStateChange((user) => {
    user$.set(user);
    authLoading$.set(false);
    if (user) {
      saveMockUser(user);
      void loadSettings().catch(console.error);
    } else {
      saveMockUser(null);
    }
  });

  const { data } = await authService.getSession();
  const user = data?.session?.user ?? null;
  if (user) {
    user$.set(user);
    saveMockUser(user);
    await loadSettings().catch(console.error);
  }
  authLoading$.set(false);
}

export function waitForAuth(): Promise<User | null> {
  return new Promise((resolve) => {
    const stored = loadMockUser();
    if (stored) {
      user$.set(stored);
      resolve(stored);
      return;
    }

    let resolved = false;
    const {
      data: { subscription },
    } = authService.onAuthStateChange((user) => {
      if (!resolved) {
        resolved = true;
        subscription.unsubscribe();
        if (user) saveMockUser(user);
        resolve(user);
      }
    });

    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        subscription.unsubscribe();
        resolve(null);
      }
    }, 2000);
  });
}

export async function loginApi(email: string, password: string): Promise<void> {
  authLoading$.set(true);
  try {
    const { data, error } = await authService.signIn(email, password);
    if (error) throw error;
    const user = data?.user ?? null;
    user$.set(user);
    saveMockUser(user);
    if (user) {
      await loadSettings().catch(console.error);
    }
  } finally {
    authLoading$.set(false);
  }
}

export async function registrationApi(email: string, password: string, displayName?: string): Promise<void> {
  authLoading$.set(true);
  try {
    const { data, error } = await authService.registration(email, password, displayName);
    if (error) throw error;
    const user = data?.user ?? null;
    user$.set(user);
    saveMockUser(user);
    if (user) {
      await loadSettings().catch(console.error);
    }
  } finally {
    authLoading$.set(false);
  }
}

export async function logoutApi(): Promise<void> {
  authLoading$.set(true);
  await authService.signOut();
  user$.set(null);
  saveMockUser(null);
  authLoading$.set(false);
}

export async function sendResetPasswordEmailApi(email: string): Promise<void> {
  const { error } = await authService.resetPassword(email);
  if (error) throw new Error(error.message);
}

export async function updatePasswordApi(password: string): Promise<void> {
  authLoading$.set(true);
  try {
    const { error } = await authService.updatePassword(password);
    if (error) throw new Error(error.message);
  } finally {
    authLoading$.set(false);
  }
}
