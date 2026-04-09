import { BaseComponent } from '@/core';
import { type Difficulty, difficultyMap, type WidgetType } from '@/types';
import { createDot } from '@/utils/svg-icon';

import { language$ } from '@/store/language-store';
import { translations } from '@/i18n';

import './widget-header.scss';
import type { DifficultyKey } from '@/types/widget-types.ts';

type WidgetHeaderProps = {
  widgetType: WidgetType;
  difficulty: Difficulty;
};

export class WidgetHeader extends BaseComponent {
  private readonly titleElement: BaseComponent<'h2'>;
  private readonly unsubscribe?: () => void;

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

    Object.values(difficultyMap).map((difficultyName) => {
      const dot = createDot(`dot-${difficultyName}`, 8);

      const dotWrapper = new BaseComponent({
        tag: 'div',
        className: ['widget-header__dot'],
      });
      dotWrapper.element.append(dot);

      dotsContainer.append(dotWrapper);
    });

    this.titleElement = new BaseComponent({
      tag: 'h2',
      text: translations[language$.value][widgetType] ?? widgetType,
      className: ['widget-header__title'],
    });

    leftGroup.append(dotsContainer, this.titleElement);

    const difficultyKey: DifficultyKey = difficultyMap[difficulty];
    const difficultyText = translations[language$.value][difficultyKey];
    const difficultyClass = `widget-header__difficulty-${difficultyKey}`;

    const difficultyElement = new BaseComponent({
      tag: 'span',
      text: difficultyText,
      className: ['widget-header__difficulty', difficultyClass],
    });

    this.append(leftGroup, difficultyElement);

    this.unsubscribe = language$.subscribe(() => {
      this.titleElement.element.textContent = translations[language$.value][widgetType];
      difficultyElement.element.textContent = translations[language$.value][difficultyKey];
    });
  }

  public override remove(): void {
    this.unsubscribe?.();
    super.remove();
  }
}
