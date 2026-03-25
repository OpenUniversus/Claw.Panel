import { NextRequest } from 'next/server';

// 模拟 AI 聊天流式响应
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { messages, model, stream = true } = body;

  if (!stream) {
    // 非流式响应
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          content: '这是一个模拟的 AI 响应。在实际应用中，这里会调用真实的 AI 模型 API。',
          model,
          usage: {
            promptTokens: 50,
            completionTokens: 30,
            totalTokens: 80,
          },
        },
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // 流式响应
  const encoder = new TextEncoder();
  const responseText = generateMockResponse(messages);

  const readable = new ReadableStream({
    async start(controller) {
      const words = responseText.split('');
      for (const word of words) {
        const chunk = `data: ${JSON.stringify({ content: word })}\n\n`;
        controller.enqueue(encoder.encode(chunk));
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

function generateMockResponse(messages: Array<{ role: string; content: string }>): string {
  const lastMessage = messages[messages.length - 1];
  const userContent = lastMessage?.content?.toLowerCase() || '';

  // 根据用户输入生成模拟响应
  if (userContent.includes('容器') || userContent.includes('docker')) {
    return `关于容器管理，我可以帮助您：

1. **查看容器状态**：使用 \`docker ps\` 查看运行中的容器，\`docker ps -a\` 查看所有容器
2. **容器生命周期管理**：start、stop、restart、remove 等操作
3. **资源监控**：CPU、内存、网络等资源使用情况
4. **日志查看**：实时或历史日志分析

您需要我帮您执行什么操作？`;
  }

  if (userContent.includes('数据库') || userContent.includes('mysql') || userContent.includes('postgres')) {
    return `关于数据库管理，我建议您：

1. **定期备份**：建议每天自动备份数据库
2. **性能优化**：分析慢查询日志，优化索引
3. **安全配置**：限制远程访问，使用强密码
4. **监控告警**：设置资源使用告警阈值

需要我帮您检查当前数据库状态吗？`;
  }

  if (userContent.includes('网站') || userContent.includes('nginx') || userContent.includes('ssl')) {
    return `网站管理方面，我可以协助：

1. **Nginx 配置优化**：负载均衡、缓存策略、SSL 配置
2. **SSL 证书管理**：自动续期、证书监控
3. **性能分析**：响应时间、并发连接数监控
4. **安全防护**：WAF 规则、访问控制

请问您想了解哪方面的内容？`;
  }

  // 默认响应
  return `您好！我是 Claw Panel AI 助手，很高兴为您服务。

我可以帮助您：
- 🖥️ **服务器运维**：系统监控、日志分析、故障排查
- 🐳 **容器管理**：Docker 容器的创建、部署、监控
- 🗄️ **数据库管理**：MySQL、PostgreSQL、Redis 等数据库管理
- 🌐 **网站管理**：Nginx 配置、SSL 证书、域名管理
- 🤖 **AI 能力**：代码生成、文档分析、智能问答

请告诉我您需要什么帮助？`;
}
