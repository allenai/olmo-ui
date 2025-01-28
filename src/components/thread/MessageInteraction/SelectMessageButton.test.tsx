import { render, screen } from '@test-utils';
import { ComponentProps } from 'react';

import * as AppContext from '@/AppContext';
import { FakeAppContextProvider, useFakeAppContext } from '@/utils/FakeAppContext';

import { SelectMessageButton } from './SelectMessageButton';

describe('SelectMessageButton', () => {
    it('should show "Hide training text" when the message is selected', () => {
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

        const initialState = {
            attribution: {
                selectedMessageId: 'message-1',
            },
        } satisfies ComponentProps<typeof FakeAppContextProvider>['initialState'];

        render(
            <FakeAppContextProvider initialState={initialState}>
                <SelectMessageButton messageId="message-1" />
            </FakeAppContextProvider>,
            {
                wrapperProps: {
                    featureToggles: {
                        logToggles: false,
                        isCorpusLinkEnabled: true,
                    },
                },
            }
        );

        expect(screen.getByRole('button', { name: 'Hide training text' })).toBeInTheDocument();
    });

    it('should show "Match training text" when the message is not selected', () => {
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

        render(
            <FakeAppContextProvider>
                <SelectMessageButton messageId="message-1" />
            </FakeAppContextProvider>,
            {
                wrapperProps: {
                    featureToggles: {
                        logToggles: false,
                        isCorpusLinkEnabled: true,
                    },
                },
            }
        );

        expect(screen.getByRole('button', { name: 'Match training text' })).toBeInTheDocument();
    });
});
