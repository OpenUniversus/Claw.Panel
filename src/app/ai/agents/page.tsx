'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { FormDialog, FormField } from '@/components/dialogs';
import {
  Plus,
  Bot,
  Edit,
  Trash2,
  Copy,
  MessageSquare,
} from 'lucide-react';

// 定义 Agent 类型
interface AgentItem {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  model: string;
  temperature: number;
  maxTokens: number;
  tools: string[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

// 模拟数据
const mockAgents: AgentItem[] = [
  {
    id: '1',
    name: '系统运维助手',
    description: '专业的服务器运维助手，可以帮助诊断系统问题、优化配置、处理故障等',
    systemPrompt: '你是一个专业的服务器运维助手...',
    model: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 4096,
    tools: ['terminal', 'file_manager', 'docker'],
    enabled: true,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
  },
  {
    id: '2',
    name: '代码审查专家',
    description: '资深代码审查专家，可以审查代码质量、发现潜在问题、提供优化建议',
    systemPrompt: '你是一个资深的代码审查专家...',
    model: 'claude-3-opus',
    temperature: 0.5,
    maxTokens: 8192,
    tools: ['code_analyzer', 'git'],
    enabled: true,
    createdAt: '2024-01-12T09:00:00Z',
    updatedAt: '2024-01-22T14:20:00Z',
  },
  {
    id: '3',
    name: '数据库管理员',
    description: '专业的数据库管理员，可以帮助优化 SQL、设计表结构、处理性能问题',
    systemPrompt: '你是一个专业的数据库管理员...',
    model: 'gpt-4-turbo',
    temperature: 0.6,
    maxTokens: 4096,
    tools: ['mysql', 'postgresql', 'redis'],
    enabled: true,
    createdAt: '2024-01-14T10:00:00Z',
    updatedAt: '2024-01-23T11:15:00Z',
  },
  {
    id: '4',
    name: '安全审计员',
    description: '网络安全专家，可以帮助进行安全审计、漏洞扫描、合规检查',
    systemPrompt: '你是一个网络安全专家...',
    model: 'claude-3-sonnet',
    temperature: 0.4,
    maxTokens: 4096,
    tools: ['security_scanner', 'log_analyzer'],
    enabled: false,
    createdAt: '2024-01-16T11:00:00Z',
    updatedAt: '2024-01-24T09:45:00Z',
  },
];

const availableTools = [
  { id: 'terminal', name: '终端命令', icon: '💻' },
  { id: 'file_manager', name: '文件管理', icon: '📁' },
  { id: 'docker', name: 'Docker', icon: '🐳' },
  { id: 'git', name: 'Git', icon: '📦' },
  { id: 'code_analyzer', name: '代码分析', icon: '🔍' },
  { id: 'mysql', name: 'MySQL', icon: '🗄️' },
  { id: 'postgresql', name: 'PostgreSQL', icon: '🐘' },
  { id: 'redis', name: 'Redis', icon: '⚡' },
  { id: 'security_scanner', name: '安全扫描', icon: '🛡️' },
  { id: 'log_analyzer', name: '日志分析', icon: '📊' },
];

export default function AIAgentsPage() {
  const [agents, setAgents] = useState<AgentItem[]>(mockAgents);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AgentItem | null>(null);

  // 表单状态
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    systemPrompt: '',
    model: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 4096,
    tools: [] as string[],
  });

  // 过滤 Agent
  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = (id: string) => {
    setAgents(
      agents.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const handleAdd = () => {
    const newAgent: AgentItem = {
      id: String(Date.now()),
      ...formData,
      enabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAgents([...agents, newAgent]);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!editingAgent) return;
    setAgents(
      agents.map((a) =>
        a.id === editingAgent.id
          ? { ...a, ...formData, updatedAt: new Date().toISOString() }
          : a
      )
    );
    setEditingAgent(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setAgents(agents.filter((a) => a.id !== id));
  };

  const handleDuplicate = (agent: AgentItem) => {
    const newAgent: AgentItem = {
      ...agent,
      id: String(Date.now()),
      name: `${agent.name} (副本)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAgents([...agents, newAgent]);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      systemPrompt: '',
      model: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 4096,
      tools: [],
    });
  };

  const openEditDialog = (agent: AgentItem) => {
    setEditingAgent(agent);
    setFormData({
      name: agent.name,
      description: agent.description,
      systemPrompt: agent.systemPrompt,
      model: agent.model,
      temperature: agent.temperature,
      maxTokens: agent.maxTokens,
      tools: agent.tools,
    });
  };

  const toggleTool = (toolId: string) => {
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.includes(toolId)
        ? prev.tools.filter((t) => t !== toolId)
        : [...prev.tools, toolId],
    }));
  };

  return (
    <div className="space-y-6">
      {/* 页头 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Agent 管理</h1>
          <p className="text-muted-foreground">创建和管理自定义 AI 智能体</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          创建 Agent
        </Button>
      </div>

      {/* 搜索 */}
      <div className="relative max-w-sm">
        <MessageSquare className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="搜索 Agent..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Agent 列表 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAgents.map((agent) => (
          <Card key={agent.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{agent.model}</p>
                  </div>
                </div>
                <Switch
                  checked={agent.enabled}
                  onCheckedChange={() => handleToggle(agent.id)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="line-clamp-2">
                {agent.description}
              </CardDescription>

              {/* 工具标签 */}
              <div className="flex flex-wrap gap-1">
                {agent.tools.slice(0, 4).map((toolId) => {
                  const tool = availableTools.find((t) => t.id === toolId);
                  return tool ? (
                    <Badge key={toolId} variant="outline" className="text-xs">
                      {tool.icon} {tool.name}
                    </Badge>
                  ) : null;
                })}
                {agent.tools.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{agent.tools.length - 4}
                  </Badge>
                )}
              </div>

              {/* 配置参数 */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>温度: {agent.temperature}</span>
                <span>最大输出: {agent.maxTokens}</span>
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" className="flex-1">
                  <MessageSquare className="mr-1 h-3 w-3" />
                  对话
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditDialog(agent)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDuplicate(agent)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => handleDelete(agent.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 添加 Agent 对话框 */}
      <FormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        title="创建 AI Agent"
        description="配置一个全新的 AI 智能体"
        onSubmit={handleAdd}
        submitText="创建"
      >
        <div className="grid gap-4">
          <FormField
            label="名称"
            name="name"
            value={formData.name}
            onChange={(v) => setFormData({ ...formData, name: v })}
            placeholder="例如：系统运维助手"
            required
          />
          <FormField
            label="描述"
            name="description"
            value={formData.description}
            onChange={(v) => setFormData({ ...formData, description: v })}
            placeholder="简要描述 Agent 的功能..."
            required
          />
          <div className="space-y-2">
            <Label>系统提示词</Label>
            <Textarea
              placeholder="定义 Agent 的角色、行为和能力..."
              value={formData.systemPrompt}
              onChange={(e) =>
                setFormData({ ...formData, systemPrompt: e.target.value })
              }
              rows={4}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>模型</Label>
              <Select
                value={formData.model}
                onValueChange={(v) => setFormData({ ...formData, model: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                  <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                  <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                  <SelectItem value="llama3:70b">Llama 3 70B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <FormField
              label="温度"
              name="temperature"
              type="number"
              value={String(formData.temperature)}
              onChange={(v) =>
                setFormData({ ...formData, temperature: Number(v) })
              }
            />
          </div>
          <FormField
            label="最大输出 Token"
            name="maxTokens"
            type="number"
            value={String(formData.maxTokens)}
            onChange={(v) =>
              setFormData({ ...formData, maxTokens: Number(v) })
            }
          />
          <div className="space-y-2">
            <Label>可用工具</Label>
            <div className="flex flex-wrap gap-2">
              {availableTools.map((tool) => (
                <Badge
                  key={tool.id}
                  variant={formData.tools.includes(tool.id) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleTool(tool.id)}
                >
                  {tool.icon} {tool.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </FormDialog>

      {/* 编辑 Agent 对话框 */}
      <FormDialog
        open={!!editingAgent}
        onOpenChange={(open) => !open && setEditingAgent(null)}
        title="编辑 AI Agent"
        description="修改 Agent 配置"
        onSubmit={handleEdit}
        submitText="保存"
      >
        <div className="grid gap-4">
          <FormField
            label="名称"
            name="name"
            value={formData.name}
            onChange={(v) => setFormData({ ...formData, name: v })}
            required
          />
          <FormField
            label="描述"
            name="description"
            value={formData.description}
            onChange={(v) => setFormData({ ...formData, description: v })}
            required
          />
          <div className="space-y-2">
            <Label>系统提示词</Label>
            <Textarea
              value={formData.systemPrompt}
              onChange={(e) =>
                setFormData({ ...formData, systemPrompt: e.target.value })
              }
              rows={4}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>模型</Label>
              <Select
                value={formData.model}
                onValueChange={(v) => setFormData({ ...formData, model: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                  <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                  <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                  <SelectItem value="llama3:70b">Llama 3 70B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <FormField
              label="温度"
              name="temperature"
              type="number"
              value={String(formData.temperature)}
              onChange={(v) =>
                setFormData({ ...formData, temperature: Number(v) })
              }
            />
          </div>
          <FormField
            label="最大输出 Token"
            name="maxTokens"
            type="number"
            value={String(formData.maxTokens)}
            onChange={(v) =>
              setFormData({ ...formData, maxTokens: Number(v) })
            }
          />
          <div className="space-y-2">
            <Label>可用工具</Label>
            <div className="flex flex-wrap gap-2">
              {availableTools.map((tool) => (
                <Badge
                  key={tool.id}
                  variant={formData.tools.includes(tool.id) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleTool(tool.id)}
                >
                  {tool.icon} {tool.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </FormDialog>
    </div>
  );
}
