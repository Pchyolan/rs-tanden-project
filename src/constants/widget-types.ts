export const widgetTypes = {
  quiz: 'quiz',
  trueFalse: 'true-false',
  codeCompletion: 'code-completion',
  codeOrdering: 'code-ordering',
  asyncSorter: 'async-sorter',
  memoryGame: 'memory-game',
  stackBuilder: 'stack-builder',
} as const;

export const widgetEvents = {
  Ready: 'ready',
  Complete: 'complete',
} as const;
