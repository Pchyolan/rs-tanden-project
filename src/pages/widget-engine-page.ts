import { type Page } from '@/core';
import type { TicketItem } from '@/types';
import { TicketPageController } from '@/features/ticket';

export function widgetEnginePage(): Page {
  let controller: TicketPageController;

  return {
    render() {
      const items: TicketItem[] = [
        { type: 'quiz', id: 'quiz-1' },
        { type: 'quiz', id: 'quiz-2' },
        { type: 'quiz', id: 'quiz-3' },
      ];
      controller = new TicketPageController(items);
      return controller;
    },
    onMount() {
      console.log('Widget Engine page mounted');
    },
    onDestroy() {
      console.log('Widget Engine page destroyed');
    },
  };
}
