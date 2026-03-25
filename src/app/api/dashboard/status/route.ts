import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/proxy';

// 后端服务地址
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

// 模拟数据生成器（作为后备）
function generateMockDashboardStatus() {
  return {
    system: {
      hostname: 'claw-panel-server',
      platform: 'Ubuntu',
      platformVersion: '22.04 LTS',
      kernelVersion: '5.15.0-76-generic',
      kernelArch: 'x86_64',
      ipV4Addr: '192.168.1.100',
      uptime: 1234567,
      timeSinceUptime: '14 days',
    },
    resources: {
      cpuPercent: Math.floor(Math.random() * 40 + 20),
      cpuCores: 8,
      cpuModelName: 'Intel(R) Xeon(R) CPU E5-2680 v4',
      memoryTotal: 16384,
      memoryUsed: Math.floor(Math.random() * 30 + 40) * 163.84,
      memoryUsedPercent: Math.floor(Math.random() * 30 + 40),
      memoryAvailable: 8192,
      diskTotal: 500000,
      diskUsed: Math.floor(Math.random() * 20 + 30) * 5000,
      diskUsedPercent: Math.floor(Math.random() * 20 + 30),
      netBytesSent: 1234567890,
      netBytesRecv: 9876543210,
    },
    openclaw: {
      running: true,
      version: '1.0.0',
      uptime: 86400,
      memoryMB: 256,
      edition: 'Community',
    },
    ollama: {
      running: true,
      version: '0.1.26',
      models: [
        { name: 'llama3:70b', size: '42 GB' },
        { name: 'llama3:8b', size: '4.7 GB' },
      ],
      baseUrl: 'http://localhost:11434',
    },
    containers: {
      total: 12,
      running: 8,
      stopped: 4,
    },
    websites: {
      total: 6,
      running: 5,
      stopped: 1,
    },
    databases: {
      total: 3,
      running: 3,
      stopped: 0,
    },
  };
}

function generateMockResourceHistory() {
  const cpu: number[] = [];
  const memory: number[] = [];
  for (let i = 0; i < 60; i++) {
    cpu.push(Math.floor(Math.random() * 30 + 20));
    memory.push(Math.floor(Math.random() * 20 + 40));
  }
  return { cpu, memory };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  // 尝试代理到后端
  try {
    const backendUrl = `${BACKEND_URL}/api/dashboard/status`;
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000), // 5秒超时
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    }
  } catch (error) {
    console.log('Backend unavailable, using mock data:', error);
  }

  // 后端不可用时使用模拟数据
  if (type === 'resources') {
    return NextResponse.json({
      success: true,
      data: generateMockResourceHistory(),
    });
  }

  return NextResponse.json({
    success: true,
    data: generateMockDashboardStatus(),
  });
}
