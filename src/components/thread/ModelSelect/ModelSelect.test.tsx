import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';
import { act, ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { Model } from '@/api/playgroundApi/additionalTypes';
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
        models: [
            {
                description: "AI2's 7B model following the 'peteish' thread of improvements.",
                host: 'modal',
                id: 'OLMo-peteish-dpo-preview',
                is_deprecated: true,
                model_type: 'chat',
                name: 'OLMo-peteish-dpo-preview',
                accepts_files: false,
                prompt_type: 'text_only',
                internal: false,
                is_visible: true,
            },
            {
                description: "A preview version of Ai2's latest Tulu model",
                host: 'modal',
                id: 'Llama-3-1-Tulu-3-8B',
                is_deprecated: false,
                model_type: 'chat',
                name: 'Llama Tülu 3 8B',
                accepts_files: false,
                prompt_type: 'text_only',
                internal: false,
                is_visible: true,
            },
        ] satisfies Model[],
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
                        selectedModel: { id: 'OLMo-peteish-dpo-preview' },
                    }}>
                    <ModelSelect />
                </FakeAppContextProvider>
            </MemoryRouter>
        );

        const modelSelectLocator = screen.getByRole('combobox', { name: 'Model:' });
        expect(modelSelectLocator).toHaveTextContent('OLMo-peteish-dpo-preview');

        await act(async () => {
            await user.click(modelSelectLocator);
        });
        expect(screen.getByRole('listbox', { name: 'Model:' }).children).toHaveLength(2);
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

        const modelSelectLocator = screen.getByRole('combobox', { name: 'Model:' });
        expect(modelSelectLocator).toHaveTextContent('Llama Tülu 3 8B');

        await act(async () => {
            await user.click(modelSelectLocator);
        });
        expect(screen.getByRole('listbox', { name: 'Model:' }).children).toHaveLength(1);
    });
});
