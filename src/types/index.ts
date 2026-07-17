// ─── Chat ───────────────────────────────────────────────────────────────────

export type MessageRole = 'user' | 'assistant' | 'system'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  isStreaming?: boolean
  tokens?: number
}

export interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
  model?: string
}

export interface ChatRequest {
  message: string
  conversationId?: string
  model?: string
  stream?: boolean
}

export interface ChatResponse {
  id: string
  message: ChatMessage
  conversationId: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

// ─── Voice ──────────────────────────────────────────────────────────────────

export type VoiceStatus = 'idle' | 'recording' | 'processing' | 'playing' | 'error'

export interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

export interface TranscriptionResult {
  id: string
  text: string
  language: string
  confidence: number
  duration: number
  segments?: TranscriptionSegment[]
}

export interface TranscriptionSegment {
  start: number
  end: number
  text: string
  confidence: number
}

export interface SynthesisRequest {
  text: string
  language: string
  voice?: string
  speed?: number
  pitch?: number
}

export interface SynthesisResult {
  id: string
  audioUrl: string
  duration: number
  format: string
}

// ─── Knowledge / RAG ────────────────────────────────────────────────────────

export type DocumentStatus = 'uploading' | 'indexing' | 'indexed' | 'error'

export interface KnowledgeDocument {
  id: string
  name: string
  size: number
  type: string
  status: DocumentStatus
  chunks: number
  uploadedAt: Date
  indexedAt?: Date
  errorMessage?: string
}

export interface RAGQuery {
  query: string
  topK?: number
  threshold?: number
  documentIds?: string[]
}

export interface Citation {
  documentId: string
  documentName: string
  chunk: string
  score: number
  pageNumber?: number
}

export interface RAGResult {
  answer: string
  citations: Citation[]
  confidence: number
  processingTime: number
}

// ─── IVR ────────────────────────────────────────────────────────────────────

export type CallStatus = 'answered' | 'missed' | 'voicemail' | 'transferred' | 'failed'
export type IntegrationStatus = 'connected' | 'disconnected' | 'degraded' | 'unknown'

export interface CallRecord {
  id: string
  caller: string
  callee: string
  duration: number
  status: CallStatus
  timestamp: Date
  intent?: string
  transcript?: string
  recordingUrl?: string
}

export interface IVRMetrics {
  totalCalls: number
  answeredCalls: number
  missedCalls: number
  averageDuration: number
  peakHour: number
  satisfactionScore: number
}

export interface IVRIntegration {
  id: string
  name: string
  type: string
  status: IntegrationStatus
  endpoint: string
  lastChecked: Date
}

// ─── Dashboard ──────────────────────────────────────────────────────────────

export interface MetricCard {
  id: string
  title: string
  value: string | number
  change: number
  changeLabel: string
  icon: string
  trend: 'up' | 'down' | 'neutral'
  color: 'cyan' | 'purple' | 'green' | 'orange'
}

export interface SystemHealth {
  service: string
  status: 'healthy' | 'degraded' | 'down'
  latency: number
  uptime: number
  lastChecked: Date
}

export interface ActivityItem {
  id: string
  type: 'chat' | 'voice' | 'knowledge' | 'ivr' | 'system'
  description: string
  timestamp: Date
  user?: string
  metadata?: Record<string, unknown>
}

// ─── Settings ────────────────────────────────────────────────────────────────

export interface APIEndpoints {
  chatApi: string
  voiceApi: string
  knowledgeApi: string
  ivrApi: string
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system'
  language: string
  notifications: boolean
  soundEnabled: boolean
  streamingEnabled: boolean
  autoSave: boolean
}

export interface OrganizationProfile {
  name: string
  website: string
  industry: string
  country: string
  logoUrl?: string
  contactEmail: string
  planType: 'starter' | 'professional' | 'enterprise'
}

export interface AppSettings {
  apiEndpoints: APIEndpoints
  preferences: UserPreferences
  organization: OrganizationProfile
}

// ─── API Generic ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  timestamp: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface ApiError {
  message: string
  code: string
  status: number
  details?: Record<string, unknown>
}
