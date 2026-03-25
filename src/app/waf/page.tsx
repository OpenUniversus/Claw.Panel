'use client';

import { AppLayout } from '@/components/layout/layout-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Edit,
  Settings,
  Globe,
  Lock,
  Eye,
  Ban,
  FileCode,
  Activity,
  Clock,
  RefreshCw,
  Download,
  Filter,
  Search,
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

const wafStats = {
  enabled: true,
  totalRequests: 125680,
  blockedRequests: 1280,
  attackCount: 856,
  rulesCount: 128,
  lastUpdate: '2024-03-25 20:30',
};

const attackTypes = [
  { type: 'SQL注入', count: 320, trend: '+12%' },
  { type: 'XSS攻击', count: 256, trend: '-5%' },
  { type: 'CSRF攻击', count: 128, trend: '+3%' },
  { type: '路径遍历', count: 89, trend: '-2%' },
  { type: '命令注入', count: 45, trend: '+1%' },
  { type: '文件包含', count: 18, trend: '0%' },
];

const wafRules = [
  {
    id: 1,
    name: 'SQL注入防护',
    category: 'injection',
    enabled: true,
    action: 'block',
    hits: 1520,
    severity: 'critical',
  },
  {
    id: 2,
    name: 'XSS攻击防护',
    category: 'xss',
    enabled: true,
    action: 'block',
    hits: 980,
    severity: 'high',
  },
  {
    id: 3,
    name: '目录遍历防护',
    category: 'traversal',
    enabled: true,
    action: 'block',
    hits: 456,
    severity: 'high',
  },
  {
    id: 4,
    name: '命令注入防护',
    category: 'injection',
    enabled: true,
    action: 'block',
    hits: 234,
    severity: 'critical',
  },
  {
    id: 5,
    name: '恶意User-Agent',
    category: 'bot',
    enabled: true,
    action: 'challenge',
    hits: 678,
    severity: 'medium',
  },
  {
    id: 6,
    name: 'IP黑名单',
    category: 'blacklist',
    enabled: true,
    action: 'block',
    hits: 890,
    severity: 'high',
  },
  {
    id: 7,
    name: '敏感文件访问',
    category: 'sensitive',
    enabled: true,
    action: 'block',
    hits: 123,
    severity: 'critical',
  },
  {
    id: 8,
    name: '请求频率限制',
    category: 'ratelimit',
    enabled: true,
    action: 'throttle',
    hits: 567,
    severity: 'medium',
  },
];

const attackLogs = [
  { id: 1, ip: '192.168.1.100', type: 'SQL注入', url: '/api/users?id=1\' OR \'1\'=\'1', time: '20:45:12', action: 'blocked' },
  { id: 2, ip: '10.0.0.55', type: 'XSS', url: '/search?q=<script>alert(1)</script>', time: '20:44:58', action: 'blocked' },
  { id: 3, ip: '172.16.0.20', type: '路径遍历', url: '/files/../../../etc/passwd', time: '20:44:30', action: 'blocked' },
  { id: 4, ip: '192.168.2.50', type: '命令注入', url: '/ping?host=127.0.0.1;cat /etc/passwd', time: '20:43:45', action: 'blocked' },
  { id: 5, ip: '10.0.1.100', type: 'SQL注入', url: '/api/products?cat=1 UNION SELECT * FROM users', time: '20:42:10', action: 'blocked' },
  { id: 6, ip: '172.16.1.5', type: '恶意UA', url: '/index.html', time: '20:41:22', action: 'challenged' },
];

const ipBlacklist = [
  { ip: '192.168.100.1', reason: '暴力破解', addedAt: '2024-03-24', expiresAt: '永久' },
  { ip: '10.0.50.20', reason: 'SQL注入攻击', addedAt: '2024-03-23', expiresAt: '2024-04-23' },
  { ip: '172.16.50.10', reason: 'DDoS攻击', addedAt: '2024-03-20', expiresAt: '永久' },
  { ip: '203.0.113.50', reason: '恶意爬虫', addedAt: '2024-03-18', expiresAt: '2024-04-18' },
];

const ipWhitelist = [
  { ip: '192.168.1.0/24', reason: '内网IP段', addedAt: '2024-01-01' },
  { ip: '10.0.0.1', reason: '监控系统', addedAt: '2024-01-15' },
  { ip: '172.16.0.100', reason: 'CI/CD服务器', addedAt: '2024-02-01' },
];

function SeverityBadge({ severity }: { severity: string }) {
  const config: Record<string, { color: string; text: string }> = {
    critical: { color: 'bg-red-500 text-white', text: '严重' },
    high: { color: 'bg-orange-500 text-white', text: '高危' },
    medium: { color: 'bg-amber-500 text-white', text: '中危' },
    low: { color: 'bg-blue-500 text-white', text: '低危' },
  };
  return (
    <Badge className={config[severity]?.color || ''}>
      {config[severity]?.text || severity}
    </Badge>
  );
}

function ActionBadge({ action }: { action: string }) {
  const config: Record<string, { color: string; text: string }> = {
    block: { color: 'bg-red-500/10 text-red-500 border-red-500/20', text: '阻断' },
    challenge: { color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', text: '验证' },
    throttle: { color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', text: '限流' },
    log: { color: 'bg-gray-500/10 text-gray-500 border-gray-500/20', text: '记录' },
  };
  return (
    <Badge variant="outline" className={config[action]?.color || ''}>
      {config[action]?.text || action}
    </Badge>
  );
}

function AttackLogBadge({ action }: { action: string }) {
  const config: Record<string, { color: string; text: string }> = {
    blocked: { color: 'bg-red-500', text: '已阻断' },
    challenged: { color: 'bg-amber-500', text: '已验证' },
    passed: { color: 'bg-emerald-500', text: '已放行' },
  };
  return (
    <Badge variant="outline" className="gap-1">
      <span className={cn('h-2 w-2 rounded-full', config[action]?.color || 'bg-gray-500')} />
      {config[action]?.text || action}
    </Badge>
  );
}

export default function WAFPage() {
  const [wafEnabled, setWafEnabled] = useState(wafStats.enabled);
  const [ruleSearch, setRuleSearch] = useState('');

  return (
    <AppLayout title="WAF 防火墙">
      <div className="space-y-6">
        {/* WAF 状态概览 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">WAF 状态</p>
                  <p className="text-xl font-semibold flex items-center gap-2">
                    {wafEnabled ? (
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
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">今日请求</p>
                  <p className="text-2xl font-bold">{wafStats.totalRequests.toLocaleString()}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">已拦截</p>
                  <p className="text-2xl font-bold text-destructive">{wafStats.blockedRequests.toLocaleString()}</p>
                </div>
                <Ban className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">防护规则</p>
                  <p className="text-2xl font-bold">{wafStats.rulesCount}</p>
                </div>
                <FileCode className="h-8 w-8 text-violet-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 攻击类型统计 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              攻击类型分布
            </CardTitle>
            <CardDescription>今日拦截的攻击类型统计</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {attackTypes.map((attack) => (
                <div key={attack.type} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{attack.type}</p>
                    <p className="text-2xl font-bold">{attack.count}</p>
                  </div>
                  <Badge variant={attack.trend.startsWith('+') ? 'destructive' : 'outline'}>
                    {attack.trend}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 详细设置 */}
        <Tabs defaultValue="rules" className="space-y-4">
          <TabsList>
            <TabsTrigger value="rules" className="gap-2">
              <Shield className="h-4 w-4" />
              防护规则
            </TabsTrigger>
            <TabsTrigger value="logs" className="gap-2">
              <Eye className="h-4 w-4" />
              攻击日志
            </TabsTrigger>
            <TabsTrigger value="blacklist" className="gap-2">
              <Ban className="h-4 w-4" />
              IP 黑名单
            </TabsTrigger>
            <TabsTrigger value="whitelist" className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              IP 白名单
            </TabsTrigger>
            <TabsTrigger value="config" className="gap-2">
              <Settings className="h-4 w-4" />
              全局配置
            </TabsTrigger>
          </TabsList>

          {/* 防护规则 */}
          <TabsContent value="rules">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>防护规则</CardTitle>
                    <CardDescription>管理 WAF 防护规则</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="搜索规则..." 
                      className="w-48"
                      value={ruleSearch}
                      onChange={(e) => setRuleSearch(e.target.value)}
                    />
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      导入规则
                    </Button>
                    <Button>
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
                      <TableHead>规则名称</TableHead>
                      <TableHead>类别</TableHead>
                      <TableHead>严重级别</TableHead>
                      <TableHead>动作</TableHead>
                      <TableHead>命中次数</TableHead>
                      <TableHead>启用</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wafRules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell className="font-medium">{rule.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{rule.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <SeverityBadge severity={rule.severity} />
                        </TableCell>
                        <TableCell>
                          <ActionBadge action={rule.action} />
                        </TableCell>
                        <TableCell>{rule.hits.toLocaleString()}</TableCell>
                        <TableCell>
                          <Switch checked={rule.enabled} />
                        </TableCell>
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

          {/* 攻击日志 */}
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>攻击日志</CardTitle>
                    <CardDescription>查看被拦截的攻击请求</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="搜索..." className="w-48" />
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-1" />
                      筛选
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      导出
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>时间</TableHead>
                      <TableHead>来源 IP</TableHead>
                      <TableHead>攻击类型</TableHead>
                      <TableHead>请求 URL</TableHead>
                      <TableHead>处理结果</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attackLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">{log.time}</TableCell>
                        <TableCell className="font-mono">{log.ip}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.type}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm max-w-xs truncate" title={log.url}>
                          {log.url}
                        </TableCell>
                        <TableCell>
                          <AttackLogBadge action={log.action} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="加入黑名单">
                            <Ban className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* IP 黑名单 */}
          <TabsContent value="blacklist">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>IP 黑名单</CardTitle>
                    <CardDescription>禁止访问的 IP 地址列表</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-1" />
                    添加 IP
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>IP 地址</TableHead>
                      <TableHead>封禁原因</TableHead>
                      <TableHead>添加时间</TableHead>
                      <TableHead>过期时间</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ipBlacklist.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-mono">{item.ip}</TableCell>
                        <TableCell>{item.reason}</TableCell>
                        <TableCell>{item.addedAt}</TableCell>
                        <TableCell>
                          <Badge variant={item.expiresAt === '永久' ? 'destructive' : 'outline'}>
                            {item.expiresAt}
                          </Badge>
                        </TableCell>
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

          {/* IP 白名单 */}
          <TabsContent value="whitelist">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>IP 白名单</CardTitle>
                    <CardDescription>跳过 WAF 检测的 IP 地址</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-1" />
                    添加 IP
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>IP 地址</TableHead>
                      <TableHead>备注</TableHead>
                      <TableHead>添加时间</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ipWhitelist.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-mono">{item.ip}</TableCell>
                        <TableCell>{item.reason}</TableCell>
                        <TableCell>{item.addedAt}</TableCell>
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

          {/* 全局配置 */}
          <TabsContent value="config">
            <Card>
              <CardHeader>
                <CardTitle>全局配置</CardTitle>
                <CardDescription>WAF 全局设置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">启用 WAF</p>
                    <p className="text-sm text-muted-foreground">开启 Web 应用防火墙防护</p>
                  </div>
                  <Switch checked={wafEnabled} onCheckedChange={setWafEnabled} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">学习模式</p>
                    <p className="text-sm text-muted-foreground">仅记录不拦截，用于规则调试</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">请求体检测</p>
                    <p className="text-sm text-muted-foreground">检测 POST 请求体中的攻击</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">CC 防护</p>
                    <p className="text-sm text-muted-foreground">防御 CC 攻击，限制请求频率</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">最大请求大小</p>
                    <Input defaultValue="10 MB" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">请求频率限制</p>
                    <Input defaultValue="1000 次/分钟" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">封禁时长</p>
                    <Input defaultValue="10 分钟" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">日志保留天数</p>
                    <Input defaultValue="30 天" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    保存配置
                  </Button>
                  <Button variant="outline">
                    重置为默认
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
