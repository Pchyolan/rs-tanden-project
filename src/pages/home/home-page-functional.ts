export function renderHomePage(): HTMLDivElement {
  const container = document.createElement('div');
  container.className = 'home-page';

  const title = document.createElement('h1');
  title.textContent = 'Hello Brain!';
  container.append(title);

  const button = document.createElement('button');
  button.textContent = 'say Hi';
  button.addEventListener('click', () => alert('Hi there!'));
  container.append(button);

  return container;
}
