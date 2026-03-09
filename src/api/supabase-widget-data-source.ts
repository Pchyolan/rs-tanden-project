import type { Widget, WidgetType, Verdict } from '@/types';
import type { WidgetDataSource } from './types';

export class SupabaseWidgetDataSource implements WidgetDataSource {
  async getWidgetById<T extends Widget = Widget>(widgetType: WidgetType, widgetId: string): Promise<T> {
    throw new Error(
      `SupabaseWidgetDataSource.getWidgetById not implemented for WidgetType ${widgetType} and id ${widgetId}. Use VITE_USE_MOCK=true for development.`
    );
  }

  async submitAnswer(widgetType: WidgetType, widgetId: string, answer: unknown): Promise<Verdict> {
    throw new Error(
      `SupabaseWidgetDataSource.submitAnswer not implemented for WidgetType ${widgetType}, id ${widgetId} and answer ${answer}. Use VITE_USE_MOCK=true for development.`
    );
  }
}
