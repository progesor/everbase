import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

interface DesktopContextMenuProps {
  children: React.ReactNode;
}

export function DesktopContextMenu({ children }: DesktopContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex-grow w-full h-full">
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Görünüm Ayarları</ContextMenuItem>
        <ContextMenuItem>Sıralama Ölçütü</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem disabled>Yeni Klasör Oluştur</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
