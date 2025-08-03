import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Bir ikonun pozisyonunu tanımlayan tip.
type IconPosition = { x: number; y: number };

interface DesktopState {
  selectedIcons: string[];
  iconPositions: Record<string, IconPosition>; // Her ikonun pozisyonunu saklar.
  selectIcon: (iconId: string) => void;
  toggleIconSelection: (iconId: string) => void;
  clearSelection: () => void;
  setIconPosition: (iconId: string, position: IconPosition) => void; // Yeni fonksiyon
}

/**
 * Masaüstü etkileşimlerinin durumunu yönetir.
 */
export const useDesktopStore = create<DesktopState>()(
  persist(
    (set) => ({
      selectedIcons: [],
      iconPositions: {}, // Başlangıçta boş.
      selectIcon: (iconId) => set({ selectedIcons: [iconId] }),
      toggleIconSelection: (iconId) =>
        set((state) => {
          const isSelected = state.selectedIcons.includes(iconId);
          if (isSelected) {
            return {
              selectedIcons: state.selectedIcons.filter((id) => id !== iconId),
            };
          } else {
            return { selectedIcons: [...state.selectedIcons, iconId] };
          }
        }),
      clearSelection: () => set({ selectedIcons: [] }),
      // Bir ikonun pozisyonunu günceller.
      setIconPosition: (iconId, position) =>
        set((state) => ({
          iconPositions: {
            ...state.iconPositions,
            [iconId]: position,
          },
        })),
    }),
    {
      name: 'desktop-storage', // localStorage'daki anahtar
      storage: createJSONStorage(() => localStorage),
    }
  )
);
