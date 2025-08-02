import { create } from 'zustand';

interface Position {
  x: number;
  y: number;
}

interface ContextMenuState {
  isOpen: boolean;
  position: Position;
  openMenu: (position: Position) => void;
  closeMenu: () => void;
}

export const useContextMenuStore = create<ContextMenuState>((set) => ({
  isOpen: false,
  position: { x: 0, y: 0 },
  openMenu: (position) => set({ isOpen: true, position }),
  closeMenu: () => set({ isOpen: false }),
}));
