import { BaseComponent, type Page } from '../core';
import { language$ } from '../store/language-store.ts';
import { translations, type TranslationKey } from '../i18n';

export function memoryGamePage(): Page {
  let container: BaseComponent<'div'>;
  let textComponent: BaseComponent<'p'>;
  let unsubscribe: () => void;

  const updateTexts = () => {
    const lang = language$.value;
    const dictionary = (key: TranslationKey) => translations[lang][key];
    textComponent.element.textContent = dictionary('myText');
  };

  return {
    render() {
      container = new BaseComponent({ tag: 'div', className: ['memory-game-page'] });
      textComponent = new BaseComponent({ tag: 'p', className: ['memory-game-text'] });

      container.append(textComponent);

      unsubscribe = language$.subscribe(updateTexts);
      updateTexts();

      return container;
    },
    onMount() {
      console.log('NOTE: Home page mounted');
    },
    onDestroy() {
      if (unsubscribe) unsubscribe();
      console.log('NOTE: Home page destroyed');
    },
  };
}
