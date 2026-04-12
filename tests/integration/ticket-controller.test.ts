import { describe, it, expect, vi, beforeEach } from 'vitest';

import { widgetDataSource } from '@/api';
import type { TicketItem } from '@/types';

import { TicketPageController } from '@/features/ticket';
import type { MemoryGameWidget } from '@/features/memory-game/types';

function noopPromise() {
  return Promise.resolve();
}

vi.mock('@/features/memory-game/components/graph-renderer', () => ({
  GraphRenderer: class {
    public element: HTMLDivElement;
    public updateMarkedObjects = vi.fn();
    public animateGarbageCollection = vi.fn(noopPromise);

    constructor(props: { onObjectClick: (id: string) => void }) {
      this.element = document.createElement('div');
      this.element.classList.add('memory-game__graph-container');

      // Добавляем фиктивный объект для клика
      const mockObject = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      mockObject.classList.add('graph-object');
      mockObject.dataset.id = 'mock-object';

      mockObject.addEventListener('click', () => {
        mockObject.classList.add('marked');
        props.onObjectClick('mock-object');
      });

      this.element.append(mockObject);
    }
  },
}));

vi.mock('@/api', () => ({
  widgetDataSource: {
    getWidgetById: vi.fn(),
    submitAnswer: vi.fn(),
  },
}));

describe('TicketPageController (integration)', () => {
  const mockWidget1: MemoryGameWidget = {
    id: 'widget-1',
    type: 'memory-game',
    version: 1,
    difficulty: 1,
    tags: [],
    payload: {
      codeSnippet: '// widget 1',
      objects: [{ id: 'a', label: 'A', x: 100, y: 100 }],
      links: [],
      rootIds: [],
      rootLinks: [],
    },
  };
  const mockWidget2: MemoryGameWidget = {
    id: 'widget-2',
    type: 'memory-game',
    version: 1,
    difficulty: 1,
    tags: [],
    payload: {
      codeSnippet: '// widget 2',
      objects: [{ id: 'b', label: 'B', x: 100, y: 100 }],
      links: [],
      rootIds: [],
      rootLinks: [],
    },
  };

  const tickets: TicketItem[] = [
    { type: 'memory-game', id: 'widget-1' },
    { type: 'memory-game', id: 'widget-2' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(widgetDataSource.getWidgetById).mockResolvedValueOnce(mockWidget1).mockResolvedValueOnce(mockWidget2);
    vi.mocked(widgetDataSource.submitAnswer).mockResolvedValue({
      isCorrect: true,
      streakUpdated: true,
      xpEarned: 10,
      explanation: 'Correct',
    });
  });

  it('renders first widget and shows correct counter', async () => {
    const controller = new TicketPageController(tickets);
    document.body.append(controller.element);

    // Ждём, пока первый виджет загрузится (исчезнет спиннер)
    await vi.waitFor(() => {
      expect(controller.element.querySelector('.memory-game__button')).not.toBeNull();
    });

    const counter = controller.element.querySelector('.task-counter');
    expect(counter?.textContent).toBe('Task 1 / 2');

    const segments = controller.element.querySelectorAll('.task-segment');
    expect(segments[0]?.classList.contains('active')).toBe(true);
    expect(segments[1]?.classList.contains('active')).toBe(false);
  });

  it('navigates to next widget after completing current', async () => {
    const controller = new TicketPageController(tickets);
    document.body.append(controller.element);

    await vi.waitFor(() => {
      expect(controller.element.querySelector('.memory-game__button')).not.toBeNull();
    });

    const object = controller.element.querySelector('.graph-object:not(.root)');
    expect(object).toBeTruthy();
    if (!object) return;

    object.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    await vi.waitFor(() => {
      expect(object.classList.contains('marked')).toBe(true);
    });

    const collectButton = controller.element.querySelector<HTMLButtonElement>('.memory-game__button');
    expect(collectButton).toBeTruthy();
    if (!collectButton) return;

    expect(collectButton.disabled).toBe(false);
    collectButton.click();

    // Ждём вызова API
    await vi.waitFor(() => {
      expect(widgetDataSource.submitAnswer).toHaveBeenCalledWith('memory-game', 'widget-1', {
        markedAsGarbage: ['mock-object'],
      });
    });

    // Ждём обновления счётчика
    await vi.waitFor(() => {
      const counter = controller.element.querySelector('.task-counter');
      expect(counter?.textContent).toBe('Task 2 / 2');
    });

    const codeSnippet = controller.element.querySelector('.memory-game__code code');
    expect(codeSnippet?.textContent).toContain('// widget 2');
  });

  it('shows completion message after last widget', async () => {
    const controller = new TicketPageController(tickets);
    document.body.append(controller.element);

    // Ждём первый виджет
    await vi.waitFor(() => expect(controller.element.querySelector('.memory-game__button')).not.toBeNull());

    // Завершаем первый
    const collectButton = controller.element.querySelector<HTMLButtonElement>('.memory-game__button');
    if (!collectButton) {
      throw new Error('Collect button not found');
    }
    collectButton.click();

    // Ждём второй виджет
    await vi.waitFor(() => {
      const counter = controller.element.querySelector('.task-counter');
      return counter?.textContent === 'Task 2 / 2';
    });

    const secondCollectButton = controller.element.querySelector<HTMLButtonElement>('.memory-game__button');
    if (!secondCollectButton) {
      throw new Error('Second collect button not found');
    }
    secondCollectButton.click();

    // Ждём сообщение о завершении
    await vi.waitFor(() => {
      const completion = controller.element.querySelector('.ticket-complete');
      expect(completion).not.toBeNull();
      expect(completion?.textContent).toContain('Ticket completed');
    });

    // Кнопки навигации должны быть disabled
    const leftButton = controller.element.querySelector<HTMLButtonElement>('.arrow-button:first-child');
    const rightButton = controller.element.querySelector<HTMLButtonElement>('.arrow-button:last-child');
    if (!leftButton || !rightButton) {
      throw new Error('Navigation buttons not found');
    }

    expect(leftButton.disabled).toBe(true);
    expect(rightButton.disabled).toBe(true);
  });
});
