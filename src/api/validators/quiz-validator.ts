import type { AnswerValidator } from './answer-validator';
import type { Verdict } from '@/types';
import type { QuizAnswer } from '@/features/quiz/types';

export class QuizAnswerValidator implements AnswerValidator {
  validate(answer: QuizAnswer, correctAnswer: number): Verdict {
    const isCorrect = answer.selectedIndex === correctAnswer;

    return {
      isCorrect,
      explanation: isCorrect ? 'Correct answer!' : 'Wrong answer. Try again.',
      xpEarned: isCorrect ? 10 : 0,
    };
  }
}
