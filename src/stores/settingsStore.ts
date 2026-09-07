import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppSettings } from '@/types'

const DEFAULT_SETTINGS: AppSettings = {
  apiEndpoints: {
    chatApi: 'https://api.haloafrica.org/v1',
    voiceApi: 'https://voice.haloafrica.org/v1',
    knowledgeApi: 'https://knowledge.haloafrica.org/v1',
    ivrApi: 'https://ivr.haloafrica.org/v1',
  },
  preferences: {
    theme: 'dark',
    language: 'en',
    notifications: true,
    soundEnabled: true,
    streamingEnabled: true,
    autoSave: true,
  },
  organization: {
    name: 'HALO AI Technologies PLC',
    website: 'https://haloafrica.org',
    industry: 'Technology',
    country: 'Ethiopia',
    contactEmail: 'contact@haloafrica.org',
    planType: 'enterprise',
  },
}

interface SettingsState extends AppSettings {
  endpoints: AppSettings['apiEndpoints']
  updateApiEndpoints: (endpoints: Partial<AppSettings['apiEndpoints']>) => void
  updatePreferences: (prefs: Partial<AppSettings['preferences']>) => void
  updateOrganization: (org: Partial<AppSettings['organization']>) => void
  resetToDefaults: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      endpoints: DEFAULT_SETTINGS.apiEndpoints,

      updateApiEndpoints: (endpoints) =>
        set((state) => ({
          apiEndpoints: { ...state.apiEndpoints, ...endpoints },
          endpoints: { ...state.endpoints, ...endpoints },
        })),

      updatePreferences: (prefs) =>
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        })),

      updateOrganization: (org) =>
        set((state) => ({
          organization: { ...state.organization, ...org },
        })),

      resetToDefaults: () =>
        set({
          ...DEFAULT_SETTINGS,
          endpoints: DEFAULT_SETTINGS.apiEndpoints,
        }),
    }),
    {
      name: 'halo-settings-store',
    },
  ),
)
