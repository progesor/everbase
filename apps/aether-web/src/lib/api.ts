// src/lib/api.ts
import axios from 'axios';

// Geliştirme ortamında backend'imizin çalıştığı adresi belirtiyoruz.
const API_BASE_URL = 'http://localhost:3000';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

import type { ContainerInfo } from '@/types/docker';

export const getContainers = async (): Promise<ContainerInfo[]> => {
    const response = await apiClient.get('/api/docker/containers');
    return response.data;
};

// İleride buraya interceptor'lar ekleyerek
// her isteğe otomatik olarak token ekleme veya
// hataları merkezi olarak yönetme gibi işlemler yapabiliriz.