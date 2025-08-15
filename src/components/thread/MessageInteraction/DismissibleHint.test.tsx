import { fireEvent, render, screen } from '@test-utils';
import { vi } from 'vitest';

import { DismissibleHint } from './DismissibleHint';

describe('DismissibleHint', () => {
    it('renders string title and string content', () => {
        const title = 'Title text';
        const body = 'Body text';
        render(<DismissibleHint onClose={() => {}} title={title} content={body} />);

        expect(screen.getByText(title)).toBeInTheDocument(); // subtitle2 Typography
        expect(screen.getByText(body)).toBeInTheDocument(); // body2 Typography
    });

    it('renders node title and node content', () => {
        const nodeTitleId = 'node-title';
        const nodeContentId = 'node-content';
        render(
            <DismissibleHint
                onClose={() => {}}
                title={<span data-testid={nodeTitleId}>NodeTitle</span>}
                content={undefined}>
                <span data-testid={nodeContentId}>NodeContent</span>
            </DismissibleHint>
        );

        expect(screen.getByTestId(nodeTitleId)).toBeInTheDocument();
        // content is undefined -> children should render
        expect(screen.getByTestId(nodeContentId)).toBeInTheDocument();
    });

    it('falls back to children when content is not provided', () => {
        const child = 'Child content';
        render(
            <DismissibleHint onClose={() => {}}>
                <span>{child}</span>
            </DismissibleHint>
        );

        expect(screen.getByText(child)).toBeInTheDocument();
    });

    it('calls onClose when default close button is clicked', () => {
        const onClose = vi.fn();
        render(<DismissibleHint onClose={onClose} content="Closable" />);

        const btn = screen.getByRole('button', { name: /close/i });
        fireEvent.click(btn);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('respects custom closeAriaLabel', () => {
        const onClose = vi.fn();
        const closeAriaLabel = 'dismiss hint';
        render(
            <DismissibleHint onClose={onClose} content="Closable" closeAriaLabel={closeAriaLabel} />
        );

        expect(screen.getByRole('button', { name: closeAriaLabel })).toBeInTheDocument();
    });

    it('renders CloseAdornment instead of default close button', () => {
        const onClose = vi.fn();
        const customCloseAria = 'Custom Close';
        render(
            <DismissibleHint
                onClose={onClose}
                content="With Custom Close"
                CloseAdornment={<button aria-label={customCloseAria}>X</button>}
            />
        );

        // Default IconButton should NOT exist
        expect(screen.queryByRole('button', { name: `close` })).not.toBeInTheDocument();
        // Custom close control is rendered
        expect(screen.getByRole('button', { name: customCloseAria })).toBeInTheDocument();
    });

    it('forwards StackProps (role, data-testid, etc.) to the outer Stack', () => {
        const role = 'note';
        const testId = 'hint-root';
        const content = 'Props test';
        render(
            <DismissibleHint
                onClose={() => {}}
                content={content}
                role={role}
                data-testid={testId}
            />
        );

        const root = screen.getByTestId(testId);
        expect(root).toHaveAttribute('role', role);
        expect(screen.getByText(content)).toBeInTheDocument();
    });
});
