import type { TicketItem } from '@/types';
import { widgetRegistry } from '@/mocks/widget-registry';
import type { TrainingConfig } from './types';

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  copy.sort(() => Math.random() - 0.5);
  return copy;
}

export function generateTicketItems(config: TrainingConfig): TicketItem[] {
  const filtered = widgetRegistry.filter((widgetItem) => {
    const difficultyMatch = widgetItem.difficulty === config.difficulty;

    const topicMatch = config.topics.length === 0 ? true : widgetItem.tags.some((tag) => config.topics.includes(tag));

    return difficultyMatch && topicMatch;
  });

  const base = filtered.length > 0 ? filtered : widgetRegistry;

  const shuffled = shuffleArray(base);

  const resultInitial = shuffled.slice(0, config.questionCount);

  const filled = [...resultInitial];

  while (filled.length < config.questionCount) {
    const random = widgetRegistry[Math.floor(Math.random() * widgetRegistry.length)];
    if (random) filled.push(random);
  }

  const hasMemory = filled.some((item) => item.type === 'memory-game');

  if (!hasMemory) {
    const memoryItems = widgetRegistry.filter((item) => item.type === 'memory-game');
    const randomMemory = memoryItems[Math.floor(Math.random() * memoryItems.length)];

    if (randomMemory) {
      filled[0] = randomMemory;
    }
  }

  return filled.map((item) => ({
    id: item.id,
    type: item.type,
  }));
}
