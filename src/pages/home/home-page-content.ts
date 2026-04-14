export type HomeLanguage = 'ru' | 'en';

export type TopicOption = {
  id: string;
  label: {
    ru: string;
    en: string;
  };
};

export const homeTexts = {
  projectTitle: {
    ru: 'Brainiac',
    en: 'Brainiac',
  },
  bubbleTitle: {
    ru: 'Мысль дня',
    en: 'Thought of the Day',
  },
  startButton: {
    ru: 'Начать тренировку',
    en: 'Start Practice',
  },
  continueButton: {
    ru: 'Продолжить попытку',
    en: 'Resume Attempt',
  },
  newAttemptButton: {
    ru: 'Новая попытка',
    en: 'New Attempt',
  },
  modalTitle: {
    ru: 'Настрой тренировку',
    en: 'Set Up Practice',
  },
  levelLabel: {
    ru: 'Уровень',
    en: 'Level',
  },
  topicLabel: {
    ru: 'Темы',
    en: 'Topics',
  },
  countLabel: {
    ru: 'Количество вопросов',
    en: 'Number of Questions',
  },
  startModalButton: {
    ru: 'Начать',
    en: 'Start',
  },
  cancelModalButton: {
    ru: 'Отмена',
    en: 'Cancel',
  },
  easy: {
    ru: 'Лёгкий',
    en: 'Easy',
  },
  medium: {
    ru: 'Средний',
    en: 'Medium',
  },
  hard: {
    ru: 'Сложный',
    en: 'Hard',
  },
};

export const topicOptions: TopicOption[] = [
  {
    id: 'js-basics',
    label: { ru: 'Основы JS', en: 'JS Basics' },
  },
  {
    id: 'arrays-methods',
    label: { ru: 'Массивы и методы', en: 'Arrays & Methods' },
  },
  {
    id: 'comparison-operators',
    label: { ru: 'Сравнение и операторы', en: 'Comparison & Operators' },
  },
  {
    id: 'functions-scope',
    label: { ru: 'Функции и scope', en: 'Functions & Scope' },
  },
  {
    id: 'closures',
    label: { ru: 'Замыкания', en: 'Closures' },
  },
  {
    id: 'async',
    label: { ru: 'Асинхронность', en: 'Async' },
  },
  {
    id: 'objects-prototypes',
    label: { ru: 'Объекты и прототипы', en: 'Objects & Prototypes' },
  },
  {
    id: 'memory-management',
    label: { ru: 'Управление памятью', en: 'Memory Management' },
  },
];

export const brainQuotes = [
  {
    ru: 'Ошибки — это часть прокачки.',
    en: 'Mistakes are part of progress.',
  },
  {
    ru: 'На собесе важен не только ответ, но и ход мысли.',
    en: 'In interviews, reasoning matters too.',
  },
  {
    ru: 'Promise.then выполняется через microtask queue.',
    en: 'Promise.then runs through the microtask queue.',
  },
  {
    ru: 'typeof null — историческая особенность JS.',
    en: 'typeof null is a historical JavaScript quirk.',
  },
  {
    ru: 'Одна тренировка в день лучше, чем ноль.',
    en: 'One session a day is better than none.',
  },
];
