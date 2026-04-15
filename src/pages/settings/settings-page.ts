import { BaseComponent, type Page } from '@/core';
import type { UserSettings } from '@/types';

import { language$ } from '@/store/language-store';
import { translations } from '@/i18n';

import { settings$, updateSettings } from '@/store/settings-store';

import './settings-page.scss';
import { getElementWithType } from '@/utils/selectors.ts';

export class SettingsPage implements Page {
  private container?: BaseComponent;
  private pageTitleLabel?: BaseComponent<'h1'>;

  // Секции
  private profileSection?: BaseComponent;
  private appearanceSection?: BaseComponent;
  private soundSection?: BaseComponent;

  private displayNameLabel?: BaseComponent<'label'>;
  private displayNameInput?: BaseComponent<'input'>;
  private firstNameLabel?: BaseComponent<'label'>;
  private firstNameInput?: BaseComponent<'input'>;
  private lastNameLabel?: BaseComponent<'label'>;
  private lastNameInput?: BaseComponent<'input'>;

  // Кнопки для темы
  private themeLabel?: BaseComponent<'span'>;
  private themeLightBtn?: BaseComponent<'button'>;
  private themeDarkBtn?: BaseComponent<'button'>;

  // Кнопки для звука
  private soundLabel?: BaseComponent<'span'>;
  private soundOnBtn?: BaseComponent<'button'>;
  private soundOffBtn?: BaseComponent<'button'>;

  // Кнопки для языка
  private languageLabel?: BaseComponent<'span'>;
  private langRuBtn?: BaseComponent<'button'>;
  private langEnBtn?: BaseComponent<'button'>;

  private saveButton?: BaseComponent<'button'>;
  private statusMessage?: BaseComponent;

  private unsubscribeSettings?: () => void;
  private unsubscribeLanguage?: () => void;

  private currentSettings: UserSettings | null = null;

  render(): BaseComponent {
    this.container = new BaseComponent({ tag: 'div', className: ['settings-page'] });

    this.pageTitleLabel = new BaseComponent({
      tag: 'h1',
      text: translations[language$.value].settings_title,
      className: ['settings-title'],
    });
    this.container.append(this.pageTitleLabel);

    const form = new BaseComponent({ tag: 'div', className: ['settings-form'] });

    // --- Профиль ---
    const { container: profileSection, content: profileContent } = this.createSection(
      translations[language$.value].settings_profile
    );
    this.profileSection = profileSection;

    const nameWrapper = new BaseComponent({
      tag: 'div',
      className: ['settings-row'],
    });

    this.displayNameLabel = new BaseComponent({
      tag: 'label',
      text: translations[language$.value].settings_displayName,
      className: ['settings-row-text'],
    });

    this.displayNameInput = new BaseComponent({
      tag: 'input',
      attrs: { type: 'text', placeholder: 'Your name' },
      className: ['settings-input'],
    });

    nameWrapper.append(this.displayNameLabel, this.displayNameInput);

    const userWrapper = new BaseComponent({
      tag: 'div',
      className: ['user-line-row'],
    });

    const firstNameWrapper = new BaseComponent({
      tag: 'div',
      className: ['settings-row'],
    });

    this.firstNameLabel = new BaseComponent({
      tag: 'label',
      text: translations[language$.value].settings_firstName,
      className: ['settings-row-text'],
    });
    this.firstNameInput = new BaseComponent({
      tag: 'input',
      attrs: { type: 'text' },
      className: ['settings-input'],
    });

    firstNameWrapper.append(this.firstNameLabel, this.firstNameInput);

    const lastNameWrapper = new BaseComponent({
      tag: 'div',
      className: ['settings-row'],
    });

    this.lastNameLabel = new BaseComponent({
      tag: 'label',
      text: translations[language$.value].settings_lastName,
      className: ['settings-row-text'],
    });
    this.lastNameInput = new BaseComponent({
      tag: 'input',
      attrs: { type: 'text' },
      className: ['settings-input'],
    });

    lastNameWrapper.append(this.lastNameLabel, this.lastNameInput);

    userWrapper.append(firstNameWrapper, lastNameWrapper);

    profileContent.append(userWrapper, nameWrapper);
    form.append(this.profileSection);

    const lineWrapper = new BaseComponent({ tag: 'div', className: ['line-row'] });

    // --- Внешний вид (тема + язык) ---
    const { container: appearanceSection, content: appearanceContent } = this.createSection(
      translations[language$.value].settings_appearance
    );
    this.appearanceSection = appearanceSection;

    // Блок темы
    this.themeLabel = new BaseComponent({
      tag: 'span',
      text: translations[language$.value].settings_theme,
      className: ['settings-row-text'],
    });
    const themeButtons = this.createThemeButtons();
    const themeWrapper = new BaseComponent({ tag: 'div', className: ['settings-row'] });
    themeWrapper.append(this.themeLabel, themeButtons);

    // Блок языка
    this.languageLabel = new BaseComponent({
      tag: 'span',
      text: translations[language$.value].settings_language,
      className: ['settings-row-text'],
    });
    const languageButtons = this.createLanguageButtons();
    const languageWrapper = new BaseComponent({ tag: 'div', className: ['settings-row'] });
    languageWrapper.append(this.languageLabel, languageButtons);

    appearanceContent.append(themeWrapper, languageWrapper);

    // --- Звук ---
    const { container: soundSection, content: soundContent } = this.createSection(
      translations[language$.value].settings_sound
    );
    this.soundSection = soundSection;

    this.soundLabel = new BaseComponent({
      tag: 'span',
      text: translations[language$.value].settings_soundEffects,
      className: ['settings-row-text'],
    });
    const soundButtons = this.createSoundButtons();
    const soundWrapper = new BaseComponent({ tag: 'div', className: ['settings-row'] });
    soundWrapper.append(this.soundLabel, soundButtons);
    soundContent.append(soundWrapper);

    lineWrapper.append(this.appearanceSection, this.soundSection);
    form.append(lineWrapper);

    // Кнопка сохранения
    this.saveButton = new BaseComponent({
      tag: 'button',
      text: translations[language$.value].settings_save,
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
    this.themeLightBtn = new BaseComponent({
      tag: 'button',
      text: translations[language$.value].settings_light,
      className: ['settings-option-btn'],
    });
    this.themeDarkBtn = new BaseComponent({
      tag: 'button',
      text: translations[language$.value].settings_dark,
      className: ['settings-option-btn'],
    });

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
    this.soundOnBtn = new BaseComponent({
      tag: 'button',
      text: translations[language$.value].settings_on,
      className: ['settings-option-btn'],
    });
    this.soundOffBtn = new BaseComponent({
      tag: 'button',
      text: translations[language$.value].settings_off,
      className: ['settings-option-btn'],
    });

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
      this.saveButton.element.textContent = translations[language$.value].settings_saving;

      this.statusMessage.element.textContent = '';
      this.statusMessage.element.classList.remove('error', 'success');

      try {
        await updateSettings(newSettings);

        this.statusMessage.element.textContent = translations[language$.value].settings_saved;
        this.statusMessage.element.classList.add('success');
        setTimeout(() => {
          if (this.statusMessage) this.statusMessage.element.textContent = '';
        }, 3000);
      } catch {
        this.statusMessage.element.textContent = translations[language$.value].settings_saveError;
        this.statusMessage.element.classList.add('error');
      } finally {
        this.saveButton.element.disabled = false;
        this.saveButton.element.textContent = translations[language$.value].settings_save;
      }
    }
  };

  private updateTexts(): void {
    if (this.pageTitleLabel) {
      this.pageTitleLabel.element.textContent = translations[language$.value].settings_title;
    }

    if (this.profileSection) {
      const profileHeaderText = getElementWithType(
        HTMLDivElement,
        'settings-section-title',
        this.profileSection.element
      );
      profileHeaderText.textContent = translations[language$.value].settings_profile;
    }
    if (this.displayNameLabel) {
      this.displayNameLabel.element.textContent = translations[language$.value].settings_displayName;
    }
    if (this.firstNameLabel) {
      this.firstNameLabel.element.textContent = translations[language$.value].settings_firstName;
    }
    if (this.lastNameLabel) {
      this.lastNameLabel.element.textContent = translations[language$.value].settings_lastName;
    }

    if (this.appearanceSection) {
      const appearanceHeaderText = getElementWithType(
        HTMLDivElement,
        'settings-section-title',
        this.appearanceSection.element
      );
      appearanceHeaderText.textContent = translations[language$.value].settings_appearance;
    }
    if (this.themeLabel) {
      this.themeLabel.element.textContent = translations[language$.value].settings_theme;
    }
    if (this.themeLightBtn) {
      this.themeLightBtn.element.textContent = translations[language$.value].settings_light;
    }
    if (this.themeDarkBtn) {
      this.themeDarkBtn.element.textContent = translations[language$.value].settings_dark;
    }

    if (this.languageLabel) {
      this.languageLabel.element.textContent = translations[language$.value].settings_language;
    }
    this.updateLanguageButtonsUI();

    if (this.soundSection) {
      const soundHeaderText = getElementWithType(HTMLDivElement, 'settings-section-title', this.soundSection.element);
      soundHeaderText.textContent = translations[language$.value].settings_sound;
    }
    if (this.soundLabel) {
      this.soundLabel.element.textContent = translations[language$.value].settings_soundEffects;
    }
    if (this.soundOnBtn) {
      this.soundOnBtn.element.textContent = translations[language$.value].settings_on;
    }
    if (this.soundOffBtn) {
      this.soundOffBtn.element.textContent = translations[language$.value].settings_off;
    }

    if (this.saveButton) {
      this.saveButton.element.textContent = translations[language$.value].settings_save;
    }
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
