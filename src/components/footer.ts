import { BaseComponent } from '@/core';

export class Footer extends BaseComponent<'footer'> {
  constructor() {
    super({ tag: 'footer', className: ['app-footer'] });

    const contentContainer = new BaseComponent({
      tag: 'div',
      className: ['footer-content'],
    });

    const year = new Date().getFullYear();
    const text = new BaseComponent({
      tag: 'span',
      text: `© ${year} JustBuildIt Team`,
    });

    contentContainer.append(text);
    this.append(contentContainer);
  }
}
