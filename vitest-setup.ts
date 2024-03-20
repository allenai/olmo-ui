import '@testing-library/jest-dom/vitest';
import { server } from 'src/mocks/node';

vi.mock('zustand');

beforeAll(() => {
    vi.stubEnv('LLMX_API_URL', '');
    server.listen();
});

afterEach(() => {
    server.resetHandlers();
});

afterAll(() => {
    vi.unstubAllEnvs();
    server.close();
});
