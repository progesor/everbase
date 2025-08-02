import { useWindowStore } from '@/features/window-manager/windowStore';
import { Button } from '@/components/ui/button';
import { AppWindow } from 'lucide-react';

export function Dock() {
  const { windows, focusWindow } = useWindowStore();

  return (
    <div className="w-full h-16 bg-secondary/50 backdrop-blur-sm flex items-center justify-center p-2 border-t">
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
    </div>
  );
}
