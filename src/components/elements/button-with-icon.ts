import { BaseComponent } from '@/core';
import './button-with-icon.scss';

type ButtonConfig = {
  text: string;
  icon: SVGElement;
  className?: string;
  onClick?: () => void;
};

export function createButtonWithIcon(config: ButtonConfig): BaseComponent<'button'> {
  const button = new BaseComponent({
    tag: 'button',
    className: config.className ? ['button-with-image__button', config.className] : ['button-with-image__button'],
  });

  const buttonContent = new BaseComponent({
    tag: 'span',
    className: ['button-with-image__button-content'],
  });

  const iconWrapper = new BaseComponent({
    tag: 'span',
    className: ['button-with-image__button-image'],
  });
  iconWrapper.element.append(config.icon);

  const buttonSpan = new BaseComponent({
    tag: 'span',
    text: config.text,
  });

  buttonContent.append(iconWrapper, buttonSpan);
  button.append(buttonContent);

  if (config.onClick) {
    button.addEventListener('click', config.onClick);
  }

  return button;
}
