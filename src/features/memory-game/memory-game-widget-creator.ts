import { BaseComponent } from '@/core';
import { widgetDataSource } from '@/api';

import type { MemoryGameWidget } from '@/features/memory-game/types';
import { GameState } from '@/features/memory-game/core/game-state';
import { MemoryGameRenderer } from '@/features/memory-game/components/game-renderer';

export class MemoryGameWidgetCreator extends BaseComponent {
  private readonly widgetId: string;
  private gameState: GameState | null = null;
  private renderer: MemoryGameRenderer | null = null;
  private unsubscribe?: () => void;

  constructor(widgetId: string) {
    super({ tag: 'div', className: ['memory-game-widget'] });
    this.widgetId = widgetId;

    const loader = new BaseComponent({ tag: 'div', text: 'Loading...', className: ['loader'] });
    this.append(loader);

    this.loadWidget()
      .then(() => {
        loader.remove();
      })
      .catch((error) => {
        console.error('Failed to load widget:', error);
        loader.remove();
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
      });

      this.clear();
      this.append(this.renderer);

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

  public override remove(): void {
    this.unsubscribe?.();
    super.remove();
  }
}
