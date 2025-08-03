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

const appsById = new Map(appRegistry.map((app) => [app.id, app]));

export function Desktop() {
  const windows = useWindowStore((state) => state.windows);
  const { openWindow } = useWindowStore();
  const { theme, setTheme } = useThemeStore();
  const currentWallpaper = useWallpaperStore((state) => state.currentWallpaper);

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
        >
          {/* DÜZELTME: Masaüstü simgeleri için ayrı bir konteyner eklendi.
              Bu yapı, simgelerin pencerelerin arkasında kalmasını sağlar. */}
          <div className="absolute inset-0 p-4 grid grid-cols-1 auto-rows-max gap-4">
            {appRegistry.map((app) => (
              <button
                key={app.id}
                onClick={() => openWindow(app)}
                className="flex flex-col items-center justify-center gap-2 p-2 rounded-lg hover:bg-black/20 text-white w-24 h-24 transition-colors"
                title={`Launch ${app.name}`}
              >
                <app.icon className="w-8 h-8 drop-shadow-lg" />
                <span className="text-xs text-center truncate w-full font-semibold drop-shadow-lg">
                  {app.name}
                </span>
              </button>
            ))}
          </div>

          {/* Pencereler, simgelerden sonra render edilerek onların üzerinde görünür. */}
          {windows.map((winInStore: WindowInStore) => {
            const app = appsById.get(winInStore.appId);
            if (!app) return null;
            const hydratedWin: HydratedWindow = { ...winInStore, app };
            return <Window key={hydratedWin.id} win={hydratedWin} />;
          })}
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
