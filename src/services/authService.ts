import axios from 'axios'
import type { AuthResponse, LoginRequest, RegisterRequest, GoogleAuthRequest, ContactSubmit } from '@/types/auth'

const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined)?.trim()
const GOOGLE_PROJECT_NUMBER = GOOGLE_CLIENT_ID?.split('-')[0]
const FALLBACK_BACKEND_URL = GOOGLE_PROJECT_NUMBER
  ? `https://halo-backend-${GOOGLE_PROJECT_NUMBER}.us-central1.run.app`
  : 'https://halo-backend-397980615504.us-central1.run.app'

function resolveBaseUrl(): string {
  const configured = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim()
  if (!configured) return 'http://localhost:8000'

  // Repair malformed Cloud Run hostnames like halo-backend-.us-central1.run.app.
  if (configured.includes('halo-backend-.')) {
    if (GOOGLE_PROJECT_NUMBER) {
      return configured
        .replace('halo-backend-.', `halo-backend-${GOOGLE_PROJECT_NUMBER}.`)
        .replace(/\/+$/, '')
    }
    return FALLBACK_BACKEND_URL
  }

  return configured.replace(/\/+$/, '')
}

const BASE_URL = resolveBaseUrl()

export const authApiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
})

authApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('halo_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const authService = {
  async register(payload: RegisterRequest): Promise<AuthResponse> {
    const { data } = await authApiClient.post<AuthResponse>('/auth/register', payload)
    return data
  },

  async login(payload: LoginRequest): Promise<AuthResponse> {
    const { data } = await authApiClient.post<AuthResponse>('/auth/login', payload)
    return data
  },

  async googleLogin(payload: GoogleAuthRequest): Promise<AuthResponse> {
    const { data } = await authApiClient.post<AuthResponse>('/auth/google', payload)
    return data
  },

  async getMe(): Promise<AuthResponse['user']> {
    const { data } = await authApiClient.get<AuthResponse['user']>('/auth/me')
    return data
  },

  async submitContact(payload: ContactSubmit): Promise<{ success: boolean; message: string }> {
    const { data } = await authApiClient.post<{ success: boolean; message: string }>(
      '/contact/submit',
      payload,
    )
    return data
  },
}
