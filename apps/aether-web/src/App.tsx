import { useThemeStore } from '@/store/themeStore';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useWindowStore } from '@/features/window-manager/windowStore';
import { Desktop } from '@/features/shell/components/Desktop';
import { Dock } from '@/features/shell/components/Dock';
import { DesktopContextMenu } from '@/features/shell/components/DesktopContextMenu';

function App() {
  const { theme, setTheme } = useThemeStore();

  const { openWindow } = useWindowStore();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleOpenTestWindow = () => {
    openWindow({
      id: `window-${Date.now()}`,
      title: 'Yeni Test Penceresi',
      position: { x: 100, y: 100 },
      size: { width: 600, height: 400 },
    });
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <header className="flex justify-between items-center p-2 border-b">
        <h1 className="text-xl font-bold text-blue-600 px-2">Everbase</h1>
        <div className="flex items-center gap-2">
          <Button onClick={handleOpenTestWindow} variant="outline">
            Yeni Pencere Aç
          </Button>
          <Button onClick={toggleTheme} size="icon" variant="outline">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>

      <Desktop />

      <Dock />
      <DesktopContextMenu />
    </div>
  );
}

export default App;
