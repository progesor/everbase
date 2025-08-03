import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type WindowDisplayState = 'normal' | 'maximized' | 'minimized';

interface WindowLayout {
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface WindowState {
  id: string;
  baseId: string;
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
  layouts: Record<string, WindowLayout>;
  openWindow: (app: {
    id: string;
    title: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
  }) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  toggleMinimize: (id: string) => void;
  updateWindowPosition: (
    id: string,
    position: { x: number; y: number }
  ) => void;
  updateWindowSize: (
    id: string,
    size: { width: number; height: number }
  ) => void;
}

let zIndexCounter = 10;

export const useWindowStore = create<WindowStore>()(
  persist(
    (set, get) => ({
      windows: [],
      layouts: {},

      openWindow: (app) => {
        const { windows, layouts, focusWindow, toggleMinimize } = get();
        const existingWindow = windows.find((w) => w.baseId === app.id);

        if (existingWindow) {
          focusWindow(existingWindow.id);
          if (existingWindow.displayState === 'minimized') {
            toggleMinimize(existingWindow.id);
          }
          return;
        }

        const savedLayout = layouts[app.id];
        const newWindowState: WindowState = {
          baseId: app.id,
          id: `${app.id}-${Date.now()}`,
          title: app.title,
          position: savedLayout ? savedLayout.position : app.position,
          size: savedLayout ? savedLayout.size : app.size,
          zIndex: zIndexCounter++,
          displayState: 'normal',
        };
        set({ windows: [...get().windows, newWindowState] });
        get().focusWindow(newWindowState.id);
      },

      closeWindow: (id) => {
        set((state) => ({
          windows: state.windows.filter((w) => w.id !== id),
        }));
      },

      focusWindow: (id) => {
        set((state) => {
          const targetWindow = state.windows.find((w) => w.id === id);
          if (targetWindow && targetWindow.zIndex < zIndexCounter - 1) {
            return {
              windows: state.windows.map((w) =>
                w.id === id ? { ...w, zIndex: zIndexCounter++ } : w
              ),
            };
          }
          return {};
        });
      },

      updateWindowPosition: (id, position) => {
        set((state) => {
          const windowToUpdate = state.windows.find((w) => w.id === id);
          if (!windowToUpdate || windowToUpdate.displayState !== 'normal')
            return {};

          return {
            windows: state.windows.map((w) =>
              w.id === id ? { ...w, position } : w
            ),
            layouts: {
              ...state.layouts,
              [windowToUpdate.baseId]: { position, size: windowToUpdate.size },
            },
          };
        });
      },

      updateWindowSize: (id, size) => {
        set((state) => {
          const windowToUpdate = state.windows.find((w) => w.id === id);
          if (!windowToUpdate || windowToUpdate.displayState !== 'normal')
            return {};

          return {
            windows: state.windows.map((w) =>
              w.id === id ? { ...w, size } : w
            ),
            layouts: {
              ...state.layouts,
              [windowToUpdate.baseId]: {
                size,
                position: windowToUpdate.position,
              },
            },
          };
        });
      },

      toggleMaximize: (id) => {
        set((state) => {
          const windowToUpdate = state.windows.find((w) => w.id === id);
          if (!windowToUpdate) return {};

          if (windowToUpdate.displayState === 'maximized') {
            return {
              windows: state.windows.map((w) =>
                w.id === id
                  ? {
                      ...w,
                      displayState: 'normal',
                      position: w.previousPosition || w.position,
                      size: w.previousSize || w.size,
                    }
                  : w
              ),
            };
          } else {
            const newLayouts = {
              ...state.layouts,
              [windowToUpdate.baseId]: {
                position: windowToUpdate.position,
                size: windowToUpdate.size,
              },
            };
            return {
              windows: state.windows.map((w) =>
                w.id === id
                  ? {
                      ...w,
                      displayState: 'maximized',
                      previousPosition: w.position,
                      previousSize: w.size,
                      position: { x: 0, y: 0 },
                    }
                  : w
              ),
              layouts: newLayouts,
            };
          }
        });
        get().focusWindow(id);
      },

      toggleMinimize: (id) => {
        set((state) => ({
          windows: state.windows.map((w) => {
            if (w.id !== id) return w;
            return {
              ...w,
              displayState:
                w.displayState === 'minimized' ? 'normal' : 'minimized',
            };
          }),
        }));

        const window = get().windows.find((w) => w.id === id);
        if (window && window.displayState !== 'minimized') {
          get().focusWindow(id);
        }
      },
    }),
    {
      name: 'everbase-window-storage',
      partialize: (state) => ({
        windows: state.windows,
        layouts: state.layouts,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const maxZIndex = state.windows.reduce(
            (max, window) => Math.max(max, window.zIndex),
            9
          );
          zIndexCounter = maxZIndex + 1;
        }
      },
    }
  )
);
