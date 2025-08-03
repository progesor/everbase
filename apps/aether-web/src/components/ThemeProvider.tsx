import { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';
import React from 'react';

// HATA DÜZELTME: Bileşenin kabul edeceği props'lar için bir tip tanımlandı.
// Bu, App.tsx'teki hatayı giderir.
type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
};

// Bu props'lar doğrudan kullanılmasa da, bileşenin çağrıldığı yerdeki
// yapıyla uyumlu olması için tipe eklendi. Asıl yapılandırma
// `useThemeStore` içinde varsayılmaktadır.
export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
}
