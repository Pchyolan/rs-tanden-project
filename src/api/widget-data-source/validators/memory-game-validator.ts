import type { AnswerValidator } from './answer-validator';
import type { Verdict } from '@/types';
import type { MemoryGameAnswer, MemoryGameErrors } from '@/features/memory-game/types';

export class MemoryGameAnswerValidator implements AnswerValidator {
  validate(answer: MemoryGameAnswer, correctAnswer: string[]): Verdict<MemoryGameErrors> {
    const missed = correctAnswer.filter((id) => !answer.markedAsGarbage.includes(id));
    const wronglyMarked = answer.markedAsGarbage.filter((id) => !correctAnswer.includes(id));
    const isCorrect = missed.length === 0 && wronglyMarked.length === 0;

    return isCorrect
      ? {
          isCorrect: true,
          explanation: 'Perfect! All garbage collected.',
          streakUpdated: false,
          xpEarned: 10,
        }
      : {
          isCorrect: false,
          explanation: 'Some objects are still reachable or incorrectly marked.',
          streakUpdated: false,
          xpEarned: 0,
          errors: { missedGarbage: missed, wronglyMarked },
        };
  }
}
