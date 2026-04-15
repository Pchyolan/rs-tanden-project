import { Observable } from '@/core';

const STORAGE_KEY = 'app-theme';
const defaultTheme: 'light' | 'dark' = 'light';

const savedTheme = localStorage.getItem(STORAGE_KEY);
const initialTheme = savedTheme && (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : defaultTheme;

export const theme$ = new Observable<'light' | 'dark'>(initialTheme);

theme$.subscribe((theme) => {
  localStorage.setItem(STORAGE_KEY, theme);
  document.body.classList.toggle('dark-theme', theme === 'dark');
});
