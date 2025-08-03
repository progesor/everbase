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
} from '@/components/ui/context-menu';
import { useThemeStore } from '@/store/themeStore';
import { appRegistry } from '@/registry/apps';

// Hızlı erişim için uygulama listesini bir Map'e dönüştür.
const appsById = new Map(appRegistry.map((app) => [app.id, app]));

export function Desktop() {
  const windows = useWindowStore((state) => state.windows);
  const { theme, setTheme } = useThemeStore();
  const { openWindow } = useWindowStore();

  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {/*
          ANA DÜZELTME: Bu div, artık masaüstünün kendisidir.
          'h-full' ve 'w-full' özellikleri, App.tsx'teki <main> elemanının
          tüm alanını kaplamasını sağlar. 'relative' özelliği, pencerelerin
          bu alan içinde doğru konumlandırılması için kritiktir.
          Bu yapı, hem pencerelerin hem de simgelerin görünür olmasını garantiler.
        */}
        <div className="h-full w-full relative p-4">
          {/* 1. Masaüstü Simgeleri Alanı */}
          <div className="absolute top-0 left-0 p-4 grid grid-cols-1 gap-4">
            {appRegistry.map((app) => (
              <button
                key={app.id}
                onClick={() => openWindow(app)}
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

          {/* 2. Pencerelerin Render Edildiği Alan */}
          {/*
            Masaüstü konteyneri artık görünür olduğu için, bu map fonksiyonu
            pencereleri beklendiği gibi ekrana çizecektir.
          */}
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
        <ContextMenuItem>System Settings</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
