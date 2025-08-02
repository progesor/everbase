import { useWindowStore } from '@/features/window-manager/windowStore';
import { Window } from '@/features/window-manager/components/Window';
import { DesktopContextMenu } from './DesktopContextMenu';

export function Desktop() {
  const windows = useWindowStore((state) => state.windows);

  return (
    <DesktopContextMenu>
      <div className="flex-grow w-full h-full relative">
        {' '}
        {/* h-full ekleyerek tüm alanı kaplamasını sağla */}
        {windows.map((win) => (
          <Window
            key={win.id}
            id={win.id}
            title={win.title}
            zIndex={win.zIndex}
          >
            <p>Bu pencerenin ID'si: {win.id}</p>
            <p>Z-Index: {win.zIndex}</p>
          </Window>
        ))}
      </div>
    </DesktopContextMenu>
  );
}
