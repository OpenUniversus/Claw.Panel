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
  Globe,
  Play,
  Square,
  RotateCcw,
  Trash2,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Shield,
  ExternalLink,
  Activity,
  Lock,
  Unlock,
  Server,
  FileText,
} from 'lucide-react';
import { getMockWebsites } from '@/lib/mock-data';
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

export default function WebsitesPage() {
  const websites = getMockWebsites();
  const [searchTerm, setSearchTerm] = useState('');

  const runningCount = websites.filter((w) => w.status === 'running').length;
  const sslCount = websites.filter((w) => w.ssl).length;

  const filteredWebsites = websites.filter(
    (w) =>
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.domains.some((d) => d.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AppLayout title="网站管理">
      <div className="space-y-6">
        {/* 统计卡片 */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg p-3 bg-blue-500/10 text-blue-500">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">总网站</p>
                  <p className="text-2xl font-bold">{websites.length}</p>
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
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">SSL 已启用</p>
                  <p className="text-2xl font-bold">{sslCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg p-3 bg-amber-500/10 text-amber-500">
                  <Server className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Web 服务器</p>
                  <p className="text-2xl font-bold">Nginx</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 标签页 */}
        <Tabs defaultValue="websites" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="websites">
                <Globe className="h-4 w-4 mr-2" />
                网站
              </TabsTrigger>
              <TabsTrigger value="ssl">
                <Shield className="h-4 w-4 mr-2" />
                SSL 证书
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索网站..."
                  className="w-64 pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    创建网站
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>创建网站</DialogTitle>
                    <DialogDescription>
                      配置新网站的基本信息
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        名称
                      </Label>
                      <Input id="name" placeholder="my-website" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="domains" className="text-right">
                        域名
                      </Label>
                      <Input
                        id="domains"
                        placeholder="example.com"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">
                        类型
                      </Label>
                      <select
                        id="type"
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="static">静态网站</option>
                        <option value="php">PHP</option>
                        <option value="nodejs">Node.js</option>
                        <option value="python">Python</option>
                        <option value="reverse">反向代理</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">SSL</Label>
                      <div className="col-span-3 flex items-center gap-2">
                        <input type="checkbox" id="ssl" className="rounded" />
                        <Label htmlFor="ssl" className="text-sm">
                          自动申请并配置 Let&apos;s Encrypt SSL 证书
                        </Label>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">创建</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <TabsContent value="websites">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>网站名称</TableHead>
                      <TableHead>域名</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>SSL</TableHead>
                      <TableHead>类型</TableHead>
                      <TableHead>Web 服务器</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWebsites.map((website) => (
                      <TableRow key={website.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                'h-2 w-2 rounded-full',
                                website.status === 'running'
                                  ? 'bg-emerald-500'
                                  : 'bg-gray-400'
                              )}
                            />
                            <div>
                              <p className="font-medium">{website.name}</p>
                              <p className="text-xs text-muted-foreground">
                                创建于 {website.createdAt}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {website.domains.map((domain) => (
                              <Badge key={domain} variant="outline" className="text-xs">
                                {domain}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={website.status === 'running' ? 'default' : 'secondary'}
                            className="gap-1"
                          >
                            {website.status === 'running' ? '运行中' : '已停止'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {website.ssl ? (
                            <div className="flex items-center gap-2">
                              <Lock className="h-4 w-4 text-emerald-500" />
                              <div>
                                <p className="text-sm">已启用</p>
                                <p className="text-xs text-muted-foreground">
                                  过期: {website.sslExpiry}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Unlock className="h-4 w-4" />
                              <span className="text-sm">未启用</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{website.appType}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="uppercase">
                            {website.webServer}
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
                              <DropdownMenuLabel>操作</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                访问网站
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Settings className="h-4 w-4 mr-2" />
                                配置
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="h-4 w-4 mr-2" />
                                日志
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {website.status === 'running' ? (
                                <>
                                  <DropdownMenuItem>
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    重载配置
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ssl">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>SSL 证书</CardTitle>
                    <CardDescription>管理网站的 SSL 证书</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    申请证书
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>域名</TableHead>
                      <TableHead>颁发者</TableHead>
                      <TableHead>生效日期</TableHead>
                      <TableHead>过期日期</TableHead>
                      <TableHead>自动续期</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        domain: 'example.com',
                        issuer: "Let's Encrypt",
                        start: '2024-03-15',
                        expiry: '2024-06-15',
                        autoRenew: true,
                        status: 'valid',
                      },
                      {
                        domain: 'api.example.com',
                        issuer: "Let's Encrypt",
                        start: '2024-02-20',
                        expiry: '2024-07-20',
                        autoRenew: true,
                        status: 'valid',
                      },
                      {
                        domain: 'blog.example.com',
                        issuer: "Let's Encrypt",
                        start: '2024-02-01',
                        expiry: '2024-08-01',
                        autoRenew: true,
                        status: 'valid',
                      },
                    ].map((cert, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{cert.domain}</TableCell>
                        <TableCell>{cert.issuer}</TableCell>
                        <TableCell>{cert.start}</TableCell>
                        <TableCell>{cert.expiry}</TableCell>
                        <TableCell>
                          {cert.autoRenew ? (
                            <Badge variant="outline" className="text-emerald-500 border-emerald-500">
                              已启用
                            </Badge>
                          ) : (
                            <Badge variant="outline">已禁用</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={cert.status === 'valid' ? 'default' : 'destructive'}
                            className="gap-1"
                          >
                            <Lock className="h-3 w-3" />
                            有效
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
                              <DropdownMenuItem>续期</DropdownMenuItem>
                              <DropdownMenuItem>下载证书</DropdownMenuItem>
                              <DropdownMenuItem>配置</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
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
