import { cva } from '@allenai/varnish-panda-runtime/css';
import { Meta, StoryObj } from '@storybook/react';

import { ScrollToBottomButton } from './ScrollToBottomButton';

const container = cva({
    base: {
        border: '[1px solid {colors.background.reversed}]',
        margin: '2',
        padding: '4',
    },
    variants: {
        size: {
            desktop: {
                width: '[750px]',
            },
            mobile: {
                width: '[400px]',
            },
        },
    },
});

const meta: Meta<typeof ScrollToBottomButton> = {
    title: 'Components/ScrollToBottomButton',
    component: ScrollToBottomButton,
};

export default meta;

type Story = StoryObj<typeof ScrollToBottomButton>;

export const Default: Story = {
    render: () => <ScrollToBottomButton isVisible={true} onScrollToBottom={() => {}} />,
    decorators: [
        (Story) => (
            <div className={container({ size: 'desktop' })}>
                <Story />
            </div>
        ),
    ],
};

export const Mobile: Story = {
    render: () => <ScrollToBottomButton isVisible={true} onScrollToBottom={() => {}} />,
    decorators: [
        (Story) => (
            <div className={container({ size: 'mobile' })}>
                <Story />
            </div>
        ),
    ],
};
