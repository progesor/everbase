import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Minus, Square } from 'lucide-react'; // İkonları import edelim

// Pencerenin alacağı özellikleri (props) tanımlayalım
interface WindowProps {
  title: string;
  children: React.ReactNode;
}

export function Window({ title, children }: WindowProps) {
  return (
    <Card className="w-[600px] h-[400px] shadow-lg flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between p-2 pl-4 bg-secondary cursor-move">
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
  );
}
