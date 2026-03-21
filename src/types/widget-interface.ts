import { BaseComponent } from '@/core';
import type { WidgetEvent } from '@/types';

export type WidgetComponent = {
  /**
   * Возвращает корневой элемент компонента для встраивания в DOM
   * После вызова этого метода компонент начинает загрузку данных и отрисовку
   */
  render(): BaseComponent;

  /**
   * Подписывается на событие завершения виджета
   * Виджет вызывает это событие, когда пользователь успешно прошёл задание
   */
  on(event: WidgetEvent, handler: () => void): void;

  /**
   * Уничтожает компонент, очищает ресурсы
   */
  destroy(): void;
};
