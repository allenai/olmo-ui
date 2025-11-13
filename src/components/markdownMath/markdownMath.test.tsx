// @vitest-environment happy-dom
import { render, waitFor } from '@test-utils';

import { MathBlock } from './MathBlock';

describe('Math Markdown rendering', () => {
    it.skip('should render MathML elements', async () => {
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

    it.skip('should render inline', async () => {
        const { container } = render(<MathBlock inline={true}>{`\\sqrt{4}`}</MathBlock>);
        const expectedMathML = container.querySelector('math');

        await waitFor(() => {
            // eh -- also would rather check if expectedMathML.display is set, but that isn't specified in types
            expect(expectedMathML?.style.display).toBe(undefined);
        });
    });

    it.skip('should render block', async () => {
        const { container } = render(<MathBlock inline={false}>{`\\sqrt{4}`}</MathBlock>);
        const expectedMathML = container.querySelector('math');

        await waitFor(() => {
            // eh -- also would rather check if expectedMathML.display is set, but that isn't specified in types
            expect(expectedMathML?.style.display).toBe('block');
        });
    });
});
