import { BaseComponent, type Page } from '../core';

// Это можно будет вынести во внешний файл типа utils
function createHeading(text: string): HTMLHeadingElement {
  const element = document.createElement('h1');
  element.textContent = text;
  return element;
}

function createButton(text: string, onClick: () => void): HTMLButtonElement {
  const button = document.createElement('button');
  button.textContent = text;
  button.addEventListener('click', onClick);
  return button;
}

function createContainer(className: string, ...children: HTMLElement[]): HTMLDivElement {
  const div = document.createElement('div');
  div.className = className;
  children.forEach((child) => div.append(child));
  return div;
}

// Это уже для самого DOM
function handleClick(selector: string) {
  const h1 = document.querySelector(selector);
  if (h1) h1.textContent = 'Текст изменён после клика!';
}

export function widgetEnginePage(): Page {
  return {
    render() {
      // Создаём DOM
      const h1 = createHeading('Привет из нативного DOM');
      const button = createButton('Нажми меня', () => handleClick('h1'));
      const container = createContainer('my-page', h1, button);

      //в конце оборачиваем всё в BaseComponent (для совместимости)
      return new BaseComponent(container);
    },
    onMount: () => console.log('Страница смонтирована'),
  };
}
