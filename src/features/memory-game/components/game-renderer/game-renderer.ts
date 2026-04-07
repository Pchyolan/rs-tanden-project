import { BaseComponent, Observable } from '@/core';
import { SoundKey, SoundService } from '@/services/sound-service.ts';

import { GraphRenderer } from '../graph-renderer/graph-renderer.ts';
import type { GameState, MemoryGamePayload } from '../../types.ts';
import { gameStates } from '../../constants.ts';

import infoLogo from '@/assets/images/icons/info.png';
import questionLogo from '@/assets/images/icons/question.png';
import refreshLogo from '@/assets/images/icons/refresh.png';
import sparkleImage from '@/assets/images/icons/sparkle.png';

import Prism from 'prismjs';
import '@/styles/prism/prism-tailwind-moon-blue.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/line-highlight/prism-line-highlight.css';
import 'prismjs/plugins/line-highlight/prism-line-highlight';

import { language$ } from '@/store/language-store.ts';
import { translations } from '@/i18n';
import { getElementWithType } from '@/utils/selectors.ts';

import './game-renderer.scss';
import './round-buttons.scss';
import './prism-styles.scss';

type MemoryGameRendererProps = {
  payload: MemoryGamePayload;
  gameState$: Observable<GameState>;
  onObjectClick: (objectId: string) => void;
  onReset: () => void;
  onCollect: () => void;
};

export class MemoryGameRenderer extends BaseComponent {
  private readonly payload: MemoryGamePayload;
  private currentState: string = gameStates.idle;

  private graphRenderer?: GraphRenderer;
  private soundService = SoundService.getInstance();

  private unsubscribeMachine?: () => void;
  private unsubscribeLanguage?: () => void;

  private codeHeader?: BaseComponent;
  private graphHeader?: BaseComponent;

  private markedCounter?: BaseComponent<'span'>;
  private collectButton?: BaseComponent<'button'>;

  private refreshWrapper?: BaseComponent;
  private questionWrapper?: BaseComponent;
  private infoWrapper?: BaseComponent;

  constructor({ payload, gameState$, onObjectClick, onReset, onCollect }: MemoryGameRendererProps) {
    super({
      tag: 'div',
      className: ['memory-game__container'],
    });

    this.payload = payload;

    this.createUI(onObjectClick, onReset, onCollect);

    this.subscribeToMachine(gameState$);
    this.unsubscribeLanguage = language$.subscribe(() => this.updateText());
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

    panelsContainer.append(this.renderCodePanel(), this.renderGraphPanel());

    this.append(panelsContainer, this.renderBottomPanel(onCollect, onReset));
  }

  private renderCodePanel(): BaseComponent {
    const panel = new BaseComponent({
      tag: 'div',
      className: ['memory-game__code-panel'],
    });

    this.codeHeader = new BaseComponent({
      tag: 'div',
      text: translations[language$.value].codePanelName,
      className: ['memory-game__panel-header'],
    });

    const codeContainer = this.renderCodeSnippet();
    panel.append(this.codeHeader, codeContainer);
    return panel;
  }

  private renderGraphPanel(): BaseComponent {
    const panel = new BaseComponent({
      tag: 'div',
      className: ['memory-game__graph-panel'],
    });

    this.graphHeader = new BaseComponent({
      tag: 'div',
      text: translations[language$.value].graphPanelName,
      className: ['memory-game__panel-header'],
    });

    if (this.graphRenderer) {
      panel.append(this.graphHeader, this.graphRenderer);
    } else {
      panel.append(this.graphHeader);
    }
    return panel;
  }

  private renderIconWrapper(
    iconLogo: string,
    iconAltText: string,
    tooltipContent: BaseComponent | string
  ): BaseComponent {
    const iconContainer = new BaseComponent({
      tag: 'div',
      className: ['memory-game__icon-container'],
    });

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

    const sparkleImg = new BaseComponent<'img'>({
      tag: 'img',
      className: ['memory-game__sparkle'],
      attrs: {
        src: sparkleImage,
        alt: iconAltText,
      },
    });

    iconWrapper.append(iconImg);

    const tooltip = new BaseComponent({
      tag: 'div',
      className: ['memory-game__tooltip'],
    });

    if (typeof tooltipContent === 'string') {
      tooltip.element.textContent = tooltipContent;
    } else {
      tooltip.append(tooltipContent);
    }

    iconContainer.append(iconWrapper, sparkleImg, tooltip);

    return iconContainer;
  }

  private renderAdditionButtons(onReset: () => void): BaseComponent {
    const buttonsBlock = new BaseComponent({
      tag: 'div',
      className: ['memory-game__buttons-block'],
    });

    const hintContainer = new BaseComponent({ tag: 'div', className: ['memory-game__hint-tooltip-content'] });
    const p1 = new BaseComponent({
      tag: 'p',
      text: translations[language$.value].hintFirstLine,
      className: ['hint__first-line'],
    });
    const p2 = new BaseComponent({
      tag: 'p',
      text: translations[language$.value].hintSecondLine,
      className: ['hint__second-line'],
    });
    const p3 = new BaseComponent({
      tag: 'p',
      text: translations[language$.value].hintThirdLine,
      className: ['hint__third-line'],
    });
    hintContainer.append(p1, p2, p3);

    this.infoWrapper = this.renderIconWrapper(infoLogo, translations[language$.value].infoTooltip, hintContainer);

    this.questionWrapper = this.renderIconWrapper(
      questionLogo,
      translations[language$.value].clueTooltip,
      translations[language$.value].clueTooltip
    );

    this.refreshWrapper = this.renderIconWrapper(
      refreshLogo,
      translations[language$.value].refreshTooltip,
      translations[language$.value].refreshTooltip
    );
    this.refreshWrapper.addEventListener('click', onReset);

    buttonsBlock.append(this.infoWrapper, this.questionWrapper, this.refreshWrapper);

    return buttonsBlock;
  }

  /**
   * Левая часть
   */
  private renderCodeSnippet(): BaseComponent<'pre'> {
    const codeContainer = new BaseComponent<'pre'>({
      tag: 'pre',
      className: ['memory-game__code', 'line-numbers'],
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
  private renderBottomPanel(onCollect: () => void, onReset: () => void): BaseComponent {
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
        text: translations[language$.value].selectedLine,
        className: ['memory-game__text', 'selected-garbage-line'],
      }),
      this.markedCounter
    );

    this.collectButton = new BaseComponent<'button'>({
      tag: 'button',
      text: translations[language$.value].collectButton,
      className: ['memory-game__button'],
    });
    this.collectButton.addEventListener('click', onCollect);

    bottomPanel.append(textWrapper, this.collectButton, this.renderAdditionButtons(onReset));

    return bottomPanel;
  }

  public updateMarkedObjects(markedSet: Set<string>): void {
    if (this.markedCounter) {
      this.markedCounter.element.textContent = String(markedSet.size);
    }

    this.graphRenderer?.updateMarkedObjects(markedSet);
  }

  public highlightCode() {
    const preElement = getElementWithType(HTMLElement, 'memory-game__code', this.element);
    if (!preElement) return;

    // Удаляем старые артефакты плагинов
    const oldRows = preElement.querySelector('.line-numbers-rows');
    if (oldRows) oldRows.remove();

    preElement.querySelectorAll('.line-highlight').forEach((element) => element.remove());

    // Добавляем классы и атрибуты
    preElement.classList.add('line-numbers');
    if (this.payload.highlightedLine) {
      preElement.classList.add('line-highlight');
      preElement.dataset.line = String(this.payload.highlightedLine);
    }

    // Запускаем подсветку
    Prism.highlightAllUnder(this.element);
  }

  private subscribeToMachine(gameState$: Observable<GameState>) {
    this.unsubscribeMachine = gameState$.subscribe((state) => {
      const isActive = state === gameStates.idle;
      this.currentState = state;
      this.setInteractive(isActive);

      if (this.collectButton) {
        this.collectButton.element.textContent = this.getButtonText();
        if (this.currentState === gameStates.submitting) {
          this.collectButton.element.classList.add('loading');
          this.collectButton.element.disabled = true;
        } else {
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
  private updateText(): void {
    const dictionary = translations[language$.value];

    if (this.codeHeader) {
      this.codeHeader.element.textContent = dictionary.codePanelName;
    }

    if (this.graphHeader) {
      this.graphHeader.element.textContent = dictionary.graphPanelName;
    }

    const hintFirstLine = getElementWithType(HTMLParagraphElement, 'hint__first-line', this.element);
    hintFirstLine.textContent = dictionary.hintFirstLine;

    const hintSecondLine = getElementWithType(HTMLParagraphElement, 'hint__second-line', this.element);
    hintSecondLine.textContent = dictionary.hintSecondLine;

    const hintThirdLine = getElementWithType(HTMLParagraphElement, 'hint__third-line', this.element);
    hintThirdLine.textContent = dictionary.hintThirdLine;

    const selectedLine = getElementWithType(HTMLSpanElement, 'selected-garbage-line', this.element);
    selectedLine.textContent = dictionary.selectedLine;

    if (this.collectButton) {
      this.collectButton.element.textContent = this.getButtonText();
    }

    if (this.questionWrapper) {
      const questionTooltip = getElementWithType(HTMLDivElement, 'memory-game__tooltip', this.questionWrapper.element);
      questionTooltip.textContent = dictionary.clueTooltip;
    }

    if (this.refreshWrapper) {
      const refreshTooltip = getElementWithType(HTMLDivElement, 'memory-game__tooltip', this.refreshWrapper.element);
      refreshTooltip.textContent = dictionary.refreshTooltip;
    }
  }

  private getButtonText(): string {
    let buttonText = translations[language$.value].collectButton;

    if (this.currentState === gameStates.submitting) {
      buttonText = translations[language$.value].submittingButton;
    }

    return buttonText;
  }

  public override remove(): void {
    this.unsubscribeMachine?.();
    this.unsubscribeLanguage?.();
    super.remove();
  }
}
