import { BaseComponent } from '@/core';
import { MemoryGameWidgetCreator } from '@/features/memory-game/memory-game-widget-creator.ts';

import './ticket-controller.scss';

export class TicketPageController extends BaseComponent {
  private currentIndex: number = 0;
  private currentWidget: MemoryGameWidgetCreator | null = null;
  private readonly widgetsList: string[];

  constructor(widgetsList: string[]) {
    super({ tag: 'div', className: ['ticket-page'] });
    this.widgetsList = widgetsList;
    this.loadNext();
  }

  /**
   * Загружает следующий виджет или показывает сообщение о завершении
   */
  private loadNext(): void {
    this.clear();

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
          this.loadNext();
        },
      });

      this.append(this.currentWidget);
    }
  }

  /**
   * Отображает сообщение о завершении билета
   */
  private showCompletionMessage(): void {
    const message = new BaseComponent({
      tag: 'div',
      text: 'Ticket completed! Well done!',
      className: ['ticket-complete'],
    });
    this.append(message);
  }

  /**
   * Уничтожает текущий виджет и очищает ресурсы
   */
  public override remove(): void {
    this.currentWidget?.remove();
    super.remove();
  }
}
