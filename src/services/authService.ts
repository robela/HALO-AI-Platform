import axios from 'axios'
import type { AuthResponse, LoginRequest, RegisterRequest, GoogleAuthRequest, ContactSubmit } from '@/types/auth'

const PRODUCTION_FRONTEND_HOST = 'halo-africa-site-397980615504.us-central1.run.app'
const PRODUCTION_BACKEND_URL = 'https://halo-backend-397980615504.us-central1.run.app'
const STAGING_FRONTEND_HOST = 'halo-africa-site-staging-397980615504.us-central1.run.app'
const STAGING_BACKEND_URL = 'https://halo-backend-staging-397980615504.us-central1.run.app'

function resolveBaseUrl(): string {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : ''

  // Hard pin Cloud Run frontend hosts to their backend hosts.
  if (hostname === PRODUCTION_FRONTEND_HOST) {
    return PRODUCTION_BACKEND_URL
  }
  if (hostname === STAGING_FRONTEND_HOST) {
    return STAGING_BACKEND_URL
  }

  const configured = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim()
  if (!configured) return 'http://localhost:8000'

  // Repair malformed Cloud Run hostnames like halo-backend-.us-central1.run.app.
  if (configured.includes('halo-backend-.')) {
    return PRODUCTION_BACKEND_URL
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
