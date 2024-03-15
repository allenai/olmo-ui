import { render, screen } from '@test-utils';

import userEvent from '@testing-library/user-event';
import { ModelApiUrl, ModelList } from 'src/api/Model';
import { JSONPromptTemplateList, PromptTemplateApiUrl } from 'src/api/PromptTemplate';

import { NewQuery } from './NewQuery';

const fetchMock = vi.fn<Parameters<typeof fetch>, ReturnType<typeof fetch>>();

const fakeModelsResponse: ModelList = [
    {
        description: "AI2's 7B model trained on the Dolma dataset and fine-tuned for chat.",
        id: 'olmo-7b-chat',
        model_type: 'chat',
        name: 'OLMo 7B - Chat',
    },
    {
        description: "AI2's 7B model trained on the Dolma dataset.",
        id: 'olmo-7b-base',
        model_type: 'base',
        name: 'OLMo 7B - Base',
    },
];
const fakePromptsResponse: JSONPromptTemplateList = [
    { id: 'id', name: 'name', content: 'content', creator: 'creator', created: '1710371316729' },
];

describe('NewQuery', () => {
    beforeEach(() => {
        fetchMock.mockImplementation(async (url) => {
            if (url.toString().includes(ModelApiUrl)) {
                return new Response(JSON.stringify(fakeModelsResponse));
            }

            if (url.toString().includes(PromptTemplateApiUrl)) {
                return new Response(JSON.stringify(fakePromptsResponse));
            }

            // I tried to get a stream mock for the prompt's postMessage call but couldn't get it working.
            // This intentionally doesn't have that now because it's hard lol

            throw new Error(`Tried to fetch a URL without a mock: ${url}`);
        });
        vi.stubGlobal('fetch', fetchMock);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    test('should send a prompt', async () => {
        const user = userEvent.setup();

        render(<NewQuery />);

        const promptInput = await screen.findByPlaceholderText(
            'Select a Prompt Template above or type a free form prompt'
        );

        await user.type(promptInput, 'Hello');
        await user.click(screen.getByRole('button', { name: 'Prompt' }));

        expect(fetchMock).toHaveBeenCalledWith(
            expect.stringContaining('/v3/message/stream'),
            expect.objectContaining({
                body: expect.stringContaining('"content":"Hello"'),
            })
        );
    });

    test('should populate the models list and change title description when selecting a new model', async () => {
        const user = userEvent.setup();

        render(<NewQuery />);

        const modelSelect = await screen.findByRole('combobox', { name: 'Model' });

        // Make sure the tooltip is showing the description for the first option
        await user.hover(modelSelect);
        expect(await screen.findByText(fakeModelsResponse[0].description)).toBeVisible();

        // Select the second option
        await user.click(modelSelect);
        await user.click(screen.getByRole('option', { name: fakeModelsResponse[1].name }));

        // Check the tooltip has the second option's description now
        await user.hover(modelSelect);
        expect(await screen.findByText(fakeModelsResponse[1].description)).toBeVisible();
    });

    // test('should populate the templates list and set a template when selecting one', async () => {});
});
