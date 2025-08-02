// src/index.ts

import { Elysia } from 'elysia';
import { logger } from './core/logger';
import cors from '@elysiajs/cors';
import { dockerService } from './core/docker.service';

const app = new Elysia()
  .use(cors())
  .onError(({ code, error, set }) => {
    logger.error(`Request failed with code: ${code}`, error);
    if (code === 'NOT_FOUND') {
      set.status = 404;
      return { message: 'Not Found' };
    }
    set.status = 500;
    return { message: 'Internal Server Error' };
  })
  .group('/api/v1', (app) =>
    app
      .get('/health', () => ({
        status: 'ok',
        time: new Date().toISOString(),
      }))
      .get('/docker/containers', async () => {
        const containers = await dockerService.listContainers();
        return containers;
      })
  )
  .get('/api/error', () => {
    // Bu test endpoint'ini grup dışında bırakabiliriz.
    throw new Error('This is a test error!');
  })
  .listen(3000);

logger.info(
  `🦊 Everbase API is running at ${app.server?.hostname}:${app.server?.port}`
);
