// src/lib/api.ts
import axios from 'axios';
import {ContainerInfo} from "@everbase/types";

// Geliştirme ortamında backend'imizin çalıştığı adresi belirtiyoruz.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


export const getContainers = async (): Promise<ContainerInfo[]> => {
    const response = await apiClient.get('/api/docker/containers');
    return response.data;
};

// İleride buraya interceptor'lar ekleyerek
// her isteğe otomatik olarak token ekleme veya
// hataları merkezi olarak yönetme gibi işlemler yapabiliriz.