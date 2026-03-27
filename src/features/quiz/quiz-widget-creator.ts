import { BaseComponent } from '@/core';
import { widgetDataSource } from '@/api';
import { widgetEvents } from '@/constants';
import type { WidgetComponent, WidgetEvent } from '@/types';
import type { QuizWidget } from './types';
import { renderQuizWidget } from './quiz-widget-functional';

export class QuizWidgetCreator extends BaseComponent implements WidgetComponent {
  private readonly widgetId: string;
  private widgetAPI: ReturnType<typeof renderQuizWidget> | null = null;
  private completeHandler?: () => void;
  private readyHandler?: () => void;

  constructor(widgetId: string) {
    super({ tag: 'div', className: ['quiz-widget-container'] });
    this.widgetId = widgetId;
  }

  render(): BaseComponent {
    this.loadWidget();
    return this;
  }

  on(event: WidgetEvent, handler: () => void): void {
    if (event === widgetEvents.Ready) this.readyHandler = handler;
    if (event === widgetEvents.Complete) this.completeHandler = handler;
  }

  destroy(): void {
    this.widgetAPI?.destroy();
    this.remove();
  }

  private async loadWidget(): Promise<void> {
    try {
      const widget = await widgetDataSource.getWidgetById<QuizWidget>('quiz', this.widgetId);
      this.widgetAPI = renderQuizWidget(widget, {
        widgetId: this.widgetId,
        onReady: () => this.readyHandler?.(),
        onComplete: () => this.completeHandler?.(),
      });

      this.element.innerHTML = '';
      this.element.append(this.widgetAPI.element);
    } catch (error) {
      console.error('Failed to load quiz widget', error);
      this.element.textContent = 'Error loading quiz';
    }
  }
}
