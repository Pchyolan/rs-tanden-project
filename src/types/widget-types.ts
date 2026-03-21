import { widgetEvents, widgetTypes } from '@/constants';
import type { MemoryGamePayload } from '@/features/memory-game/types';

export type WidgetType = (typeof widgetTypes)[keyof typeof widgetTypes];
export type WidgetEvent = (typeof widgetEvents)[keyof typeof widgetEvents];

// Базовый интерфейс виджета
export type BaseWidget = {
  id: string;
  type: WidgetType;
  version: number; // Для миграций схемы
  difficulty: 1 | 2 | 3; // Уровень сложности
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
  | (BaseWidget & { type: typeof widgetTypes.quiz; payload: unknown })
  | (BaseWidget & { type: typeof widgetTypes.trueFalse; payload: unknown })
  | (BaseWidget & { type: typeof widgetTypes.codeCompletion; payload: unknown })
  | (BaseWidget & { type: typeof widgetTypes.codeOrdering; payload: unknown })
  | (BaseWidget & { type: typeof widgetTypes.asyncSorter; payload: unknown })
  | (BaseWidget & { type: typeof widgetTypes.memoryGame; payload: MemoryGamePayload })
  | (BaseWidget & { type: typeof widgetTypes.stackBuilder; payload: unknown });
