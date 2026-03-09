import type { Widget, WidgetType, Verdict } from '@/types';

export type WidgetDataSource = {
  getWidgetById<T extends Widget = Widget>(widgetType: WidgetType, widgetId: string): Promise<T>;
  submitAnswer(widgetType: WidgetType, widgetId: string, answer: unknown): Promise<Verdict>;
};
