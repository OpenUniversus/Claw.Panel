'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { AppLayout } from '@/components/layout/layout-client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageSquare,
  Send,
  Paperclip,
  Image,
  Mic,
  Bot,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Sparkles,
  Settings,
  Plus,
  Trash2,
  ChevronLeft,
  MoreHorizontal,
  FolderOpen,
  Folder,
  Tag,
  Search,
  Share2,
  Download,
  Pin,
  Archive,
  Star,
  StarOff,
  Clock,
  Code,
  FileText,
  Check,
  X,
  Edit2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getMockChatSessions, getMockAIModels } from '@/lib/mock-data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

// 类型定义
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  model?: string;
  files?: FileAttachment[];
  reactions?: { type: string; count: number }[];
}

interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
}

interface ChatFolder {
  id: string;
  name: string;
  color: string;
  isExpanded: boolean;
  chatIds: string[];
}

interface ChatTag {
  id: string;
  name: string;
  color: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  model: string;
  createdAt: string;
  updatedAt: string;
  folderId?: string;
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
}

// Markdown 渲染组件
function MarkdownRenderer({ content }: { content: string }) {
  const renderContent = (text: string) => {
    // 简单的 Markdown 渲染
    const lines = text.split('\n');
    return lines.map((line, index) => {
      // 代码块
      if (line.startsWith('```')) {
        return (
          <div key={index} className="bg-muted rounded-md p-2 my-1 font-mono text-xs overflow-x-auto">
            <code>{line.replace(/```/g, '')}</code>
          </div>
        );
      }
      // 标题
      if (line.startsWith('### ')) {
        return <h4 key={index} className="font-semibold text-base mt-2">{line.slice(4)}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={index} className="font-semibold text-lg mt-2">{line.slice(3)}</h3>;
      }
      if (line.startsWith('# ')) {
        return <h2 key={index} className="font-bold text-xl mt-2">{line.slice(2)}</h2>;
      }
      // 列表
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return <li key={index} className="ml-4 list-disc">{line.slice(2)}</li>;
      }
      if (/^\d+\. /.test(line)) {
        return <li key={index} className="ml-4 list-decimal">{line.replace(/^\d+\. /, '')}</li>;
      }
      // 粗体
      if (line.includes('**')) {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={index} className="my-0.5">
            {parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}
          </p>
        );
      }
      // 行内代码
      if (line.includes('`')) {
        const parts = line.split(/`(.*?)`/g);
        return (
          <p key={index} className="my-0.5">
            {parts.map((part, i) => (i % 2 === 1 ? <code key={i} className="bg-muted px-1 rounded text-xs">{part}</code> : part))}
          </p>
        );
      }
      return <p key={index} className="my-0.5">{line}</p>;
    });
  };

  return <div className="text-sm leading-relaxed">{renderContent(content)}</div>;
}

// 消息气泡组件
function MessageBubble({
  message,
  isLast,
  onCopy,
  onRegenerate,
}: {
  message: Message;
  isLast?: boolean;
  onCopy: (content: string) => void;
  onRegenerate?: () => void;
}) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    onCopy(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        'flex gap-3 p-4 rounded-xl transition-colors',
        isUser ? 'bg-primary/5' : 'bg-muted/50'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-gradient-to-br from-violet-500 to-purple-600 text-white'
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">
            {isUser ? '你' : 'AI 助手'}
          </span>
          {!isUser && message.model && (
            <Badge variant="outline" className="text-xs">
              {message.model}
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            {message.timestamp}
          </span>
        </div>
        
        {/* Message Content */}
        {isAssistant ? (
          <MarkdownRenderer content={message.content} />
        ) : (
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
        )}

        {/* File Attachments */}
        {message.files && message.files.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {message.files.map((file) => (
              <Badge key={file.id} variant="secondary" className="gap-1">
                <FileText className="h-3 w-3" />
                {file.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        {isAssistant && (
          <div className="flex items-center gap-1 mt-3">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopy}>
              {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ThumbsUp className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ThumbsDown className="h-3.5 w-3.5" />
            </Button>
            {isLast && onRegenerate && (
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onRegenerate}>
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// 文件夹项组件
function FolderItem({
  folder,
  sessions,
  isActive,
  isExpanded,
  onClick,
  onToggle,
}: {
  folder: ChatFolder;
  sessions: ChatSession[];
  isActive: boolean;
  isExpanded: boolean;
  onClick: () => void;
  onToggle: () => void;
}) {
  const folderSessions = sessions.filter((s) => s.folderId === folder.id);

  return (
    <div>
      <button
        onClick={onToggle}
        className={cn(
          'w-full text-left p-2 rounded-lg transition-colors flex items-center gap-2',
          isActive ? 'bg-primary/10' : 'hover:bg-muted/50'
        )}
      >
        {isExpanded ? (
          <FolderOpen className="h-4 w-4" style={{ color: folder.color }} />
        ) : (
          <Folder className="h-4 w-4" style={{ color: folder.color }} />
        )}
        <span className="text-sm font-medium flex-1">{folder.name}</span>
        <Badge variant="outline" className="text-xs">
          {folderSessions.length}
        </Badge>
      </button>
      {isExpanded && (
        <div className="ml-4 mt-1 space-y-1">
          {folderSessions.map((session) => (
            <button
              key={session.id}
              onClick={onClick}
              className="w-full text-left p-2 rounded-lg hover:bg-muted/50 text-sm truncate"
            >
              {session.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// 会话项组件
function SessionItem({
  session,
  isActive,
  onClick,
  onPin,
  onArchive,
  onDelete,
  onMoveToFolder,
  folders,
}: {
  session: ChatSession;
  isActive: boolean;
  onClick: () => void;
  onPin: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onMoveToFolder: (folderId: string) => void;
  folders: ChatFolder[];
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-3 rounded-lg transition-colors group',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'hover:bg-muted/50 text-foreground'
      )}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <MessageSquare className="h-4 w-4 flex-shrink-0" />
          {session.isPinned && (
            <Pin className="h-2.5 w-2.5 absolute -top-1 -right-1 text-amber-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{session.title}</p>
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">
              {session.messages.length} 条消息
            </p>
            {session.tags.length > 0 && (
              <div className="flex gap-1">
                {session.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-[10px] px-1">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onPin(); }}>
              {session.isPinned ? (
                <>
                  <Pin className="h-4 w-4 mr-2 text-amber-500" />
                  取消置顶
                </>
              ) : (
                <>
                  <Pin className="h-4 w-4 mr-2" />
                  置顶对话
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive(); }}>
              <Archive className="h-4 w-4 mr-2" />
              {session.isArchived ? '取消归档' : '归档'}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2 className="h-4 w-4 mr-2" />
              分享对话
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="h-4 w-4 mr-2" />
              导出对话
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <FolderOpen className="h-4 w-4 mr-2" />
                移动到文件夹
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {folders.map((folder) => (
                  <DropdownMenuItem
                    key={folder.id}
                    onClick={(e) => { e.stopPropagation(); onMoveToFolder(folder.id); }}
                  >
                    <Folder className="h-4 w-4 mr-2" style={{ color: folder.color }} />
                    {folder.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
              <Trash2 className="h-4 w-4 mr-2" />
              删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </button>
  );
}

export default function AIChatPage() {
  const sessions = getMockChatSessions() as ChatSession[];
  const models = getMockAIModels();
  
  // 状态
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(
    sessions[0] || null
  );
  const [allSessions, setAllSessions] = useState<ChatSession[]>(sessions);
  const [inputValue, setInputValue] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [editingTitle, setEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  
  // 文件夹状态
  const [folders, setFolders] = useState<ChatFolder[]>([
    { id: 'folder-1', name: '工作相关', color: '#3b82f6', isExpanded: true, chatIds: [] },
    { id: 'folder-2', name: '代码助手', color: '#10b981', isExpanded: true, chatIds: [] },
    { id: 'folder-3', name: '学习笔记', color: '#8b5cf6', isExpanded: false, chatIds: [] },
  ]);
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['folder-1', 'folder-2']);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  // 过滤会话
  const filteredSessions = allSessions.filter((session) => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.messages.some((m) => m.content.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === 'pinned') return matchesSearch && session.isPinned;
    if (activeTab === 'archived') return matchesSearch && session.isArchived;
    return matchesSearch && !session.isArchived;
  });

  // 排序：置顶在前
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  // 发送消息
  const handleSend = useCallback(() => {
    if (!inputValue.trim() || !currentSession) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      model: selectedModel,
    };

    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, newMessage],
      updatedAt: new Date().toISOString(),
    };

    setCurrentSession(updatedSession);
    setAllSessions((prev) =>
      prev.map((s) => (s.id === updatedSession.id ? updatedSession : s))
    );
    setInputValue('');
    setIsLoading(true);

    // 模拟 AI 响应
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(inputValue),
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        model: selectedModel,
      };

      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, aiMessage],
      };

      setCurrentSession(finalSession);
      setAllSessions((prev) =>
        prev.map((s) => (s.id === finalSession.id ? finalSession : s))
      );
      setIsLoading(false);
    }, 1500);
  }, [inputValue, currentSession, selectedModel]);

  // 生成 AI 响应
  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('代码') || input.includes('编程')) {
      return `好的，我来帮您编写代码：

\`\`\`python
# 示例 Python 代码
def hello_world():
    print("Hello, World!")
    
if __name__ == "__main__":
    hello_world()
\`\`\`

这段代码会输出 "Hello, World!"。需要我解释更多吗？`;
    }
    
    if (input.includes('容器') || input.includes('docker')) {
      return `关于容器管理，我可以帮助您：

1. **查看容器状态**：使用 \`docker ps\` 查看运行中的容器
2. **容器生命周期管理**：start、stop、restart、remove 等操作
3. **资源监控**：CPU、内存、网络等资源使用情况
4. **日志查看**：实时或历史日志分析

您需要我帮您执行什么操作？`;
    }

    return `您好！我是 Claw Panel AI 助手，很高兴为您服务。

我可以帮助您：
- 🖥️ **服务器运维**：系统监控、日志分析、故障排查
- 🐳 **容器管理**：Docker 容器的创建、部署、监控
- 🗄️ **数据库管理**：MySQL、PostgreSQL、Redis 等数据库管理
- 🌐 **网站管理**：Nginx 配置、SSL 证书、域名管理
- 🤖 **AI 能力**：代码生成、文档分析、智能问答

请告诉我您需要什么帮助？`;
  };

  // 新建对话
  const handleNewChat = useCallback(() => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: '新对话',
      messages: [],
      model: selectedModel,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      isPinned: false,
      isArchived: false,
    };
    setAllSessions((prev) => [newSession, ...prev]);
    setCurrentSession(newSession);
  }, [selectedModel]);

  // 切换置顶
  const togglePin = useCallback((sessionId: string) => {
    setAllSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId ? { ...s, isPinned: !s.isPinned } : s
      )
    );
  }, []);

  // 切换归档
  const toggleArchive = useCallback((sessionId: string) => {
    setAllSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId ? { ...s, isArchived: !s.isArchived } : s
      )
    );
  }, []);

  // 删除会话
  const deleteSession = useCallback((sessionId: string) => {
    setAllSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (currentSession?.id === sessionId) {
      setCurrentSession(allSessions.find((s) => s.id !== sessionId) || null);
    }
  }, [currentSession, allSessions]);

  // 移动到文件夹
  const moveToFolder = useCallback((sessionId: string, folderId: string) => {
    setAllSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId ? { ...s, folderId } : s
      )
    );
  }, []);

  // 切换文件夹展开状态
  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) =>
      prev.includes(folderId)
        ? prev.filter((id) => id !== folderId)
        : [...prev, folderId]
    );
  };

  // 更新会话标题
  const updateSessionTitle = () => {
    if (currentSession && newTitle.trim()) {
      const updated = { ...currentSession, title: newTitle.trim() };
      setCurrentSession(updated);
      setAllSessions((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      );
    }
    setEditingTitle(false);
  };

  const availableModels = models.filter((m) => m.enabled).flatMap((m) => m.models);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div
        className={cn(
          'flex flex-col border-r bg-muted/30 transition-all duration-300',
          sidebarOpen ? 'w-72' : 'w-0'
        )}
      >
        {sidebarOpen && (
          <>
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold">对话</h2>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <FolderOpen className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSidebarOpen(false)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索对话..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* New Chat Button */}
            <div className="p-2">
              <Button className="w-full" onClick={handleNewChat}>
                <Plus className="h-4 w-4 mr-2" />
                新对话
              </Button>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="px-2">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1 text-xs">全部</TabsTrigger>
                <TabsTrigger value="pinned" className="flex-1 text-xs">
                  <Pin className="h-3 w-3 mr-1" />
                  置顶
                </TabsTrigger>
                <TabsTrigger value="archived" className="flex-1 text-xs">归档</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Session List */}
            <ScrollArea className="flex-1 p-2">
              {/* Folders */}
              <div className="mb-4">
                {folders.map((folder) => (
                  <FolderItem
                    key={folder.id}
                    folder={folder}
                    sessions={allSessions}
                    isActive={currentSession?.folderId === folder.id}
                    isExpanded={expandedFolders.includes(folder.id)}
                    onClick={() => {
                      const firstSession = allSessions.find((s) => s.folderId === folder.id);
                      if (firstSession) setCurrentSession(firstSession);
                    }}
                    onToggle={() => toggleFolder(folder.id)}
                  />
                ))}
              </div>

              <Separator className="my-2" />

              {/* Sessions */}
              <div className="space-y-1">
                {sortedSessions.map((session) => (
                  <SessionItem
                    key={session.id}
                    session={session}
                    isActive={currentSession?.id === session.id}
                    onClick={() => setCurrentSession(session)}
                    onPin={() => togglePin(session.id)}
                    onArchive={() => toggleArchive(session.id)}
                    onDelete={() => deleteSession(session.id)}
                    onMoveToFolder={(folderId) => moveToFolder(session.id, folderId)}
                    folders={folders}
                  />
                ))}
              </div>
            </ScrollArea>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                <MessageSquare className="h-4 w-4" />
              </Button>
            )}
            <div>
              {editingTitle && currentSession ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="h-8 w-48"
                    autoFocus
                  />
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={updateSessionTitle}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingTitle(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="font-semibold">
                    {currentSession?.title || '新对话'}
                  </h1>
                  {currentSession && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => {
                        setNewTitle(currentSession.title);
                        setEditingTitle(true);
                      }}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                {currentSession?.messages.length || 0} 条消息
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
            >
              {availableModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {currentSession?.messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold mb-2">AI 助手</h2>
                <p className="text-muted-foreground max-w-md">
                  我可以回答问题、编写代码、分析数据、创作内容等。请随时向我提问！
                </p>
                <div className="grid grid-cols-2 gap-2 mt-6 max-w-md">
                  {[
                    { icon: Code, text: '帮我写一段代码', prompt: '帮我写一段 Python 代码' },
                    { icon: Bot, text: '解释机器学习', prompt: '解释什么是机器学习' },
                    { icon: FileText, text: '帮我翻译英文', prompt: '帮我翻译一段英文' },
                    { icon: Sparkles, text: '写一篇 AI 文章', prompt: '写一篇关于 AI 的文章' },
                  ].map((item) => (
                    <Button
                      key={item.text}
                      variant="outline"
                      className="h-auto py-3 text-left justify-start"
                      onClick={() => setInputValue(item.prompt)}
                    >
                      <item.icon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-xs">{item.text}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {currentSession?.messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                isLast={index === currentSession.messages.length - 1}
                onCopy={() => {}}
                onRegenerate={index === currentSession.messages.length - 1 ? () => {} : undefined}
              />
            ))}
            {isLoading && (
              <div className="flex gap-3 p-4 rounded-xl bg-muted/50">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm text-muted-foreground">正在思考...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <Textarea
                  placeholder="输入消息... (Shift+Enter 换行)"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  className="min-h-[44px] max-h-32 pr-24 resize-none"
                  rows={1}
                />
                <div className="absolute right-2 bottom-2 flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Image className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button
                size="icon"
                className="h-11 w-11"
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              按 Enter 发送，Shift + Enter 换行
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
