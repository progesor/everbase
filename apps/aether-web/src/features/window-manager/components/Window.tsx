import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Minus, Square, Minimize2 } from 'lucide-react'; // ChevronsUpLeft yerine Minimize2 import et
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import React from 'react';
import { useWindowStore } from '../windowStore';
import { cn } from '@/lib/utils';

interface WindowProps {
  id: string;
  title: string;
  zIndex: number;
  displayState: 'normal' | 'maximized' | 'minimized';
  children: React.ReactNode;
  position: { x: number; y: number };
}

export function Window({
  id,
  title,
  zIndex,
  displayState,
  children,
  position,
}: WindowProps) {
  const nodeRef = React.useRef(null);
  const {
    closeWindow,
    focusWindow,
    toggleMaximize,
    toggleMinimize,
    updateWindowPosition,
  } = useWindowStore();

  const handleDragStop = (_e: DraggableEvent, data: DraggableData) => {
    updateWindowPosition(id, { x: data.x, y: data.y });
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".handle"
      bounds="parent"
      onStart={() => focusWindow(id)}
      onStop={handleDragStop}
      position={position}
      disabled={displayState === 'maximized'}
    >
      <Card
        ref={nodeRef}
        className={cn(
          'shadow-lg flex flex-col absolute',
          displayState === 'maximized' &&
            'w-full h-full top-0 left-0 border-0 rounded-none', // Tam ekran için kenarlık ve yuvarlaklığı kaldır
          displayState === 'normal' && 'w-[600px] h-[400px]'
        )}
        style={{ zIndex }}
      >
        <CardHeader
          className={cn(
            'handle flex flex-row items-center justify-between p-2 pl-4 bg-secondary',
            displayState !== 'maximized' && 'cursor-move'
          )}
        >
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleMinimize(id)}
              className="p-1 rounded hover:bg-muted"
            >
              <Minus size={16} />
            </button>
            <button
              onClick={() => toggleMaximize(id)}
              className="p-1 rounded hover:bg-muted"
            >
              {/* Hatalı ikon yerine doğru ikonu kullan */}
              {displayState === 'maximized' ? (
                <Minimize2 size={16} />
              ) : (
                <Square size={16} />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeWindow(id);
              }}
              className="p-1 rounded hover:bg-destructive/80 hover:bg-destructive text-destructive-foreground"
            >
              <X size={16} />
            </button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-4 bg-card text-card-foreground">
          {children}
        </CardContent>
      </Card>
    </Draggable>
  );
}
