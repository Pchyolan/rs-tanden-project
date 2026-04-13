export type CodeCompletionPayload = {
  code: string;
  blanks: string[];
};

export type CodeCompletionAnswer = {
  values: string[];
};

export type CodeCompletionWidget = {
  id: string;
  type: 'code-completion';
  version: number;
  difficulty: 1 | 2 | 3;
  tags: string[];
  payload: CodeCompletionPayload;
  correctAnswer: string[];
};
