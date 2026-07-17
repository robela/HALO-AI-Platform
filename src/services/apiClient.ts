import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { useSettingsStore } from '@/stores/settingsStore'

function createApiClient(baseURLKey: keyof ReturnType<typeof useSettingsStore.getState>['endpoints']): AxiosInstance {
  const instance = axios.create({
    timeout: 30_000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const { endpoints } = useSettingsStore.getState()
    config.baseURL = endpoints[baseURLKey]

    const token = localStorage.getItem('halo_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: unknown) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          localStorage.removeItem('halo_token')
          window.location.href = '/'
        }
        const message = (error.response?.data as { message?: string })?.message ?? error.message
        return Promise.reject(new Error(message))
      }
      return Promise.reject(error)
    },
  )

  return instance
}

export const chatApiClient     = createApiClient('chatApi')
export const voiceApiClient    = createApiClient('voiceApi')
export const knowledgeApiClient = createApiClient('knowledgeApi')
export const ivrApiClient      = createApiClient('ivrApi')
