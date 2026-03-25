// API 服务层 - 统一管理所有 API 调用

import type {
  ApiResponse,
  DashboardStatus,
  Container,
  DockerImage,
  Website,
  Database,
  CronJob,
  App,
  AIModel,
  OpenClawStatus,
  OllamaStatus,
  AIAgent,
  Channel,
  Skill,
  Plugin,
  LogEntry,
  ChatSession,
  ChatMessage,
} from '@/types';

const API_BASE = '/api';

// 通用请求方法
async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ==================== Dashboard API ====================
export const dashboardApi = {
  getStatus: () => request<DashboardStatus>('/dashboard/status'),
  getResources: () => request<{ cpu: number[]; memory: number[] }>('/dashboard/resources'),
};

// ==================== Container API ====================
export const containerApi = {
  list: () => request<Container[]>('/containers'),
  get: (id: string) => request<Container>(`/containers/${id}`),
  start: (id: string) => request<void>(`/containers/${id}/start`, { method: 'POST' }),
  stop: (id: string) => request<void>(`/containers/${id}/stop`, { method: 'POST' }),
  restart: (id: string) => request<void>(`/containers/${id}/restart`, { method: 'POST' }),
  remove: (id: string) => request<void>(`/containers/${id}`, { method: 'DELETE' }),
  logs: (id: string) => request<string>(`/containers/${id}/logs`),
  
  // Images
  listImages: () => request<DockerImage[]>('/containers/images'),
  pullImage: (name: string) => request<void>('/containers/images/pull', {
    method: 'POST',
    body: JSON.stringify({ name }),
  }),
  removeImage: (id: string) => request<void>(`/containers/images/${id}`, { method: 'DELETE' }),
};

// ==================== Website API ====================
export const websiteApi = {
  list: () => request<Website[]>('/websites'),
  get: (id: string) => request<Website>(`/websites/${id}`),
  create: (data: Partial<Website>) => request<Website>('/websites', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: Partial<Website>) => request<Website>(`/websites/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  remove: (id: string) => request<void>(`/websites/${id}`, { method: 'DELETE' }),
  
  // SSL
  listSsl: () => request<Website[]>('/websites/ssl'),
  renewSsl: (id: string) => request<void>(`/websites/${id}/ssl/renew`, { method: 'POST' }),
};

// ==================== Database API ====================
export const databaseApi = {
  list: () => request<Database[]>('/databases'),
  get: (id: string) => request<Database>(`/databases/${id}`),
  create: (data: Partial<Database>) => request<Database>('/databases', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  start: (id: string) => request<void>(`/databases/${id}/start`, { method: 'POST' }),
  stop: (id: string) => request<void>(`/databases/${id}/stop`, { method: 'POST' }),
  remove: (id: string) => request<void>(`/databases/${id}`, { method: 'DELETE' }),
  
  // Backup
  listBackups: (id: string) => request<{ name: string; size: string; time: string }[]>(`/databases/${id}/backups`),
  createBackup: (id: string) => request<void>(`/databases/${id}/backup`, { method: 'POST' }),
  restoreBackup: (id: string, backupName: string) => request<void>(`/databases/${id}/restore`, {
    method: 'POST',
    body: JSON.stringify({ backupName }),
  }),
};

// ==================== CronJob API ====================
export const cronjobApi = {
  list: () => request<CronJob[]>('/cronjobs'),
  get: (id: string) => request<CronJob>(`/cronjobs/${id}`),
  create: (data: Partial<CronJob>) => request<CronJob>('/cronjobs', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: Partial<CronJob>) => request<CronJob>(`/cronjobs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  toggle: (id: string, enabled: boolean) => request<void>(`/cronjobs/${id}/toggle`, {
    method: 'POST',
    body: JSON.stringify({ enabled }),
  }),
  run: (id: string) => request<void>(`/cronjobs/${id}/run`, { method: 'POST' }),
  remove: (id: string) => request<void>(`/cronjobs/${id}`, { method: 'DELETE' }),
};

// ==================== App Store API ====================
export const appApi = {
  list: () => request<App[]>('/apps'),
  get: (id: string) => request<App>(`/apps/${id}`),
  install: (id: string, config?: Record<string, unknown>) => request<void>(`/apps/${id}/install`, {
    method: 'POST',
    body: JSON.stringify(config || {}),
  }),
  uninstall: (id: string) => request<void>(`/apps/${id}`, { method: 'DELETE' }),
  update: (id: string) => request<void>(`/apps/${id}/update`, { method: 'POST' }),
};

// ==================== AI API ====================
export const aiApi = {
  // Status
  getOpenClawStatus: () => request<OpenClawStatus>('/ai/openclaw/status'),
  getOllamaStatus: () => request<OllamaStatus>('/ai/ollama/status'),
  
  // Models
  listModels: () => request<AIModel[]>('/ai/models'),
  addModel: (data: Partial<AIModel>) => request<AIModel>('/ai/models', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateModel: (id: string, data: Partial<AIModel>) => request<AIModel>(`/ai/models/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  removeModel: (id: string) => request<void>(`/ai/models/${id}`, { method: 'DELETE' }),
  testModel: (id: string) => request<{ healthy: boolean; latencyMs: number }>(`/ai/models/${id}/test`, {
    method: 'POST',
  }),
  
  // Agents
  listAgents: () => request<AIAgent[]>('/ai/agents'),
  getAgent: (id: string) => request<AIAgent>(`/ai/agents/${id}`),
  createAgent: (data: Partial<AIAgent>) => request<AIAgent>('/ai/agents', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateAgent: (id: string, data: Partial<AIAgent>) => request<AIAgent>(`/ai/agents/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  removeAgent: (id: string) => request<void>(`/ai/agents/${id}`, { method: 'DELETE' }),
  
  // Channels
  listChannels: () => request<Channel[]>('/ai/channels'),
  updateChannel: (id: string, data: Partial<Channel>) => request<Channel>(`/ai/channels/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  testChannel: (id: string) => request<{ connected: boolean }>(`/ai/channels/${id}/test`, {
    method: 'POST',
  }),
  
  // Skills
  listSkills: () => request<Skill[]>('/ai/skills'),
  toggleSkill: (id: string, enabled: boolean) => request<void>(`/ai/skills/${id}/toggle`, {
    method: 'POST',
    body: JSON.stringify({ enabled }),
  }),
  
  // Plugins
  listPlugins: () => request<Plugin[]>('/ai/plugins'),
  installPlugin: (id: string) => request<void>(`/ai/plugins/${id}/install`, { method: 'POST' }),
  uninstallPlugin: (id: string) => request<void>(`/ai/plugins/${id}`, { method: 'DELETE' }),
  togglePlugin: (id: string, enabled: boolean) => request<void>(`/ai/plugins/${id}/toggle`, {
    method: 'POST',
    body: JSON.stringify({ enabled }),
  }),
  
  // Chat
  listChatSessions: () => request<ChatSession[]>('/ai/chat/sessions'),
  getChatSession: (id: string) => request<ChatSession>(`/ai/chat/sessions/${id}`),
  createChatSession: () => request<ChatSession>('/ai/chat/sessions', { method: 'POST' }),
  removeChatSession: (id: string) => request<void>(`/ai/chat/sessions/${id}`, { method: 'DELETE' }),
  
  // Chat completion (streaming)
  chat: async (
    messages: ChatMessage[],
    model: string,
    onChunk: (chunk: string) => void
  ): Promise<void> => {
    const response = await fetch(`${API_BASE}/ai/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, model, stream: true }),
    });

    if (!response.ok) throw new Error('Chat request failed');

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      onChunk(chunk);
    }
  },
};

// ==================== Logs API ====================
export const logApi = {
  list: (params?: { level?: string; source?: string; limit?: number }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return request<LogEntry[]>(`/logs${query ? `?${query}` : ''}`);
  },
};

// ==================== System API ====================
export const systemApi = {
  getSettings: () => request<Record<string, unknown>>('/settings'),
  updateSettings: (data: Record<string, unknown>) => request<void>('/settings', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  backup: () => request<{ filename: string }>('/system/backup', { method: 'POST' }),
  restore: (filename: string) => request<void>('/system/restore', {
    method: 'POST',
    body: JSON.stringify({ filename }),
  }),
};

// 导出所有 API
export const api = {
  dashboard: dashboardApi,
  container: containerApi,
  website: websiteApi,
  database: databaseApi,
  cronjob: cronjobApi,
  app: appApi,
  ai: aiApi,
  log: logApi,
  system: systemApi,
};

export default api;
