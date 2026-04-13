import type { Difficulty, WidgetType } from '@/types';

type WidgetRegistryItem = {
  id: string;
  type: WidgetType;
  difficulty: Difficulty;
  tags: string[];
};

type WidgetJsonModule = {
  default: WidgetRegistryItem;
};

const widgetModules = import.meta.glob<WidgetJsonModule>('./widgets/*/*.json', {
  eager: true,
});

export const widgetRegistry: WidgetRegistryItem[] = Object.values(widgetModules).map((module_) => module_.default);
