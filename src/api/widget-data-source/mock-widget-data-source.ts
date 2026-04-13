import type { Widget, WidgetType, Verdict } from '@/types';
import type { WidgetDataSource } from './types';

import { randomDelay } from '@/utils/delays';

import type { AnswerValidator } from '@/api/widget-data-source/validators/answer-validator';
import { MemoryGameAnswerValidator } from '@/api/widget-data-source/validators/memory-game-validator';
import { QuizAnswerValidator } from '@/api/widget-data-source/validators/quiz-validator';
import { TrueFalseAnswerValidator } from '@/api/widget-data-source/validators/true-false-validator';

const validators = new Map<WidgetType, AnswerValidator>([
  ['memory-game', new MemoryGameAnswerValidator()],
  ['quiz', new QuizAnswerValidator()],
  ['true-false', new TrueFalseAnswerValidator()],
]);

export class MockWidgetDataSource implements WidgetDataSource {
  async getWidgetById<T extends Widget = Widget>(widgetType: WidgetType, widgetId: string): Promise<T> {
    await randomDelay();
    try {
      const module = await import(`../../mocks/widgets/${widgetType}/${widgetId}.json`);
      return module.default;
    } catch {
      throw new Error(`Mock data for widget ${widgetId} not found`);
    }
  }

  async submitAnswer(widgetType: WidgetType, widgetId: string, answer: unknown): Promise<Verdict> {
    await randomDelay();
    try {
      const module = await import(`../../mocks/widgets/${widgetType}/${widgetId}.json`);
      const widget = module.default;

      if (!('correctAnswer' in widget)) {
        throw new Error('Mock widget has no correctAnswer field');
      }

      const validator = validators.get(widgetType);
      if (!validator) {
        throw new Error(`No validator found for widget type: ${widget.type}`);
      }

      return validator.validate(answer, widget.correctAnswer);
    } catch (error) {
      const originalMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Mock validation failed for widget ${widgetId}: ${originalMessage}`, { cause: error });
    }
  }
}
