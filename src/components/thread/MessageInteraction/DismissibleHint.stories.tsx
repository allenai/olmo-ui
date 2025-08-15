import { cva } from '@allenai/varnish-panda-runtime/css';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Typography } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';

import { DismissibleHint } from './DismissibleHint';

const container = cva({
    base: {
        border: '[1px solid {colors.background.reversed}]',
        margin: '2',
        padding: '4',
    },
    variants: {
        size: {
            desktop: { width: '[750px]' },
            mobile: { width: '[400px]' },
        },
    },
});

const meta: Meta<typeof DismissibleHint> = {
    title: 'Components/DismissibleHint',
    component: DismissibleHint,
};

export default meta;

type Story = StoryObj<typeof DismissibleHint>;

export const Default: Story = {
    render: () => (
        <DismissibleHint
            onClose={() => {}}
            title="Info"
            content="This action cannot be undone."
            role="status"
            aria-live="polite"
        />
    ),
    decorators: [
        (Story) => (
            <div className={container({ size: 'desktop' })}>
                <Story />
            </div>
        ),
    ],
};

export const WithChildren: Story = {
    render: () => (
        <DismissibleHint onClose={() => {}} title="Heads up">
            <Typography variant="body2">
                You can pass arbitrary <strong>children</strong> when <code>content</code> is not
                provided.
            </Typography>
        </DismissibleHint>
    ),
    decorators: [
        (Story) => (
            <div className={container({ size: 'desktop' })}>
                <Story />
            </div>
        ),
    ],
};

export const NoTitle: Story = {
    render: () => (
        <DismissibleHint
            onClose={() => {}}
            content="No title provided. Keeps spacing tight and readable."
        />
    ),
    decorators: [
        (Story) => (
            <div className={container({ size: 'desktop' })}>
                <Story />
            </div>
        ),
    ],
};

export const CustomCloseAdornment: Story = {
    render: () => (
        <DismissibleHint
            onClose={() => {}}
            title="Custom close"
            content="Using a custom close control via CloseAdornment."
            CloseAdornment={
                <IconButton
                    aria-label="dismiss hint"
                    onClick={() => {}}
                    size="small"
                    sx={{ position: 'absolute', right: 0, top: 0, p: 0.75 }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            }
        />
    ),
    decorators: [
        (Story) => (
            <div className={container({ size: 'desktop' })}>
                <Story />
            </div>
        ),
    ],
};

export const LongWrappingContent: Story = {
    render: () => (
        <DismissibleHint
            onClose={() => {}}
            title="Long message"
            content={
                'This is a very long message intended to verify line wrapping, truncation behavior, and responsive layout. ' +
                'It should wrap naturally within the available space without overflowing or causing layout shift.'
            }
        />
    ),
    decorators: [
        (Story) => (
            <div className={container({ size: 'desktop' })}>
                <Story />
            </div>
        ),
    ],
};

export const Mobile: Story = {
    render: () => (
        <DismissibleHint
            onClose={() => {}}
            title="Mobile"
            content="Compact width to check wrapping and close button positioning."
        />
    ),
    decorators: [
        (Story) => (
            <div className={container({ size: 'mobile' })}>
                <Story />
            </div>
        ),
    ],
};
