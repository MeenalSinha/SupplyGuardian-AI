/**
 * SupplyGuardian AI - Frontend API Client
 * Centralized Axios instance with auth token injection and error handling.
 */

import axios, { AxiosError, AxiosInstance } from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - inject JWT
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('sg_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sg_token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ─── Dashboard ───────────────────────────────────────────────────────────────
export const dashboardApi = {
  getKPIs: () => api.get('/dashboard/kpis'),
  getHealthScore: () => api.get('/dashboard/health-score'),
  getRecentActivity: () => api.get('/dashboard/recent-activity'),
}

// ─── Procurement ─────────────────────────────────────────────────────────────
export const procurementApi = {
  listCases: (params?: object) => api.get('/procurement/cases', { params }),
  createCase: (data: object) => api.post('/procurement/cases', data),
  getCase: (id: string) => api.get(`/procurement/cases/${id}`),
  updateStatus: (id: string, status: string) =>
    api.patch(`/procurement/cases/${id}/status`, null, { params: { status } }),
  getPipelineSummary: () => api.get('/procurement/pipeline-summary'),
}

// ─── Suppliers ───────────────────────────────────────────────────────────────
export const suppliersApi = {
  list: (params?: object) => api.get('/suppliers/', { params }),
  create: (data: object) => api.post('/suppliers/', data),
  get: (id: string) => api.get(`/suppliers/${id}`),
  getScore: (id: string) => api.get(`/suppliers/${id}/score`),
  discover: (params: object) => api.post('/suppliers/discover', null, { params }),
}

// ─── Negotiations ────────────────────────────────────────────────────────────
export const negotiationsApi = {
  list: () => api.get('/negotiations/'),
  create: (data: object) => api.post('/negotiations/', data),
  aiCounter: (id: string) => api.post(`/negotiations/${id}/ai-counter`),
  supplierResponse: (id: string, data: object) =>
    api.post(`/negotiations/${id}/supplier-response`, data),
  complete: (id: string) => api.post(`/negotiations/${id}/complete`),
}

// ─── Risk ─────────────────────────────────────────────────────────────────────
export const riskApi = {
  listAlerts: (params?: object) => api.get('/risk/alerts', { params }),
  getSummary: () => api.get('/risk/summary'),
  screenSupplier: (supplierId: string) => api.post(`/risk/screen/${supplierId}`),
  resolveAlert: (id: string) => api.patch(`/risk/alerts/${id}/resolve`),
}

// ─── Contracts ───────────────────────────────────────────────────────────────
export const contractsApi = {
  list: () => api.get('/contracts/'),
  get: (id: string) => api.get(`/contracts/${id}`),
  analyze: (text: string) => api.post('/contracts/analyze', null, { params: { contract_text: text } }),
}

// ─── Approvals ───────────────────────────────────────────────────────────────
export const approvalsApi = {
  list: () => api.get('/approvals/'),
  pendingCount: () => api.get('/approvals/pending-count'),
  decide: (id: string, decision: string, comments?: string) =>
    api.post(`/approvals/${id}/decide`, { decision, comments }),
}

// ─── Agents ──────────────────────────────────────────────────────────────────
export const agentsApi = {
  list: () => api.get('/agents/'),
  run: (agentName: string, context: object) =>
    api.post('/agents/run', { agent_name: agentName, context }),
  runFullWorkflow: (item: string, quantity: number, value: number) =>
    api.post('/agents/workflow/full-procurement', null, {
      params: { item, quantity, estimated_value: value }
    }),
  getExecutiveBriefing: () => api.get('/agents/executive-briefing'),
}

// ─── Supply Chain ─────────────────────────────────────────────────────────────
export const supplyChainApi = {
  listShipments: () => api.get('/supply-chain/shipments'),
  listFactories: () => api.get('/supply-chain/factories'),
  getMapData: () => api.get('/supply-chain/map-data'),
}

// ─── Disruption ──────────────────────────────────────────────────────────────
export const disruptionApi = {
  listEvents: () => api.get('/disruption/events'),
  getRiskScore: () => api.get('/disruption/risk-score'),
  predict: (context?: object) => api.post('/disruption/predict', context),
  simulate: (scenario: string, supplierId?: string) =>
    api.post('/disruption/simulate', null, { params: { scenario, supplier_id: supplierId } }),
}

// ─── Audit ───────────────────────────────────────────────────────────────────
export const auditApi = {
  listLogs: (params?: object) => api.get('/audit/logs', { params }),
  export: () => api.get('/audit/export'),
}

// ─── Analytics ───────────────────────────────────────────────────────────────
export const analyticsApi = {
  getSummary: () => api.get('/analytics/summary'),
  getRoi: () => api.get('/analytics/roi'),
  getSupplierPerformance: () => api.get('/analytics/supplier-performance'),
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: object) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
}

export default api
