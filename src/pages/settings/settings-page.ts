import { BaseComponent, type Page } from '@/core';
import type { UserSettings } from '@/types';

import { language$ } from '@/store/language-store';
import { loadSettings, settings$, updateSettings } from '@/store/settings-store';

import './settings-page.scss';

export class SettingsPage implements Page {
  private container?: BaseComponent;
  private displayNameInput?: BaseComponent<'input'>;
  private firstNameInput?: BaseComponent<'input'>;
  private lastNameInput?: BaseComponent<'input'>;

  // Кнопки для темы
  private themeLightBtn?: BaseComponent<'button'>;
  private themeDarkBtn?: BaseComponent<'button'>;

  // Кнопки для звука
  private soundOnBtn?: BaseComponent<'button'>;
  private soundOffBtn?: BaseComponent<'button'>;

  // Кнопки для языка
  private langRuBtn?: BaseComponent<'button'>;
  private langEnBtn?: BaseComponent<'button'>;

  private saveButton?: BaseComponent<'button'>;
  private statusMessage?: BaseComponent;

  private unsubscribeSettings?: () => void;
  private unsubscribeLanguage?: () => void;

  private currentSettings: UserSettings | null = null;

  render(): BaseComponent {
    this.container = new BaseComponent({ tag: 'div', className: ['settings-page'] });

    const title = new BaseComponent({ tag: 'h1', text: 'Settings', className: ['settings-title'] });
    this.container.append(title);

    const form = new BaseComponent({ tag: 'div', className: ['settings-form'] });

    // --- Профиль ---
    const { container: profileSection, content: profileContent } = this.createSection('Profile');
    const nameWrapper = new BaseComponent({
      tag: 'div',
      className: ['settings-row'],
    });

    const nameLabel = new BaseComponent({
      tag: 'label',
      text: 'Display name:',
      className: ['settings-row-text'],
    });

    this.displayNameInput = new BaseComponent({
      tag: 'input',
      attrs: { type: 'text', placeholder: 'Your name' },
      className: ['settings-input'],
    });

    nameWrapper.append(nameLabel, this.displayNameInput);

    const userWrapper = new BaseComponent({
      tag: 'div',
      className: ['user-line-row'],
    });

    const firstNameWrapper = new BaseComponent({
      tag: 'div',
      className: ['settings-row'],
    });

    const firstNameLabel = new BaseComponent({
      tag: 'label',
      text: 'First name:',
      className: ['settings-row-text'],
    });
    this.firstNameInput = new BaseComponent({
      tag: 'input',
      attrs: { type: 'text' },
      className: ['settings-input'],
    });

    firstNameWrapper.append(firstNameLabel, this.firstNameInput);

    const lastNameWrapper = new BaseComponent({
      tag: 'div',
      className: ['settings-row'],
    });

    const lastNameLabel = new BaseComponent({
      tag: 'label',
      text: 'Last name:',
      className: ['settings-row-text'],
    });
    this.lastNameInput = new BaseComponent({
      tag: 'input',
      attrs: { type: 'text' },
      className: ['settings-input'],
    });

    lastNameWrapper.append(lastNameLabel, this.lastNameInput);

    userWrapper.append(firstNameWrapper, lastNameWrapper);

    profileContent.append(userWrapper, nameWrapper);
    form.append(profileSection);

    const lineWrapper = new BaseComponent({ tag: 'div', className: ['line-row'] });

    // --- Внешний вид (тема + язык) ---
    const { container: appearanceSection, content: appearanceContent } = this.createSection('Appearance');

    // Блок темы
    const themeLabel = new BaseComponent({
      tag: 'span',
      text: 'Theme:',
      className: ['settings-row-text'],
    });
    const themeButtons = this.createThemeButtons();
    const themeWrapper = new BaseComponent({ tag: 'div', className: ['settings-row'] });
    themeWrapper.append(themeLabel, themeButtons);

    // Блок языка
    const languageLabel = new BaseComponent({
      tag: 'span',
      text: 'Language:',
      className: ['settings-row-text'],
    });
    const languageButtons = this.createLanguageButtons();
    const languageWrapper = new BaseComponent({ tag: 'div', className: ['settings-row'] });
    languageWrapper.append(languageLabel, languageButtons);

    appearanceContent.append(themeWrapper, languageWrapper);

    // --- Звук ---
    const { container: soundSection, content: soundContent } = this.createSection('Sound');
    const soundLabel = new BaseComponent({
      tag: 'span',
      text: 'Sound effects:',
      className: ['settings-row-text'],
    });
    const soundButtons = this.createSoundButtons();
    const soundWrapper = new BaseComponent({ tag: 'div', className: ['settings-row'] });
    soundWrapper.append(soundLabel, soundButtons);
    soundContent.append(soundWrapper);

    lineWrapper.append(appearanceSection, soundSection);
    form.append(lineWrapper);

    // Кнопка сохранения
    this.saveButton = new BaseComponent({
      tag: 'button',
      text: 'Save Changes',
      className: ['settings-save-btn'],
    });
    this.saveButton.addEventListener('click', this.handleSave);

    this.statusMessage = new BaseComponent({ tag: 'div', className: ['settings-status'] });

    form.append(this.saveButton, this.statusMessage);
    this.container.append(form);

    // Подписки
    this.unsubscribeSettings = settings$.subscribe((settings) => {
      if (settings) {
        this.currentSettings = settings;
        this.populateForm(settings);
      }
    });
    this.unsubscribeLanguage = language$.subscribe(() => this.updateTexts());

    loadSettings();

    return this.container;
  }

  private createSection(title: string): { container: BaseComponent; content: BaseComponent } {
    const section = new BaseComponent({ tag: 'div', className: ['settings-section'] });
    const heading = new BaseComponent({ tag: 'div', text: title, className: ['settings-section-title'] });
    const content = new BaseComponent({ tag: 'div', className: ['settings-section-content'] });
    section.append(heading, content);
    return { container: section, content };
  }

  private createThemeButtons(): BaseComponent {
    const wrapper = new BaseComponent({ tag: 'div', className: ['settings-button-group'] });
    this.themeLightBtn = new BaseComponent({ tag: 'button', text: 'Light', className: ['settings-option-btn'] });
    this.themeDarkBtn = new BaseComponent({ tag: 'button', text: 'Dark', className: ['settings-option-btn'] });

    this.themeLightBtn.addEventListener('click', () => {
      if (this.currentSettings) this.currentSettings.theme = 'light';
      this.updateThemeButtonsUI();
    });
    this.themeDarkBtn.addEventListener('click', () => {
      if (this.currentSettings) this.currentSettings.theme = 'dark';
      this.updateThemeButtonsUI();
    });

    wrapper.append(this.themeLightBtn, this.themeDarkBtn);
    return wrapper;
  }

  private createSoundButtons(): BaseComponent {
    const wrapper = new BaseComponent({ tag: 'div', className: ['settings-button-group'] });
    this.soundOnBtn = new BaseComponent({ tag: 'button', text: 'On', className: ['settings-option-btn'] });
    this.soundOffBtn = new BaseComponent({ tag: 'button', text: 'Off', className: ['settings-option-btn'] });

    this.soundOnBtn.addEventListener('click', () => {
      if (this.currentSettings) this.currentSettings.soundEnabled = true;
      this.updateSoundButtonsUI();
    });
    this.soundOffBtn.addEventListener('click', () => {
      if (this.currentSettings) this.currentSettings.soundEnabled = false;
      this.updateSoundButtonsUI();
    });

    wrapper.append(this.soundOnBtn, this.soundOffBtn);
    return wrapper;
  }

  private createLanguageButtons(): BaseComponent {
    const wrapper = new BaseComponent({ tag: 'div', className: ['settings-button-group'] });
    this.langRuBtn = new BaseComponent({ tag: 'button', text: 'RU', className: ['settings-option-btn'] });
    this.langEnBtn = new BaseComponent({ tag: 'button', text: 'EN', className: ['settings-option-btn'] });

    this.langRuBtn.addEventListener('click', () => {
      if (this.currentSettings) this.currentSettings.language = 'ru';
      language$.set('ru');
      this.updateLanguageButtonsUI();
    });
    this.langEnBtn.addEventListener('click', () => {
      if (this.currentSettings) this.currentSettings.language = 'en';
      language$.set('en');
      this.updateLanguageButtonsUI();
    });

    wrapper.append(this.langRuBtn, this.langEnBtn);
    return wrapper;
  }

  private populateForm(settings: UserSettings): void {
    if (this.firstNameInput && settings.firstName) {
      this.firstNameInput.element.value = settings.firstName;
    }

    if (this.lastNameInput && settings.lastName) {
      this.lastNameInput.element.value = settings.lastName;
    }

    if (this.displayNameInput) {
      this.displayNameInput.element.value = settings.displayName;
    }

    this.currentSettings = { ...settings };

    this.updateThemeButtonsUI();
    this.updateSoundButtonsUI();
    this.updateLanguageButtonsUI();
  }

  private updateThemeButtonsUI(): void {
    const isDark = this.currentSettings?.theme === 'dark';
    this.themeLightBtn?.element.classList.toggle('active', !isDark);
    this.themeDarkBtn?.element.classList.toggle('active', isDark);
  }

  private updateSoundButtonsUI(): void {
    const isOn = this.currentSettings?.soundEnabled === true;
    this.soundOnBtn?.element.classList.toggle('active', isOn);
    this.soundOffBtn?.element.classList.toggle('active', !isOn);
  }

  private updateLanguageButtonsUI(): void {
    const isRu = this.currentSettings?.language === 'ru';
    console.log('isRU', isRu);
    this.langRuBtn?.element.classList.toggle('active', isRu);
    this.langEnBtn?.element.classList.toggle('active', !isRu);
  }

  private handleSave = async () => {
    if (!this.currentSettings) return;

    if (this.saveButton && this.statusMessage && this.displayNameInput && this.displayNameInput.element.value) {
      const newSettings: UserSettings = {
        displayName: this.displayNameInput.element.value.trim(),
        theme: this.currentSettings.theme,
        soundEnabled: this.currentSettings.soundEnabled,
        language: this.currentSettings.language,
      };

      if (this.firstNameInput && this.firstNameInput.element.value) {
        newSettings.firstName = this.firstNameInput.element.value.trim();
      }

      if (this.lastNameInput && this.lastNameInput.element.value) {
        newSettings.lastName = this.lastNameInput.element.value.trim();
      }

      this.saveButton.element.disabled = true;
      this.saveButton.element.textContent = 'Saving...';

      this.statusMessage.element.textContent = '';
      this.statusMessage.element.classList.remove('error', 'success');

      try {
        await updateSettings(newSettings);

        this.statusMessage.element.textContent = 'Settings saved successfully!';
        this.statusMessage.element.classList.add('success');
        setTimeout(() => {
          if (this.statusMessage) this.statusMessage.element.textContent = '';
        }, 3000);
      } catch {
        this.statusMessage.element.textContent = 'Failed to save settings. Please try again.';
        this.statusMessage.element.classList.add('error');
      } finally {
        this.saveButton.element.disabled = false;
        this.saveButton.element.textContent = 'Save Changes';
      }
    }
  };

  private updateTexts(): void {
    this.updateLanguageButtonsUI();
  }

  onMount(): void {
    console.log('Settings page mounted');
  }

  onDestroy(): void {
    this.unsubscribeSettings?.();
    this.unsubscribeLanguage?.();
    this.container?.remove();
  }
}

export function settingsPage(): Page {
  return new SettingsPage();
}
