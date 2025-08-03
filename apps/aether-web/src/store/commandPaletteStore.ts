import { create } from 'zustand';

interface CommandPaletteState {
  isOpen: boolean;
  toggle: () => void;
  setOpen: (open: boolean) => void;
}

/**
 * Komut Paleti'nin görünürlük durumunu yöneten global store.
 */
export const useCommandPaletteStore = create<CommandPaletteState>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (open) => set({ isOpen: open }),
}));
