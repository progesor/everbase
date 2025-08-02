import { useWindowStore } from '@/features/window-manager/windowStore';
import { Window } from '@/features/window-manager/components/Window';

export function Desktop() {
  const windows = useWindowStore((state) => state.windows);

  return (
    <div className="flex-grow w-full relative">
      {' '}
      {/* Pencerelerin konumlanacağı ana alan */}
      {windows.map((win) => (
        <Window key={win.id} id={win.id} title={win.title} zIndex={win.zIndex}>
          <p>Bu pencerenin ID'si: {win.id}</p>
          <p>Z-Index: {win.zIndex}</p>
        </Window>
      ))}
    </div>
  );
}
