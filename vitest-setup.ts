import '@testing-library/jest-dom/vitest';
import { server } from 'src/mocks/node';

vi.mock('zustand');
vi.stubEnv('LLMX_API_URL', 'http://localhost:8080');
vi.stubEnv('DOLMA_API_URL', '/api');

beforeAll(() => {
    server.listen();
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
