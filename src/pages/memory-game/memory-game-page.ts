import { type Page } from '@/core';
import type { TicketItem } from '@/types';
import { TicketPageController } from '@/features/ticket';

export function memoryGamePage(): Page {
  let controller: TicketPageController;

  return {
    render() {
      const items: TicketItem[] = [
        { type: 'quiz', id: 'quiz-1' },
        { type: 'quiz', id: 'quiz-2' },
        { type: 'quiz', id: 'quiz-3' },
        { type: 'memory-game', id: 'gc-001' },
        { type: 'memory-game', id: 'gc-002' },
        { type: 'memory-game', id: 'gc-003' },
      ];
      controller = new TicketPageController(items);
      return controller;
    },
    onMount() {
      console.log('Memory Game page mounted');
    },
    onDestroy() {
      console.log('Memory Game page destroyed');
    },
  };
}
