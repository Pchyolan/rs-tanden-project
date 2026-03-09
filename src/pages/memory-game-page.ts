import { type Page } from '@/core';
import { TicketPageController } from '@/pages/controllers';

export function memoryGamePage(): Page {
  let controller: TicketPageController;

  return {
    render() {
      controller = new TicketPageController(['gc-001', 'gc-002', 'gc-003']);
      return controller;
    },
    onMount() {
      console.log('NOTE: Memory Game page mounted');
    },
    onDestroy() {
      console.log('NOTE: Memory Game page destroyed');
    },
  };
}
