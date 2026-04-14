import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryGameRenderer } from '@/features/memory-game/components';
import { Observable } from '@/core';
import { gameStates } from '@/features/memory-game/constants';
import type { GameState, MemoryGamePayload } from '@/features/memory-game/types';

function noopPromise() {
  return Promise.resolve();
}

vi.mock('@/features/memory-game/components/graph-renderer', () => {
  class MockGraphRenderer {
    element: HTMLDivElement;
    updateMarkedObjects = vi.fn();
    animateGarbageCollection = vi.fn(noopPromise);

    constructor() {
      this.element = document.createElement('div');
      this.element.classList.add('memory-game__graph-container');
    }
  }
  return { GraphRenderer: MockGraphRenderer };
});

vi.mock('@/services/sound-service', () => ({
  SoundService: { getInstance: vi.fn(() => ({ playSound: vi.fn() })) },
  SoundKey: {},
}));

vi.mock('@/store/language-store', () => ({
  language$: { value: 'en', subscribe: vi.fn() },
}));

vi.mock('@/i18n', () => ({
  translations: {
    en: {
      hintFirstLine: 'Hint 1',
      hintSecondLine: 'Hint 2',
      hintThirdLine: 'Hint 3',
      selectedLine: 'Selected:',
      collectButton: 'Collect',
      submittingButton: 'Submitting',
      clueTooltip: 'Clue',
      refreshTooltip: 'Refresh',
    },
  },
}));

vi.mock('prismjs', () => ({ highlightElement: vi.fn() }));

describe('MemoryGameRenderer', () => {
  const mockPayload: MemoryGamePayload = {
    codeSnippet: 'console.log("test")',
    highlightedLine: 2,
    objects: [],
    links: [],
    rootIds: [],
    rootLinks: [],
  };
  let renderer: MemoryGameRenderer;
  let gameState$: Observable<GameState>;
  let onCollectMock: () => void;

  beforeEach(() => {
    gameState$ = new Observable<GameState>(gameStates.loading);
    onCollectMock = vi.fn();
    renderer = new MemoryGameRenderer({
      payload: mockPayload,
      gameState$,
      onObjectClick: vi.fn(),
      onReset: vi.fn(),
      onCollect: onCollectMock,
    });
  });

  it('renders all required UI blocks', () => {
    expect(renderer.element.querySelector('.memory-game__code-panel')).toBeDefined();
    expect(renderer.element.querySelector('.memory-game__graph-panel')).toBeDefined();
    expect(renderer.element.querySelector('.memory-game__button')).toBeDefined();
    expect(renderer.element.querySelector('.memory-game__hint-container')).toBeDefined();
  });

  it('displays code snippet with line-highlight class', () => {
    const pre = renderer.element.querySelector<HTMLElement>('pre.memory-game__code');
    expect(pre).toBeDefined();
    expect(pre?.dataset.line).toBe('2');
    expect(pre?.classList.contains('line-highlight')).toBe(true);
  });

  it('updates marked counter when updateMarkedObjects called', () => {
    const counterSpan = renderer.element.querySelector('.memory-game__text--green');
    expect(counterSpan?.textContent).toBe('0');
    renderer.updateMarkedObjects(new Set(['a', 'b']));
    expect(counterSpan?.textContent).toBe('2');
  });

  it('disables UI when state is not idle', () => {
    gameState$.set(gameStates.submitting);
    const button = renderer.element.querySelector<HTMLButtonElement>('.memory-game__button');
    expect(button).toBeDefined();

    if (button) {
      expect(button.disabled).toBe(true);
      expect(button.textContent).toBe('Submitting');

      const graphContainer = renderer.element.querySelector('.memory-game__graph-container');
      expect(graphContainer?.classList.contains('is-disabled')).toBe(true);
    }
  });

  it('enables UI when state becomes idle', () => {
    gameState$.set(gameStates.idle);
    const button = renderer.element.querySelector<HTMLButtonElement>('.memory-game__button');
    expect(button).toBeDefined();

    if (button) {
      expect(button.disabled).toBe(false);
      expect(button.textContent).toBe('Collect');

      const graphContainer = renderer.element.querySelector('.memory-game__graph-container');
      expect(graphContainer?.classList.contains('is-disabled')).toBe(false);
    }
  });

  it('calls onCollect when collect button clicked', () => {
    gameState$.set(gameStates.idle);
    const button = renderer.element.querySelector<HTMLButtonElement>('.memory-game__button');
    expect(button).toBeDefined();

    if (button) {
      button.click();
      expect(onCollectMock).toHaveBeenCalledTimes(1);
    }
  });
});
