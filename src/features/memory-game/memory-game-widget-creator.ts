import { BaseComponent } from '@/core';
import { WidgetHeader } from '@/components';
import { widgetDataSource } from '@/api';
import { SoundKey, SoundService } from '@/services/sound-service';

import type { MemoryGameWidget } from './types';
import { gameActions } from './constants';

import { GameState } from '@/features/memory-game/core/game-state';
import { GameMachine } from '@/features/memory-game/core/game-machine';
import { MemoryGameRenderer } from '@/features/memory-game/components/game-renderer';

import './memory-game-widget-creator.scss';

type MemoryGameWidgetCreatorProps = {
  widgetId: string;
  onComplete: () => void;
};

export class MemoryGameWidgetCreator extends BaseComponent {
  private readonly widgetId: string;

  private gameState: GameState | null = null;
  private gameMachine: GameMachine;

  private soundService = SoundService.getInstance();
  private renderer: MemoryGameRenderer | null = null;

  private unsubscribe?: () => void;
  private readonly onComplete?: () => void;

  constructor({ widgetId, onComplete }: MemoryGameWidgetCreatorProps) {
    super({ tag: 'div', className: ['memory-game-widget'] });
    this.widgetId = widgetId;
    this.gameMachine = new GameMachine();
    this.onComplete = onComplete;

    const spinnerContainer = new BaseComponent({ tag: 'div', className: ['spinner-container'] });
    const spinner = new BaseComponent({ tag: 'div', className: ['spinner'] });
    spinnerContainer.append(spinner);
    this.append(spinnerContainer);

    this.loadWidget()
      .then(() => {
        spinnerContainer.remove();
      })
      .catch((error) => {
        spinnerContainer.remove();
        console.error('Failed to load widget:', error);
        const errorMessage = new BaseComponent({
          tag: 'div',
          text: 'Failed to load widget. Please try again.',
          className: ['error-message'],
        });
        this.append(errorMessage);
      });
  }

  private async loadWidget() {
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
    } catch (error) {
      console.log('Failed to load memory game widget', error);
      this.gameMachine.transition({ type: gameActions.loadError, error: String(error) });
    }
  }

  private subscribeToMarkedGarbage(): void {
    if (this.gameState) {
      this.unsubscribe = this.gameState.markedGarbage$.subscribe((markedSet) => {
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

  private handleCollect = async () => {
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
        if (this.onComplete) this.onComplete();
      } else {
        this.gameMachine.transition({ type: gameActions.submitError });
        this.showNotification(
          verdict.explanation || '❌ Some objects are still reachable or incorrectly marked.',
          'error'
        );
        await this.renderer?.playAnimation();
        this.gameMachine.transition({ type: gameActions.animationEnd });
        if (this.onComplete) this.onComplete();
      }
    } catch {
      this.gameMachine.transition({ type: gameActions.submitError });
      this.showNotification('Network error. Please try again.', 'error');
    }
  };

  private showNotification(message: string, type: 'success' | 'error' = 'success') {
    console.log(`[${type}] ${message}`);
  }

  public override remove(): void {
    this.unsubscribe?.();
    super.remove();
  }
}
