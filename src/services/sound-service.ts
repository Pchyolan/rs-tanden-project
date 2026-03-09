/**
 * Сервис для воспроизведения звуковых эффектов
 * Звуки загружаются из папки /public/sounds/
 *
 * Используется паттерн Синглтон для глобального доступа
 */

export enum SoundKey {
  mark = 'mark',
  error = 'error',
  next = 'next',
  refresh = 'refresh',
}

export class SoundService {
  private static instance: SoundService;
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;

  private constructor() {
    this.preloadSounds();
  }

  static getInstance(): SoundService {
    if (!SoundService.instance) {
      SoundService.instance = new SoundService();
    }
    return SoundService.instance;
  }

  /**
   * Включить/выключить звук
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Загружает все звуки
   */
  private preloadSounds(): void {
    const soundFiles = {
      [SoundKey.mark]: '/sounds/mark.mp3',
      [SoundKey.error]: '/sounds/error.mp3',
      [SoundKey.next]: '/sounds/next.mp3',
      [SoundKey.refresh]: '/sounds/refresh.mp3',
    };
    for (const [key, source] of Object.entries(soundFiles)) {
      const audio = new Audio(source);
      audio.preload = 'auto';
      this.sounds.set(key, audio);
    }
  }

  /**
   * Проигрывает звук
   */
  public playSound(key: string): void {
    if (!this.enabled) return;

    const audio = this.sounds.get(key);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch((error) => console.warn(`Sound play failed: ${error}`));
    }
  }
}
