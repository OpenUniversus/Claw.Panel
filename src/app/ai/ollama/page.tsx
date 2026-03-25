'use client';

import { AppLayout } from '@/components/layout/layout-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  Play,
  Square,
  RefreshCw,
  Settings,
  Download,
  Trash2,
  Activity,
  Cpu,
  MemoryStick,
  HardDrive,
  Server,
  CheckCircle2,
  XCircle,
  Search,
  Clock,
  Zap,
  Copy,
  Terminal,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const ollamaStatus = {
  running: true,
  version: '0.1.32',
  uptime: 518400,
  baseUrl: 'http://localhost:11434',
  gpuEnabled: true,
  gpuMemory: '8 GB',
};

const models = [
  { 
    id: 1, 
    name: 'llama3:latest', 
    size: '4.7 GB', 
    family: 'llama',
    parameterSize: '8B',
    quantization: 'Q4_0',
    modified: '2024-03-20',
    status: 'loaded',
  },
  { 
    id: 2, 
    name: 'mistral:latest', 
    size: '4.1 GB', 
    family: 'mistral',
    parameterSize: '7B',
    quantization: 'Q4_0',
    modified: '2024-03-18',
    status: 'loaded',
  },
  { 
    id: 3, 
    name: 'codellama:latest', 
    size: '4.7 GB', 
    family: 'llama',
    parameterSize: '7B',
    quantization: 'Q4_0',
    modified: '2024-03-15',
    status: 'unloaded',
  },
  { 
    id: 4, 
    name: 'nomic-embed-text:latest', 
    size: '274 MB', 
    family: 'nomic',
    parameterSize: '137M',
    quantization: 'F16',
    modified: '2024-03-10',
    status: 'unloaded',
  },
];

const runningModels = [
  { model: 'llama3:latest', memory: '2.5 GB', requests: 156, avgLatency: '45ms' },
  { model: 'mistral:latest', memory: '2.2 GB', requests: 89, avgLatency: '38ms' },
];

const availableModels = [
  { name: 'llama3:70b', size: '40 GB', description: 'Meta Llama 3 70B参数版本' },
  { name: 'mixtral:8x7b', size: '26 GB', description: 'Mistral AI Mixtral 8x7B' },
  { name: 'gemma:7b', size: '5 GB', description: 'Google Gemma 7B' },
  { name: 'phi3:latest', size: '2.2 GB', description: 'Microsoft Phi-3 Mini' },
];

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  return `${days}天 ${hours}小时`;
}

function ModelStatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; text: string }> = {
    loaded: { color: 'bg-emerald-500', text: '已加载' },
    unloaded: { color: 'bg-gray-500', text: '未加载' },
    loading: { color: 'bg-amber-500', text: '加载中' },
  };
  return (
    <Badge variant="outline" className="gap-1">
      <span className={cn('h-2 w-2 rounded-full', config[status]?.color || 'bg-gray-500')} />
      {config[status]?.text || status}
    </Badge>
  );
}

export default function OllamaPage() {
  return (
    <AppLayout title="Ollama 管理">
      <div className="space-y-6">
        {/* 服务状态 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">服务状态</p>
                  <p className="text-xl font-semibold flex items-center gap-2">
                    {ollamaStatus.running ? (
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
                <Brain className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">版本</p>
                  <p className="text-xl font-semibold font-mono">{ollamaStatus.version}</p>
                </div>
                <Server className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">已加载模型</p>
                  <p className="text-xl font-semibold">{models.filter(m => m.status === 'loaded').length} 个</p>
                </div>
                <Cpu className="h-8 w-8 text-violet-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">GPU</p>
                  <p className="text-xl font-semibold">{ollamaStatus.gpuEnabled ? '已启用' : '未启用'}</p>
                </div>
                <Zap className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 运行中的模型 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              运行中的模型
            </CardTitle>
            <CardDescription>当前已加载到内存的模型</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>模型</TableHead>
                  <TableHead>内存占用</TableHead>
                  <TableHead>请求数</TableHead>
                  <TableHead>平均延迟</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {runningModels.map((model, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono">{model.model}</TableCell>
                    <TableCell>{model.memory}</TableCell>
                    <TableCell>{model.requests}</TableCell>
                    <TableCell>{model.avgLatency}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Square className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 详细设置 */}
        <Tabs defaultValue="models" className="space-y-4">
          <TabsList>
            <TabsTrigger value="models" className="gap-2">
              <Brain className="h-4 w-4" />
              模型列表
            </TabsTrigger>
            <TabsTrigger value="pull" className="gap-2">
              <Download className="h-4 w-4" />
              拉取模型
            </TabsTrigger>
            <TabsTrigger value="config" className="gap-2">
              <Settings className="h-4 w-4" />
              配置
            </TabsTrigger>
          </TabsList>

          {/* 模型列表 */}
          <TabsContent value="models">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>本地模型</CardTitle>
                    <CardDescription>已下载的大语言模型</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="搜索模型..." className="w-48" />
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      刷新
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>模型名称</TableHead>
                      <TableHead>参数规模</TableHead>
                      <TableHead>量化</TableHead>
                      <TableHead>大小</TableHead>
                      <TableHead>修改时间</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {models.map((model) => (
                      <TableRow key={model.id}>
                        <TableCell className="font-mono">{model.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{model.parameterSize}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{model.quantization}</TableCell>
                        <TableCell>{model.size}</TableCell>
                        <TableCell className="text-muted-foreground">{model.modified}</TableCell>
                        <TableCell>
                          <ModelStatusBadge status={model.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          {model.status === 'loaded' ? (
                            <Button variant="ghost" size="sm" title="卸载模型">
                              <Square className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" title="加载模型">
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" title="复制名称">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="删除模型" className="text-destructive">
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

          {/* 拉取模型 */}
          <TabsContent value="pull">
            <Card>
              <CardHeader>
                <CardTitle>拉取新模型</CardTitle>
                <CardDescription>从Ollama模型库下载模型</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-2">
                  <Input placeholder="输入模型名称，如: llama3:70b" className="flex-1 font-mono" />
                  <Button>
                    <Download className="h-4 w-4 mr-1" />
                    拉取
                  </Button>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">热门模型</p>
                  <div className="grid gap-3 md:grid-cols-2">
                    {availableModels.map((model) => (
                      <div key={model.name} className="flex items-center justify-between p-4 rounded-lg border">
                        <div>
                          <p className="font-mono font-medium">{model.name}</p>
                          <p className="text-sm text-muted-foreground">{model.description}</p>
                          <Badge variant="outline" className="mt-1">{model.size}</Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          拉取
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 配置 */}
          <TabsContent value="config">
            <Card>
              <CardHeader>
                <CardTitle>服务配置</CardTitle>
                <CardDescription>Ollama服务设置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">服务地址</p>
                    <p className="font-mono">{ollamaStatus.baseUrl}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">运行时间</p>
                    <p className="font-mono">{formatUptime(ollamaStatus.uptime)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">GPU加速</p>
                    <p className="font-mono">{ollamaStatus.gpuEnabled ? '已启用' : '未启用'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">GPU显存</p>
                    <p className="font-mono">{ollamaStatus.gpuMemory}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {ollamaStatus.running ? (
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
                    <Terminal className="h-4 w-4 mr-1" />
                    查看日志
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
