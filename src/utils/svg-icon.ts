/**
 * Создаёт базовый SVG-элемент с иконкой по заданному path.
 * Используется как вспомогательная функция для генерации стрелок.
 *
 * @param pathData - Строка с описанием пути (d-атрибут) в формате SVG.
 * @param className - Опциональный CSS-класс для стилизации иконки.
 * @returns SVGElement — корневой SVG-элемент с viewBox="0 0 5 9" и вложенным path.
 */
export function createIcon(pathData: string, className?: string): SVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 5 9');
  if (className) svg.classList.add(className);

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathData);
  svg.append(path);
  return svg;
}

/**
 * Создаёт SVG-иконку стрелки влево.
 *
 * @param className - Опциональный CSS-класс для стилизации.
 * @returns SVGElement — иконка стрелки влево (viewBox="0 0 5 9").
 */
export function createLeftArrow(className?: string): SVGElement {
  return createIcon(
    'M4.581,9.000 L4.997,8.606 L0.836,4.500 L4.997,0.394 L4.581,0.000 L0.003,4.500 L4.581,9.000 Z',
    className
  );
}

/**
 * Создаёт SVG-иконку стрелки вправо.
 *
 * @param className - Опциональный CSS-класс для стилизации.
 * @returns SVGElement — иконка стрелки вправо (viewBox="0 0 5 9").
 */
export function createRightArrow(className?: string): SVGElement {
  return createIcon(
    'M0.419,9.000 L0.003,8.606 L4.164,4.500 L0.003,0.394 L0.419,0.000 L4.997,4.500 L0.419,9.000 Z',
    className
  );
}

/**
 * Создаёт SVG-иконку стрелки назад (Back Arrow)
 * @param className - опциональный CSS-класс для стилизации
 * @returns SVGElement
 */
export function createBackArrow(className?: string): SVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '24');
  svg.setAttribute('fill', 'none');
  if (className) svg.classList.add(className);

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M19 18V14C19 11.7909 17.2091 10 15 10H5M5 10L9 6M5 10L9 14');
  path.setAttribute('stroke', '#FFFFFF');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');

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

/**
 * Создаёт SVG-иконку буфера обмена (Clipboard)
 * @param className - опциональный CSS-класс для стилизации
 * @returns SVGElement
 */
export function createClipboardIcon(className?: string): SVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '24');
  svg.setAttribute('fill', 'none');
  if (className) svg.classList.add(className);

  // Первый путь: внешний контур и "ушки" скрепки
  const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path1.setAttribute(
    'd',
    'M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15'
  );
  path1.setAttribute('stroke', 'currentColor');
  path1.setAttribute('stroke-width', '2');
  path1.setAttribute('stroke-linecap', 'round');
  path1.setAttribute('stroke-linejoin', 'round');

  // Второй путь: горизонтальная черта в середине
  const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path2.setAttribute('d', 'M9 12H15');
  path2.setAttribute('stroke', 'currentColor');
  path2.setAttribute('stroke-width', '2');
  path2.setAttribute('stroke-linecap', 'round');
  path2.setAttribute('stroke-linejoin', 'round');

  // Третий путь: короткая черта ниже
  const path3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path3.setAttribute('d', 'M9 16H12');
  path3.setAttribute('stroke', 'currentColor');
  path3.setAttribute('stroke-width', '2');
  path3.setAttribute('stroke-linecap', 'round');
  path3.setAttribute('stroke-linejoin', 'round');

  // Четвёртый путь: "крышка" скрепки
  const path4 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path4.setAttribute('d', 'M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z');
  path4.setAttribute('stroke', 'currentColor');
  path4.setAttribute('stroke-width', '2');
  path4.setAttribute('stroke-linecap', 'round');
  path4.setAttribute('stroke-linejoin', 'round');

  svg.append(path1, path2, path3, path4);
  return svg;
}

/**
 * Создаёт SVG-иконку замка (Lock)
 * @param className - опциональный CSS-класс для стилизации
 * @returns SVGElement
 */
export function createLockIcon(className?: string): SVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '24');
  svg.setAttribute('fill', 'none');
  if (className) svg.classList.add(className);

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute(
    'd',
    'M16 9V6C16 4.34315 14.6569 3 13 3H11C9.34315 3 8 4.34315 8 6V9M16 9H8M16 9C17.6569 9 19 10.3431 19 12V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V12C5 10.3431 6.34315 9 8 9M12 14V17M13 14C13 14.5523 12.5523 15 12 15C11.4477 15 11 14.5523 11 14C11 13.4477 11.4477 13 12 13C12.5523 13 13 13.4477 13 14Z'
  );
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');

  svg.append(path);
  return svg;
}

/**
 * Создаёт SVG-иконку помощи (Help) — кружок с вопросом и домиком.
 * @param className - опциональный CSS-класс
 * @returns SVGElement
 */
export function createHelpIcon(className?: string): SVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '24');
  svg.setAttribute('fill', 'none');
  if (className) svg.classList.add(className);

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute(
    'd',
    'M10 9C10 8.60444 10.1173 8.21776 10.3371 7.88886C10.5568 7.55996 10.8692 7.30362 11.2346 7.15224C11.6001 7.00087 12.0022 6.96126 12.3902 7.03843C12.7781 7.1156 13.1345 7.30608 13.4142 7.58579C13.6939 7.86549 13.8844 8.22186 13.9616 8.60982C14.0387 8.99778 13.9991 9.39992 13.8478 9.76537C13.6964 10.1308 13.44 10.4432 13.1111 10.6629C12.7822 10.8827 12.3956 11 12 11V12M14.25 19L12.8 20.9333C12.4 21.4667 11.6 21.4667 11.2 20.9333L9.75 19H7C4.79086 19 3 17.2091 3 15V7C3 4.79086 4.79086 3 7 3H17C19.2091 3 21 4.79086 21 7V15C21 17.2091 19.2091 19 17 19H14.25Z'
  );
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');

  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', '12');
  circle.setAttribute('cy', '15');
  circle.setAttribute('r', '1');
  circle.setAttribute('fill', 'currentColor'); // точка внутри залита цветом

  svg.append(path, circle);
  return svg;
}

/**
 * Создаёт SVG-иконку удаления (Delete) — корзина с крестиками.
 * @param className - опциональный CSS-класс
 * @returns SVGElement
 */
export function createDeleteIcon(className?: string): SVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '24');
  svg.setAttribute('fill', 'none');
  if (className) svg.classList.add(className);

  const paths = [
    'M10 11V17',
    'M14 11V17',
    'M4 7H20',
    'M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z',
    'M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z',
  ];

  for (const d of paths) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    svg.append(path);
  }

  return svg;
}

/**
 * Создаёт SVG-иконку обновления (Refresh) — две стрелки, образующие круг.
 * @param className - опциональный CSS-класс
 * @returns SVGElement
 */
export function createRefreshIcon(className?: string): SVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '24');
  svg.setAttribute('fill', 'none');
  if (className) svg.classList.add(className);

  const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path1.setAttribute('d', 'M8 10H20L16 6');
  path1.setAttribute('stroke', 'currentColor');
  path1.setAttribute('stroke-width', '2');
  path1.setAttribute('stroke-linecap', 'round');
  path1.setAttribute('stroke-linejoin', 'round');

  const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path2.setAttribute('d', 'M16 14L4 14L8 18');
  path2.setAttribute('stroke', 'currentColor');
  path2.setAttribute('stroke-width', '2');
  path2.setAttribute('stroke-linecap', 'round');
  path2.setAttribute('stroke-linejoin', 'round');

  svg.append(path1, path2);
  return svg;
}

/**
 * Создаёт SVG-иконку информации (Info) — буква "i" в круге.
 * @param className - опциональный CSS-класс
 * @returns SVGElement
 */
export function createInfoIcon(className?: string): SVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '24');
  svg.setAttribute('fill', 'none');
  if (className) svg.classList.add(className);

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute(
    'd',
    'M12 11V16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z'
  );
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');

  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', '12');
  circle.setAttribute('cy', '7.5');
  circle.setAttribute('r', '1');
  circle.setAttribute('fill', 'currentColor');

  svg.append(path, circle);
  return svg;
}

/**
 * Создаёт SVG-иконку поиска (Search) — лупа.
 * @param className - опциональный CSS-класс
 * @returns SVGElement
 */
export function createSearchIcon(className?: string): SVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '24');
  svg.setAttribute('fill', 'none');
  if (className) svg.classList.add(className);

  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', '10');
  circle.setAttribute('cy', '10');
  circle.setAttribute('r', '6');
  circle.setAttribute('stroke', 'currentColor');
  circle.setAttribute('stroke-width', '2');
  circle.setAttribute('stroke-linecap', 'round');
  circle.setAttribute('stroke-linejoin', 'round');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M14.5 14.5L19 19');
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');

  svg.append(circle, path);
  return svg;
}
