// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number
  name: string
  email: string
  avatar_url: string | null
  created_at: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: AuthUser
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface GoogleAuthRequest {
  credential: string
}

// ─── Contact ─────────────────────────────────────────────────────────────────

export interface ContactSubmit {
  name: string
  email: string
  company?: string
  message: string
}
