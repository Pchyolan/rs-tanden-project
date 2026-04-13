export type Task = {
  id: string;
  type: string;
  difficulty: 1 | 2 | 3;
  tags: string[];
  payload: unknown;
  correctAnswer: unknown;
};

export type TrainingConfig = {
  difficulty: 1 | 2 | 3;
  topics: string[];
  questionCount: number;
};
