import { FakeQueryContextProvider, render, screen } from '@test-utils';

import * as AppContext from '@/AppContext';
import { FakeAppContextProvider, useFakeAppContext } from '@/utils/FakeAppContext';

import { LegalNotice } from './LegalNotice';

const LEGAL_NOTICE_TEXT =
    'Ai2 Playground is a free scientific and educational tool and by using it you agree to Ai2’s Terms of use, and Responsible Use Guidelines, and have read Ai2’s Privacy policy. This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.';
const FAMILY_SPECIFIC_LEGAL_NOTICE_TEXT =
    'Llama Tulu3 models were built with Llama subject to the Meta Llama 3.1 Community License Agreement.';

describe('LegalNotice', () => {
    it("should show no family-specific legal notice if one doesn't exist", () => {
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

        render(
            <FakeAppContextProvider initialState={{}}>
                <FakeQueryContextProvider>
                    <LegalNotice />
                </FakeQueryContextProvider>
            </FakeAppContextProvider>
        );

        expect(
            screen.queryByText(
                (_, element) =>
                    element?.textContent != null &&
                    element.textContent.includes(FAMILY_SPECIFIC_LEGAL_NOTICE_TEXT)
            )
        ).not.toBeInTheDocument();

        expect(
            screen.getByText(
                (_, element) =>
                    element?.tagName.toLowerCase() === 'p' &&
                    element.textContent === LEGAL_NOTICE_TEXT
            )
        ).toBeVisible();
    });

    it('should show family-specific legal notice', () => {
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

        render(
            <FakeAppContextProvider initialState={{}}>
                <FakeQueryContextProvider selectedModel={{ family_id: 'tulu' }}>
                    <LegalNotice />
                </FakeQueryContextProvider>
            </FakeAppContextProvider>
        );

        expect(
            screen.getByText(
                (_, element) =>
                    element?.tagName.toLowerCase() === 'p' &&
                    element.textContent ===
                        LEGAL_NOTICE_TEXT + ' ' + FAMILY_SPECIFIC_LEGAL_NOTICE_TEXT
            )
        ).toBeVisible();
    });
});
