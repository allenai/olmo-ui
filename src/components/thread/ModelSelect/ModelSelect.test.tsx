import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';
import { act, ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { Role } from '@/api/Role';
import * as AppContext from '@/AppContext';
import { FakeAppContextProvider, useFakeAppContext } from '@/utils/FakeAppContext';

import { ModelSelect } from './ModelSelect';

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
    it("should show the selected model even if it's deprecated", async () => {
        const user = userEvent.setup();
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

        render(
            <MemoryRouter>
                <FakeAppContextProvider
                    initialState={{
                        ...getInitialState(),
                        // If this is failing after you changed the mocked models you'll need to update this!
                        selectedModel: { id: 'olmo-7b-chat' },
                    }}>
                    <ModelSelect />
                </FakeAppContextProvider>
            </MemoryRouter>
        );

        const modelSelectLocator = await screen.findByRole('combobox', { name: 'Model:' });
        expect(modelSelectLocator).toHaveTextContent('OLMo 7B - Chat');

        await act(async () => {
            await user.click(modelSelectLocator);
        });
        // If this is failing after you changed the mocked models you'll need to update this!
        expect(screen.getByRole('listbox', { name: 'Model:' }).children).toHaveLength(4);
    });

    it('should only show non-deprecated models as options', async () => {
        const user = userEvent.setup();
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

        render(
            <MemoryRouter>
                <FakeAppContextProvider
                    initialState={{
                        ...getInitialState(),
                    }}>
                    <ModelSelect />
                </FakeAppContextProvider>
            </MemoryRouter>
        );

        const modelSelectLocator = await screen.findByRole('combobox', { name: 'Model:' });
        expect(modelSelectLocator).toBeInTheDocument();
        expect(modelSelectLocator).toHaveTextContent('Tulu2.5');

        await act(async () => {
            await user.click(modelSelectLocator);
        });
        expect(screen.getByRole('listbox', { name: 'Model:' }).children).toHaveLength(3);
    });
});
