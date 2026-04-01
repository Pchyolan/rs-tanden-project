import { BaseComponent } from '@/core';
import { widgetDataSource } from '@/api';
import type { TrueFalseAnswer, TrueFalseWidget } from './types';

import './true-false-widget-creator.scss';

type TrueFalseWidgetCreatorProps = {
  widgetId: string;
  onComplete?: () => void;
};

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

function createCenterRow(...children: HTMLElement[]): HTMLDivElement {
  const element = document.createElement('div');
  element.className = 'center-row';
  children.forEach((child) => element.append(child));
  return element;
}

function createGameLayout(...children: HTMLElement[]): HTMLDivElement {
  const element = document.createElement('div');
  element.className = 'game-layout';
  children.forEach((child) => element.append(child));
  return element;
}

function createTopSpace(): HTMLDivElement {
  const element = document.createElement('div');
  element.className = 'top-space';
  return element;
}

function createSideSpace(className: string): HTMLDivElement {
  const element = document.createElement('div');
  element.className = className;
  return element;
}

export class TrueFalseWidgetCreator extends BaseComponent {
  private readonly widgetId: string;
  private readonly onComplete: (() => void) | undefined;
  private isAnswered = false;

  constructor({ widgetId, onComplete }: TrueFalseWidgetCreatorProps) {
    super({ tag: 'div', className: ['screen'] });

    this.widgetId = widgetId;
    this.onComplete = onComplete;

    void this.renderWidget();
  }

  // оп
  private async handleAnswer(value: boolean, widget: TrueFalseWidget): Promise<void> {
    if (this.isAnswered) return;
    this.isAnswered = true;

    const answer: TrueFalseAnswer = { value };

    try {
      const verdict = await widgetDataSource.submitAnswer('true-false', this.widgetId, answer);

      const explanationText = widget.payload.explanation;
      const explanation = createExplanation(
        `${verdict.isCorrect ? '✅ Correct!' : '❌ Incorrect.'} ${explanationText}`
      );

      this.element.append(explanation);

      setTimeout(() => {
        this.onComplete?.();
      }, 1200);
    } catch (error) {
      console.error('Failed to submit true/false answer', error);
    }
  }

  private async renderWidget(): Promise<void> {
    try {
      const widget = await widgetDataSource.getWidgetById<TrueFalseWidget>('true-false', this.widgetId);

      this.element.innerHTML = '';

      const statement = createStatement(widget.payload.statement);
      const answersBlock = createAnswersBlock();

      const trueButton = createButton('True');
      const falseButton = createButton('False');

      trueButton.addEventListener('click', () => {
        void this.handleAnswer(true, widget);
      });

      falseButton.addEventListener('click', () => {
        void this.handleAnswer(false, widget);
      });

      answersBlock.append(trueButton, falseButton);

      const taskCard = createTaskCard(statement, answersBlock);

      const topSpace = createTopSpace();
      const leftSpace = createSideSpace('side-space side-space-left');
      const rightSpace = createSideSpace('side-space side-space-right');

      const centerRow = createCenterRow(leftSpace, taskCard, rightSpace);
      const layout = createGameLayout(topSpace, centerRow);

      this.element.append(layout);
    } catch (error) {
      console.error('Failed to load true-false widget', error);
    }
  }
}
