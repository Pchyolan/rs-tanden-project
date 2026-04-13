type Session = {
  config: {
    difficulty: 1 | 2 | 3;
    topics: string[];
    questionCount: number;
  };
  tasks: Array<{
    id: string;
    type: string;
  }>;
  currentIndex: number;
  correct: number;
};

const KEY = 'training-session';

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isSession(value: unknown): value is Session {
  if (!isObject(value)) return false;

  const { config, tasks, currentIndex, correct } = value;

  if (!isObject(config)) return false;
  if (!Array.isArray(tasks)) return false;
  if (typeof currentIndex !== 'number') return false;
  if (typeof correct !== 'number') return false;

  const { difficulty, topics, questionCount } = config;

  const validDifficulty = difficulty === 1 || difficulty === 2 || difficulty === 3;
  const validTopics = Array.isArray(topics) && topics.every((topic) => typeof topic === 'string');
  const validQuestionCount = typeof questionCount === 'number';
  const validTasks = tasks.every((task) => {
    if (!isObject(task)) return false;
    return typeof task.id === 'string' && typeof task.type === 'string';
  });

  return validDifficulty && validTopics && validQuestionCount && validTasks;
}

export function saveSession(session: Session): void {
  sessionStorage.setItem(KEY, JSON.stringify(session));
}

export function loadSession(): Session | null {
  const raw = sessionStorage.getItem(KEY);

  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    return isSession(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  sessionStorage.removeItem(KEY);
}
