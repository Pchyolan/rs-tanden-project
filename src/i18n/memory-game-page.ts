import type { Language } from '../types/language';

export type MemoryGameTranslationKey = 'myText';

export const memoryGamePageTranslations: Record<Language, Record<MemoryGameTranslationKey, string>> = {
  en: {
    myText: 'Memory Game',
  },
  ru: {
    myText: 'Игра "Сборщик мусора"',
  },
};
