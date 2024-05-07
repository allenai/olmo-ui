import '@testing-library/jest-dom/vitest';

import { SetupServerApi } from 'msw/node';

vi.mock('zustand');
vi.stubEnv('LLMX_API_URL', 'http://localhost:8080');
vi.stubEnv('DOLMA_API_URL', '/api');

let server: SetupServerApi;

beforeAll(async () => {
    const { server: importedServer } = await import('src/mocks/node');
    server = importedServer;

    server.listen({ onUnhandledRequest: 'error' });
    // need to mock sendBeacon, which is a part of our analytics tracking
    Object.assign(navigator, {
        sendBeacon: async () => {},
    });
});

afterEach(() => {
    server.resetHandlers();
});

afterAll(() => {
    vi.unstubAllEnvs();
    server.close();
});
