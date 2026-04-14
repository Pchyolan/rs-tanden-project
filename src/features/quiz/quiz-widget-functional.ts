import { widgetDataSource } from '@/api';
import type { Verdict, WidgetContext, WidgetReviewState } from '@/types';
import type { QuizWidget, QuizAnswer } from './types';

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

function createTaskCard(...children: HTMLElement[]): HTMLDivElement {
  const element = document.createElement('div');
  element.className = 'task-card';
  children.forEach((child) => element.append(child));
  return element;
}

type QuizRenderAPI = {
  element: HTMLElement;
  updateReviewState: (state: WidgetReviewState) => void;
  destroy: () => void;
};

export function renderQuizWidget(widget: QuizWidget, context: WidgetContext): QuizRenderAPI {
  const container = document.createElement('div');
  container.className = 'quiz-widget';

  let selectedIndex: number | null = null;
  let currentVerdict: Verdict | undefined;
  let isReviewMode = Boolean(context.reviewState?.isReviewMode);

  const question = createQuestion(widget.payload.question);
  const answersBlock = createAnswersBlock();
  const buttons = new Map<number, HTMLButtonElement>();

  function applyDefaultSelection(): void {
    answersBlock.querySelectorAll('.answer-btn').forEach((button) => {
      button.classList.remove('selected', 'correct', 'wrong');
    });

    if (selectedIndex !== null) {
      const button = buttons.get(selectedIndex);
      button?.classList.add('selected');
    }
  }

  function applyReviewState(): void {
    applyDefaultSelection();

    if (!isReviewMode || selectedIndex === null || !currentVerdict) return;

    const selectedButton = buttons.get(selectedIndex);
    const correctButton = buttons.get(widget.correctAnswer);

    if (currentVerdict.isCorrect) {
      selectedButton?.classList.add('correct');
    } else {
      selectedButton?.classList.add('wrong');
      correctButton?.classList.add('correct');
    }
  }

  async function handleAnswer(optionIndex: number): Promise<void> {
    if (isReviewMode) return;

    selectedIndex = optionIndex;
    applyDefaultSelection();

    const answer: QuizAnswer = { selectedIndex: optionIndex };

    try {
      const verdict = await widgetDataSource.submitAnswer('quiz', context.widgetId, answer);
      currentVerdict = verdict;

      context.onSubmit({
        answer,
        verdict,
        autoAdvance: true,
      });
    } catch (error) {
      console.error('Submit error', error);
    }
  }

  widget.payload.options.forEach((option) => {
    const button = createButton(option.text);

    if (
      context.reviewState?.answer &&
      typeof context.reviewState.answer === 'object' &&
      context.reviewState.answer !== null &&
      'selectedIndex' in context.reviewState.answer &&
      typeof context.reviewState.answer.selectedIndex === 'number'
    ) {
      selectedIndex = context.reviewState.answer.selectedIndex;
    }

    button.addEventListener('click', () => {
      void handleAnswer(option.index);
    });

    buttons.set(option.index, button);
    answersBlock.append(button);
  });

  if (context.reviewState?.verdict) {
    currentVerdict = context.reviewState.verdict;
  }

  applyReviewState();

  const taskCard = createTaskCard(question, answersBlock);
  container.append(taskCard);

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
        'selectedIndex' in state.answer &&
        typeof state.answer.selectedIndex === 'number'
      ) {
        selectedIndex = state.answer.selectedIndex;
      }

      applyReviewState();
    },
    destroy() {
      container.remove();
    },
  };
}
