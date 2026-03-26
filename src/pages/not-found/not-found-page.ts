import { BaseComponent } from '@/core';
import type { Page } from '@/core';

import { createBackArrow } from '@/utils/svg-icon.ts';
import notFoundImageUrl from '@/assets/images/brains/not-found.png';

import './not-found-page.scss';

export function notFoundPage(navigate: (path: string) => void): Page {
  let component: BaseComponent;

  return {
    render() {
      component = new BaseComponent({
        tag: 'div',
        className: ['not-found-page'],
      });

      const returnButton = new BaseComponent({
        tag: 'button',
        className: ['not-found-page__button'],
      });

      const buttonContent = new BaseComponent({
        tag: 'span',
        className: ['button-content'],
      });

      const arrowIcon = createBackArrow();
      const arrowWrapper = new BaseComponent({ tag: 'span', className: ['button-arrow'] });
      arrowWrapper.element.append(arrowIcon);

      const buttonText = new BaseComponent({
        tag: 'span',
        text: 'Go Home',
      });

      buttonContent.append(arrowWrapper, buttonText);
      returnButton.append(buttonContent);
      returnButton.addEventListener('click', () => navigate('/'));

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

      const animationWrapper = new BaseComponent({
        tag: 'div',
        className: ['animation-wrapper'],
      });

      animationWrapper.append(
        curvedText,
        new BaseComponent<'img'>({
          tag: 'img',
          className: ['not-found-page__image'],
          attrs: { src: notFoundImageUrl, alt: 'Not found image' },
        })
      );

      const buttonWrapper = new BaseComponent({
        tag: 'div',
        className: ['button-wrapper'],
      });
      buttonWrapper.append(
        new BaseComponent({
          tag: 'p',
          text: 'Oh no! Page not found',
          className: ['not-found-page__text'],
        }),
        returnButton
      );

      component.append(animationWrapper, buttonWrapper);

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
