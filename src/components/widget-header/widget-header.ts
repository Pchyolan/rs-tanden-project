import { BaseComponent } from '@/core';
import { widgetTitles } from '@/constants';
import { type Difficulty, type WidgetType, difficultyMap } from '@/types';
import { createDot } from '@/utils/svg-icon';

import './widget-header.scss';

type WidgetHeaderProps = {
  widgetType: WidgetType;
  difficulty: Difficulty;
};

export class WidgetHeader extends BaseComponent {
  constructor({ widgetType, difficulty }: WidgetHeaderProps) {
    super({
      tag: 'div',
      className: ['widget-header'],
    });

    const leftGroup = new BaseComponent({
      tag: 'div',
      className: ['widget-header__left'],
    });

    const dotsContainer = new BaseComponent({
      tag: 'div',
      className: ['widget-header__dots'],
    });

    const dotClasses = ['dot-blue', 'dot-orange', 'dot-green'];
    dotClasses.forEach((className) => {
      const dot = createDot(className, 8);
      const dotWrapper = new BaseComponent({
        tag: 'div',
        className: ['widget-header__dot'],
      });
      dotWrapper.element.append(dot);
      dotsContainer.append(dotWrapper);
    });

    const title = widgetTitles[widgetType] || widgetType;
    const titleElement = new BaseComponent({
      tag: 'h2',
      text: title,
      className: ['widget-header__title'],
    });

    leftGroup.append(dotsContainer, titleElement);

    const difficultyText = difficultyMap[difficulty];
    const difficultyClass = `widget-header__difficulty-${difficultyText.toLowerCase()}`;
    const difficultyElement = new BaseComponent({
      tag: 'span',
      text: difficultyMap[difficulty],
      className: ['widget-header__difficulty', difficultyClass],
    });

    this.append(leftGroup, difficultyElement);
  }
}
