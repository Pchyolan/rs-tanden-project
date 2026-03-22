import { BaseComponent } from '@/core';
import { widgetTitles } from '@/constants';
import { type Difficulty, type WidgetType, difficultyMap } from '@/types';

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

    const title = widgetTitles[widgetType] || widgetType;
    const titleElement = new BaseComponent({
      tag: 'h2',
      text: title,
      className: ['widget-header__title'],
    });

    const difficultyElement = new BaseComponent({
      tag: 'span',
      text: difficultyMap[difficulty],
      className: ['widget-header__difficulty'],
    });

    this.append(titleElement, difficultyElement);
  }
}
