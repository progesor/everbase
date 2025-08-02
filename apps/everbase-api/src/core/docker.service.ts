// src/core/docker.service.ts

import Dockerode from 'dockerode';
import { logger } from './logger';

class DockerService {
    private docker: Dockerode;

    constructor() {
        try {
            // Explicitly connect via the TCP socket exposed by Docker Desktop
            this.docker = new Dockerode({ host: '127.0.0.1', port: 2375 });
            logger.info('Attempting to connect to Docker via TCP socket (localhost:2375).');
        } catch (error) {
            logger.error('Failed to initialize Dockerode.', error);
            throw error;
        }
    }

    // The listContainers method remains the same.
    public async listContainers() {
        try {
            const containers = await this.docker.listContainers({ all: true });
            logger.info(`Found ${containers.length} containers.`);
            return containers;
        } catch (error) {
            logger.error('Failed to list Docker containers.', error);
            return [];
        }
    }
}

export const dockerService = new DockerService();