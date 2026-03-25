'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/layout-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Settings,
  Trash2,
  Shield,
  Bug,
  FolderSync,
  Lock,
  Server,
  Globe,
  Clock,
  Key,
  HardDrive,
  MemoryStick,
  RefreshCw,
  Play,
  Square,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Upload,
  Download,
  Eye,
  EyeOff,
  Plus,
  Edit,
  Power,
  FileText,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

// 快速设置配置项
const quickSettings = [
  {
    id: 'dns',
    name: 'DNS',
    description: '服务器地址域名解析',
    value: '114.114.114.114, 8.8.8.8',
    icon: Globe,
  },
  {
    id: 'hosts',
    name: 'Hosts',
    description: '主机名解析',
    value: '12 条记录',
    icon: FileText,
  },
  {
    id: 'swap',
    name: 'Swap',
    description: '虚拟内存大小',
    value: '4 GB',
    icon: MemoryStick,
  },
  {
    id: 'hostname',
    name: '主机名',
    description: '服务器主机名',
    value: 'clawpanel-server',
    icon: Server,
  },
  {
    id: 'password',
    name: '系统密码',
    description: '服务器管理员密码',
    value: '********',
    icon: Key,
  },
  {
    id: 'ntp',
    name: 'NTP服务器',
    description: '网络时间同步服务器',
    value: 'pool.ntp.org',
    icon: Clock,
  },
  {
    id: 'timezone',
    name: '系统时区',
    description: '服务器所在时区',
    value: 'Asia/Shanghai',
    icon: Globe,
  },
  {
    id: 'time',
    name: '服务器时间',
    description: '当前系统时间',
    value: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
    icon: Clock,
  },
];

// 缓存清理
const cacheItems = [
  { id: 1, name: '系统缓存', path: '/var/cache', size: '256 MB', lastClean: '1天前' },
  { id: 2, name: 'APT缓存', path: '/var/cache/apt', size: '128 MB', lastClean: '3天前' },
  { id: 3, name: 'Docker镜像缓存', path: '/var/lib/docker/tmp', size: '2.1 GB', lastClean: '7天前' },
  { id: 4, name: '日志文件', path: '/var/log', size: '512 MB', lastClean: '2天前' },
  { id: 5, name: '临时文件', path: '/tmp', size: '64 MB', lastClean: '1天前' },
  { id: 6, name: '浏览器缓存', path: '/root/.cache', size: '32 MB', lastClean: '5天前' },
];

// 进程守护
const daemonProcesses = [
  { id: 1, name: 'nginx', status: 'running', pid: 1234, memory: '45 MB', cpu: '0.5%', uptime: '5天', autoStart: true },
  { id: 2, name: 'mysql', status: 'running', pid: 2345, memory: '512 MB', cpu: '2.3%', uptime: '5天', autoStart: true },
  { id: 3, name: 'redis', status: 'running', pid: 3456, memory: '30 MB', cpu: '0.2%', uptime: '5天', autoStart: true },
  { id: 4, name: 'openclaw', status: 'running', pid: 4567, memory: '256 MB', cpu: '1.2%', uptime: '3天', autoStart: true },
  { id: 5, name: 'ollama', status: 'running', pid: 5678, memory: '8 GB', cpu: '5.5%', uptime: '2天', autoStart: true },
  { id: 6, name: 'backup-service', status: 'stopped', pid: null, memory: '-', cpu: '-', uptime: '-', autoStart: false },
];

// 病毒扫描
const scanHistory = [
  { id: 1, date: '2024-03-25 10:00', files: 125680, infected: 0, status: 'completed', duration: '45分钟' },
  { id: 2, date: '2024-03-24 10:00', files: 125450, infected: 2, status: 'completed', duration: '43分钟' },
  { id: 3, date: '2024-03-23 10:00', files: 125200, infected: 0, status: 'completed', duration: '42分钟' },
];

// FTP 用户
const ftpUsers = [
  { id: 1, username: 'admin', home: '/home/admin', status: 'active', created: '2024-01-01', lastLogin: '2024-03-25' },
  { id: 2, username: 'backup', home: '/backup', status: 'active', created: '2024-02-15', lastLogin: '2024-03-24' },
  { id: 3, username: 'webmaster', home: '/var/www', status: 'inactive', created: '2024-02-20', lastLogin: '2024-03-10' },
];

// Fail2ban 配置
const fail2banJails = [
  { id: 1, name: 'ssh', enabled: true, banned: 15, maxRetry: 5, findTime: '10分钟', banTime: '1小时' },
  { id: 2, name: 'nginx-http-auth', enabled: true, banned: 8, maxRetry: 3, findTime: '10分钟', banTime: '1小时' },
  { id: 3, name: 'nginx-limit-req', enabled: true, banned: 23, maxRetry: 10, findTime: '1分钟', banTime: '10分钟' },
  { id: 4, name: 'mysql', enabled: false, banned: 0, maxRetry: 5, findTime: '10分钟', banTime: '1小时' },
];

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; text: string }> = {
    running: { color: 'bg-emerald-500', text: '运行中' },
    stopped: { color: 'bg-gray-500', text: '已停止' },
    active: { color: 'bg-emerald-500', text: '启用' },
    inactive: { color: 'bg-gray-500', text: '禁用' },
    completed: { color: 'bg-emerald-500', text: '已完成' },
  };
  return (
    <Badge variant="outline" className="gap-1">
      <span className={cn('h-2 w-2 rounded-full', config[status]?.color || 'bg-gray-500')} />
      {config[status]?.text || status}
    </Badge>
  );
}

export default function ToolboxPage() {
  const [activeTab, setActiveTab] = useState('quick');
  const [editDialog, setEditDialog] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [scanProgress, setScanProgress] = useState<number | null>(null);

  // 快速设置操作
  const handleQuickSetting = (id: string, value: string) => {
    setEditDialog(id);
    setEditValue(value);
  };

  const saveQuickSetting = () => {
    console.log('Saving:', editDialog, editValue);
    setEditDialog(null);
  };

  // 时间同步
  const syncTime = () => {
    console.log('Syncing time with NTP server...');
  };

  // 清理缓存
  const cleanCache = (id: number) => {
    console.log('Cleaning cache:', id);
  };

  const cleanAllCache = () => {
    console.log('Cleaning all cache...');
  };

  // 进程操作
  const toggleProcess = (id: number, action: 'start' | 'stop' | 'restart') => {
    console.log('Process action:', id, action);
  };

  // 病毒扫描
  const startScan = () => {
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev === null || prev >= 100) {
          clearInterval(interval);
          return null;
        }
        return prev + 1;
      });
    }, 100);
  };

  return (
    <AppLayout title="工具箱">
      <div className="space-y-4">
        {/* 标签栏 */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="quick">快速设置</TabsTrigger>
              <TabsTrigger value="cache">缓存清理</TabsTrigger>
              <TabsTrigger value="daemon">进程守护</TabsTrigger>
              <TabsTrigger value="antivirus">病毒扫描</TabsTrigger>
              <TabsTrigger value="ftp">FTP</TabsTrigger>
              <TabsTrigger value="fail2ban">Fail2ban</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-1" />
                重启面板
              </Button>
              <Button variant="outline" size="sm">
                <Power className="h-4 w-4 mr-1" />
                重启服务器
              </Button>
            </div>
          </div>

          {/* 快速设置 */}
          <TabsContent value="quick" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>快速设置</CardTitle>
                <CardDescription>系统基础配置管理</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">配置项</TableHead>
                      <TableHead>当前值</TableHead>
                      <TableHead className="w-[120px]">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quickSettings.map((setting) => {
                      const Icon = setting.icon;
                      return (
                        <TableRow key={setting.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="rounded-lg bg-muted p-2">
                                <Icon className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="font-medium">{setting.name}</p>
                                <p className="text-xs text-muted-foreground">{setting.description}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="bg-muted/50 rounded px-3 py-1.5 text-sm font-mono">
                              {setting.id === 'password' ? (
                                <span className="flex items-center gap-2">
                                  {showPassword ? 'Admin@123' : '********'}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 w-5 p-0"
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                  </Button>
                                </span>
                              ) : (
                                setting.value
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {setting.id === 'time' ? (
                              <Button size="sm" onClick={syncTime}>
                                <RefreshCw className="h-4 w-4 mr-1" />
                                同步
                              </Button>
                            ) : (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleQuickSetting(setting.id, setting.value)}
                              >
                                <Settings className="h-4 w-4 mr-1" />
                                设置
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 缓存清理 */}
          <TabsContent value="cache" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>缓存清理</CardTitle>
                    <CardDescription>管理系统缓存，释放磁盘空间</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      刷新
                    </Button>
                    <Button size="sm" onClick={cleanAllCache}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      全部清理
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>缓存名称</TableHead>
                      <TableHead>路径</TableHead>
                      <TableHead>大小</TableHead>
                      <TableHead>上次清理</TableHead>
                      <TableHead className="w-[100px]">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cacheItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">{item.path}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{item.size}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{item.lastClean}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" onClick={() => cleanCache(item.id)}>
                            <Trash2 className="h-4 w-4 mr-1" />
                            清理
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 进程守护 */}
          <TabsContent value="daemon" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>进程守护</CardTitle>
                    <CardDescription>管理系统服务进程</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    添加进程
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>进程名称</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>PID</TableHead>
                      <TableHead>内存</TableHead>
                      <TableHead>CPU</TableHead>
                      <TableHead>运行时间</TableHead>
                      <TableHead>自启动</TableHead>
                      <TableHead className="w-[180px]">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {daemonProcesses.map((process) => (
                      <TableRow key={process.id}>
                        <TableCell className="font-medium">{process.name}</TableCell>
                        <TableCell>
                          <StatusBadge status={process.status} />
                        </TableCell>
                        <TableCell className="font-mono">{process.pid || '-'}</TableCell>
                        <TableCell>{process.memory}</TableCell>
                        <TableCell>{process.cpu}</TableCell>
                        <TableCell>{process.uptime}</TableCell>
                        <TableCell>
                          <Switch checked={process.autoStart} />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {process.status === 'running' ? (
                              <>
                                <Button size="sm" variant="outline" onClick={() => toggleProcess(process.id, 'restart')}>
                                  <RefreshCw className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => toggleProcess(process.id, 'stop')}>
                                  <Square className="h-3 w-3" />
                                </Button>
                              </>
                            ) : (
                              <Button size="sm" variant="outline" onClick={() => toggleProcess(process.id, 'start')}>
                                <Play className="h-3 w-3" />
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              <Settings className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 病毒扫描 */}
          <TabsContent value="antivirus" className="mt-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>病毒扫描</CardTitle>
                  <CardDescription>扫描系统文件，检测恶意软件</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Button onClick={startScan} disabled={scanProgress !== null}>
                      <Bug className="h-4 w-4 mr-2" />
                      {scanProgress !== null ? '扫描中...' : '开始扫描'}
                    </Button>
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      扫描设置
                    </Button>
                  </div>
                  
                  {scanProgress !== null && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>扫描进度</span>
                        <span>{scanProgress}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-100" 
                          style={{ width: `${scanProgress}%` }} 
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        已扫描 125,680 个文件...
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">扫描历史</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>扫描时间</TableHead>
                          <TableHead>文件数</TableHead>
                          <TableHead>感染数</TableHead>
                          <TableHead>耗时</TableHead>
                          <TableHead>状态</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scanHistory.map((scan) => (
                          <TableRow key={scan.id}>
                            <TableCell>{scan.date}</TableCell>
                            <TableCell>{scan.files.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant={scan.infected > 0 ? 'destructive' : 'secondary'}>
                                {scan.infected}
                              </Badge>
                            </TableCell>
                            <TableCell>{scan.duration}</TableCell>
                            <TableCell>
                              <StatusBadge status={scan.status} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>扫描统计</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      <span className="text-sm">上次扫描</span>
                    </div>
                    <span className="font-medium">1天前</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <span className="text-sm">已扫描文件</span>
                    </div>
                    <span className="font-medium">125,680</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-violet-500" />
                      <span className="text-sm">病毒库版本</span>
                    </div>
                    <span className="font-medium">v2024.03.25</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-amber-500" />
                      <span className="text-sm">上次更新</span>
                    </div>
                    <span className="font-medium">2小时前</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* FTP */}
          <TabsContent value="ftp" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>FTP 管理</CardTitle>
                    <CardDescription>管理 FTP 用户和权限</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">FTP 服务</span>
                      <Switch defaultChecked />
                    </div>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      添加用户
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>用户名</TableHead>
                      <TableHead>主目录</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>创建时间</TableHead>
                      <TableHead>最后登录</TableHead>
                      <TableHead className="w-[150px]">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ftpUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell className="font-mono text-sm">{user.home}</TableCell>
                        <TableCell>
                          <StatusBadge status={user.status} />
                        </TableCell>
                        <TableCell className="text-muted-foreground">{user.created}</TableCell>
                        <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Key className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-destructive">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fail2ban */}
          <TabsContent value="fail2ban" className="mt-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Fail2ban 管理</CardTitle>
                      <CardDescription>入侵防御系统配置</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">服务状态</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>监狱名称</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>封禁数</TableHead>
                        <TableHead>最大重试</TableHead>
                        <TableHead>检测时间</TableHead>
                        <TableHead>封禁时长</TableHead>
                        <TableHead className="w-[80px]">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fail2banJails.map((jail) => (
                        <TableRow key={jail.id}>
                          <TableCell className="font-medium">{jail.name}</TableCell>
                          <TableCell>
                            <Switch checked={jail.enabled} />
                          </TableCell>
                          <TableCell>
                            <Badge variant={jail.banned > 0 ? 'destructive' : 'secondary'}>
                              {jail.banned}
                            </Badge>
                          </TableCell>
                          <TableCell>{jail.maxRetry} 次</TableCell>
                          <TableCell>{jail.findTime}</TableCell>
                          <TableCell>{jail.banTime}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              <Settings className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>统计信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-emerald-500" />
                      <span className="text-sm">服务状态</span>
                    </div>
                    <StatusBadge status="running" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-red-500" />
                      <span className="text-sm">总封禁 IP</span>
                    </div>
                    <span className="font-medium">46</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-500" />
                      <span className="text-sm">活跃监狱</span>
                    </div>
                    <span className="font-medium">3 / 4</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-amber-500" />
                      <span className="text-sm">运行时间</span>
                    </div>
                    <span className="font-medium">5天</span>
                  </div>

                  <div className="pt-4 border-t">
                    <Button variant="outline" className="w-full" size="sm">
                      查看封禁列表
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* 编辑对话框 */}
        <Dialog open={editDialog !== null} onOpenChange={() => setEditDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>修改设置</DialogTitle>
              <DialogDescription>
                修改 {editDialog} 配置
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>新值</Label>
                {editDialog === 'hosts' ? (
                  <Textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    rows={8}
                    className="font-mono"
                  />
                ) : (
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="font-mono"
                  />
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialog(null)}>
                取消
              </Button>
              <Button onClick={saveQuickSetting}>保存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
