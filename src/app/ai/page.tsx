'use client';

import { AppLayout } from '@/components/layout/layout-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Brain,
  Bot,
  Cpu,
  MessageSquare,
  Radio,
  Zap,
  Workflow,
  Play,
  Square,
  RefreshCw,
  Settings,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Server,
  Activity,
  TrendingUp,
  Clock,
} from 'lucide-react';
import {
  getMockOpenClawStatus,
  getMockOllamaStatus,
  getMockAIModels,
  getMockAIAgents,
  getMockChannels,
  formatBytes,
  formatUptime,
} from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import Link from 'next/link';

function ServiceCard({
  title,
  description,
  icon: Icon,
  status,
  version,
  uptime,
  memory,
  actions,
  details,
  href,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  status: 'running' | 'stopped' | 'error';
  version?: string;
  uptime?: number;
  memory?: number;
  actions?: React.ReactNode;
  details?: { label: string; value: string | React.ReactNode }[];
  href?: string;
}) {
  const statusConfig = {
    running: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: '运行中', icon: CheckCircle2 },
    stopped: { color: 'text-gray-500', bg: 'bg-gray-500/10', label: '已停止', icon: XCircle },
    error: { color: 'text-red-500', bg: 'bg-red-500/10', label: '错误', icon: AlertTriangle },
  };

  const StatusIcon = statusConfig[status].icon;

  const content = (
    <Card className="transition-all hover:shadow-md group">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('rounded-lg p-2', statusConfig[status].bg)}>
              <Icon className={cn('h-5 w-5', statusConfig[status].color)} />
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          <Badge variant={status === 'running' ? 'default' : 'secondary'} className="gap-1">
            <StatusIcon className="h-3 w-3" />
            {statusConfig[status].label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {(version || uptime || memory) && (
          <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
            {version && (
              <div>
                <p className="text-muted-foreground">版本</p>
                <p className="font-medium font-mono">{version}</p>
              </div>
            )}
            {uptime && (
              <div>
                <p className="text-muted-foreground">运行时间</p>
                <p className="font-medium">{formatUptime(uptime)}</p>
              </div>
            )}
            {memory && (
              <div>
                <p className="text-muted-foreground">内存占用</p>
                <p className="font-medium">{memory} MB</p>
              </div>
            )}
          </div>
        )}
        {details && details.length > 0 && (
          <div className="space-y-2 mb-4">
            {details.map((detail, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{detail.label}</span>
                <span className="font-medium">{detail.value}</span>
              </div>
            ))}
          </div>
        )}
        {actions && (
          <div className="flex gap-2 mt-4">
            {actions}
          </div>
        )}
        {href && (
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" size="sm" className="w-full group-hover:bg-primary/5" asChild>
              <Link href={href}>
                查看详情
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return content;
}

function QuickStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'text-primary',
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color?: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={cn('rounded-lg p-3 bg-primary/10', color)}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ModelProviderCard({
  name,
  provider,
  models,
  defaultModel,
  status,
  latencyMs,
}: {
  name: string;
  provider: string;
  models: string[];
  defaultModel?: string;
  status: string;
  latencyMs?: number;
}) {
  const statusConfig: Record<string, { color: string; label: string }> = {
    healthy: { color: 'bg-emerald-500', label: '健康' },
    unhealthy: { color: 'bg-red-500', label: '异常' },
    unknown: { color: 'bg-gray-500', label: '未知' },
  };

  return (
    <Card className="transition-all hover:shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={cn(
              'h-2 w-2 rounded-full',
              statusConfig[status]?.color || 'bg-gray-500'
            )} />
            <span className="font-medium">{name}</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {provider}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-1 mb-2">
          {models.slice(0, 3).map((model) => (
            <Badge
              key={model}
              variant={model === defaultModel ? 'default' : 'secondary'}
              className="text-xs"
            >
              {model.split('/').pop()}
            </Badge>
          ))}
          {models.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{models.length - 3}
            </Badge>
          )}
        </div>
        {latencyMs !== undefined && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Activity className="h-3 w-3" />
            延迟: {latencyMs}ms
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AIPage() {
  const openclaw = getMockOpenClawStatus();
  const ollama = getMockOllamaStatus();
  const models = getMockAIModels();
  const agents = getMockAIAgents();
  const channels = getMockChannels();

  const activeChannels = channels.filter((c) => c.enabled && c.status === 'connected').length;

  return (
    <AppLayout title="AI 概览">
      <div className="space-y-6">
        {/* 快速统计 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <QuickStatCard
            title="模型提供商"
            value={models.filter((m) => m.enabled).length}
            subtitle={`${models.length} 个已配置`}
            icon={Cpu}
            color="text-violet-500"
          />
          <QuickStatCard
            title="活跃 Agent"
            value={agents.filter((a) => a.enabled).length}
            subtitle={`${agents.length} 个已创建`}
            icon={Bot}
            color="text-blue-500"
          />
          <QuickStatCard
            title="已连接通道"
            value={activeChannels}
            subtitle={`${channels.length} 个已配置`}
            icon={Radio}
            color="text-emerald-500"
          />
          <QuickStatCard
            title="本地模型"
            value={ollama.models.length}
            subtitle="Ollama 模型"
            icon={Brain}
            color="text-amber-500"
          />
        </div>

        {/* 核心服务 */}
        <div className="grid gap-4 lg:grid-cols-2">
          <ServiceCard
            title="OpenClaw"
            description="AI 智能体运行环境"
            icon={Bot}
            status={openclaw.running ? 'running' : 'stopped'}
            version={openclaw.version}
            uptime={openclaw.uptime}
            memory={openclaw.memoryMB}
            details={[
              { label: '版本类型', value: openclaw.edition || 'N/A' },
              { label: '进程 PID', value: openclaw.pid?.toString() || '-' },
              { label: '配置路径', value: openclaw.configPath || '-' },
            ]}
            actions={
              <>
                {openclaw.running ? (
                  <Button variant="outline" size="sm">
                    <Square className="h-4 w-4 mr-1" />
                    停止
                  </Button>
                ) : (
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4 mr-1" />
                    启动
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  重启
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-1" />
                  配置
                </Button>
              </>
            }
            href="/ai/openclaw"
          />

          <ServiceCard
            title="Ollama"
            description="本地大语言模型服务"
            icon={Brain}
            status={ollama.running ? 'running' : 'stopped'}
            version={ollama.version}
            details={[
              { label: '服务地址', value: ollama.baseUrl },
              { label: '已加载模型', value: `${ollama.models.length} 个` },
            ]}
            actions={
              <>
                {ollama.running ? (
                  <Button variant="outline" size="sm">
                    <Square className="h-4 w-4 mr-1" />
                    停止
                  </Button>
                ) : (
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4 mr-1" />
                    启动
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  拉取模型
                </Button>
              </>
            }
            href="/ai/ollama"
          />
        </div>

        {/* 模型提供商 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>模型提供商</CardTitle>
                <CardDescription>已配置的 AI 模型服务</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/ai/models">
                  <Settings className="h-4 w-4 mr-1" />
                  管理
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {models.filter((m) => m.enabled).map((model) => (
                <ModelProviderCard
                  key={model.id}
                  name={model.name}
                  provider={model.provider}
                  models={model.models}
                  defaultModel={model.defaultModel}
                  status={model.healthStatus || 'unknown'}
                  latencyMs={model.latencyMs}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 快捷入口 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/ai/chat" className="block">
            <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg p-3 bg-violet-500/10 text-violet-500">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI 对话</h3>
                    <p className="text-sm text-muted-foreground">
                      与 AI 进行对话交流
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/ai/agents" className="block">
            <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg p-3 bg-blue-500/10 text-blue-500">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Agent 管理</h3>
                    <p className="text-sm text-muted-foreground">
                      配置智能体行为
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/ai/channels" className="block">
            <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg p-3 bg-emerald-500/10 text-emerald-500">
                    <Radio className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">通道管理</h3>
                    <p className="text-sm text-muted-foreground">
                      QQ/微信/Telegram 等
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/ai/workflows" className="block">
            <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg p-3 bg-amber-500/10 text-amber-500">
                    <Workflow className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">工作流</h3>
                    <p className="text-sm text-muted-foreground">
                      任务编排自动化
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Ollama 本地模型 */}
        {ollama.models.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>本地模型 (Ollama)</CardTitle>
              <CardDescription>已下载的大语言模型</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ollama.models.map((model) => (
                  <div
                    key={model.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <Brain className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{model.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {model.details?.parameterSize} · {model.details?.quantizationLevel}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        {model.size}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {model.details?.family}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
