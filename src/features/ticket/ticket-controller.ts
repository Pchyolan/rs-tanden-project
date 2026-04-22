import { BaseComponent, Observable, WidgetFactory } from '@/core';
import { widgetEvents } from '@/constants';
import type { TicketItem, WidgetComponent } from '@/types';

import { language$ } from '@/store/language-store';
import { translations } from '@/i18n';

import konturImg from '@/assets/kontur.png';
import raskrasImg from '@/assets/raskras.png';
import { createLeftArrow, createRightArrow } from '@/utils/svg-icon';

import './ticket-controller.scss';
import { showToast } from '@/services/toast-service.ts';

export class TicketPageController extends BaseComponent {
  private currentIndex: number = 0;
  private currentWidget: WidgetComponent | null = null;
  private readonly currentWidgetWrapper: BaseComponent;
  private factory: WidgetFactory;

  private isLoading$ = new Observable(false);
  private readonly spinnerComponent: BaseComponent;

  private readonly ticketItems: TicketItem[];
  private taskSegments: BaseComponent[] = [];

  private counterPrefix?: BaseComponent<'span'>;
  private counterNumber?: BaseComponent<'span'>;
  private completionMessage?: BaseComponent;
  private readonly unsubscribeLanguage?: () => void;

  private readonly leftButton: BaseComponent<'button'>;
  private readonly rightButton: BaseComponent<'button'>;

  constructor(widgetsList: TicketItem[]) {
    super({ tag: 'div', className: ['ticket-page'] });

    this.ticketItems = widgetsList;
    this.factory = new WidgetFactory();

    const tasksWrapper = new BaseComponent({
      tag: 'div',
      className: ['task-wrapper'],
    });

    const segmentsContainer = new BaseComponent({
      tag: 'div',
      className: ['segments-container'],
    });

    for (let i = 0; i < widgetsList.length; i++) {
      const segment = new BaseComponent({
        tag: 'div',
        className: ['task-segment'],
      });
      this.taskSegments.push(segment);
      segmentsContainer.append(segment);
    }

    tasksWrapper.append(this.renderTaskCounter(), segmentsContainer);

    const widgetWrapper = new BaseComponent({
      tag: 'div',
      className: ['widget-wrapper'],
    });

    this.currentWidgetWrapper = new BaseComponent({
      tag: 'div',
      className: ['current-wrapper'],
    });

    this.leftButton = new BaseComponent({ tag: 'button', className: ['arrow-button'] });
    this.leftButton.element.append(createLeftArrow('arrow-left'));
    this.leftButton.addEventListener('click', () => this.goToPrevious());

    this.rightButton = new BaseComponent({ tag: 'button', className: ['arrow-button'] });
    this.rightButton.element.append(createRightArrow('arrow-right'));
    this.rightButton.addEventListener('click', () => this.goToNext());

    widgetWrapper.append(this.leftButton, this.currentWidgetWrapper, this.rightButton);

    this.append(tasksWrapper, widgetWrapper);

    this.spinnerComponent = new BaseComponent({ tag: 'div', className: ['brain-loader'] });

    const contourLayer = new BaseComponent({ tag: 'div', className: ['brain-loader__contour'] });
    const fillLayer = new BaseComponent({ tag: 'div', className: ['brain-loader__fill'] });

    contourLayer.element.style.backgroundImage = `url(${konturImg})`;
    fillLayer.element.style.backgroundImage = `url(${raskrasImg})`;

    this.spinnerComponent.append(fillLayer, contourLayer);
    this.isLoading$.subscribe((isLoading: boolean) => {
      if (isLoading) this.currentWidgetWrapper.append(this.spinnerComponent);
      else this.spinnerComponent.remove();
    });

    this.unsubscribeLanguage = language$.subscribe(() => this.updateTexts());

    this.loadNext();
  }

  private renderTaskCounter(): BaseComponent {
    const counterContainer = new BaseComponent({
      tag: 'div',
      className: ['task-counter'],
    });

    this.counterPrefix = new BaseComponent({
      tag: 'span',
      className: ['task-counter-prefix'],
      text: translations[language$.value].taskPrefix,
    });
    this.counterNumber = new BaseComponent({
      tag: 'span',
      className: ['task-counter-number'],
      text: ` 1 / ${this.taskSegments.length}`,
    });

    counterContainer.append(this.counterPrefix, this.counterNumber);
    return counterContainer;
  }

  private loadNext() {
    this.currentWidgetWrapper.clear();
    this.isLoading$.set(true);

    if (this.currentIndex >= this.ticketItems.length) {
      if (this.counterPrefix) {
        this.counterPrefix.element.textContent = '';
      }
      if (this.counterNumber) {
        this.counterNumber.element.textContent = '';
      }

      this.updateButtonsState();
      this.showCompletionMessage();
      return;
    }

    try {
      const currentItem = this.ticketItems[this.currentIndex];
      if (currentItem) {
        const { type, id } = currentItem;
        this.currentWidget = this.factory.create(type, id);

        this.currentWidget.on(widgetEvents.Ready, () => {
          this.isLoading$.set(false);
        });

        this.currentWidget.on(widgetEvents.Complete, () => {
          this.currentIndex++;
          this.updateTaskSegments();
          this.loadNext();
        });

        this.currentWidgetWrapper.append(this.currentWidget.render());
      }
    } catch (error) {
      showToast(`Failed to load widget: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      this.isLoading$.set(false);
      // TODO: показать кнопку повторной загрузки (?)
    }
    this.updateTaskSegments();
    this.updateButtonsState();
  }

  private goToPrevious(): void {
    if (this.currentIndex >= this.ticketItems.length || this.currentIndex <= 0) return;
    this.currentIndex--;
    this.loadNext();
  }

  private goToNext(): void {
    if (this.currentIndex >= this.ticketItems.length - 1) return;
    this.currentIndex++;
    this.loadNext();
  }

  private updateTaskSegments(): void {
    if (this.counterNumber) {
      this.counterNumber.element.textContent = ` ${this.currentIndex + 1} / ${this.ticketItems.length}`;
    }

    this.taskSegments.forEach((segment, index) => {
      segment.element.classList.toggle('active', index <= this.currentIndex);
    });
  }

  private showCompletionMessage(): void {
    this.completionMessage = new BaseComponent({
      tag: 'div',
      text: translations[language$.value].ticketComplete,
      className: ['ticket-complete'],
    });
    this.currentWidgetWrapper.append(this.completionMessage);

    this.updateButtonsState();
  }

  private updateButtonsState(): void {
    if (this.currentIndex >= this.ticketItems.length) {
      this.leftButton.element.disabled = true;
      this.rightButton.element.disabled = true;
    } else {
      this.leftButton.element.disabled = this.currentIndex === 0;
      this.rightButton.element.disabled = this.currentIndex === this.ticketItems.length - 1;
    }
  }

  private updateTexts(): void {
    if (this.counterPrefix) {
      this.counterPrefix.element.textContent = translations[language$.value].taskPrefix;
    }
    if (this.completionMessage) {
      this.completionMessage.element.textContent = translations[language$.value].ticketComplete;
    }
  }

  public override remove(): void {
    this.unsubscribeLanguage?.();
    this.currentWidget?.destroy();
    super.remove();
  }
}
