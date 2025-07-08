import { QueryClient } from '@tanstack/react-query';

import { playgroundLoader } from './UIRefreshThreadPage';

interface PlaygroundLoaderData {
    preselectedModelId?: string;
}

describe('root playground loader', () => {
    it('should set the model from a model query param', async () => {
        const result = (await playgroundLoader(
            new QueryClient({ defaultOptions: { queries: { retry: false } } })
        )({
            params: { id: undefined },
            request: new Request(new URL('http://localhost:8080/?model=OLMo-peteish-dpo-preview')),
        })) as PlaygroundLoaderData;

        expect(result.preselectedModelId).toEqual('OLMo-peteish-dpo-preview');
    });

    it("should set to the first non-deprecated model if the model query param doesn't match a real model", async () => {
        const result = (await playgroundLoader(
            new QueryClient({ defaultOptions: { queries: { retry: false } } })
        )({
            params: { id: undefined },
            request: new Request(new URL('http://localhost:8080/?model=fake-model')),
        })) as PlaygroundLoaderData;

        expect(result.preselectedModelId).toEqual('tulu2');
    });

    it("should only set a model if the id param isn't set", async () => {
        const result = (await playgroundLoader(
            new QueryClient({ defaultOptions: { queries: { retry: false } } })
        )({
            params: { id: 'foo' },
            request: new Request(new URL('http://localhost:8080/thread/foo')),
        })) as PlaygroundLoaderData;

        expect(result.preselectedModelId).toBeUndefined();
    });
});
