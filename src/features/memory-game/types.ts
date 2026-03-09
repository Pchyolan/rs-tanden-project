import type { BaseWidget } from '@/types';
import { gameActions, gameStates } from './constants';

// Структура объекта на графе
export type MemoryObject = {
  id: string;
  label: string;
  x: number;
  y: number;
};

// Связь между объектами
export type MemoryLink = {
  from: string;
  to: string;
  label?: string;
};

// Данные конкретного виджета Memory Game (без правильного ответа!)
export type MemoryGamePayload = {
  codeSnippet: string; // код, который выполнился
  highlightedLine?: number; // какая строка подсвечена
  objects: MemoryObject[];
  links: MemoryLink[];
  rootIds: string[]; // ID корневых объектов (например, ['global'])
  rootLinks: Array<{ from: string; to: string }>; // связи от корней к объектам
};

// Полный виджет Memory Game (наследует BaseWidget)
export type MemoryGameWidget = BaseWidget & {
  type: 'memory-game';
  payload: MemoryGamePayload;
};

// Ответ пользователя
export type MemoryGameAnswer = {
  markedAsGarbage: string[]; // ID объектов, помеченных как мусор
};

// Тип ошибок для Memory Game (используется в Verdict)
export type MemoryGameErrors = {
  missedGarbage: string[]; // объекты, которые надо было пометить, но не пометили
  wronglyMarked: string[]; // объекты, которые пометили ошибочно
};

export type GameState = (typeof gameStates)[keyof typeof gameStates];

export type GameAction =
  | { type: typeof gameActions.loadSuccess }
  | { type: typeof gameActions.loadError; error: string }
  | { type: typeof gameActions.submit }
  | { type: typeof gameActions.submitSuccess }
  | { type: typeof gameActions.submitError }
  | { type: typeof gameActions.animationEnd }
  | { type: typeof gameActions.reset };
