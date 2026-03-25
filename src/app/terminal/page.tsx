'use client';

import { useEffect, useRef, useState } from 'react';
import { AppLayout } from '@/components/layout/layout-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Terminal as TerminalIcon,
  Maximize2,
  Minimize2,
  RotateCcw,
  Settings,
  Copy,
  Download,
  Plus,
  X,
} from 'lucide-react';
import { Terminal } from 'xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import 'xterm/css/xterm.css';

interface TerminalSession {
  id: string;
  name: string;
  terminal: Terminal;
  fitAddon: FitAddon;
  ws: WebSocket | null;
  connected: boolean;
}

interface WsMessage {
  type: string;
  payload: unknown;
}

export default function TerminalPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sessions, setSessions] = useState<TerminalSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const createSession = () => {
    const sessionId = `term-${Date.now()}`;
    const terminal = new Terminal({
      theme: {
        background: '#1a1a2e',
        foreground: '#eaeaea',
        cursor: '#ffffff',
        cursorAccent: '#1a1a2e',
        selectionBackground: 'rgba(255, 255, 255, 0.3)',
        black: '#000000',
        red: '#e06c75',
        green: '#98c379',
        yellow: '#d19a66',
        blue: '#61afef',
        magenta: '#c678dd',
        cyan: '#56b6c2',
        white: '#abb2bf',
        brightBlack: '#5c6370',
        brightRed: '#e06c75',
        brightGreen: '#98c379',
        brightYellow: '#d19a66',
        brightBlue: '#61afef',
        brightMagenta: '#c678dd',
        brightCyan: '#56b6c2',
        brightWhite: '#ffffff',
      },
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      fontSize: 14,
      lineHeight: 1.2,
      cursorBlink: true,
      cursorStyle: 'block',
      scrollback: 10000,
    });

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.loadAddon(new WebLinksAddon());

    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${location.host}/ws/terminal?session=${sessionId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setSessions(prev =>
        prev.map(s => (s.id === sessionId ? { ...s, connected: true } : s))
      );
    };

    ws.onmessage = (event) => {
      try {
        const msg: WsMessage = JSON.parse(event.data);
        if (msg.type === 'output') {
          terminal.write(msg.payload as string);
        }
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    };

    ws.onclose = () => {
      setSessions(prev =>
        prev.map(s => (s.id === sessionId ? { ...s, connected: false } : s))
      );
    };

    terminal.onData((data) => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'input', payload: data }));
      }
    });

    terminal.onResize(({ cols, rows }) => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'resize', payload: { cols, rows } }));
      }
    });

    const session: TerminalSession = {
      id: sessionId,
      name: `终端 ${sessions.length + 1}`,
      terminal,
      fitAddon,
      ws,
      connected: false,
    };

    setSessions(prev => [...prev, session]);
    setActiveSessionId(sessionId);

    return session;
  };

  useEffect(() => {
    // 创建第一个会话
    if (sessions.length === 0) {
      createSession();
    }
  }, []);

  useEffect(() => {
    // 将终端附加到容器
    const activeSession = sessions.find(s => s.id === activeSessionId);
    if (activeSession && containerRef.current) {
      // 清空容器
      containerRef.current.innerHTML = '';
      // 打开终端
      if (!activeSession.terminal.element) {
        activeSession.terminal.open(containerRef.current);
      } else {
        containerRef.current.appendChild(activeSession.terminal.element);
      }
      // 自适应大小
      setTimeout(() => {
        activeSession.fitAddon.fit();
      }, 100);
    }
  }, [activeSessionId, sessions]);

  useEffect(() => {
    // 监听窗口大小变化
    const handleResize = () => {
      const activeSession = sessions.find(s => s.id === activeSessionId);
      if (activeSession) {
        activeSession.fitAddon.fit();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeSessionId, sessions]);

  const closeSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      session.terminal.dispose();
      if (session.ws) {
        session.ws.close();
      }
    }
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      const remaining = sessions.filter(s => s.id !== sessionId);
      setActiveSessionId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const activeSession = sessions.find(s => s.id === activeSessionId);

  return (
    <AppLayout title="终端">
      <div className="h-[calc(100vh-6rem)] flex flex-col">
        {/* 工具栏 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {/* 会话标签 */}
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              {sessions.map(session => (
                <button
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${
                    session.id === activeSessionId
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <TerminalIcon className="h-3 w-3" />
                  <span>{session.name}</span>
                  <div
                    className={`h-2 w-2 rounded-full ${
                      session.connected ? 'bg-emerald-500' : 'bg-gray-400'
                    }`}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeSession(session.id);
                    }}
                    className="ml-1 hover:bg-muted-foreground/20 rounded p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={createSession}
                className="h-7 px-2"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeSession && (
              <Badge variant={activeSession.connected ? 'default' : 'secondary'}>
                {activeSession.connected ? '已连接' : '断开连接'}
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={() => {
              if (activeSession) {
                activeSession.terminal.clear();
              }
            }}>
              <RotateCcw className="h-4 w-4 mr-1" />
              清屏
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4 mr-1" />
              ) : (
                <Maximize2 className="h-4 w-4 mr-1" />
              )}
              {isFullscreen ? '退出全屏' : '全屏'}
            </Button>
          </div>
        </div>

        {/* 终端容器 */}
        <Card className={`flex-1 overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
          <CardContent className="p-0 h-full">
            <div
              ref={containerRef}
              className="h-full w-full bg-[#1a1a2e]"
              style={{ minHeight: '400px' }}
            />
          </CardContent>
        </Card>

        {/* 快捷命令 */}
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">快捷命令</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'docker ps', cmd: 'docker ps' },
              { label: 'docker logs', cmd: 'docker logs --tail 100 ' },
              { label: '查看日志', cmd: 'tail -f /var/log/panel.log' },
              { label: '系统状态', cmd: 'top -n 1' },
              { label: '磁盘使用', cmd: 'df -h' },
              { label: '内存使用', cmd: 'free -h' },
            ].map(item => (
              <Button
                key={item.cmd}
                variant="outline"
                size="sm"
                onClick={() => {
                  if (activeSession && activeSession.ws) {
                    activeSession.ws.send(JSON.stringify({ type: 'input', payload: item.cmd }));
                    activeSession.ws.send(JSON.stringify({ type: 'input', payload: '\r' }));
                  }
                }}
                className="font-mono"
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
