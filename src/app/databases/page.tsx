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
  Database,
  Play,
  Square,
  RotateCcw,
  Trash2,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Archive,
  Download,
  Upload,
  Key,
  Users,
  Activity,
  HardDrive,
  Server,
  Clock,
} from 'lucide-react';
import { getMockDatabases, formatBytes } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const dbTypeConfig: Record<string, { color: string; icon: typeof Database }> = {
  mysql: { color: 'text-blue-500', icon: Database },
  postgresql: { color: 'text-indigo-500', icon: Database },
  redis: { color: 'text-red-500', icon: Database },
  mongodb: { color: 'text-emerald-500', icon: Database },
};

function DatabaseCard({
  database,
}: {
  database: {
    id: string;
    name: string;
    type: string;
    version: string;
    status: string;
    port: number;
    containerName?: string;
    databases: string[];
    size: number;
  };
}) {
  const config = dbTypeConfig[database.type] || { color: 'text-gray-500', icon: Database };
  const Icon = config.icon;

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('rounded-lg p-2 bg-muted', config.color)}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{database.name}</CardTitle>
              <CardDescription>
                {database.type.toUpperCase()} {database.version}
              </CardDescription>
            </div>
          </div>
          <Badge
            variant={database.status === 'running' ? 'default' : 'secondary'}
            className="gap-1"
          >
            {database.status === 'running' ? (
              <>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                运行中
              </>
            ) : (
              '已停止'
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">端口</span>
            <span className="font-mono">{database.port}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">容器</span>
            <span className="font-mono">{database.containerName || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">数据大小</span>
            <span>{formatBytes(database.size)}</span>
          </div>
          {database.databases.length > 0 && (
            <div className="flex justify-between items-start">
              <span className="text-muted-foreground">数据库</span>
              <div className="flex flex-wrap gap-1 justify-end max-w-[200px]">
                {database.databases.map((db) => (
                  <Badge key={db} variant="outline" className="text-xs">
                    {db}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-4 pt-4 border-t">
          {database.status === 'running' ? (
            <>
              <Button variant="outline" size="sm" className="flex-1">
                <Settings className="h-4 w-4 mr-1" />
                管理
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Archive className="h-4 w-4 mr-1" />
                备份
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" className="flex-1">
              <Play className="h-4 w-4 mr-1" />
              启动
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>操作</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {database.status === 'running' ? (
                <>
                  <DropdownMenuItem>
                    <Key className="h-4 w-4 mr-2" />
                    修改密码
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Users className="h-4 w-4 mr-2" />
                    权限管理
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    重启
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Square className="h-4 w-4 mr-2" />
                    停止
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
      </CardContent>
    </Card>
  );
}

export default function DatabasesPage() {
  const databases = getMockDatabases();
  const [searchTerm, setSearchTerm] = useState('');

  const runningCount = databases.filter((d) => d.status === 'running').length;
  const totalSize = databases.reduce((sum, d) => sum + d.size, 0);

  return (
    <AppLayout title="数据库管理">
      <div className="space-y-6">
        {/* 统计卡片 */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg p-3 bg-blue-500/10 text-blue-500">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">总数据库</p>
                  <p className="text-2xl font-bold">{databases.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg p-3 bg-emerald-500/10 text-emerald-500">
                  <Activity className="h-5 w-5" />
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
                <div className="rounded-lg p-3 bg-purple-500/10 text-purple-500">
                  <HardDrive className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">总大小</p>
                  <p className="text-2xl font-bold">{formatBytes(totalSize)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg p-3 bg-amber-500/10 text-amber-500">
                  <Archive className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">今日备份</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 标签页 */}
        <Tabs defaultValue="databases" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="databases">
                <Database className="h-4 w-4 mr-2" />
                数据库
              </TabsTrigger>
              <TabsTrigger value="backups">
                <Archive className="h-4 w-4 mr-2" />
                备份
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索数据库..."
                  className="w-64 pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    创建数据库
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>创建数据库</DialogTitle>
                    <DialogDescription>
                      选择数据库类型并配置基本信息
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">
                        类型
                      </Label>
                      <select
                        id="type"
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="mysql">MySQL</option>
                        <option value="postgresql">PostgreSQL</option>
                        <option value="redis">Redis</option>
                        <option value="mongodb">MongoDB</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        名称
                      </Label>
                      <Input id="name" placeholder="my-database" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="version" className="text-right">
                        版本
                      </Label>
                      <select
                        id="version"
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="8.0">8.0</option>
                        <option value="5.7">5.7</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="port" className="text-right">
                        端口
                      </Label>
                      <Input id="port" type="number" placeholder="3306" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="password" className="text-right">
                        密码
                      </Label>
                      <Input id="password" type="password" className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">创建</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <TabsContent value="databases">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {databases
                .filter(
                  (d) =>
                    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    d.type.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((database) => (
                  <DatabaseCard key={database.id} database={database} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="backups">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>备份列表</CardTitle>
                    <CardDescription>数据库备份记录</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      上传备份
                    </Button>
                    <Button>
                      <Archive className="h-4 w-4 mr-2" />
                      创建备份
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>文件名</TableHead>
                      <TableHead>数据库</TableHead>
                      <TableHead>大小</TableHead>
                      <TableHead>创建时间</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        name: 'mysql_backup_20240320.sql.gz',
                        db: 'MySQL 主数据库',
                        size: '256 MB',
                        time: '2024-03-20 02:00',
                        status: 'success',
                      },
                      {
                        name: 'postgres_backup_20240320.dump',
                        db: 'PostgreSQL 分析库',
                        size: '1.2 GB',
                        time: '2024-03-20 02:15',
                        status: 'success',
                      },
                      {
                        name: 'redis_backup_20240320.rdb',
                        db: 'Redis 缓存',
                        size: '128 MB',
                        time: '2024-03-20 02:30',
                        status: 'success',
                      },
                      {
                        name: 'mysql_backup_20240319.sql.gz',
                        db: 'MySQL 主数据库',
                        size: '248 MB',
                        time: '2024-03-19 02:00',
                        status: 'success',
                      },
                    ].map((backup, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-mono text-xs">
                          {backup.name}
                        </TableCell>
                        <TableCell>{backup.db}</TableCell>
                        <TableCell>{backup.size}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {backup.time}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={backup.status === 'success' ? 'default' : 'destructive'}
                            className="gap-1"
                          >
                            {backup.status === 'success' ? '成功' : '失败'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                下载
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <RotateCcw className="h-4 w-4 mr-2" />
                                恢复
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                删除
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
