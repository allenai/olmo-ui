import { appContext } from '@/AppContext';

import { playgroundLoader } from './UIRefreshThreadPage';

describe('root playground loader', () => {
    it('should set the model from a model query param', async () => {
        await playgroundLoader({
            params: { id: undefined },
            request: new Request(new URL('http://localhost:8080/?model=OLMo-peteish-dpo-preview')),
        });

        expect(appContext.getState().selectedModel?.id).toEqual('OLMo-peteish-dpo-preview');
    });
});
