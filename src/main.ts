import { App } from './components';

import './styles/main.scss';
import './styles/themes/_dark.scss';

document.addEventListener('DOMContentLoaded', async () => {
  const app = await App.create();
  document.body.append(app.element);
});
