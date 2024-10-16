import { render, screen } from '@test-utils';

import { BoldTextForDocumentAttribution } from './BoldTextForDocumentAttribution';

describe('BoldTextForDocumentAttribution', () => {
    it('should bold text that has regex-reserved characters', () => {
        render(
            <BoldTextForDocumentAttribution
                correspondingSpans={['(parens)']}
                text="this is some text before (parens) this is text after"
            />
        );

        expect(screen.getByText('(parens)')).toHaveStyle('font-weight: 700');
    });
});
