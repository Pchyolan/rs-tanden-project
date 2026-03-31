import { BaseComponent } from '@/core';
import { widgetEvents, widgetTypes } from '@/constants';
import type { MemoryGamePayload } from '@/features/memory-game/types';
import type { QuizPayload } from '@/features/quiz/types';

export type WidgetType = (typeof widgetTypes)[keyof typeof widgetTypes];

// Уровень сложности
export type Difficulty = 1 | 2 | 3;

export const difficultyMap = {
  1: 'Easy',
  2: 'Medium',
  3: 'Hard',
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
  | (BaseWidget & { type: typeof widgetTypes.trueFalse; payload: unknown })
  | (BaseWidget & { type: typeof widgetTypes.codeCompletion; payload: unknown })
  | (BaseWidget & { type: typeof widgetTypes.codeOrdering; payload: unknown })
  | (BaseWidget & { type: typeof widgetTypes.asyncSorter; payload: unknown })
  | (BaseWidget & { type: typeof widgetTypes.memoryGame; payload: MemoryGamePayload })
  | (BaseWidget & { type: typeof widgetTypes.stackBuilder; payload: unknown });

export type WidgetEvent = (typeof widgetEvents)[keyof typeof widgetEvents];

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

  /**
   * Уничтожает компонент, очищает ресурсы
   */
  destroy(): void;
};

export type WidgetContext = {
  widgetId: string;
  onReady: () => void;
  onComplete: () => void;
};
