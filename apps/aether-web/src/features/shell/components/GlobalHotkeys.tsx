import { useHotkeys } from 'react-hotkeys-hook';
import { useWindowStore } from '@/features/window-manager/windowStore';
import { useCommandPaletteStore } from '@/store/commandPaletteStore';
import { useCallback } from 'react'; // 1. useCallback import edildi.

/**
 * Tüm sistem genelindeki klavye kısayollarını yöneten merkezi bileşen.
 */
export function GlobalHotkeys() {
  const { windows, closeWindow } = useWindowStore();
  const { toggle: toggleCommandPalette } = useCommandPaletteStore();

  // DÜZELTME: Fonksiyonlar, gereksiz yere yeniden oluşturulmalarını önlemek
  // için useCallback ile sarmalandı. Bu, hotkey kütüphanesinin
  // stabil bir şekilde çalışmasını sağlar.
  const handleCloseFocusedWindow = useCallback(() => {
    if (windows.length === 0) return;
    const focusedWindow = windows.reduce((focused, current) =>
      current.zIndex > focused.zIndex ? current : focused
    );
    if (focusedWindow) {
      closeWindow(focusedWindow.id);
    }
  }, [windows, closeWindow]);

  const handleToggleCommandPalette = useCallback(() => {
    toggleCommandPalette();
  }, [toggleCommandPalette]);

  // Pencere kapatma kısayolları
  useHotkeys('alt+w, cmd+alt+w, escape', handleCloseFocusedWindow, {
    preventDefault: true,
  });

  // Komut Paleti kısayolu
  useHotkeys('alt+k, cmd+k', handleToggleCommandPalette, {
    preventDefault: true,
  });

  return null;
}
