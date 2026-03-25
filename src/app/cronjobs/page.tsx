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
  Clock,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Calendar,
  CheckCircle2,
  XCircle,
  Activity,
  FileText,
  LogOut,
} from 'lucide-react';
import { getMockCronJobs } from '@/lib/mock-data';
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
import { Textarea } from '@/components/ui/textarea';

export default function CronJobsPage() {
  const cronJobs = getMockCronJobs();
  const [searchTerm, setSearchTerm] = useState('');

  const enabledCount = cronJobs.filter((j) => j.status === 'enabled').length;

  const filteredJobs = cronJobs.filter(
    (j) =>
      j.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.command.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout title="计划任务">
      <div className="space-y-6">
        {/* 统计卡片 */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg p-3 bg-blue-500/10 text-blue-500">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">总任务</p>
                  <p className="text-2xl font-bold">{cronJobs.length}</p>
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
                  <p className="text-sm text-muted-foreground">已启用</p>
                  <p className="text-2xl font-bold">{enabledCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg p-3 bg-amber-500/10 text-amber-500">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">今日执行</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg p-3 bg-purple-500/10 text-purple-500">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">成功率</p>
                  <p className="text-2xl font-bold">98%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 任务列表 */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>计划任务</CardTitle>
                <CardDescription>管理系统定时任务</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索任务..."
                    className="w-64 pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      创建任务
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>创建计划任务</DialogTitle>
                      <DialogDescription>
                        配置新的定时任务
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          名称
                        </Label>
                        <Input id="name" placeholder="任务名称" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="schedule" className="text-right">
                          计划
                        </Label>
                        <Input
                          id="schedule"
                          placeholder="0 2 * * *"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="command" className="text-right">
                          命令
                        </Label>
                        <Textarea
                          id="command"
                          placeholder="/usr/local/bin/script.sh"
                          className="col-span-3"
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">创建</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>名称</TableHead>
                  <TableHead>计划</TableHead>
                  <TableHead>命令</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>上次执行</TableHead>
                  <TableHead>下次执行</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'h-2 w-2 rounded-full',
                            job.status === 'enabled' ? 'bg-emerald-500' : 'bg-gray-400'
                          )}
                        />
                        <div>
                          <p className="font-medium">{job.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {job.schedule}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {job.command}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={job.status === 'enabled' ? 'default' : 'secondary'}
                        className="gap-1"
                      >
                        {job.status === 'enabled' ? (
                          <>
                            <Play className="h-3 w-3" />
                            已启用
                          </>
                        ) : (
                          <>
                            <Pause className="h-3 w-3" />
                            已禁用
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {job.lastRun ? (
                          <>
                            <span className="text-sm">
                              {new Date(job.lastRun).toLocaleString('zh-CN')}
                            </span>
                            {job.lastStatus === 'success' ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {job.nextRun
                        ? new Date(job.nextRun).toLocaleString('zh-CN')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>操作</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Play className="h-4 w-4 mr-2" />
                            立即执行
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            查看日志
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="h-4 w-4 mr-2" />
                            编辑
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {job.status === 'enabled' ? (
                            <DropdownMenuItem>
                              <Pause className="h-4 w-4 mr-2" />
                              禁用
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>
                              <Play className="h-4 w-4 mr-2" />
                              启用
                            </DropdownMenuItem>
                          )}
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

        {/* Cron 表达式说明 */}
        <Card>
          <CardHeader>
            <CardTitle>Cron 表达式说明</CardTitle>
            <CardDescription>定时任务计划表达式格式</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">格式: 分 时 日 月 周</p>
                <code className="block bg-muted p-3 rounded text-sm">
                  * * * * *
                  <br />
                  │ │ │ │ │
                  <br />
                  │ │ │ │ └─ 周几 (0-7, 0和7表示周日)
                  <br />
                  │ │ │ └─── 月份 (1-12)
                  <br />
                  │ │ └───── 日期 (1-31)
                  <br />
                  │ └─────── 小时 (0-23)
                  <br />
                  └───────── 分钟 (0-59)
                </code>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">常用示例</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <code className="bg-muted px-2 py-0.5 rounded">0 2 * * *</code>
                    <span className="text-muted-foreground">每天凌晨2点</span>
                  </div>
                  <div className="flex justify-between">
                    <code className="bg-muted px-2 py-0.5 rounded">*/30 * * * *</code>
                    <span className="text-muted-foreground">每30分钟</span>
                  </div>
                  <div className="flex justify-between">
                    <code className="bg-muted px-2 py-0.5 rounded">0 0 * * 0</code>
                    <span className="text-muted-foreground">每周日凌晨</span>
                  </div>
                  <div className="flex justify-between">
                    <code className="bg-muted px-2 py-0.5 rounded">0 0 1 * *</code>
                    <span className="text-muted-foreground">每月1号凌晨</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
