import { Observable } from '@/core';

export type ToastType = 'success' | 'error' | 'info';

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
};

class ToastService {
  private toasts$ = new Observable<Toast[]>([]);
  private nextId = 0;

  /** Возвращает Observable со списком тостов */
  public getToasts(): Observable<Toast[]> {
    return this.toasts$;
  }

  /** Показать тост */
  public show(message: string, type: ToastType = 'info', duration = 3000): void {
    const id = String(this.nextId++);
    const newToast: Toast = { id, message, type, duration };
    const current = this.toasts$.value;
    this.toasts$.set([...current, newToast]);

    if (duration > 0) {
      setTimeout(() => this.hide(id), duration);
    }
  }

  /** Скрыть конкретный тост */
  public hide(id: string): void {
    const current = this.toasts$.value;
    this.toasts$.set(current.filter((t) => t.id !== id));
  }

  /** Очистить все тосты */
  public clear(): void {
    this.toasts$.set([]);
  }
}

export const toastService = new ToastService();

export const showToast = toastService.show.bind(toastService);
