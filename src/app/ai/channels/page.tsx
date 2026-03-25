'use client';

import { AppLayout } from '@/components/layout/layout-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import {
  Radio,
  Plus,
  Edit,
  Trash2,
  Settings,
  TestTube,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MessageSquare,
  Send,
  Globe,
  Smartphone,
  Bot,
  Zap,
  Activity,
  RefreshCw,
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

const channels = [
  {
    id: 1,
    name: 'QQ群机器人',
    type: 'qq',
    status: 'connected',
    enabled: true,
    messages: 12580,
    lastActive: '5分钟前',
    config: { groupId: '123456789' },
  },
  {
    id: 2,
    name: '微信公众号',
    type: 'wechat',
    status: 'connected',
    enabled: true,
    messages: 8920,
    lastActive: '10分钟前',
    config: { appId: 'wx1234567890' },
  },
  {
    id: 3,
    name: 'Telegram Bot',
    type: 'telegram',
    status: 'connected',
    enabled: true,
    messages: 3560,
    lastActive: '1小时前',
    config: { botToken: '123456:ABC...' },
  },
  {
    id: 4,
    name: '钉钉机器人',
    type: 'dingtalk',
    status: 'disconnected',
    enabled: false,
    messages: 0,
    lastActive: '从未',
    config: { webhook: 'https://oapi.dingtalk.com/robot/send?...' },
  },
  {
    id: 5,
    name: '飞书机器人',
    type: 'feishu',
    status: 'error',
    enabled: true,
    messages: 128,
    lastActive: '2小时前',
    config: { appId: 'cli_xxx' },
  },
  {
    id: 6,
    name: 'Web API',
    type: 'api',
    status: 'connected',
    enabled: true,
    messages: 45678,
    lastActive: '刚刚',
    config: { apiKey: 'sk-xxx' },
  },
];

const channelTypes = [
  { type: 'qq', name: 'QQ', icon: MessageSquare, color: 'text-blue-500' },
  { type: 'wechat', name: '微信', icon: MessageSquare, color: 'text-green-500' },
  { type: 'telegram', name: 'Telegram', icon: Send, color: 'text-sky-500' },
  { type: 'dingtalk', name: '钉钉', icon: MessageSquare, color: 'text-blue-600' },
  { type: 'feishu', name: '飞书', icon: MessageSquare, color: 'text-blue-400' },
  { type: 'api', name: 'API', icon: Globe, color: 'text-purple-500' },
];

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; text: string; icon: React.ElementType }> = {
    connected: { color: 'bg-emerald-500', text: '已连接', icon: CheckCircle2 },
    disconnected: { color: 'bg-gray-500', text: '未连接', icon: XCircle },
    error: { color: 'bg-red-500', text: '错误', icon: AlertTriangle },
  };
  const Icon = config[status]?.icon || XCircle;
  return (
    <Badge variant="outline" className="gap-1">
      <span className={cn('h-2 w-2 rounded-full', config[status]?.color || 'bg-gray-500')} />
      <Icon className="h-3 w-3" />
      {config[status]?.text || status}
    </Badge>
  );
}

function ChannelTypeIcon({ type }: { type: string }) {
  const config = channelTypes.find(t => t.type === type);
  if (!config) return <Radio className="h-4 w-4" />;
  const Icon = config.icon;
  return <Icon className={cn('h-4 w-4', config.color)} />;
}

export default function ChannelsPage() {
  const connectedCount = channels.filter(c => c.status === 'connected').length;
  const totalMessages = channels.reduce((sum, c) => sum + c.messages, 0);

  return (
    <AppLayout title="通道管理">
      <div className="space-y-6">
        {/* 统计概览 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">已连接</p>
                  <p className="text-2xl font-bold">{connectedCount} / {channels.length}</p>
                </div>
                <div className="rounded-full p-3 bg-emerald-500/10">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">今日消息</p>
                  <p className="text-2xl font-bold">{totalMessages.toLocaleString()}</p>
                </div>
                <div className="rounded-full p-3 bg-blue-500/10">
                  <MessageSquare className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">活跃通道</p>
                  <p className="text-2xl font-bold">{channels.filter(c => c.enabled).length}</p>
                </div>
                <div className="rounded-full p-3 bg-violet-500/10">
                  <Radio className="h-6 w-6 text-violet-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">错误通道</p>
                  <p className="text-2xl font-bold text-destructive">
                    {channels.filter(c => c.status === 'error').length}
                  </p>
                </div>
                <div className="rounded-full p-3 bg-red-500/10">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 通道列表 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>通道列表</CardTitle>
                <CardDescription>管理消息通道配置</CardDescription>
              </div>
              <div className="flex gap-2">
                <Input placeholder="搜索通道..." className="w-48" />
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  刷新状态
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-1" />
                  添加通道
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>名称</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>启用</TableHead>
                  <TableHead>消息数</TableHead>
                  <TableHead>最后活跃</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {channels.map((channel) => (
                  <TableRow key={channel.id}>
                    <TableCell className="font-medium">{channel.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ChannelTypeIcon type={channel.type} />
                        <span className="capitalize">{channel.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={channel.status} />
                    </TableCell>
                    <TableCell>
                      <Switch checked={channel.enabled} />
                    </TableCell>
                    <TableCell>{channel.messages.toLocaleString()}</TableCell>
                    <TableCell className="text-muted-foreground">{channel.lastActive}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" title="测试连接">
                        <TestTube className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="编辑">
                        <Edit className="h-4 w-4" />
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

        {/* 快速添加 */}
        <Card>
          <CardHeader>
            <CardTitle>快速添加通道</CardTitle>
            <CardDescription>选择要添加的通道类型</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
              {channelTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Button
                    key={type.type}
                    variant="outline"
                    className="h-auto flex-col gap-2 py-4"
                  >
                    <Icon className={cn('h-6 w-6', type.color)} />
                    <span>{type.name}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
