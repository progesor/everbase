import { Rnd } from 'react-rnd';
import { HydratedWindow, useWindowStore } from '../windowStore';
import { Button } from '@/components/ui/button';
import { XIcon, MinusIcon, Maximize2Icon } from 'lucide-react';
import { DraggableEvent, DraggableData } from 'react-draggable';
import { ResizeDirection } from 're-resizable';

interface WindowProps {
  win: HydratedWindow;
}

export function Window({ win }: WindowProps) {
  const {
    closeWindow,
    toggleMinimize,
    updateWindowPosition,
    updateWindowSize,
    bringToFront,
    maximizeWindow,
    restoreWindow,
    snapWindow,
    unsnapForDrag,
  } = useWindowStore();

  if (!win) {
    console.error("Window component rendered with an undefined 'win' prop.");
    return null;
  }

  const handleDragStart = (e: DraggableEvent) => {
    bringToFront(win.id);
    if (win.isMaximized || win.previousState) {
      const mouseEvent = e as MouseEvent;
      unsnapForDrag(win.id, mouseEvent.clientX, mouseEvent.clientY);
    }
  };

  const handleDragStop = (e: DraggableEvent, data: DraggableData) => {
    if (win.isMaximized) return;

    const mouseEvent = e as MouseEvent;
    const { clientX, clientY } = mouseEvent;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const snapThreshold = 20;

    const isAtTop = clientY <= snapThreshold;
    const isAtLeft = clientX <= snapThreshold;
    const isAtRight = clientX >= screenWidth - snapThreshold;
    const isAtBottom = clientY >= screenHeight - snapThreshold;

    if (isAtTop && isAtLeft) {
      snapWindow(win.id, 'topLeft');
    } else if (isAtTop && isAtRight) {
      snapWindow(win.id, 'topRight');
    } else if (isAtBottom && isAtLeft) {
      snapWindow(win.id, 'bottomLeft');
    } else if (isAtBottom && isAtRight) {
      snapWindow(win.id, 'bottomRight');
    } else if (isAtTop) {
      maximizeWindow(win.id);
    } else if (isAtLeft) {
      snapWindow(win.id, 'left');
    } else if (isAtRight) {
      snapWindow(win.id, 'right');
    } else {
      if (win.previousState) {
        restoreWindow(win.id);
        updateWindowPosition(win.id, data.x, data.y);
      } else {
        updateWindowPosition(win.id, data.x, data.y);
      }
    }
  };

  const handleResizeStop = (
    _e: MouseEvent | TouchEvent,
    _dir: ResizeDirection,
    ref: HTMLElement,
    _delta: { width: number; height: number },
    position: { x: number; y: number }
  ) => {
    updateWindowSize(win.id, ref.offsetWidth, ref.offsetHeight);
    updateWindowPosition(win.id, position.x, position.y);
  };

  const handleMaximizeToggle = () => {
    if (win.isMaximized || win.previousState) {
      restoreWindow(win.id);
    } else {
      maximizeWindow(win.id);
    }
  };

  if (win.isMinimized) {
    return null;
  }

  return (
    <Rnd
      size={{ width: win.width, height: win.height }}
      position={{ x: win.x, y: win.y }}
      onDragStart={handleDragStart}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      // DÜZELTME: Rnd bileşeni artık uygulama tanımından gelen minimum boyutları
      // veya varsayılan değerleri kullanıyor.
      minWidth={win.app.minWidth || 300}
      minHeight={win.app.minHeight || 200}
      style={{ zIndex: win.zIndex }}
      disableDragging={win.isMaximized || !!win.previousState}
      className="border border-border bg-background/80 backdrop-blur-sm rounded-lg shadow-lg flex flex-col"
      dragHandleClassName="window-drag-handle"
    >
      <header className="window-drag-handle h-8 flex items-center justify-between px-2 bg-secondary/50 rounded-t-lg cursor-move">
        <div className="flex items-center gap-2">
          {win.app.icon && <win.app.icon className="w-4 h-4" />}
          <span className="text-sm font-medium">{win.app.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6"
            onClick={() => toggleMinimize(win.id)}
          >
            <MinusIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6"
            onClick={handleMaximizeToggle}
          >
            <Maximize2Icon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 hover:bg-red-500"
            onClick={() => closeWindow(win.id)}
          >
            <XIcon className="w-4 h-4" />
          </Button>
        </div>
      </header>
      <main className="flex-grow p-2 overflow-auto">
        {win.app.component && <win.app.component />}
      </main>
    </Rnd>
  );
}
