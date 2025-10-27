import { FakeQueryContextProvider, render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';
import { act, ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { Role } from '@/api/Role';
import * as AppContext from '@/AppContext';
import { FakeAppContextProvider, useFakeAppContext } from '@/utils/FakeAppContext';

import { SingleThreadModelSelect } from './SingleThreadModelSelect';

const createTestModel = (id: string, name: string): Model => ({
    id,
    name,
    description: `Test ${name}`,
    host: 'inferd' as const,
    internal: false,
    model_type: 'chat' as const,
    prompt_type: 'text_only' as const,
    information_url: 'https://allenai.org',
    is_deprecated: false,
    is_visible: true,
    max_tokens_default: 2048,
    max_tokens_lower: 1,
    max_tokens_upper: 2048,
    max_tokens_step: 1,
    stop_default: null,
    temperature_default: 0.7,
    temperature_lower: 0,
    temperature_upper: 1,
    temperature_step: 0.01,
    top_p_default: 1,
    top_p_lower: 0.01,
    top_p_upper: 1,
    top_p_step: 0.01,
});

const getInitialState = () =>
    ({
        selectedThreadRootId: 'userMessage',
        selectedThreadMessages: ['userMessage', 'llmMessage'],
        selectedThreadMessagesById: {
            userMessage: {
                id: 'userMessage',
                childIds: ['llmMessage'],
                selectedChildId: 'llmMessage',
                content: 'user prompt',
                role: Role.User,
                labels: [],
                creator: 'currentUser',
                isLimitReached: false,
                isOlderThan30Days: false,
            },
            llmMessage: {
                id: 'llmMessage',
                childIds: [],
                content: '(parens) [braces] .dot *star |pipe \\backslash "quotes"',
                role: Role.LLM,
                labels: [],
                creator: 'currentUser',
                isLimitReached: false,
                isOlderThan30Days: false,
                parent: 'userMessage',
            },
        },
        setSelectedModel: () => {},
    }) satisfies ComponentProps<typeof FakeAppContextProvider>['initialState'];

describe('Model Select', () => {
    it('should render all provided models in dropdown options', async () => {
        const user = userEvent.setup();
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

        render(
            <MemoryRouter>
                <FakeAppContextProvider
                    initialState={{
                        ...getInitialState(),
                    }}>
                    <FakeQueryContextProvider
                        selectedModel={{ id: 'tulu2.5', name: 'Tulu2.5' }}
                        availableModels={[
                            createTestModel('tulu2.5', 'Tulu2.5'),
                            createTestModel('model2', 'Model 2'),
                            createTestModel('model3', 'Model 3'),
                        ]}>
                        <SingleThreadModelSelect />
                    </FakeQueryContextProvider>
                </FakeAppContextProvider>
            </MemoryRouter>
        );

        const modelSelectLocator = await screen.findByRole('combobox', { name: 'Model:' });
        expect(modelSelectLocator).toHaveTextContent('Tulu2.5');

        await act(async () => {
            await user.click(modelSelectLocator);
        });

        // ModelSelect is a "dumb" component. It renders whatever models are passed to it
        expect(screen.getByRole('listbox', { name: 'Model:' }).children).toHaveLength(3);
    });
});
