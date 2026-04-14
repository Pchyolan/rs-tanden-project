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
import type { CodeCompletionAnswer, CodeCompletionWidget } from './types';

import './code-completion-widget-creator.scss';

function createTitle(text: string): HTMLDivElement {
  const element = document.createElement('div');
  element.className = 'question-block';
  element.textContent = text;
  return element;
}

function createCodeBlock(text: string): HTMLDivElement {
  const element = document.createElement('div');
  element.className = 'code-block';
  element.textContent = text;
  return element;
}

function createAnswersBlock(): HTMLDivElement {
  const element = document.createElement('div');
  element.className = 'answers-block';
  return element;
}

function createInput(): HTMLInputElement {
  const input = document.createElement('input');
  input.className = 'answer-input';
  input.type = 'text';
  input.placeholder = 'Type answer here';
  return input;
}

function createButton(text: string): HTMLButtonElement {
  const button = document.createElement('button');
  button.className = 'next-btn';
  button.textContent = text;
  return button;
}

function createExplanation(text: string): HTMLDivElement {
  const element = document.createElement('div');
  element.className = 'explanation-block';
  element.textContent = text;
  return element;
}

function createTaskCard(...children: HTMLElement[]): HTMLDivElement {
  const element = document.createElement('div');
  element.className = 'task-card';
  children.forEach((child) => element.append(child));
  return element;
}

type CodeCompletionRenderAPI = {
  element: HTMLElement;
  updateReviewState: (state: WidgetReviewState) => void;
  destroy: () => void;
};

function renderCodeCompletionWidget(widget: CodeCompletionWidget, context: WidgetContext): CodeCompletionRenderAPI {
  const container = document.createElement('div');
  container.className = 'code-completion-widget';

  const title = createTitle('Fill in the blank');
  const codeBlock = createCodeBlock(widget.payload.code);
  const answersBlock = createAnswersBlock();
  const input = createInput();
  const submitButton = createButton('Submit');
  const explanation = createExplanation('');

  let submittedValue = '';
  let currentVerdict: Verdict | undefined = context.reviewState?.verdict;
  let isReviewMode = Boolean(context.reviewState?.isReviewMode);

  if (
    context.reviewState?.answer &&
    typeof context.reviewState.answer === 'object' &&
    context.reviewState.answer !== null &&
    'values' in context.reviewState.answer &&
    Array.isArray(context.reviewState.answer.values) &&
    typeof context.reviewState.answer.values[0] === 'string'
  ) {
    submittedValue = context.reviewState.answer.values[0];
    input.value = submittedValue;
  }

  function applyReviewState(): void {
    input.classList.remove('correct', 'wrong');
    explanation.textContent = '';

    if (isReviewMode) {
      input.disabled = true;
      submitButton.disabled = true;
    }

    if (!currentVerdict) return;

    explanation.textContent = currentVerdict.isCorrect ? '✅ Correct!' : '❌ Incorrect.';

    if (currentVerdict.isCorrect) {
      input.classList.add('correct');
    } else {
      input.classList.add('wrong');
    }
  }

  submitButton.addEventListener('click', async () => {
    if (isReviewMode) return;

    const value = input.value.trim();

    if (!value) return;

    const answer: CodeCompletionAnswer = {
      values: [value],
    };

    try {
      const verdict = await widgetDataSource.submitAnswer('code-completion', context.widgetId, answer);
      submittedValue = value;
      currentVerdict = verdict;

      input.disabled = true;
      submitButton.disabled = true;
      applyReviewState();

      context.onSubmit({
        answer,
        verdict,
        autoAdvance: false,
      });
    } catch (error) {
      console.error('Failed to submit code completion answer', error);
    }
  });

  answersBlock.append(input);

  const taskCard = createTaskCard(title, codeBlock, answersBlock, submitButton, explanation);
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
        'values' in state.answer &&
        Array.isArray(state.answer.values) &&
        typeof state.answer.values[0] === 'string'
      ) {
        submittedValue = state.answer.values[0];
        input.value = submittedValue;
      }

      applyReviewState();
    },
    destroy() {
      container.remove();
    },
  };
}

export class CodeCompletionWidgetCreator extends BaseComponent implements WidgetComponent {
  private readonly widgetId: string;
  private widgetAPI: CodeCompletionRenderAPI | null = null;
  private completeHandler?: (payload?: WidgetSubmitPayload) => void;
  private readyHandler?: () => void;
  private reviewState?: WidgetReviewState;

  constructor(widgetId: string) {
    super({ tag: 'div', className: ['code-completion-widget-container'] });
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
      const widget = await widgetDataSource.getWidgetById<CodeCompletionWidget>('code-completion', this.widgetId);

      const context: WidgetContext = {
        widgetId: this.widgetId,
        ...(this.reviewState ? { reviewState: this.reviewState } : {}),
        onReady: () => this.readyHandler?.(),
        onSubmit: (payload: WidgetSubmitPayload) => {
          this.completeHandler?.(payload);
        },
      };

      this.widgetAPI = renderCodeCompletionWidget(widget, context);

      this.element.innerHTML = '';
      this.element.append(this.widgetAPI.element);
    } catch (error) {
      console.error('Failed to load code completion widget', error);
      this.element.textContent = 'Error loading code completion widget';
    }
  }
}
