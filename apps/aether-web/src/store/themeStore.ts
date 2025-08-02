import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system', // Varsayılan tema
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'everbase-theme-storage', // local storage'daki anahtarın adı
    }
  )
);
