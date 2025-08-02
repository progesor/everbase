import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Minus, Square } from 'lucide-react';
import Draggable from 'react-draggable';
import * as React from 'react';
import { useWindowStore } from '../windowStore';

// Pencerenin alacağı özellikleri (props) tanımlayalım
interface WindowProps {
  id: string;
  title: string;
  zIndex: number;
  children: React.ReactNode;
}

export function Window({ id, title, zIndex, children }: WindowProps) {
  const nodeRef = React.useRef(null);

  const { closeWindow, focusWindow } = useWindowStore();

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".handle"
      bounds="parent"
      onStart={() => focusWindow(id)}
    >
      <Card
        ref={nodeRef}
        className="w-[600px] h-[400px] shadow-lg flex flex-col absolute"
        style={{ zIndex }} // Z-index'i uygula
      >
        <CardHeader className="handle flex flex-row items-center justify-between p-2 pl-4 bg-secondary cursor-move">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded hover:bg-muted">
              <Minus size={16} />
            </button>
            <button className="p-1 rounded hover:bg-muted">
              <Square size={16} />
            </button>
            <button
              onClick={() => closeWindow(id)}
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
