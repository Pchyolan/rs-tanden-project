import { BaseComponent } from '@/core';
import { toastService, type Toast } from '@/services/toast-service';

import './toast-container.scss';

export class ToastContainer extends BaseComponent {
  private readonly unsubscribe: () => void;
  private toastElements = new Map<string, BaseComponent>();

  constructor() {
    super({ tag: 'div', className: ['toast-container'] });
    this.unsubscribe = toastService.getToasts().subscribe((toasts) => {
      this.syncToasts(toasts);
    });
  }

  private syncToasts(toasts: Toast[]): void {
    const currentIds = new Set(toasts.map((t) => t.id));

    // Удаляем тосты, которых больше нет в списке
    for (const [id, element] of this.toastElements) {
      if (!currentIds.has(id)) {
        element.remove();
        this.toastElements.delete(id);
      }
    }

    // Добавляем новые
    toasts.forEach((toast) => {
      if (!this.toastElements.has(toast.id)) {
        const toastElement = this.createToastElement(toast);
        this.toastElements.set(toast.id, toastElement);
        this.append(toastElement);
      }
    });
  }

  private createToastElement(toast: Toast): BaseComponent {
    const container = new BaseComponent({
      tag: 'div',
      className: ['toast', `toast--${toast.type}`],
    });

    const messageSpan = new BaseComponent({
      tag: 'span',
      text: toast.message,
      className: ['toast__message'],
    });

    const closeButton = new BaseComponent({
      tag: 'button',
      className: ['toast__close'],
      text: '✕',
    });
    closeButton.addEventListener('click', () => toastService.hide(toast.id));

    container.append(messageSpan, closeButton);
    return container;
  }

  public override remove(): void {
    this.unsubscribe();
    super.remove();
  }
}
