import type { WidgetType, WidgetComponent } from '@/types';
import { MemoryGameWidgetCreator } from '@/features/memory-game/memory-game-widget-creator';
import { QuizWidgetCreator } from '@/features/quiz/quiz-widget-creator';

export class WidgetFactory {
  create(type: WidgetType, id: string): WidgetComponent {
    switch (type) {
      case 'memory-game': {
        return new MemoryGameWidgetCreator(id);
      }
      case 'quiz': {
        return new QuizWidgetCreator(id);
      }
      default: {
        throw new Error(`Unsupported widget type: ${type}`);
      }
    }
  }
}
