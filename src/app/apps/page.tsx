'use client';

import { AppLayout } from '@/components/layout/layout-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Store,
  Search,
  Plus,
  Download,
  ExternalLink,
  Star,
  Users,
  Clock,
  Filter,
  Grid,
  List,
  CheckCircle2,
} from 'lucide-react';
import { getMockApps } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const categories = [
  { id: 'all', name: '全部' },
  { id: 'CMS', name: 'CMS' },
  { id: '存储', name: '存储' },
  { id: '开发工具', name: '开发工具' },
  { id: '容器管理', name: '容器管理' },
  { id: '监控', name: '监控' },
  { id: 'CI/CD', name: 'CI/CD' },
];

function AppCard({
  app,
  onInstall,
}: {
  app: {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    version: string;
    tags: string[];
    installed: boolean;
    installedVersion?: string;
  };
  onInstall?: () => void;
}) {
  return (
    <Card className="group transition-all hover:shadow-md hover:border-primary/30">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* App Icon */}
          <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
            {app.icon ? (
              <Image
                src={app.icon}
                alt={app.name}
                fill
                className="object-contain p-2"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <Store className="h-6 w-6 text-muted-foreground" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold">{app.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {app.description}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mt-3">
              {app.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Badge variant="outline">{app.version}</Badge>
                {app.installed && (
                  <span className="flex items-center gap-1 text-emerald-500">
                    <CheckCircle2 className="h-3 w-3" />
                    已安装
                  </span>
                )}
              </div>
              {app.installed ? (
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  管理
                </Button>
              ) : (
                <Button size="sm" onClick={onInstall}>
                  <Download className="h-4 w-4 mr-1" />
                  安装
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AppsPage() {
  const apps = getMockApps();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const installedCount = apps.filter((a) => a.installed).length;

  return (
    <AppLayout title="应用商店">
      <div className="space-y-6">
        {/* 统计卡片 */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg p-3 bg-blue-500/10 text-blue-500">
                  <Store className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">可用应用</p>
                  <p className="text-2xl font-bold">{apps.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg p-3 bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">已安装</p>
                  <p className="text-2xl font-bold">{installedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg p-3 bg-purple-500/10 text-purple-500">
                  <Star className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">推荐应用</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg p-3 bg-amber-500/10 text-amber-500">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">待更新</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 搜索和筛选 */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索应用..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 分类标签 */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        {/* 应用列表 */}
        <Tabs defaultValue="available" className="space-y-4">
          <TabsList>
            <TabsTrigger value="available">可用应用</TabsTrigger>
            <TabsTrigger value="installed">已安装</TabsTrigger>
            <TabsTrigger value="updates">可更新</TabsTrigger>
          </TabsList>

          <TabsContent value="available">
            <div
              className={cn(
                viewMode === 'grid'
                  ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3'
                  : 'space-y-3'
              )}
            >
              {filteredApps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="installed">
            <div
              className={cn(
                viewMode === 'grid'
                  ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3'
                  : 'space-y-3'
              )}
            >
              {apps
                .filter((a) => a.installed)
                .map((app) => (
                  <AppCard key={app.id} app={app} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="updates">
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">有 2 个应用可更新</h3>
                <p className="text-muted-foreground mb-4">
                  WordPress 和 Portainer 有新版本可用
                </p>
                <Button>全部更新</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
