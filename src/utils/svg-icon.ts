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
