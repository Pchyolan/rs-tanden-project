import { BaseComponent } from '@/core';
import { widgetDataSource } from '@/api';
import type { QuizAnswer, QuizWidget } from './types';

import './quiz-widget-creator.scss';

function createQuestion(text: string): HTMLDivElement {
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

function createSubmitButton(): HTMLButtonElement {
  const button = document.createElement('button');
  button.className = 'next-btn';
  button.textContent = 'Submit';
  button.style.display = 'none';
  return button;
}

function createMoveBlock(button: HTMLButtonElement): HTMLDivElement {
  const element = document.createElement('div');
  element.className = 'move-block';
  element.append(button);
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

function createScoreBlock(score: number): HTMLDivElement {
  const element = document.createElement('div');
  element.className = 'score-block';
  element.textContent = `Score: ${score}`;
  return element;
}

export class QuizWidgetCreator extends BaseComponent {
  private widgetIds: string[];
  private currentQuestionIndex = 0;
  private selectedIndex: number | null = null;
  private score = 0;

  constructor(widgetIds: string[]) {
    super({ tag: 'div', className: ['screen'] });
    this.widgetIds = widgetIds;

    void this.renderCurrentQuestion();
  }

  private clearSelectedButtons(container: HTMLDivElement): void {
    container.querySelectorAll('button').forEach((button) => {
      button.classList.remove('selected');
    });
  }

  private showFinishScreen(): void {
    this.element.innerHTML = '';

    const result = document.createElement('div');
    result.className = 'question-block';
    result.textContent = `Finished! Your score: ${this.score} / ${this.widgetIds.length}`;

    const card = createTaskCard(result);
    const topSpace = createTopSpace();
    const leftSpace = createSideSpace('side-space side-space-left');
    const rightSpace = createSideSpace('side-space side-space-right');
    const centerRow = createCenterRow(leftSpace, card, rightSpace);
    const layout = createGameLayout(topSpace, centerRow);

    this.element.append(layout);
  }

  private async handleSubmit(): Promise<void> {
    const currentWidgetId = this.widgetIds[this.currentQuestionIndex];

    if (!currentWidgetId || this.selectedIndex === null) return;

    const answer: QuizAnswer = {
      selectedIndex: this.selectedIndex,
    };

    try {
      const verdict = await widgetDataSource.submitAnswer('quiz', currentWidgetId, answer);

      if (verdict.isCorrect) {
        this.score += 1;
      }

      this.currentQuestionIndex += 1;
      this.selectedIndex = null;

      if (this.currentQuestionIndex >= this.widgetIds.length) {
        this.showFinishScreen();
        return;
      }

      await this.renderCurrentQuestion();
    } catch (error) {
      console.error('Failed to submit answer', error);
    }
  }

  private async renderCurrentQuestion(): Promise<void> {
    const currentWidgetId = this.widgetIds[this.currentQuestionIndex];

    if (!currentWidgetId) return;

    try {
      const widget = await widgetDataSource.getWidgetById<QuizWidget>('quiz', currentWidgetId);

      this.element.innerHTML = '';

      const scoreBlock = createScoreBlock(this.score);
      const question = createQuestion(widget.payload.question);
      const answersBlock = createAnswersBlock();
      const submitButton = createSubmitButton();

      widget.payload.options.forEach((option) => {
        const button = createButton(option.text);

        button.addEventListener('click', () => {
          this.selectedIndex = option.index;

          this.clearSelectedButtons(answersBlock);
          button.classList.add('selected');

          submitButton.style.display = 'flex';
        });

        answersBlock.append(button);
      });

      submitButton.addEventListener('click', () => {
        void this.handleSubmit();
      });

      const moveBlock = createMoveBlock(submitButton);
      const taskCard = createTaskCard(scoreBlock, question, answersBlock, moveBlock);

      const topSpace = createTopSpace();
      const leftSpace = createSideSpace('side-space side-space-left');
      const rightSpace = createSideSpace('side-space side-space-right');

      const centerRow = createCenterRow(leftSpace, taskCard, rightSpace);
      const layout = createGameLayout(topSpace, centerRow);

      this.element.append(layout);
    } catch (error) {
      console.error('Failed to load quiz widget', error);
    }
  }
}
