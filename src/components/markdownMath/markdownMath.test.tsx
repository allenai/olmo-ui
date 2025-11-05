import { render, waitFor } from '@test-utils';

import { MarkdownRenderer } from '@/components/thread/Markdown/MarkdownRenderer';

import { markdownWithMathBlock } from './markdownConsts';

describe('Math Markdown rendering', () => {
    it('should should re', async () => {
        const { container } = render(<MarkdownRenderer>{markdownWithMathBlock}</MarkdownRenderer>);

        await waitFor(() => {
            const mathEl = container.querySelector('math');

            expect(mathEl).toBeVisible();
        });
    });
});
