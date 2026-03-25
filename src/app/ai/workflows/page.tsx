'use client';

import { AppLayout } from '@/components/layout/layout-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  GitBranch,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  Copy,
  Settings,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Zap,
  Webhook,
  Timer,
  Mouse,
  Mail,
  Database,
  Globe,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

const workflows = [
  {
    id: 1,
    name: '自动回复流程',
    description: '根据用户意图自动回复消息',
    status: 'running',
    triggers: ['消息接收'],
    steps: 5,
    runs: 12580,
    successRate: 98.5,
    lastRun: '刚刚',
  },
  {
    id: 2,
    name: '数据处理流程',
    description: '抓取网页并提取数据',
    status: 'running',
    triggers: ['定时任务', '手动触发'],
    steps: 8,
    runs: 8920,
    successRate: 95.2,
    lastRun: '10分钟前',
  },
  {
    id: 3,
    name: '告警通知流程',
    description: '监控系统并发送告警',
    status: 'paused',
    triggers: ['Webhook'],
    steps: 4,
    runs: 450,
    successRate: 99.8,
    lastRun: '1小时前',
  },
  {
    id: 4,
    name: '内容审核流程',
    description: 'AI内容安全审核',
    status: 'running',
    triggers: ['API调用'],
    steps: 6,
    runs: 6780,
    successRate: 97.3,
    lastRun: '5分钟前',
  },
  {
    id: 5,
    name: '数据同步流程',
    description: '定期同步数据库',
    status: 'error',
    triggers: ['定时任务'],
    steps: 3,
    runs: 120,
    successRate: 78.5,
    lastRun: '2小时前',
  },
];

const templates = [
  { name: '消息处理', description: '处理用户消息并自动回复', icon: Mail },
  { name: '数据抓取', description: '抓取网页并提取结构化数据', icon: Globe },
  { name: '定时任务', description: '定期执行指定任务', icon: Timer },
  { name: 'Webhook处理', description: '接收并处理外部事件', icon: Webhook },
];

const nodeTypes = [
  { name: '触发器', description: '工作流启动点', icon: Zap, color: 'text-amber-500' },
  { name: '条件判断', description: '分支条件', icon: GitBranch, color: 'text-blue-500' },
  { name: 'AI处理', description: '调用AI模型', icon: Zap, color: 'text-violet-500' },
  { name: '数据操作', description: '数据库操作', icon: Database, color: 'text-emerald-500' },
  { name: 'HTTP请求', description: '发送HTTP请求', icon: Globe, color: 'text-sky-500' },
];

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; text: string }> = {
    running: { color: 'bg-emerald-500', text: '运行中' },
    paused: { color: 'bg-amber-500', text: '已暂停' },
    error: { color: 'bg-red-500', text: '错误' },
  };
  return (
    <Badge variant="outline" className="gap-1">
      <span className={cn('h-2 w-2 rounded-full', config[status]?.color || 'bg-gray-500')} />
      {config[status]?.text || status}
    </Badge>
  );
}

export default function WorkflowsPage() {
  const runningCount = workflows.filter(w => w.status === 'running').length;
  const totalRuns = workflows.reduce((sum, w) => sum + w.runs, 0);
  const avgSuccess = workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length;

  return (
    <AppLayout title="工作流">
      <div className="space-y-6">
        {/* 统计概览 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">运行中</p>
                  <p className="text-2xl font-bold">{runningCount} / {workflows.length}</p>
                </div>
                <div className="rounded-full p-3 bg-emerald-500/10">
                  <Play className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">总执行次数</p>
                  <p className="text-2xl font-bold">{totalRuns.toLocaleString()}</p>
                </div>
                <div className="rounded-full p-3 bg-blue-500/10">
                  <GitBranch className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">平均成功率</p>
                  <p className="text-2xl font-bold">{avgSuccess.toFixed(1)}%</p>
                </div>
                <div className="rounded-full p-3 bg-violet-500/10">
                  <CheckCircle2 className="h-6 w-6 text-violet-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">工作流节点</p>
                  <p className="text-2xl font-bold">{nodeTypes.length}</p>
                </div>
                <div className="rounded-full p-3 bg-amber-500/10">
                  <Zap className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 工作流列表 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>工作流列表</CardTitle>
                <CardDescription>管理和监控自动化工作流</CardDescription>
              </div>
              <div className="flex gap-2">
                <Input placeholder="搜索工作流..." className="w-48" />
                <Button>
                  <Plus className="h-4 w-4 mr-1" />
                  创建工作流
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>名称</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>触发器</TableHead>
                  <TableHead>步骤</TableHead>
                  <TableHead>执行次数</TableHead>
                  <TableHead>成功率</TableHead>
                  <TableHead>最后执行</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workflows.map((workflow) => (
                  <TableRow key={workflow.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{workflow.name}</p>
                        <p className="text-sm text-muted-foreground">{workflow.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={workflow.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {workflow.triggers.map((trigger, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {trigger}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{workflow.steps} 步</TableCell>
                    <TableCell>{workflow.runs.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={cn(
                        'font-medium',
                        workflow.successRate >= 95 ? 'text-emerald-500' :
                        workflow.successRate >= 80 ? 'text-amber-500' : 'text-red-500'
                      )}>
                        {workflow.successRate}%
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{workflow.lastRun}</TableCell>
                    <TableCell className="text-right">
                      {workflow.status === 'running' ? (
                        <Button variant="ghost" size="sm" title="暂停">
                          <Pause className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" title="启动">
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" title="编辑">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="复制">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="设置">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="删除" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 快速创建 */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* 模板 */}
          <Card>
            <CardHeader>
              <CardTitle>快速开始</CardTitle>
              <CardDescription>从模板创建工作流</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {templates.map((template, i) => {
                  const Icon = template.icon;
                  return (
                    <Button
                      key={i}
                      variant="outline"
                      className="h-auto flex-col gap-2 py-4"
                    >
                      <Icon className="h-5 w-5" />
                      <div className="text-left">
                        <p className="font-medium">{template.name}</p>
                        <p className="text-xs text-muted-foreground">{template.description}</p>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 节点类型 */}
          <Card>
            <CardHeader>
              <CardTitle>可用节点</CardTitle>
              <CardDescription>工作流构建块</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {nodeTypes.map((node, i) => {
                  const Icon = node.icon;
                  return (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="rounded-lg p-2 bg-muted">
                        <Icon className={cn('h-4 w-4', node.color)} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{node.name}</p>
                        <p className="text-xs text-muted-foreground">{node.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
