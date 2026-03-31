import { BaseComponent } from '@/core';
import { WidgetHeader } from '@/components';
import { widgetDataSource } from '@/api';

import type { MemoryGameWidget } from './types';
import type { WidgetComponent, WidgetEvent } from '@/types';

import { gameActions } from './constants';
import { widgetEvents } from '@/constants';

import { SoundKey, SoundService } from '@/services/sound-service';

import { GameState } from '@/features/memory-game/core/game-state';
import { GameMachine } from '@/features/memory-game/core/game-machine';
import { MemoryGameRenderer } from '@/features/memory-game/components/game-renderer';

export class MemoryGameWidgetCreator extends BaseComponent implements WidgetComponent {
  private readonly widgetId: string;

  private gameState: GameState | null = null;
  private gameMachine: GameMachine;

  private soundService = SoundService.getInstance();
  private renderer: MemoryGameRenderer | null = null;

  private completeHandler?: () => void;
  private readyHandler?: () => void;
  private unsubscribeFromGameState?: () => void;

  constructor(widgetId: string) {
    super({ tag: 'div', className: ['ticket-widget'] });
    this.widgetId = widgetId;
    this.gameMachine = new GameMachine();
  }

  render(): BaseComponent {
    this.loadWidget();
    return this;
  }

  on(event: WidgetEvent, handler: () => void): void {
    if (event === widgetEvents.Ready) this.readyHandler = handler;
    if (event === widgetEvents.Complete) this.completeHandler = handler;
  }

  destroy(): void {
    this.unsubscribeFromGameState?.();
    this.remove();
  }

  private async loadWidget(): Promise<void> {
    try {
      const widget = await widgetDataSource.getWidgetById<MemoryGameWidget>('memory-game', this.widgetId);

      this.gameState = new GameState(widget.payload);

      const header = new WidgetHeader({ widgetType: widget.type, difficulty: widget.difficulty });

      this.renderer = new MemoryGameRenderer({
        payload: widget.payload,
        gameState$: this.gameMachine.state$,
        onObjectClick: (objectId) => {
          if (this.gameState) {
            this.gameState.toggleMark(objectId);
          }
        },
        onReset: this.handleReset,
        onCollect: this.handleCollect,
      });

      this.clear();
      this.append(header, this.renderer);
      this.renderer.highlightCode();

      this.gameMachine.transition({ type: gameActions.loadSuccess });

      this.subscribeToMarkedGarbage();

      this.readyHandler?.();
    } catch (error) {
      console.log('Failed to load memory game widget', error);
      this.gameMachine.transition({ type: gameActions.loadError, error: String(error) });
    }
  }

  private subscribeToMarkedGarbage(): void {
    if (this.gameState) {
      this.unsubscribeFromGameState = this.gameState.markedGarbage$.subscribe((markedSet) => {
        if (this.renderer) {
          this.renderer.updateMarkedObjects(markedSet);
        }
      });
    }
  }

  private handleReset = () => {
    if (this.gameState) {
      this.soundService.playSound(SoundKey.refresh);
      this.gameState.reset();
    }
  };

  private handleCollect = async (): Promise<void> => {
    if (!this.gameState) return;

    this.gameMachine.transition({ type: gameActions.submit });
    const answer = { markedAsGarbage: this.gameState.getMarked() };

    try {
      const verdict = await widgetDataSource.submitAnswer('memory-game', this.widgetId, answer);

      if (verdict.isCorrect) {
        this.gameMachine.transition({ type: gameActions.submitSuccess });
        this.showNotification('✅ Perfect! All garbage collected.', 'success');

        await this.renderer?.playAnimation();
        this.gameMachine.transition({ type: gameActions.animationEnd });
        this.completeHandler?.();
      } else {
        this.gameMachine.transition({ type: gameActions.submitError });
        this.showNotification(
          verdict.explanation || '❌ Some objects are still reachable or incorrectly marked.',
          'error'
        );
        await this.renderer?.playAnimation();
        this.gameMachine.transition({ type: gameActions.animationEnd });
      }
    } catch {
      this.gameMachine.transition({ type: gameActions.submitError });
      this.showNotification('Network error. Please try again.', 'error');
    }
  };

  private showNotification(message: string, type: 'success' | 'error' = 'success'): void {
    console.log(`[${type}] ${message}`);
  }
}
