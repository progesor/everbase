import { Elysia } from 'elysia';

const app = new Elysia()
    .get("/api/health", () => ({
        status: "ok",
        time: new Date().toISOString(),
    }))
    .listen(3000);

console.log(
    `🦊 Everbase API is running at ${app.server?.hostname}:${app.server?.port}`
);