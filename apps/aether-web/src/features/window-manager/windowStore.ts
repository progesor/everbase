import { create } from 'zustand';

type WindowDisplayState = 'normal' | 'maximized' | 'minimized';

interface WindowState {
  id: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  displayState: WindowDisplayState;
  previousPosition?: { x: number; y: number };
  previousSize?: { width: number; height: number };
}

interface WindowStore {
  windows: WindowState[];
  openWindow: (newWindow: Omit<WindowState, 'zIndex'>) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  toggleMinimize: (id: string) => void;
  updateWindowPosition: (
    id: string,
    position: { x: number; y: number }
  ) => void;
}

let zIndexCounter = 10;

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],

  openWindow: (newWindow) => {
    const newWindowState: WindowState = {
      ...newWindow,
      zIndex: zIndexCounter++,
      displayState: 'normal',
    };
    set((state) => ({ windows: [...state.windows, newWindowState] }));
  },

  closeWindow: (id) => {
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
    }));
  },

  focusWindow: (id) => {
    const { windows } = get();
    const targetWindow = windows.find((w) => w.id === id);

    if (targetWindow && targetWindow.zIndex < zIndexCounter - 1) {
      set((state) => ({
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, zIndex: zIndexCounter++ } : w
        ),
      }));
    }
  },

  updateWindowPosition: (id, position) => {
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, position } : w)),
    }));
  },

  toggleMaximize: (id) => {
    set((state) => ({
      windows: state.windows.map((w) => {
        if (w.id !== id) return w;
        if (w.displayState === 'maximized') {
          // Normale dönerken
          return {
            ...w,
            displayState: 'normal',
            position: w.previousPosition || w.position,
            size: w.previousSize || w.size,
          };
        } else {
          // Tam ekran yaparken
          return {
            ...w,
            displayState: 'maximized',
            previousPosition: w.position,
            previousSize: w.size,
            position: { x: 0, y: 0 }, // Konumu sıfırla!
          };
        }
      }),
    }));
    get().focusWindow(id);
  },

  toggleMinimize: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id
          ? {
              ...w,
              displayState:
                w.displayState === 'minimized' ? 'normal' : 'minimized',
            }
          : w
      ),
    }));
    if (get().windows.find((w) => w.id === id)?.displayState !== 'minimized') {
      get().focusWindow(id);
    }
  },
}));
