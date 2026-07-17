import { chatApiClient } from './apiClient'
import type { ChatRequest, ChatResponse, Conversation, ApiResponse, PaginatedResponse } from '@/types'

export const chatService = {
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const { data } = await chatApiClient.post<ApiResponse<ChatResponse>>('/chat/message', request)
    return data.data
  },

  async *streamMessage(request: ChatRequest): AsyncGenerator<string> {
    const response = await chatApiClient.post('/chat/stream', request, {
      responseType: 'stream',
      adapter: 'fetch',
    })

    const reader = (response.data as ReadableStream<Uint8Array>).getReader()
    const decoder = new TextDecoder()

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '))
        for (const line of lines) {
          const raw = line.replace('data: ', '').trim()
          if (raw === '[DONE]') return
          try {
            const parsed = JSON.parse(raw) as { content?: string }
            if (parsed.content) yield parsed.content
          } catch {
            // ignore malformed SSE lines
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  },

  async getConversations(): Promise<PaginatedResponse<Conversation>> {
    const { data } = await chatApiClient.get<ApiResponse<PaginatedResponse<Conversation>>>('/chat/conversations')
    return data.data
  },

  async getConversation(id: string): Promise<Conversation> {
    const { data } = await chatApiClient.get<ApiResponse<Conversation>>(`/chat/conversations/${id}`)
    return data.data
  },

  async deleteConversation(id: string): Promise<void> {
    await chatApiClient.delete(`/chat/conversations/${id}`)
  },

  async exportConversation(id: string): Promise<Blob> {
    const { data } = await chatApiClient.get(`/chat/conversations/${id}/export`, {
      responseType: 'blob',
    })
    return data as Blob
  },
}
