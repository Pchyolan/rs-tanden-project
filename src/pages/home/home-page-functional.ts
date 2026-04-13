import { routes } from '@/constants';
import { language$ } from '@/store/language-store.ts';
import { brainQuotes, homeTexts, topicOptions, type HomeLanguage } from './home-page-content';
import { generateTicketItems } from '@/features/training-session/generate-ticket-items';
import { saveCurrentSession } from '@/features/training-session/session-storage';

import settingsIcon from '@/assets/icons/settings.png';
import userIcon from '@/assets/icons/user.png';

import brain1 from '@/assets/brain/brain-1.png';
import brain2 from '@/assets/brain/brain-2.png';
import brain3 from '@/assets/brain/brain-3.png';
import brain4 from '@/assets/brain/brain-4.png';

import './home-page.scss';

type TrainingConfig = {
  difficulty: 1 | 2 | 3;
  topics: string[];
  questionCount: number;
};

const brainImages = [brain1, brain2, brain3, brain4];

function navigateTo(path: string): void {
  globalThis.history.pushState({}, '', path);
  globalThis.dispatchEvent(new PopStateEvent('popstate'));
}

function getRandomQuote(lang: HomeLanguage): string {
  const index = Math.floor(Math.random() * brainQuotes.length);
  const quote = brainQuotes[index];

  return quote ? quote[lang] : '';
}

function getRandomBrain(): string {
  const index = Math.floor(Math.random() * brainImages.length);
  const brainImage = brainImages[index];

  return brainImage ?? brain1;
}

function createTopbar(lang: HomeLanguage): HTMLDivElement {
  const topbar = document.createElement('div');
  topbar.className = 'home-topbar';

  const title = document.createElement('h1');
  title.className = 'home-project-title';
  title.textContent = homeTexts.projectTitle[lang];

  const actions = document.createElement('div');
  actions.className = 'home-topbar-actions';

  const settingsButton = document.createElement('button');
  settingsButton.className = 'home-icon-btn';
  settingsButton.type = 'button';
  settingsButton.setAttribute('aria-label', 'Settings');

  const settingsImage = document.createElement('img');
  settingsImage.src = settingsIcon;
  settingsImage.alt = 'Settings';
  settingsButton.append(settingsImage);

  const userButton = document.createElement('button');
  userButton.className = 'home-icon-btn';
  userButton.type = 'button';
  userButton.setAttribute('aria-label', 'Account');

  const userImage = document.createElement('img');
  userImage.src = userIcon;
  userImage.alt = 'Account';
  userButton.append(userImage);

  actions.append(settingsButton, userButton);
  topbar.append(title, actions);

  return topbar;
}

function createLeftSection(lang: HomeLanguage): HTMLDivElement {
  const left = document.createElement('div');
  left.className = 'home-left';

  const bubble = document.createElement('div');
  bubble.className = 'home-bubble';

  const bubbleTitle = document.createElement('div');
  bubbleTitle.className = 'home-bubble-title';
  bubbleTitle.textContent = homeTexts.bubbleTitle[lang];

  const bubbleText = document.createElement('div');
  bubbleText.className = 'home-bubble-text';
  bubbleText.textContent = getRandomQuote(lang);

  const brain = document.createElement('img');
  brain.className = 'home-brain';
  brain.src = getRandomBrain();
  brain.alt = 'Brain mascot';

  bubble.append(bubbleTitle, bubbleText);
  left.append(bubble, brain);

  return left;
}

function createRightSection(lang: HomeLanguage, onStart: () => void): HTMLDivElement {
  const right = document.createElement('div');
  right.className = 'home-right';

  const startButton = document.createElement('button');
  startButton.className = 'home-main-btn';
  startButton.type = 'button';
  startButton.textContent = homeTexts.startButton[lang];
  startButton.addEventListener('click', onStart);

  right.append(startButton);

  return right;
}

function createModalLabel(text: string): HTMLDivElement {
  const label = document.createElement('div');
  label.className = 'modal-label';
  label.textContent = text;
  return label;
}

function createLevelSection(lang: HomeLanguage, config: TrainingConfig): HTMLDivElement {
  const section = document.createElement('div');
  section.className = 'modal-section';

  const label = createModalLabel(homeTexts.levelLabel[lang]);

  const row = document.createElement('div');
  row.className = 'modal-row';

  const buttons: HTMLButtonElement[] = [];

  const levels: Array<{ value: 1 | 2 | 3; label: string }> = [
    { value: 1, label: homeTexts.easy[lang] },
    { value: 2, label: homeTexts.medium[lang] },
    { value: 3, label: homeTexts.hard[lang] },
  ];

  function updateButtons(): void {
    for (const button of buttons) {
      const value = Number(button.dataset.value);
      const isActive = value === config.difficulty;

      button.classList.toggle('active', isActive);
      button.classList.toggle('inactive', !isActive);
    }
  }

  for (const level of levels) {
    const button = document.createElement('button');
    button.className = 'modal-chip';
    button.type = 'button';
    button.textContent = level.label;
    button.dataset.value = String(level.value);

    button.addEventListener('click', () => {
      config.difficulty = level.value;
      updateButtons();
    });

    buttons.push(button);
    row.append(button);
  }

  updateButtons();

  section.append(label, row);

  return section;
}

function createTopicSection(lang: HomeLanguage, config: TrainingConfig, onTopicsChange: () => void): HTMLDivElement {
  const section = document.createElement('div');
  section.className = 'modal-section';

  const label = createModalLabel(homeTexts.topicLabel[lang]);

  const row = document.createElement('div');
  row.className = 'modal-row';

  const buttons: HTMLButtonElement[] = [];

  function updateButtons(): void {
    for (const button of buttons) {
      const topicId = button.dataset.topicId;
      const isActive = topicId ? config.topics.includes(topicId) : false;

      button.classList.toggle('active', isActive);
      button.classList.toggle('inactive', !isActive);
    }
  }

  for (const topic of topicOptions) {
    const button = document.createElement('button');
    button.className = 'modal-chip modal-chip-topic';
    button.type = 'button';
    button.textContent = topic.label[lang];
    button.dataset.topicId = topic.id;

    button.addEventListener('click', () => {
      const exists = config.topics.includes(topic.id);

      config.topics = exists
        ? config.topics.filter((topicItem) => topicItem !== topic.id)
        : [...config.topics, topic.id];

      updateButtons();
      onTopicsChange();
    });

    buttons.push(button);
    row.append(button);
  }

  updateButtons();

  section.append(label, row);

  return section;
}

function createCountSection(lang: HomeLanguage, config: TrainingConfig): HTMLDivElement {
  const section = document.createElement('div');
  section.className = 'modal-section';

  const label = createModalLabel(homeTexts.countLabel[lang]);

  const row = document.createElement('div');
  row.className = 'modal-row';

  const buttons: HTMLButtonElement[] = [];
  const counts = [5, 10, 15];

  function updateButtons(): void {
    for (const button of buttons) {
      const count = Number(button.dataset.count);
      const isActive = count === config.questionCount;

      button.classList.toggle('active', isActive);
      button.classList.toggle('inactive', !isActive);
    }
  }

  for (const count of counts) {
    const button = document.createElement('button');
    button.className = 'modal-chip';
    button.type = 'button';
    button.textContent = String(count);
    button.dataset.count = String(count);

    button.addEventListener('click', () => {
      config.questionCount = count;
      updateButtons();
    });

    buttons.push(button);
    row.append(button);
  }

  updateButtons();

  section.append(label, row);

  return section;
}

function openModal(lang: HomeLanguage): void {
  const config: TrainingConfig = {
    difficulty: 1,
    topics: [],
    questionCount: 10,
  };

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const modal = document.createElement('div');
  modal.className = 'modal-card';

  const title = document.createElement('h2');
  title.className = 'modal-title';
  title.textContent = homeTexts.modalTitle[lang];

  const startButton = document.createElement('button');
  startButton.className = 'modal-start-btn';
  startButton.type = 'button';
  startButton.textContent = homeTexts.startModalButton[lang];

  const cancelButton = document.createElement('button');
  cancelButton.className = 'modal-cancel-btn';
  cancelButton.type = 'button';
  cancelButton.textContent = homeTexts.cancelModalButton[lang];

  function updateStartButton(): void {
    startButton.disabled = config.topics.length === 0;
  }

  startButton.addEventListener('click', () => {
    if (config.topics.length === 0) return;

    const tasks = generateTicketItems(config);

    saveCurrentSession({
      config,
      tasks,
      currentIndex: 0,
      startedAt: Date.now(),
    });

    overlay.remove();
    navigateTo(routes.widget_engine);
  });

  cancelButton.addEventListener('click', () => {
    overlay.remove();
  });

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      overlay.remove();
    }
  });

  const actions = document.createElement('div');
  actions.className = 'modal-actions';
  actions.append(cancelButton, startButton);

  modal.append(
    title,
    createLevelSection(lang, config),
    createTopicSection(lang, config, updateStartButton),
    createCountSection(lang, config),
    actions
  );

  overlay.append(modal);
  document.body.append(overlay);

  updateStartButton();
}

export function renderHomePage(): HTMLDivElement {
  const lang = language$.value;

  const page = document.createElement('div');
  page.className = 'home-page';

  const content = document.createElement('div');
  content.className = 'home-content';

  content.append(
    createLeftSection(lang),
    createRightSection(lang, () => openModal(lang))
  );

  page.append(createTopbar(lang), content);

  return page;
}
