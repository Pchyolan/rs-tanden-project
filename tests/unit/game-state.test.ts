import { describe, it, expect, beforeEach } from 'vitest';
import { GameState } from '@/features/memory-game/core/game-state';
import type { MemoryGamePayload } from '@/features/memory-game/types';

const mockPayload: MemoryGamePayload = {
  codeSnippet: 'test',
  objects: [],
  links: [],
  rootIds: ['global', 'window'],
  rootLinks: [],
};

describe('GameState', () => {
  let gameState: GameState;

  beforeEach(() => {
    gameState = new GameState(mockPayload);
  });

  it('Initial marked set is empty', () => {
    expect(gameState.getMarked()).toEqual([]);
    expect(gameState.markedGarbage$.value.size).toBe(0);
  });

  it('Toggles mark for non-root object', () => {
    gameState.toggleMark('obj1');
    expect(gameState.getMarked()).toEqual(['obj1']);

    gameState.toggleMark('obj1');
    expect(gameState.getMarked()).toEqual([]);
  });

  it('Does not allow marking root object', () => {
    gameState.toggleMark('global');
    expect(gameState.getMarked()).toEqual([]);
  });

  it('Reset clears marked set', () => {
    gameState.toggleMark('obj1');
    gameState.toggleMark('obj2');
    gameState.reset();
    expect(gameState.getMarked()).toEqual([]);
  });

  it('isRoot returns true for root ids', () => {
    expect(gameState.isRoot('global')).toBe(true);
    expect(gameState.isRoot('obj1')).toBe(false);
  });
});
