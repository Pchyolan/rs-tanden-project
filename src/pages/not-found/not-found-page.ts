import { BaseComponent } from '@/core';
import type { Page } from '@/core';

import { createBackArrow } from '@/utils/svg-icon.ts';
import notFoundImageUrl from '@/assets/images/brains/not-found.png';

import './not-found-page.scss';
import './curved-text.scss';

export function notFoundPage(navigate: (path: string) => void): Page {
  let component: BaseComponent;

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

    const buttonText = new BaseComponent({
      tag: 'span',
      text: 'Go Home',
    });

    buttonContent.append(arrowWrapper, buttonText);
    button.append(buttonContent);
    button.addEventListener('click', () => navigate('/'));

    return button;
  };

  /**
   * Создаёт изогнутый текст "404".
   */
  const createCurvedText = (): BaseComponent<'div'> => {
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
  const createAnimationWrapper = (): BaseComponent<'div'> => {
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
  const createButtonWrapper = (): BaseComponent<'div'> => {
    const wrapper = new BaseComponent({
      tag: 'div',
      className: ['button-wrapper'],
    });

    const message = new BaseComponent({
      tag: 'p',
      text: 'Oh no! Page not found',
      className: ['not-found-page__text'],
    });

    wrapper.append(message, createReturnButton());
    return wrapper;
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
      console.log('404 page mounted');
    },
    onDestroy() {
      console.log('404 page destroyed');
    },
  };
}
