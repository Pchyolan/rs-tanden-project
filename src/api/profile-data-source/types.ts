import type { UserSettings } from '@/types';

export type ProfileDataSource = {
  getUserSettings(): Promise<UserSettings>;
  updateUserSettings(settings: UserSettings): Promise<void>;
};
