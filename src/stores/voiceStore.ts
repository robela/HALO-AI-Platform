import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { VoiceStatus } from '@/types'

const SUPPORTED_LANGUAGES = [
  { code: 'am', name: 'Amharic',  nativeName: 'አማርኛ',     flag: '🇪🇹' },
  { code: 'sw', name: 'Swahili',  nativeName: 'Kiswahili', flag: '🌍' },
  { code: 'ar', name: 'Arabic',   nativeName: 'العربية',   flag: '🌙' },
  { code: 'fr', name: 'French',   nativeName: 'Français',  flag: '🇫🇷' },
  { code: 'en', name: 'English',  nativeName: 'English',   flag: '🇬🇧' },
  { code: 'ha', name: 'Hausa',    nativeName: 'Hausa',     flag: '🌍' },
  { code: 'yo', name: 'Yoruba',   nativeName: 'Yorùbá',    flag: '🇳🇬' },
  { code: 'ig', name: 'Igbo',     nativeName: 'Igbo',      flag: '🇳🇬' },
  { code: 'zo', name: 'Zulu',     nativeName: 'isiZulu',   flag: '🇿🇦' },
  { code: 'af', name: 'Afrikaans',nativeName: 'Afrikaans', flag: '🇿🇦' },
]

interface VoiceState {
  status: VoiceStatus
  selectedLanguage: string
  transcript: string
  responseText: string
  responseAudioUrl: string | null
  isPlaying: boolean
  volume: number
  languages: typeof SUPPORTED_LANGUAGES

  setStatus: (status: VoiceStatus) => void
  setSelectedLanguage: (language: string) => void
  setTranscript: (transcript: string) => void
  setResponseText: (text: string) => void
  setResponseAudioUrl: (url: string | null) => void
  setIsPlaying: (isPlaying: boolean) => void
  setVolume: (volume: number) => void
  reset: () => void
}

export const useVoiceStore = create<VoiceState>()(
  persist(
    (set) => ({
      status: 'idle',
      selectedLanguage: 'en',
      transcript: '',
      responseText: '',
      responseAudioUrl: null,
      isPlaying: false,
      volume: 0.8,
      languages: SUPPORTED_LANGUAGES,

      setStatus: (status) => set({ status }),
      setSelectedLanguage: (language) => set({ selectedLanguage: language }),
      setTranscript: (transcript) => set({ transcript }),
      setResponseText: (responseText) => set({ responseText }),
      setResponseAudioUrl: (responseAudioUrl) => set({ responseAudioUrl }),
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setVolume: (volume) => set({ volume }),
      reset: () =>
        set({
          status: 'idle',
          transcript: '',
          responseText: '',
          responseAudioUrl: null,
          isPlaying: false,
        }),
    }),
    {
      name: 'halo-voice-store',
      partialize: (state) => ({
        selectedLanguage: state.selectedLanguage,
        volume: state.volume,
      }),
    },
  ),
)
