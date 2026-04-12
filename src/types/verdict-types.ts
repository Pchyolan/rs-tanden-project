export type Verdict<TError = unknown> =
  | {
      isCorrect: true;
      explanation?: string; //объяснение ответа
      xpEarned?: number; //очки опыта за ответ (для геймификации - если потребуется)
      streakUpdated: boolean;
    }
  | {
      isCorrect: false;
      explanation?: string; //объяснение ответа
      xpEarned?: number; //очки опыта за ответ (для геймификации - если потребуется)
      streakUpdated: boolean;
      errors: TError; // при неправильном ответе errors обязательно будет, если нет - пустой объект
    };
