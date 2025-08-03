import { useState } from 'react';
import { appRegistry, AppDefinition } from '@/registry/apps';
import { useWindowStore } from '@/features/window-manager/windowStore';
import { Input } from '@/components/ui/input';

export function AppLauncher() {
  const [searchTerm, setSearchTerm] = useState('');
  const { openWindow, closeWindow, windows } = useWindowStore();

  const launcherWindow = windows.find((w) => w.appId === 'app-launcher');

  const handleLaunchApp = (app: AppDefinition) => {
    openWindow(app);
    if (launcherWindow) {
      closeWindow(launcherWindow.id);
    }
  };

  const filteredApps = appRegistry
    .filter((app) => app.id !== 'app-launcher')
    .filter((app) => app.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    // ANA DÜZELTME: Bileşen artık dikey bir flex konteyner.
    // Bu, başlık ve kaydırılabilir içerik alanını birbirinden ayırır.
    <div className="flex flex-col h-full bg-transparent">
      {/* Sabit Başlık Alanı: Bu bölüm scroll olmaz. */}
      <header className="p-4 border-b border-border flex-shrink-0">
        <h1 className="text-lg font-semibold">App Launcher</h1>
        <Input
          type="text"
          placeholder="Uygulama ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mt-2"
        />
      </header>

      {/* Kaydırılabilir İçerik Alanı: 'flex-1' ile kalan tüm alanı doldurur
          ve 'overflow-y-auto' ile dikey scroll özelliği kazanır. */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 justify-items-center">
          {filteredApps.map((app) => (
            <button
              key={app.id}
              onClick={() => handleLaunchApp(app)}
              // Görsel olarak masaüstü simgeleriyle tutarlı, daha kompakt bir stil.
              className="flex flex-col items-center justify-center gap-2 p-2 rounded-lg hover:bg-secondary/50 transition-colors w-24 h-24"
              title={`Launch ${app.name}`}
            >
              <app.icon className="w-8 h-8" />
              <span className="text-xs text-center truncate w-full">
                {app.name}
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
