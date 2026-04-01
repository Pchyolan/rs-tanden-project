export type TrueFalsePayload = {
  statement: string;
  explanation: string;
};

export type TrueFalseAnswer = {
  value: boolean;
};

export type TrueFalseWidget = {
  id: string;
  type: 'true-false';
  version: number;
  difficulty: 1 | 2 | 3;
  tags: string[];
  payload: TrueFalsePayload;
  correctAnswer: boolean;
};
