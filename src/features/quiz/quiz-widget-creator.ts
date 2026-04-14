import { BaseComponent } from '@/core';
import { widgetDataSource } from '@/api';
import { widgetEvents } from '@/constants';
import type { WidgetComponent, WidgetContext, WidgetEvent, WidgetReviewState, WidgetSubmitPayload } from '@/types';
import type { QuizWidget } from './types';
import { renderQuizWidget } from './quiz-widget-functional';

export class QuizWidgetCreator extends BaseComponent implements WidgetComponent {
  private readonly widgetId: string;
  private widgetAPI: ReturnType<typeof renderQuizWidget> | null = null;
  private completeHandler?: (payload?: WidgetSubmitPayload) => void;
  private readyHandler?: () => void;
  private reviewState?: WidgetReviewState;

  constructor(widgetId: string) {
    super({ tag: 'div', className: ['quiz-widget-container'] });
    this.widgetId = widgetId;
  }

  render(): BaseComponent {
    void this.loadWidget();
    return this;
  }

  on(event: WidgetEvent, handler: (payload?: WidgetSubmitPayload) => void): void {
    if (event === widgetEvents.Ready) this.readyHandler = handler;
    if (event === widgetEvents.Complete) this.completeHandler = handler;
  }

  setReviewState(state: WidgetReviewState): void {
    this.reviewState = state;

    if (this.widgetAPI) {
      this.widgetAPI.updateReviewState(state);
    }
  }

  destroy(): void {
    this.widgetAPI?.destroy();
    this.remove();
  }

  private async loadWidget(): Promise<void> {
    try {
      const widget = await widgetDataSource.getWidgetById<QuizWidget>('quiz', this.widgetId);

      const context: WidgetContext = {
        widgetId: this.widgetId,
        ...(this.reviewState ? { reviewState: this.reviewState } : {}),
        onReady: () => this.readyHandler?.(),
        onSubmit: (payload: WidgetSubmitPayload) => {
          this.completeHandler?.(payload);
        },
      };

      this.widgetAPI = renderQuizWidget(widget, context);

      this.element.innerHTML = '';
      this.element.append(this.widgetAPI.element);
    } catch (error) {
      console.error('Failed to load quiz widget', error);
      this.element.textContent = 'Error loading quiz';
    }
  }
}
