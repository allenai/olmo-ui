import { appContext } from '@/AppContext';

import { playgroundLoader } from './UIRefreshThreadPage';

describe('root playground loader', () => {
    it('should set the model from a model query param', async () => {
        expect(appContext.getState().selectedModel?.id).not.toEqual('OLMo-peteish-dpo-preview');

        await playgroundLoader({
            params: { id: undefined },
            request: new Request(new URL('http://localhost:8080/?model=OLMo-peteish-dpo-preview')),
        });

        expect(appContext.getState().selectedModel?.id).toEqual('OLMo-peteish-dpo-preview');
    });

    it("should not set a model if the model query param doesn't match a real model", async () => {
        expect(appContext.getState().selectedModel?.id).not.toEqual('OLMo-peteish-dpo-preview');

        await playgroundLoader({
            params: { id: undefined },
            request: new Request(new URL('http://localhost:8080/?model=fake-model')),
        });

        expect(appContext.getState().selectedModel?.id).toEqual('tulu2');
    });
});
