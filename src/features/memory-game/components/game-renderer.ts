import { BaseComponent } from '@/core';

import { GraphRenderer } from './graph-renderer';
import { GameState } from '../core/game-state';

import infoLogo from '@/assets/images/icons/info.png';
import questionLogo from '@/assets/images/icons/question.png';
import refreshLogo from '@/assets/images/icons/refresh.png';

import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/plugins/line-highlight/prism-line-highlight';
import 'prismjs/plugins/line-highlight/prism-line-highlight.css';

import './game-renderer.scss';

type MemoryGameRendererProps = {
  gameState: GameState;
  onReset: () => void;
};

export class MemoryGameRenderer extends BaseComponent {
  private gameState: GameState;

  private onReset: () => void;

  private graphRenderer?: GraphRenderer;
  private markedCounter?: BaseComponent<'span'>;
  private unsubscribe?: () => void;

  constructor({ gameState, onReset }: MemoryGameRendererProps) {
    super({
      tag: 'div',
      className: ['memory-game__container'],
    });

    this.gameState = gameState;
    this.onReset = onReset;

    this.createElements();
    this.subscribeToMarkedGarbage();
  }

  private createElements() {
    const panelsContainer = new BaseComponent<'div'>({
      tag: 'div',
      className: ['memory-game__panels-container'],
    });

    panelsContainer.append(this.renderLeftPanel(), this.renderRightPanel());

    this.append(panelsContainer, this.renderBottomPanel());
  }

  private renderLeftPanel(): BaseComponent {
    const leftPanel = new BaseComponent({
      tag: 'div',
      className: ['memory-game__left-panel'],
    });

    leftPanel.append(
      new BaseComponent<'h2'>({
        tag: 'h2',
        text: 'Task №1',
        className: ['memory-game__title'],
      }),
      new BaseComponent<'p'>({
        tag: 'p',
        text: 'Below you see JavaScript code that has just been executed. The last executed line is highlighted. Your task is to analyze the code and click on objects in the memory graph that become unreachable (garbage) after this code runs.',
        className: ['memory-game__text'],
      }),
      this.renderCodeSnippet(),
      this.renderHint()
    );

    return leftPanel;
  }

  private renderCodeSnippet(): BaseComponent<'pre'> {
    const codeContainer = new BaseComponent<'pre'>({
      tag: 'pre',
      className: ['memory-game__code'],
    });

    const payload = this.gameState.getPayload();

    if (payload.highlightedLine) {
      codeContainer.element.dataset.line = String(payload.highlightedLine);
      codeContainer.element.classList.add('line-highlight');
    }

    const codeElement = new BaseComponent<'code'>({
      tag: 'code',
      text: payload.codeSnippet,
      className: ['language-javascript'],
    });

    codeContainer.append(codeElement);
    Prism.highlightElement(codeElement.element);
    return codeContainer;
  }

  private renderHint(): BaseComponent {
    const hintBlock = new BaseComponent({
      tag: 'div',
      className: ['memory-game__hint-container'],
    });

    hintBlock.append(
      new BaseComponent<'img'>({
        tag: 'img',
        className: ['memory-game__icon'],
        attrs: {
          src: infoLogo,
          alt: 'info',
        },
      }),
      new BaseComponent<'p'>({
        tag: 'p',
        text: 'Click on objects in the memory graph to mark them collected. Roots cannot be collected.',
        className: ['memory-game__hint-text'],
      })
    );

    return hintBlock;
  }

  private renderRightPanel(): BaseComponent {
    const rightPanel = new BaseComponent<'div'>({
      tag: 'div',
      className: ['memory-game__right-panel'],
    });

    this.graphRenderer = new GraphRenderer({
      payload: this.gameState.getPayload(),
      onObjectClick: (objectId) => this.gameState.toggleMark(objectId),
    });

    rightPanel.append(this.graphRenderer, this.renderControls());

    return rightPanel;
  }

  private renderControls(): BaseComponent {
    const controlsPanel = new BaseComponent({
      tag: 'div',
      className: ['memory-game__controls-container'],
    });

    this.markedCounter = new BaseComponent<'span'>({
      tag: 'span',
      text: '0',
      className: ['memory-game__text', 'memory-game__text--green'],
    });

    const questionWrapper = this.renderIconWrapper(questionLogo, 'question');

    const refreshWrapper = this.renderIconWrapper(refreshLogo, 'refresh');
    refreshWrapper.addEventListener('click', this.onReset);

    controlsPanel.append(
      questionWrapper,
      new BaseComponent<'span'>({
        tag: 'span',
        text: 'Marked items:',
        className: ['memory-game__text'],
      }),
      this.markedCounter,
      refreshWrapper
    );

    return controlsPanel;
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
      },
    });

    iconWrapper.append(iconImg);

    return iconWrapper;
  }

  private renderBottomPanel(): BaseComponent {
    const bottomPanel = new BaseComponent({
      tag: 'div',
      className: ['memory-game__bottom-panel'],
    });

    bottomPanel.append(
      new BaseComponent<'button'>({
        tag: 'button',
        text: 'Get answer',
        className: ['memory-game__button'],
      }),
      new BaseComponent<'button'>({
        tag: 'button',
        text: 'Collect garbage',
        className: ['memory-game__button'],
      }),
      new BaseComponent<'button'>({
        tag: 'button',
        text: 'Skip Task',
        className: ['memory-game__button'],
      })
    );

    return bottomPanel;
  }

  private subscribeToMarkedGarbage() {
    this.unsubscribe = this.gameState.markedGarbage$.subscribe((markedSet) => {
      if (this.markedCounter) {
        this.markedCounter.element.textContent = String(markedSet.size);
      }

      if (this.graphRenderer) {
        this.graphRenderer.updateMarkedObjects(markedSet);
      }
    });
  }

  public override remove(): void {
    this.unsubscribe?.();
    super.remove();
  }
}
