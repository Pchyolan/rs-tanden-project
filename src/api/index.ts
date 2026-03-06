import { MockWidgetDataSource } from './mock-widget-data-source';
import { SupabaseWidgetDataSource } from './supabase-widget-data-source';
import type { WidgetDataSource } from './types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const widgetDataSource: WidgetDataSource = USE_MOCK
  ? new MockWidgetDataSource()
  : new SupabaseWidgetDataSource();
