import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppDefinition } from '@/registry/apps';

type WindowDisplayState = 'normal' | 'maximized' | 'minimized';

export interface WindowInStore {
  id: string;
  appId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  displayState: WindowDisplayState;
  previousState?: { x: number; y: number; width: number; height: number };
}

// HATA DÜZELTME: HydratedWindow artık WindowInStore'u doğru bir şekilde genişletiyor.
// 'Omit' kaldırıldı, böylece 'appId' gibi önemli özellikler korunuyor.
export interface HydratedWindow extends WindowInStore {
  app: AppDefinition;
}

export interface WindowState {
  windows: WindowInStore[];
  openWindow: (app: AppDefinition) => void;
  closeWindow: (id: string) => void;
  toggleMinimize: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
  bringToFront: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindow: (id: string, newProps: Partial<WindowInStore>) => void;
  snapWindow: (
    id: string,
    snapType:
      | 'left'
      | 'right'
      | 'topLeft'
      | 'topRight'
      | 'bottomLeft'
      | 'bottomRight'
  ) => void;
  unsnapForDrag: (id: string, cursorX: number, cursorY: number) => void;
}

const HEADER_HEIGHT = 32;
const DOCK_HEIGHT = 80;

const getNextZIndex = (windows: WindowInStore[]) => {
  if (windows.length === 0) return 1;
  return Math.max(...windows.map((w) => w.zIndex)) + 1;
};

export const useWindowStore = create<WindowState>()(
  persist(
    (set, get) => ({
      windows: [],
      openWindow: (app: AppDefinition) => {
        set((state) => {
          const existingWindow = state.windows.find((w) => w.appId === app.id);
          if (existingWindow) {
            get().focusWindow(existingWindow.id);
            return {
              windows: state.windows.map((w) =>
                w.id === existingWindow.id
                  ? { ...w, isMinimized: false, displayState: 'normal' }
                  : w
              ),
            };
          }

          const newWindow: WindowInStore = {
            id: `window-${Date.now()}`,
            appId: app.id,
            x: window.innerWidth / 2 - 300,
            y: window.innerHeight / 2 - 200,
            width: 600,
            height: 400,
            isMinimized: false,
            isMaximized: false,
            zIndex: getNextZIndex(state.windows),
            displayState: 'normal',
          };
          return { windows: [...state.windows, newWindow] };
        });
      },
      closeWindow: (id: string) =>
        set((state) => ({ windows: state.windows.filter((w) => w.id !== id) })),
      toggleMinimize: (id: string) => {
        set((state) => ({
          windows: state.windows.map((w) => {
            if (w.id === id) {
              const isMinimized = !w.isMinimized;
              return {
                ...w,
                isMinimized,
                displayState: isMinimized ? 'minimized' : 'normal',
              };
            }
            return w;
          }),
        }));
      },
      restoreWindow: (id) =>
        set((state) => ({
          windows: state.windows.map((w) => {
            if (w.id === id && w.previousState) {
              return {
                ...w,
                isMaximized: false,
                displayState: 'normal',
                x: w.previousState.x,
                y: w.previousState.y,
                width: w.previousState.width,
                height: w.previousState.height,
                previousState: undefined,
              };
            }
            return w;
          }),
        })),
      maximizeWindow: (id) =>
        set((state) => ({
          windows: state.windows.map((w) => {
            if (w.id === id && !w.isMaximized) {
              return {
                ...w,
                isMaximized: true,
                displayState: 'maximized',
                previousState: w.previousState || {
                  x: w.x,
                  y: w.y,
                  width: w.width,
                  height: w.height,
                },
                x: 0,
                y: 0,
                width: window.innerWidth,
                height: window.innerHeight - HEADER_HEIGHT - DOCK_HEIGHT,
              };
            }
            return w;
          }),
        })),
      updateWindowPosition: (id, x, y) =>
        set((state) => ({
          windows: state.windows.map((w) => (w.id === id ? { ...w, x, y } : w)),
        })),
      updateWindowSize: (id, width, height) =>
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, width, height } : w
          ),
        })),
      bringToFront: (id) => {
        set((state) => {
          const topZIndex = getNextZIndex(state.windows);
          return {
            windows: state.windows.map((w) =>
              w.id === id ? { ...w, zIndex: topZIndex } : w
            ),
          };
        });
      },
      focusWindow: (id) => get().bringToFront(id),
      updateWindow: (id, newProps) =>
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, ...newProps } : w
          ),
        })),
      snapWindow: (id, snapType) =>
        set((state) => {
          const screenWidth = window.innerWidth;
          const screenHeight = window.innerHeight - HEADER_HEIGHT - DOCK_HEIGHT;
          let newGeom = {};
          switch (snapType) {
            case 'left':
              newGeom = {
                x: 0,
                y: 0,
                width: screenWidth / 2,
                height: screenHeight,
              };
              break;
            case 'right':
              newGeom = {
                x: screenWidth / 2,
                y: 0,
                width: screenWidth / 2,
                height: screenHeight,
              };
              break;
            case 'topLeft':
              newGeom = {
                x: 0,
                y: 0,
                width: screenWidth / 2,
                height: screenHeight / 2,
              };
              break;
            case 'topRight':
              newGeom = {
                x: screenWidth / 2,
                y: 0,
                width: screenWidth / 2,
                height: screenHeight / 2,
              };
              break;
            case 'bottomLeft':
              newGeom = {
                x: 0,
                y: screenHeight / 2,
                width: screenWidth / 2,
                height: screenHeight / 2,
              };
              break;
            case 'bottomRight':
              newGeom = {
                x: screenWidth / 2,
                y: screenHeight / 2,
                width: screenWidth / 2,
                height: screenHeight / 2,
              };
              break;
          }
          return {
            windows: state.windows.map((w) =>
              w.id === id
                ? {
                    ...w,
                    ...newGeom,
                    isMaximized: false,
                    displayState: 'normal',
                    previousState: w.previousState || {
                      x: w.x,
                      y: w.y,
                      width: w.width,
                      height: w.height,
                    },
                  }
                : w
            ),
          };
        }),
      unsnapForDrag: (id, cursorX, cursorY) =>
        set((state) => ({
          windows: state.windows.map((w) => {
            if (w.id === id && w.previousState) {
              return {
                ...w,
                isMaximized: false,
                displayState: 'normal',
                width: w.previousState.width,
                height: w.previousState.height,
                x: cursorX - w.previousState.width / 2,
                y: cursorY - w.previousState.height / 2,
                previousState: undefined,
              };
            }
            return w;
          }),
        })),
    }),
    { name: 'window-storage' }
  )
);
