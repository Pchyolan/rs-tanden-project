import type { Verdict } from '@/types';
import type { AnswerValidator } from './answer-validator';
import type { TrueFalseAnswer } from '@/features/true-false/types';

function isTrueFalseAnswer(value: unknown): value is TrueFalseAnswer {
  if (typeof value !== 'object' || value === null) return false;

  if (!('value' in value)) return false;

  return typeof value.value === 'boolean';
}

export class TrueFalseAnswerValidator implements AnswerValidator {
  validate(answer: unknown, correctAnswer: unknown): Verdict {
    if (!isTrueFalseAnswer(answer)) {
      throw new TypeError('Invalid true/false answer format');
    }

    if (typeof correctAnswer !== 'boolean') {
      throw new TypeError('Invalid correct answer format');
    }

    const isCorrect = answer.value === correctAnswer;

    return {
      isCorrect,
      xpEarned: isCorrect ? 10 : 0,
      streakUpdated: false,
    };
  }
}
