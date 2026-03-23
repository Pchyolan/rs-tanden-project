export function createIcon(pathData: string, className?: string): SVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 5 9');
  if (className) svg.classList.add(className);

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathData);
  svg.append(path);
  return svg;
}

export function createLeftArrow(className?: string): SVGElement {
  return createIcon(
    'M4.581,9.000 L4.997,8.606 L0.836,4.500 L4.997,0.394 L4.581,0.000 L0.003,4.500 L4.581,9.000 Z',
    className
  );
}

export function createRightArrow(className?: string): SVGElement {
  return createIcon(
    'M0.419,9.000 L0.003,8.606 L4.164,4.500 L0.003,0.394 L0.419,0.000 L4.997,4.500 L0.419,9.000 Z',
    className
  );
}

export function createBackArrow(): SVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 512 512');
  svg.setAttribute('width', '20');
  svg.setAttribute('height', '20');
  svg.setAttribute('fill', 'white');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute(
    'd',
    'M511.359,441.635l-26.887-94.483C452.773,235.728,359.04,154.672,246.84,137.733V65.811 c0-13.232-14.711-21.208-25.799-13.996L7.584,190.663c-10.11,6.576-10.114,21.413,0,27.991L221.04,357.501 c11.092,7.215,25.799-0.768,25.799-13.996v-66.273c119.581,16.143,165.725,92.219,235.42,179.399 c4.965,6.211,13.622,8.059,20.688,4.414C510.016,457.403,513.535,449.282,511.359,441.635z'
  );

  svg.append(path);
  return svg;
}

/**
 * Создаёт SVG-круг (точку) заданного размера и цвета
 * @param colorClass - Класс, который задаёт цвет точки
 * @param size - Размер круга в пикселях (по умолчанию 8)
 * @returns SVGElement с кругом
 */
export function createDot(colorClass: string, size: number = 8): SVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);

  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', String(size / 2));
  circle.setAttribute('cy', String(size / 2));
  circle.setAttribute('r', String(size / 2));
  circle.classList.add(colorClass); // вместо setAttribute('fill', color)

  svg.append(circle);
  return svg;
}
