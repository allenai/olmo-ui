import { getByRole, render, screen } from '@test-utils';

import { NewQuery } from '.';
import { ModelApiUrl, ModelList } from 'src/api/Model';
import { JSONPromptTemplateList, PromptTemplateApiUrl } from 'src/api/PromptTemplate';
import userEvent from '@testing-library/user-event';

const fetchMock = vi.fn<Parameters<typeof fetch>, ReturnType<typeof fetch>>()

const fakeModelsResponse: ModelList = [{"description": "AI2's 7B model trained on the Dolma dataset and fine-tuned for chat.", "id": "olmo-7b-chat", "model_type": "chat", "name": "OLMo 7B - Chat"}, {"description": "AI2's 7B model trained on the Dolma dataset.", "id": "olmo-7b-base", "model_type": "base", "name": "OLMo 7B - Base"}]
const fakePromptsResponse: JSONPromptTemplateList = [{id: "id", name: "name", content: "content", creator: "creator", created: '1710371316729' }]

describe('NewQuery', () => {
    beforeEach(() => {
        fetchMock.mockImplementation(async (url, options) => {
            if (url.toString().includes(ModelApiUrl)) {
                return new Response(JSON.stringify(fakeModelsResponse))
            }

            if (url.toString().includes(PromptTemplateApiUrl)) {
                return new Response(JSON.stringify(fakePromptsResponse))
            }
            
            throw new Error(`Tried to fetch a URL without a mock: ${url}`)
        })
        vi.stubGlobal('fetch', fetchMock)
    })
    
    afterEach(() => {
        vi.unstubAllGlobals()
    })
    
    test('should send a prompt', async () => {
        const user = userEvent.setup()
        
        render(<NewQuery />);

        const promptInput = await screen.findByPlaceholderText('Select a Prompt Template above or type a free form prompt')
        
        user.type(promptInput, 'Hello')
        screen.debug()
        user.click(screen.getByRole('button', { name: 'Prompt' }))
        
        expect(fetchMock).toHaveBeenCalledTimes(3)
    });
});
