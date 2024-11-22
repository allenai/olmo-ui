import { render, screen } from '@test-utils';
import { ComponentProps } from 'react';

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
            },
            {
                description: "A preview version of Ai2's latest Tulu model",
                host: 'modal',
                id: 'Llama-3-1-Tulu-3-8B',
                is_deprecated: false,
                model_type: 'chat',
                name: 'Llama Tülu 3 8B',
            },
        ],
    }) satisfies ComponentProps<typeof FakeAppContextProvider>['initialState'];

describe('Model Select', () => {
    it("should show the selected model even if it's deprecated", () => {
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

        render(
            <FakeAppContextProvider
                initialState={{
                    ...getInitialState(),
                    selectedModel: { id: 'OLMo-peteish-dpo-preview' },
                }}>
                <ModelSelect />
            </FakeAppContextProvider>
        );

        screen.debug();
        expect(screen.getByRole('combobox', { name: 'Model' })).toHaveTextContent(
            'OLMo-peteish-dpo-preview'
        );
    });
});
