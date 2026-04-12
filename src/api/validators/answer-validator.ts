import type { Verdict } from '@/types';

export type AnswerValidator<TError = unknown> = {
  /**
   * Сравнивает ответ пользователя с правильным и возвращает объект Verdict.
   * @param answer - ответ пользователя
   * @param correctAnswer - правильный ответ (из мок-данных или сервера)
   * @returns объект Verdict (уточняется до нужного типа дженериком)
   */
  validate(answer: unknown, correctAnswer: unknown): Verdict<TError>;
};
