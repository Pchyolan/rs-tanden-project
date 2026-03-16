export type QuizOption = {
  index: number;
  text: string;
};

export type QuizPayload = {
  question: string;
  options: QuizOption[];
};

export type QuizAnswer = {
  selectedIndex: number;
};

export type QuizWidget = {
  id: string;
  type: 'quiz';
  version: number;
  difficulty: 1 | 2 | 3;
  tags: string[];
  payload: QuizPayload;
  correctAnswer: number;
};
