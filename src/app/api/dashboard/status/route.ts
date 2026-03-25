import { NextResponse } from 'next/server';

// 模拟数据生成器
function generateDashboardStatus() {
  return {
    cpu: Math.floor(Math.random() * 40 + 20),
    memory: Math.floor(Math.random() * 30 + 40),
    disk: Math.floor(Math.random() * 20 + 30),
    uptime: Math.floor(Math.random() * 100000 + 50000),
    hostname: 'claw-panel-server',
    os: 'Ubuntu 22.04 LTS',
    kernel: '5.15.0-76-generic',
    containers: {
      total: 12,
      running: 8,
      stopped: 4,
    },
    websites: {
      total: 6,
      active: 5,
    },
    databases: {
      total: 3,
      active: 3,
    },
  };
}

function generateResourceHistory() {
  const cpu = [];
  const memory = [];
  for (let i = 0; i < 60; i++) {
    cpu.push(Math.floor(Math.random() * 30 + 20));
    memory.push(Math.floor(Math.random() * 20 + 40));
  }
  return { cpu, memory };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  if (type === 'resources') {
    return NextResponse.json({
      success: true,
      data: generateResourceHistory(),
    });
  }

  return NextResponse.json({
    success: true,
    data: generateDashboardStatus(),
  });
}
