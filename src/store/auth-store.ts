import { Observable } from '@/core';
import type { User } from '@supabase/supabase-js';
import { authService } from '../services/auth-service';
import { loadSettings } from '@/store/settings-store';

export const user$ = new Observable<User | null>(null);
export const authLoading$ = new Observable<boolean>(true);

// Инициализация: подписка на изменения +  получение сессии
export async function initAuth() {
  // Подписываемся на будущие изменения
  authService.onAuthStateChange((user) => {
    user$.set(user);
    authLoading$.set(false);
    if (user) {
      void loadSettings().catch(console.error);
    }
  });

  // Получаем текущую сессию (на случай, если уже была авторизация)
  const { data } = await authService.getSession();
  user$.set(data?.session?.user ?? null);
  authLoading$.set(false);

  const user = data?.session?.user ?? null;
  if (user) {
    await loadSettings().catch(console.error);
  }
}

export async function loginApi(email: string, password: string): Promise<void> {
  authLoading$.set(true);
  try {
    const { data, error } = await authService.signIn(email, password);
    if (error) throw error;

    user$.set(data?.user ?? null);
    if (data?.user) {
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

    user$.set(data?.user ?? null);
    if (data?.user) {
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
