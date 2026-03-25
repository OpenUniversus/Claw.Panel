'use client';

import { AppLayout } from '@/components/layout/layout-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bot,
  Play,
  Square,
  RefreshCw,
  Settings,
  Download,
  Upload,
  FileText,
  Terminal,
  Activity,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Zap,
  Clock,
  Users,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const openclawStatus = {
  running: true,
  version: '2024.3.15',
  uptime: 518400, // 6天
  memoryMB: 512,
  cpuPercent: 2.5,
  edition: 'pro',
  pid: 4096,
  configPath: '/etc/openclaw/config.yaml',
  logPath: '/var/log/openclaw/',
};

const agents = [
  { id: 1, name: '助手-01', model: 'gpt-4', status: 'active', conversations: 1250, lastActive: '5分钟前' },
  { id: 2, name: '客服机器人', model: 'claude-3', status: 'active', conversations: 890, lastActive: '10分钟前' },
  { id: 3, name: '代码助手', model: 'gpt-4-turbo', status: 'idle', conversations: 456, lastActive: '1小时前' },
  { id: 4, name: '文档助手', model: 'gemini-pro', status: 'error', conversations: 78, lastActive: '2小时前' },
];

const plugins = [
  { id: 1, name: '搜索引擎', enabled: true, type: 'builtin', description: '支持Google、Bing等搜索引擎' },
  { id: 2, name: '代码执行', enabled: true, type: 'builtin', description: '安全的Python代码执行环境' },
  { id: 3, name: '文件处理', enabled: true, type: 'builtin', description: '支持PDF、Word、Excel等格式' },
  { id: 4, name: '天气查询', enabled: false, type: 'plugin', description: '获取实时天气信息' },
  { id: 5, name: '数据库连接', enabled: true, type: 'plugin', description: '连接MySQL、PostgreSQL等数据库' },
];

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  return `${days}天 ${hours}小时`;
}

function AgentStatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; text: string }> = {
    active: { color: 'bg-emerald-500', text: '活跃' },
    idle: { color: 'bg-gray-500', text: '空闲' },
    error: { color: 'bg-red-500', text: '错误' },
  };
  return (
    <Badge variant="outline" className="gap-1">
      <span className={cn('h-2 w-2 rounded-full', config[status]?.color || 'bg-gray-500')} />
      {config[status]?.text || status}
    </Badge>
  );
}

export default function OpenClawPage() {
  return (
    <AppLayout title="OpenClaw 管理">
      <div className="space-y-6">
        {/* 服务状态 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">服务状态</p>
                  <p className="text-xl font-semibold flex items-center gap-2">
                    {openclawStatus.running ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        运行中
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-red-500" />
                        已停止
                      </>
                    )}
                  </p>
                </div>
                <Bot className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">版本</p>
                  <p className="text-xl font-semibold font-mono">{openclawStatus.version}</p>
                  <Badge variant="outline" className="mt-1">{openclawStatus.edition}</Badge>
                </div>
                <Zap className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">运行时间</p>
                  <p className="text-xl font-semibold">{formatUptime(openclawStatus.uptime)}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">活跃Agent</p>
                  <p className="text-xl font-semibold">{agents.filter(a => a.status === 'active').length}</p>
                </div>
                <Users className="h-8 w-8 text-violet-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 资源使用 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              资源使用
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-muted-foreground" />
                    <span>CPU</span>
                  </div>
                  <span>{openclawStatus.cpuPercent}%</span>
                </div>
                <Progress value={openclawStatus.cpuPercent} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <MemoryStick className="h-4 w-4 text-muted-foreground" />
                    <span>内存</span>
                  </div>
                  <span>{openclawStatus.memoryMB} MB</span>
                </div>
                <Progress value={(openclawStatus.memoryMB / 2048) * 100} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Network className="h-4 w-4 text-muted-foreground" />
                    <span>连接数</span>
                  </div>
                  <span>128 / 1000</span>
                </div>
                <Progress value={12.8} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 详细设置 */}
        <Tabs defaultValue="agents" className="space-y-4">
          <TabsList>
            <TabsTrigger value="agents" className="gap-2">
              <Bot className="h-4 w-4" />
              Agent管理
            </TabsTrigger>
            <TabsTrigger value="plugins" className="gap-2">
              <Zap className="h-4 w-4" />
              插件管理
            </TabsTrigger>
            <TabsTrigger value="config" className="gap-2">
              <Settings className="h-4 w-4" />
              配置
            </TabsTrigger>
            <TabsTrigger value="logs" className="gap-2">
              <FileText className="h-4 w-4" />
              日志
            </TabsTrigger>
          </TabsList>

          {/* Agent管理 */}
          <TabsContent value="agents">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Agent列表</CardTitle>
                    <CardDescription>管理已创建的智能体</CardDescription>
                  </div>
                  <Button>
                    <Bot className="h-4 w-4 mr-1" />
                    创建Agent
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>名称</TableHead>
                      <TableHead>模型</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>对话数</TableHead>
                      <TableHead>最后活跃</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agents.map((agent) => (
                      <TableRow key={agent.id}>
                        <TableCell className="font-medium">{agent.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{agent.model}</Badge>
                        </TableCell>
                        <TableCell>
                          <AgentStatusBadge status={agent.status} />
                        </TableCell>
                        <TableCell>{agent.conversations}</TableCell>
                        <TableCell className="text-muted-foreground">{agent.lastActive}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Terminal className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 插件管理 */}
          <TabsContent value="plugins">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>插件列表</CardTitle>
                    <CardDescription>管理OpenClaw插件</CardDescription>
                  </div>
                  <Button>
                    <Upload className="h-4 w-4 mr-1" />
                    安装插件
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {plugins.map((plugin) => (
                    <div key={plugin.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          'rounded-lg p-2',
                          plugin.type === 'builtin' ? 'bg-primary/10' : 'bg-amber-500/10'
                        )}>
                          <Zap className={cn(
                            'h-5 w-5',
                            plugin.type === 'builtin' ? 'text-primary' : 'text-amber-500'
                          )} />
                        </div>
                        <div>
                          <p className="font-medium">{plugin.name}</p>
                          <p className="text-sm text-muted-foreground">{plugin.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">
                          {plugin.type === 'builtin' ? '内置' : '第三方'}
                        </Badge>
                        <Switch checked={plugin.enabled} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 配置 */}
          <TabsContent value="config">
            <Card>
              <CardHeader>
                <CardTitle>服务配置</CardTitle>
                <CardDescription>OpenClaw服务设置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">进程ID (PID)</p>
                    <p className="font-mono">{openclawStatus.pid}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">配置文件路径</p>
                    <p className="font-mono text-sm">{openclawStatus.configPath}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">日志目录</p>
                    <p className="font-mono text-sm">{openclawStatus.logPath}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">监听端口</p>
                    <p className="font-mono">8080</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {openclawStatus.running ? (
                    <Button variant="outline">
                      <Square className="h-4 w-4 mr-1" />
                      停止服务
                    </Button>
                  ) : (
                    <Button>
                      <Play className="h-4 w-4 mr-1" />
                      启动服务
                    </Button>
                  )}
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-1" />
                    重启服务
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    导出配置
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 日志 */}
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>服务日志</CardTitle>
                    <CardDescription>最近的OpenClaw运行日志</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    下载日志
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-4 font-mono text-sm space-y-1 max-h-96 overflow-y-auto">
                  <p className="text-muted-foreground">[2024-03-25 20:00:00] INFO: OpenClaw服务启动成功</p>
                  <p className="text-muted-foreground">[2024-03-25 20:00:01] INFO: 加载插件: 搜索引擎</p>
                  <p className="text-muted-foreground">[2024-03-25 20:00:01] INFO: 加载插件: 代码执行</p>
                  <p className="text-muted-foreground">[2024-03-25 20:00:02] INFO: 加载插件: 文件处理</p>
                  <p className="text-muted-foreground">[2024-03-25 20:00:02] INFO: 已连接Ollama服务: http://localhost:11434</p>
                  <p className="text-muted-foreground">[2024-03-25 20:00:03] INFO: 已加载3个模型</p>
                  <p className="text-muted-foreground">[2024-03-25 20:05:00] INFO: Agent [助手-01] 创建对话</p>
                  <p className="text-muted-foreground">[2024-03-25 20:10:00] INFO: Agent [客服机器人] 创建对话</p>
                  <p className="text-amber-500">[2024-03-25 20:15:00] WARN: 模型 gemini-pro 响应时间过长: 5.2s</p>
                  <p className="text-muted-foreground">[2024-03-25 20:20:00] INFO: 定时任务: 清理过期对话</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
