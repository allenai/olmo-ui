import type { Meta, StoryObj } from '@storybook/react-vite';

import { threadOptions } from '@/api/playgroundApi/thread';
import { withMockQueryContext } from '@/utils/storybook/withMockQueryContext';
import { withMockThreadView } from '@/utils/storybook/withMockThreadView';
import { withMockReactQuery } from '@/utils/storybook/withReactQuery';
import { createMockMessage, createMockThread } from '@/utils/test/createMockModel';

import { PointResponseMessage } from './PointResponseMessage';

// This is just test data. points may not be accurate.
const mockThreadSingleImage = createMockThread({
    id: 'thread-single-image',
    messages: [
        createMockMessage({
            id: 'user-message-1',
            role: 'user',
            content: 'count the boats',
            fileUrls: [
                'https://storage.googleapis.com/ai2-playground-molmo/msg_S8V2L5A8K8/msg_S8V2L5A8K8-0.png',
            ],
        }),
        createMockMessage({
            id: 'assistant-message-molmo2-single-image-points',
            role: 'assistant',
            content:
                'Counting the <points coords="1 1 073 160 2 173 600 3 258 725 4 323 735 5 353 160" alt="boats">the boats</points> shows a total of 5.',
        }),
        createMockMessage({
            id: 'assistant-message-molmo1-points',
            role: 'assistant',
            content:
                'Counting the <points x1="9.1" y1="11.7" x2="17.2" y2="41.3" x3="19.6" y3="3.4" x4="26.8" y4="54.4" x5="30.8" y5="1.6" alt="the boats">the boats</points> shows a total of 5.',
        }),
        createMockMessage({
            id: 'assistant-message-molmo1-sets-of-points',
            role: 'assistant',
            content: `The image shows a marina with various types of boats. 
                <point x="63.3" y="85.8" alt="Small fishing boat">Small fishing boats</point> are visible, along with 
                <point x="76.8" y="61.8" alt="Sailboat with blue sail">sailboats</point> that have their sails down. There are also 
                <point x="78.2" y="36.0" alt="Motorboat">motorboats</point> docked in the slips. The boats appear to be primarily 
                <point x="53.3" y="27.6" alt="White boat">white</point> in color, with some featuring <point x="77.8" y="76.0" alt="Boat with blue canopy">blue canopies or sails</point>. 
                This variety of watercraft represents a typical scene at a busy marina.`,
        }),
    ],
});

const mockThreadMultiImage = createMockThread({
    id: 'thread-multi-image',
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
    decorators: [withMockQueryContext, withMockThreadView, withMockReactQuery],
    parameters: {
        mockData: [
            {
                queryKey: threadOptions(mockThreadSingleImage.id).queryKey,
                data: mockThreadSingleImage,
            },
        ],
        threadView: { threadId: mockThreadSingleImage.id },
    },
} satisfies Meta<typeof PointResponseMessage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        messageId: 'assistant-message-molmo1-points',
    },
};

export const Molmo1ImagePoints: Story = {
    args: {
        messageId: 'assistant-message-molmo1-sets-of-points',
    },
};

export const Molmo2SingleImagePoints: Story = {
    args: {
        messageId: 'assistant-message-molmo2-single-image-points',
    },
};

export const Molmo2MultiImagePoints: Story = {
    parameters: {
        mockData: [
            {
                queryKey: threadOptions(mockThreadMultiImage.id).queryKey,
                data: [mockThreadMultiImage],
            },
        ],
        threadView: { threadId: mockThreadMultiImage.id },
    },
    args: {
        messageId: 'assistant-message-molmo2-multi-image-points',
    },
};
