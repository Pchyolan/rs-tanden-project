import type { WidgetType } from '@/types';
import { widgetTypes } from '@/constants';

export const widgetTitles: Record<WidgetType, string> = {
  [widgetTypes.quiz]: 'Quiz',
  [widgetTypes.trueFalse]: 'True / False',
  [widgetTypes.codeCompletion]: 'Code Completion',
  [widgetTypes.codeOrdering]: 'Code Ordering',
  [widgetTypes.asyncSorter]: 'Async Sorter',
  [widgetTypes.memoryGame]: 'Memory Game',
  [widgetTypes.stackBuilder]: 'Stack Builder',
};
