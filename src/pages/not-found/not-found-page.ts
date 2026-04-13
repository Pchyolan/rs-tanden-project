import { BaseComponent } from '@/core';
import type { Page } from '@/core';

import { language$ } from '@/store/language-store';
import { translations } from '@/i18n';

import { createBackArrow } from '@/utils/svg-icon.ts';
import notFoundImageUrl from '@/assets/images/brains/not-found.png';

import './not-found-page.scss';
import './curved-text.scss';

export function notFoundPage(navigate: (path: string) => void): Page {
  let component: BaseComponent;
  let messageComponent: BaseComponent<'p'>;
  let buttonTextSpan: HTMLSpanElement;
  let unsubscribe: () => void;

  /**
   * Создаёт кнопку возврата на главную.
   */
  const createReturnButton = (): BaseComponent<'button'> => {
    const button = new BaseComponent({
      tag: 'button',
      className: ['not-found-page__button'],
    });

    const buttonContent = new BaseComponent({
      tag: 'span',
      className: ['button-content'],
    });

    const arrowIcon = createBackArrow();
    const arrowWrapper = new BaseComponent({
      tag: 'span',
      className: ['button-arrow'],
    });
    arrowWrapper.element.append(arrowIcon);

    const textSpan = new BaseComponent({
      tag: 'span',
      text: translations[language$.value].goHome,
    });
    buttonTextSpan = textSpan.element;

    buttonContent.append(arrowWrapper, textSpan);
    button.append(buttonContent);
    button.addEventListener('click', () => navigate('/'));

    return button;
  };

  /**
   * Создаёт изогнутый текст "404".
   */
  const createCurvedText = (): BaseComponent => {
    const curvedText = new BaseComponent({
      tag: 'div',
      className: ['curved-text'],
    });

    ['4', '0', '4'].forEach((digit, index) => {
      const span = new BaseComponent({
        tag: 'span',
        text: digit,
        className: ['curved-text__digit', `digit-${index}`],
      });
      curvedText.append(span);
    });

    return curvedText;
  };

  /**
   * Создаёт анимационную обёртку с текстом и изображением.
   */
  const createAnimationWrapper = (): BaseComponent => {
    const wrapper = new BaseComponent({
      tag: 'div',
      className: ['animation-wrapper'],
    });

    const image = new BaseComponent<'img'>({
      tag: 'img',
      className: ['not-found-page__image'],
      attrs: { src: notFoundImageUrl, alt: 'Not found image' },
    });

    wrapper.append(createCurvedText(), image);
    return wrapper;
  };

  /**
   * Создаёт нижнюю часть страницы с текстом и кнопкой.
   */
  const createButtonWrapper = (): BaseComponent => {
    const wrapper = new BaseComponent({
      tag: 'div',
      className: ['button-wrapper'],
    });

    messageComponent = new BaseComponent({
      tag: 'p',
      text: translations[language$.value].notFoundMessage,
      className: ['not-found-page__text'],
    });

    wrapper.append(messageComponent, createReturnButton());
    return wrapper;
  };

  const updateTexts = () => {
    const lang = language$.value;
    if (messageComponent) {
      messageComponent.element.textContent = translations[lang].notFoundMessage;
    }
    if (buttonTextSpan) {
      buttonTextSpan.textContent = translations[lang].goHome;
    }
  };

  return {
    render() {
      component = new BaseComponent({
        tag: 'div',
        className: ['not-found-page'],
      });

      component.append(createAnimationWrapper(), createButtonWrapper());
      return component;
    },

    onMount() {
      unsubscribe = language$.subscribe(() => updateTexts());
    },

    onDestroy() {
      unsubscribe?.();
    },
  };
}
