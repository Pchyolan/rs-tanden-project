import type { WidgetDataSource } from '@/api/widget-data-source';
import { MockWidgetDataSource, SupabaseWidgetDataSource } from '@/api/widget-data-source';

import type { ProfileDataSource } from '@/api/profile-data-source';
import { MockProfileDataSource, SupabaseProfileDataSource } from '@/api/profile-data-source';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const widgetDataSource: WidgetDataSource = USE_MOCK
  ? new MockWidgetDataSource()
  : new SupabaseWidgetDataSource();

export const profileDataSource: ProfileDataSource = USE_MOCK
  ? new MockProfileDataSource()
  : new SupabaseProfileDataSource();
