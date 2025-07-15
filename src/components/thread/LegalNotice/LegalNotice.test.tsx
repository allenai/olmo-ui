import { FakeQueryContextProvider, render, screen } from '@test-utils';

import * as AppContext from '@/AppContext';
import { FakeAppContextProvider, useFakeAppContext } from '@/utils/FakeAppContext';

import { LegalNotice } from './LegalNotice';

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
                    element.textContent.includes(
                        'Llama Tulu3 models were built with Llama subject to the Meta Llama 3.1 Community License Agreement.'
                    )
            )
        ).not.toBeInTheDocument();

        expect(
            screen.getByText(
                (_, element) =>
                    element?.tagName.toLowerCase() === 'div' &&
                    element.textContent ===
                        'Ai2 Playground is a free scientific and educational tool and by using it you agree to Ai2’s Terms of use, Privacy policy, and Responsible use guidelines. This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.'
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
                    element?.tagName.toLowerCase() === 'div' &&
                    element.textContent ===
                        'Ai2 Playground is a free scientific and educational tool and by using it you agree to Ai2’s Terms of use, Privacy policy, and Responsible use guidelines. This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply. Llama Tulu3 models were built with Llama subject to the Meta Llama 3.1 Community License Agreement.'
            )
        ).toBeVisible();
    });
});
