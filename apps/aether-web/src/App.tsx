import { useThemeStore } from '@/store/themeStore';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { DockerDashboard } from '@/features/docker-dashboard/components/DockerDashboard';
import { Window } from '@/features/window-manager/components/Window';

function App() {
  const { theme, setTheme } = useThemeStore();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Everbase</h1>
        <Button onClick={toggleTheme} size="icon" variant="outline">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
      <Window title="Test Penceresi">
        <p>Bu pencerenin içeriğidir.</p>
      </Window>
      <DockerDashboard />
    </main>
  );
}

export default App;
