import { voiceApiClient } from './apiClient'
import type { TranscriptionResult, SynthesisRequest, SynthesisResult, ApiResponse } from '@/types'

export const voiceService = {
  async transcribeAudio(audioBlob: Blob, language: string): Promise<TranscriptionResult> {
    const formData = new FormData()
    formData.append('audio', audioBlob, 'recording.webm')
    formData.append('language', language)

    const { data } = await voiceApiClient.post<ApiResponse<TranscriptionResult>>(
      '/voice/transcribe',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
    return data.data
  },

  async transcribeFile(file: File, language: string): Promise<TranscriptionResult> {
    const formData = new FormData()
    formData.append('audio', file)
    formData.append('language', language)

    const { data } = await voiceApiClient.post<ApiResponse<TranscriptionResult>>(
      '/voice/transcribe',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
    return data.data
  },

  async synthesizeSpeech(request: SynthesisRequest): Promise<SynthesisResult> {
    const { data } = await voiceApiClient.post<ApiResponse<SynthesisResult>>('/voice/synthesize', request)
    return data.data
  },

  async getSupportedLanguages() {
    const { data } = await voiceApiClient.get<ApiResponse<{ code: string; name: string; nativeName: string; flag: string }[]>>('/voice/languages')
    return data.data
  },
}
