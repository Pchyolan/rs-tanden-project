import { BaseComponent, Observable } from '@/core';
import { SoundKey, SoundService } from '@/services/sound-service';

import { GraphRenderer } from './graph-renderer';
import type { GameState, MemoryGamePayload } from '../types';
import { gameStates } from '../constants';

import infoLogo from '@/assets/images/icons/info.png';
import questionLogo from '@/assets/images/icons/question.png';
import refreshLogo from '@/assets/images/icons/refresh.png';

import Prism from 'prismjs';
import '@/styles/prism/prism-tailwind-moon-blue.css';
import 'prismjs/plugins/line-highlight/prism-line-highlight';
import 'prismjs/plugins/line-highlight/prism-line-highlight.css';

import './game-renderer.scss';

type MemoryGameRendererProps = {
  payload: MemoryGamePayload;
  gameState$: Observable<GameState>;
  onObjectClick: (objectId: string) => void;
  onReset: () => void;
  onCollect: () => void;
};

export class MemoryGameRenderer extends BaseComponent {
  private readonly payload: MemoryGamePayload;
  private graphRenderer?: GraphRenderer;
  private soundService = SoundService.getInstance();

  private unsubscribeMachine?: () => void;

  private markedCounter?: BaseComponent<'span'>;
  private collectButton?: BaseComponent<'button'>;
  private refreshWrapper?: BaseComponent;
  private questionWrapper?: BaseComponent;

  constructor({ payload, gameState$, onObjectClick, onReset, onCollect }: MemoryGameRendererProps) {
    super({
      tag: 'div',
      className: ['memory-game__container'],
    });

    this.payload = payload;

    this.createUI(onObjectClick, onReset, onCollect);

    this.subscribeToMachine(gameState$);
  }

  private createUI(onObjectClick: (objectId: string) => void, onReset: () => void, onCollect: () => void) {
    const panelsContainer = new BaseComponent<'div'>({
      tag: 'div',
      className: ['memory-game__panels-container'],
    });

    this.graphRenderer = new GraphRenderer({
      payload: this.payload,
      onObjectClick: onObjectClick,
    });

    panelsContainer.append(this.renderCodeSnippet(), this.graphRenderer);

    this.append(this.renderTopPanel(onReset), panelsContainer, this.renderBottomPanel(onCollect));
  }

  /**
   * Верхний блок
   */
  private renderTopPanel(onReset: () => void): BaseComponent {
    const topPanel = new BaseComponent({
      tag: 'div',
      className: ['memory_game__top-panel'],
    });

    topPanel.append(this.renderHint(), this.renderAdditionButtons(onReset));

    return topPanel;
  }

  private renderHint(): BaseComponent {
    const hintBlock = new BaseComponent({
      tag: 'div',
      className: ['memory-game__hint-container'],
    });

    const icon = new BaseComponent<'img'>({
      tag: 'img',
      className: ['memory-game__icon'],
      attrs: { src: infoLogo, alt: 'info' },
    });

    const textContainer = new BaseComponent({
      tag: 'div',
      className: ['memory-game__hint-text-container'],
    });

    const p1 = new BaseComponent({
      tag: 'p',
      text: 'Below you see JavaScript code that has just been executed. The last executed line is highlighted.',
      className: ['memory-game__hint-text'],
    });
    const p2 = new BaseComponent({
      tag: 'p',
      text: 'Your task is to analyze the code and click on objects in the memory graph that become unreachable (garbage) after this code runs.',
      className: ['memory-game__hint-text'],
    });
    const p3 = new BaseComponent({
      tag: 'p',
      text: 'Click on objects to mark them as garbage. Note: root objects (like the global object) cannot be collected.',
      className: ['memory-game__hint-text'],
    });

    textContainer.append(p1, p2, p3);

    hintBlock.append(icon, textContainer);
    return hintBlock;
  }

  private renderIconWrapper(iconLogo: string, iconAltText: string): BaseComponent {
    const iconWrapper = new BaseComponent({
      tag: 'div',
      className: ['memory-game__icon-wrapper'],
    });

    const iconImg = new BaseComponent<'img'>({
      tag: 'img',
      className: ['memory-game__icon'],
      attrs: {
        src: iconLogo,
        alt: iconAltText,
        title: iconAltText,
      },
    });

    iconWrapper.append(iconImg);

    return iconWrapper;
  }

  private renderAdditionButtons(onReset: () => void): BaseComponent {
    const buttonsBlock = new BaseComponent({
      tag: 'div',
      className: ['memory-game__hint-container'],
    });

    this.questionWrapper = this.renderIconWrapper(questionLogo, 'Add me a clue');

    this.refreshWrapper = this.renderIconWrapper(refreshLogo, 'Refresh objects selection');
    this.refreshWrapper.addEventListener('click', onReset);

    buttonsBlock.append(this.questionWrapper, this.refreshWrapper);

    return buttonsBlock;
  }

  /**
   * Левая часть
   */
  private renderCodeSnippet(): BaseComponent<'pre'> {
    const codeContainer = new BaseComponent<'pre'>({
      tag: 'pre',
      className: ['memory-game__code'],
    });

    if (this.payload.highlightedLine) {
      codeContainer.element.dataset.line = String(this.payload.highlightedLine);
      codeContainer.element.classList.add('line-highlight');
    }

    const codeElement = new BaseComponent<'code'>({
      tag: 'code',
      text: this.payload.codeSnippet,
      className: ['language-javascript'],
    });

    codeContainer.append(codeElement);

    return codeContainer;
  }

  /**
   * Блок снизу
   */
  private renderBottomPanel(onCollect: () => void): BaseComponent {
    const bottomPanel = new BaseComponent({
      tag: 'div',
      className: ['memory-game__bottom-panel'],
    });

    const textWrapper = new BaseComponent({
      tag: 'div',
      className: ['memory-game__text-wrapper'],
    });

    this.markedCounter = new BaseComponent<'span'>({
      tag: 'span',
      text: '0',
      className: ['memory-game__text', 'memory-game__text--green'],
    });

    textWrapper.append(
      new BaseComponent<'span'>({
        tag: 'span',
        text: 'Selected garbage:',
        className: ['memory-game__text'],
      }),
      this.markedCounter
    );

    this.collectButton = new BaseComponent<'button'>({
      tag: 'button',
      text: 'Collect',
      className: ['memory-game__button'],
    });
    this.collectButton.addEventListener('click', onCollect);

    bottomPanel.append(textWrapper, this.collectButton);

    return bottomPanel;
  }

  public updateMarkedObjects(markedSet: Set<string>): void {
    if (this.markedCounter) {
      this.markedCounter.element.textContent = String(markedSet.size);
    }

    this.graphRenderer?.updateMarkedObjects(markedSet);
  }

  public highlightCode() {
    const codeElement = this.element.querySelector('code.language-javascript');
    if (codeElement) {
      Prism.highlightElement(codeElement);
    }
  }

  private subscribeToMachine(gameState$: Observable<GameState>) {
    this.unsubscribeMachine = gameState$.subscribe((state) => {
      const isActive = state === gameStates.idle;
      this.setInteractive(isActive);

      // Управление кнопкой Collect
      if (this.collectButton) {
        if (state === gameStates.submitting) {
          this.collectButton.element.textContent = 'Submitting...';
          this.collectButton.element.classList.add('loading');
          this.collectButton.element.disabled = true;
        } else {
          this.collectButton.element.textContent = 'Collect';
          this.collectButton.element.classList.remove('loading');
          this.collectButton.element.disabled = !isActive;
        }
      }

      switch (state) {
        case gameStates.submitting: {
          console.log('Submitting...');
          break;
        }
        case gameStates.result: {
          this.soundService.playSound(SoundKey.next);
          break;
        }
        case gameStates.animation: {
          console.log('Cleaning up...');
          break;
        }
        default:
      }
    });
  }

  private setInteractive(isActive: boolean): void {
    if (this.collectButton) {
      this.collectButton.element.disabled = !isActive;
    }

    if (this.questionWrapper) {
      this.questionWrapper.element.classList.toggle('is-disabled', !isActive);
    }

    if (this.refreshWrapper) {
      this.refreshWrapper.element.classList.toggle('is-disabled', !isActive);
    }

    if (this.graphRenderer) {
      this.graphRenderer.element.classList.toggle('is-disabled', !isActive);
    }
  }

  public async playAnimation(): Promise<void> {
    if (this.graphRenderer) {
      await this.graphRenderer.animateGarbageCollection();
    }
  }

  public override remove(): void {
    this.unsubscribeMachine?.();
    super.remove();
  }
}
