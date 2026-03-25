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
  ChevronDown,
  ChevronUp,
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
import { ScrollArea } from '@/components/ui/scroll-area';

interface NavItem {
  name: string;
  href?: string;
  icon: React.ElementType;
  badge?: number;
  children?: NavItem[];
}

interface NavCategory {
  title: string;
  icon: React.ElementType;
  href?: string; // 如果有href，则是一个直接链接，不是展开分类
  items?: NavItem[];
}

const navCategories: NavCategory[] = [
  {
    title: '概览',
    icon: LayoutDashboard,
    href: '/', // 直接链接，不需要展开
  },
  {
    title: '应用管理',
    icon: Store,
    items: [
      { name: '应用商店', href: '/apps', icon: Store },
      { name: '网站管理', href: '/websites', icon: Globe },
      { name: '数据库', href: '/databases', icon: Database },
      { name: '容器管理', href: '/containers', icon: Container },
      { name: '文件管理', href: '/files', icon: FolderOpen },
    ],
  },
  {
    title: 'AI 模块',
    icon: Brain,
    items: [
      { name: 'AI 概览', href: '/ai', icon: Brain },
      { name: '模型管理', href: '/ai/models', icon: Cpu },
      { name: 'OpenClaw', href: '/ai/openclaw', icon: Bot },
      { name: 'Ollama', href: '/ai/ollama', icon: Cpu },
      { name: 'AI 对话', href: '/ai/chat', icon: MessageSquare },
      { name: 'Agent 管理', href: '/ai/agents', icon: Bot },
      { name: '通道管理', href: '/ai/channels', icon: Radio },
      { name: '技能中心', href: '/ai/skills', icon: Zap },
      { name: '工作流', href: '/ai/workflows', icon: Workflow },
      { name: 'GPU 监控', href: '/ai/gpu', icon: Activity },
    ],
  },
  {
    title: '集群管理',
    icon: Network,
    items: [
      { name: '节点管理', href: '/nodes', icon: Network },
      { name: '系统监控', href: '/monitor', icon: Activity },
      { name: 'WAF 防火墙', href: '/waf', icon: Shield },
    ],
  },
  {
    title: '系统工具',
    icon: Wrench,
    items: [
      { name: '计划任务', href: '/cronjobs', icon: Clock },
      { name: '终端', href: '/terminal', icon: Terminal },
      { name: '工具箱', href: '/toolbox', icon: Wrench },
      { name: '日志审计', href: '/logs', icon: FileText },
      { name: '安全设置', href: '/security', icon: Shield },
      { name: '面板设置', href: '/settings', icon: Settings },
    ],
  },
];

function NavItemLink({ item, collapsed, level = 0 }: { item: NavItem; collapsed: boolean; level?: number }) {
  const pathname = usePathname();
  const isActive = item.href && (pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/')));

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Link
            href={item.href || '#'}
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
      href={item.href || '#'}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium',
        level > 0 && 'pl-9 text-xs',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      )}
    >
      <item.icon className={cn('flex-shrink-0', level > 0 ? 'h-4 w-4' : 'h-5 w-5')} />
      <span className="truncate">{item.name}</span>
      {item.badge !== undefined && (
        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

function NavCategorySection({
  category,
  collapsed,
  expandedCategories,
  toggleCategory,
}: {
  category: NavCategory;
  collapsed: boolean;
  expandedCategories: Set<string>;
  toggleCategory: (title: string) => void;
}) {
  const pathname = usePathname();
  
  // 如果是直接链接（如概览）
  if (category.href) {
    const isActive = pathname === category.href;
    
    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Link
              href={category.href}
              className={cn(
                'flex items-center justify-center w-full h-10 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <category.icon className="h-5 w-5" />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {category.title}
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <Link
        href={category.href}
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        )}
      >
        <category.icon className="h-5 w-5 flex-shrink-0" />
        <span className="truncate">{category.title}</span>
      </Link>
    );
  }

  // 可展开分类
  const isExpanded = expandedCategories.has(category.title);
  const hasActiveChild = category.items?.some(
    (item) => item.href && (pathname === item.href || pathname.startsWith(item.href + '/'))
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <button
            onClick={() => toggleCategory(category.title)}
            className={cn(
              'flex items-center justify-center w-full h-10 rounded-lg transition-colors',
              hasActiveChild
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <category.icon className="h-5 w-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          {category.title}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className="space-y-1">
      <button
        onClick={() => toggleCategory(category.title)}
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium w-full',
          hasActiveChild
            ? 'bg-primary/5 text-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        )}
      >
        <category.icon className="h-5 w-5 flex-shrink-0" />
        <span className="truncate flex-1 text-left">{category.title}</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {isExpanded && category.items && (
        <div className="space-y-1 pl-2 border-l ml-4">
          {category.items.map((item) => (
            <NavItemLink key={item.href || item.name} item={item} collapsed={collapsed} level={1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(() => {
    // 默认展开包含当前页面的分类
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const expanded = new Set<string>();
    navCategories.forEach((category) => {
      if (category.items?.some((item) => item.href && pathname.startsWith(item.href))) {
        expanded.add(category.title);
      }
    });
    return expanded;
  });

  const toggleCategory = (title: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

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
        <ScrollArea className="flex-1 py-4 px-3">
          <nav className="space-y-2">
            {navCategories.map((category) => (
              <NavCategorySection
                key={category.title}
                category={category}
                collapsed={collapsed}
                expandedCategories={expandedCategories}
                toggleCategory={toggleCategory}
              />
            ))}
          </nav>
        </ScrollArea>

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
