'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

// 通用 Hook 类型
interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// 通用 API Hook
function useApi<T>(
  fetcher: () => Promise<{ success: boolean; data?: T; error?: string }>,
  deps: unknown[] = []
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result = await fetcher();
      if (result.success && result.data) {
        setState({ data: result.data, loading: false, error: null });
      } else {
        setState({ data: null, loading: false, error: result.error || 'Unknown error' });
      }
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }, [fetcher]);

  useEffect(() => {
    execute();
  }, deps);

  return { ...state, refetch: execute };
}

// Dashboard Hooks
export function useDashboardStatus() {
  return useApi(() => api.dashboard.getStatus());
}

export function useDashboardResources() {
  return useApi(() => api.dashboard.getResources());
}

// Container Hooks
export function useContainers() {
  return useApi(() => api.container.list());
}

export function useContainer(id: string) {
  return useApi(() => api.container.get(id), [id]);
}

export function useContainerImages() {
  return useApi(() => api.container.listImages());
}

// Website Hooks
export function useWebsites() {
  return useApi(() => api.website.list());
}

export function useWebsite(id: string) {
  return useApi(() => api.website.get(id), [id]);
}

// Database Hooks
export function useDatabases() {
  return useApi(() => api.database.list());
}

export function useDatabase(id: string) {
  return useApi(() => api.database.get(id), [id]);
}

// CronJob Hooks
export function useCronJobs() {
  return useApi(() => api.cronjob.list());
}

export function useCronJob(id: string) {
  return useApi(() => api.cronjob.get(id), [id]);
}

// App Hooks
export function useApps() {
  return useApi(() => api.app.list());
}

export function useApp(id: string) {
  return useApi(() => api.app.get(id), [id]);
}

// AI Hooks
export function useOpenClawStatus() {
  return useApi(() => api.ai.getOpenClawStatus());
}

export function useOllamaStatus() {
  return useApi(() => api.ai.getOllamaStatus());
}

export function useAIModels() {
  return useApi(() => api.ai.listModels());
}

export function useAIAgents() {
  return useApi(() => api.ai.listAgents());
}

export function useChannels() {
  return useApi(() => api.ai.listChannels());
}

export function useSkills() {
  return useApi(() => api.ai.listSkills());
}

export function usePlugins() {
  return useApi(() => api.ai.listPlugins());
}

export function useChatSessions() {
  return useApi(() => api.ai.listChatSessions());
}

// Log Hooks
export function useLogs(params?: { level?: string; source?: string; limit?: number }) {
  return useApi(() => api.log.list(params), [params?.level, params?.source, params?.limit]);
}

// System Hooks
export function useSettings() {
  return useApi(() => api.system.getSettings());
}

// Mutation Hooks (用于创建、更新、删除操作)
export function useContainerActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = async (id: string) => {
    setLoading(true);
    setError(null);
    const result = await api.container.start(id);
    setLoading(false);
    if (!result.success) setError(result.error || 'Failed to start container');
    return result.success;
  };

  const stop = async (id: string) => {
    setLoading(true);
    setError(null);
    const result = await api.container.stop(id);
    setLoading(false);
    if (!result.success) setError(result.error || 'Failed to stop container');
    return result.success;
  };

  const restart = async (id: string) => {
    setLoading(true);
    setError(null);
    const result = await api.container.restart(id);
    setLoading(false);
    if (!result.success) setError(result.error || 'Failed to restart container');
    return result.success;
  };

  const remove = async (id: string) => {
    setLoading(true);
    setError(null);
    const result = await api.container.remove(id);
    setLoading(false);
    if (!result.success) setError(result.error || 'Failed to remove container');
    return result.success;
  };

  return { loading, error, start, stop, restart, remove };
}

export function useWebsiteActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: Parameters<typeof api.website.create>[0]) => {
    setLoading(true);
    setError(null);
    const result = await api.website.create(data);
    setLoading(false);
    if (!result.success) setError(result.error || 'Failed to create website');
    return result;
  };

  const update = async (id: string, data: Parameters<typeof api.website.update>[1]) => {
    setLoading(true);
    setError(null);
    const result = await api.website.update(id, data);
    setLoading(false);
    if (!result.success) setError(result.error || 'Failed to update website');
    return result;
  };

  const remove = async (id: string) => {
    setLoading(true);
    setError(null);
    const result = await api.website.remove(id);
    setLoading(false);
    if (!result.success) setError(result.error || 'Failed to remove website');
    return result.success;
  };

  return { loading, error, create, update, remove };
}

export function useDatabaseActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: Parameters<typeof api.database.create>[0]) => {
    setLoading(true);
    setError(null);
    const result = await api.database.create(data);
    setLoading(false);
    if (!result.success) setError(result.error || 'Failed to create database');
    return result;
  };

  const start = async (id: string) => {
    setLoading(true);
    setError(null);
    const result = await api.database.start(id);
    setLoading(false);
    if (!result.success) setError(result.error || 'Failed to start database');
    return result.success;
  };

  const stop = async (id: string) => {
    setLoading(true);
    setError(null);
    const result = await api.database.stop(id);
    setLoading(false);
    if (!result.success) setError(result.error || 'Failed to stop database');
    return result.success;
  };

  const remove = async (id: string) => {
    setLoading(true);
    setError(null);
    const result = await api.database.remove(id);
    setLoading(false);
    if (!result.success) setError(result.error || 'Failed to remove database');
    return result.success;
  };

  return { loading, error, create, start, stop, remove };
}

export function useCronJobActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: Parameters<typeof api.cronjob.create>[0]) => {
    setLoading(true);
    setError(null);
    const result = await api.cronjob.create(data);
    setLoading(false);
    if (!result.success) setError(result.error || 'Failed to create cron job');
    return result;
  };

  const toggle = async (id: string, enabled: boolean) => {
    setLoading(true);
    setError(null);
    const result = await api.cronjob.toggle(id, enabled);
    setLoading(false);
    if (!result.success) setError(result.error || 'Failed to toggle cron job');
    return result.success;
  };

  const run = async (id: string) => {
    setLoading(true);
    setError(null);
    const result = await api.cronjob.run(id);
    setLoading(false);
    if (!result.success) setError(result.error || 'Failed to run cron job');
    return result.success;
  };

  const remove = async (id: string) => {
    setLoading(true);
    setError(null);
    const result = await api.cronjob.remove(id);
    setLoading(false);
    if (!result.success) setError(result.error || 'Failed to remove cron job');
    return result.success;
  };

  return { loading, error, create, toggle, run, remove };
}

export function useAIModelActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const add = async (data: Parameters<typeof api.ai.addModel>[0]) => {
    setLoading(true);
    setError(null);
    const result = await api.ai.addModel(data);
    setLoading(false);
    if (!result.success) setError(result.error || 'Failed to add model');
    return result;
  };

  const test = async (id: string) => {
    setLoading(true);
    setError(null);
    const result = await api.ai.testModel(id);
    setLoading(false);
    if (!result.success) setError(result.error || 'Failed to test model');
    return result;
  };

  const remove = async (id: string) => {
    setLoading(true);
    setError(null);
    const result = await api.ai.removeModel(id);
    setLoading(false);
    if (!result.success) setError(result.error || 'Failed to remove model');
    return result.success;
  };

  return { loading, error, add, test, remove };
}
