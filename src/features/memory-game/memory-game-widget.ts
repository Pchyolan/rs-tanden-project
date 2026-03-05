import { MemoryGameRenderer } from '@/features/memory-game/components/game-renderer';
import { GameState } from '@/features/memory-game/core/game-state';
import { BaseComponent } from '@/core';

export class MemoryGameWidget extends BaseComponent {
  private readonly gameState: GameState;
  private readonly renderer: MemoryGameRenderer;

  constructor() {
    super({ tag: 'div', className: ['memory-game-widget'] });

    const widget = {
      id: 'gc-001',
      type: 'memory-game',
      version: 1,
      difficulty: 2,
      tags: ['garbage-collection', 'memory', 'reachability'],
      payload: {
        codeSnippet: 'let a = {val: 1};\nlet b = a;\na = null;',
        highlightedLine: 3,
        objects: [
          { id: 'var-a', label: 'Variable a', x: 100, y: 150 },
          { id: 'var-b', label: 'Variable b', x: 250, y: 150 },
          { id: 'obj-1', label: 'Object {val:1}', x: 350, y: 250 },
        ],
        links: [{ from: 'var-b', to: 'obj-1', label: 'ref' }],
        rootIds: ['global'],
        rootLinks: [
          { from: 'global', to: 'var-a' },
          { from: 'global', to: 'var-b' },
        ],
      },
    };

    this.gameState = new GameState(widget.payload);
    this.renderer = new MemoryGameRenderer({ gameState: this.gameState, onReset: this.handleReset });

    this.append(this.renderer);
  }

  private handleReset = () => {
    this.gameState.reset();
  };
}
