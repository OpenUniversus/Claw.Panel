'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Store,
  Globe,
  Database,
  Container,
  Settings,
  Clock,
  Wrench,
  FileText,
  Brain,
  Bot,
  MessageSquare,
  Zap,
  Radio,
  Workflow,
  Cpu,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Terminal,
  Shield,
  Activity,
  Server,
  Network,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  children?: NavItem[];
}

const mainNavItems: NavItem[] = [
  { name: '概览', href: '/', icon: LayoutDashboard },
  { name: '应用商店', href: '/apps', icon: Store },
  { name: '网站', href: '/websites', icon: Globe },
  { name: '数据库', href: '/databases', icon: Database },
  { name: '容器', href: '/containers', icon: Container },
  { name: '文件管理', href: '/files', icon: FolderOpen },
  { name: '节点管理', href: '/nodes', icon: Network },
  { name: '系统监控', href: '/monitor', icon: Activity },
  { name: 'WAF 防火墙', href: '/waf', icon: Shield },
];

const aiNavItems: NavItem[] = [
  { name: 'AI 概览', href: '/ai', icon: Brain },
  { name: '模型管理', href: '/ai/models', icon: Cpu },
  { name: 'OpenClaw', href: '/ai/openclaw', icon: Bot },
  { name: 'Ollama', href: '/ai/ollama', icon: Cpu },
  { name: 'AI 对话', href: '/ai/chat', icon: MessageSquare },
  { name: 'Agent 管理', href: '/ai/agents', icon: Bot },
  { name: '通道管理', href: '/ai/channels', icon: Radio },
  { name: '技能中心', href: '/ai/skills', icon: Zap },
  { name: '工作流', href: '/ai/workflows', icon: Workflow },
];

const systemNavItems: NavItem[] = [
  { name: '计划任务', href: '/cronjobs', icon: Clock },
  { name: '终端', href: '/terminal', icon: Terminal },
  { name: '工具箱', href: '/toolbox', icon: Wrench },
  { name: '日志审计', href: '/logs', icon: FileText },
  { name: '安全设置', href: '/security', icon: Shield },
  { name: '面板设置', href: '/settings', icon: Settings },
];

function NavItemLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Link
            href={item.href}
            className={cn(
              'flex items-center justify-center w-full h-10 rounded-lg transition-colors',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <item.icon className="h-5 w-5" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          {item.name}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      )}
    >
      <item.icon className="h-5 w-5 flex-shrink-0" />
      <span className="truncate">{item.name}</span>
      {item.badge !== undefined && (
        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

function NavSection({
  title,
  items,
  collapsed,
}: {
  title: string;
  items: NavItem[];
  collapsed: boolean;
}) {
  return (
    <div className="space-y-1">
      {!collapsed && (
        <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-2">
          {title}
        </h3>
      )}
      {items.map((item) => (
        <NavItemLink key={item.href} item={item} collapsed={collapsed} />
      ))}
    </div>
  );
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'flex flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Claw.Panel
              </span>
            </Link>
          )}
          {collapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 mx-auto">
              <Brain className="h-5 w-5 text-white" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          <NavSection title="运维管理" items={mainNavItems} collapsed={collapsed} />
          <NavSection title="AI 模块" items={aiNavItems} collapsed={collapsed} />
          <NavSection title="系统管理" items={systemNavItems} collapsed={collapsed} />
        </nav>

        {/* Collapse Toggle */}
        <div className="border-t p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full justify-center"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span className="text-xs">收起</span>
              </>
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
