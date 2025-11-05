import { IDLE_NAVIGATION } from '@remix-run/router';
import { render, screen, waitFor } from '@test-utils';
import { http, HttpResponse } from 'msw';

import * as AppContext from '@/AppContext';
import { SingleThreadProvider } from '@/contexts/SingleThreadProvider';
import { server } from '@/mocks/node';
import { FakeAppContextProvider, useFakeAppContext } from '@/utils/FakeAppContext';
import { createMockModel } from '@/utils/test/createMockModel';

import { ToolCallDisplay } from './ToolCallDisplay';

vi.mock('react-router-dom', () => ({
    useNavigate: () => vi.fn(),
    useParams: vi.fn(() => ({ id: undefined })),
    useLocation: () => vi.fn(),
    useNavigation: () => IDLE_NAVIGATION,
    useSearchParams: vi.fn(() => [new URLSearchParams(), vi.fn()]),
}));

beforeEach(() => {
    vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);
});

const mockModelsApi = (models: ReturnType<typeof createMockModel>[]) => {
    server.use(
        http.get('http://localhost:8080/v4/models/', () => {
            return HttpResponse.json(models);
        })
    );
};

const renderWithProvider = ({ selectedModelId }: { selectedModelId: string }) => {
    return render(
        <FakeAppContextProvider initialState={{}}>
            <SingleThreadProvider initialState={{ modelId: selectedModelId }}>
                <ToolCallDisplay />
            </SingleThreadProvider>
        </FakeAppContextProvider>
    );
};

describe('ToolCallDisplay', () => {
    beforeEach(() => {
        mockModelsApi([
            createMockModel('has-tools', { can_call_tools: true }),
            createMockModel('no-tools', { can_call_tools: false }),
        ]);
    });

    it('should show tool call placeholder component when model allows tool calling', async () => {
        renderWithProvider({
            selectedModelId: 'has-tools',
        });

        await waitFor(() => {
            expect(screen.getByLabelText('This model allows tool calling')).toBeVisible();
        });
    });

    it('should not show tool call placeholder if model doesnt call tools', async () => {
        renderWithProvider({
            selectedModelId: 'no-tools',
        });

        await waitFor(() => {
            expect(
                screen.queryByLabelText('This model allows tool calling')
            ).not.toBeInTheDocument();
        });
    });
});
