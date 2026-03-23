import { BaseComponent } from '@/core';
import type { Page } from '@/core';

import { createBackArrow } from '@/utils/svg-icon';
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

      component.append(
        new BaseComponent({
          tag: 'p',
          text: '404',
          className: ['not-found-page__header'],
        }),
        new BaseComponent<'img'>({
          tag: 'img',
          className: ['not-found-page__image'],
          attrs: { src: notFoundImageUrl, alt: 'Not found image' },
        }),
        new BaseComponent({
          tag: 'p',
          text: 'Oh no! Page not found',
          className: ['not-found-page__text'],
        }),
        returnButton
      );

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
