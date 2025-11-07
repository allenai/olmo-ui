import type { Meta, StoryObj } from '@storybook/react-vite';

import { threadOptions } from '@/api/playgroundApi/thread';
import { StandardMessage } from '@/components/thread/ChatMessage/ChatMessage';
import { withMockQueryContext } from '@/utils/storybook/withMockQueryContext';
import { withMockThreadView } from '@/utils/storybook/withMockThreadView';
import { withMockReactQuery } from '@/utils/storybook/withReactQuery';
import { createMockMessage, createMockThread } from '@/utils/test/createMockModel';

const mockThread = createMockThread({
    id: 'thread',
    messages: [
        createMockMessage({
            id: 'assistant-message-1',
            role: 'assistant',
            content: `
Here are the points in the image
<points alt="alt_text" coords="1 1 193 076 2 226 144\t2 3 411 150 4 422 061">label_text</points>
`,
        }),
        createMockMessage({
            id: 'assistant-message-2',
            role: 'assistant',
            content: `
Here are the points in the video
<points alt="alt_text" coords="0.0 1 193 076 2 226 144\t30.0 3 411 150 4 422 061">label_text</points>
`,
        }),
        createMockMessage({
            id: 'assistant-message-3',
            role: 'assistant',
            content: `
Here are the tracks in the video
<points alt="alt_text" tracks="0.0 1 193 076 2 226 144\t30.0 1 411 150 2 422 061">label_text</points>
`,
        }),
    ],
});

const meta = {
    title: 'thread/RenderPointsData',
    component: StandardMessage,
    decorators: [withMockReactQuery, withMockQueryContext, withMockThreadView],
    parameters: {
        mockData: [{ queryKey: threadOptions(mockThread.id).queryKey, data: mockThread }],
    },
} satisfies Meta<typeof StandardMessage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        messageId: 'assistant-message-1',
    },
};

export const VideoPointing: Story = {
    args: {
        messageId: 'assistant-message-2',
    },
};

export const VideoTracking: Story = {
    args: {
        messageId: 'assistant-message-3',
    },
};
