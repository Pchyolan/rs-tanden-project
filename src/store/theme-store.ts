import { Observable } from '@/core';

export const theme$ = new Observable<'light' | 'dark'>('light');

theme$.subscribe((theme) => {
  document.body.classList.toggle('dark-theme', theme === 'dark');
});
