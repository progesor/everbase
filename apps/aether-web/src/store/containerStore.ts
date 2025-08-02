import { create } from 'zustand';
import { getContainers } from '@/lib/api';
import type { ContainerInfo } from '@everbase/types';

// Store'umuzun tutacağı verinin yapısını tanımlıyoruz
interface ContainerState {
    containers: ContainerInfo[];
    isLoading: boolean;
    error: string | null;
    fetchContainers: () => Promise<void>; // Veri çekme fonksiyonu
}

export const useContainerStore = create<ContainerState>((set) => ({
    // Başlangıç değerleri
    containers: [],
    isLoading: true,
    error: null,

    // Veri çekme eylemi (action)
    fetchContainers: async () => {
        set({ isLoading: true, error: null }); // Yüklemeyi başlat
        try {
            const data = await getContainers();
            set({ containers: data, isLoading: false }); // Başarılı olursa veriyi ve yükleme durumunu ayarla
        } catch (err) {
            console.error("Failed to fetch containers:", err);
            set({ error: "Konteynerler yüklenemedi.", isLoading: false }); // Hata olursa hatayı ve yükleme durumunu ayarla
        }
    },
}));