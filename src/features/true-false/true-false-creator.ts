import { BaseComponent } from '@/core';
import { widgetDataSource } from '@/api';
import { widgetEvents } from '@/constants';
import type {
  Verdict,
  WidgetComponent,
  WidgetContext,
  WidgetEvent,
  WidgetReviewState,
  WidgetSubmitPayload,
} from '@/types';
import type { TrueFalseAnswer, TrueFalseWidget } from './types';

import './true-false-widget-creator.scss';

function createStatement(text: string): HTMLDivElement {
  const element = document.createElement('div');
  element.className = 'question-block';
  element.textContent = text;
  return element;
}

function createAnswersBlock(): HTMLDivElement {
  const element = document.createElement('div');
  element.className = 'answers-block';
  return element;
}

function createButton(text: string): HTMLButtonElement {
  const button = document.createElement('button');
  button.className = 'answer-btn';
  button.textContent = text;
  return button;
}

function createTaskCard(...children: HTMLElement[]): HTMLDivElement {
  const element = document.createElement('div');
  element.className = 'task-card';
  children.forEach((child) => element.append(child));
  return element;
}

type TrueFalseRenderAPI = {
  element: HTMLElement;
  updateReviewState: (state: WidgetReviewState) => void;
  destroy: () => void;
};

function renderTrueFalseWidget(widget: TrueFalseWidget, context: WidgetContext): TrueFalseRenderAPI {
  const container = document.createElement('div');
  container.className = 'true-false-widget';

  const statement = createStatement(widget.payload.statement);
  const answersBlock = createAnswersBlock();

  const trueButton = createButton('True');
  const falseButton = createButton('False');

  let selectedValue: boolean | null = null;
  let currentVerdict: Verdict | undefined = context.reviewState?.verdict;
  let isReviewMode = Boolean(context.reviewState?.isReviewMode);

  if (
    context.reviewState?.answer &&
    typeof context.reviewState.answer === 'object' &&
    context.reviewState.answer !== null &&
    'value' in context.reviewState.answer &&
    typeof context.reviewState.answer.value === 'boolean'
  ) {
    selectedValue = context.reviewState.answer.value;
  }

  function applyBaseState(): void {
    trueButton.classList.remove('selected', 'correct', 'wrong');
    falseButton.classList.remove('selected', 'correct', 'wrong');

    if (selectedValue === true) {
      trueButton.classList.add('selected');
    }

    if (selectedValue === false) {
      falseButton.classList.add('selected');
    }
  }

  function applyReviewState(): void {
    applyBaseState();

    if (!isReviewMode || selectedValue === null || !currentVerdict) return;

    const selectedButton = selectedValue ? trueButton : falseButton;
    const correctButton = widget.correctAnswer ? trueButton : falseButton;

    if (currentVerdict.isCorrect) {
      selectedButton.classList.add('correct');
    } else {
      selectedButton.classList.add('wrong');
      correctButton.classList.add('correct');
    }
  }

  async function handleAnswer(value: boolean): Promise<void> {
    if (isReviewMode) return;

    selectedValue = value;
    applyBaseState();

    const answer: TrueFalseAnswer = { value };

    try {
      const verdict = await widgetDataSource.submitAnswer('true-false', context.widgetId, answer);
      currentVerdict = verdict;

      context.onSubmit({
        answer,
        verdict,
        autoAdvance: true,
      });
    } catch (error) {
      console.error('Failed to submit true/false answer', error);
    }
  }

  trueButton.addEventListener('click', () => {
    void handleAnswer(true);
  });

  falseButton.addEventListener('click', () => {
    void handleAnswer(false);
  });

  answersBlock.append(trueButton, falseButton);

  const taskCard = createTaskCard(statement, answersBlock);
  container.append(taskCard);

  applyReviewState();
  context.onReady();

  return {
    element: container,
    updateReviewState(state: WidgetReviewState) {
      isReviewMode = state.isReviewMode;
      currentVerdict = state.verdict;

      if (
        state.answer &&
        typeof state.answer === 'object' &&
        state.answer !== null &&
        'value' in state.answer &&
        typeof state.answer.value === 'boolean'
      ) {
        selectedValue = state.answer.value;
      }

      applyReviewState();
    },
    destroy() {
      container.remove();
    },
  };
}

export class TrueFalseWidgetCreator extends BaseComponent implements WidgetComponent {
  private readonly widgetId: string;
  private widgetAPI: TrueFalseRenderAPI | null = null;
  private completeHandler?: (payload?: WidgetSubmitPayload) => void;
  private readyHandler?: () => void;
  private reviewState?: WidgetReviewState;

  constructor(widgetId: string) {
    super({ tag: 'div', className: ['true-false-widget-container'] });
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
      const widget = await widgetDataSource.getWidgetById<TrueFalseWidget>('true-false', this.widgetId);

      const context: WidgetContext = {
        widgetId: this.widgetId,
        ...(this.reviewState ? { reviewState: this.reviewState } : {}),
        onReady: () => this.readyHandler?.(),
        onSubmit: (payload: WidgetSubmitPayload) => {
          this.completeHandler?.(payload);
        },
      };

      this.widgetAPI = renderTrueFalseWidget(widget, context);

      this.element.innerHTML = '';
      this.element.append(this.widgetAPI.element);
    } catch (error) {
      console.error('Failed to load true-false widget', error);
      this.element.textContent = 'Error loading true/false widget';
    }
  }
}
