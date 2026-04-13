import type { AnswerValidator } from './answer-validator';
import type { Verdict } from '@/types';
import type { QuizAnswer } from '@/features/quiz/types';

export class QuizAnswerValidator implements AnswerValidator {
  validate(answer: QuizAnswer, correctAnswer: number): Verdict {
    const isCorrect = answer.selectedIndex === correctAnswer;

    return isCorrect
      ? {
          isCorrect: true,
          explanation: 'Correct answer!',
          xpEarned: 10,
          streakUpdated: false,
        }
      : {
          isCorrect: false,
          explanation: 'Wrong answer. Try again.',
          xpEarned: 0,
          streakUpdated: false,
          errors: {},
        };
  }
}
