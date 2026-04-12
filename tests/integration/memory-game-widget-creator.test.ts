import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryGameWidgetCreator } from '@/features/memory-game/memory-game-widget-creator';
import { widgetDataSource } from '@/api';
import type { MemoryGameWidget } from '@/features/memory-game/types';

vi.mock('@/api', () => ({
  widgetDataSource: {
    getWidgetById: vi.fn(),
    submitAnswer: vi.fn(),
  },
}));

describe('MemoryGameWidgetCreator (integration)', () => {
  const mockWidget: MemoryGameWidget = {
    id: 'test-widget',
    type: 'memory-game',
    version: 1,
    difficulty: 1,
    tags: [],
    payload: {
      codeSnippet: 'console.log("test")',
      highlightedLine: 2,
      objects: [
        { id: 'obj1', label: 'Object 1', x: 100, y: 100 },
        { id: 'obj2', label: 'Object 2', x: 300, y: 100 },
      ],
      links: [{ from: 'obj1', to: 'obj2' }],
      rootIds: ['root'],
      rootLinks: [{ from: 'root', to: 'obj1' }],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(widgetDataSource.getWidgetById).mockResolvedValue(mockWidget);
  });

  it('renders widget and allows marking objects', async () => {
    const creator = new MemoryGameWidgetCreator('test-widget');
    creator.render();
    document.body.append(creator.element);

    // Ждём, пока виджет загрузится (появится кнопка Collect)
    await vi.waitFor(() => {
      expect(creator.element.querySelector('.memory-game__button')).not.toBeNull();
    });

    // Кликаем по первому объекту (не root)
    const object = creator.element.querySelector<HTMLElement>('.graph-object:not(.root)');
    expect(object).toBeDefined();
    if (!object) {
      throw new Error('First object does not exist');
    }

    object.click();

    const counter = creator.element.querySelector('.memory-game__text--green');
    expect(counter?.textContent).toBe('1');
    expect(object.classList.contains('marked')).toBe(true);
  });

  it('submits answer and triggers complete on correct', async () => {
    vi.mocked(widgetDataSource.submitAnswer).mockResolvedValue({ isCorrect: true, streakUpdated: false });
    const completeHandler = vi.fn();
    const creator = new MemoryGameWidgetCreator('test-widget');
    creator.on('complete', completeHandler);
    creator.render();
    document.body.append(creator.element);

    await vi.waitFor(() => expect(creator.element.querySelector('.memory-game__button')).not.toBeNull());

    // Отмечаем объект (обязательно, иначе markedAsGarbage будет пустым, а правильный ответ может требовать отметить что-то)
    const object = creator.element.querySelector<HTMLElement>('.graph-object:not(.root)');
    expect(object).toBeDefined();
    if (!object) {
      throw new Error('Object does not exist');
    }

    object.click();

    const collectButton = creator.element.querySelector<HTMLButtonElement>('.memory-game__button');
    expect(collectButton).toBeDefined();
    if (!collectButton) {
      throw new Error('Collect button does not exist');
    }
    collectButton.click();

    await vi.waitFor(() => expect(completeHandler).toHaveBeenCalled());
    expect(vi.mocked(widgetDataSource.submitAnswer)).toHaveBeenCalledWith('memory-game', 'test-widget', {
      markedAsGarbage: ['obj1'],
    });
  });
});
