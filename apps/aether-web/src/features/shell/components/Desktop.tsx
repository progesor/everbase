import { useWindowStore } from '@/features/window-manager/windowStore';
import { Window } from '@/features/window-manager/components/Window';
import { useContextMenuStore } from '@/store/contextMenuStore'; // Yeni store'u import et

export function Desktop() {
  const windows = useWindowStore((state) => state.windows);
  const openMenu = useContextMenuStore((state) => state.openMenu);

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        openMenu({ x: e.clientX, y: e.clientY });
      }}
      className="flex-grow w-full h-full relative"
    >
      {/* Pencereler burada render ediliyor */}
      {windows.map((win) => (
        <Window key={win.id} id={win.id} title={win.title} zIndex={win.zIndex}>
          <p>Bu pencerenin ID'si: {win.id}</p>
          <p>Z-Index: {win.zIndex}</p>
        </Window>
      ))}
    </div>
  );
}
