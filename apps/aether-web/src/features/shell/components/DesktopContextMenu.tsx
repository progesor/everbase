import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useContextMenuStore } from '@/store/contextMenuStore';

export function DesktopContextMenu() {
  const { isOpen, position, closeMenu } = useContextMenuStore();

  return (
    <DropdownMenu open={isOpen} onOpenChange={closeMenu}>
      {/* DropdownMenuTrigger'ı boş bırakıyoruz çünkü tetiklemeyi kendimiz yapacağız */}
      <DropdownMenuContent
        style={{ top: `${position.y}px`, left: `${position.x}px` }}
        className="fixed" // Pozisyonu ekrana göre ayarlamak için
      >
        <DropdownMenuItem>Görünüm Ayarları</DropdownMenuItem>
        <DropdownMenuItem>Sıralama Ölçütü</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>Yeni Klasör Oluştur</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
