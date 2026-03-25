'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export type ColorTheme = 'purple' | 'blue' | 'green' | 'orange' | 'red' | 'pink' | 'teal' | 'indigo' | 'cyan';

interface ColorThemeContextType {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  mounted: boolean;
}

const ColorThemeContext = React.createContext<ColorThemeContextType>({
  colorTheme: 'purple',
  setColorTheme: () => {},
  mounted: false,
});

const COLOR_THEME_KEY = 'claw-panel-color-theme';

export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme, setColorThemeState] = React.useState<ColorTheme>('purple');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // 从 localStorage 读取颜色主题
    const savedTheme = localStorage.getItem(COLOR_THEME_KEY) as ColorTheme | null;
    if (savedTheme) {
      setColorThemeState(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // 默认紫色主题
      document.documentElement.setAttribute('data-theme', 'purple');
    }
    setMounted(true);
  }, []);

  const setColorTheme = React.useCallback((theme: ColorTheme) => {
    setColorThemeState(theme);
    localStorage.setItem(COLOR_THEME_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  return (
    <ColorThemeContext.Provider value={{ colorTheme, setColorTheme, mounted }}>
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
