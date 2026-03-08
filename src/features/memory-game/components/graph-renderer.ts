import { BaseComponent } from '@/core';
import type { MemoryGamePayload, MemoryObject } from '@/features/memory-game/types';

import './graph-renderer.scss';

type GraphRendererProps = {
  payload: MemoryGamePayload;
  onObjectClick: (objectId: string) => void;
};

export class GraphRenderer extends BaseComponent {
  private static readonly config = {
    objectWidth: 140,
    objectHeight: 80,
    objectRadius: 40,
    objectCenterX: 70, // половина ширины
    objectCenterY: 40, // половина высоты

    rootX: 350,
    rootY: 5,
    rootWidth: 200,
    rootHeight: 80,
    rootRadius: 40,
    rootCenterX: 450, // rootX + половина ширины
    rootCenterY: 5 + 40, // rootY + половина высоты

    viewBoxWidth: 800,
    viewBoxHeight: 400,

    arrowMarkerId: 'arrowhead',
    arrowSize: 8,
    arrowRefX: 7,
    arrowRefY: 4,

    textOffsetY: -0.4, // смещение для первой строки
    textLineHeight: 1.4, // расстояние между строками
  } as const;

  private payload: MemoryGamePayload;
  private readonly svg: SVGElement;
  private objectElements = new Map<string, SVGGElement>();
  private readonly onObjectClick: (objectId: string) => void;

  constructor({ payload, onObjectClick }: GraphRendererProps) {
    super({
      tag: 'div',
      className: ['memory-game__graph-container'],
    });

    this.payload = payload;
    this.onObjectClick = onObjectClick;

    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('width', '100%');
    this.svg.setAttribute('height', '100%');
    this.svg.setAttribute('viewBox', `0 0 ${GraphRenderer.config.viewBoxWidth} ${GraphRenderer.config.viewBoxHeight}`);
    this.element.append(this.svg);

    this.renderGraph();
  }

  private renderGraph() {
    this.addArrowMarker();

    this.renderRoot();
    this.renderRootLinks();

    this.renderLinks();
    this.renderObjects();
  }

  private addArrowMarker(): void {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', GraphRenderer.config.arrowMarkerId);
    marker.setAttribute('markerWidth', String(GraphRenderer.config.arrowSize));
    marker.setAttribute('markerHeight', String(GraphRenderer.config.arrowSize));
    marker.setAttribute('refX', String(GraphRenderer.config.arrowRefX));
    marker.setAttribute('refY', String(GraphRenderer.config.arrowRefY));
    marker.setAttribute('orient', 'auto');
    marker.setAttribute('markerUnits', 'strokeWidth');

    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute(
      'points',
      `0 0, ${GraphRenderer.config.arrowRefX} ${GraphRenderer.config.arrowRefY}, 0 ${GraphRenderer.config.arrowSize}`
    );
    polygon.setAttribute('fill', 'white');

    marker.append(polygon);
    defs.append(marker);
    this.svg.append(defs);
  }

  private renderRoot(): void {
    const rootId = this.payload.rootIds[0];
    if (!rootId) return;

    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.dataset.id = rootId;
    group.classList.add('graph-object', 'root');

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', String(GraphRenderer.config.rootX));
    rect.setAttribute('y', String(GraphRenderer.config.rootY));
    rect.setAttribute('width', String(GraphRenderer.config.rootWidth));
    rect.setAttribute('height', String(GraphRenderer.config.rootHeight));
    rect.setAttribute('rx', String(GraphRenderer.config.rootRadius));
    rect.classList.add('object-rect');

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', String(GraphRenderer.config.rootCenterX));
    text.setAttribute('y', String(GraphRenderer.config.rootCenterY + 10));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('class', 'graph-object__label-root');
    text.textContent = rootId;

    group.append(rect);
    group.append(text);
    this.svg.append(group);
  }

  private renderRootLinks(): void {
    this.payload.rootLinks.forEach((link) => {
      const targetObject = this.payload.objects.find((o) => o.id === link.to);
      if (!targetObject) return;

      const fromX = GraphRenderer.config.rootX;
      const fromY = GraphRenderer.config.rootCenterY;
      const toX = targetObject.x + GraphRenderer.config.objectCenterX;
      const toY = targetObject.y;

      const midX = toX;
      const midY = fromY;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M ${fromX} ${fromY} L ${midX} ${midY} L ${toX} ${toY}`);
      path.classList.add('graph-link', 'root-link');
      path.setAttribute('marker-end', `url(#${GraphRenderer.config.arrowMarkerId})`);
      this.svg.append(path);
    });
  }

  private renderLinks() {
    this.payload.links.forEach((link) => {
      const fromObject = this.payload.objects.find((item) => item.id === link.from);
      const toObject = this.payload.objects.find((item) => item.id === link.to);
      if (!fromObject || !toObject) return;

      const fromX = fromObject.x + GraphRenderer.config.objectCenterX;
      const fromY = fromObject.y + GraphRenderer.config.objectCenterY;
      const toX = toObject.x;
      const toY = toObject.y + GraphRenderer.config.objectCenterY;

      const midX = fromX;
      const midY = toY;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M ${fromX} ${fromY} L ${midX} ${midY} L ${toX} ${toY}`);
      path.setAttribute('marker-end', `url(#${GraphRenderer.config.arrowMarkerId})`);
      path.classList.add('graph-link');

      this.svg.append(path);
    });
  }

  private renderObjects() {
    this.payload.objects.forEach((object) => {
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.dataset.id = object.id;
      group.classList.add('graph-object');

      group.addEventListener('click', (event) => {
        event.stopPropagation();
        this.onObjectClick(object.id);
      });

      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', String(object.x));
      rect.setAttribute('y', String(object.y));
      rect.setAttribute('width', String(GraphRenderer.config.objectWidth));
      rect.setAttribute('height', String(GraphRenderer.config.objectHeight));
      rect.setAttribute('rx', String(GraphRenderer.config.objectRadius));
      rect.classList.add('object-rect');

      group.append(rect);

      const text = this.createText(object);
      group.append(text);

      this.objectElements.set(object.id, group);
      this.svg.append(group);
    });
  }

  private createText(object: MemoryObject): SVGTextElement {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('x', String(object.x + GraphRenderer.config.objectCenterX));
    text.setAttribute('y', String(object.y + GraphRenderer.config.objectCenterY));

    const lines = object.label.split(' ');
    const tspan1 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    tspan1.setAttribute('x', String(object.x + GraphRenderer.config.objectCenterX));
    tspan1.setAttribute('dy', String(GraphRenderer.config.textOffsetY) + 'em');
    tspan1.textContent = lines[0] || '';

    const tspan2 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    tspan2.setAttribute('x', String(object.x + GraphRenderer.config.objectCenterX));
    tspan2.setAttribute('dy', String(GraphRenderer.config.textLineHeight) + 'em');
    tspan2.setAttribute('class', 'graph-object__label-second');
    tspan2.textContent = lines[1] || '';

    text.append(tspan1);
    text.append(tspan2);

    return text;
  }

  public updateMarkedObjects(markedSet: Set<string>): void {
    for (const [id, element] of this.objectElements) {
      element.classList.toggle('marked', markedSet.has(id));
    }
  }
}
