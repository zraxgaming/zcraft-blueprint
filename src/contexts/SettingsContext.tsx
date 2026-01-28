import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { settingsService } from '@/services/settingsService';

export interface SettingsMap {
  maintenanceMode: boolean;
  announcementEnabled: boolean;
  announcementMessage: string | null;
  [key: string]: any;
}

const SettingsContext = createContext<{ settings: SettingsMap | null; loading: boolean; refresh: () => Promise<void> } | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsMap | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const rows = await settingsService.getSettings();
      const map: Record<string, string> = {};
      rows.forEach((r: any) => (map[r.key] = r.value));

      setSettings({
        maintenanceMode: map['maintenance_mode'] === 'true',
        announcementEnabled: map['announcement_enabled'] === 'true',
        announcementMessage: map['announcement_message'] || null,
        ...map,
      });
    } catch (err) {
      console.error('Failed to load settings:', err);
      setSettings({ maintenanceMode: false, announcementEnabled: false, announcementMessage: null });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refresh: load }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}

export default SettingsProvider;
