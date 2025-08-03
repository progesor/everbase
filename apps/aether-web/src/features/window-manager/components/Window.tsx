import { Rnd } from 'react-rnd';
import { ResizeDirection } from 're-resizable';
import { HydratedWindow, useWindowStore } from '../windowStore';
import { Button } from '@/components/ui/button';
import { XIcon, MinusIcon, Maximize2Icon } from 'lucide-react';
import { motion, useDragControls, useMotionValue } from 'framer-motion';
import { useEffect } from 'react';

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
    updateWindowLayout,
  } = useWindowStore();

  const dragControls = useDragControls();

  // 1. Değişiklik: Framer Motion'ın kendi pozisyon state'lerini kullan
  // Bu, sürükleme sırasında sürekli re-render olmasını engeller ve state'i stabil tutar.
  const x = useMotionValue(win.x);
  const y = useMotionValue(win.y);

  // 2. Değişiklik: Global store (Zustand) değiştiğinde motion state'lerini güncelle
  // Bu, maksimize veya snap gibi dışarıdan gelen değişikliklerin pencereye yansımasını sağlar.
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
    updateWindowSize(win.id, newSize.width, newSize.height);
    updateWindowPosition(win.id, position.x, position.y);
    updateWindowLayout(win.appId, { ...newSize, ...position });
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
      // 3. Değişiklik: Style prop'una motion value'ları ata
      style={{
        position: 'absolute',
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
        x, // 'win.x' yerine motion value kullan
        y, // 'win.y' yerine motion value kullan
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
        left: -(win.width - 40),
        right: window.innerWidth - 40,
        bottom: window.innerHeight - 40,
      }}
      onDragStart={(e) => {
        bringToFront(win.id);
        if (win.isMaximized || win.previousState) {
          const mouseEvent = e as MouseEvent;
          unsnapForDrag(win.id, mouseEvent.clientX, mouseEvent.clientY);
        }
      }}
      // 4. Değişiklik: onDragEnd'de snap kontrolü yap ve store'u güncelle
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

        // Eğer snap işlemi yapılmadıysa, son pozisyonu motion value'dan al ve store'a kaydet.
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
        position={{ x: 0, y: 0 }} // Rnd'nin pozisyonu her zaman 0,0'da kalır çünkü motion.div onu taşıyor.
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
    </motion.div>
  );
}
