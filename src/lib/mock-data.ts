// 模拟数据生成器
import type {
  DashboardStatus,
  Container,
  DockerImage,
  Website,
  Database,
  CronJob,
  App,
  InstalledApp,
  AIModel,
  OpenClawStatus,
  OllamaStatus,
  OllamaModel,
  AIAgent,
  Channel,
  Skill,
  Plugin,
  ChatSession,
  ChatMessage,
  LogEntry,
} from '@/types';

// 格式化字节大小
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// 格式化运行时间
export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) return `${days}天 ${hours}小时`;
  if (hours > 0) return `${hours}小时 ${minutes}分钟`;
  return `${minutes}分钟`;
}

// 模拟仪表盘状态
export function getMockDashboardStatus(): DashboardStatus {
  return {
    system: {
      hostname: 'clawpanel-server',
      platform: 'Ubuntu',
      platformVersion: '24.04 LTS',
      kernelVersion: '6.8.0-45-generic',
      kernelArch: 'x86_64',
      ipV4Addr: '192.168.1.100',
      uptime: 864000,
      timeSinceUptime: '10天 0小时 0分钟',
    },
    resources: {
      cpuPercent: 23.5,
      cpuCores: 8,
      cpuModelName: 'Intel(R) Core(TM) i7-10700K CPU @ 3.80GHz',
      memoryTotal: 32768,
      memoryUsed: 12288,
      memoryUsedPercent: 37.5,
      memoryAvailable: 20480,
      diskTotal: 500000,
      diskUsed: 180000,
      diskUsedPercent: 36,
      netBytesSent: 1073741824,
      netBytesRecv: 2147483648,
    },
    openclaw: getMockOpenClawStatus(),
    ollama: getMockOllamaStatus(),
    containers: {
      total: 12,
      running: 10,
      stopped: 2,
    },
    websites: {
      total: 5,
      running: 4,
      stopped: 1,
    },
    databases: {
      total: 3,
      running: 3,
      stopped: 0,
    },
  };
}

// 模拟 OpenClaw 状态
export function getMockOpenClawStatus(): OpenClawStatus {
  return {
    installed: true,
    version: '2024.3.15',
    running: true,
    pid: 12345,
    uptime: 518400,
    memoryMB: 512,
    configPath: '/opt/openclaw/config/openclaw.json',
    dataPath: '/opt/openclaw/data',
    edition: 'pro',
  };
}

// 模拟 Ollama 状态
export function getMockOllamaStatus(): OllamaStatus {
  return {
    installed: true,
    running: true,
    version: '0.1.32',
    models: getMockOllamaModels(),
    baseUrl: 'http://localhost:11434',
  };
}

// 模拟 Ollama 模型列表
export function getMockOllamaModels(): OllamaModel[] {
  return [
    {
      name: 'llama3:latest',
      size: '4.7 GB',
      modifiedAt: '2024-03-20T10:30:00Z',
      digest: 'abc123def456',
      details: {
        format: 'gguf',
        family: 'llama',
        parameterSize: '8B',
        quantizationLevel: 'Q4_0',
      },
    },
    {
      name: 'mistral:latest',
      size: '4.1 GB',
      modifiedAt: '2024-03-18T14:20:00Z',
      digest: 'def456ghi789',
      details: {
        format: 'gguf',
        family: 'mistral',
        parameterSize: '7B',
        quantizationLevel: 'Q4_0',
      },
    },
    {
      name: 'codellama:latest',
      size: '4.0 GB',
      modifiedAt: '2024-03-15T09:15:00Z',
      digest: 'ghi789jkl012',
      details: {
        format: 'gguf',
        family: 'llama',
        parameterSize: '7B',
        quantizationLevel: 'Q4_0',
      },
    },
  ];
}

// 模拟容器列表
export function getMockContainers(): Container[] {
  return [
    {
      id: 'abc123def456',
      name: 'nginx-proxy',
      image: 'nginx:latest',
      status: 'running',
      state: 'Up 5 days',
      ports: ['80:80', '443:443'],
      createdAt: '2024-03-15T10:00:00Z',
      cpuPercent: 0.5,
      memoryUsage: 50 * 1024 * 1024,
      networkIO: { rx: 1024 * 1024 * 500, tx: 1024 * 1024 * 200 },
    },
    {
      id: 'def456ghi789',
      name: 'mysql-db',
      image: 'mysql:8.0',
      status: 'running',
      state: 'Up 3 days',
      ports: ['3306:3306'],
      createdAt: '2024-03-17T14:30:00Z',
      cpuPercent: 2.3,
      memoryUsage: 512 * 1024 * 1024,
      networkIO: { rx: 1024 * 1024 * 100, tx: 1024 * 1024 * 50 },
    },
    {
      id: 'ghi789jkl012',
      name: 'redis-cache',
      image: 'redis:alpine',
      status: 'running',
      state: 'Up 2 days',
      ports: ['6379:6379'],
      createdAt: '2024-03-18T09:00:00Z',
      cpuPercent: 0.2,
      memoryUsage: 30 * 1024 * 1024,
      networkIO: { rx: 1024 * 1024 * 300, tx: 1024 * 1024 * 150 },
    },
    {
      id: 'jkl012mno345',
      name: 'openclaw',
      image: 'openclaw/openclaw:latest',
      status: 'running',
      state: 'Up 1 day',
      ports: ['3000:3000', '8080:8080'],
      createdAt: '2024-03-19T16:45:00Z',
      cpuPercent: 5.8,
      memoryUsage: 512 * 1024 * 1024,
      networkIO: { rx: 1024 * 1024 * 1000, tx: 1024 * 1024 * 800 },
    },
    {
      id: 'mno345pqr678',
      name: 'ollama',
      image: 'ollama/ollama:latest',
      status: 'running',
      state: 'Up 1 day',
      ports: ['11434:11434'],
      createdAt: '2024-03-19T17:00:00Z',
      cpuPercent: 15.2,
      memoryUsage: 8 * 1024 * 1024 * 1024,
      networkIO: { rx: 1024 * 1024 * 200, tx: 1024 * 1024 * 100 },
    },
  ];
}

// 模拟网站列表
export function getMockWebsites(): Website[] {
  return [
    {
      id: '1',
      name: 'example.com',
      domains: ['example.com', 'www.example.com'],
      status: 'running',
      ssl: true,
      sslExpiry: '2024-06-15',
      webServer: 'nginx',
      createdAt: '2024-01-15',
      appType: '静态网站',
    },
    {
      id: '2',
      name: 'api.example.com',
      domains: ['api.example.com'],
      status: 'running',
      ssl: true,
      sslExpiry: '2024-07-20',
      webServer: 'nginx',
      createdAt: '2024-02-10',
      appType: 'Node.js',
    },
    {
      id: '3',
      name: 'blog.example.com',
      domains: ['blog.example.com'],
      status: 'running',
      ssl: true,
      sslExpiry: '2024-08-01',
      webServer: 'nginx',
      createdAt: '2024-02-20',
      appType: 'WordPress',
    },
    {
      id: '4',
      name: 'docs.example.com',
      domains: ['docs.example.com'],
      status: 'stopped',
      ssl: false,
      webServer: 'nginx',
      createdAt: '2024-03-01',
      appType: '静态网站',
    },
  ];
}

// 模拟数据库列表
export function getMockDatabases(): Database[] {
  return [
    {
      id: '1',
      name: 'MySQL 主数据库',
      type: 'mysql',
      version: '8.0.36',
      status: 'running',
      port: 3306,
      containerName: 'mysql-db',
      databases: ['production', 'staging', 'development'],
      size: 1024 * 1024 * 1024 * 50,
      createdAt: '2024-01-10',
    },
    {
      id: '2',
      name: 'PostgreSQL 分析库',
      type: 'postgresql',
      version: '16.2',
      status: 'running',
      port: 5432,
      containerName: 'postgres-analytics',
      databases: ['analytics', 'reports'],
      size: 1024 * 1024 * 1024 * 100,
      createdAt: '2024-02-15',
    },
    {
      id: '3',
      name: 'Redis 缓存',
      type: 'redis',
      version: '7.2.4',
      status: 'running',
      port: 6379,
      containerName: 'redis-cache',
      databases: [],
      size: 1024 * 1024 * 512,
      createdAt: '2024-02-20',
    },
  ];
}

// 模拟计划任务
export function getMockCronJobs(): CronJob[] {
  return [
    {
      id: '1',
      name: '数据库自动备份',
      command: '/usr/local/bin/backup.sh',
      schedule: '0 2 * * *',
      status: 'enabled',
      lastRun: '2024-03-20T02:00:00Z',
      nextRun: '2024-03-21T02:00:00Z',
      lastStatus: 'success',
      logs: [],
    },
    {
      id: '2',
      name: '清理日志文件',
      command: 'find /var/log -name "*.log" -mtime +7 -delete',
      schedule: '0 3 * * 0',
      status: 'enabled',
      lastRun: '2024-03-17T03:00:00Z',
      nextRun: '2024-03-24T03:00:00Z',
      lastStatus: 'success',
      logs: [],
    },
    {
      id: '3',
      name: 'SSL 证书续期检查',
      command: '/usr/local/bin/cert-renewal.sh',
      schedule: '0 0 1 * *',
      status: 'enabled',
      lastRun: '2024-03-01T00:00:00Z',
      nextRun: '2024-04-01T00:00:00Z',
      lastStatus: 'success',
      logs: [],
    },
  ];
}

// 模拟应用商店列表
export function getMockApps(): App[] {
  return [
    {
      id: '1',
      name: 'WordPress',
      description: '流行的内容管理系统',
      icon: 'https://s.w.org/style/images/about/WordPress-logotype-wmark.png',
      category: 'CMS',
      version: '6.4.3',
      tags: ['博客', 'CMS', 'PHP'],
      dockerImage: 'wordpress:latest',
      installed: true,
      installedVersion: '6.4.2',
    },
    {
      id: '2',
      name: 'Nextcloud',
      description: '私有云存储和协作平台',
      icon: 'https://nextcloud.com/wp-content/themes/next/assets/img/common/logo.svg',
      category: '存储',
      version: '28.0.2',
      tags: ['云存储', '协作', 'PHP'],
      dockerImage: 'nextcloud:latest',
      installed: false,
    },
    {
      id: '3',
      name: 'GitLab',
      description: '完整的DevOps平台',
      icon: 'https://about.gitlab.com/images/press/logo/svg/gitlab-logo-500.svg',
      category: '开发工具',
      version: '16.9.0',
      tags: ['Git', 'CI/CD', 'DevOps'],
      dockerImage: 'gitlab/gitlab-ce:latest',
      installed: true,
      installedVersion: '16.8.0',
    },
    {
      id: '4',
      name: 'Portainer',
      description: 'Docker可视化管理工具',
      icon: 'https://www.portainer.io/hubfs/portainer-logo-black.svg',
      category: '容器管理',
      version: '2.19.4',
      tags: ['Docker', '容器', '管理'],
      dockerImage: 'portainer/portainer-ce:latest',
      installed: true,
      installedVersion: '2.19.3',
    },
    {
      id: '5',
      name: 'Grafana',
      description: '开源监控和数据可视化平台',
      icon: 'https://grafana.com/static/img/menu/grafana-logo.svg',
      category: '监控',
      version: '10.3.0',
      tags: ['监控', '可视化', '指标'],
      dockerImage: 'grafana/grafana:latest',
      installed: false,
    },
    {
      id: '6',
      name: 'Jenkins',
      description: '开源自动化服务器',
      icon: 'https://www.jenkins.io/images/logo.svg',
      category: 'CI/CD',
      version: '2.442',
      tags: ['CI/CD', '自动化', 'Java'],
      dockerImage: 'jenkins/jenkins:lts',
      installed: false,
    },
  ];
}

// 模拟AI模型列表
export function getMockAIModels(): AIModel[] {
  return [
    {
      id: '1',
      name: 'OpenAI',
      provider: 'openai',
      models: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
      defaultModel: 'gpt-4o',
      enabled: true,
      healthStatus: 'healthy',
      latencyMs: 150,
    },
    {
      id: '2',
      name: 'Anthropic',
      provider: 'anthropic',
      models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
      defaultModel: 'claude-3-opus',
      enabled: true,
      healthStatus: 'healthy',
      latencyMs: 200,
    },
    {
      id: '3',
      name: 'DeepSeek',
      provider: 'deepseek',
      models: ['deepseek-chat', 'deepseek-coder'],
      defaultModel: 'deepseek-chat',
      enabled: true,
      healthStatus: 'healthy',
      latencyMs: 100,
    },
    {
      id: '4',
      name: 'Ollama Local',
      provider: 'ollama',
      baseUrl: 'http://localhost:11434',
      models: ['llama3', 'mistral', 'codellama'],
      defaultModel: 'llama3',
      enabled: true,
      healthStatus: 'healthy',
      latencyMs: 50,
    },
  ];
}

// 模拟AI Agent列表
export function getMockAIAgents(): AIAgent[] {
  return [
    {
      id: '1',
      name: '主智能体',
      description: '默认的主智能体，处理所有通用任务',
      model: 'gpt-4o',
      systemPrompt: '你是一个有帮助的AI助手。',
      temperature: 0.7,
      maxTokens: 4096,
      enabled: true,
      channels: ['qq', 'telegram'],
      skills: ['weather', 'search', 'calculator'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-03-20T10:00:00Z',
    },
    {
      id: '2',
      name: '代码助手',
      description: '专门用于编程任务',
      model: 'claude-3-opus',
      systemPrompt: '你是一个专业的程序员，擅长多种编程语言。',
      temperature: 0.3,
      maxTokens: 8192,
      enabled: true,
      channels: ['discord'],
      skills: ['code-review', 'debug', 'explain'],
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: '2024-03-19T15:00:00Z',
    },
  ];
}

// 模拟通道列表
export function getMockChannels(): Channel[] {
  return [
    {
      id: '1',
      type: 'qq',
      name: 'QQ机器人',
      enabled: true,
      config: { account: '123456789' },
      status: 'connected',
      lastActive: '2024-03-20T10:30:00Z',
      agentId: '1',
    },
    {
      id: '2',
      type: 'telegram',
      name: 'Telegram Bot',
      enabled: true,
      config: { botToken: '***' },
      status: 'connected',
      lastActive: '2024-03-20T10:25:00Z',
      agentId: '1',
    },
    {
      id: '3',
      type: 'discord',
      name: 'Discord Bot',
      enabled: true,
      config: { botToken: '***' },
      status: 'connected',
      lastActive: '2024-03-20T09:15:00Z',
      agentId: '2',
    },
    {
      id: '4',
      type: 'wechat',
      name: '微信机器人',
      enabled: false,
      config: {},
      status: 'disconnected',
    },
  ];
}

// 模拟技能列表
export function getMockSkills(): Skill[] {
  return [
    { id: '1', name: '天气查询', description: '获取实时天气信息', version: '1.0.0', author: 'ClawPanel', enabled: true, category: '工具' },
    { id: '2', name: '网络搜索', description: '搜索互联网信息', version: '1.1.0', author: 'ClawPanel', enabled: true, category: '搜索' },
    { id: '3', name: '代码解释', description: '解释和调试代码', version: '1.2.0', author: 'Community', enabled: true, category: '开发' },
    { id: '4', name: '图片生成', description: 'AI生成图片', version: '2.0.0', author: 'ClawPanel', enabled: false, category: 'AI' },
    { id: '5', name: '文档分析', description: '分析和总结文档', version: '1.0.0', author: 'Community', enabled: true, category: '工具' },
  ];
}

// 模拟插件列表
export function getMockPlugins(): Plugin[] {
  return [
    { id: '1', name: '飞书', description: '飞书机器人通道', version: '1.0.0', author: 'ClawPanel', enabled: true, installed: true, category: '通道' },
    { id: '2', name: '钉钉', description: '钉钉机器人通道', version: '1.0.0', author: 'ClawPanel', enabled: false, installed: true, category: '通道' },
    { id: '3', name: '企业微信', description: '企业微信机器人通道', version: '1.0.0', author: 'ClawPanel', enabled: true, installed: true, category: '通道' },
    { id: '4', name: 'LINE', description: 'LINE消息通道', version: '0.9.0', author: 'Community', enabled: false, installed: false, category: '通道' },
    { id: '5', name: 'Slack', description: 'Slack机器人通道', version: '1.0.0', author: 'ClawPanel', enabled: true, installed: true, category: '通道' },
  ];
}

// 模拟聊天会话
export function getMockChatSessions(): ChatSession[] {
  return [
    {
      id: '1',
      title: '关于Python编程的讨论',
      messages: [
        { id: '1', role: 'user', content: '如何用Python实现快速排序？', timestamp: '2024-03-20T10:00:00Z', model: 'gpt-4o' },
        { id: '2', role: 'assistant', content: '快速排序是一种高效的排序算法，使用分治策略。以下是Python实现：\n\n```python\ndef quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + middle + quicksort(right)\n```', timestamp: '2024-03-20T10:00:05Z', model: 'gpt-4o' },
      ],
      model: 'gpt-4o',
      createdAt: '2024-03-20T10:00:00Z',
      updatedAt: '2024-03-20T10:00:05Z',
    },
  ];
}

// 模拟日志条目
export function getMockLogs(): LogEntry[] {
  // 使用固定的时间戳字符串避免 hydration 不匹配
  return [
    { id: '1', level: 'info', source: 'system', message: '面板启动成功', timestamp: '20:00:00' },
    { id: '2', level: 'info', source: 'container', message: '容器 nginx-proxy 重启完成', timestamp: '20:05:00' },
    { id: '3', level: 'warn', source: 'monitor', message: '容器 mysql-db 内存使用率超过 80%', timestamp: '20:10:00' },
    { id: '4', level: 'info', source: 'ai', message: 'OpenClaw 连接成功', timestamp: '20:15:00' },
    { id: '5', level: 'error', source: 'backup', message: '数据库备份失败：磁盘空间不足', timestamp: '20:20:00' },
    { id: '6', level: 'info', source: 'ssl', message: 'SSL证书 example.com 已自动续期', timestamp: '20:25:00' },
    { id: '7', level: 'info', source: 'cronjob', message: '计划任务 "数据库自动备份" 执行完成', timestamp: '20:30:00' },
    { id: '8', level: 'info', source: 'user', message: '用户 admin 登录成功', timestamp: '20:35:00' },
    { id: '9', level: 'warn', source: 'security', message: '检测到异常登录尝试，IP: 192.168.1.200', timestamp: '20:40:00' },
    { id: '10', level: 'info', source: 'update', message: '面板更新检查：当前已是最新版本', timestamp: '20:45:00' },
  ];
}
