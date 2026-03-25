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
  Activity,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Server,
  Container,
  Globe,
  Database,
  Bell,
  Plus,
  Settings,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Gauge,
  LineChart,
  BarChart,
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

const monitorStats = {
  enabled: true,
  totalServices: 15,
  healthyServices: 13,
  warningServices: 1,
  criticalServices: 1,
  uptime: 99.95,
};

const serviceStatus = [
  { name: 'nginx-proxy', type: '容器', status: 'healthy', uptime: 99.99, cpu: 0.5, memory: 50, response: 12 },
  { name: 'mysql-db', type: '容器', status: 'healthy', uptime: 99.95, cpu: 2.3, memory: 512, response: 5 },
  { name: 'redis-cache', type: '容器', status: 'healthy', uptime: 100, cpu: 0.2, memory: 30, response: 1 },
  { name: 'openclaw', type: '容器', status: 'healthy', uptime: 99.8, cpu: 5.8, memory: 512, response: 45 },
  { name: 'ollama', type: '容器', status: 'healthy', uptime: 99.9, cpu: 15.2, memory: 8192, response: 200 },
  { name: 'example.com', type: '网站', status: 'healthy', uptime: 99.99, response: 120 },
  { name: 'api.example.com', type: '网站', status: 'healthy', uptime: 99.95, response: 85 },
  { name: 'blog.example.com', type: '网站', status: 'warning', uptime: 98.5, response: 500 },
  { name: 'MySQL主库', type: '数据库', status: 'healthy', uptime: 99.99, response: 3 },
  { name: 'PostgreSQL', type: '数据库', status: 'healthy', uptime: 99.95, response: 8 },
  { name: 'Redis缓存', type: '数据库', status: 'healthy', uptime: 100, response: 1 },
  { name: '主服务器', type: '主机', status: 'critical', uptime: 95.2, cpu: 85, memory: 90, disk: 95 },
  { name: 'DNS服务', type: '服务', status: 'healthy', uptime: 100, response: 20 },
  { name: 'SMTP服务', type: '服务', status: 'healthy', uptime: 99.8, response: 100 },
  { name: '备份服务', type: '服务', status: 'healthy', uptime: 99.9, response: 0 },
];

const alerts = [
  { id: 1, level: 'critical', message: '主服务器磁盘使用率超过95%', source: '主服务器', time: '20:45:00', resolved: false },
  { id: 2, level: 'warning', message: 'blog.example.com 响应时间超过500ms', source: 'blog.example.com', time: '20:30:00', resolved: false },
  { id: 3, level: 'info', message: 'MySQL数据库备份完成', source: 'MySQL主库', time: '20:00:00', resolved: true },
  { id: 4, level: 'warning', message: '容器 mysql-db 内存使用率超过80%', source: 'mysql-db', time: '19:45:00', resolved: true },
  { id: 5, level: 'info', message: 'SSL证书 example.com 已自动续期', source: 'SSL管理', time: '19:00:00', resolved: true },
];

const alertRules = [
  { id: 1, name: 'CPU使用率告警', condition: 'CPU > 80%', duration: '5分钟', enabled: true, lastTriggered: '2小时前' },
  { id: 2, name: '内存使用率告警', condition: '内存 > 85%', duration: '5分钟', enabled: true, lastTriggered: '1天前' },
  { id: 3, name: '磁盘使用率告警', condition: '磁盘 > 90%', duration: '1分钟', enabled: true, lastTriggered: '刚刚' },
  { id: 4, name: '服务响应超时', condition: '响应时间 > 3秒', duration: '1分钟', enabled: true, lastTriggered: '30分钟前' },
  { id: 5, name: '服务离线告警', condition: '服务不可用', duration: '立即', enabled: true, lastTriggered: '1周前' },
  { id: 6, name: '容器重启告警', condition: '容器重启', duration: '立即', enabled: true, lastTriggered: '3天前' },
];

const metrics = {
  cpu: { current: 23.5, avg: 25.3, max: 78.2, min: 5.1 },
  memory: { current: 37.5, avg: 40.2, max: 65.8, min: 25.3 },
  disk: { current: 36, avg: 35.5, max: 36.2, min: 34.8 },
  network: { in: 125.5, out: 89.3, connections: 1256 },
};

function ServiceStatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; text: string; icon: React.ElementType }> = {
    healthy: { color: 'bg-emerald-500', text: '健康', icon: CheckCircle2 },
    warning: { color: 'bg-amber-500', text: '警告', icon: AlertTriangle },
    critical: { color: 'bg-red-500', text: '严重', icon: XCircle },
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

function AlertBadge({ level }: { level: string }) {
  const config: Record<string, { color: string; text: string }> = {
    critical: { color: 'bg-red-500 text-white', text: '严重' },
    warning: { color: 'bg-amber-500 text-white', text: '警告' },
    info: { color: 'bg-blue-500 text-white', text: '信息' },
  };
  return (
    <Badge className={config[level]?.color || ''}>
      {config[level]?.text || level}
    </Badge>
  );
}

function MetricCard({
  title,
  value,
  unit,
  avg,
  max,
  min,
  icon: Icon,
  trend,
}: {
  title: string;
  value: number;
  unit: string;
  avg: number;
  max: number;
  min: number;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">{title}</span>
          </div>
          {trend && (
            <Badge variant={trend === 'up' ? 'destructive' : trend === 'down' ? 'default' : 'outline'}>
              {trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {trend === 'neutral' ? '稳定' : trend === 'up' ? '上升' : '下降'}
            </Badge>
          )}
        </div>
        <div className="mb-4">
          <span className="text-3xl font-bold">{value}</span>
          <span className="text-lg text-muted-foreground ml-1">{unit}</span>
        </div>
        <Progress value={value} className="h-2 mb-3" />
        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
          <div>
            <span>平均:</span>
            <span className="ml-1 font-medium">{avg}{unit}</span>
          </div>
          <div>
            <span>最大:</span>
            <span className="ml-1 font-medium">{max}{unit}</span>
          </div>
          <div>
            <span>最小:</span>
            <span className="ml-1 font-medium">{min}{unit}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MonitorPage() {
  const [monitorEnabled, setMonitorEnabled] = useState(monitorStats.enabled);

  return (
    <AppLayout title="系统监控">
      <div className="space-y-6">
        {/* 监控概览 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">监控状态</p>
                  <p className="text-xl font-semibold flex items-center gap-2">
                    {monitorEnabled ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        已启用
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-red-500" />
                        已禁用
                      </>
                    )}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">服务总数</p>
                  <p className="text-2xl font-bold">{monitorStats.totalServices}</p>
                  <p className="text-xs text-muted-foreground">
                    {monitorStats.healthyServices} 健康 / {monitorStats.warningServices} 警告 / {monitorStats.criticalServices} 严重
                  </p>
                </div>
                <Server className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">整体可用性</p>
                  <p className="text-2xl font-bold">{monitorStats.uptime}%</p>
                </div>
                <Gauge className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">活跃告警</p>
                  <p className="text-2xl font-bold text-destructive">{alerts.filter(a => !a.resolved).length}</p>
                </div>
                <Bell className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 资源监控 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="CPU 使用率"
            value={metrics.cpu.current}
            unit="%"
            avg={metrics.cpu.avg}
            max={metrics.cpu.max}
            min={metrics.cpu.min}
            icon={Cpu}
            trend="neutral"
          />
          <MetricCard
            title="内存使用率"
            value={metrics.memory.current}
            unit="%"
            avg={metrics.memory.avg}
            max={metrics.memory.max}
            min={metrics.memory.min}
            icon={MemoryStick}
            trend="down"
          />
          <MetricCard
            title="磁盘使用率"
            value={metrics.disk.current}
            unit="%"
            avg={metrics.disk.avg}
            max={metrics.disk.max}
            min={metrics.disk.min}
            icon={HardDrive}
            trend="up"
          />
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">网络流量</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">入站流量</span>
                  <span className="font-medium">{metrics.network.in} Mbps</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">出站流量</span>
                  <span className="font-medium">{metrics.network.out} Mbps</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">活跃连接</span>
                  <span className="font-medium">{metrics.network.connections.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 详细信息 */}
        <Tabs defaultValue="services" className="space-y-4">
          <TabsList>
            <TabsTrigger value="services" className="gap-2">
              <Server className="h-4 w-4" />
              服务状态
            </TabsTrigger>
            <TabsTrigger value="alerts" className="gap-2">
              <Bell className="h-4 w-4" />
              告警记录
            </TabsTrigger>
            <TabsTrigger value="rules" className="gap-2">
              <Settings className="h-4 w-4" />
              告警规则
            </TabsTrigger>
            <TabsTrigger value="config" className="gap-2">
              <Gauge className="h-4 w-4" />
              监控配置
            </TabsTrigger>
          </TabsList>

          {/* 服务状态 */}
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>服务状态</CardTitle>
                    <CardDescription>监控所有服务的运行状态</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="搜索服务..." className="w-48" />
                    <Button variant="outline">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      刷新
                    </Button>
                    <Button>
                      <Plus className="h-4 w-4 mr-1" />
                      添加服务
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>服务名称</TableHead>
                      <TableHead>类型</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>可用性</TableHead>
                      <TableHead>CPU</TableHead>
                      <TableHead>内存</TableHead>
                      <TableHead>响应时间</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serviceStatus.map((service, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{service.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{service.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <ServiceStatusBadge status={service.status} />
                        </TableCell>
                        <TableCell>
                          <span className={cn(
                            'font-medium',
                            service.uptime >= 99.9 ? 'text-emerald-500' :
                            service.uptime >= 99 ? 'text-amber-500' : 'text-red-500'
                          )}>
                            {service.uptime}%
                          </span>
                        </TableCell>
                        <TableCell>{service.cpu ? `${service.cpu}%` : '-'}</TableCell>
                        <TableCell>{service.memory ? `${service.memory} MB` : '-'}</TableCell>
                        <TableCell>{service.response} ms</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <LineChart className="h-4 w-4" />
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

          {/* 告警记录 */}
          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>告警记录</CardTitle>
                    <CardDescription>查看所有告警事件</CardDescription>
                  </div>
                  <Button variant="outline">
                    标记全部已读
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={cn(
                        'flex items-start gap-4 p-4 rounded-lg border',
                        alert.resolved && 'opacity-60'
                      )}
                    >
                      <AlertBadge level={alert.level} />
                      <div className="flex-1">
                        <p className="font-medium">{alert.message}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span>来源: {alert.source}</span>
                          <span>时间: {alert.time}</span>
                        </div>
                      </div>
                      {alert.resolved ? (
                        <Badge variant="outline">已处理</Badge>
                      ) : (
                        <Button size="sm" variant="outline">
                          处理
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 告警规则 */}
          <TabsContent value="rules">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>告警规则</CardTitle>
                    <CardDescription>配置监控告警触发条件</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-1" />
                    添加规则
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>规则名称</TableHead>
                      <TableHead>触发条件</TableHead>
                      <TableHead>持续时间</TableHead>
                      <TableHead>启用</TableHead>
                      <TableHead>最近触发</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alertRules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell className="font-medium">{rule.name}</TableCell>
                        <TableCell className="font-mono">{rule.condition}</TableCell>
                        <TableCell>{rule.duration}</TableCell>
                        <TableCell>
                          <Switch checked={rule.enabled} />
                        </TableCell>
                        <TableCell className="text-muted-foreground">{rule.lastTriggered}</TableCell>
                        <TableCell className="text-right">
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

          {/* 监控配置 */}
          <TabsContent value="config">
            <Card>
              <CardHeader>
                <CardTitle>监控配置</CardTitle>
                <CardDescription>全局监控设置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">启用监控</p>
                    <p className="text-sm text-muted-foreground">开启系统和服务监控</p>
                  </div>
                  <Switch checked={monitorEnabled} onCheckedChange={setMonitorEnabled} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">邮件通知</p>
                    <p className="text-sm text-muted-foreground">告警时发送邮件通知</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">Webhook 通知</p>
                    <p className="text-sm text-muted-foreground">通过 Webhook 推送告警</p>
                  </div>
                  <Switch />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">数据保留天数</p>
                    <Input defaultValue="30 天" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">采集间隔</p>
                    <Input defaultValue="60 秒" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">通知邮箱</p>
                    <Input defaultValue="admin@example.com" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Webhook URL</p>
                    <Input placeholder="https://webhook.example.com/alert" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    保存配置
                  </Button>
                  <Button variant="outline">
                    测试通知
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
