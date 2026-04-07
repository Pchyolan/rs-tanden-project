import type { LanguageType, WidgetType } from '@/types';
import { headerTranslations, type HeaderTranslationKey } from './header';
import { homePageTranslations, type HomePageTranslationKey } from './home-page';
import { memoryGamePageTranslations, type MemoryGameTranslationKey } from './memory-game-page';
import { type DifficultyTranslationKey, difficultyTranslations } from './difficulty';
import { widgetsTranslations } from './widgets';

export type TranslationKey =
  | HeaderTranslationKey
  | HomePageTranslationKey
  | MemoryGameTranslationKey
  | WidgetType
  | DifficultyTranslationKey;

export const translations: Record<LanguageType, Record<TranslationKey, string>> = {
  en: {
    ...headerTranslations.en,
    ...homePageTranslations.en,
    ...memoryGamePageTranslations.en,
    ...widgetsTranslations.en,
    ...difficultyTranslations.en,
  },
  ru: {
    ...headerTranslations.ru,
    ...homePageTranslations.ru,
    ...memoryGamePageTranslations.ru,
    ...widgetsTranslations.ru,
    ...difficultyTranslations.ru,
  },
};
