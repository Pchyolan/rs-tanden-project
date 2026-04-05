import type { LanguageType } from '@/types';

export type MemoryGameTranslationKey =
  | 'widgetText'
  | 'hintFirstLine'
  | 'hintSecondLine'
  | 'hintThirdLine'
  | 'selectedLine'
  | 'collectButton'
  | 'submittingButton'
  | 'infoTooltip'
  | 'clueTooltip'
  | 'refreshTooltip';

export const memoryGamePageTranslations: Record<LanguageType, Record<MemoryGameTranslationKey, string>> = {
  en: {
    widgetText: 'Memory Game',
    hintFirstLine:
      'Here you see JavaScript code that has just been executed. The last executed line is highlighted by color.',
    hintSecondLine:
      'Your task is to analyze the code and click on objects in the memory graph that become unreachable after this code runs (= garbage).',
    hintThirdLine:
      'Click on objects to mark them as garbage. Note: root objects (like the global object) cannot be collected.',
    selectedLine: 'Selected garbage:',
    collectButton: 'Collect',
    submittingButton: 'Submitting...',
    infoTooltip: 'What is it?',
    clueTooltip: 'Give me a clue',
    refreshTooltip: 'Refresh objects selection',
  },
  ru: {
    widgetText: 'Игра "Сборщик мусора"',
    hintFirstLine:
      'На экране вы видите JavaScript-код, который только что выполнился. Последняя выполненная строка выделена цветом',
    hintSecondLine:
      'Ваша задача — проанализировать код и кликнуть по объектам на графе памяти, которые становятся недоступными после выполнения этого кода (= мусором).',
    hintThirdLine:
      'Кликните по объектам, чтобы пометить их как мусор. Обратите внимание: корневые объекты (например, глобальный объект) не могут быть собраны.',
    selectedLine: 'Помечено как мусор:',
    collectButton: 'Собрать',
    submittingButton: 'Отправка...',
    infoTooltip: 'В чём задача?',
    clueTooltip: 'Получить подсказку',
    refreshTooltip: 'Сбросить помеченные объекты',
  },
};
