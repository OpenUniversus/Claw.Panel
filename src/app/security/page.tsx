'use client';

import { AppLayout } from '@/components/layout/layout-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Shield,
  Key,
  Lock,
  Server,
  Globe,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Plus,
  Trash2,
  Edit,
  Eye,
  Copy,
  Download,
  Upload,
  Settings,
  Info,
} from 'lucide-react';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

// 模拟数据
const firewallRules = [
  { id: 1, port: 22, protocol: 'TCP', strategy: 'ACCEPT', address: '0.0.0.0/0', description: 'SSH服务' },
  { id: 2, port: 80, protocol: 'TCP', strategy: 'ACCEPT', address: '0.0.0.0/0', description: 'HTTP服务' },
  { id: 3, port: 443, protocol: 'TCP', strategy: 'ACCEPT', address: '0.0.0.0/0', description: 'HTTPS服务' },
  { id: 4, port: 5000, protocol: 'TCP', strategy: 'ACCEPT', address: '0.0.0.0/0', description: '面板服务' },
  { id: 5, port: 11434, protocol: 'TCP', strategy: 'ACCEPT', address: '127.0.0.1', description: 'Ollama服务' },
];

const sslCertificates = [
  { id: 1, domain: 'example.com', issuer: "Let's Encrypt", expiresAt: '2024-06-25', status: 'valid' as const, autoRenew: true },
  { id: 2, domain: 'api.example.com', issuer: "Let's Encrypt", expiresAt: '2024-05-10', status: 'valid' as const, autoRenew: true },
  { id: 3, domain: 'demo.example.com', issuer: 'Self-signed', expiresAt: '2024-12-31', status: 'warning' as const, autoRenew: false },
];

const sshSettings = {
  port: 22,
  permitRootLogin: true,
  passwordAuthentication: false,
  pubkeyAuthentication: true,
  maxAuthTries: 5,
  clientAliveInterval: 300,
};

const securityStatus = {
  firewallEnabled: true,
  fail2banEnabled: true,
  sshHardened: true,
  sslAutoRenew: true,
  twoFactorEnabled: false,
  ipWhitelist: false,
};

function StatusBadge({ status }: { status: 'valid' | 'warning' | 'expired' }) {
  const config = {
    valid: { color: 'bg-emerald-500', text: '有效', icon: CheckCircle2 },
    warning: { color: 'bg-amber-500', text: '即将过期', icon: AlertTriangle },
    expired: { color: 'bg-red-500', text: '已过期', icon: XCircle },
  };
  const Icon = config[status].icon;
  return (
    <Badge variant="outline" className="gap-1">
      <span className={cn('h-2 w-2 rounded-full', config[status].color)} />
      <Icon className="h-3 w-3" />
      {config[status].text}
    </Badge>
  );
}

export default function SecurityPage() {
  const [firewallEnabled, setFirewallEnabled] = useState(securityStatus.firewallEnabled);
  const [fail2banEnabled, setFail2banEnabled] = useState(securityStatus.fail2banEnabled);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(securityStatus.twoFactorEnabled);

  return (
    <AppLayout title="安全设置">
      <div className="space-y-6">
        {/* 安全状态概览 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">防火墙</p>
                  <p className="text-xl font-semibold">{firewallEnabled ? '已启用' : '已禁用'}</p>
                </div>
                <Switch
                  checked={firewallEnabled}
                  onCheckedChange={setFirewallEnabled}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Fail2ban</p>
                  <p className="text-xl font-semibold">{fail2banEnabled ? '运行中' : '已停止'}</p>
                </div>
                <Switch
                  checked={fail2banEnabled}
                  onCheckedChange={setFail2banEnabled}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">SSH加固</p>
                  <p className="text-xl font-semibold">已配置</p>
                </div>
                <Lock className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">两步验证</p>
                  <p className="text-xl font-semibold">{twoFactorEnabled ? '已启用' : '未启用'}</p>
                </div>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={setTwoFactorEnabled}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 详细设置 */}
        <Tabs defaultValue="firewall" className="space-y-4">
          <TabsList>
            <TabsTrigger value="firewall" className="gap-2">
              <Shield className="h-4 w-4" />
              防火墙
            </TabsTrigger>
            <TabsTrigger value="ssh" className="gap-2">
              <Key className="h-4 w-4" />
              SSH设置
            </TabsTrigger>
            <TabsTrigger value="ssl" className="gap-2">
              <Lock className="h-4 w-4" />
              SSL证书
            </TabsTrigger>
            <TabsTrigger value="access" className="gap-2">
              <Globe className="h-4 w-4" />
              访问控制
            </TabsTrigger>
          </TabsList>

          {/* 防火墙设置 */}
          <TabsContent value="firewall">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>端口规则</CardTitle>
                    <CardDescription>管理防火墙端口访问规则</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      重载规则
                    </Button>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      添加规则
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>端口</TableHead>
                      <TableHead>协议</TableHead>
                      <TableHead>策略</TableHead>
                      <TableHead>来源地址</TableHead>
                      <TableHead>描述</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {firewallRules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell className="font-mono">{rule.port}</TableCell>
                        <TableCell>{rule.protocol}</TableCell>
                        <TableCell>
                          <Badge variant={rule.strategy === 'ACCEPT' ? 'default' : 'destructive'}>
                            {rule.strategy}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{rule.address}</TableCell>
                        <TableCell>{rule.description}</TableCell>
                        <TableCell className="text-right">
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

          {/* SSH设置 */}
          <TabsContent value="ssh">
            <Card>
              <CardHeader>
                <CardTitle>SSH配置</CardTitle>
                <CardDescription>管理SSH服务安全设置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>SSH端口</Label>
                    <div className="flex gap-2">
                      <Input value={sshSettings.port} type="number" className="font-mono" />
                      <Button variant="outline">修改</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>最大认证尝试次数</Label>
                    <Input value={sshSettings.maxAuthTries} type="number" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Key className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">允许Root登录</p>
                        <p className="text-sm text-muted-foreground">允许使用root用户通过SSH登录</p>
                      </div>
                    </div>
                    <Switch checked={sshSettings.permitRootLogin} />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">密码认证</p>
                        <p className="text-sm text-muted-foreground">允许使用密码进行SSH认证</p>
                      </div>
                    </div>
                    <Switch checked={sshSettings.passwordAuthentication} />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Key className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">公钥认证</p>
                        <p className="text-sm text-muted-foreground">允许使用SSH公钥进行认证</p>
                      </div>
                    </div>
                    <Switch checked={sshSettings.pubkeyAuthentication} />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button>
                    <Settings className="h-4 w-4 mr-1" />
                    保存配置
                  </Button>
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-1" />
                    重启SSH服务
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* SSH密钥管理 */}
            <Card className="mt-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>SSH密钥</CardTitle>
                    <CardDescription>管理SSH公钥授权</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    添加密钥
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Key className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium font-mono text-sm">ssh-rsa AAAAB3NzaC1yc2E...user@localhost</p>
                        <p className="text-xs text-muted-foreground">添加于 2024-01-15 · 最后使用 2024-03-25</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SSL证书 */}
          <TabsContent value="ssl">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>SSL证书</CardTitle>
                    <CardDescription>管理网站的SSL证书</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-1" />
                      导入证书
                    </Button>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      申请证书
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>域名</TableHead>
                      <TableHead>颁发者</TableHead>
                      <TableHead>过期时间</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>自动续期</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sslCertificates.map((cert) => (
                      <TableRow key={cert.id}>
                        <TableCell className="font-mono">{cert.domain}</TableCell>
                        <TableCell>{cert.issuer}</TableCell>
                        <TableCell>{cert.expiresAt}</TableCell>
                        <TableCell>
                          <StatusBadge status={cert.status} />
                        </TableCell>
                        <TableCell>
                          <Switch checked={cert.autoRenew} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <RefreshCw className="h-4 w-4" />
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

          {/* 访问控制 */}
          <TabsContent value="access">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>IP白名单</CardTitle>
                    <CardDescription>限制面板访问IP地址</CardDescription>
                  </div>
                  <Switch />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input placeholder="输入IP地址，如: 192.168.1.100" className="flex-1" />
                  <Select defaultValue="single">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">单个IP</SelectItem>
                      <SelectItem value="range">IP范围</SelectItem>
                      <SelectItem value="cidr">CIDR</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>添加</Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-sm">192.168.1.0/24</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-sm">10.0.0.1</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 登录日志 */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>登录日志</CardTitle>
                <CardDescription>查看最近的登录记录</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>时间</TableHead>
                      <TableHead>用户</TableHead>
                      <TableHead>IP地址</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>位置</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>2024-03-25 20:35:00</TableCell>
                      <TableCell>admin</TableCell>
                      <TableCell className="font-mono">192.168.1.100</TableCell>
                      <TableCell>
                        <Badge variant="default">成功</Badge>
                      </TableCell>
                      <TableCell>本地网络</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2024-03-25 18:00:00</TableCell>
                      <TableCell>admin</TableCell>
                      <TableCell className="font-mono">10.0.0.5</TableCell>
                      <TableCell>
                        <Badge variant="default">成功</Badge>
                      </TableCell>
                      <TableCell>VPN</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2024-03-25 15:30:00</TableCell>
                      <TableCell>admin</TableCell>
                      <TableCell className="font-mono">45.33.32.156</TableCell>
                      <TableCell>
                        <Badge variant="destructive">失败</Badge>
                      </TableCell>
                      <TableCell>未知</TableCell>
                    </TableRow>
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
