'use client';

import { AppLayout } from '@/components/layout/layout-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Settings,
  User,
  Shield,
  Palette,
  Globe,
  Bell,
  Database,
  Server,
  Key,
  Clock,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Save,
  Monitor,
  Moon,
  Sun,
} from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SettingsPage() {
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState('zh-CN');

  return (
    <AppLayout title="面板设置">
      <div className="space-y-6">
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">
              <Settings className="h-4 w-4 mr-2" />
              常规
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              安全
            </TabsTrigger>
            <TabsTrigger value="backup">
              <Database className="h-4 w-4 mr-2" />
              备份
            </TabsTrigger>
            <TabsTrigger value="about">
              <Server className="h-4 w-4 mr-2" />
              关于
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            {/* 外观设置 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  外观设置
                </CardTitle>
                <CardDescription>自定义面板外观</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>主题</Label>
                    <p className="text-sm text-muted-foreground">选择面板的主题模式</p>
                  </div>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          浅色
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          深色
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4" />
                          跟随系统
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>语言</Label>
                    <p className="text-sm text-muted-foreground">选择界面语言</p>
                  </div>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zh-CN">简体中文</SelectItem>
                      <SelectItem value="zh-TW">繁體中文</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* 服务器设置 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  服务器设置
                </CardTitle>
                <CardDescription>面板服务器配置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="port">服务端口</Label>
                    <Input id="port" type="number" defaultValue="5000" />
                    <p className="text-xs text-muted-foreground">
                      面板监听的端口，修改后需重启
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bind">绑定地址</Label>
                    <Input id="bind" defaultValue="0.0.0.0" />
                    <p className="text-xs text-muted-foreground">
                      监听的网络接口
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>会话超时</Label>
                    <p className="text-sm text-muted-foreground">
                      无操作自动登出时间（分钟）
                    </p>
                  </div>
                  <Input type="number" className="w-24" defaultValue="30" />
                </div>
              </CardContent>
            </Card>

            {/* 通知设置 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  通知设置
                </CardTitle>
                <CardDescription>系统通知配置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>系统通知</Label>
                    <p className="text-sm text-muted-foreground">
                      接收系统事件通知
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>安全告警</Label>
                    <p className="text-sm text-muted-foreground">
                      异常登录、安全事件告警
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>资源告警</Label>
                    <p className="text-sm text-muted-foreground">
                      CPU、内存、磁盘使用率告警
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>应用更新通知</Label>
                    <p className="text-sm text-muted-foreground">
                      应用有新版本时通知
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            {/* 账户安全 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  账户设置
                </CardTitle>
                <CardDescription>管理登录账户</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">用户名</p>
                    <p className="text-sm text-muted-foreground">admin</p>
                  </div>
                  <Button variant="outline">修改</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">密码</p>
                    <p className="text-sm text-muted-foreground">上次修改: 2024-03-01</p>
                  </div>
                  <Button variant="outline">修改密码</Button>
                </div>
              </CardContent>
            </Card>

            {/* 安全设置 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  安全设置
                </CardTitle>
                <CardDescription>增强面板安全性</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>安全入口</Label>
                    <p className="text-sm text-muted-foreground">
                      自定义登录入口路径
                    </p>
                  </div>
                  <Input className="w-48" defaultValue="/admin" />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>两步验证</Label>
                    <p className="text-sm text-muted-foreground">
                      启用 TOTP 两步验证
                    </p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>IP 白名单</Label>
                    <p className="text-sm text-muted-foreground">
                      限制可访问的 IP 地址
                    </p>
                  </div>
                  <Button variant="outline">配置</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>防爆破</Label>
                    <p className="text-sm text-muted-foreground">
                      登录失败次数限制
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input type="number" className="w-20" defaultValue="5" />
                    <span className="text-sm text-muted-foreground">次后锁定</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API 密钥 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API 密钥
                </CardTitle>
                <CardDescription>管理 API 访问密钥</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium font-mono">sk-****...****abcd</p>
                      <p className="text-sm text-muted-foreground">
                        创建于 2024-01-15
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">复制</Button>
                      <Button variant="outline" size="sm" className="text-red-600">
                        删除
                      </Button>
                    </div>
                  </div>
                  <Button>
                    <Key className="h-4 w-4 mr-2" />
                    生成新密钥
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup" className="space-y-4">
            {/* 备份设置 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  备份设置
                </CardTitle>
                <CardDescription>配置自动备份</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>自动备份</Label>
                    <p className="text-sm text-muted-foreground">
                      定期自动备份面板配置
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>备份频率</Label>
                    <p className="text-sm text-muted-foreground">
                      自动备份间隔
                    </p>
                  </div>
                  <Select defaultValue="daily">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">每天</SelectItem>
                      <SelectItem value="weekly">每周</SelectItem>
                      <SelectItem value="monthly">每月</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>保留数量</Label>
                    <p className="text-sm text-muted-foreground">
                      最大保留备份数
                    </p>
                  </div>
                  <Input type="number" className="w-24" defaultValue="7" />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>备份路径</Label>
                  <Input defaultValue="/opt/clawpanel/backup" />
                </div>
              </CardContent>
            </Card>

            {/* 备份操作 */}
            <Card>
              <CardHeader>
                <CardTitle>备份操作</CardTitle>
                <CardDescription>手动备份与恢复</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    立即备份
                  </Button>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    恢复备份
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    下载备份
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 备份列表 */}
            <Card>
              <CardHeader>
                <CardTitle>备份历史</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { name: 'backup-2024-03-20.zip', size: '15.2 MB', time: '2024-03-20 02:00' },
                    { name: 'backup-2024-03-19.zip', size: '14.8 MB', time: '2024-03-19 02:00' },
                    { name: 'backup-2024-03-18.zip', size: '14.5 MB', time: '2024-03-18 02:00' },
                  ].map((backup, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium">{backup.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {backup.size} · {backup.time}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">恢复</Button>
                        <Button variant="outline" size="sm">下载</Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>关于 Claw.Panel</CardTitle>
                <CardDescription>版本信息与更新</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <Settings className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Claw.Panel</h3>
                    <p className="text-muted-foreground">智能运维管理面板</p>
                    <Badge className="mt-1">v2.0.0</Badge>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">当前版本</p>
                    <p className="font-medium">v2.0.0</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">最新版本</p>
                    <p className="font-medium">v2.0.0 (已是最新)</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">构建时间</p>
                    <p className="font-medium">2024-03-20</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">运行环境</p>
                    <p className="font-medium">Next.js 16 / React 19</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    检查更新
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>开源协议</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  本项目基于 GPL-3.0 许可证开源。您可以自由使用、修改和分发本软件。
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 保存按钮 */}
        <div className="flex justify-end gap-4">
          <Button variant="outline">重置</Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            保存设置
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
