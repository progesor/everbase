import { useWindowStore } from '@/features/window-manager/windowStore';
import { Window } from '@/features/window-manager/components/Window';
import { appRegistry } from '@/registry/apps';
import { Button } from '@/components/ui/button';

export function Desktop() {
  const { windows, openWindow } = useWindowStore();

  const handleAppDoubleClick = (app: (typeof appRegistry)[0]) => {
    openWindow({
      id: `${app.id}-${Date.now()}`,
      title: app.name,
      position: { x: Math.random() * 200 + 50, y: Math.random() * 200 + 50 },
      size: { width: 800, height: 600 },
      // App'in kendisini content olarak geçirebiliriz, ancak şimdilik basit tutalım
    });
  };

  return (
    <div className="flex-grow w-full h-full relative">
      <div className="absolute inset-0 p-4 grid grid-cols-12 grid-rows-6 gap-4">
        {appRegistry.map((app) => (
          <Button
            key={app.id}
            variant="ghost"
            className="flex flex-col items-center justify-center h-24 w-24 text-foreground" // Değişiklik burada
            onDoubleClick={() => handleAppDoubleClick(app)}
          >
            <app.icon size={32} className="mb-2" />
            <span className="text-xs text-center truncate w-full">
              {app.name}
            </span>
          </Button>
        ))}
      </div>

      {/* Açık Pencereler */}
      {windows.map((win) => (
        <Window key={win.id} id={win.id} title={win.title} zIndex={win.zIndex}>
          {/* TODO: Burada uygulama içeriğini render et */}
          <p>Bu pencerenin içeriği: {win.title}</p>
        </Window>
      ))}
    </div>
  );
}
