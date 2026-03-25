'use client';

import { Check, Palette, Pipette } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useColorTheme, type ColorTheme } from '@/components/theme-provider';
import { useState } from 'react';

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
  const { colorTheme, setColorTheme, customColor, setCustomColor, mounted } = useColorTheme();
  const [tempCustomColor, setTempCustomColor] = useState(customColor);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Palette className="h-5 w-5" />
      </Button>
    );
  }

  const handleCustomColorChange = (color: string) => {
    setTempCustomColor(color);
    setCustomColor(color);
    setColorTheme('custom');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Palette className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>主题颜色</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* 预设颜色 */}
        <div className="grid grid-cols-5 gap-2 p-2">
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
        
        {/* 自定义颜色 */}
        <div className="p-2 space-y-3">
          <div className="flex items-center gap-2">
            <Pipette className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">自定义颜色</span>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={colorTheme === 'custom' ? customColor : tempCustomColor}
              onChange={(e) => handleCustomColorChange(e.target.value)}
              className="h-10 w-10 rounded-lg border cursor-pointer"
            />
            <div className="flex-1 space-y-1">
              <Label htmlFor="custom-color" className="text-xs text-muted-foreground">
                HEX 颜色值
              </Label>
              <Input
                id="custom-color"
                value={colorTheme === 'custom' ? customColor : tempCustomColor}
                onChange={(e) => handleCustomColorChange(e.target.value)}
                placeholder="#8b5cf6"
                className="h-8 font-mono text-sm"
              />
            </div>
          </div>

          {/* 快速颜色选择 */}
          <div className="grid grid-cols-8 gap-1">
            {[
              '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
              '#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#0d9488', '#2563eb', '#7c3aed', '#db2777',
              '#b91c1c', '#c2410c', '#a16207', '#15803d', '#0f766e', '#1d4ed8', '#6d28d9', '#be185d',
            ].map((color) => (
              <button
                key={color}
                onClick={() => handleCustomColorChange(color)}
                className={cn(
                  'h-5 w-5 rounded-sm transition-transform hover:scale-110',
                  colorTheme === 'custom' && customColor === color && 'ring-1 ring-offset-1 ring-offset-background'
                )}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        <DropdownMenuSeparator />
        <div className="text-xs text-muted-foreground text-center py-1">
          当前: {colorTheme === 'custom' ? '自定义' : colorOptions.find(o => o.value === colorTheme)?.name || '紫色'}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
