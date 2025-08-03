import {
  useWindowStore,
  HydratedWindow,
} from '@/features/window-manager/windowStore';
import { Button } from '@/components/ui/button';
import { appRegistry } from '@/registry/apps';
import { Clock } from './Clock';
import { Separator } from '@/components/ui/separator';
import { BotMessageSquare } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function Dock() {
  const { windows, toggleMinimize, focusWindow, openWindow } = useWindowStore();

  const appLauncherDef = appRegistry.find((app) => app.id === 'app-launcher');

  const handleLaunchApp = () => {
    if (appLauncherDef) {
      openWindow(appLauncherDef);
    }
  };

  const handleDockIconClick = (win: HydratedWindow) => {
    if (win.isMinimized) {
      toggleMinimize(win.id);
    }
    focusWindow(win.id);
  };

  const appsById = new Map(appRegistry.map((app) => [app.id, app]));
  const openWindows: HydratedWindow[] = windows
    .map((winInStore) => {
      const app = appsById.get(winInStore.appId);
      return app ? { ...winInStore, app } : null;
    })
    .filter((w): w is HydratedWindow => w !== null);

  const focusedWindowId =
    windows.length > 0
      ? windows.reduce((focusedWin, currentWin) =>
          currentWin.zIndex > focusedWin.zIndex ? currentWin : focusedWin
        ).id
      : null;

  return (
    // İYİLEŞTİRME: Tüm dock, tooltip'lerin çalışması için bir sağlayıcı ile sarmalandı.
    <TooltipProvider>
      <div className="w-full h-16 bg-secondary/50 backdrop-blur-sm flex items-center justify-between p-2 border-t z-40">
        <div className="flex items-center gap-2">
          {appLauncherDef && (
            // İYİLEŞTİRME: Buton, Tooltip bileşenleri ile sarmalandı.
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12"
                  onClick={handleLaunchApp}
                >
                  <BotMessageSquare className="w-8 h-8" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{appLauncherDef.name}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        <div className="flex-grow flex items-center justify-center gap-2">
          {openWindows.map((win) => {
            const isFocused = win.id === focusedWindowId;

            return (
              // İYİLEŞTİRME: Her bir uygulama ikonu, kendi Tooltip'i ile sarmalandı.
              <Tooltip key={win.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-12 w-12 transition-all relative ${isFocused ? 'bg-primary/20 scale-110' : ''}`}
                    onClick={() => handleDockIconClick(win)}
                  >
                    <win.app.icon className="w-7 h-7" />
                    <div className="absolute bottom-0.5 w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{win.app.name}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Separator orientation="vertical" className="h-8" />
          <Clock />
        </div>
      </div>
    </TooltipProvider>
  );
}
