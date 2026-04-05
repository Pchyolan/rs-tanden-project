import { type Page } from '@/core';
import type { TicketItem } from '@/types';
import { TicketPageController } from '@/features/ticket';

export function widgetEnginePage(): Page {
  let controller: TicketPageController;

  return {
    render() {
      const items: TicketItem[] = [
        { type: 'quiz', id: 'quiz-1' },
        { type: 'true-false', id: 'tf-1' },
        { type: 'quiz', id: 'quiz-2' },
        { type: 'true-false', id: 'tf-2' },
        { type: 'quiz', id: 'quiz-3' },
        { type: 'true-false', id: 'tf-3' },
        { type: 'true-false', id: 'tf-4' },
        { type: 'quiz', id: 'quiz-4' },
        { type: 'quiz', id: 'quiz-5' },
        { type: 'true-false', id: 'tf-5' },
        { type: 'true-false', id: 'tf-6' },
        { type: 'true-false', id: 'tf-7' },
        { type: 'quiz', id: 'quiz-6' },
        { type: 'quiz', id: 'quiz-7' },
        { type: 'true-false', id: 'tf-8' },
        { type: 'true-false', id: 'tf-9' },
        { type: 'quiz', id: 'quiz-8' },
        { type: 'true-false', id: 'tf-10' },
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
