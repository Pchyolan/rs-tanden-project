import { BaseComponent } from '@/core';
import { widgetDataSource } from '@/api';
import { widgetEvents } from '@/constants';
import type { WidgetComponent, WidgetEvent } from '@/types';
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

export class CodeCompletionWidgetCreator extends BaseComponent implements WidgetComponent {
  private readonly widgetId: string;
  private completeHandler?: () => void;
  private readyHandler?: () => void;

  constructor(widgetId: string) {
    super({ tag: 'div', className: ['code-completion-widget-container'] });
    this.widgetId = widgetId;
  }

  render(): BaseComponent {
    void this.loadWidget();
    return this;
  }

  on(event: WidgetEvent, handler: () => void): void {
    if (event === widgetEvents.Ready) this.readyHandler = handler;
    if (event === widgetEvents.Complete) this.completeHandler = handler;
  }

  destroy(): void {
    this.remove();
  }

  private async loadWidget(): Promise<void> {
    try {
      const widget = await widgetDataSource.getWidgetById<CodeCompletionWidget>('code-completion', this.widgetId);

      this.element.innerHTML = '';

      const title = createTitle('Fill in the blank');
      const codeBlock = createCodeBlock(widget.payload.code);
      const answersBlock = createAnswersBlock();
      const input = createInput();
      const submitButton = createButton('Submit');

      answersBlock.append(input);

      submitButton.addEventListener('click', async () => {
        const value = input.value.trim();

        if (!value) return;

        const answer: CodeCompletionAnswer = {
          values: [value],
        };

        try {
          const verdict = await widgetDataSource.submitAnswer('code-completion', this.widgetId, answer);

          const explanation = createExplanation(verdict.isCorrect ? '✅ Correct!' : '❌ Incorrect. Try another task.');

          submitButton.disabled = true;
          input.disabled = true;

          this.element.append(explanation);

          setTimeout(() => {
            this.completeHandler?.();
          }, 1200);
        } catch (error) {
          console.error('Failed to submit code completion answer', error);
        }
      });

      const taskCard = createTaskCard(title, codeBlock, answersBlock, submitButton);
      this.element.append(taskCard);

      this.readyHandler?.();
    } catch (error) {
      console.error('Failed to load code completion widget', error);
      this.element.textContent = 'Error loading code completion widget';
    }
  }
}
