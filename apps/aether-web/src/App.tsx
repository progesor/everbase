import { ThemeProvider } from './components/ThemeProvider';
import { Desktop } from './features/shell/components/Desktop';
import { Dock } from './features/shell/components/Dock';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { GlobalHotkeys } from './features/shell/components/GlobalHotkeys';
import { CommandPalette } from './features/shell/components/CommandPalette'; // Yeni bileşen import edildi.

function App() {
  const { theme, setTheme } = useThemeStore();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {/* Kısayol yöneticisi eklendi. */}
      <GlobalHotkeys />
      <CommandPalette />

      <div className="h-screen w-screen bg-background text-foreground font-sans overflow-hidden flex flex-col">
        <header className="flex justify-between items-center p-2 border-b flex-shrink-0 z-50">
          <h1 className="text-xl font-bold text-blue-600 px-2">Everbase</h1>
          <div className="flex items-center gap-2">
            <Button onClick={toggleTheme} size="icon" variant="outline">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </header>

        <main className="flex-grow relative">
          <Desktop />
        </main>

        <footer className="w-full flex-shrink-0">
          <Dock />
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
