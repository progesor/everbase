import { create } from 'zustand';

// Bir pencerenin sahip olacağı özellikleri tanımlayalım
interface WindowState {
  id: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

// Store'un genel yapısını tanımlayalım
interface WindowStore {
  windows: WindowState[];
  openWindow: (newWindow: Omit<WindowState, 'zIndex'>) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
}

// Z-index değerlerini yönetmek için bir sayaç
let zIndexCounter = 10;

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [], // Başlangıçta hiç pencere yok

  // Yeni bir pencere açan eylem (action)
  openWindow: (newWindow) => {
    const newWindowState: WindowState = {
      ...newWindow,
      zIndex: zIndexCounter++,
    };
    set((state) => ({ windows: [...state.windows, newWindowState] }));
  },

  // Bir pencereyi kapatan eylem
  closeWindow: (id) => {
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
    }));
  },

  // Bir pencereye odaklanan (en üste getiren) eylem
  focusWindow: (id) => {
    const { windows } = get();
    const targetWindow = windows.find((w) => w.id === id);

    // Eğer tıklanan pencere zaten en üstte değilse, z-index'ini güncelle
    if (targetWindow && targetWindow.zIndex < zIndexCounter - 1) {
      set((state) => ({
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, zIndex: zIndexCounter++ } : w
        ),
      }));
    }
  },
}));
