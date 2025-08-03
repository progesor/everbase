import { Rnd } from 'react-rnd';
import { ResizeDirection } from 're-resizable';
import { HydratedWindow, useWindowStore } from '../windowStore';
import { Button } from '@/components/ui/button';
import { XIcon, MinusIcon, Maximize2Icon, CornerDownLeft } from 'lucide-react';
import { motion, useDragControls, useMotionValue } from 'framer-motion';
import { useEffect } from 'react';

interface WindowProps {
  win: HydratedWindow;
}

const HEADER_HEIGHT = 32;
const ACCESSIBLE_MARGIN = 40;

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
    updateWindowLayout,
  } = useWindowStore();

  const dragControls = useDragControls();
  const x = useMotionValue(win.x);
  const y = useMotionValue(win.y);

  useEffect(() => {
    x.set(win.x);
    y.set(win.y);
  }, [win.x, win.y, x, y]);

  const handleResizeStop = (
    _e: MouseEvent | TouchEvent,
    _dir: ResizeDirection,
    ref: HTMLElement,
    _delta: { width: number; height: number },
    position: { x: number; y: number }
  ) => {
    const newSize = { width: ref.offsetWidth, height: ref.offsetHeight };
    // HESAPLAMA DÜZELTMESİ:
    // Konumu, potansiyel olarak eski kalabilen 'win.x' prop'u yerine, her zaman güncel olan
    // ve anlık görsel pozisyonu temsil eden 'x.get()' motion value'suna göre hesapla.
    const newPosition = {
      x: x.get() + position.x,
      y: y.get() + position.y,
    };

    updateWindowSize(win.id, newSize.width, newSize.height);
    updateWindowPosition(win.id, newPosition.x, newPosition.y);
    updateWindowLayout(win.appId, { ...newSize, ...newPosition });
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
    <motion.div
      style={{
        position: 'absolute',
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
        x,
        y,
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragConstraints={{
        top: 0,
        left: -(win.width - ACCESSIBLE_MARGIN),
        right: window.innerWidth - ACCESSIBLE_MARGIN,
        bottom: window.innerHeight - HEADER_HEIGHT,
      }}
      onDragStart={(e) => {
        bringToFront(win.id);
        if (win.isMaximized || win.previousState) {
          const mouseEvent = e as MouseEvent;
          unsnapForDrag(win.id, mouseEvent.clientX, mouseEvent.clientY);
        }
      }}
      onDragEnd={(_event) => {
        const { clientX, clientY } = _event as MouseEvent;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const snapThreshold = 20;

        const isAtTop = clientY <= snapThreshold;
        const isAtLeft = clientX <= snapThreshold;
        const isAtRight = clientX >= screenWidth - snapThreshold;
        const isAtBottom = clientY >= screenHeight - snapThreshold;

        let snapped = false;
        if (isAtTop && isAtLeft) {
          snapWindow(win.id, 'topLeft');
          snapped = true;
        } else if (isAtTop && isAtRight) {
          snapWindow(win.id, 'topRight');
          snapped = true;
        } else if (isAtBottom && isAtLeft) {
          snapWindow(win.id, 'bottomLeft');
          snapped = true;
        } else if (isAtBottom && isAtRight) {
          snapWindow(win.id, 'bottomRight');
          snapped = true;
        } else if (isAtTop) {
          maximizeWindow(win.id);
          snapped = true;
        } else if (isAtLeft) {
          snapWindow(win.id, 'left');
          snapped = true;
        } else if (isAtRight) {
          snapWindow(win.id, 'right');
          snapped = true;
        }

        if (!snapped) {
          const finalX = x.get();
          const finalY = y.get();
          updateWindowPosition(win.id, finalX, finalY);
          updateWindowLayout(win.appId, { x: finalX, y: finalY });
        }
      }}
    >
      <Rnd
        size={{ width: '100%', height: '100%' }}
        position={{ x: 0, y: 0 }}
        onResizeStop={handleResizeStop}
        minWidth={win.app.minWidth || 300}
        minHeight={win.app.minHeight || 200}
        disableDragging={true}
        enableResizing={!(win.isMaximized || !!win.previousState)}
        className="border border-border bg-background/80 backdrop-blur-sm rounded-lg shadow-lg flex flex-col overflow-hidden"
      >
        <header
          className="h-8 flex-shrink-0 flex items-center justify-between px-2 bg-secondary/50 rounded-t-lg cursor-grab active:cursor-grabbing"
          onPointerDown={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest('button')) return;
            dragControls.start(e, { snapToCursor: false });
          }}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            {win.app.icon && <win.app.icon className="w-4 h-4 flex-shrink-0" />}
            <span className="text-sm font-medium truncate">{win.app.name}</span>
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
              {win.isMaximized || win.previousState ? (
                <CornerDownLeft className="w-4 h-4" />
              ) : (
                <Maximize2Icon className="w-4 h-4" />
              )}
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
    </motion.div>
  );
}
