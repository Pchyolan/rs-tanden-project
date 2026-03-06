import { BaseComponent } from '@/core';

import { GraphRenderer } from './graph-renderer';
import type { MemoryGamePayload } from '../types';

import infoLogo from '@/assets/images/icons/info.png';
import questionLogo from '@/assets/images/icons/question.png';
import refreshLogo from '@/assets/images/icons/refresh.png';

import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/plugins/line-highlight/prism-line-highlight';
import 'prismjs/plugins/line-highlight/prism-line-highlight.css';

import './game-renderer.scss';

type MemoryGameRendererProps = {
  payload: MemoryGamePayload;
  onObjectClick: (objectId: string) => void;
  onReset: () => void;
  onCollect: () => void;
  onSkip: () => void;
};

export class MemoryGameRenderer extends BaseComponent {
  private readonly payload: MemoryGamePayload;

  private unsubscribeMachine?: () => void;

  private graphRenderer?: GraphRenderer;
  private markedCounter?: BaseComponent<'span'>;

  constructor({ payload, onObjectClick, onReset, onCollect, onSkip }: MemoryGameRendererProps) {
    super({
      tag: 'div',
      className: ['memory-game__container'],
    });

    this.payload = payload;

    this.createElements(onObjectClick, onReset, onCollect, onSkip);
  }

  private createElements(
    onObjectClick: (objectId: string) => void,
    onReset: () => void,
    onCollect: () => void,
    onSkip: () => void
  ) {
    const panelsContainer = new BaseComponent<'div'>({
      tag: 'div',
      className: ['memory-game__panels-container'],
    });

    panelsContainer.append(this.renderLeftPanel(), this.renderRightPanel(onObjectClick, onReset));

    this.append(panelsContainer, this.renderBottomPanel(onCollect, onSkip));
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

  private renderRightPanel(onObjectClick: (objectId: string) => void, onReset: () => void): BaseComponent {
    const rightPanel = new BaseComponent<'div'>({
      tag: 'div',
      className: ['memory-game__right-panel'],
    });

    this.graphRenderer = new GraphRenderer({
      payload: this.payload,
      onObjectClick: onObjectClick,
    });

    rightPanel.append(this.graphRenderer, this.renderControls(onReset));

    return rightPanel;
  }

  private renderControls(onReset: () => void): BaseComponent {
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
    refreshWrapper.addEventListener('click', onReset);

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

  private renderBottomPanel(onCollect: () => void, onSkip: () => void): BaseComponent {
    const bottomPanel = new BaseComponent({
      tag: 'div',
      className: ['memory-game__bottom-panel'],
    });

    const collectButton = new BaseComponent<'button'>({
      tag: 'button',
      text: 'Collect garbage',
      className: ['memory-game__button'],
    });
    collectButton.addEventListener('click', onCollect);

    const skipButton = new BaseComponent<'button'>({
      tag: 'button',
      text: 'Skip Task',
      className: ['memory-game__button'],
    });
    skipButton.addEventListener('click', onSkip);

    bottomPanel.append(
      new BaseComponent<'button'>({
        tag: 'button',
        text: 'Get answer',
        className: ['memory-game__button'],
      }),
      collectButton,
      skipButton
    );

    return bottomPanel;
  }

  public updateMarkedObjects(markedSet: Set<string>): void {
    if (this.markedCounter) {
      this.markedCounter.element.textContent = String(markedSet.size);
    }

    this.graphRenderer?.updateMarkedObjects(markedSet);
  }

  public override remove(): void {
    this.unsubscribeMachine?.();
    super.remove();
  }
}
