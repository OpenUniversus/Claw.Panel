'use client';

import { AppLayout } from '@/components/layout/layout-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Server,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Settings,
  Network,
  Globe,
  Link,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Cpu,
  MemoryStick,
  HardDrive,
  Activity,
  Terminal,
  Copy,
  Key,
  Download,
  Upload,
  Zap,
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
import { useState } from 'react';

const nodeStats = {
  totalNodes: 5,
  onlineNodes: 4,
  offlineNodes: 1,
  totalResources: { cpu: 32, memory: 128, disk: 2000 },
  usedResources: { cpu: 12.5, memory: 48, disk: 650 },
};

const nodes = [
  {
    id: 1,
    name: '主服务器',
    host: '192.168.1.100',
    port: 22,
    status: 'online',
    role: 'master',
    os: 'Ubuntu 24.04 LTS',
    cpu: { total: 8, used: 2.5 },
    memory: { total: 32, used: 12 },
    disk: { total: 500, used: 175 },
    uptime: 2592000,
    lastSync: '刚刚',
    services: ['Docker', 'Nginx', 'MySQL', 'Redis'],
  },
  {
    id: 2,
    name: '应用服务器-1',
    host: '192.168.1.101',
    port: 22,
    status: 'online',
    role: 'worker',
    os: 'Ubuntu 22.04 LTS',
    cpu: { total: 4, used: 3.2 },
    memory: { total: 16, used: 10 },
    disk: { total: 200, used: 120 },
    uptime: 1296000,
    lastSync: '30秒前',
    services: ['Docker', 'Node.js', 'PM2'],
  },
  {
    id: 3,
    name: '应用服务器-2',
    host: '192.168.1.102',
    port: 22,
    status: 'online',
    role: 'worker',
    os: 'Ubuntu 22.04 LTS',
    cpu: { total: 4, used: 2.8 },
    memory: { total: 16, used: 8 },
    disk: { total: 200, used: 80 },
    uptime: 864000,
    lastSync: '1分钟前',
    services: ['Docker', 'Python', 'Gunicorn'],
  },
  {
    id: 4,
    name: '数据库服务器',
    host: '192.168.1.103',
    port: 22,
    status: 'online',
    role: 'worker',
    os: 'CentOS 8',
    cpu: { total: 8, used: 3.5 },
    memory: { total: 64, used: 15 },
    disk: { total: 1000, used: 250 },
    uptime: 5184000,
    lastSync: '刚刚',
    services: ['PostgreSQL', 'MongoDB', 'Redis'],
  },
  {
    id: 5,
    name: '备份服务器',
    host: '192.168.1.104',
    port: 22,
    status: 'offline',
    role: 'worker',
    os: 'Debian 12',
    cpu: { total: 2, used: 0 },
    memory: { total: 8, used: 0 },
    disk: { total: 100, used: 25 },
    uptime: 0,
    lastSync: '2小时前',
    services: ['Restic', 'Rclone'],
  },
];

const nodeGroups = [
  { id: 1, name: '生产环境', nodes: ['主服务器', '应用服务器-1', '应用服务器-2'], status: 'healthy' },
  { id: 2, name: '数据库集群', nodes: ['数据库服务器'], status: 'healthy' },
  { id: 3, name: '备份系统', nodes: ['备份服务器'], status: 'warning' },
];

const syncTasks = [
  { id: 1, name: '配置同步', source: '主服务器', target: '所有节点', lastRun: '10分钟前', status: 'success' },
  { id: 2, name: '证书同步', source: '主服务器', target: '所有节点', lastRun: '1小时前', status: 'success' },
  { id: 3, name: '防火墙规则同步', source: '主服务器', target: '所有节点', lastRun: '30分钟前', status: 'success' },
  { id: 4, name: '备份任务', source: '所有节点', target: '备份服务器', lastRun: '2小时前', status: 'failed' },
];

function NodeStatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; text: string }> = {
    online: { color: 'bg-emerald-500', text: '在线' },
    offline: { color: 'bg-red-500', text: '离线' },
    maintenance: { color: 'bg-amber-500', text: '维护中' },
  };
  return (
    <Badge variant="outline" className="gap-1">
      <span className={cn('h-2 w-2 rounded-full', config[status]?.color || 'bg-gray-500')} />
      {config[status]?.text || status}
    </Badge>
  );
}

function RoleBadge({ role }: { role: string }) {
  const config: Record<string, { color: string; text: string }> = {
    master: { color: 'bg-violet-500 text-white', text: '主节点' },
    worker: { color: 'bg-blue-500 text-white', text: '工作节点' },
  };
  return (
    <Badge className={config[role]?.color || ''}>
      {config[role]?.text || role}
    </Badge>
  );
}

function SyncStatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; text: string; icon: React.ElementType }> = {
    success: { color: 'text-emerald-500', text: '成功', icon: CheckCircle2 },
    failed: { color: 'text-red-500', text: '失败', icon: XCircle },
    running: { color: 'text-blue-500', text: '运行中', icon: Activity },
  };
  const Icon = config[status]?.icon || Activity;
  return (
    <Badge variant="outline" className={cn('gap-1', config[status]?.color)}>
      <Icon className="h-3 w-3" />
      {config[status]?.text || status}
    </Badge>
  );
}

function formatUptime(seconds: number): string {
  if (seconds === 0) return '-';
  const days = Math.floor(seconds / 86400);
  if (days > 0) return `${days}天`;
  const hours = Math.floor(seconds / 3600);
  return `${hours}小时`;
}

export default function NodesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <AppLayout title="节点管理">
      <div className="space-y-6">
        {/* 节点概览 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">节点总数</p>
                  <p className="text-2xl font-bold">{nodeStats.totalNodes}</p>
                </div>
                <Server className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">在线节点</p>
                  <p className="text-2xl font-bold text-emerald-500">{nodeStats.onlineNodes}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">离线节点</p>
                  <p className="text-2xl font-bold text-destructive">{nodeStats.offlineNodes}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">总资源</p>
                  <p className="text-lg font-bold">
                    {nodeStats.totalResources.cpu}核 / {nodeStats.totalResources.memory}GB / {nodeStats.totalResources.disk}GB
                  </p>
                  <p className="text-xs text-muted-foreground">CPU / 内存 / 磁盘</p>
                </div>
                <Zap className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 资源使用概览 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              集群资源使用
            </CardTitle>
            <CardDescription>所有节点的资源使用情况汇总</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">CPU</span>
                  <span className="text-sm text-muted-foreground">
                    {nodeStats.usedResources.cpu} / {nodeStats.totalResources.cpu} 核心
                  </span>
                </div>
                <Progress value={(nodeStats.usedResources.cpu / nodeStats.totalResources.cpu) * 100} className="h-3" />
                <p className="text-xs text-muted-foreground text-right">
                  {((nodeStats.usedResources.cpu / nodeStats.totalResources.cpu) * 100).toFixed(1)}% 使用率
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">内存</span>
                  <span className="text-sm text-muted-foreground">
                    {nodeStats.usedResources.memory} / {nodeStats.totalResources.memory} GB
                  </span>
                </div>
                <Progress value={(nodeStats.usedResources.memory / nodeStats.totalResources.memory) * 100} className="h-3" />
                <p className="text-xs text-muted-foreground text-right">
                  {((nodeStats.usedResources.memory / nodeStats.totalResources.memory) * 100).toFixed(1)}% 使用率
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">磁盘</span>
                  <span className="text-sm text-muted-foreground">
                    {nodeStats.usedResources.disk} / {nodeStats.totalResources.disk} GB
                  </span>
                </div>
                <Progress value={(nodeStats.usedResources.disk / nodeStats.totalResources.disk) * 100} className="h-3" />
                <p className="text-xs text-muted-foreground text-right">
                  {((nodeStats.usedResources.disk / nodeStats.totalResources.disk) * 100).toFixed(1)}% 使用率
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 详细信息 */}
        <Tabs defaultValue="nodes" className="space-y-4">
          <TabsList>
            <TabsTrigger value="nodes" className="gap-2">
              <Server className="h-4 w-4" />
              节点列表
            </TabsTrigger>
            <TabsTrigger value="groups" className="gap-2">
              <Network className="h-4 w-4" />
              节点分组
            </TabsTrigger>
            <TabsTrigger value="sync" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              同步任务
            </TabsTrigger>
            <TabsTrigger value="config" className="gap-2">
              <Settings className="h-4 w-4" />
              全局配置
            </TabsTrigger>
          </TabsList>

          {/* 节点列表 */}
          <TabsContent value="nodes">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>节点列表</CardTitle>
                    <CardDescription>管理所有服务器节点</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="搜索节点..." 
                      className="w-48"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="outline">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      刷新状态
                    </Button>
                    <Button>
                      <Plus className="h-4 w-4 mr-1" />
                      添加节点
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>节点名称</TableHead>
                      <TableHead>地址</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>角色</TableHead>
                      <TableHead>系统</TableHead>
                      <TableHead>CPU</TableHead>
                      <TableHead>内存</TableHead>
                      <TableHead>磁盘</TableHead>
                      <TableHead>运行时间</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {nodes.map((node) => (
                      <TableRow key={node.id}>
                        <TableCell className="font-medium">{node.name}</TableCell>
                        <TableCell className="font-mono text-sm">
                          <div className="flex items-center gap-1">
                            {node.host}:{node.port}
                            <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <NodeStatusBadge status={node.status} />
                        </TableCell>
                        <TableCell>
                          <RoleBadge role={node.role} />
                        </TableCell>
                        <TableCell className="text-sm">{node.os}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span>{node.cpu.used}</span>
                            <span className="text-muted-foreground">/ {node.cpu.total}核</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span>{node.memory.used}</span>
                            <span className="text-muted-foreground">/ {node.memory.total}GB</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span>{node.disk.used}</span>
                            <span className="text-muted-foreground">/ {node.disk.total}GB</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{formatUptime(node.uptime)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" title="终端">
                            <Terminal className="h-4 w-4" />
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
          </TabsContent>

          {/* 节点分组 */}
          <TabsContent value="groups">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>节点分组</CardTitle>
                    <CardDescription>按环境或功能分组管理节点</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-1" />
                    创建分组
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {nodeGroups.map((group) => (
                    <Card key={group.id} className="transition-all hover:shadow-md">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Network className="h-5 w-5 text-primary" />
                            <span className="font-semibold">{group.name}</span>
                          </div>
                          <Badge variant={group.status === 'healthy' ? 'default' : 'destructive'}>
                            {group.status === 'healthy' ? '健康' : '异常'}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          {group.nodes.map((node, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <Server className="h-3 w-3 text-muted-foreground" />
                              <span>{node}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3 mr-1" />
                            编辑
                          </Button>
                          <Button variant="outline" size="sm">
                            <Terminal className="h-3 w-3 mr-1" />
                            批量执行
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 同步任务 */}
          <TabsContent value="sync">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>同步任务</CardTitle>
                    <CardDescription>配置和数据的同步任务管理</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-1" />
                    创建任务
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>任务名称</TableHead>
                      <TableHead>源节点</TableHead>
                      <TableHead>目标节点</TableHead>
                      <TableHead>最后执行</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {syncTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.name}</TableCell>
                        <TableCell>{task.source}</TableCell>
                        <TableCell>{task.target}</TableCell>
                        <TableCell className="text-muted-foreground">{task.lastRun}</TableCell>
                        <TableCell>
                          <SyncStatusBadge status={task.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 全局配置 */}
          <TabsContent value="config">
            <Card>
              <CardHeader>
                <CardTitle>全局配置</CardTitle>
                <CardDescription>节点管理全局设置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">自动发现节点</p>
                    <p className="text-sm text-muted-foreground">自动扫描局域网内的服务器</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">心跳检测</p>
                    <p className="text-sm text-muted-foreground">定期检测节点在线状态</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">自动同步配置</p>
                    <p className="text-sm text-muted-foreground">配置变更后自动同步到所有节点</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">心跳间隔</p>
                    <Input defaultValue="30 秒" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">超时时间</p>
                    <Input defaultValue="10 秒" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">SSH 端口</p>
                    <Input defaultValue="22" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">离线告警阈值</p>
                    <Input defaultValue="3 次" />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    SSH 密钥管理
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    管理用于连接各节点的 SSH 密钥
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-1" />
                      上传密钥
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      下载公钥
                    </Button>
                    <Button variant="outline" size="sm">
                      生成密钥对
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    保存配置
                  </Button>
                  <Button variant="outline">
                    测试连接
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
