import { NextRequest, NextResponse } from 'next/server';

// 模拟容器数据
const mockContainers = [
  {
    id: 'container-1',
    name: 'nginx-proxy',
    image: 'nginx:alpine',
    status: 'running',
    state: 'running',
    ports: ['80:80', '443:443'],
    cpu: 2.5,
    memory: 45.2,
    created: '2024-01-15T10:00:00Z',
  },
  {
    id: 'container-2',
    name: 'mysql-db',
    image: 'mysql:8.0',
    status: 'running',
    state: 'running',
    ports: ['3306:3306'],
    cpu: 8.3,
    memory: 512.5,
    created: '2024-01-14T08:30:00Z',
  },
  {
    id: 'container-3',
    name: 'redis-cache',
    image: 'redis:7-alpine',
    status: 'running',
    state: 'running',
    ports: ['6379:6379'],
    cpu: 1.2,
    memory: 32.1,
    created: '2024-01-13T15:45:00Z',
  },
  {
    id: 'container-4',
    name: 'app-backend',
    image: 'node:18-alpine',
    status: 'running',
    state: 'running',
    ports: ['3000:3000'],
    cpu: 15.7,
    memory: 256.8,
    created: '2024-01-12T09:20:00Z',
  },
  {
    id: 'container-5',
    name: 'ollama-ai',
    image: 'ollama/ollama:latest',
    status: 'running',
    state: 'running',
    ports: ['11434:11434'],
    cpu: 25.3,
    memory: 2048.0,
    created: '2024-01-10T14:00:00Z',
  },
  {
    id: 'container-6',
    name: 'mongodb',
    image: 'mongo:7',
    status: 'stopped',
    state: 'exited',
    ports: ['27017:27017'],
    cpu: 0,
    memory: 0,
    created: '2024-01-08T11:30:00Z',
  },
];

const mockImages = [
  {
    id: 'image-1',
    name: 'nginx',
    tag: 'alpine',
    size: '25.2 MB',
    created: '2024-01-15T10:00:00Z',
    used: true,
  },
  {
    id: 'image-2',
    name: 'mysql',
    tag: '8.0',
    size: '546.2 MB',
    created: '2024-01-14T08:30:00Z',
    used: true,
  },
  {
    id: 'image-3',
    name: 'redis',
    tag: '7-alpine',
    size: '32.5 MB',
    created: '2024-01-13T15:45:00Z',
    used: true,
  },
  {
    id: 'image-4',
    name: 'node',
    tag: '18-alpine',
    size: '180.5 MB',
    created: '2024-01-12T09:20:00Z',
    used: true,
  },
  {
    id: 'image-5',
    name: 'ollama/ollama',
    tag: 'latest',
    size: '1.2 GB',
    created: '2024-01-10T14:00:00Z',
    used: true,
  },
  {
    id: 'image-6',
    name: 'mongo',
    tag: '7',
    size: '654.8 MB',
    created: '2024-01-08T11:30:00Z',
    used: false,
  },
];

// GET - 获取容器列表
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  if (type === 'images') {
    return NextResponse.json({
      success: true,
      data: mockImages,
    });
  }

  return NextResponse.json({
    success: true,
    data: mockContainers,
  });
}

// POST - 容器操作
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action } = body;

  // 模拟操作成功
  return NextResponse.json({
    success: true,
    message: `Container ${action} successfully`,
  });
}
