export type LanguageType = 'ru' | 'en';
export type ThemeType = 'light' | 'dark';

export type UserSettings = {
  displayName: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  theme: ThemeType;
  soundEnabled: boolean;
  language: LanguageType;
};
