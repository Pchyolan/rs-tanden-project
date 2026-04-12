import { describe, it, expect, beforeEach } from 'vitest';
import { GameMachine } from '@/features/memory-game/core/game-machine.ts';
import { gameActions, gameStates } from '@/features/memory-game/constants.ts';

describe('GameMachine', () => {
  let machine: GameMachine;

  beforeEach(() => {
    machine = new GameMachine();
    expect(machine.getState()).toBe(gameStates.loading);
  });

  it('Transition from loading to idle on loadSuccess', () => {
    machine.transition({ type: gameActions.loadSuccess });
    expect(machine.getState()).toBe(gameStates.idle);
  });

  it('Stay in loading on loadError', () => {
    machine.transition({ type: gameActions.loadError, error: 'test error' });
    expect(machine.getState()).toBe(gameStates.loading);
  });

  it('Transition from idle to submitting on submit', () => {
    machine.transition({ type: gameActions.loadSuccess });
    machine.transition({ type: gameActions.submit });
    expect(machine.getState()).toBe(gameStates.submitting);
  });

  it('Transition from submitting to result on submitSuccess', () => {
    machine.transition({ type: gameActions.loadSuccess });
    machine.transition({ type: gameActions.submit });
    machine.transition({ type: gameActions.submitSuccess });
    expect(machine.getState()).toBe(gameStates.result);
  });

  it('Transition from result to idle on animationEnd', () => {
    machine.transition({ type: gameActions.loadSuccess });
    machine.transition({ type: gameActions.submit });
    machine.transition({ type: gameActions.submitSuccess });
    machine.transition({ type: gameActions.animationEnd });
    expect(machine.getState()).toBe(gameStates.idle);
  });

  it('Allow reset from result to idle', () => {
    machine.transition({ type: gameActions.loadSuccess });
    machine.transition({ type: gameActions.submit });
    machine.transition({ type: gameActions.submitSuccess });
    machine.transition({ type: gameActions.reset });
    expect(machine.getState()).toBe(gameStates.idle);
  });

  it('Ignore invalid transitions', () => {
    machine.transition({ type: gameActions.submit });
    expect(machine.getState()).toBe(gameStates.loading);
  });
});
