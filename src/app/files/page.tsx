'use client';

import { useState, useMemo } from 'react';
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
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Folder,
  File,
  FileText,
  FileImage,
  FileCode,
  FileArchive,
  FileVideo,
  FileAudio,
  Upload,
  Download,
  Trash2,
  Edit2,
  Copy,
  Scissors,
  Clipboard,
  FolderPlus,
  FilePlus,
  RefreshCw,
  Search,
  Grid,
  List,
  MoreHorizontal,
  ChevronRight,
  Home,
  ArrowUp,
  HardDrive,
  Info,
  Share2,
  Archive,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

// 文件类型
interface FileItem {
  id: string;
  name: string;
  path: string;
  isDir: boolean;
  size: number;
  mode: string;
  modTime: string;
  extension?: string;
  isHidden?: boolean;
  isSymlink?: boolean;
}

// 面包屑项
interface BreadcrumbItem {
  name: string;
  path: string;
}

// 剪贴板类型
interface ClipboardData {
  items: FileItem[];
  operation: 'copy' | 'cut';
}

// 获取文件图标
function getFileIcon(item: FileItem) {
  if (item.isDir) return Folder;
  
  const ext = item.extension || item.name.split('.').pop()?.toLowerCase();
  
  switch (ext) {
    case 'txt':
    case 'md':
    case 'doc':
    case 'docx':
    case 'pdf':
      return FileText;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
    case 'webp':
      return FileImage;
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'mkv':
      return FileVideo;
    case 'mp3':
    case 'wav':
    case 'flac':
    case 'aac':
      return FileAudio;
    case 'js':
    case 'ts':
    case 'jsx':
    case 'tsx':
    case 'py':
    case 'go':
    case 'java':
    case 'c':
    case 'cpp':
    case 'rs':
    case 'rb':
    case 'php':
      return FileCode;
    case 'zip':
    case 'tar':
    case 'gz':
    case 'rar':
    case '7z':
      return FileArchive;
    default:
      return File;
  }
}

// 格式化文件大小
function formatSize(bytes: number, isDir: boolean): string {
  if (isDir) return '-';
  if (bytes === 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

// 格式化日期
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// 模拟文件数据
function getMockFiles(path: string): FileItem[] {
  const baseFiles: FileItem[] = [
    { id: '1', name: 'bin', path: '/bin', isDir: true, size: 4096, mode: 'drwxr-xr-x', modTime: '2024-01-15T10:00:00Z' },
    { id: '2', name: 'etc', path: '/etc', isDir: true, size: 4096, mode: 'drwxr-xr-x', modTime: '2024-01-14T08:30:00Z' },
    { id: '3', name: 'home', path: '/home', isDir: true, size: 4096, mode: 'drwxr-xr-x', modTime: '2024-01-13T15:45:00Z' },
    { id: '4', name: 'var', path: '/var', isDir: true, size: 4096, mode: 'drwxr-xr-x', modTime: '2024-01-12T09:20:00Z' },
    { id: '5', name: 'usr', path: '/usr', isDir: true, size: 4096, mode: 'drwxr-xr-x', modTime: '2024-01-10T14:00:00Z' },
    { id: '6', name: 'opt', path: '/opt', isDir: true, size: 4096, mode: 'drwxr-xr-x', modTime: '2024-01-08T11:30:00Z' },
    { id: '7', name: 'root', path: '/root', isDir: true, size: 4096, mode: 'drwx------', modTime: '2024-01-07T16:20:00Z' },
    { id: '8', name: 'tmp', path: '/tmp', isDir: true, size: 4096, mode: 'drwxrwxrwt', modTime: '2024-01-06T18:45:00Z' },
  ];

  if (path === '/home') {
    return [
      { id: 'h1', name: 'admin', path: '/home/admin', isDir: true, size: 4096, mode: 'drwxr-xr-x', modTime: '2024-01-15T10:00:00Z' },
      { id: 'h2', name: 'user', path: '/home/user', isDir: true, size: 4096, mode: 'drwxr-xr-x', modTime: '2024-01-14T08:30:00Z' },
    ];
  }

  if (path === '/home/admin') {
    return [
      { id: 'f1', name: '.bashrc', path: '/home/admin/.bashrc', isDir: false, size: 3526, mode: '-rw-r--r--', modTime: '2024-01-15T10:00:00Z', isHidden: true, extension: 'bashrc' },
      { id: 'f2', name: '.profile', path: '/home/admin/.profile', isDir: false, size: 807, mode: '-rw-r--r--', modTime: '2024-01-15T10:00:00Z', isHidden: true, extension: 'profile' },
      { id: 'f3', name: 'documents', path: '/home/admin/documents', isDir: true, size: 4096, mode: 'drwxr-xr-x', modTime: '2024-01-15T10:00:00Z' },
      { id: 'f4', name: 'downloads', path: '/home/admin/downloads', isDir: true, size: 4096, mode: 'drwxr-xr-x', modTime: '2024-01-15T10:00:00Z' },
      { id: 'f5', name: 'projects', path: '/home/admin/projects', isDir: true, size: 4096, mode: 'drwxr-xr-x', modTime: '2024-01-15T10:00:00Z' },
      { id: 'f6', name: 'config.yml', path: '/home/admin/config.yml', isDir: false, size: 1234, mode: '-rw-r--r--', modTime: '2024-01-15T10:00:00Z', extension: 'yml' },
      { id: 'f7', name: 'README.md', path: '/home/admin/README.md', isDir: false, size: 5678, mode: '-rw-r--r--', modTime: '2024-01-15T10:00:00Z', extension: 'md' },
      { id: 'f8', name: 'app.py', path: '/home/admin/app.py', isDir: false, size: 2345, mode: '-rw-r--r--', modTime: '2024-01-15T10:00:00Z', extension: 'py' },
      { id: 'f9', name: 'package.json', path: '/home/admin/package.json', isDir: false, size: 890, mode: '-rw-r--r--', modTime: '2024-01-15T10:00:00Z', extension: 'json' },
      { id: 'f10', name: 'screenshot.png', path: '/home/admin/screenshot.png', isDir: false, size: 256789, mode: '-rw-r--r--', modTime: '2024-01-15T10:00:00Z', extension: 'png' },
    ];
  }

  return baseFiles;
}

// 文件行组件
function FileRow({
  file,
  isSelected,
  onSelect,
  onOpen,
  onContextMenu,
}: {
  file: FileItem;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onOpen: () => void;
  onContextMenu: (file: FileItem, e: React.MouseEvent) => void;
}) {
  const Icon = getFileIcon(file);

  return (
    <TableRow
      className={cn(
        'cursor-pointer group',
        isSelected && 'bg-primary/10',
        'hover:bg-muted/50'
      )}
      onClick={(e) => {
        if (e.ctrlKey || e.metaKey) {
          onSelect(e);
        } else {
          onOpen();
        }
      }}
      onDoubleClick={onOpen}
      onContextMenu={(e) => onContextMenu(file, e)}
    >
      <TableCell>
        <div className="flex items-center gap-3">
          <Icon
            className={cn(
              'h-5 w-5',
              file.isDir ? 'text-amber-500' : 'text-blue-500'
            )}
          />
          <span className={cn(file.isHidden && 'text-muted-foreground')}>
            {file.name}
          </span>
          {file.isSymlink && (
            <Badge variant="outline" className="text-xs">链接</Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="font-mono text-xs">
          {formatSize(file.size, file.isDir)}
        </Badge>
      </TableCell>
      <TableCell className="font-mono text-xs">{file.mode}</TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {formatDate(file.modTime)}
      </TableCell>
      <TableCell className="w-12">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onOpen}>
              {file.isDir ? '打开' : '查看'}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="h-4 w-4 mr-2" />
              下载
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2 className="h-4 w-4 mr-2" />
              分享
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Edit2 className="h-4 w-4 mr-2" />
              重命名
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="h-4 w-4 mr-2" />
              复制
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Scissors className="h-4 w-4 mr-2" />
              剪切
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

// 文件网格项组件
function FileGridItem({
  file,
  isSelected,
  onSelect,
  onOpen,
  onContextMenu,
}: {
  file: FileItem;
  isSelected: boolean;
  onSelect: () => void;
  onOpen: () => void;
  onContextMenu: (file: FileItem, e: React.MouseEvent) => void;
}) {
  const Icon = getFileIcon(file);

  return (
    <div
      className={cn(
        'flex flex-col items-center p-4 rounded-lg cursor-pointer transition-colors',
        isSelected ? 'bg-primary/10 ring-2 ring-primary' : 'hover:bg-muted/50'
      )}
      onClick={onSelect}
      onDoubleClick={onOpen}
      onContextMenu={(e) => onContextMenu(file, e)}
    >
      <Icon
        className={cn(
          'h-12 w-12 mb-2',
          file.isDir ? 'text-amber-500' : 'text-blue-500'
        )}
      />
      <span className={cn(
        'text-sm text-center truncate max-w-full',
        file.isHidden && 'text-muted-foreground'
      )}>
        {file.name}
      </span>
      <span className="text-xs text-muted-foreground">
        {formatSize(file.size, file.isDir)}
      </span>
    </div>
  );
}

export default function FilesPage() {
  // 状态
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [showHidden, setShowHidden] = useState(false);
  const [clipboard, setClipboard] = useState<ClipboardData | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'time'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // 对话框状态
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [previewContent, setPreviewContent] = useState('');

  // 获取文件列表
  const files = useMemo(() => {
    let items = getMockFiles(currentPath);
    
    // 过滤隐藏文件
    if (!showHidden) {
      items = items.filter((f) => !f.isHidden);
    }
    
    // 搜索过滤
    if (searchQuery) {
      items = items.filter((f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // 排序
    items.sort((a, b) => {
      // 目录优先
      if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
      
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        case 'time':
          comparison = new Date(a.modTime).getTime() - new Date(b.modTime).getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return items;
  }, [currentPath, showHidden, searchQuery, sortBy, sortOrder]);

  // 面包屑
  const breadcrumbs = useMemo(() => {
    const parts = currentPath.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [{ name: '根目录', path: '/' }];
    
    let path = '';
    parts.forEach((part) => {
      path += `/${part}`;
      items.push({ name: part, path });
    });
    
    return items;
  }, [currentPath]);

  // 统计
  const stats = useMemo(() => {
    const dirs = files.filter((f) => f.isDir).length;
    const fileCount = files.filter((f) => !f.isDir).length;
    const totalSize = files.filter((f) => !f.isDir).reduce((sum, f) => sum + f.size, 0);
    return { dirs, files: fileCount, totalSize };
  }, [files]);

  // 导航
  const navigateTo = (path: string) => {
    setCurrentPath(path);
    setSelectedItems(new Set());
  };

  const goUp = () => {
    const parent = currentPath.split('/').slice(0, -1).join('/') || '/';
    navigateTo(parent);
  };

  // 选择
  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const selectAll = () => {
    if (selectedItems.size === files.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(files.map((f) => f.id)));
    }
  };

  // 打开文件/文件夹
  const openItem = (file: FileItem) => {
    if (file.isDir) {
      navigateTo(file.path);
    } else {
      // 预览文件
      setSelectedFile(file);
      setPreviewContent(`# ${file.name}\n\n这是文件 ${file.path} 的预览内容。\n\n实际应用中会读取真实文件内容。`);
      setShowPreviewDialog(true);
    }
  };

  // 右键菜单
  const handleContextMenu = (file: FileItem, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedFile(file);
    // 右键菜单通过 ContextMenu 组件处理
  };

  // 创建新文件夹
  const createFolder = () => {
    if (newItemName.trim()) {
      // 实际应用中调用 API
      console.log('Creating folder:', newItemName);
      setShowNewFolderDialog(false);
      setNewItemName('');
    }
  };

  // 创建新文件
  const createFile = () => {
    if (newItemName.trim()) {
      // 实际应用中调用 API
      console.log('Creating file:', newItemName);
      setShowNewFileDialog(false);
      setNewItemName('');
    }
  };

  // 复制/剪切
  const copyItems = (operation: 'copy' | 'cut') => {
    const items = files.filter((f) => selectedItems.has(f.id));
    setClipboard({ items, operation });
  };

  // 粘贴
  const pasteItems = () => {
    if (clipboard) {
      console.log('Pasting:', clipboard.items, 'operation:', clipboard.operation);
      // 实际应用中调用 API
      if (clipboard.operation === 'cut') {
        setClipboard(null);
      }
    }
  };

  return (
    <AppLayout title="文件管理">
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* 工具栏 */}
        <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigateTo('/')}>
              <Home className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={goUp} disabled={currentPath === '/'}>
              <ArrowUp className="h-4 w-4" />
            </Button>
            
            {/* 面包屑 */}
            <div className="flex items-center gap-1 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.path} className="flex items-center">
                  {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2"
                    onClick={() => navigateTo(crumb.path)}
                  >
                    {crumb.name}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 搜索 */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索文件..."
                className="w-48 pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* 新建 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <FilePlus className="h-4 w-4 mr-2" />
                  新建
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setShowNewFolderDialog(true)}>
                  <FolderPlus className="h-4 w-4 mr-2" />
                  新建文件夹
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowNewFileDialog(true)}>
                  <FilePlus className="h-4 w-4 mr-2" />
                  新建文件
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 上传 */}
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              上传
            </Button>

            {/* 刷新 */}
            <Button variant="outline" size="icon" onClick={() => setCurrentPath(currentPath)}>
              <RefreshCw className="h-4 w-4" />
            </Button>

            {/* 视图切换 */}
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                className="rounded-r-none"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                className="rounded-l-none"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 主内容区 */}
        <div className="flex-1 flex overflow-hidden">
          {/* 文件列表 */}
          <div className="flex-1 overflow-auto p-4">
            {viewMode === 'list' ? (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">名称</TableHead>
                      <TableHead className="w-[15%]">大小</TableHead>
                      <TableHead className="w-[15%]">权限</TableHead>
                      <TableHead className="w-[20%]">修改时间</TableHead>
                      <TableHead className="w-[10%]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentPath !== '/' && (
                      <TableRow
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={goUp}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <ArrowUp className="h-5 w-5 text-muted-foreground" />
                            <span className="text-muted-foreground">..</span>
                          </div>
                        </TableCell>
                        <TableCell />
                        <TableCell />
                        <TableCell />
                        <TableCell />
                      </TableRow>
                    )}
                    {files.map((file) => (
                      <FileRow
                        key={file.id}
                        file={file}
                        isSelected={selectedItems.has(file.id)}
                        onSelect={(e) => {
                          e.stopPropagation();
                          toggleSelect(file.id);
                        }}
                        onOpen={() => openItem(file)}
                        onContextMenu={handleContextMenu}
                      />
                    ))}
                  </TableBody>
                </Table>
              </Card>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {currentPath !== '/' && (
                  <div
                    className="flex flex-col items-center p-4 rounded-lg cursor-pointer hover:bg-muted/50"
                    onDoubleClick={goUp}
                  >
                    <ArrowUp className="h-12 w-12 mb-2 text-muted-foreground" />
                    <span className="text-sm">..</span>
                  </div>
                )}
                {files.map((file) => (
                  <FileGridItem
                    key={file.id}
                    file={file}
                    isSelected={selectedItems.has(file.id)}
                    onSelect={() => toggleSelect(file.id)}
                    onOpen={() => openItem(file)}
                    onContextMenu={handleContextMenu}
                  />
                ))}
              </div>
            )}

            {files.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Folder className="h-16 w-16 mb-4" />
                <p>此文件夹为空</p>
              </div>
            )}
          </div>

          {/* 侧边栏 */}
          <div className="w-64 border-l p-4 bg-muted/30">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">统计信息</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">文件夹</span>
                    <span>{stats.dirs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">文件</span>
                    <span>{stats.files}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">总大小</span>
                    <span>{formatSize(stats.totalSize, false)}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">操作</h3>
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start" onClick={selectAll}>
                    <Copy className="h-4 w-4 mr-2" />
                    {selectedItems.size === files.length ? '取消全选' : '全选'}
                  </Button>
                  {selectedItems.size > 0 && (
                    <>
                      <Button variant="ghost" className="w-full justify-start" onClick={() => copyItems('copy')}>
                        <Copy className="h-4 w-4 mr-2" />
                        复制 ({selectedItems.size})
                      </Button>
                      <Button variant="ghost" className="w-full justify-start" onClick={() => copyItems('cut')}>
                        <Scissors className="h-4 w-4 mr-2" />
                        剪切 ({selectedItems.size})
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        删除 ({selectedItems.size})
                      </Button>
                    </>
                  )}
                  {clipboard && (
                    <Button variant="ghost" className="w-full justify-start" onClick={pasteItems}>
                      <Clipboard className="h-4 w-4 mr-2" />
                      粘贴 ({clipboard.items.length})
                    </Button>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">排序</h3>
                <div className="space-y-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'size' | 'time')}
                    className="w-full h-9 rounded-md border bg-background px-3 text-sm"
                  >
                    <option value="name">名称</option>
                    <option value="size">大小</option>
                    <option value="time">修改时间</option>
                  </select>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                    className="w-full h-9 rounded-md border bg-background px-3 text-sm"
                  >
                    <option value="asc">升序</option>
                    <option value="desc">降序</option>
                  </select>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-sm">显示隐藏文件</span>
                <Button
                  variant={showHidden ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowHidden(!showHidden)}
                >
                  {showHidden ? '开' : '关'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 状态栏 */}
        <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/30 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>{files.length} 项</span>
            {selectedItems.size > 0 && (
              <span>已选择 {selectedItems.size} 项</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <HardDrive className="h-4 w-4" />
              磁盘使用: 45.2 GB / 100 GB
            </span>
            <span>{currentPath}</span>
          </div>
        </div>
      </div>

      {/* 新建文件夹对话框 */}
      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新建文件夹</DialogTitle>
            <DialogDescription>
              在当前目录创建新文件夹
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="folder-name">文件夹名称</Label>
              <Input
                id="folder-name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="输入文件夹名称"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFolderDialog(false)}>
              取消
            </Button>
            <Button onClick={createFolder}>创建</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 新建文件对话框 */}
      <Dialog open={showNewFileDialog} onOpenChange={setShowNewFileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新建文件</DialogTitle>
            <DialogDescription>
              在当前目录创建新文件
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-name">文件名称</Label>
              <Input
                id="file-name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="输入文件名称（如 readme.md）"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFileDialog(false)}>
              取消
            </Button>
            <Button onClick={createFile}>创建</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 文件预览对话框 */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {selectedFile?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedFile?.path}
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted rounded-lg p-4 max-h-96 overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">{previewContent}</pre>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
              关闭
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              下载
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
