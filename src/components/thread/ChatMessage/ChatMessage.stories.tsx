import type { Meta, StoryObj } from '@storybook/react';

import { threadOptions } from '@/api/playgroundApi/thread';
import multiplePointerThreadResponse from '@/mocks/handlers/responses/v4/multiplePointerMessageResponse';
import { withMockQueryContext } from '@/utils/storybook/withMockQueryContext';
import { withMockThreadView } from '@/utils/storybook/withMockThreadView';
import { withMockReactQuery } from '@/utils/storybook/withReactQuery';
import { createMockMessage, createMockThread } from '@/utils/test/createMockModel';

import { ChatMessage } from './ChatMessage';

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
    title: 'organism/ChatMessage',
    component: ChatMessage,
    decorators: [withMockQueryContext, withMockThreadView, withMockReactQuery],
    parameters: {
        mockData: [{ queryKey: threadOptions(mockThread.id).queryKey, data: mockThread }],
        threadView: { threadId: 'chat-message-thread' },
    },
} satisfies Meta<typeof ChatMessage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const UserMessage: Story = {
    args: {
        messageId: 'thread-user',
        isLastMessageInThread: true,
    },
};

export const AssistantMessage: Story = {
    args: {
        messageId: 'thread-assistant',
        isLastMessageInThread: true,
    },
};

export const PointsMessage: Story = {
    args: {
        messageId: 'multiple-pointer-assistant',
        isLastMessageInThread: true,
    },
    parameters: {
        mockData: [
            {
                queryKey: threadOptions(multiplePointerThreadResponse.id).queryKey,
                data: multiplePointerThreadResponse,
            },
        ],
        threadView: {
            threadId: multiplePointerThreadResponse.id,
        },
    },
};
