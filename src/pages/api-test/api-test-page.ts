import type { Page } from '@/core';
import { ApiTestPageController } from './api-test-page-controller';

export function apiTestPage(): Page {
  const controller = new ApiTestPageController();
  return {
    render: controller.render,
    onMount: controller.onMount,
    onDestroy: controller.onDestroy,
  };
}
