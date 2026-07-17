import axios from 'axios'
import type { AuthResponse, LoginRequest, RegisterRequest, GoogleAuthRequest, ContactSubmit } from '@/types/auth'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

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
