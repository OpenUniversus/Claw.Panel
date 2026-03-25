'use client';

import { Check, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useColorTheme, type ColorTheme } from '@/components/theme-provider';

interface ColorOption {
  name: string;
  value: ColorTheme;
  colorClass: string;
  label: string;
}

const colorOptions: ColorOption[] = [
  { name: '紫色', value: 'purple', colorClass: 'bg-violet-500', label: '紫色主题' },
  { name: '蓝色', value: 'blue', colorClass: 'bg-blue-500', label: '蓝色主题' },
  { name: '绿色', value: 'green', colorClass: 'bg-emerald-500', label: '绿色主题' },
  { name: '橙色', value: 'orange', colorClass: 'bg-orange-500', label: '橙色主题' },
  { name: '红色', value: 'red', colorClass: 'bg-red-500', label: '红色主题' },
  { name: '粉色', value: 'pink', colorClass: 'bg-pink-500', label: '粉色主题' },
  { name: '青色', value: 'teal', colorClass: 'bg-teal-500', label: '青色主题' },
  { name: '靛蓝', value: 'indigo', colorClass: 'bg-indigo-500', label: '靛蓝主题' },
  { name: '湖蓝', value: 'cyan', colorClass: 'bg-cyan-500', label: '湖蓝主题' },
];

export function ColorThemeSwitcher() {
  const { colorTheme, setColorTheme, mounted } = useColorTheme();

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Palette className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Palette className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>主题颜色</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="grid grid-cols-3 gap-2 p-2">
          {colorOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setColorTheme(option.value)}
              className={cn(
                'relative flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:scale-110',
                option.colorClass,
                colorTheme === option.value && 'ring-2 ring-offset-2 ring-offset-background'
              )}
              title={option.label}
            >
              {colorTheme === option.value && (
                <Check className="h-4 w-4 text-white" />
              )}
            </button>
          ))}
        </div>
        <DropdownMenuSeparator />
        <div className="text-xs text-muted-foreground text-center py-1">
          当前: {colorOptions.find(o => o.value === colorTheme)?.name || '紫色'}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
