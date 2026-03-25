'use client';

import { AppLayout } from '@/components/layout/layout-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import {
  Zap,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Play,
  Settings,
  Code,
  Globe,
  Database,
  FileText,
  Image,
  Music,
  Video,
  Search,
  Star,
  Users,
  Clock,
  CheckCircle2,
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

const skills = [
  {
    id: 1,
    name: '网络搜索',
    description: '使用搜索引擎获取实时信息',
    category: 'builtin',
    enabled: true,
    usage: 12580,
    rating: 4.8,
    icon: Globe,
  },
  {
    id: 2,
    name: '代码执行',
    description: '在安全沙箱中执行Python代码',
    category: 'builtin',
    enabled: true,
    usage: 8920,
    rating: 4.9,
    icon: Code,
  },
  {
    id: 3,
    name: '文件处理',
    description: '读取和处理各种文档格式',
    category: 'builtin',
    enabled: true,
    usage: 6780,
    rating: 4.7,
    icon: FileText,
  },
  {
    id: 4,
    name: '数据库查询',
    description: '连接和查询数据库',
    category: 'builtin',
    enabled: false,
    usage: 1250,
    rating: 4.5,
    icon: Database,
  },
  {
    id: 5,
    name: '图片生成',
    description: '使用AI生成图片',
    category: 'plugin',
    enabled: true,
    usage: 3560,
    rating: 4.6,
    icon: Image,
  },
  {
    id: 6,
    name: '语音合成',
    description: '将文本转换为语音',
    category: 'plugin',
    enabled: false,
    usage: 890,
    rating: 4.3,
    icon: Music,
  },
  {
    id: 7,
    name: '视频分析',
    description: '分析视频内容',
    category: 'plugin',
    enabled: true,
    usage: 450,
    rating: 4.4,
    icon: Video,
  },
];

const marketSkills = [
  { name: '天气查询', description: '获取实时天气信息', installs: '12.5K', rating: 4.7 },
  { name: '翻译助手', description: '多语言翻译服务', installs: '8.9K', rating: 4.8 },
  { name: '新闻摘要', description: '自动抓取和总结新闻', installs: '6.2K', rating: 4.5 },
  { name: '邮件发送', description: '发送邮件通知', installs: '4.1K', rating: 4.6 },
  { name: '日程管理', description: '管理日历和提醒', installs: '3.8K', rating: 4.4 },
  { name: '数据分析', description: '数据可视化和分析', installs: '3.2K', rating: 4.7 },
];

function CategoryBadge({ category }: { category: string }) {
  const config: Record<string, { color: string; text: string }> = {
    builtin: { color: 'bg-primary/10 text-primary', text: '内置' },
    plugin: { color: 'bg-amber-500/10 text-amber-600', text: '插件' },
    custom: { color: 'bg-violet-500/10 text-violet-600', text: '自定义' },
  };
  return (
    <Badge variant="outline" className={config[category]?.color || ''}>
      {config[category]?.text || category}
    </Badge>
  );
}

export default function SkillsPage() {
  const enabledCount = skills.filter(s => s.enabled).length;
  const totalUsage = skills.reduce((sum, s) => sum + s.usage, 0);

  return (
    <AppLayout title="技能中心">
      <div className="space-y-6">
        {/* 统计概览 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">已启用技能</p>
                  <p className="text-2xl font-bold">{enabledCount} / {skills.length}</p>
                </div>
                <div className="rounded-full p-3 bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">总调用次数</p>
                  <p className="text-2xl font-bold">{totalUsage.toLocaleString()}</p>
                </div>
                <div className="rounded-full p-3 bg-blue-500/10">
                  <Play className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">内置技能</p>
                  <p className="text-2xl font-bold">{skills.filter(s => s.category === 'builtin').length}</p>
                </div>
                <div className="rounded-full p-3 bg-emerald-500/10">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">插件技能</p>
                  <p className="text-2xl font-bold">{skills.filter(s => s.category === 'plugin').length}</p>
                </div>
                <div className="rounded-full p-3 bg-amber-500/10">
                  <Download className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 技能列表 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>已安装技能</CardTitle>
                <CardDescription>管理Agent可使用的技能</CardDescription>
              </div>
              <div className="flex gap-2">
                <Input placeholder="搜索技能..." className="w-48" />
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-1" />
                  导入
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-1" />
                  创建技能
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {skills.map((skill) => {
                const Icon = skill.icon;
                return (
                  <Card key={skill.id} className="transition-all hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'rounded-lg p-2',
                            skill.category === 'builtin' ? 'bg-primary/10' : 'bg-amber-500/10'
                          )}>
                            <Icon className={cn(
                              'h-5 w-5',
                              skill.category === 'builtin' ? 'text-primary' : 'text-amber-500'
                            )} />
                          </div>
                          <div>
                            <h3 className="font-medium">{skill.name}</h3>
                            <CategoryBadge category={skill.category} />
                          </div>
                        </div>
                        <Switch checked={skill.enabled} />
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{skill.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{skill.usage.toLocaleString()} 次调用</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          <span>{skill.rating}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 技能市场 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>技能市场</CardTitle>
                <CardDescription>发现和安装更多技能</CardDescription>
              </div>
              <Button variant="outline">
                <Globe className="h-4 w-4 mr-1" />
                查看全部
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {marketSkills.map((skill, i) => (
                <Card key={i} className="transition-all hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">{skill.name}</h3>
                      <Badge variant="secondary">{skill.installs}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{skill.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                        <span className="text-sm">{skill.rating}</span>
                      </div>
                      <Button size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        安装
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
