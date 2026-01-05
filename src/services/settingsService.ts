import { supabase } from '@/integrations/supabase/client';

export interface AdminSettings {
  id: string;
  key: string;
  value: string;
  updated_at: string | null;
}

export async function getSettings() {
  const { data, error } = await supabase
    .from('admin_settings')
    .select('*');

  if (error) throw error;
  return (data || []) as AdminSettings[];
}

export async function getSetting(key: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('admin_settings')
    .select('value')
    .eq('key', key)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data?.value || null;
}

export async function setSetting(key: string, value: string) {
  // Check if setting exists
  const { data: existing } = await supabase
    .from('admin_settings')
    .select('id')
    .eq('key', key)
    .single();

  if (existing) {
    const { error } = await supabase
      .from('admin_settings')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('key', key);

    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('admin_settings')
      .insert({
        key,
        value,
      });

    if (error) throw error;
  }
}

export async function getDiscordLink(): Promise<string | null> {
  return getSetting('discord_link');
}

export async function setDiscordLink(link: string) {
  await setSetting('discord_link', link);
}

export const settingsService = {
  getSettings,
  getSetting,
  setSetting,
  getDiscordLink,
  setDiscordLink,
};
