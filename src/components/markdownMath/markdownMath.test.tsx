import { render, waitFor } from '@test-utils';

import { MathBlock } from './MathBlock';

describe('Math Markdown rendering', () => {
    it('should render MathML elements', async () => {
        const { container } = render(<MathBlock>{`\\sqrt{4}`}</MathBlock>);
        const expectedMathML = container.querySelector('math > msqrt');

        await waitFor(() => {
            // need better testing, but support for MathML seems lacking here
            expect(expectedMathML?.textContent).toBe('4');
        });
    });

    it('should render original text if invalid', async () => {
        const { container } = render(<MathBlock>{`\\sqrt{4`}</MathBlock>);

        await waitFor(() => {
            expect(container).toHaveTextContent('\\sqrt{4');
        });
    });
});
