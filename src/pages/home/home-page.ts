import { BaseComponent } from '@/core';
import type { Page } from '@/core';
import { getElementWithType } from '@/utils/selectors';

import welcomeImageUrl from '@/assets/images/brains/welcome.png';
import welcomeAnimationUrl from '@/assets/video/welcome.webm';
import { createClipboardIcon, createLockIcon } from '@/utils/svg-icon';

import './home-page.scss';

type ButtonConfig = {
  text: string;
  icon: SVGElement;
  onClick?: () => void;
};

const logInClick = (): void => {
  const loginFieldsContainer = getElementWithType(HTMLDivElement, 'login-fields-container');
  loginFieldsContainer.classList.toggle('show');
};

export function homePage(): Page {
  let component: BaseComponent;

  /**
   * Создаёт верхнюю часть страницы с текстом и изображением.
   */
  const createImageWrapper = (): BaseComponent<'div'> => {
    const wrapper = new BaseComponent({
      tag: 'div',
      className: ['welcome-page__wrapper'],
    });

    const message = new BaseComponent({
      tag: 'p',
      text: 'Welcome stranger!',
      className: ['welcome-page__header'],
    });

    wrapper.append(message, renderWelcomeVideo());

    return wrapper;
  };

  /**
   * Видео с анимированным персонажем и изображением на замену видео
   */
  const renderWelcomeVideo = (): BaseComponent<'div'> => {
    const container = new BaseComponent({
      tag: 'div',
      className: ['welcome-page__image-wrapper'],
    });

    const videoElement = new BaseComponent({
      tag: 'video',
      className: ['welcome-page__video'],
      attrs: {
        src: welcomeAnimationUrl,
        autoplay: true,
        loop: true,
        muted: true, // обязательно для авто-воспроизведения
        volume: '0',
        playsinline: true, // для iOS, чтобы видео не открывалось на весь экран
      },
    });

    videoElement.addEventListener('error', () => {
      const fallbackImg = new BaseComponent<'img'>({
        tag: 'img',
        className: ['welcome-page__image'],
        attrs: { src: welcomeImageUrl, alt: 'Brain welcome' },
      });
      container.clear();
      container.append(fallbackImg);
    });

    return container.append(videoElement);
  };

  /**
   * Создаёт нижнюю часть страницы с кнопками.
   */
  const createButtonWrapper = (): BaseComponent<'div'> => {
    const wrapper = new BaseComponent({
      tag: 'div',
      className: ['welcome-page__wrapper'],
    });

    wrapper.append(
      createButton({ text: 'Register', icon: createClipboardIcon() }),
      createLoginFields(),
      createButton({ text: 'Log In', icon: createLockIcon(), onClick: logInClick })
    );

    return wrapper;
  };

  /**
   * Создаёт кнопку
   */
  const createButton = (config: ButtonConfig): BaseComponent<'button'> => {
    const button = new BaseComponent({
      tag: 'button',
      className: ['welcome-page__button'],
    });

    const buttonContent = new BaseComponent({
      tag: 'span',
      className: ['welcome-page__button-content'],
    });

    const arrowWrapper = new BaseComponent({
      tag: 'span',
      className: ['welcome-page__button-image'],
    });
    arrowWrapper.element.append(config.icon);

    const buttonSpan = new BaseComponent({
      tag: 'span',
      text: config.text,
    });

    buttonContent.append(arrowWrapper, buttonSpan);
    button.append(buttonContent);

    if (config.onClick) {
      button.addEventListener('click', config.onClick);
    }

    return button;
  };

  /**
   * Функция для логина и пароля (вход в приложение по "Log In")
   */
  const createLoginFields = (): BaseComponent<'div'> => {
    const fieldsContainer = new BaseComponent({
      tag: 'div',
      className: ['login-fields-container'],
    });

    const emailInput = new BaseComponent({
      tag: 'input',
      attrs: { type: 'email', placeholder: 'Email' },
      className: ['login-field'],
    });

    const passwordInput = new BaseComponent({
      tag: 'input',
      attrs: { type: 'password', placeholder: 'Password' },
      className: ['login-field'],
    });

    fieldsContainer.append(emailInput, passwordInput);

    return fieldsContainer;
  };

  return {
    render() {
      component = new BaseComponent({
        tag: 'div',
        className: ['welcome-page'],
      });

      component.append(createImageWrapper(), createButtonWrapper());
      return component;
    },
    onMount() {
      console.log('NOTE: Login page mounted');
    },
    onDestroy() {
      console.log('NOTE: Login page destroyed');
    },
  };
}
