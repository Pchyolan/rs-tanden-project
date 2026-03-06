export type Verdict<TError = unknown> = {
  isCorrect: boolean;
  explanation?: string; //объяснение ответа
  xpEarned?: number; //очки опыта за ответ (для геймификации - если потребуется)
  errors?: TError;
};
