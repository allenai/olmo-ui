import type { Meta, StoryObj } from '@storybook/react';

import { threadOptions } from '@/api/playgroundApi/thread';
import { withMockQueryContext } from '@/utils/storybook/withMockQueryContext';
import { withMockThreadView } from '@/utils/storybook/withMockThreadView';
import { withMockReactQuery } from '@/utils/storybook/withReactQuery';
import { createMockMessage, createMockThread } from '@/utils/test/createMockModel';

import { ThreadDisplay } from './ThreadDisplay';

const mockThread = createMockThread({
    id: 'chat-message-thread',
    messages: [
        createMockMessage({
            id: 'thread',
            role: 'system',
            content: 'System message',
        }),
        createMockMessage({
            id: 'thread-user',
            role: 'user',
            content: 'User message',
        }),
        createMockMessage({
            id: 'thread-assistant',
            role: 'assistant',
            content: 'Assistant message',
        }),
    ],
});

const meta = {
    component: ThreadDisplay,
    decorators: [withMockQueryContext, withMockThreadView, withMockReactQuery],
    parameters: {
        mockData: [{ queryKey: threadOptions(mockThread.id).queryKey, data: mockThread }],
        threadView: { threadId: 'chat-message-thread' },
    },
} satisfies Meta<typeof ThreadDisplay>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        childMessageIds: mockThread.messages
            .filter((message) => message.role !== 'system')
            .map((message) => message.id),
        shouldShowAttributionHighlightDescription: false,
        streamingMessageId: null,
        isUpdatingMessageContent: false,
    },
};
