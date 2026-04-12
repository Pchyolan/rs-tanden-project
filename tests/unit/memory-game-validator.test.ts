import { describe, it, expect } from 'vitest';
import { MemoryGameAnswerValidator } from '@/api/validators/memory-game-validator.ts';
import type { MemoryGameAnswer } from '@/features/memory-game/types.ts';

describe('MemoryGameAnswerValidator', () => {
  const validator = new MemoryGameAnswerValidator();

  it('Return correct verdict when answer matches exactly', () => {
    const answer: MemoryGameAnswer = { markedAsGarbage: ['obj1', 'obj2'] };
    const correctAnswer = ['obj1', 'obj2'];
    const result = validator.validate(answer, correctAnswer);

    expect(result.isCorrect).toBe(true);
    expect(result.xpEarned).toBe(10);
    expect(result.explanation).toContain('Perfect');
    expect('errors' in result).toBe(false);
  });

  it('Detect missed garbage', () => {
    const answer: MemoryGameAnswer = { markedAsGarbage: ['obj1'] };
    const correctAnswer = ['obj1', 'obj2'];
    const result = validator.validate(answer, correctAnswer);

    expect(result.isCorrect).toBe(false);

    if (result.isCorrect) {
      throw new Error('Expected isCorrect to be false');
    } else {
      expect(result.errors.missedGarbage).toEqual(['obj2']);
      expect(result.errors.wronglyMarked).toEqual([]);
      expect(result.explanation).toContain('still reachable');
    }
  });

  it('Detect wrongly marked objects', () => {
    const answer: MemoryGameAnswer = { markedAsGarbage: ['obj1', 'obj3'] };
    const correctAnswer = ['obj1'];
    const result = validator.validate(answer, correctAnswer);

    expect(result.isCorrect).toBe(false);
    if (!result.isCorrect) {
      expect(result.errors.missedGarbage).toEqual([]);
      expect(result.errors.wronglyMarked).toEqual(['obj3']);
    }
  });

  it('Detect both missed and wrongly marked', () => {
    const answer: MemoryGameAnswer = { markedAsGarbage: ['obj1', 'objX'] };
    const correctAnswer = ['obj2', 'obj3'];
    const result = validator.validate(answer, correctAnswer);

    expect(result.isCorrect).toBe(false);
    if (!result.isCorrect) {
      expect(result.errors.missedGarbage).toEqual(['obj2', 'obj3']);
      expect(result.errors.wronglyMarked).toEqual(['obj1', 'objX']);
    }
  });

  it('Handles empty answer', () => {
    const answer: MemoryGameAnswer = { markedAsGarbage: [] };
    const correctAnswer = ['obj1'];
    const result = validator.validate(answer, correctAnswer);
    expect(result.isCorrect).toBe(false);

    if (!result.isCorrect) {
      expect(result.errors.missedGarbage).toEqual(['obj1']);
      expect(result.errors.wronglyMarked).toEqual([]);
    }
  });
});
