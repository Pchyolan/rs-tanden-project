import { BaseComponent } from '@/core';
import { widgetDataSource } from '@/api';

import type { MemoryGameWidget } from '@/features/memory-game/types';
import { GameState } from '@/features/memory-game/core/game-state';
import { MemoryGameRenderer } from '@/features/memory-game/components/game-renderer';

import './memory-game-widget-creator.scss';

export class MemoryGameWidgetCreator extends BaseComponent {
  private readonly widgetId: string;
  private gameState: GameState | null = null;
  private renderer: MemoryGameRenderer | null = null;
  private unsubscribe?: () => void;

  constructor(widgetId: string) {
    super({ tag: 'div', className: ['memory-game-widget'] });
    this.widgetId = widgetId;

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

      this.renderer = new MemoryGameRenderer({
        payload: widget.payload,
        onObjectClick: (objectId) => {
          if (this.gameState) {
            this.gameState.toggleMark(objectId);
          }
        },
        onReset: this.handleReset,
        onCollect: this.handleCollect,
      });

      this.clear();
      this.append(this.renderer);
      this.renderer.highlightCode();

      this.subscribeToMarkedGarbage();
    } catch (error) {
      console.log('Failed to load memory game widget', error);
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
      this.gameState.reset();
    }
  };

  private handleCollect = async () => {
    if (!this.gameState) return;

    const answer = { markedAsGarbage: this.gameState.getMarked() };
    try {
      const verdict = await widgetDataSource.submitAnswer('memory-game', this.widgetId, answer);
      if (verdict.isCorrect) {
        this.showNotification('✅ Perfect! All garbage collected.', 'success');
      } else {
        this.showNotification(
          verdict.explanation || '❌ Some objects are still reachable or incorrectly marked.',
          'error'
        );
      }
    } catch {
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
