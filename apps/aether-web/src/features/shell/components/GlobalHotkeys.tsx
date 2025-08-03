import { useHotkeys } from 'react-hotkeys-hook';
import { useWindowStore } from '@/features/window-manager/windowStore';

/**
 * Tüm sistem genelindeki klavye kısayollarını yöneten bileşen.
 * Bu bileşen arayüzde bir şey render etmez, sadece arka planda çalışır.
 */
export function GlobalHotkeys() {
  const { windows, closeWindow } = useWindowStore();

  /**
   * O an odaklanılmış (en üstteki) pencereyi kapatır.
   */
  const handleCloseFocusedWindow = (event: KeyboardEvent) => {
    // Tarayıcının varsayılan davranışını engelle (bazı durumlarda gerekebilir).
    event.preventDefault();

    if (windows.length === 0) {
      return;
    }

    const focusedWindow = windows.reduce((focused, current) =>
      current.zIndex > focused.zIndex ? current : focused
    );

    if (focusedWindow) {
      closeWindow(focusedWindow.id);
    }
  };

  // DÜZELTME: Tarayıcı ile çakışmayacak, daha güvenli ve sezgisel kısayollar seçildi.
  useHotkeys('alt+w, cmd+alt+w, escape', handleCloseFocusedWindow);

  return null; // Bu bileşen görsel bir çıktı üretmez.
}
