import { WebSocket, type WebSocketServer } from 'ws';
import type { WsMessage } from '../lib/ws-client';

// 终端会话管理
const sessions = new Map<string, TerminalSession>();

interface TerminalSession {
  id: string;
  cols: number;
  rows: number;
  cwd: string;
  history: string[];
  historyIndex: number;
  currentLine: string;
  created: Date;
}

// 模拟的命令输出
const commandOutputs: Record<string, (args: string[], session: TerminalSession) => string> = {
  help: () => `可用命令:
  help        - 显示帮助信息
  ls          - 列出目录内容
  cd <dir>    - 切换目录
  pwd         - 显示当前目录
  cat <file>  - 显示文件内容
  echo <text> - 输出文本
  clear       - 清屏
  date        - 显示当前时间
  whoami      - 显示当前用户
  hostname    - 显示主机名
  uname       - 显示系统信息
  df          - 显示磁盘使用情况
  free        - 显示内存使用情况
  ps          - 显示进程列表
  top         - 显示系统状态
  uptime      - 显示系统运行时间
  docker      - Docker 命令 (ps, images, logs)
  systemctl   - 系统服务管理 (status, start, stop, restart)
  curl        - HTTP 请求
  ping        - 网络测试
`,
  ls: (args, session) => {
    const dir = args[0] || session.cwd;
    const files: Record<string, string[]> = {
      '/': ['bin', 'boot', 'dev', 'etc', 'home', 'lib', 'media', 'mnt', 'opt', 'proc', 'root', 'run', 'sbin', 'srv', 'sys', 'tmp', 'usr', 'var'],
      '/home': ['user', 'admin', 'data'],
      '/root': ['.bashrc', '.bash_history', '.ssh', 'scripts', 'projects'],
      '/var': ['log', 'lib', 'cache', 'spool', 'tmp'],
      '/var/log': ['syslog', 'auth.log', 'kern.log', 'nginx', 'docker.log', 'panel.log'],
      '/etc': ['nginx', 'ssh', 'docker', 'systemd', 'hosts', 'hostname', 'passwd', 'shadow'],
    };
    const items = files[dir] || ['file1.txt', 'file2.log', 'directory1', 'directory2'];
    return items.map(item => item).join('  ');
  },
  cd: (args, session) => {
    const target = args[0] || '/root';
    if (target === '..') {
      const parts = session.cwd.split('/').filter(Boolean);
      parts.pop();
      session.cwd = '/' + parts.join('/');
    } else if (target.startsWith('/')) {
      session.cwd = target;
    } else {
      session.cwd = session.cwd === '/' ? `/${target}` : `${session.cwd}/${target}`;
    }
    return '';
  },
  pwd: (_, session) => session.cwd,
  cat: (args) => {
    const file = args[0];
    if (!file) return 'cat: 缺少文件参数';
    const fileContents: Record<string, string> = {
      '/etc/hosts': '127.0.0.1 localhost\n::1 localhost\n192.168.1.100 clawpanel-server',
      '/etc/hostname': 'clawpanel-server',
      '/root/.bashrc': '# ~/.bashrc\nexport PATH=$PATH:/usr/local/bin\nalias ll="ls -la"\nalias docker="sudo docker"',
      '/var/log/panel.log': '[2024-03-25 20:00:00] INFO: 面板启动成功\n[2024-03-25 20:05:00] INFO: 容器 nginx-proxy 重启完成\n[2024-03-25 20:10:00] WARN: 容器 mysql-db 内存使用率超过 80%',
    };
    return fileContents[file] || `cat: ${file}: 没有那个文件或目录`;
  },
  echo: (args) => args.join(' '),
  clear: () => '\x1b[2J\x1b[H',
  date: () => new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
  whoami: () => 'root',
  hostname: () => 'clawpanel-server',
  uname: (args) => {
    if (args.includes('-a')) {
      return 'Linux clawpanel-server 6.8.0-45-generic #45-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux';
    }
    return 'Linux';
  },
  df: () => `文件系统        1K-块     已用     可用 已用% 挂载点
/dev/sda1  524288000 183500800 340787200   35% /
tmpfs       16384000        0  16384000    0% /dev/shm
/dev/sdb1  1048576000 524288000 524288000   50% /data`,
  free: () => `              总计        已用        空闲      共享    缓冲/缓存    可用
内存：      32768       12288       16384         256        4096      19456
交换：      16384           0       16384`,
  ps: () => `  PID TTY          TIME CMD
    1 ?        00:00:01 systemd
  256 ?        00:00:00 nginx
  512 ?        00:00:05 docker
  768 ?        00:00:02 node
 1024 pts/0    00:00:00 bash
 2048 ?        00:00:10 ollama
 4096 ?        00:00:05 openclaw`,
  top: () => `top - 20:30:00 up 10 days,  5:30,  1 user,  load average: 0.25, 0.35, 0.40
任务: 128 total,   1 running, 127 sleeping,   0 stopped,   0 zombie
%Cpu(s): 23.5 us,  5.2 sy,  0.0 ni, 70.3 id,  0.5 wa,  0.0 hi,  0.5 si
MiB Mem :  32768.0 total,  19456.0 free,  12288.0 used,   4096.0 buff/cache
MiB Swap:  16384.0 total,  16384.0 free,      0.0 used.  19456.0 avail Mem`,
  uptime: () => ' 20:30:00 up 10 days,  5:30,  1 user,  load average: 0.25, 0.35, 0.40',
  docker: (args) => {
    const subCmd = args[0];
    if (subCmd === 'ps') {
      return `CONTAINER ID   IMAGE          COMMAND       STATUS       PORTS                    NAMES
a1b2c3d4e5f6   nginx:latest   "nginx -g..."  Up 6 days    0.0.0.0:80->80/tcp       nginx-proxy
b2c3d4e5f6a7   mysql:8.0      "mysqld..."    Up 6 days    0.0.0.0:3306->3306/tcp   mysql-db
c3d4e5f6a7b8   redis:7        "redis..."     Up 6 days    0.0.0.0:6379->6379/tcp   redis-cache`;
    } else if (subCmd === 'images') {
      return `REPOSITORY   TAG       IMAGE ID       CREATED       SIZE
nginx        latest    a1b2c3d4e5f6   2 weeks ago   142MB
mysql        8.0       b2c3d4e5f6a7   3 weeks ago   555MB
redis        7         c3d4e5f6a7b8   1 week ago    117MB
ollama/ollama latest   d4e5f6a7b8c9   1 day ago     1.2GB`;
    } else if (subCmd === 'logs') {
      return '[2024-03-25 20:00:00] INFO: Container started\n[2024-03-25 20:05:00] INFO: Health check passed';
    }
    return 'docker: 未知子命令。可用: ps, images, logs';
  },
  systemctl: (args) => {
    const service = args[1];
    const action = args[0];
    if (action === 'status') {
      return `● ${service || 'nginx'}.service - ${service || 'Nginx'} Server
   Loaded: loaded (/etc/systemd/system/${service || 'nginx'}.service; enabled)
   Active: active (running) since 2024-03-19 20:00:00 CST; 6 days ago
 Main PID: 256 (nginx)
    Tasks: 3 (limit: 4915)
   Memory: 25.6M
   CGroup: /system.slice/${service || 'nginx'}.service`;
    }
    return `${action} ${service || 'service'}: 成功`;
  },
  curl: (args) => {
    const url = args.find(a => !a.startsWith('-'));
    return `HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1234

<!DOCTYPE html>
<html>
<head><title>${url || 'Response'}</title></head>
<body><h1>200 OK</h1></body>
</html>`;
  },
  ping: (args) => {
    const host = args[0] || 'localhost';
    return `PING ${host} (127.0.0.1) 56(84) bytes of data.
64 bytes from ${host}: icmp_seq=1 ttl=64 time=0.123 ms
64 bytes from ${host}: icmp_seq=2 ttl=64 time=0.089 ms
64 bytes from ${host}: icmp_seq=3 ttl=64 time=0.102 ms

--- ${host} ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2048ms
rtt min/avg/max/mdev = 0.089/0.105/0.123/0.014 ms`;
  },
};

function createSession(id: string, cols: number, rows: number): TerminalSession {
  return {
    id,
    cols,
    rows,
    cwd: '/root',
    history: [],
    historyIndex: 0,
    currentLine: '',
    created: new Date(),
  };
}

function executeCommand(input: string, session: TerminalSession): string {
  const trimmed = input.trim();
  if (!trimmed) return '';

  session.history.push(trimmed);
  session.historyIndex = session.history.length;

  const [cmd, ...args] = trimmed.split(/\s+/);
  const handler = commandOutputs[cmd];

  if (handler) {
    const result = handler(args, session);
    return result ? `${result}\n` : '';
  }

  return `bash: ${cmd}: 命令未找到\n`;
}

export function setupTerminalHandler(wss: WebSocketServer) {
  wss.on('connection', (ws: WebSocket, req) => {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const sessionId = url.searchParams.get('session') || `term-${Date.now()}`;

    let session = sessions.get(sessionId);
    if (!session) {
      session = createSession(sessionId, 80, 24);
      sessions.set(sessionId, session);
    }

    // 发送欢迎信息
    const welcome = `\x1b[1;32m欢迎使用 Claw.Panel Web 终端\x1b[0m
\x1b[90m连接时间: ${new Date().toLocaleString('zh-CN')}\x1b[0m
\x1b[90m输入 'help' 查看可用命令\x1b[0m

\x1b[1;34mroot@clawpanel-server\x1b[0m:\x1b[1;36m${session.cwd}\x1b[0m# `;
    ws.send(JSON.stringify({ type: 'output', payload: welcome }));

    ws.on('message', (raw) => {
      try {
        const msg: WsMessage = JSON.parse(raw.toString());

        if (msg.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong', payload: null }));
          return;
        }

        if (msg.type === 'resize') {
          const { cols, rows } = msg.payload as { cols: number; rows: number };
          if (session) {
            session.cols = cols;
            session.rows = rows;
          }
          return;
        }

        if (msg.type === 'input') {
          const input = msg.payload as string;

          // 处理回车
          if (input === '\r' || input === '\n') {
            const output = executeCommand(session.currentLine, session);
            const prompt = `\x1b[1;34mroot@clawpanel-server\x1b[0m:\x1b[1;36m${session.cwd}\x1b[0m# `;
            ws.send(JSON.stringify({ type: 'output', payload: `\n${output}${prompt}` }));
            session.currentLine = '';
            return;
          }

          // 处理 Ctrl+C
          if (input === '\x03') {
            ws.send(JSON.stringify({ type: 'output', payload: '^C\n\x1b[1;34mroot@clawpanel-server\x1b[0m:\x1b[1;36m${session.cwd}\x1b[0m# ' }));
            session.currentLine = '';
            return;
          }

          // 处理退格
          if (input === '\x7f' || input === '\b') {
            if (session.currentLine.length > 0) {
              session.currentLine = session.currentLine.slice(0, -1);
              ws.send(JSON.stringify({ type: 'output', payload: '\b \b' }));
            }
            return;
          }

          // 处理普通输入
          session.currentLine += input;
          ws.send(JSON.stringify({ type: 'output', payload: input }));
        }
      } catch (error) {
        console.error('Terminal message error:', error);
      }
    });

    ws.on('close', () => {
      // 保持会话一段时间以便重连
      setTimeout(() => {
        sessions.delete(sessionId);
      }, 300000); // 5分钟后清理
    });
  });
}
