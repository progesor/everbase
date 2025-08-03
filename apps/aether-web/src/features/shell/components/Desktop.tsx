import {
  useWindowStore,
  WindowInStore,
  HydratedWindow,
} from '@/features/window-manager/windowStore';
import { Window } from '@/features/window-manager/components/Window';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';
import { useThemeStore } from '@/store/themeStore';
import { appRegistry } from '@/registry/apps';
import { useWallpaperStore } from '@/store/wallpaperStore';
import { AnimatePresence } from 'framer-motion';
import { DesktopIcons } from './DesktopIcons';
import { useDesktopStore } from '@/store/desktopStore'; // Yeni store import edildi

const appsById = new Map(appRegistry.map((app) => [app.id, app]));

export function Desktop() {
  const windows = useWindowStore((state) => state.windows);
  const { openWindow } = useWindowStore();
  const { theme, setTheme } = useThemeStore();
  const currentWallpaper = useWallpaperStore((state) => state.currentWallpaper);
  const { clearSelection } = useDesktopStore(); // Seçimi temizleme fonksiyonu alındı

  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const openWallpaperPicker = () => {
    const wallpaperApp = appRegistry.find(
      (app) => app.id === 'wallpaper-picker'
    );
    if (wallpaperApp) {
      openWindow(wallpaperApp);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className="h-full w-full relative bg-cover bg-center transition-all duration-500"
          style={{ backgroundImage: `url(${currentWallpaper})` }}
          // Masaüstü arka planına tıklandığında seçili ikonları temizle.
          onMouseDown={clearSelection}
        >
          <DesktopIcons />

          <AnimatePresence>
            {windows.map((winInStore: WindowInStore) => {
              if (winInStore.isMinimized) return null;

              const app = appsById.get(winInStore.appId);
              if (!app) return null;

              const hydratedWin: HydratedWindow = { ...winInStore, app };
              return <Window key={hydratedWin.id} win={hydratedWin} />;
            })}
          </AnimatePresence>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleToggleTheme}>
          Toggle Theme
        </ContextMenuItem>
        <ContextMenuItem onClick={openWallpaperPicker}>
          Change Wallpaper
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>System Settings</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
