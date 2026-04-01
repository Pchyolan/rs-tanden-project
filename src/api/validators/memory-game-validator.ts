import type { AnswerValidator } from './answer-validator';
import type { Verdict } from '@/types';
import type { MemoryGameAnswer, MemoryGameErrors } from '@/features/memory-game/types';

export class MemoryGameAnswerValidator implements AnswerValidator {
  validate(answer: MemoryGameAnswer, correctAnswer: string[]): Verdict<MemoryGameErrors> {
    const missed = correctAnswer.filter((id) => !answer.markedAsGarbage.includes(id));
    const wronglyMarked = answer.markedAsGarbage.filter((id) => !correctAnswer.includes(id));
    const isCorrect = missed.length === 0 && wronglyMarked.length === 0;

    return {
      isCorrect,
      explanation: isCorrect
        ? 'Perfect! All garbage collected.'
        : 'Some objects are still reachable or incorrectly marked.',
      streakUpdated: false,
      xpEarned: isCorrect ? 10 : 0,
      ...(isCorrect ? {} : { errors: { missedGarbage: missed, wronglyMarked } }),
    };
  }
}
