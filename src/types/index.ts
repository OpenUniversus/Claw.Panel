// Claw.Panel 类型定义

// 系统状态
export interface SystemStatus {
  hostname: string;
  platform: string;
  platformVersion: string;
  kernelVersion: string;
  kernelArch: string;
  ipV4Addr: string;
  uptime: number;
  timeSinceUptime: string;
}

// 资源使用情况
export interface ResourceUsage {
  cpuPercent: number;
  cpuCores: number;
  cpuModelName: string;
  memoryTotal: number;
  memoryUsed: number;
  memoryUsedPercent: number;
  memoryAvailable: number;
  diskTotal: number;
  diskUsed: number;
  diskUsedPercent: number;
  netBytesSent: number;
  netBytesRecv: number;
}

// 概览数据
export interface DashboardData {
  system: SystemStatus;
  resources: ResourceUsage;
  quickJump: QuickJumpItem[];
  gpuData?: GPUData[];
}

export interface QuickJumpItem {
  name: string;
  title: string;
  detail: string;
  alias?: string;
  path: string;
}

export interface GPUData {
  index: number;
  name: string;
  memoryTotal: number;
  memoryUsed: number;
  memoryFree: number;
  utilization: number;
  temperature: number;
}

// 容器相关
export interface Container {
  id: string;
  name: string;
  image: string;
  status: 'running' | 'exited' | 'paused' | 'restarting';
  state: string;
  ports: string[];
  createdAt: string;
  cpuPercent?: number;
  memoryUsage?: number;
  networkIO?: { rx: number; tx: number };
}

export interface ContainerStats {
  cpuPercent: number;
  memoryUsage: number;
  memoryLimit: number;
  networkRx: number;
  networkTx: number;
  blockRead: number;
  blockWrite: number;
}

export interface DockerImage {
  id: string;
  name: string;
  tag: string;
  size: number;
  createdAt: string;
}

export interface DockerNetwork {
  id: string;
  name: string;
  driver: string;
  scope: string;
  subnet: string;
  gateway: string;
}

export interface DockerVolume {
  name: string;
  driver: string;
  mountpoint: string;
  createdAt: string;
}

// 网站相关
export interface Website {
  id: string;
  name: string;
  domains: string[];
  status: 'running' | 'stopped' | 'error';
  ssl: boolean;
  sslExpiry?: string;
  webServer: 'nginx' | 'apache' | 'caddy';
  createdAt: string;
  appType: string;
}

export interface SSLCertificate {
  id: string;
  domain: string;
  issuer: string;
  startDate: string;
  expiryDate: string;
  autoRenew: boolean;
  status: 'valid' | 'expired' | 'revoked';
}

// 数据库相关
export interface Database {
  id: string;
  name: string;
  type: 'mysql' | 'postgresql' | 'redis' | 'mongodb';
  version: string;
  status: 'running' | 'stopped';
  port: number;
  containerName?: string;
  databases: string[];
  size: number;
  createdAt: string;
}

export interface DatabaseBackup {
  id: string;
  databaseId: string;
  databaseName: string;
  fileName: string;
  size: number;
  createdAt: string;
  status: 'success' | 'failed' | 'running';
}

// 计划任务
export interface CronJob {
  id: string;
  name: string;
  command: string;
  schedule: string;
  status: 'enabled' | 'disabled';
  lastRun?: string;
  nextRun?: string;
  lastStatus?: 'success' | 'failed';
  logs: CronJobLog[];
}

export interface CronJobLog {
  id: string;
  jobId: string;
  startTime: string;
  endTime?: string;
  status: 'running' | 'success' | 'failed';
  output?: string;
  error?: string;
}

// 应用商店
export interface App {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  version: string;
  tags: string[];
  website?: string;
  github?: string;
  dockerImage: string;
  installed: boolean;
  installedVersion?: string;
}

export interface InstalledApp {
  id: string;
  appId: string;
  name: string;
  version: string;
  status: 'running' | 'stopped' | 'installing' | 'error';
  containerId?: string;
  ports: number[];
  volumes: string[];
  environment: Record<string, string>;
  createdAt: string;
}

// 日志相关
export interface LogEntry {
  id: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  source: string;
  message: string;
  detail?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// AI 模块相关
export interface AIModel {
  id: string;
  name: string;
  displayName?: string;
  provider: 'openai' | 'anthropic' | 'google' | 'deepseek' | 'ollama' | 'custom';
  type?: 'chat' | 'image' | 'audio' | 'embedding';
  apiKey?: string;
  baseUrl?: string;
  models: string[];
  defaultModel?: string;
  enabled: boolean;
  healthStatus?: 'healthy' | 'unhealthy' | 'unknown';
  latencyMs?: number;
  contextWindow?: number;
  maxOutput?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface OpenClawStatus {
  installed: boolean;
  version?: string;
  running: boolean;
  pid?: number;
  uptime?: number;
  memoryMB?: number;
  configPath?: string;
  dataPath?: string;
  edition?: 'lite' | 'pro';
}

export interface OllamaStatus {
  installed: boolean;
  running: boolean;
  version?: string;
  models: OllamaModel[];
  baseUrl: string;
}

export interface OllamaModel {
  name: string;
  size: string;
  modifiedAt: string;
  digest: string;
  details?: {
    format: string;
    family: string;
    parameterSize: string;
    quantizationLevel: string;
  };
}

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  model: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  enabled: boolean;
  tools?: string[];
  channels: string[];
  skills: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Channel {
  id: string;
  type: 'qq' | 'wechat' | 'telegram' | 'discord' | 'slack' | 'feishu' | 'dingtalk' | 'wecom';
  name: string;
  enabled: boolean;
  config: Record<string, unknown>;
  status: 'connected' | 'disconnected' | 'error';
  lastActive?: string;
  agentId?: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  enabled: boolean;
  category: string;
  config?: Record<string, unknown>;
}

export interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  enabled: boolean;
  installed: boolean;
  category: string;
  icon?: string;
  configSchema?: Record<string, unknown>;
  config?: Record<string, unknown>;
}

// 工作流相关
export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused';
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  triggers: WorkflowTrigger[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowNode {
  id: string;
  type: 'input' | 'ai_task' | 'condition' | 'action' | 'output' | 'wait' | 'approval';
  name: string;
  config: Record<string, unknown>;
  position: { x: number; y: number };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  condition?: Record<string, unknown>;
}

export interface WorkflowTrigger {
  id: string;
  type: 'schedule' | 'webhook' | 'manual' | 'event';
  config: Record<string, unknown>;
}

// AI 对话相关
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  model?: string;
  tokens?: {
    prompt: number;
    completion: number;
    total: number;
  };
  files?: ChatFile[];
}

export interface ChatFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  model: string;
  createdAt: string;
  updatedAt: string;
}

// 面板设置
export interface PanelSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  serverPort: number;
  entrance: string;
  sessionTimeout: number;
  mfaEnabled: boolean;
  bindAddress: string;
  backupPath: string;
}

// 用户相关
export interface User {
  id: string;
  username: string;
  email?: string;
  role: 'admin' | 'user';
  createdAt: string;
  lastLogin?: string;
}

// API 响应类型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 仪表盘状态
export interface DashboardStatus {
  system: SystemStatus;
  resources: ResourceUsage;
  openclaw: OpenClawStatus;
  ollama: OllamaStatus;
  containers: {
    total: number;
    running: number;
    stopped: number;
  };
  websites: {
    total: number;
    running: number;
    stopped: number;
  };
  databases: {
    total: number;
    running: number;
    stopped: number;
  };
}
