import type { Language } from '../types/language';

export type HomePageTranslationKey = 'tempText';

export const homePageTranslations: Record<Language, Record<HomePageTranslationKey, string>> = {
  en: {
    tempText: 'TODO...',
  },
  ru: {
    tempText: 'Когда-нибудь тут будет посадочная страница...',
  },
};
