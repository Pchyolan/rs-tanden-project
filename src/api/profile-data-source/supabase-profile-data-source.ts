import { SupabaseClient } from '@/core';
import type { UserSettings } from '@/types';

import type { ProfileDataSource } from './types';
import { authService } from '@/services/auth-service';

export class SupabaseProfileDataSource implements ProfileDataSource {
  async getUserSettings(): Promise<UserSettings> {
    const { data: session } = await authService.getSession();
    if (!session?.session?.user) throw new Error('Not authenticated');

    const { data, error } = await SupabaseClient.from('user_settings')
      .select('display_name, first_name, last_name, avatar_url, theme, sound_enabled, language')
      .eq('user_id', session.session.user.id)
      .single();

    if (error && error.code === 'PGRST116') {
      const defaultSettings: UserSettings = {
        displayName: session.session.user.email?.split('@')[0] || 'User',
        theme: 'light',
        soundEnabled: true,
        language: 'en',
      };
      await this.updateUserSettings(defaultSettings);
      return defaultSettings;
    }
    if (error) throw error;

    return {
      displayName: data.display_name,
      firstName: data.first_name,
      lastName: data.last_name,
      avatarUrl: data.avatar_url,
      theme: data.theme,
      soundEnabled: data.sound_enabled,
      language: data.language,
    };
  }

  async updateUserSettings(settings: UserSettings): Promise<void> {
    const { data: session } = await authService.getSession();
    if (!session?.session?.user) throw new Error('Not authenticated');

    const { error } = await SupabaseClient.from('user_settings').upsert(
      {
        user_id: session.session.user.id,
        display_name: settings.displayName,
        first_name: settings.firstName,
        last_name: settings.lastName,
        avatar_url: settings.avatarUrl,
        theme: settings.theme,
        sound_enabled: settings.soundEnabled,
        language: settings.language,
        updated_at: new Date(),
      },
      { onConflict: 'user_id' }
    );

    if (error) throw error;
  }
}
