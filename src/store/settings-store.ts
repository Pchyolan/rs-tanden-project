import { Observable } from '@/core';
import type { UserSettings } from '@/types';
import { profileDataSource } from '@/api';

import { theme$ } from './theme-store';
import { language$ } from './language-store';
import { SoundService } from '@/services/sound-service';

export const settings$ = new Observable<UserSettings | null>(null);
export const settingsLoading$ = new Observable<boolean>(false);

export async function loadSettings(): Promise<void> {
  settingsLoading$.set(true);
  try {
    const settings = await profileDataSource.getUserSettings();
    settings$.set(settings);

    theme$.set(settings.theme);
    language$.set(settings.language);
    SoundService.getInstance().setEnabled(settings.soundEnabled);
  } catch (error) {
    console.error('Failed to load settings', error);
  } finally {
    settingsLoading$.set(false);
  }
}

export async function updateSettings(settings: UserSettings): Promise<void> {
  settingsLoading$.set(true);
  try {
    await profileDataSource.updateUserSettings(settings);
    settings$.set(settings);

    theme$.set(settings.theme);
    language$.set(settings.language);
    SoundService.getInstance().setEnabled(settings.soundEnabled);
  } catch (error) {
    console.error('Failed to update settings', error);
    throw error;
  } finally {
    settingsLoading$.set(false);
  }
}
