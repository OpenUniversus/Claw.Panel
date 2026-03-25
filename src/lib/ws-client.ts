import type { IncomingMessage } from 'http';
import type { Duplex } from 'stream';
import { WebSocketServer, WebSocket } from 'ws';

export interface WsMessage<T = unknown> {
  type: string;
  payload: T;
}

export type WsMessageHandler = (msg: WsMessage) => void;

export interface WsOptions {
  path: string;
  onMessage: WsMessageHandler;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Error) => void;
  reconnect?: boolean;
  reconnectInterval?: number;
  heartbeatMs?: number;
}

const wssMap = new Map<string, WebSocketServer>();

export function registerWsEndpoint(path: string): WebSocketServer {
  const wss = new WebSocketServer({ noServer: true });
  wssMap.set(path, wss);
  return wss;
}

export function handleUpgrade(req: IncomingMessage, socket: Duplex, head: Buffer) {
  const { pathname } = new URL(req.url!, `http://${req.headers.host}`);
  const wss = wssMap.get(pathname);
  if (wss) {
    wss.handleUpgrade(req, socket, head, (ws) => wss.emit('connection', ws, req));
  }
}

// 客户端连接工具（浏览器端使用）
export function createWsConnection(opts: WsOptions): {
  send: (msg: WsMessage) => void;
  close: () => void;
  isConnected: () => boolean;
} {
  const {
    path,
    onMessage,
    onOpen,
    onClose,
    onError,
    reconnect = true,
    reconnectInterval = 1000,
    heartbeatMs = 30000,
  } = opts;

  // 使用浏览器原生的 WebSocket
  type BrowserWebSocket = InstanceType<typeof globalThis.WebSocket>;
  let ws: BrowserWebSocket | null = null;
  let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let closed = false;

  function connect() {
    if (typeof window === 'undefined') return;

    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${location.host}${path}`;

    ws = new globalThis.WebSocket(wsUrl);

    ws.onopen = () => {
      heartbeatTimer = setInterval(() => {
        if (ws && ws.readyState === globalThis.WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'ping', payload: null }));
        }
      }, heartbeatMs);
      onOpen?.();
    };

    ws.onmessage = (e) => {
      try {
        const msg: WsMessage = JSON.parse(e.data);
        if (msg.type === 'pong') return;
        onMessage(msg);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      if (heartbeatTimer) {
        clearInterval(heartbeatTimer);
        heartbeatTimer = null;
      }
      onClose?.();
      if (reconnect && !closed) {
        reconnectTimer = setTimeout(connect, reconnectInterval);
      }
    };

    ws.onerror = () => {
      onError?.(new Error('WebSocket connection error'));
    };
  }

  connect();

  return {
    send: (msg: WsMessage) => {
      if (ws && ws.readyState === globalThis.WebSocket.OPEN) {
        ws.send(JSON.stringify(msg));
      }
    },
    close: () => {
      closed = true;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
      if (heartbeatTimer) {
        clearInterval(heartbeatTimer);
        heartbeatTimer = null;
      }
      if (ws) {
        ws.close();
        ws = null;
      }
    },
    isConnected: () => ws !== null && ws.readyState === globalThis.WebSocket.OPEN,
  };
}
