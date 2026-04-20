import { App } from './components';
import { waitForAuth } from '@/store/auth-store';

import './styles/main.scss';
import './styles/themes/_dark.scss';

document.addEventListener('DOMContentLoaded', async () => {
  await waitForAuth();
  const app = new App();
  document.body.append(app.element);
  app.start();
});
