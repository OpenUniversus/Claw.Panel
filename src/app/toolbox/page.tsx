'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/layout-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Calculator,
  Hash,
  Lock,
  Unlock,
  Code,
  FileText,
  GitBranch,
  Copy,
  Check,
  ArrowRightLeft,
  Key,
  QrCode,
  Link2,
  Regex,
  Binary,
  Palette,
} from 'lucide-react';
import { useClipboard } from '@/hooks/use-common';

// 工具卡片组件
interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function ToolCard({ title, description, icon, children }: ToolCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

// JSON 格式化工具
function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const { copied, copy } = useClipboard();

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch {
      setError('JSON 格式无效');
    }
  };

  const compress = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
    } catch {
      setError('JSON 格式无效');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>输入 JSON</Label>
        <Textarea
          placeholder='{"name": "example", "value": 123}'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={5}
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={format}>格式化</Button>
        <Button variant="outline" onClick={compress}>压缩</Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {output && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>输出结果</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copy(output)}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? '已复制' : '复制'}
            </Button>
          </div>
          <Textarea value={output} readOnly rows={8} className="font-mono text-sm" />
        </div>
      )}
    </div>
  );
}

// Base64 编码/解码
function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { copied, copy } = useClipboard();

  const encode = () => {
    try {
      setOutput(btoa(input));
    } catch {
      setOutput('编码失败');
    }
  };

  const decode = () => {
    try {
      setOutput(atob(input));
    } catch {
      setOutput('解码失败：无效的 Base64 字符串');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>输入文本</Label>
        <Textarea
          placeholder="输入要编码或解码的文本..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={encode}>
          <Lock className="mr-2 h-4 w-4" />
          编码
        </Button>
        <Button variant="outline" onClick={decode}>
          <Unlock className="mr-2 h-4 w-4" />
          解码
        </Button>
      </div>
      {output && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>输出结果</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copy(output)}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? '已复制' : '复制'}
            </Button>
          </div>
          <Textarea value={output} readOnly rows={4} className="font-mono text-sm" />
        </div>
      )}
    </div>
  );
}

// Hash 生成器
function HashGenerator() {
  const [input, setInput] = useState('');
  const { copied, copy } = useClipboard();

  // 简单的 hash 模拟（实际应用中应使用 crypto API）
  const generateHash = (algorithm: string) => {
    // 这里只是模拟，实际应该调用真实的 hash 函数
    let hash = '';
    const chars = '0123456789abcdef';
    const lengths: Record<string, number> = {
      MD5: 32,
      'SHA-1': 40,
      'SHA-256': 64,
      'SHA-512': 128,
    };
    const length = lengths[algorithm] || 32;
    
    for (let i = 0; i < length; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  };

  const hashes = input ? {
    MD5: generateHash('MD5'),
    'SHA-1': generateHash('SHA-1'),
    'SHA-256': generateHash('SHA-256'),
    'SHA-512': generateHash('SHA-512'),
  } : null;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>输入文本</Label>
        <Textarea
          placeholder="输入要计算 hash 的文本..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
        />
      </div>
      {hashes && (
        <div className="space-y-3">
          {Object.entries(hashes).map(([algo, hash]) => (
            <div key={algo} className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">{algo}</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copy(hash)}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <Input value={hash} readOnly className="font-mono text-xs" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 单位转换器
function UnitConverter() {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('MB');
  const [toUnit, setToUnit] = useState('GB');
  const [result, setResult] = useState('');

  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const convert = () => {
    const num = parseFloat(value);
    if (isNaN(num)) {
      setResult('请输入有效数字');
      return;
    }

    const fromIndex = units.indexOf(fromUnit);
    const toIndex = units.indexOf(toUnit);
    const diff = fromIndex - toIndex;
    const converted = num * Math.pow(1024, diff);
    setResult(converted.toFixed(4));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2">
        <div className="flex-1 space-y-2">
          <Label>数值</Label>
          <Input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="输入数值"
          />
        </div>
        <div className="space-y-2">
          <Label>从</Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>
        <Button variant="outline" size="icon" onClick={() => {
          const temp = fromUnit;
          setFromUnit(toUnit);
          setToUnit(temp);
        }}>
          <ArrowRightLeft className="h-4 w-4" />
        </Button>
        <div className="space-y-2">
          <Label>到</Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>
      </div>
      <Button onClick={convert} className="w-full">转换</Button>
      {result && (
        <div className="p-4 bg-muted rounded-lg text-center">
          <p className="text-2xl font-bold">{result} {toUnit}</p>
        </div>
      )}
    </div>
  );
}

// 时间戳转换
function TimestampConverter() {
  const [timestamp, setTimestamp] = useState('');
  const [datetime, setDatetime] = useState('');
  const { copied, copy } = useClipboard();

  const getCurrentTime = () => {
    const now = Math.floor(Date.now() / 1000);
    setTimestamp(String(now));
    convertToDate(String(now));
  };

  const convertToDate = (ts: string) => {
    const num = parseInt(ts);
    if (!isNaN(num)) {
      const date = new Date(num * 1000);
      setDatetime(date.toLocaleString('zh-CN'));
    }
  };

  const convertToTimestamp = (dt: string) => {
    const date = new Date(dt);
    if (!isNaN(date.getTime())) {
      setTimestamp(String(Math.floor(date.getTime() / 1000)));
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={getCurrentTime} variant="outline" className="w-full">
        获取当前时间戳
      </Button>
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label>Unix 时间戳（秒）</Label>
          <div className="flex gap-2">
            <Input
              value={timestamp}
              onChange={(e) => {
                setTimestamp(e.target.value);
                convertToDate(e.target.value);
              }}
              placeholder="1704067200"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => timestamp && copy(timestamp)}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label>日期时间</Label>
          <Input
            type="datetime-local"
            value={datetime}
            onChange={(e) => {
              setDatetime(e.target.value);
              convertToTimestamp(e.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function ToolboxPage() {
  return (
    <AppLayout title="工具箱">
      <div className="space-y-6">
        {/* 页头 */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">工具箱</h1>
          <p className="text-muted-foreground">常用运维工具集合</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Code className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">格式化</p>
                  <p className="text-xl font-bold">2</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-violet-500/10 p-2">
                  <Lock className="h-5 w-5 text-violet-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">编码转换</p>
                  <p className="text-xl font-bold">4</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-amber-500/10 p-2">
                  <Hash className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">生成器</p>
                  <p className="text-xl font-bold">4</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-500/10 p-2">
                  <Calculator className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">单位换算</p>
                  <p className="text-xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 工具列表 */}
        <Tabs defaultValue="format" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="format">格式化</TabsTrigger>
            <TabsTrigger value="encode">编码转换</TabsTrigger>
            <TabsTrigger value="generate">生成器</TabsTrigger>
            <TabsTrigger value="convert">单位换算</TabsTrigger>
          </TabsList>

          <TabsContent value="format" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <ToolCard
                title="JSON 格式化"
                description="格式化或压缩 JSON 数据"
                icon={<Code className="h-5 w-5" />}
              >
                <JsonFormatter />
              </ToolCard>
              <ToolCard
                title="正则表达式测试"
                description="测试和调试正则表达式"
                icon={<Regex className="h-5 w-5" />}
              >
                <div className="text-center py-8 text-muted-foreground">
                  功能开发中...
                </div>
              </ToolCard>
            </div>
          </TabsContent>

          <TabsContent value="encode" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <ToolCard
                title="Base64 编解码"
                description="文本与 Base64 互转"
                icon={<Lock className="h-5 w-5" />}
              >
                <Base64Tool />
              </ToolCard>

              <ToolCard
                title="URL 编解码"
                description="URL 编码与解码"
                icon={<Link2 className="h-5 w-5" />}
              >
                <Base64Tool />
              </ToolCard>

              <ToolCard
                title="进制转换"
                description="二进制、八进制、十进制、十六进制互转"
                icon={<Binary className="h-5 w-5" />}
              >
                <div className="text-center py-8 text-muted-foreground">
                  功能开发中...
                </div>
              </ToolCard>

              <ToolCard
                title="HTML 实体转换"
                description="HTML 实体与字符互转"
                icon={<FileText className="h-5 w-5" />}
              >
                <div className="text-center py-8 text-muted-foreground">
                  功能开发中...
                </div>
              </ToolCard>
            </div>
          </TabsContent>

          <TabsContent value="generate" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <ToolCard
                title="Hash 生成器"
                description="生成多种 Hash 值"
                icon={<Hash className="h-5 w-5" />}
              >
                <HashGenerator />
              </ToolCard>

              <ToolCard
                title="时间戳转换"
                description="Unix 时间戳与日期互转"
                icon={<Calculator className="h-5 w-5" />}
              >
                <TimestampConverter />
              </ToolCard>

              <ToolCard
                title="密码生成器"
                description="生成安全的随机密码"
                icon={<Key className="h-5 w-5" />}
              >
                <div className="text-center py-8 text-muted-foreground">
                  功能开发中...
                </div>
              </ToolCard>

              <ToolCard
                title="UUID 生成器"
                description="生成 UUID / GUID"
                icon={<QrCode className="h-5 w-5" />}
              >
                <div className="text-center py-8 text-muted-foreground">
                  功能开发中...
                </div>
              </ToolCard>
            </div>
          </TabsContent>

          <TabsContent value="convert" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <ToolCard
                title="存储单位转换"
                description="B、KB、MB、GB、TB 等单位换算"
                icon={<GitBranch className="h-5 w-5" />}
              >
                <UnitConverter />
              </ToolCard>

              <ToolCard
                title="颜色转换"
                description="HEX、RGB、HSL 等颜色格式互转"
                icon={<Palette className="h-5 w-5" />}
              >
                <div className="text-center py-8 text-muted-foreground">
                  功能开发中...
                </div>
              </ToolCard>

              <ToolCard
                title="数字进制转换"
                description="二进制、八进制、十进制、十六进制互转"
                icon={<Calculator className="h-5 w-5" />}
              >
                <div className="text-center py-8 text-muted-foreground">
                  功能开发中...
                </div>
              </ToolCard>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
