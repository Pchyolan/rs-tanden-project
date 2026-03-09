import { Observable } from '@/core';
import type { GameState, GameAction } from '../types';
import { gameStates, gameActions } from '../constants';

export class GameMachine {
  private state: GameState = gameStates.loading;
  public state$ = new Observable<GameState>(this.state);

  transition(action: GameAction): void {
    const previous = this.state;
    let next: GameState = previous;

    switch (previous) {
      case gameStates.loading: {
        if (action.type === gameActions.loadSuccess) next = gameStates.idle;
        else if (action.type === gameActions.loadError) next = gameStates.loading;
        break;
      }
      case gameStates.idle: {
        if (action.type === gameActions.submit) next = gameStates.submitting;
        break;
      }
      case gameStates.submitting: {
        if (action.type === gameActions.submitSuccess) next = gameStates.result;
        else if (action.type === gameActions.submitError) next = gameStates.result;
        break;
      }
      case gameStates.result: {
        if (action.type === gameActions.animationEnd) next = gameStates.idle;
        else if (action.type === gameActions.reset) next = gameStates.idle;
        break;
      }
      case gameStates.animation: {
        if (action.type === gameActions.animationEnd) next = gameStates.idle;
        break;
      }
    }

    if (next !== previous) {
      this.state = next;
      this.state$.set(this.state);
    }
  }

  getState(): GameState {
    return this.state;
  }
}
