import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

/**
 * 动态导入配置
 * 用于懒加载大型组件，减少首屏加载时间
 */

// 动态导入工厂函数
export function withDynamicImport<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: {
    loading?: ComponentType;
    ssr?: boolean;
  } = {}
) {
  return dynamic(importFn, {
    ssr: options.ssr ?? true,
  });
}

// 预加载函数
export function preloadComponent(
  importFn: () => Promise<{ default: ComponentType }>
) {
  return () => {
    importFn();
    return null;
  };
}

/**
 * 图片预加载
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * 批量预加载图片
 */
export async function preloadImages(sources: string[]): Promise<void[]> {
  return Promise.all(sources.map(preloadImage));
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function (this: unknown, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * 请求空闲回调的 polyfill
 */
export const requestIdleCallback =
  typeof window !== 'undefined' && 'requestIdleCallback' in window
    ? window.requestIdleCallback
    : (cb: IdleRequestCallback) => setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 50 } as IdleDeadline), 1);

/**
 * 取消空闲回调
 */
export const cancelIdleCallback =
  typeof window !== 'undefined' && 'cancelIdleCallback' in window
    ? window.cancelIdleCallback
    : (id: number) => clearTimeout(id);

/**
 * 检测是否支持 IntersectionObserver
 */
export const supportsIntersectionObserver =
  typeof window !== 'undefined' && 'IntersectionObserver' in window;

/**
 * 检测是否支持 ResizeObserver
 */
export const supportsResizeObserver =
  typeof window !== 'undefined' && 'ResizeObserver' in window;

/**
 * 检测设备性能等级
 */
export function getDevicePerformance(): 'low' | 'medium' | 'high' {
  if (typeof window === 'undefined') return 'medium';
  
  // 检测硬件并发数
  const cores = navigator.hardwareConcurrency || 4;
  
  // 检测设备内存（如果可用）
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  
  if (cores >= 8 && (memory === undefined || memory >= 8)) {
    return 'high';
  } else if (cores >= 4 && (memory === undefined || memory >= 4)) {
    return 'medium';
  } else {
    return 'low';
  }
}

/**
 * 根据性能等级调整配置
 */
export function getPerformanceConfig() {
  const level = getDevicePerformance();
  
  const configs = {
    low: {
      animationDuration: 0,
      enableAnimations: false,
      chartRefreshInterval: 10000,
      maxVisibleItems: 20,
      enableBlur: false,
    },
    medium: {
      animationDuration: 200,
      enableAnimations: true,
      chartRefreshInterval: 5000,
      maxVisibleItems: 50,
      enableBlur: true,
    },
    high: {
      animationDuration: 150,
      enableAnimations: true,
      chartRefreshInterval: 2000,
      maxVisibleItems: 100,
      enableBlur: true,
    },
  };
  
  return configs[level];
}

/**
 * 内存缓存工具
 */
export class MemoryCache<T> {
  private cache = new Map<string, { data: T; expiry: number }>();
  
  constructor(private ttl: number = 5 * 60 * 1000) {} // 默认 5 分钟
  
  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  set(key: string, data: T): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + this.ttl,
    });
  }
  
  delete(key: string): boolean {
    return this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

/**
 * 简单的本地存储缓存
 */
export class LocalStorageCache<T> {
  constructor(private prefix: string = 'cache:') {}
  
  get(key: string): T | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return null;
      
      const { data, expiry } = JSON.parse(item);
      if (Date.now() > expiry) {
        localStorage.removeItem(this.prefix + key);
        return null;
      }
      
      return data;
    } catch {
      return null;
    }
  }
  
  set(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(
        this.prefix + key,
        JSON.stringify({
          data,
          expiry: Date.now() + ttl,
        })
      );
    } catch {
      // 存储空间满了，清理过期缓存
      this.cleanup();
    }
  }
  
  delete(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.prefix + key);
  }
  
  clear(): void {
    if (typeof window === 'undefined') return;
    
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }
  
  private cleanup(): void {
    if (typeof window === 'undefined') return;
    
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(this.prefix)) {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const { expiry } = JSON.parse(item);
            if (Date.now() > expiry) {
              localStorage.removeItem(key);
            }
          }
        } catch {
          localStorage.removeItem(key);
        }
      }
    });
  }
}

// 全局缓存实例
export const apiCache = new MemoryCache<unknown>(30 * 1000); // 30 秒缓存
export const persistentCache = new LocalStorageCache<unknown>('claw_panel:');
