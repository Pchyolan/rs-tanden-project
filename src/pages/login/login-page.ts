import { BaseComponent, Router, SupabaseClient } from '@/core';
import type { Page } from '@/core';

import welcomeImageUrl from '@/assets/images/brains/welcome.png';
import welcomeAnimationUrl from '@/assets/video/welcome.webm';
import { createClipboardIcon, createLockIcon } from '@/utils/svg-icon';

import './login-page.scss';

type ButtonConfig = {
  text: string;
  icon: SVGElement;
  onClick?: () => void;
};

// eslint-disable-next-line max-lines-per-function
export function loginPage(router: Router): Page {
  let component: BaseComponent;
  let loginContainer: BaseComponent<'div'>;
  let registerContainer: BaseComponent<'div'>;
  let loginButton: BaseComponent<'button'>;
  let registerButton: BaseComponent<'button'>;

  // Элементы формы логина
  let loginEmailInput: BaseComponent<'input'>;
  let loginPasswordInput: BaseComponent<'input'>;
  let loginSubmitButton: BaseComponent<'button'>;
  let loginErrorMessage: BaseComponent<'div'>;

  // Элементы формы регистрации
  let regEmailInput: BaseComponent<'input'>;
  let regPasswordInput: BaseComponent<'input'>;
  let regConfirmPasswordInput: BaseComponent<'input'>;
  let regSubmitButton: BaseComponent<'button'>;
  let regErrorMessage: BaseComponent<'div'>;

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
   * Создаёт контейнер с формой входа
   */
  const createLoginFields = (): BaseComponent<'div'> => {
    const container = new BaseComponent({
      tag: 'div',
      className: ['login-fields-container'],
    });

    loginEmailInput = new BaseComponent({
      tag: 'input',
      attrs: { type: 'email', placeholder: 'Email', autocomplete: 'email' },
      className: ['login-field'],
    });

    loginPasswordInput = new BaseComponent({
      tag: 'input',
      attrs: { type: 'password', placeholder: 'Password', autocomplete: 'current-password' },
      className: ['login-field'],
    });

    loginErrorMessage = new BaseComponent({
      tag: 'div',
      className: ['error-message'],
    });

    const buttonsContainer = new BaseComponent({
      tag: 'div',
      className: ['login-buttons-container'],
    });

    loginSubmitButton = new BaseComponent({
      tag: 'button',
      text: 'Sign In',
      className: ['login-submit-btn'],
    });
    loginSubmitButton.addEventListener('click', handleSignIn);

    const cancelButton = new BaseComponent({
      tag: 'button',
      text: 'Cancel',
      className: ['login-cancel-btn'],
    });
    cancelButton.addEventListener('click', () => {
      hideAllForms();
      showMainButtons();
    });

    buttonsContainer.append(cancelButton, loginSubmitButton);
    container.append(loginEmailInput, loginPasswordInput, buttonsContainer, loginErrorMessage);
    return container;
  };

  /**
   * Создаёт контейнер с формой регистрации
   */
  const createRegisterFields = (): BaseComponent<'div'> => {
    const container = new BaseComponent({
      tag: 'div',
      className: ['register-fields-container'],
    });

    regEmailInput = new BaseComponent({
      tag: 'input',
      attrs: { type: 'email', placeholder: 'Email', autocomplete: 'email' },
      className: ['login-field'],
    });

    regPasswordInput = new BaseComponent({
      tag: 'input',
      attrs: { type: 'password', placeholder: 'Password', autocomplete: 'new-password' },
      className: ['login-field'],
    });

    regConfirmPasswordInput = new BaseComponent({
      tag: 'input',
      attrs: { type: 'password', placeholder: 'Confirm Password', autocomplete: 'new-password' },
      className: ['login-field'],
    });

    regErrorMessage = new BaseComponent({
      tag: 'div',
      className: ['error-message'],
    });

    regSubmitButton = new BaseComponent({
      tag: 'button',
      text: 'Register',
      className: ['login-submit-btn'],
    });
    regSubmitButton.addEventListener('click', handleSignUp);

    const buttonsContainer = new BaseComponent({
      tag: 'div',
      className: ['login-buttons-container'],
    });

    const cancelButton = new BaseComponent({
      tag: 'button',
      text: 'Cancel',
      className: ['login-cancel-btn'],
    });
    cancelButton.addEventListener('click', () => {
      hideAllForms();
      showMainButtons();
    });

    buttonsContainer.append(cancelButton, regSubmitButton);
    container.append(regEmailInput, regPasswordInput, regConfirmPasswordInput, buttonsContainer, regErrorMessage);
    return container;
  };

  /**
   * Обработчик входа
   */
  const handleSignIn = async () => {
    const email = loginEmailInput.element.value.trim();
    const password = loginPasswordInput.element.value;

    if (!email || !password) {
      showError(loginErrorMessage, 'Please fill in both fields');
      return;
    }

    setLoading(loginSubmitButton, true);

    const { error } = await SupabaseClient.auth.signInWithPassword({ email, password });

    if (error) {
      showError(loginErrorMessage, error.message);
      setLoading(loginSubmitButton, false);
    } else {
      // Успешный вход – перенаправляем на главную
      router.navigate('/dashboard');
    }
  };

  /**
   * Обработчик регистрации
   */
  const handleSignUp = async () => {
    const email = regEmailInput.element.value.trim();
    const password = regPasswordInput.element.value;
    const confirm = regConfirmPasswordInput.element.value;

    if (!email || !password || !confirm) {
      showError(regErrorMessage, 'Please fill in all fields');
      return;
    }

    if (password !== confirm) {
      showError(regErrorMessage, 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      showError(regErrorMessage, 'Password must be at least 6 characters');
      return;
    }

    setLoading(regSubmitButton, true);

    const { error } = await SupabaseClient.auth.signUp({
      email,
      password,
    });

    if (error) {
      showError(regErrorMessage, error.message);
      setLoading(regSubmitButton, false);
    } else {
      // После успешной регистрации можно либо сразу войти, либо показать сообщение о подтверждении email
      // Для упрощения – показываем успех и предлагаем войти
      regErrorMessage.element.textContent = 'Registration successful! Please check your email to confirm.';
      regErrorMessage.element.style.color = '#4caf50';
      setLoading(regSubmitButton, false);

      // Опционально: очистить поля
      regEmailInput.element.value = '';
      regPasswordInput.element.value = '';
      regConfirmPasswordInput.element.value = '';
    }
  };

  /**
   * Вспомогательная функция: показать ошибку
   */
  const showError = (messageComponent: BaseComponent<'div'>, message: string) => {
    messageComponent.element.textContent = message;
    messageComponent.element.style.color = '#f44336';

    setTimeout(() => {
      if (messageComponent.element.textContent === message) {
        messageComponent.element.textContent = '';
      }
    }, 5000);
  };

  /**
   * Установка состояния загрузки для кнопки
   */
  const setLoading = (button: BaseComponent<'button'>, isLoading: boolean) => {
    if (isLoading) {
      button.element.setAttribute('disabled', 'true');
      button.element.textContent = 'Loading...';
    } else {
      button.element.removeAttribute('disabled');
      button.element.textContent = button.element.classList.contains('login-submit-btn')
        ? button.element.textContent?.includes('Sign')
          ? 'Sign In'
          : 'Register'
        : 'Submit';
    }
  };

  /**
   * Переключение видимости форм
   */
  const showLoginForm = () => {
    hideAllForms();
    loginContainer.element.classList.add('show');
    hideMainButtons();

    loginEmailInput.element.focus();
  };

  const showRegisterForm = () => {
    hideAllForms();
    registerContainer.element.classList.add('show');
    hideMainButtons();

    regEmailInput.element.focus();
  };

  /**
   * Создаёт нижнюю часть страницы с кнопками и формами
   */
  const createButtonWrapper = (): BaseComponent<'div'> => {
    const wrapper = new BaseComponent({
      tag: 'div',
      className: ['welcome-page__wrapper'],
    });

    // Кнопки переключения форм
    registerButton = createButton({
      text: 'Register',
      icon: createClipboardIcon(),
      onClick: () => {
        showRegisterForm();
      },
    });

    loginButton = createButton({
      text: 'Log In',
      icon: createLockIcon(),
      onClick: () => {
        showLoginForm();
      },
    });

    // Контейнеры с формами
    loginContainer = createLoginFields();
    registerContainer = createRegisterFields();

    // Изначально обе формы скрыты
    loginContainer.element.classList.remove('show');
    registerContainer.element.classList.remove('show');

    wrapper.append(registerButton, loginButton, loginContainer, registerContainer);
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
   * Проверяет, авторизован ли пользователь, и перенаправляет если да
   */
  const checkAndRedirectIfLoggedIn = async () => {
    const { data } = await SupabaseClient.auth.getSession();
    if (data.session) {
      router.navigate('/dashboard');
    }
  };

  const hideAllForms = () => {
    loginContainer.element.classList.remove('show');
    registerContainer.element.classList.remove('show');

    // Очистка ошибок и полей (опционально)
    loginErrorMessage.element.textContent = '';
    regErrorMessage.element.textContent = '';
    loginEmailInput.element.value = '';
    loginPasswordInput.element.value = '';
    regEmailInput.element.value = '';
    regPasswordInput.element.value = '';
    regConfirmPasswordInput.element.value = '';
  };

  const showMainButtons = () => {
    loginButton.element.style.display = 'flex';
    registerButton.element.style.display = 'flex';
  };

  const hideMainButtons = () => {
    loginButton.element.style.display = 'none';
    registerButton.element.style.display = 'none';
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
    async onMount() {
      console.log('Login page mounted');
      await checkAndRedirectIfLoggedIn();
    },
    onDestroy() {
      console.log('Login page destroyed');
    },
  };
}
