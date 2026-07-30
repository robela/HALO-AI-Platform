import axios from 'axios'
import type { AuthResponse, LoginRequest, RegisterRequest, GoogleAuthRequest, ContactSubmit } from '@/types/auth'

const PRODUCTION_FRONTEND_HOST = 'halo-africa-site-397980615504.us-central1.run.app'
const PRODUCTION_BACKEND_URL = 'https://halo-backend-397980615504.us-central1.run.app'
const STAGING_FRONTEND_HOST = 'halo-africa-site-staging-397980615504.us-central1.run.app'
const STAGING_BACKEND_URL = 'https://halo-backend-staging-397980615504.us-central1.run.app'
const DEFAULT_CLOUD_RUN_PROJECT_NUMBER = '397980615504'

function sanitizeConfiguredBaseUrl(configured: string): string {
  const normalized = configured.replace(/\/+$/, '')

  // Handle malformed or shorthand Cloud Run hosts that omit project number.
  const host = normalized.replace(/^https?:\/\//, '')

  const cloudRunHost = host.match(/^(halo-backend(?:-staging)?)(?:-(\d+))?\.us-central1\.run\.app$/)
  if (cloudRunHost) {
    const servicePrefix = cloudRunHost[1]
    const projectNumber = cloudRunHost[2] || DEFAULT_CLOUD_RUN_PROJECT_NUMBER
    return `https://${servicePrefix}-${projectNumber}.us-central1.run.app`
  }

  if (
    host === 'halo-backend.us-central1.run.app' ||
    host === 'halo-backend-.us-central1.run.app'
  ) {
    return PRODUCTION_BACKEND_URL
  }
  if (
    host === 'halo-backend-staging.us-central1.run.app' ||
    host === 'halo-backend-staging-.us-central1.run.app'
  ) {
    return STAGING_BACKEND_URL
  }

  return normalized
}

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

  return sanitizeConfiguredBaseUrl(configured)
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
