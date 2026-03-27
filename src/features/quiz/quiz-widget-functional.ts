import type { QuizWidget, QuizAnswer } from './types';
import { widgetDataSource } from '@/api';

import './quiz-widget-creator.scss';

// Функции для построения DOM
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

function createTaskCard(...children: HTMLElement[]): HTMLDivElement {
  const element = document.createElement('div');
  element.className = 'task-card';
  children.forEach((child) => element.append(child));
  return element;
}

// Основная функция рендера – принимает данные виджета и контекст с колбэками
export function renderQuizWidget(
  widget: QuizWidget,
  context: {
    widgetId: string;
    onReady: () => void;
    onComplete: () => void;
  }
): { element: HTMLElement; destroy: () => void } {
  const container = document.createElement('div');
  container.className = 'quiz-widget';

  let selectedIndex: number | null = null;
  let submitButton: HTMLButtonElement | null = null;

  function buildUI() {
    container.innerHTML = '';

    const question = createQuestion(widget.payload.question);
    const answersBlock = createAnswersBlock();
    submitButton = createSubmitButton();

    widget.payload.options.forEach((option) => {
      const button = createButton(option.text);
      button.addEventListener('click', () => {
        selectedIndex = option.index;
        answersBlock.querySelectorAll('.answer-btn').forEach((button_) => button_.classList.remove('selected'));
        button.classList.add('selected');
        if (submitButton) submitButton.style.display = 'flex';
      });
      answersBlock.append(button);
    });

    submitButton.addEventListener('click', async () => {
      if (selectedIndex === null) return;
      const answer: QuizAnswer = { selectedIndex };
      try {
        const verdict = await widgetDataSource.submitAnswer('quiz', context.widgetId, answer);
        if (verdict.isCorrect) {
          context.onComplete();
        } else {
          alert(verdict.explanation || 'Wrong answer');
        }
      } catch (error) {
        console.error('Submit error', error);
      }
    });

    const moveBlock = createMoveBlock(submitButton);
    const taskCard = createTaskCard(question, answersBlock, moveBlock);
    container.append(taskCard);
  }

  buildUI();

  // сообщаем приложению, что виджет готов
  context.onReady();

  return {
    element: container,
    destroy() {
      container.remove();
    },
  };
}
