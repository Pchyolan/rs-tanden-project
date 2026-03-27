import { BaseComponent, type Page } from '@/core';
import { renderHomePage } from './home-page-functional';

export function homePage(): Page {
  return {
    render: () => {
      const element = renderHomePage();
      return new BaseComponent(element);
    },
    onMount: () => console.log('Home page mounted'),
    onDestroy: () => console.log('Home page destroyed'),
  };
}
