'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/layout-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Cpu,
  HardDrive,
  Thermometer,
  Zap,
  Activity,
  AlertTriangle,
  RefreshCw,
  Settings,
  Power,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  Box,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

// 模拟GPU数据
const mockGpuInfo = {
  detected: false,
  type: 'none' as 'nvidia' | 'xpu' | 'none',
  error: '当前系统未检测到 NVIDIA-SMI 或 XPU-SMI 指令，请检查后重试！',
};

// 模拟GPU运行数据（如果有GPU）
const mockGpuRunningInfo = {
  name: 'NVIDIA GeForce RTX 4090',
  driverVersion: '550.54.14',
  cudaVersion: '12.4',
  memoryTotal: '24576 MiB',
  memoryUsed: '8192 MiB',
  memoryFree: '16384 MiB',
  utilization: 45,
  temperature: 68,
  powerDraw: 250,
  powerLimit: 450,
  fanSpeed: 65,
  processes: [
    { pid: 12345, name: 'python', memory: '4096 MiB', type: 'GpuCompute' },
    { pid: 12346, name: 'ollama', memory: '2048 MiB', type: 'GpuCompute' },
    { pid: 12347, name: 'stable-diffusion', memory: '2048 MiB', type: 'GpuGraphics' },
  ],
};

// 模拟历史数据
const generateHistoryData = () => {
  const now = Date.now();
  return Array.from({ length: 24 }, (_, i) => ({
    time: new Date(now - (23 - i) * 3600000).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    utilization: Math.floor(30 + Math.random() * 50),
    temperature: Math.floor(60 + Math.random() * 20),
    memory: Math.floor(30 + Math.random() * 40),
    power: Math.floor(150 + Math.random() * 200),
  }));
};

function GpuMetricCard({
  title,
  value,
  unit,
  icon: Icon,
  color,
  progress,
  status,
}: {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ElementType;
  color: string;
  progress?: number;
  status?: 'normal' | 'warning' | 'critical';
}) {
  const statusColors = {
    normal: 'text-emerald-500',
    warning: 'text-amber-500',
    critical: 'text-red-500',
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">{title}</span>
          <div className={cn('rounded-lg p-2', `bg-${color}/10`)}>
            <Icon className={cn('h-4 w-4', `text-${color}`)} />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">{value}</span>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
        {progress !== undefined && (
          <div className="mt-2">
            <Progress value={progress} className="h-1.5" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-32 h-32 mb-6 text-muted-foreground/30">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="40" y="60" width="120" height="80" rx="8" stroke="currentColor" strokeWidth="3" fill="none" />
          <path d="M60 60 L60 50 Q60 40 70 40 L130 40 Q140 40 140 50 L140 60" stroke="currentColor" strokeWidth="3" fill="none" />
          <rect x="55" y="75" width="30" height="20" rx="2" fill="currentColor" opacity="0.3" />
          <rect x="95" y="75" width="30" height="20" rx="2" fill="currentColor" opacity="0.3" />
          <rect x="135" y="75" width="10" height="40" rx="2" fill="currentColor" opacity="0.3" />
          <line x1="50" y1="120" x2="150" y2="120" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
        </svg>
      </div>
      <p className="text-muted-foreground text-center max-w-md">{message}</p>
      <Button variant="outline" className="mt-4">
        <RefreshCw className="h-4 w-4 mr-2" />
        重新检测
      </Button>
    </div>
  );
}

function RealTimeMonitor({ hasGpu }: { hasGpu: boolean }) {
  const [gpuData, setGpuData] = useState(mockGpuRunningInfo);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!hasGpu) {
    return <EmptyState message={mockGpuInfo.error} />;
  }

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setGpuData({
        ...gpuData,
        utilization: Math.floor(30 + Math.random() * 50),
        temperature: Math.floor(60 + Math.random() * 20),
        powerDraw: Math.floor(150 + Math.random() * 200),
      });
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* GPU 信息头部 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-emerald-500/10 p-3">
                <Cpu className="h-8 w-8 text-emerald-500" />
              </div>
              <div>
                <CardTitle className="text-xl">{gpuData.name}</CardTitle>
                <CardDescription>
                  驱动版本: {gpuData.driverVersion} | CUDA: {gpuData.cudaVersion}
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={cn('h-4 w-4 mr-1', isRefreshing && 'animate-spin')} />
                刷新
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-1" />
                设置
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 核心指标 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <GpuMetricCard
          title="GPU 利用率"
          value={gpuData.utilization}
          unit="%"
          icon={Activity}
          color="violet-500"
          progress={gpuData.utilization}
          status={gpuData.utilization > 90 ? 'critical' : gpuData.utilization > 70 ? 'warning' : 'normal'}
        />
        <GpuMetricCard
          title="温度"
          value={gpuData.temperature}
          unit="°C"
          icon={Thermometer}
          color="orange-500"
          progress={(gpuData.temperature / 100) * 100}
          status={gpuData.temperature > 85 ? 'critical' : gpuData.temperature > 75 ? 'warning' : 'normal'}
        />
        <GpuMetricCard
          title="显存使用"
          value={`${gpuData.utilization}%`}
          icon={HardDrive}
          color="blue-500"
          progress={gpuData.utilization}
        />
        <GpuMetricCard
          title="功耗"
          value={gpuData.powerDraw}
          unit="W"
          icon={Zap}
          color="amber-500"
          progress={(gpuData.powerDraw / gpuData.powerLimit) * 100}
        />
      </div>

      {/* 详细信息 */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* 显存详情 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">显存信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">总显存</span>
                <span className="font-medium">{gpuData.memoryTotal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">已使用</span>
                <span className="font-medium text-amber-500">{gpuData.memoryUsed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">可用</span>
                <span className="font-medium text-emerald-500">{gpuData.memoryFree}</span>
              </div>
              <div className="pt-2 border-t">
                <Progress value={(8192 / 24576) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">显存使用率: 33.3%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 运行进程 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">GPU 进程</CardTitle>
              <Badge variant="secondary">{gpuData.processes.length} 个进程</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {gpuData.processes.map((process) => (
                <div key={process.pid} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="rounded bg-violet-500/10 p-1.5">
                      <Activity className="h-4 w-4 text-violet-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{process.name}</p>
                      <p className="text-xs text-muted-foreground">PID: {process.pid}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{process.memory}</p>
                    <Badge variant="outline" className="text-xs">
                      {process.type === 'GpuCompute' ? '计算' : '图形'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function HistoryMonitor({ hasGpu }: { hasGpu: boolean }) {
  const [historyData] = useState(generateHistoryData);
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('24h');

  if (!hasGpu) {
    return <EmptyState message={mockGpuInfo.error} />;
  }

  return (
    <div className="space-y-6">
      {/* 时间范围选择 */}
      <div className="flex gap-2">
        {(['1h', '6h', '24h', '7d'] as const).map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange(range)}
          >
            {range === '1h' && '1小时'}
            {range === '6h' && '6小时'}
            {range === '24h' && '24小时'}
            {range === '7d' && '7天'}
          </Button>
        ))}
      </div>

      {/* 利用率趋势 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">GPU 利用率趋势</CardTitle>
          <CardDescription>过去24小时的GPU使用情况</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="colorUtilization" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="time" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="utilization"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="url(#colorUtilization)"
                  name="利用率 (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 多指标对比 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">温度趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis className="text-xs" domain={[50, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={false}
                    name="温度 (°C)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">显存使用趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis className="text-xs" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="memory"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    name="显存使用 (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 功耗趋势 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">功耗趋势</CardTitle>
          <CardDescription>GPU功耗变化</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="time" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="power"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fill="url(#colorPower)"
                  name="功耗 (W)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function GpuMonitorPage() {
  const [hasGpu, setHasGpu] = useState(false);
  const [gpuType, setGpuType] = useState<'nvidia' | 'xpu' | 'none'>('none');
  const [isDetecting, setIsDetecting] = useState(true);

  useEffect(() => {
    // 模拟GPU检测
    const detectGpu = async () => {
      setIsDetecting(true);
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // 设置检测结果（这里模拟没有检测到GPU）
      setHasGpu(false);
      setGpuType('none');
      setIsDetecting(false);
    };

    detectGpu();
  }, []);

  return (
    <AppLayout title="GPU 监控">
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">GPU 监控</h1>
            <p className="text-muted-foreground">
              监控 NVIDIA/XPU GPU 运行状态
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Info className="h-4 w-4 mr-1" />
              帮助
            </Button>
          </div>
        </div>

        {/* GPU 状态提示 */}
        {!isDetecting && !hasGpu && (
          <Card className="border-amber-500/50 bg-amber-500/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-600">GPU 未检测到</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    请确保已安装 NVIDIA 驱动或 XPU 驱动，并配置好相关环境变量。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 标签页 */}
        <Tabs defaultValue="realtime" className="space-y-4">
          <TabsList>
            <TabsTrigger value="realtime">
              <Activity className="h-4 w-4 mr-2" />
              实时监控
            </TabsTrigger>
            <TabsTrigger value="history">
              <Clock className="h-4 w-4 mr-2" />
              历史记录
            </TabsTrigger>
          </TabsList>

          <TabsContent value="realtime">
            {isDetecting ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>正在检测 GPU...</span>
                </div>
              </div>
            ) : (
              <RealTimeMonitor hasGpu={hasGpu} />
            )}
          </TabsContent>

          <TabsContent value="history">
            <HistoryMonitor hasGpu={hasGpu} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
