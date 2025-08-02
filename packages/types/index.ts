// packages/types/index.ts
export interface ContainerInfo {
    Id: string;
    Names: string[];
    Image: string;
    State: 'running' | 'exited' | 'created';
    Status: string;
}