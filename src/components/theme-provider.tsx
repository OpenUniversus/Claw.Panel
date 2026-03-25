'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export type ColorTheme = 'purple' | 'blue' | 'green' | 'orange' | 'red' | 'pink' | 'teal' | 'indigo' | 'cyan' | 'custom';

interface ColorThemeContextType {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
  mounted: boolean;
}

const ColorThemeContext = React.createContext<ColorThemeContextType>({
  colorTheme: 'purple',
  setColorTheme: () => {},
  customColor: '#8b5cf6',
  setCustomColor: () => {},
  mounted: false,
});

const COLOR_THEME_KEY = 'claw-panel-color-theme';
const CUSTOM_COLOR_KEY = 'claw-panel-custom-color';

// HSL 转 Hex
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Hex 转 HSL
function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme, setColorThemeState] = React.useState<ColorTheme>('purple');
  const [customColor, setCustomColorState] = React.useState<string>('#8b5cf6');
  const [mounted, setMounted] = React.useState(false);

  const applyTheme = React.useCallback((theme: ColorTheme, customHex?: string) => {
    const root = document.documentElement;
    
    if (theme === 'custom' && customHex) {
      const hsl = hexToHsl(customHex);
      if (hsl) {
        root.style.setProperty('--primary', `${hsl.h} ${hsl.s}% ${hsl.l}%`);
        root.style.setProperty('--ring', `${hsl.h} ${hsl.s}% ${hsl.l}%`);
        // 计算合适的文字颜色
        const foregroundL = hsl.l > 50 ? 98 : 20;
        root.style.setProperty('--primary-foreground', `${hsl.h} ${Math.max(hsl.s - 20, 0)}% ${foregroundL}%`);
        root.setAttribute('data-theme', 'custom');
      }
    } else {
      root.style.removeProperty('--primary');
      root.style.removeProperty('--ring');
      root.style.removeProperty('--primary-foreground');
      root.setAttribute('data-theme', theme);
    }
  }, []);

  React.useEffect(() => {
    const savedTheme = localStorage.getItem(COLOR_THEME_KEY) as ColorTheme | null;
    const savedCustomColor = localStorage.getItem(CUSTOM_COLOR_KEY);
    
    if (savedTheme) {
      setColorThemeState(savedTheme);
      if (savedTheme === 'custom' && savedCustomColor) {
        setCustomColorState(savedCustomColor);
        applyTheme(savedTheme, savedCustomColor);
      } else {
        applyTheme(savedTheme);
      }
    } else {
      applyTheme('purple');
    }
    setMounted(true);
  }, [applyTheme]);

  const setColorTheme = React.useCallback((theme: ColorTheme) => {
    setColorThemeState(theme);
    localStorage.setItem(COLOR_THEME_KEY, theme);
    applyTheme(theme, customColor);
  }, [applyTheme, customColor]);

  const setCustomColor = React.useCallback((color: string) => {
    setCustomColorState(color);
    localStorage.setItem(CUSTOM_COLOR_KEY, color);
    if (colorTheme === 'custom') {
      applyTheme('custom', color);
    }
  }, [applyTheme, colorTheme]);

  return (
    <ColorThemeContext.Provider value={{ colorTheme, setColorTheme, customColor, setCustomColor, mounted }}>
      {children}
    </ColorThemeContext.Provider>
  );
}

export function useColorTheme() {
  return React.useContext(ColorThemeContext);
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
