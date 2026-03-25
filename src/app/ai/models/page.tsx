'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FormDialog, FormField } from '@/components/dialogs';
import {
  Plus,
  Search,
  Settings,
  Trash2,
  Edit,
  TestTube,
  RefreshCw,
  ExternalLink,
  Zap,
} from 'lucide-react';

// 定义模型类型
interface ModelItem {
  id: string;
  name: string;
  displayName: string;
  provider: 'openai' | 'anthropic' | 'ollama' | 'deepseek';
  type: 'chat' | 'image' | 'audio' | 'embedding';
  contextWindow?: number;
  maxOutput?: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

// 模拟数据
const mockModels: ModelItem[] = [
  {
    id: '1',
    name: 'gpt-4o',
    displayName: 'GPT-4o',
    provider: 'openai',
    type: 'chat',
    contextWindow: 128000,
    maxOutput: 4096,
    enabled: true,
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
  },
  {
    id: '2',
    name: 'gpt-4-turbo',
    displayName: 'GPT-4 Turbo',
    provider: 'openai',
    type: 'chat',
    contextWindow: 128000,
    maxOutput: 4096,
    enabled: true,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T14:20:00Z',
  },
  {
    id: '3',
    name: 'claude-3-opus',
    displayName: 'Claude 3 Opus',
    provider: 'anthropic',
    type: 'chat',
    contextWindow: 200000,
    maxOutput: 4096,
    enabled: true,
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-22T09:15:00Z',
  },
  {
    id: '4',
    name: 'claude-3-sonnet',
    displayName: 'Claude 3 Sonnet',
    provider: 'anthropic',
    type: 'chat',
    contextWindow: 200000,
    maxOutput: 4096,
    enabled: true,
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-22T09:15:00Z',
  },
  {
    id: '5',
    name: 'llama3:70b',
    displayName: 'Llama 3 70B',
    provider: 'ollama',
    type: 'chat',
    contextWindow: 8192,
    maxOutput: 2048,
    enabled: true,
    createdAt: '2024-01-14T15:00:00Z',
    updatedAt: '2024-01-21T16:45:00Z',
  },
  {
    id: '6',
    name: 'dall-e-3',
    displayName: 'DALL-E 3',
    provider: 'openai',
    type: 'image',
    enabled: false,
    createdAt: '2024-01-08T10:00:00Z',
    updatedAt: '2024-01-10T11:30:00Z',
  },
  {
    id: '7',
    name: 'whisper-large-v3',
    displayName: 'Whisper Large V3',
    provider: 'openai',
    type: 'audio',
    enabled: true,
    createdAt: '2024-01-16T08:30:00Z',
    updatedAt: '2024-01-19T13:00:00Z',
  },
];

const providerColors: Record<string, string> = {
  openai: 'bg-green-500/10 text-green-600 hover:bg-green-500/20',
  anthropic: 'bg-orange-500/10 text-orange-600 hover:bg-orange-500/20',
  ollama: 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20',
  deepseek: 'bg-purple-500/10 text-purple-600 hover:bg-purple-500/20',
};

const typeColors: Record<string, string> = {
  chat: 'bg-blue-500/10 text-blue-600',
  image: 'bg-pink-500/10 text-pink-600',
  audio: 'bg-yellow-500/10 text-yellow-600',
  embedding: 'bg-green-500/10 text-green-600',
};

export default function AIModelsPage() {
  const [models, setModels] = useState<ModelItem[]>(mockModels);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProvider, setFilterProvider] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<ModelItem | null>(null);
  const [testingModel, setTestingModel] = useState<string | null>(null);

  // 表单状态
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    provider: 'openai' as 'openai' | 'anthropic' | 'ollama' | 'deepseek',
    type: 'chat' as 'chat' | 'image' | 'audio' | 'embedding',
    contextWindow: 8192,
    maxOutput: 2048,
  });

  // 过滤模型
  const filteredModels = models.filter((model) => {
    const matchSearch =
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchProvider = filterProvider === 'all' || model.provider === filterProvider;
    const matchType = filterType === 'all' || model.type === filterType;
    return matchSearch && matchProvider && matchType;
  });

  const handleToggle = (id: string) => {
    setModels(
      models.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
  };

  const handleTest = async (id: string) => {
    setTestingModel(id);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setTestingModel(null);
  };

  const handleAdd = () => {
    const newModel: ModelItem = {
      id: String(Date.now()),
      ...formData,
      enabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setModels([...models, newModel]);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!editingModel) return;
    setModels(
      models.map((m) =>
        m.id === editingModel.id
          ? { ...m, ...formData, updatedAt: new Date().toISOString() }
          : m
      )
    );
    setEditingModel(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setModels(models.filter((m) => m.id !== id));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      displayName: '',
      provider: 'openai',
      type: 'chat',
      contextWindow: 8192,
      maxOutput: 2048,
    });
  };

  const openEditDialog = (model: ModelItem) => {
    setEditingModel(model);
    setFormData({
      name: model.name,
      displayName: model.displayName,
      provider: model.provider,
      type: model.type,
      contextWindow: model.contextWindow || 8192,
      maxOutput: model.maxOutput || 2048,
    });
  };

  // 统计数据
  const stats = {
    total: models.length,
    enabled: models.filter((m) => m.enabled).length,
    providers: [...new Set(models.map((m) => m.provider))].length,
    types: [...new Set(models.map((m) => m.type))].length,
  };

  return (
    <div className="space-y-6">
      {/* 页头 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI 模型管理</h1>
          <p className="text-muted-foreground">管理和配置所有 AI 模型</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          添加模型
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">总模型数</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">已启用</p>
                <p className="text-2xl font-bold">{stats.enabled}</p>
              </div>
              <Zap className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">提供商</p>
                <p className="text-2xl font-bold">{stats.providers}</p>
              </div>
              <ExternalLink className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">模型类型</p>
                <p className="text-2xl font-bold">{stats.types}</p>
              </div>
              <Settings className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 过滤和搜索 */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索模型..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={filterProvider} onValueChange={setFilterProvider}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="提供商" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部提供商</SelectItem>
            <SelectItem value="openai">OpenAI</SelectItem>
            <SelectItem value="anthropic">Anthropic</SelectItem>
            <SelectItem value="ollama">Ollama</SelectItem>
            <SelectItem value="deepseek">DeepSeek</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部类型</SelectItem>
            <SelectItem value="chat">对话</SelectItem>
            <SelectItem value="image">图像</SelectItem>
            <SelectItem value="audio">音频</SelectItem>
            <SelectItem value="embedding">向量</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 模型表格 */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>模型名称</TableHead>
                <TableHead>提供商</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>上下文窗口</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredModels.map((model) => (
                <TableRow key={model.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                        {model.displayName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{model.displayName}</div>
                        <div className="text-xs text-muted-foreground">{model.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={providerColors[model.provider] || ''}>
                      {model.provider.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={typeColors[model.type] || ''}>
                      {model.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {model.contextWindow ? `${(model.contextWindow / 1000).toFixed(0)}K` : '-'}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={model.enabled}
                      onCheckedChange={() => handleToggle(model.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTest(model.id)}
                        disabled={testingModel === model.id}
                      >
                        {testingModel === model.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <TestTube className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(model)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDelete(model.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 添加模型对话框 */}
      <FormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        title="添加模型"
        description="配置新的 AI 模型"
        onSubmit={handleAdd}
        submitText="添加"
      >
        <div className="grid gap-4">
          <FormField
            label="模型名称"
            name="name"
            value={formData.name}
            onChange={(v) => setFormData({ ...formData, name: v })}
            placeholder="例如：gpt-4o"
            required
          />
          <FormField
            label="显示名称"
            name="displayName"
            value={formData.displayName}
            onChange={(v) => setFormData({ ...formData, displayName: v })}
            placeholder="例如：GPT-4o"
            required
          />
          <div className="space-y-2">
            <Label>提供商</Label>
            <Select
              value={formData.provider}
              onValueChange={(v) => setFormData({ ...formData, provider: v as typeof formData.provider })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
                <SelectItem value="ollama">Ollama</SelectItem>
                <SelectItem value="deepseek">DeepSeek</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>类型</Label>
            <Select
              value={formData.type}
              onValueChange={(v) => setFormData({ ...formData, type: v as typeof formData.type })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chat">对话</SelectItem>
                <SelectItem value="image">图像生成</SelectItem>
                <SelectItem value="audio">音频处理</SelectItem>
                <SelectItem value="embedding">向量嵌入</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="上下文窗口"
              name="contextWindow"
              type="number"
              value={String(formData.contextWindow)}
              onChange={(v) => setFormData({ ...formData, contextWindow: Number(v) })}
            />
            <FormField
              label="最大输出"
              name="maxOutput"
              type="number"
              value={String(formData.maxOutput)}
              onChange={(v) => setFormData({ ...formData, maxOutput: Number(v) })}
            />
          </div>
        </div>
      </FormDialog>

      {/* 编辑模型对话框 */}
      <FormDialog
        open={!!editingModel}
        onOpenChange={(open) => !open && setEditingModel(null)}
        title="编辑模型"
        description="修改模型配置"
        onSubmit={handleEdit}
        submitText="保存"
      >
        <div className="grid gap-4">
          <FormField
            label="模型名称"
            name="name"
            value={formData.name}
            onChange={(v) => setFormData({ ...formData, name: v })}
            required
          />
          <FormField
            label="显示名称"
            name="displayName"
            value={formData.displayName}
            onChange={(v) => setFormData({ ...formData, displayName: v })}
            required
          />
          <div className="space-y-2">
            <Label>提供商</Label>
            <Select
              value={formData.provider}
              onValueChange={(v) => setFormData({ ...formData, provider: v as typeof formData.provider })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
                <SelectItem value="ollama">Ollama</SelectItem>
                <SelectItem value="deepseek">DeepSeek</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>类型</Label>
            <Select
              value={formData.type}
              onValueChange={(v) => setFormData({ ...formData, type: v as typeof formData.type })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chat">对话</SelectItem>
                <SelectItem value="image">图像生成</SelectItem>
                <SelectItem value="audio">音频处理</SelectItem>
                <SelectItem value="embedding">向量嵌入</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="上下文窗口"
              name="contextWindow"
              type="number"
              value={String(formData.contextWindow)}
              onChange={(v) => setFormData({ ...formData, contextWindow: Number(v) })}
            />
            <FormField
              label="最大输出"
              name="maxOutput"
              type="number"
              value={String(formData.maxOutput)}
              onChange={(v) => setFormData({ ...formData, maxOutput: Number(v) })}
            />
          </div>
        </div>
      </FormDialog>
    </div>
  );
}
