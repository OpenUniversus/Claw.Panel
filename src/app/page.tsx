'use client';

import { AppLayout } from '@/components/layout/layout-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Container,
  Globe,
  Database,
  Brain,
  Bot,
  Activity,
  TrendingUp,
  Clock,
  Server,
  Zap,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  getMockDashboardStatus,
  formatBytes,
  formatUptime,
  getMockContainers,
  getMockWebsites,
  getMockDatabases,
  getMockLogs,
} from '@/lib/mock-data';
import { cn } from '@/lib/utils';

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}) {
  return (
    <Card className={cn('transition-all hover:shadow-md', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={cn(
            'rounded-full p-3',
            trend === 'up' && 'bg-emerald-500/10 text-emerald-500',
            trend === 'down' && 'bg-red-500/10 text-red-500',
            (!trend || trend === 'neutral') && 'bg-primary/10 text-primary'
          )}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ResourceBar({
  label,
  used,
  total,
  percent,
  icon: Icon,
}: {
  label: string;
  used: string;
  total: string;
  percent: number;
  icon: React.ElementType;
}) {
  const getBarStyle = (p: number) => {
    if (p > 90) return { backgroundColor: 'hsl(var(--destructive))' };
    if (p > 70) return { backgroundColor: 'hsl(37.7 91.2% 50.1%)' };
    return { backgroundColor: 'hsl(142.1 76.2% 36.3%)' };
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{label}</span>
        </div>
        <span className="text-muted-foreground">
          {used} / {total}
        </span>
      </div>
      <Progress value={percent} className="h-2" style={{ '--indicator-bg': getBarStyle(percent).backgroundColor } as React.CSSProperties} />
    </div>
  );
}

function QuickAction({
  title,
  description,
  icon: Icon,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  onClick?: () => void;
}) {
  return (
    <Button
      variant="outline"
      className="h-auto flex-col items-start gap-1 p-4 text-left"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        <span className="font-medium">{title}</span>
      </div>
      <span className="text-xs text-muted-foreground">{description}</span>
    </Button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = (s: string) => {
    switch (s) {
      case 'running':
      case 'connected':
      case 'healthy':
        return { color: 'bg-emerald-500', text: '运行中', icon: CheckCircle2 };
      case 'stopped':
      case 'disconnected':
        return { color: 'bg-gray-500', text: '已停止', icon: XCircle };
      case 'error':
        return { color: 'bg-red-500', text: '错误', icon: AlertTriangle };
      default:
        return { color: 'bg-amber-500', text: s, icon: Activity };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge variant="outline" className="gap-1">
      <span className={cn('h-2 w-2 rounded-full', config.color)} />
      <Icon className="h-3 w-3" />
      {config.text}
    </Badge>
  );
}

function LogItem({ log }: { log: { level: string; source: string; message: string; timestamp: string } }) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-red-500 bg-red-500/10';
      case 'warn':
        return 'text-amber-500 bg-amber-500/10';
      case 'info':
        return 'text-blue-500 bg-blue-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const time = new Date(log.timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="flex items-start gap-3 py-2">
      <span className="text-xs text-muted-foreground w-20 flex-shrink-0">{time}</span>
      <Badge variant="outline" className={cn('text-xs', getLevelColor(log.level))}>
        {log.level.toUpperCase()}
      </Badge>
      <Badge variant="secondary" className="text-xs">
        {log.source}
      </Badge>
      <span className="text-sm flex-1 truncate">{log.message}</span>
    </div>
  );
}

export default function HomePage() {
  const status = getMockDashboardStatus();
  const containers = getMockContainers();
  const websites = getMockWebsites();
  const databases = getMockDatabases();
  const logs = getMockLogs().slice(0, 8);

  return (
    <AppLayout title="概览">
      <div className="space-y-6">
        {/* 系统状态卡片 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="CPU 使用率"
            value={`${status.resources.cpuPercent}%`}
            subtitle={`${status.resources.cpuCores} 核心`}
            icon={Cpu}
            trend="neutral"
          />
          <StatCard
            title="内存使用"
            value={`${status.resources.memoryUsedPercent}%`}
            subtitle={`${formatBytes(status.resources.memoryUsed * 1024 * 1024)} / ${formatBytes(status.resources.memoryTotal * 1024 * 1024)}`}
            icon={MemoryStick}
            trend={status.resources.memoryUsedPercent > 80 ? 'down' : 'neutral'}
          />
          <StatCard
            title="磁盘使用"
            value={`${status.resources.diskUsedPercent}%`}
            subtitle={`${formatBytes(status.resources.diskUsed * 1024 * 1024)} / ${formatBytes(status.resources.diskTotal * 1024 * 1024)}`}
            icon={HardDrive}
            trend="neutral"
          />
          <StatCard
            title="运行时间"
            value={formatUptime(status.system.uptime)}
            subtitle={`系统版本 ${status.system.platformVersion}`}
            icon={Clock}
            trend="up"
          />
        </div>

        {/* AI 服务状态 */}
        <Card className="border-violet-200/50 dark:border-violet-800/50 bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-violet-500" />
              AI 服务状态
            </CardTitle>
            <CardDescription>OpenClaw 与 Ollama 服务状态监控</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {/* OpenClaw 状态 */}
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    <span className="font-semibold">OpenClaw</span>
                  </div>
                  <StatusBadge status={status.openclaw.running ? 'running' : 'stopped'} />
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>版本</span>
                    <span>{status.openclaw.version || '未安装'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>运行时间</span>
                    <span>{status.openclaw.uptime ? formatUptime(status.openclaw.uptime) : '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>内存占用</span>
                    <span>{status.openclaw.memoryMB ? `${status.openclaw.memoryMB} MB` : '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>版本类型</span>
                    <Badge variant="outline">{status.openclaw.edition || 'N/A'}</Badge>
                  </div>
                </div>
              </div>

              {/* Ollama 状态 */}
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-500" />
                    <span className="font-semibold">Ollama</span>
                  </div>
                  <StatusBadge status={status.ollama.running ? 'running' : 'stopped'} />
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>版本</span>
                    <span>{status.ollama.version || '未安装'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>已加载模型</span>
                    <span>{status.ollama.models.length} 个</span>
                  </div>
                  <div className="flex justify-between">
                    <span>服务地址</span>
                    <span className="font-mono text-xs">{status.ollama.baseUrl}</span>
                  </div>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {status.ollama.models.slice(0, 3).map((model) => (
                      <Badge key={model.name} variant="secondary" className="text-xs">
                        {model.name.split(':')[0]}
                      </Badge>
                    ))}
                    {status.ollama.models.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{status.ollama.models.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 资源使用详情 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              资源使用详情
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ResourceBar
              label="CPU"
              used={`${status.resources.cpuPercent}%`}
              total="100%"
              percent={status.resources.cpuPercent}
              icon={Cpu}
            />
            <ResourceBar
              label="内存"
              used={formatBytes(status.resources.memoryUsed * 1024 * 1024)}
              total={formatBytes(status.resources.memoryTotal * 1024 * 1024)}
              percent={status.resources.memoryUsedPercent}
              icon={MemoryStick}
            />
            <ResourceBar
              label="磁盘"
              used={formatBytes(status.resources.diskUsed * 1024 * 1024)}
              total={formatBytes(status.resources.diskTotal * 1024 * 1024)}
              percent={status.resources.diskUsedPercent}
              icon={HardDrive}
            />
          </CardContent>
        </Card>

        {/* 服务概览和日志 */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* 服务概览 */}
          <Card>
            <CardHeader>
              <CardTitle>服务概览</CardTitle>
              <CardDescription>容器、网站、数据库运行状态</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 容器 */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Container className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">容器</p>
                      <p className="text-sm text-muted-foreground">
                        {status.containers.running} 运行中 / {status.containers.total} 总计
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {containers.slice(0, 3).map((c) => (
                      <div
                        key={c.id}
                        className={cn(
                          'h-2 w-2 rounded-full',
                          c.status === 'running' ? 'bg-emerald-500' : 'bg-gray-400'
                        )}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                {/* 网站 */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium">网站</p>
                      <p className="text-sm text-muted-foreground">
                        {status.websites.running} 运行中 / {status.websites.total} 总计
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {websites.slice(0, 3).map((w) => (
                      <div
                        key={w.id}
                        className={cn(
                          'h-2 w-2 rounded-full',
                          w.status === 'running' ? 'bg-emerald-500' : 'bg-gray-400'
                        )}
                        title={w.name}
                      />
                    ))}
                  </div>
                </div>

                {/* 数据库 */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="font-medium">数据库</p>
                      <p className="text-sm text-muted-foreground">
                        {status.databases.running} 运行中 / {status.databases.total} 总计
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {databases.map((d) => (
                      <div
                        key={d.id}
                        className={cn(
                          'h-2 w-2 rounded-full',
                          d.status === 'running' ? 'bg-emerald-500' : 'bg-gray-400'
                        )}
                        title={d.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 系统日志 */}
          <Card>
            <CardHeader>
              <CardTitle>系统日志</CardTitle>
              <CardDescription>最近的系统事件</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {logs.map((log) => (
                  <LogItem key={log.id} log={log} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 系统信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              系统信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">主机名</p>
                <p className="font-medium">{status.system.hostname}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">操作系统</p>
                <p className="font-medium">{status.system.platform} {status.system.platformVersion}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">内核版本</p>
                <p className="font-medium">{status.system.kernelVersion}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">系统架构</p>
                <p className="font-medium">{status.system.kernelArch}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">IP 地址</p>
                <p className="font-medium font-mono">{status.system.ipV4Addr}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CPU 型号</p>
                <p className="font-medium text-sm">{status.resources.cpuModelName}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
