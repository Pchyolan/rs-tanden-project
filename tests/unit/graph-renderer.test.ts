import { describe, it, expect, beforeEach } from 'vitest';
import { GraphRenderer } from '@/features/memory-game/components';
import type { MemoryGamePayload } from '@/features/memory-game/types';

const mockPayload: MemoryGamePayload = {
  codeSnippet: '',
  objects: [
    { id: 'obj1', label: 'First Object', x: 100, y: 100 },
    { id: 'obj2', label: 'Second Item', x: 300, y: 100 },
  ],
  links: [{ from: 'obj1', to: 'obj2' }],
  rootIds: ['root1'],
  rootLinks: [{ from: 'root1', to: 'obj1' }],
};

describe('GraphRenderer', () => {
  let renderer: GraphRenderer;

  beforeEach(() => {
    renderer = new GraphRenderer({ payload: mockPayload, onObjectClick: () => {} });
    document.body.append(renderer.element);
  });

  afterEach(() => {
    renderer.remove();
  });

  it('Creates container with correct class', () => {
    expect(renderer.element.classList.contains('memory-game__graph-container')).toBe(true);
  });

  it('Creates svg element with viewBox', () => {
    const svg = renderer.element.querySelector('svg');
    expect(svg).toBeDefined();
    expect(svg?.getAttribute('viewBox')).toBe('0 0 800 400');
  });

  it('Adds arrow marker definition', () => {
    const marker = renderer.element.querySelector('#arrowhead');
    expect(marker).toBeDefined();
    expect(marker?.tagName).toBe('marker');
  });

  it('Renders root object with class "root"', () => {
    const root = renderer.element.querySelector<HTMLElement>('.graph-object.root');
    expect(root).toBeDefined();

    expect(root?.dataset.id).toBe('root1');
    const rect = root?.querySelector('rect');
    expect(rect).toBeDefined();
  });

  it('Renders non-root objects without "root" class', () => {
    const objects = renderer.element.querySelectorAll('.graph-object:not(.root)');
    expect(objects.length).toBe(2);

    objects.forEach((object) => {
      expect(object.classList.contains('root')).toBe(false);
    });
  });

  it('Renders object labels as two lines', () => {
    const text = renderer.element.querySelector('.graph-object:not(.root) text');
    expect(text).toBeDefined();

    const spans = text?.querySelectorAll('tspan');
    expect(spans?.length).toBe(2);

    expect(spans?.[0]?.textContent).toBe('First');
    expect(spans?.[1]?.textContent).toBe('Object');
  });

  it('Renders links with class "graph-link"', () => {
    const links = renderer.element.querySelectorAll('.graph-link');
    expect(links.length).toBe(2);

    expect(links[0]?.classList.contains('root-link')).toBe(true);
    expect(links[1]?.classList.contains('root-link')).toBe(false);
  });

  it('Updates marked class on objects', () => {
    const object = renderer.element.querySelector('[data-id="obj1"]');
    expect(object?.classList.contains('marked')).toBe(false);

    renderer.updateMarkedObjects(new Set(['obj1']));
    expect(object?.classList.contains('marked')).toBe(true);

    renderer.updateMarkedObjects(new Set());
    expect(object?.classList.contains('marked')).toBe(false);
  });
});
