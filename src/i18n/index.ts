import { headerTranslations } from './header';
import { homePageTranslations } from './home-page';
import { memoryGamePageTranslations } from './memory-game-page';
import { difficultyTranslations } from './difficulty';
import { widgetsTranslations } from './widgets';
import { ticketPageTranslations } from '@/i18n/ticket-page.ts';
import { errorTranslations } from '@/i18n/supabase-errors.ts';
import { loginPageTranslations } from '@/i18n/login-page.ts';
import { notFoundPageTranslations } from '@/i18n/not-found-page.ts';

export const translations = {
  en: {
    ...headerTranslations.en,
    ...homePageTranslations.en,
    ...memoryGamePageTranslations.en,
    ...widgetsTranslations.en,
    ...difficultyTranslations.en,
    ...ticketPageTranslations.en,
    ...errorTranslations.en,
    ...loginPageTranslations.en,
    ...notFoundPageTranslations.en,
  },
  ru: {
    ...headerTranslations.ru,
    ...homePageTranslations.ru,
    ...memoryGamePageTranslations.ru,
    ...widgetsTranslations.ru,
    ...difficultyTranslations.ru,
    ...ticketPageTranslations.ru,
    ...errorTranslations.ru,
    ...loginPageTranslations.ru,
    ...notFoundPageTranslations.ru,
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
