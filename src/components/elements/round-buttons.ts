import { BaseComponent } from '@/core';

import sparkleImage from '@/assets/images/icons/sparkle.png';
import './round-buttons.scss';

export type RoundButtonProps = {
  iconSrc: string;
  alt: string;
  tooltip: string | BaseComponent;
  onClick?: () => void;
  disabled?: boolean;
  showSparkle?: boolean;
  tooltipPlacement?: 'top' | 'bottom';
};

export class RoundButton extends BaseComponent {
  private readonly wrapper: BaseComponent;
  private readonly tooltip: BaseComponent;
  private readonly sparkle?: BaseComponent<'img'>;

  private readonly onClick?: () => void;
  private isDisabled = false;

  constructor(props: RoundButtonProps) {
    super({ tag: 'div', className: ['icon-button'] });

    // Контейнер для всей кнопки
    const container = new BaseComponent({ tag: 'div', className: ['icon-button__container'] });

    // Кликабельная область
    this.wrapper = new BaseComponent({ tag: 'div', className: ['icon-button__wrapper'] });
    if (props.disabled) this.wrapper.element.classList.add('is-disabled');
    if (props.onClick && !props.disabled) {
      this.onClick = props.onClick;
      this.wrapper.addEventListener('click', this.handleClick);
    }

    // Иконка
    const icon = new BaseComponent<'img'>({
      tag: 'img',
      className: ['icon-button__icon'],
      attrs: { src: props.iconSrc, alt: props.alt },
    });
    this.wrapper.append(icon);

    // Sparkle
    if (props.showSparkle !== false) {
      this.sparkle = new BaseComponent<'img'>({
        tag: 'img',
        className: ['icon-button__sparkle'],
        attrs: { src: sparkleImage, alt: '' },
      });
    }

    // Tooltip
    this.tooltip = new BaseComponent({ tag: 'div', className: ['icon-button__tooltip'] });
    if (props.tooltipPlacement === 'bottom') {
      this.tooltip.element.classList.add('icon-button__tooltip--bottom');
    }

    if (typeof props.tooltip === 'string') {
      this.tooltip.element.textContent = props.tooltip;
    } else {
      this.tooltip.append(props.tooltip);
    }

    container.append(this.wrapper);
    if (this.sparkle) container.append(this.sparkle);
    container.append(this.tooltip);

    this.append(container);
  }

  private handleClick = (event: Event) => {
    if (this.isDisabled) {
      event.stopPropagation();
      return;
    }
    this.onClick?.();
  };

  public setDisabled(disabled: boolean): void {
    this.isDisabled = disabled;
    this.wrapper.element.classList.toggle('is-disabled', disabled);
  }
}
