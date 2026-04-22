import { type Page } from '@/core';
import type { TicketItem } from '@/types';
import { TicketPageController } from '@/features/ticket';

export function memoryGamePage(): Page {
  let controller: TicketPageController;

  return {
    render() {
      const items: TicketItem[] = [
        { type: 'memory-game', id: 'gc-007' },
        { type: 'memory-game', id: 'gc-000' },
        { type: 'memory-game', id: 'gc-009' },
        { type: 'memory-game', id: 'gc-010' },
        { type: 'quiz', id: 'quiz-1' },
        { type: 'quiz', id: 'quiz-2' },
        { type: 'quiz', id: 'quiz-3' },
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
