import type { Meta, StoryObj } from '@storybook/react-vite';

import { threadOptions } from '@/api/playgroundApi/thread';
import { withMockQueryContext } from '@/utils/storybook/withMockQueryContext';
import { withMockThreadView } from '@/utils/storybook/withMockThreadView';
import { withMockReactQuery } from '@/utils/storybook/withReactQuery';
import { createMockMessage, createMockThread } from '@/utils/test/createMockModel';

import { PointResponseMessage } from './PointResponseMessage';

// This is just test data. points may not be accurate.
const mockThreadMultiImage = createMockThread({
    id: 'thread',
    messages: [
        createMockMessage({
            id: 'user-message-1',
            role: 'user',
            content: 'count the boats',
            fileUrls: [
                'https://storage.googleapis.com/ai2-playground-molmo/msg_S8V2L5A8K8/msg_S8V2L5A8K8-0.png',
                'https://storage.googleapis.com/ai2-playground-molmo/msg_N7M6E9E3D5/msg_N7M6E9E3D5-0.png',
            ],
        }),
        createMockMessage({
            id: 'assistant-message-molmo2-multi-image-points',
            role: 'assistant',
            content: `Counting the <points coords="1 1 073 160 2 173 600 3 258 725 4 323 735 5 353 160\t2 6 373 460 7 433 155 8 443 455 9 503 695 10 513 445" alt="boats">the boats</points> shows a total of 10.`,
        }),
    ],
});

const meta = {
    component: PointResponseMessage,
    decorators: [withMockReactQuery, withMockQueryContext, withMockThreadView],
    parameters: {
        mockData: [
            {
                queryKey: threadOptions(mockThreadMultiImage.id).queryKey,
                data: mockThreadMultiImage,
            },
        ],
    },
} satisfies Meta<typeof PointResponseMessage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        messageId: 'assistant-message-molmo2-multi-image-points',
    },
};
