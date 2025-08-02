// src/index.ts

import { Elysia } from 'elysia';
import { logger } from './core/logger';
import cors from "@elysiajs/cors";
import {dockerService} from "./core/docker.service.ts"; // Logger'ı import et

const app = new Elysia()
    // Hata yakalama mekanizması
    .use(cors())
    .onError(({ code, error, set }) => {
        logger.error(`Request failed with code: ${code}`, error);

        // İsteğe bağlı olarak istemciye genel bir hata mesajı dönebiliriz
        if (code === 'NOT_FOUND') {
            set.status = 404;
            return { message: 'Not Found' };
        }

        set.status = 500;
        return { message: 'Internal Server Error' };
    })
    .get("/api/health", () => ({
        status: "ok",
        time: new Date().toISOString(),
    }))
    // Hata yakalayıcıyı test etmek için geçici bir endpoint
    .get("/api/error", () => {
        throw new Error("This is a test error!");
    })
    .get("/api/docker/containers", async () => {
        const containers = await dockerService.listContainers();
        return containers;
    })
    .listen(3000);

logger.info( // console.log yerine logger.info kullan
    `🦊 Everbase API is running at ${app.server?.hostname}:${app.server?.port}`);