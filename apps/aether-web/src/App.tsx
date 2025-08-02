import { useThemeStore } from '@/store/themeStore';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { DockerDashboard } from '@/features/docker-dashboard/components/DockerDashboard';
import { Window } from '@/features/window-manager/components/Window';
import { useWindowStore } from '@/features/window-manager/windowStore';

function App() {
  const { theme, setTheme } = useThemeStore();

  const { windows, openWindow } = useWindowStore();

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
    <main className="h-screen w-screen p-8 overflow-hidden relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Everbase</h1>
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
      </div>
      <DockerDashboard />

      {windows.map((win) => (
        <Window key={win.id} id={win.id} title={win.title} zIndex={win.zIndex}>
          <p>Bu pencerenin ID'si: {win.id}</p>
          <p>Z-Index: {win.zIndex}</p>
        </Window>
      ))}
    </main>
  );
}

export default App;
