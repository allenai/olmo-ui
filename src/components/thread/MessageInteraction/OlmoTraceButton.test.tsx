import { FakeQueryContextProvider, render, screen } from '@test-utils';
import { ComponentProps } from 'react';
import * as reactRouter from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom';

import * as AppContext from '@/AppContext';
import { ThreadViewProvider } from '@/pages/comparison/ThreadViewContext';
import { PARAM_SELECTED_MESSAGE } from '@/pages/queryParameterConsts';
import { FakeAppContextProvider, useFakeAppContext } from '@/utils/FakeAppContext';

import { OlmoTraceButton } from './OlmoTraceButton';

const FakeThreadViewProvider = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>
        <ThreadViewProvider threadId="test-thread-id" threadViewId="test-thread-view-id">
            {children}
        </ThreadViewProvider>
    </MemoryRouter>
);

describe('OlmoTraceButton', () => {
    it('shows "Hide OlmoTrace" when the message is selected', () => {
        const messageId = 'message-1';

        let searchParams = new URLSearchParams();
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);
        vi.spyOn(reactRouter, 'useSearchParams').mockImplementation(() => {
            const setURLSearchParams: reactRouter.SetURLSearchParams = (newParams) => {
                if (newParams instanceof URLSearchParams) {
                    searchParams = newParams;
                }
            };
            return [searchParams, setURLSearchParams];
        });

        const initialState = {
            attribution: { selectedMessageId: messageId },
        } satisfies ComponentProps<typeof FakeAppContextProvider>['initialState'];

        render(
            <FakeAppContextProvider initialState={initialState}>
                <FakeQueryContextProvider
                    selectedModel={{
                        infini_gram_index: 'olmoe-0125-1b-7b',
                    }}>
                    <FakeThreadViewProvider>
                        <OlmoTraceButton messageId={messageId} />
                    </FakeThreadViewProvider>
                </FakeQueryContextProvider>
            </FakeAppContextProvider>,
            {
                wrapperProps: {
                    featureToggles: { logToggles: false, isCorpusLinkEnabled: true },
                },
            }
        );

        expect(screen.getByRole('button', { name: 'Hide OlmoTrace' })).toBeInTheDocument();
    });

    it('shows "Show OlmoTrace" when the message is not selected', () => {
        const messageId = 'message-1';

        let searchParams = new URLSearchParams({ [PARAM_SELECTED_MESSAGE]: messageId });
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);
        vi.spyOn(reactRouter, 'useSearchParams').mockImplementation(() => {
            const setURLSearchParams: reactRouter.SetURLSearchParams = (newParams) => {
                if (newParams instanceof URLSearchParams) {
                    searchParams = newParams;
                }
            };
            return [searchParams, setURLSearchParams];
        });

        render(
            <FakeAppContextProvider>
                <FakeQueryContextProvider
                    selectedModel={{
                        infini_gram_index: 'olmoe-0125-1b-7b',
                    }}>
                    <FakeThreadViewProvider>
                        <OlmoTraceButton messageId={messageId} />
                    </FakeThreadViewProvider>
                </FakeQueryContextProvider>
            </FakeAppContextProvider>,
            {
                wrapperProps: {
                    featureToggles: { logToggles: false, isCorpusLinkEnabled: true },
                },
            }
        );

        expect(screen.getByRole('button', { name: 'Show OlmoTrace' })).toBeInTheDocument();
    });
});
