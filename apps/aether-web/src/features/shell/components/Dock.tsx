import { useWindowStore } from '@/features/window-manager/windowStore';
import { Button } from '@/components/ui/button';
import { AppWindow } from 'lucide-react';
import { AppLauncher } from '@/features/launcher/components/AppLauncher';
import { Clock } from './Clock';
import { Separator } from '@/components/ui/separator';

export function Dock() {
  const { windows, focusWindow } = useWindowStore();

  return (
    <div className="w-full h-16 bg-secondary/50 backdrop-blur-sm flex items-center justify-between p-2 border-t">
      {/* Sol Taraf: Uygulama Başlatıcı */}
      <div className="flex items-center gap-2">
        <AppLauncher />
      </div>

      {/* Orta Taraf: Açık Uygulama İkonları */}
      <div className="flex items-center gap-2">
        {windows.map((win) => (
          <Button
            key={win.id}
            variant="ghost"
            size="icon"
            className="h-12 w-12"
            onClick={() => focusWindow(win.id)}
          >
            <AppWindow />
          </Button>
        ))}
      </div>

      {/* Sağ Taraf: Sistem Çekmecesi ve Saat */}
      <div className="flex items-center gap-2">
        {/* Burası gelecekteki sistem ikonları için (Ses, Ağ vb.) */}
        <Separator orientation="vertical" className="h-8" />
        <Clock />
      </div>
    </div>
  );
}
