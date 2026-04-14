import { BaseComponent } from '@/core';
import { widgetEvents, widgetTypes } from '@/constants';
import type { MemoryGamePayload } from '@/features/memory-game/types';
import type { QuizPayload, QuizAnswer } from '@/features/quiz/types';
import type { TrueFalsePayload, TrueFalseAnswer } from '@/features/true-false/types';
import type { CodeCompletionPayload, CodeCompletionAnswer } from '@/features/code-completion/types';
import type { Verdict } from './verdict-types';

export type WidgetType = (typeof widgetTypes)[keyof typeof widgetTypes];

// Уровень сложности
export type Difficulty = 1 | 2 | 3;
export type DifficultyKey = 'easy' | 'medium' | 'hard';

export const difficultyMap: Record<Difficulty, DifficultyKey> = {
  1: 'easy',
  2: 'medium',
  3: 'hard',
};

// Базовый интерфейс виджета
export type BaseWidget = {
  id: string;
  type: WidgetType;
  version: number; // Для миграций схемы
  difficulty: Difficulty;
  tags: string[];
};

// Это будет итоговая версия, когда всё будет готово
// export type Widget =
//   | (BaseWidget & { typeof widgetTypes.quiz; payload: QuizPayload })
//   | (BaseWidget & { typeof widgetTypes.trueFalse; payload: TrueFalsePayload })
//   | (BaseWidget & { typeof widgetTypes.codeCompletion; payload: CodeCompletionPayload })
//   | (BaseWidget & { typeof widgetTypes.codeOrdering; payload: CodeOrderingPayload })
//   | (BaseWidget & { typeof widgetTypes.asyncSorter; payload: AsyncSorterPayload })
//   | (BaseWidget & { typeof widgetTypes.memoryGame; payload: MemoryGamePayload })
//   | (BaseWidget & { typeof widgetTypes.stackBuilder; payload: StackBuilderPayload });

// Временный вариант: все payload имеют тип unknown
// При реализации конкретного виджета необходимо заменить unknown на соответствующий тип и добавить сюда импорт
export type Widget =
  | (BaseWidget & { type: typeof widgetTypes.quiz; payload: QuizPayload })
  | (BaseWidget & { type: typeof widgetTypes.trueFalse; payload: TrueFalsePayload })
  | (BaseWidget & { type: typeof widgetTypes.codeCompletion; payload: CodeCompletionPayload })
  | (BaseWidget & { type: typeof widgetTypes.codeOrdering; payload: unknown })
  | (BaseWidget & { type: typeof widgetTypes.asyncSorter; payload: unknown })
  | (BaseWidget & { type: typeof widgetTypes.memoryGame; payload: MemoryGamePayload })
  | (BaseWidget & { type: typeof widgetTypes.stackBuilder; payload: unknown });

export type WidgetEvent = (typeof widgetEvents)[keyof typeof widgetEvents];

export type WidgetUserAnswer = QuizAnswer | TrueFalseAnswer | CodeCompletionAnswer | unknown;

export type WidgetReviewState = {
  answer?: WidgetUserAnswer;
  verdict?: Verdict;
  isSubmitted: boolean;
  isReviewMode: boolean;
};

export type WidgetSubmitPayload = {
  answer: WidgetUserAnswer;
  verdict: Verdict;
  autoAdvance?: boolean;
};

export type WidgetComponent = {
  /**
   * Возвращает корневой элемент компонента для встраивания в DOM
   * После вызова этого метода компонент начинает загрузку данных и отрисовку
   */
  render(): BaseComponent;

  /**
   * Подписывается на событие завершения виджета
   * Виджет вызывает это событие, когда пользователь успешно прошёл задание
   */
  on(event: WidgetEvent, handler: () => void): void;

  setReviewState?(state: WidgetReviewState): void;

  /**
   * Уничтожает компонент, очищает ресурсы
   */
  destroy(): void;
};

export type WidgetContext = {
  widgetId: string;
  reviewState?: WidgetReviewState;
  onReady: () => void;
  onSubmit: (payload: WidgetSubmitPayload) => void;
};
