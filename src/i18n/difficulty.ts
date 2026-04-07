import { difficultyMap, type LanguageType } from '@/types';

export type DifficultyTranslationKey = (typeof difficultyMap)[keyof typeof difficultyMap];

export const difficultyTranslations: Record<LanguageType, Record<DifficultyTranslationKey, string>> = {
  en: {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
  },
  ru: {
    easy: 'Лёгкий',
    medium: 'Средний',
    hard: 'Сложный',
  },
};
