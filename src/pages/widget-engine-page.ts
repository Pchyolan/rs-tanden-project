import { BaseComponent, type Page } from '@/core';
import { routes } from '@/constants';
import { TicketPageController } from '@/features/ticket';
import { loadCurrentSession } from '@/features/training-session/session-storage';

function navigateTo(path: string): void {
  globalThis.history.pushState({}, '', path);
  globalThis.dispatchEvent(new PopStateEvent('popstate'));
}

export function widgetEnginePage(): Page {
  let controller: TicketPageController | null = null;

  return {
    render() {
      const session = loadCurrentSession();

      if (!session || session.tasks.length === 0) {
        const fallback = new BaseComponent({
          tag: 'div',
          text: 'No tasks found',
        });

        globalThis.setTimeout(() => {
          navigateTo(routes.home);
        }, 0);

        return fallback;
      }

      // ❗ УБРАЛИ startIndex — он у тебя не поддерживается в типах
      controller = new TicketPageController(session.tasks);

      return controller;
    },

    onMount() {
      console.log('Widget Engine mounted');
    },

    onDestroy() {
      controller?.remove();
    },
  };
}
