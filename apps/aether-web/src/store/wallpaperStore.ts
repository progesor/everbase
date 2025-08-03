import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Kullanılabilir duvar kağıtlarının listesi.
// Gerçek projede bu, bir API'den veya konfigürasyon dosyasından gelebilir.
export const wallpapers = [
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2940&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=2940&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2940&auto=format&fit=crop',
];

interface WallpaperState {
  currentWallpaper: string;
  setWallpaper: (url: string) => void;
}

// Seçilen duvar kağıdını tarayıcı hafızasında saklamak için yeni bir store.
export const useWallpaperStore = create<WallpaperState>()(
  persist(
    (set) => ({
      currentWallpaper: wallpapers[0], // Varsayılan duvar kağıdı
      setWallpaper: (url) => set({ currentWallpaper: url }),
    }),
    {
      name: 'wallpaper-storage', // localStorage'daki anahtar
      storage: createJSONStorage(() => localStorage),
    }
  )
);
