import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { DecoratorFunction } from 'storybook/internal/types';

export interface MockReactQueryParameters {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockData?: Array<{ queryKey: any; data: unknown }>;
}

const storyQueryClient = new QueryClient({
    defaultOptions: { queries: { enabled: false } },
});

export const withMockReactQuery: DecoratorFunction = (
    Story,
    { parameters: { mockData = [] } }: { parameters: MockReactQueryParameters }
) => {
    for (const { queryKey, data } of mockData) {
        storyQueryClient.setQueryData(queryKey, data);
    }

    return (
        <QueryClientProvider client={storyQueryClient}>
            <ReactQueryDevtools client={storyQueryClient} />
            <Story />
        </QueryClientProvider>
    );
};
