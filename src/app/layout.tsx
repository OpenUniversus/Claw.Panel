import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: {
    default: 'Claw.Panel - 智能运维面板',
    template: '%s | Claw.Panel',
  },
  description:
    'Claw.Panel 是一款现代化的服务器运维管理面板，整合 OpenClaw 和 Ollama，提供强大的 AI 能力和完整的运维功能。',
  keywords: [
    'Claw.Panel',
    '服务器面板',
    '运维管理',
    'OpenClaw',
    'Ollama',
    'AI',
    'Docker',
    '容器管理',
    '数据库',
  ],
  authors: [{ name: 'Claw.Panel Team' }],
  generator: 'Claw.Panel',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.COZE_PROJECT_ENV === 'DEV';

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {isDev && <Inspector />}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
