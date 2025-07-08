import { FakeQueryContextProvider, render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';
import { act, ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { Role } from '@/api/Role';
import * as AppContext from '@/AppContext';
import { FakeAppContextProvider, useFakeAppContext } from '@/utils/FakeAppContext';

import { SingleThreadModelSelect } from './ThreadModelSelect';

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
                            { id: 'tulu2.5', name: 'Tulu2.5', is_deprecated: false },
                            { id: 'model2', name: 'Model 2', is_deprecated: false },
                            { id: 'model3', name: 'Model 3', is_deprecated: false },
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
