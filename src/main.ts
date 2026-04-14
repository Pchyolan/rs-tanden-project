import { App } from './components';

import './styles/main.scss';
import './styles/dark-theme.scss';

document.addEventListener('DOMContentLoaded', async () => {
  const app = await App.create();
  document.body.append(app.element);
});
