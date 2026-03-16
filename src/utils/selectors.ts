type Queryable = Document | DocumentFragment | HTMLElement;

/**
 * Type guard для проверки типа элемента
 */
function isElementOfType<T extends Element>(element: Element, type: new () => T): element is T {
  return element instanceof type;
}

/**
 * Безопасный querySelector с проверкой типа элемента
 * @throws {Error} Если элемент не найден или имеет неправильный тип
 */
export function getElementWithType<T extends Element>(
  type: new () => T,
  selector: string,
  parent: Queryable = document
): T {
  const element = parent.querySelector('.' + selector);

  if (!element) {
    throw new Error(`Element not found: "${selector}"`);
  }

  if (!isElementOfType(element, type)) {
    throw new Error(`Element "${selector}" is not ${type.name}. ` + `Found: ${element.constructor.name}`);
  }

  return element;
}
