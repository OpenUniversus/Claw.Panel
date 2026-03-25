'use client';

import { AppLayout } from '@/components/layout/layout-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Container,
  Play,
  Square,
  RotateCcw,
  Trash2,
  Terminal,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Settings,
  Activity,
  Cpu,
  MemoryStick,
  Network,
  HardDrive,
  Image,
} from 'lucide-react';
import { getMockContainers, formatBytes } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function ContainerRow({
  container,
}: {
  container: {
    id: string;
    name: string;
    image: string;
    status: string;
    state: string;
    ports: string[];
    cpuPercent?: number;
    memoryUsage?: number;
    networkIO?: { rx: number; tx: number };
  };
}) {
  const statusConfig: Record<string, { color: string; label: string }> = {
    running: { color: 'bg-emerald-500', label: '运行中' },
    exited: { color: 'bg-gray-500', label: '已停止' },
    paused: { color: 'bg-amber-500', label: '已暂停' },
    restarting: { color: 'bg-blue-500', label: '重启中' },
  };

  const config = statusConfig[container.status] || { color: 'bg-gray-500', label: container.status };

  return (
    <TableRow className="group">
      <TableCell>
        <div className="flex items-center gap-3">
          <div className={cn('h-2 w-2 rounded-full', config.color)} />
          <div>
            <p className="font-medium">{container.name}</p>
            <p className="text-xs text-muted-foreground font-mono">
              {container.id.slice(0, 12)}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="font-mono text-xs">
          {container.image}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge
          variant={container.status === 'running' ? 'default' : 'secondary'}
          className="gap-1"
        >
          {config.label}
        </Badge>
        <p className="text-xs text-muted-foreground mt-1">{container.state}</p>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {container.ports.slice(0, 3).map((port) => (
            <Badge key={port} variant="outline" className="text-xs font-mono">
              {port}
            </Badge>
          ))}
          {container.ports.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{container.ports.length - 3}
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1 text-xs">
          {container.cpuPercent !== undefined && (
            <div className="flex items-center gap-2">
              <Cpu className="h-3 w-3 text-muted-foreground" />
              <span>{container.cpuPercent.toFixed(1)}%</span>
            </div>
          )}
          {container.memoryUsage !== undefined && (
            <div className="flex items-center gap-2">
              <MemoryStick className="h-3 w-3 text-muted-foreground" />
              <span>{formatBytes(container.memoryUsage)}</span>
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>操作</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {container.status === 'running' ? (
                <>
                  <DropdownMenuItem>
                    <Square className="h-4 w-4 mr-2" />
                    停止
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    重启
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Terminal className="h-4 w-4 mr-2" />
                    终端
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem>
                  <Play className="h-4 w-4 mr-2" />
                  启动
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function ContainersPage() {
  const containers = getMockContainers();
  const [searchTerm, setSearchTerm] = useState('');

  const runningCount = containers.filter((c) => c.status === 'running').length;
  const stoppedCount = containers.filter((c) => c.status === 'exited').length;

  const filteredContainers = containers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.image.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout title="容器管理">
      <div className="space-y-6">
        {/* 统计卡片 */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg p-3 bg-blue-500/10 text-blue-500">
                  <Container className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">总容器</p>
                  <p className="text-2xl font-bold">{containers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg p-3 bg-emerald-500/10 text-emerald-500">
                  <Play className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">运行中</p>
                  <p className="text-2xl font-bold">{runningCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg p-3 bg-gray-500/10 text-gray-500">
                  <Square className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">已停止</p>
                  <p className="text-2xl font-bold">{stoppedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg p-3 bg-purple-500/10 text-purple-500">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">总内存</p>
                  <p className="text-2xl font-bold">
                    {formatBytes(
                      containers.reduce((sum, c) => sum + (c.memoryUsage || 0), 0)
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 标签页 */}
        <Tabs defaultValue="containers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="containers">
              <Container className="h-4 w-4 mr-2" />
              容器
            </TabsTrigger>
            <TabsTrigger value="images">
              <Image className="h-4 w-4 mr-2" />
              镜像
            </TabsTrigger>
            <TabsTrigger value="networks">
              <Network className="h-4 w-4 mr-2" />
              网络
            </TabsTrigger>
            <TabsTrigger value="volumes">
              <HardDrive className="h-4 w-4 mr-2" />
              存储卷
            </TabsTrigger>
          </TabsList>

          <TabsContent value="containers">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>容器列表</CardTitle>
                    <CardDescription>管理 Docker 容器</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="搜索容器..."
                        className="w-64 pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      创建容器
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>名称</TableHead>
                      <TableHead>镜像</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>端口</TableHead>
                      <TableHead>资源</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContainers.map((container) => (
                      <ContainerRow key={container.id} container={container} />
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>镜像列表</CardTitle>
                    <CardDescription>管理 Docker 镜像</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      拉取镜像
                    </Button>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      导入镜像
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'nginx', tag: 'latest', size: '142 MB', created: '2024-03-15' },
                    { name: 'mysql', tag: '8.0', size: '577 MB', created: '2024-03-10' },
                    { name: 'redis', tag: 'alpine', size: '40 MB', created: '2024-03-08' },
                    { name: 'openclaw/openclaw', tag: 'latest', size: '1.2 GB', created: '2024-03-19' },
                    { name: 'ollama/ollama', tag: 'latest', size: '680 MB', created: '2024-03-19' },
                  ].map((image, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex items-center gap-4">
                        <Image className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{image.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {image.created}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{image.tag}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {image.size}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>创建容器</DropdownMenuItem>
                            <DropdownMenuItem>导出镜像</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              删除镜像
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="networks">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>网络列表</CardTitle>
                    <CardDescription>管理 Docker 网络</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    创建网络
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>名称</TableHead>
                      <TableHead>驱动</TableHead>
                      <TableHead>作用域</TableHead>
                      <TableHead>子网</TableHead>
                      <TableHead>网关</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { name: 'bridge', driver: 'bridge', scope: 'local', subnet: '172.17.0.0/16', gateway: '172.17.0.1' },
                      { name: 'host', driver: 'host', scope: 'local', subnet: '-', gateway: '-' },
                      { name: 'none', driver: 'null', scope: 'local', subnet: '-', gateway: '-' },
                      { name: 'openclaw_network', driver: 'bridge', scope: 'local', subnet: '172.18.0.0/16', gateway: '172.18.0.1' },
                    ].map((network, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{network.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{network.driver}</Badge>
                        </TableCell>
                        <TableCell>{network.scope}</TableCell>
                        <TableCell className="font-mono text-xs">{network.subnet}</TableCell>
                        <TableCell className="font-mono text-xs">{network.gateway}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
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

          <TabsContent value="volumes">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>存储卷列表</CardTitle>
                    <CardDescription>管理 Docker 存储卷</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    创建存储卷
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'mysql_data', driver: 'local', mountpoint: '/var/lib/docker/volumes/mysql_data/_data', size: '50 GB' },
                    { name: 'redis_data', driver: 'local', mountpoint: '/var/lib/docker/volumes/redis_data/_data', size: '512 MB' },
                    { name: 'openclaw_data', driver: 'local', mountpoint: '/var/lib/docker/volumes/openclaw_data/_data', size: '2 GB' },
                    { name: 'ollama_models', driver: 'local', mountpoint: '/var/lib/docker/volumes/ollama_models/_data', size: '15 GB' },
                  ].map((volume, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex items-center gap-4">
                        <HardDrive className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{volume.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {volume.mountpoint}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{volume.driver}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {volume.size}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>浏览文件</DropdownMenuItem>
                            <DropdownMenuItem>备份</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              删除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
