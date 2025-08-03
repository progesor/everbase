import { appRegistry } from '@/registry/apps';
import { useWindowStore } from '@/features/window-manager/windowStore';

/**
 * Masaüstündeki uygulama kısayollarını render eden bileşen.
 */
export function DesktopIcons() {
  const { openWindow } = useWindowStore();

  return (
    // Simgelerin pencerelerin arkasında kalmasını sağlayan mutlak konumlandırma.
    <div className="absolute inset-0 p-4 grid grid-cols-1 auto-rows-max gap-4">
      {appRegistry.map((app) => (
        <button
          key={app.id}
          onClick={() => openWindow(app)}
          onDoubleClick={() => openWindow(app)} // Çift tıklama ile de açılmasını sağla
          className="flex flex-col items-center justify-center gap-2 p-2 rounded-lg hover:bg-black/20 text-white w-24 h-24 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          title={`Launch ${app.name}`}
        >
          <app.icon className="w-8 h-8 drop-shadow-lg" />
          <span className="text-xs text-center truncate w-full font-semibold drop-shadow-lg">
            {app.name}
          </span>
        </button>
      ))}
    </div>
  );
}
