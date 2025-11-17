import { QueryClient } from '@tanstack/react-query';

import { playgroundLoader, PlaygroundLoaderData } from './playgroundLoader';

describe('root playground loader', () => {
    it('should set the model from a model query param', async () => {
        const result = (await playgroundLoader(
            new QueryClient({ defaultOptions: { queries: { retry: false } } })
        )({
            params: { id: undefined },
            request: new Request(new URL('http://localhost:8080/?model=Olmo-peteish-dpo-preview')),
        })) as PlaygroundLoaderData;

        expect(result.modelId).toEqual('Olmo-peteish-dpo-preview');
    });

    it("should only set a model if the id param isn't set", async () => {
        const result = (await playgroundLoader(
            new QueryClient({ defaultOptions: { queries: { retry: false } } })
        )({
            params: { id: 'foo' },
            request: new Request(new URL('http://localhost:8080/thread/foo')),
        })) as PlaygroundLoaderData;

        expect(result.modelId).toBeUndefined();
    });

    it('should set promptTemplateId when the template query param is set on a new thread', async () => {
        const result = (await playgroundLoader(
            new QueryClient({ defaultOptions: { queries: { retry: false } } })
        )({
            params: { id: undefined },
            request: new Request(new URL('http://localhost:8080/?template=1234')),
        })) as PlaygroundLoaderData;

        expect(result.promptTemplateId).toEqual('1234');
    });

    it('should not set promptTemplateId when the template query param is passed on an existing thread', async () => {
        const result = (await playgroundLoader(
            new QueryClient({ defaultOptions: { queries: { retry: false } } })
        )({
            params: { id: 'foo' },
            request: new Request(new URL('http://localhost:8080/thread/foo?template=1234')),
        })) as PlaygroundLoaderData;

        expect(result.promptTemplateId).toBeUndefined();
        expect(result.threadId).toEqual('foo');
    });
});
