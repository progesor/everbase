import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Minus, Square } from 'lucide-react';
import Draggable from 'react-draggable';
import * as React from 'react';

// Pencerenin alacağı özellikleri (props) tanımlayalım
interface WindowProps {
  title: string;
  children: React.ReactNode;
}

export function Window({ title, children }: WindowProps) {
  const nodeRef = React.useRef(null);

  return (
    <Draggable nodeRef={nodeRef} handle=".handle" bounds="parent">
      <Card
        ref={nodeRef}
        className="w-[600px] h-[400px] shadow-lg flex flex-col absolute"
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
            <button className="p-1 rounded hover:bg-destructive/80 hover:bg-destructive text-destructive-foreground">
              <X size={16} />
            </button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-4">{children}</CardContent>
      </Card>
    </Draggable>
  );
}
