import { BaseComponent, Observable } from '@/core';
import { widgetEvents } from '@/constants';
import type { WidgetComponent } from '@/types';

import konturImg from '@/assets/kontur.png';
import raskrasImg from '@/assets/raskras.png';

import { MemoryGameWidgetCreator } from '@/features/memory-game/memory-game-widget-creator.ts';
import { createLeftArrow, createRightArrow } from '@/utils/svg-icon.ts';

import './ticket-controller.scss';

export class TicketPageController extends BaseComponent {
  private currentIndex: number = 0;
  private readonly currentWidgetWrapper: BaseComponent;
  private currentWidget: WidgetComponent | null = null;

  private isLoading$ = new Observable(false);
  private readonly spinnerComponent: BaseComponent;

  private readonly widgetsList: string[];
  private taskSegments: BaseComponent[] = [];
  private readonly counterElement: BaseComponent<'span'>;

  private readonly leftButton: BaseComponent<'button'>;
  private readonly rightButton: BaseComponent<'button'>;

  constructor(widgetsList: string[]) {
    super({ tag: 'div', className: ['ticket-page'] });

    this.widgetsList = widgetsList;

    const tasksWrapper = new BaseComponent({
      tag: 'div',
      className: ['task-wrapper'],
    });

    this.counterElement = new BaseComponent({
      tag: 'span',
      className: ['task-counter'],
      text: `Task 1 / ${widgetsList.length}`,
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

    tasksWrapper.append(this.counterElement, segmentsContainer);

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

    this.loadNext();
  }

  private loadNext() {
    this.currentWidgetWrapper.clear();
    this.isLoading$.set(true);

    if (this.currentIndex >= this.widgetsList.length) {
      this.counterElement.element.textContent = '';
      this.updateButtonsState();
      this.showCompletionMessage();
      return;
    }

    const widgetId = this.widgetsList[this.currentIndex];

    if (widgetId) {
      this.currentWidget = new MemoryGameWidgetCreator(widgetId);

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
    this.updateTaskSegments();
    this.updateButtonsState();
  }

  private goToPrevious(): void {
    if (this.currentIndex >= this.widgetsList.length || this.currentIndex <= 0) return;
    this.currentIndex--;
    this.loadNext();
  }

  private goToNext(): void {
    if (this.currentIndex >= this.widgetsList.length - 1) return;
    this.currentIndex++;
    this.loadNext();
  }

  private updateTaskSegments(): void {
    this.counterElement.element.textContent = `Task ${this.currentIndex + 1} / ${this.widgetsList.length}`;

    this.taskSegments.forEach((segment, index) => {
      segment.element.classList.toggle('active', index <= this.currentIndex);
    });
  }

  private showCompletionMessage(): void {
    const message = new BaseComponent({
      tag: 'div',
      text: 'Ticket completed! Well done!',
      className: ['ticket-complete'],
    });
    this.currentWidgetWrapper.append(message);

    this.updateButtonsState();
  }

  private updateButtonsState(): void {
    if (this.currentIndex >= this.widgetsList.length) {
      this.leftButton.element.disabled = true;
      this.rightButton.element.disabled = true;
    } else {
      this.leftButton.element.disabled = this.currentIndex === 0;
      this.rightButton.element.disabled = this.currentIndex === this.widgetsList.length - 1;
    }
  }

  public override remove(): void {
    this.currentWidget?.destroy();
    super.remove();
  }
}
