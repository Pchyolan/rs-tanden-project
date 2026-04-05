import { BaseComponent } from '@/core';
import { widgetDataSource } from '@/api';
import { widgetEvents } from '@/constants';
import type { WidgetComponent, WidgetEvent } from '@/types';
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

export class TrueFalseWidgetCreator extends BaseComponent implements WidgetComponent {
  private readonly widgetId: string;
  private completeHandler?: () => void;
  private readyHandler?: () => void;
  private isAnswered = false;

  constructor(widgetId: string) {
    super({ tag: 'div', className: ['true-false-widget-container'] });
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
      const widget = await widgetDataSource.getWidgetById<TrueFalseWidget>('true-false', this.widgetId);

      this.element.innerHTML = '';

      const statement = createStatement(widget.payload.statement);
      const answersBlock = createAnswersBlock();

      const trueButton = createButton('True');
      const falseButton = createButton('False');

      trueButton.addEventListener('click', () => {
        void this.handleAnswer(true, widget, answersBlock);
      });

      falseButton.addEventListener('click', () => {
        void this.handleAnswer(false, widget, answersBlock);
      });

      answersBlock.append(trueButton, falseButton);

      const taskCard = createTaskCard(statement, answersBlock);
      this.element.append(taskCard);

      this.readyHandler?.();
    } catch (error) {
      console.error('Failed to load true-false widget', error);
      this.element.textContent = 'Error loading true/false widget';
    }
  }

  private async handleAnswer(value: boolean, widget: TrueFalseWidget, answersBlock: HTMLDivElement): Promise<void> {
    if (this.isAnswered) return;
    this.isAnswered = true;

    const answer: TrueFalseAnswer = { value };

    try {
      const verdict = await widgetDataSource.submitAnswer('true-false', this.widgetId, answer);

      const explanation = createExplanation(
        `${verdict.isCorrect ? '✅ Correct!' : '❌ Incorrect.'} ${widget.payload.explanation}`
      );

      answersBlock.append(explanation);

      setTimeout(() => {
        this.completeHandler?.();
      }, 1200);
    } catch (error) {
      console.error('Failed to submit true/false answer', error);
    }
  }
}
