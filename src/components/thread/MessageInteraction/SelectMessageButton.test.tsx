import { FakeQueryContextProvider, render, screen } from '@test-utils';
import { ComponentProps } from 'react';
import * as reactRouter from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom';

import * as AppContext from '@/AppContext';
import { ThreadViewProvider } from '@/pages/comparison/ThreadViewContext';
import { FakeAppContextProvider, useFakeAppContext } from '@/utils/FakeAppContext';

import { PARAM_SELECTED_MESSAGE } from '../ThreadDisplay/selectedThreadPageLoader';
import { SelectMessageButton } from './SelectMessageButton';

const FakeThreadViewProvider = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>
        <ThreadViewProvider threadId="test-thread-id" threadViewId="test-thread-view-id">
            {children}
        </ThreadViewProvider>
    </MemoryRouter>
);

describe('SelectMessageButton', () => {
    it('should show "Hide OLMoTrace" when the message is selected', () => {
        let searchParams = new URLSearchParams();
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);
        vi.spyOn(reactRouter, 'useSearchParams').mockImplementation(() => {
            const setURLSearchParams: reactRouter.SetURLSearchParams = (
                newParams?:
                    | reactRouter.URLSearchParamsInit
                    | ((prev: URLSearchParams) => reactRouter.URLSearchParamsInit)
            ) => {
                if (newParams instanceof URLSearchParams) {
                    searchParams = newParams;
                }
            };
            return [searchParams, setURLSearchParams];
        });

        const initialState = {
            attribution: {
                selectedMessageId: 'message-1',
            },
        } satisfies ComponentProps<typeof FakeAppContextProvider>['initialState'];

        render(
            <FakeAppContextProvider initialState={initialState}>
                <FakeQueryContextProvider>
                    <FakeThreadViewProvider>
                        <SelectMessageButton messageId="message-1" />
                    </FakeThreadViewProvider>
                </FakeQueryContextProvider>
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

        expect(screen.getByRole('button', { name: 'Hide OLMoTrace' })).toBeInTheDocument();
    });

    it('should show "Show OLMoTrace" when the message is not selected', () => {
        let searchParams = new URLSearchParams({
            [PARAM_SELECTED_MESSAGE]: 'message-1',
        });
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);
        vi.spyOn(reactRouter, 'useSearchParams').mockImplementation(() => {
            const setURLSearchParams: reactRouter.SetURLSearchParams = (
                newParams?:
                    | reactRouter.URLSearchParamsInit
                    | ((prev: URLSearchParams) => reactRouter.URLSearchParamsInit)
            ) => {
                if (newParams instanceof URLSearchParams) {
                    searchParams = newParams;
                }
            };
            return [searchParams, setURLSearchParams];
        });

        render(
            <FakeAppContextProvider>
                <FakeQueryContextProvider>
                    <FakeThreadViewProvider>
                        <SelectMessageButton messageId="message-1" />
                    </FakeThreadViewProvider>
                </FakeQueryContextProvider>
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

        expect(screen.getByRole('button', { name: 'Show OLMoTrace' })).toBeInTheDocument();
    });
});
