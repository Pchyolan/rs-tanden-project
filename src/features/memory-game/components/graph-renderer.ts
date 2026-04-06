import { BaseComponent } from '@/core';
import { SoundKey, SoundService } from '@/services/sound-service';
import type { MemoryGamePayload, MemoryObject } from '@/features/memory-game/types';

import './graph-renderer.scss';

type GraphRendererProps = {
  payload: MemoryGamePayload;
  onObjectClick: (objectId: string) => void;
};

export class GraphRenderer extends BaseComponent {
  private static readonly config = {
    objectWidth: 220,
    objectHeight: 80,
    objectRadius: 40,
    objectCenterX: 110, // половина ширины
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
    textLineHeight: 1.2, // расстояние между строками
  } as const;

  private payload: MemoryGamePayload;
  private readonly svg: SVGElement;
  private soundService = SoundService.getInstance();

  private objectElements = new Map<string, SVGGElement>();
  private linkElements: { path: SVGPathElement; from: string; to: string }[] = [];

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
    this.addGradients();

    this.renderRootLinks();
    this.renderLinks();

    this.renderRoot();
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

  private addGradients(): void {
    const defs = this.svg.querySelector('defs') || document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    if (!defs.parentNode) this.svg.prepend(defs);

    // Градиент для обычного объекта (аналог button-primary)
    const normalGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');

    normalGradient.id = 'objectGradient';
    normalGradient.setAttribute('x1', '0%');
    normalGradient.setAttribute('y1', '0%');
    normalGradient.setAttribute('x2', '0%');
    normalGradient.setAttribute('y2', '100%');

    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#2ea2ff'); // светлый верх

    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#1976d2'); // тёмный низ

    normalGradient.append(stop1, stop2);
    defs.append(normalGradient);

    // Градиент для root (фиолетовый)
    const rootGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    rootGradient.id = 'rootGradient';

    rootGradient.setAttribute('x1', '0%');
    rootGradient.setAttribute('y1', '0%');
    rootGradient.setAttribute('x2', '0%');
    rootGradient.setAttribute('y2', '100%');

    const rootStop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    rootStop1.setAttribute('offset', '0%');
    rootStop1.setAttribute('stop-color', '#a78bfa');

    const rootStop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    rootStop2.setAttribute('offset', '100%');
    rootStop2.setAttribute('stop-color', '#7c3aed');

    rootGradient.append(rootStop1, rootStop2);
    defs.append(rootGradient);

    // Градиент для marked (оранжевый)
    const markedGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    markedGradient.id = 'markedGradient';

    markedGradient.setAttribute('x1', '0%');
    markedGradient.setAttribute('y1', '0%');
    markedGradient.setAttribute('x2', '0%');
    markedGradient.setAttribute('y2', '100%');

    const markedStop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    markedStop1.setAttribute('offset', '0%');
    markedStop1.setAttribute('stop-color', '#fbab73');

    const markedStop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    markedStop2.setAttribute('offset', '100%');
    markedStop2.setAttribute('stop-color', '#f97316');

    markedGradient.append(markedStop1, markedStop2);
    defs.append(markedGradient);
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

    group.addEventListener('click', (event) => {
      event.stopPropagation();

      group.classList.add('shake-animation');
      this.soundService.playSound(SoundKey.error);

      setTimeout(() => {
        group.classList.remove('shake-animation');
      }, 300);
    });

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

      this.linkElements.push({ path, from: link.from, to: link.to });

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

      this.linkElements.push({ path, from: link.from, to: link.to });

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

        group.classList.add('click-animation');
        this.soundService.playSound(SoundKey.mark);
        this.onObjectClick(object.id);

        setTimeout(() => {
          group.classList.remove('click-animation');
        }, 200);
      });

      // Основной прямоугольник (с градиентом)
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', String(object.x));
      rect.setAttribute('y', String(object.y));
      rect.setAttribute('width', String(GraphRenderer.config.objectWidth));
      rect.setAttribute('height', String(GraphRenderer.config.objectHeight));
      rect.setAttribute('rx', String(GraphRenderer.config.objectRadius));
      rect.classList.add('object-rect');

      // Эллипс для блика
      const highlight = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      const dx = 24;
      const dy = 20;
      highlight.setAttribute('cx', String(object.x + dx));
      highlight.setAttribute('cy', String(object.y + dy));
      highlight.setAttribute('rx', '12');
      highlight.setAttribute('ry', '4');
      highlight.setAttribute('transform', `rotate(-25, ${object.x + dx}, ${object.y + dy})`);
      highlight.classList.add('object-highlight');
      highlight.setAttribute('pointer-events', 'none');

      group.append(rect, highlight);

      // Текст
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

    const label = object.label;
    const firstSpaceIndex = label.indexOf(' ');

    if (firstSpaceIndex === -1) {
      // Одна строка по центру
      text.setAttribute('y', String(object.y + GraphRenderer.config.objectCenterY + 8));
      text.textContent = label;
      text.setAttribute('class', 'graph-object__label-single');
    } else {
      // Две строки: первое слово и весь остальной текст (со смещением строк)
      const firstLine = label.slice(0, Math.max(0, firstSpaceIndex));
      const secondLine = label.slice(Math.max(0, firstSpaceIndex + 1));

      const tspan1 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      tspan1.setAttribute('x', String(object.x + GraphRenderer.config.objectCenterX));
      tspan1.setAttribute('dy', String(GraphRenderer.config.textOffsetY) + 'em');
      tspan1.textContent = firstLine;
      tspan1.setAttribute('class', 'graph-object__label-first');

      const tspan2 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      tspan2.setAttribute('x', String(object.x + GraphRenderer.config.objectCenterX));
      tspan2.setAttribute('dy', String(GraphRenderer.config.textLineHeight) + 'em');
      tspan2.setAttribute('class', 'graph-object__label-second');
      tspan2.textContent = secondLine;

      text.append(tspan1);
      text.append(tspan2);
    }

    return text;
  }

  public updateMarkedObjects(markedSet: Set<string>): void {
    for (const [id, element] of this.objectElements) {
      element.classList.toggle('marked', markedSet.has(id));
    }
  }

  public async animateGarbageCollection(): Promise<void> {
    // Удаляем объекты
    const markedElements: { el: SVGGElement; id: string }[] = [];
    this.objectElements.forEach((element, id) => {
      if (element.classList.contains('marked')) {
        markedElements.push({ el: element, id });
      }
    });

    if (markedElements.length === 0) return;

    const animations = markedElements.map(({ el, id }) => {
      return new Promise<void>((resolve) => {
        const onTransitionEnd = () => {
          el.removeEventListener('transitionend', onTransitionEnd);
          el.remove();
          this.objectElements.delete(id);
          resolve();
        };
        el.addEventListener('transitionend', onTransitionEnd, { once: true });
        el.classList.add('collecting');
      });
    });

    markedElements.forEach((element) => this.objectElements.delete(element.id));

    // Удаляем линии, связанные с удалёнными объектами
    const deletedIds = new Set(markedElements.map((item) => item.id));

    this.linkElements = this.linkElements.filter((link) => {
      if (deletedIds.has(link.from) || deletedIds.has(link.to)) {
        link.path.remove();
        return false;
      }
      return true;
    });

    await Promise.all(animations);
  }
}
