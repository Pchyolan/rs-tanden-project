import { WIDGET_TYPES } from '@/constants';

export type WidgetType = (typeof WIDGET_TYPES)[keyof typeof WIDGET_TYPES];

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
//   | (BaseWidget & { typeof WIDGET_TYPES.QUIZ; payload: QuizPayload })
//   | (BaseWidget & { typeof WIDGET_TYPES.TRUE_FALSE; payload: TrueFalsePayload })
//   | (BaseWidget & { typeof WIDGET_TYPES.CODE_COMPLETION; payload: CodeCompletionPayload })
//   | (BaseWidget & { typeof WIDGET_TYPES.CODE_ORDERING; payload: CodeOrderingPayload })
//   | (BaseWidget & { typeof WIDGET_TYPES.ASYNC_SORTER; payload: AsyncSorterPayload })
//   | (BaseWidget & { typeof WIDGET_TYPES.MEMORY_GAME; payload: MemoryGamePayload })
//   | (BaseWidget & { typeof WIDGET_TYPES.STACK_BUILDER; payload: StackBuilderPayload });

// Временный вариант: все payload имеют тип unknown
// При реализации конкретного виджета необходимо заменить unknown на соответствующий тип и добавить сюда импорт
export type Widget =
  | (BaseWidget & { type: typeof WIDGET_TYPES.QUIZ; payload: unknown })
  | (BaseWidget & { type: typeof WIDGET_TYPES.TRUE_FALSE; payload: unknown })
  | (BaseWidget & { type: typeof WIDGET_TYPES.CODE_COMPLETION; payload: unknown })
  | (BaseWidget & { type: typeof WIDGET_TYPES.CODE_ORDERING; payload: unknown })
  | (BaseWidget & { type: typeof WIDGET_TYPES.ASYNC_SORTER; payload: unknown })
  | (BaseWidget & { type: typeof WIDGET_TYPES.MEMORY_GAME; payload: unknown })
  | (BaseWidget & { type: typeof WIDGET_TYPES.STACK_BUILDER; payload: unknown });
