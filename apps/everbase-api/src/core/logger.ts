// src/core/logger.ts

const getTimestamp = (): string => new Date().toISOString();

export const logger = {
    info: (message: string, data?: object) => {
        console.log(`[INFO] ${getTimestamp()}: ${message}`, data || "");
    },
    warn: (message: string, data?: object) => {
        console.warn(`[WARN] ${getTimestamp()}: ${message}`, data || "");
    },
    error: (message: string, error?: unknown) => {
        console.error(`[ERROR] ${getTimestamp()}: ${message}`, error || "");
    },
};