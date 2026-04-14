import { type Page, Router } from '@/core';
import { LoginForm } from '@/features/login';

/**
 * Фабрика для создания страницы логина.
 * @param router - экземпляр роутера
 * @returns объект страницы, соответствующий интерфейсу Page
 */
export function loginPage(router: Router): Page {
  return new LoginForm(router);
}
