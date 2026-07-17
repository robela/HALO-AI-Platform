import { knowledgeApiClient } from './apiClient'
import type { KnowledgeDocument, RAGQuery, RAGResult, ApiResponse, PaginatedResponse } from '@/types'

export const knowledgeService = {
  async uploadDocument(file: File): Promise<KnowledgeDocument> {
    const formData = new FormData()
    formData.append('document', file)

    const { data } = await knowledgeApiClient.post<ApiResponse<KnowledgeDocument>>(
      '/knowledge/documents',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
    return data.data
  },

  async getDocuments(): Promise<PaginatedResponse<KnowledgeDocument>> {
    const { data } = await knowledgeApiClient.get<ApiResponse<PaginatedResponse<KnowledgeDocument>>>('/knowledge/documents')
    return data.data
  },

  async deleteDocument(id: string): Promise<void> {
    await knowledgeApiClient.delete(`/knowledge/documents/${id}`)
  },

  async query(request: RAGQuery): Promise<RAGResult> {
    const { data } = await knowledgeApiClient.post<ApiResponse<RAGResult>>('/knowledge/query', request)
    return data.data
  },

  async reindexDocument(id: string): Promise<void> {
    await knowledgeApiClient.post(`/knowledge/documents/${id}/reindex`)
  },
}
