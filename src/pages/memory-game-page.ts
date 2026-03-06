import { type Page } from '@/core';
import { MemoryGameWidgetCreator } from '@/features/memory-game/memory-game-widget-creator.ts';

export function memoryGamePage(): Page {
  let widget: MemoryGameWidgetCreator;

  return {
    render() {
      widget = new MemoryGameWidgetCreator('gc-001');
      return widget;
    },
    onMount() {
      console.log('NOTE: Memory Game page mounted');
    },
    onDestroy() {
      widget?.remove();
      console.log('NOTE: Memory Game page destroyed');
    },
  };
}
