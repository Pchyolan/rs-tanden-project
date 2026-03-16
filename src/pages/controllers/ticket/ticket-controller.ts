import { BaseComponent } from '@/core';
import { MemoryGameWidgetCreator } from '@/features/memory-game/memory-game-widget-creator.ts';
import { createLeftArrow, createRightArrow } from '@/utils/svg-icon.ts';

import './ticket-controller.scss';

export class TicketPageController extends BaseComponent {
  private currentIndex: number = 0;
  private currentWidgetWrapper: BaseComponent;
  private currentWidget: MemoryGameWidgetCreator | null = null;
  private readonly widgetsList: string[];
  private taskCircles: BaseComponent<'div'>[] = [];

  constructor(widgetsList: string[]) {
    super({ tag: 'div', className: ['ticket-page'] });

    this.widgetsList = widgetsList;

    const tasksWrapper = new BaseComponent({
      tag: 'div',
      className: ['task-wrapper'],
    });

    for (let i = 0; i < widgetsList.length; i++) {
      const circle = new BaseComponent({
        tag: 'div',
        className: ['task-circle'],
      });
      this.taskCircles.push(circle);
      tasksWrapper.append(circle);
    }

    const widgetWrapper = new BaseComponent({
      tag: 'div',
      className: ['widget-wrapper'],
    });

    this.currentWidgetWrapper = new BaseComponent({
      tag: 'div',
      className: ['current-wrapper'],
    });

    const leftArrow = createLeftArrow('arrow-left');
    const rightArrow = createRightArrow('arrow-right');

    widgetWrapper.element.append(leftArrow, this.currentWidgetWrapper.element, rightArrow);

    this.append(tasksWrapper, widgetWrapper);

    this.updateTaskCircles();
    this.loadNext();
  }

  private loadNext(): void {
    this.currentWidgetWrapper.clear();

    if (this.currentIndex >= this.widgetsList.length) {
      this.showCompletionMessage();
      return;
    }

    const widgetId = this.widgetsList[this.currentIndex];

    if (widgetId) {
      this.currentWidget = new MemoryGameWidgetCreator({
        widgetId,
        onComplete: () => {
          this.currentIndex++;
          this.updateTaskCircles();
          this.loadNext();
        },
      });

      this.currentWidgetWrapper.append(this.currentWidget);
    }
    this.updateTaskCircles();
  }

  private updateTaskCircles(): void {
    this.taskCircles.forEach((circle, index) => {
      circle.element.classList.toggle('active', index === this.currentIndex);
    });
  }

  private showCompletionMessage(): void {
    const message = new BaseComponent({
      tag: 'div',
      text: 'Ticket completed! Well done!',
      className: ['ticket-complete'],
    });
    this.currentWidgetWrapper.append(message);
  }

  public override remove(): void {
    this.currentWidget?.remove();
    super.remove();
  }
}
