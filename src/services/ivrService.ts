import { ivrApiClient } from './apiClient'
import type { CallRecord, IVRMetrics, IVRIntegration, ApiResponse, PaginatedResponse } from '@/types'

export const ivrService = {
  async getMetrics(): Promise<IVRMetrics> {
    const { data } = await ivrApiClient.get<ApiResponse<IVRMetrics>>('/ivr/metrics')
    return data.data
  },

  async getCallLogs(page = 1, pageSize = 20): Promise<PaginatedResponse<CallRecord>> {
    const { data } = await ivrApiClient.get<ApiResponse<PaginatedResponse<CallRecord>>>(
      '/ivr/calls',
      { params: { page, pageSize } },
    )
    return data.data
  },

  async getCallDetails(id: string): Promise<CallRecord> {
    const { data } = await ivrApiClient.get<ApiResponse<CallRecord>>(`/ivr/calls/${id}`)
    return data.data
  },

  async getIntegrations(): Promise<IVRIntegration[]> {
    const { data } = await ivrApiClient.get<ApiResponse<IVRIntegration[]>>('/ivr/integrations')
    return data.data
  },

  async testIntegration(id: string): Promise<{ success: boolean; latency: number }> {
    const { data } = await ivrApiClient.post<ApiResponse<{ success: boolean; latency: number }>>(
      `/ivr/integrations/${id}/test`,
    )
    return data.data
  },

  async getCallAnalytics(timeRange: '24h' | '7d' | '30d') {
    const { data } = await ivrApiClient.get<ApiResponse<{ time: string; calls: number; answered: number }[]>>(
      '/ivr/analytics',
      { params: { timeRange } },
    )
    return data.data
  },
}
