import Dockerode from 'dockerode';
import { logger } from './logger';

class DockerService {
    private docker: Dockerode;

    constructor() {
        const options = this.getDockerOptions();
        try {
            this.docker = new Dockerode(options);
            logger.info('Successfully connected to Docker.', { options });
        } catch (error) {
            logger.error('Failed to connect to Docker socket.', { error, options });
            throw error;
        }
    }

    private getDockerOptions(): Dockerode.DockerOptions {
        const method = process.env.DOCKER_CONNECTION_METHOD;

        if (method === 'tcp') {
            const host = process.env.DOCKER_HOST || '127.0.0.1';
            const port = process.env.DOCKER_PORT || '2375';
            logger.info(`Connecting to Docker via TCP: ${host}:${port}`);
            return { host, port: parseInt(port, 10) };
        }

        // Varsayılan olarak veya DOCKER_CONNECTION_METHOD='socket' ise
        const socketPath = '/var/run/docker.sock';
        logger.info(`Connecting to Docker via Socket: ${socketPath}`);
        return { socketPath };
    }

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