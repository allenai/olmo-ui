import '@testing-library/jest-dom/vitest';
import { server } from 'src/mocks/node';

vi.mock('zustand');
vi.stubEnv('LLMX_API_URL', 'http://localhost:8080');

beforeAll(() => {
    server.listen();
});

afterEach(() => {
    server.resetHandlers();
});

afterAll(() => {
    vi.unstubAllEnvs();
    server.close();
});
