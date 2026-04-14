import type { TicketItem } from '@/types';

export type TrainingConfig = {
  difficulty: 1 | 2 | 3;
  topics: string[];
  questionCount: number;
};

export type TrainingSession = {
  config: TrainingConfig;
  tasks: TicketItem[];
  currentIndex: number;
  startedAt: number;
};
