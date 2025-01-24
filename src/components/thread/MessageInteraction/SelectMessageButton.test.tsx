import { render, screen } from '@test-utils';
import { ComponentProps } from 'react';

import * as AppContext from '@/AppContext';
import { FakeAppContextProvider, useFakeAppContext } from '@/utils/FakeAppContext';

import { SelectMessageButton } from './SelectMessageButton';

describe('SelectMessageButton', () => {
    it('should show "Match training text" when selected and the drawer is closed', () => {
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

        const initialState = {
            currentOpenDrawer: null,
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

        expect(screen.getByRole('button', { name: 'Match training text' })).toBeInTheDocument();
    });

    it('should show "Hide training text" when selected and the drawer is open', () => {
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

        const initialState = {
            currentOpenDrawer: 'attribution',
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

    it('should show "Match training text" when not selected and the drawer is open', () => {
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

        const initialState = {
            currentOpenDrawer: 'attribution',
            attribution: {},
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

        expect(screen.getByRole('button', { name: 'Match training text' })).toBeInTheDocument();
    });
});
