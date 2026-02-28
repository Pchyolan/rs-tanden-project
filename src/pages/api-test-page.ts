import type { Page } from '../core';
import { ApiTestPageController } from './controllers';

export function apiTestPage(): Page {
  const controller = new ApiTestPageController();
  return {
    render: controller.render,
    onMount: controller.onMount,
    onDestroy: controller.onDestroy,
  };
}
