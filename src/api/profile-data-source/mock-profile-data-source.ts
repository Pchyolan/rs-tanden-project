import type { UserSettings } from '@/types';

import type { ProfileDataSource } from './types';
import { randomDelay } from '@/utils/delays';

export class MockProfileDataSource implements ProfileDataSource {
  async getUserSettings(): Promise<UserSettings> {
    await randomDelay();
    const stored = localStorage.getItem('mock_user_settings');
    if (stored) return JSON.parse(stored);
    return {
      displayName: 'Player',
      firstName: 'Ivan',
      lastName: 'Petrov',
      theme: 'light',
      soundEnabled: true,
      language: 'en',
    };
  }

  async updateUserSettings(settings: UserSettings): Promise<void> {
    await randomDelay();
    localStorage.setItem('mock_user_settings', JSON.stringify(settings));
  }
}
