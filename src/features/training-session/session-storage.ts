import type { TrainingSession } from './types';

const SESSION_KEY = 'training-session';

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isTrainingSession(value: unknown): value is TrainingSession {
  if (!isObject(value)) return false;

  const config = value.config;
  const tasks = value.tasks;
  const currentIndex = value.currentIndex;
  const startedAt = value.startedAt;

  if (!isObject(config)) return false;
  if (!Array.isArray(tasks)) return false;
  if (typeof currentIndex !== 'number') return false;
  if (typeof startedAt !== 'number') return false;

  const difficulty = config.difficulty;
  const topics = config.topics;
  const questionCount = config.questionCount;

  const difficultyValid = difficulty === 1 || difficulty === 2 || difficulty === 3;
  const topicsValid = Array.isArray(topics) && topics.every((topic) => typeof topic === 'string');
  const countValid = typeof questionCount === 'number';

  return difficultyValid && topicsValid && countValid;
}

export function saveCurrentSession(session: TrainingSession): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function loadCurrentSession(): TrainingSession | null {
  const raw = sessionStorage.getItem(SESSION_KEY);

  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);

    return isTrainingSession(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearCurrentSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
