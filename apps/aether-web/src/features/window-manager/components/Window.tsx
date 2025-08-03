import { Rnd } from 'react-rnd';
import { ResizeDirection } from 're-resizable';
import { HydratedWindow, useWindowStore } from '../windowStore';
import { Button } from '@/components/ui/button';
import { XIcon, MinusIcon, Maximize2Icon } from 'lucide-react';
import { motion, useDragControls } from 'framer-motion';

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
      style={{
        position: 'absolute',
        width: win.width,
        height: win.height,
        x: win.x,
        y: win.y,
        zIndex: win.zIndex,
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
      onDragEnd={(_event, info) => {
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
          const newX = win.x + info.offset.x;
          const newY = win.y + info.offset.y;
          updateWindowPosition(win.id, newX, newY);
          updateWindowLayout(win.appId, { x: newX, y: newY });
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
