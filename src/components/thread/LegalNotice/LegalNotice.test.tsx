import { render, screen } from '@test-utils';

import * as AppContext from '@/AppContext';
import { FakeAppContextProvider, useFakeAppContext } from '@/utils/FakeAppContext';

import { LegalNotice } from './LegalNotice';

describe('LegalNotice', () => {
    it("should show no family-specific legal notice if one doesn't exist", () => {
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

        render(
            <FakeAppContextProvider initialState={{}}>
                <LegalNotice />
            </FakeAppContextProvider>
        );

        expect(
            screen.queryByText(
                (_, element) =>
                    element?.textContent ===
                    'By using Ai2 Playground, you agree to Ai2’s Terms of use, Privacy policy, and Responsible use guidelines. Llama Tulu3 models were built with Llama subject to the Meta Llama 3.1 Community License Agreement. This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.'
            )
        ).not.toBeInTheDocument();

        expect(
            screen.getByText(
                (_, element) =>
                    element?.textContent ===
                    'By using Ai2 Playground, you agree to Ai2’s Terms of use, Privacy policy, and Responsible use guidelines. Llama Tulu3 models were built with Llama subject to the Meta Llama 3.1 Community License Agreement. This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.'
            )
        ).toBeVisible();
    });

    it('should show family-specific legal notice', () => {
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

        render(
            <FakeAppContextProvider initialState={{ selectedModel: { family_id: 'tulu' } }}>
                <LegalNotice />
            </FakeAppContextProvider>
        );

        expect(
            screen.getByText(
                (_, element) =>
                    element?.textContent ===
                    'By using Ai2 Playground, you agree to Ai2’s Terms of use, Privacy policy, and Responsible use guidelines. Llama Tulu3 models were built with Llama subject to the Meta Llama 3.1 Community License Agreement. This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.'
                // element?.textContent?.includes(
                //     'Llama Tulu3 models were built with Llama subject to the Meta Llama 3.1 Community License Agreement.'
                // )
            )
        ).toBeVisible();
    });
});
