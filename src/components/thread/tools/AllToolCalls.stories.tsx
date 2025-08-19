import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { threadOptions } from '@/api/playgroundApi/thread';
import { createMockMessage, createMockThread } from '@/utils/test/createMockModel';

import AllToolCalls from './AllToolCalls';

const meta = {
    component: AllToolCalls,
} satisfies Meta<typeof AllToolCalls>;

export default meta;

type Story = StoryObj<typeof meta>;

const storyQueryClient = new QueryClient({
    defaultOptions: { queries: { enabled: false } },
});

export const Default: Story = {
    args: {
        threadId: 'thread',
        toolCalls: [
            {
                args: '{ "firstName": "Taylor", "lastName": "Blanton" }',
                toolCallId: 'tool-call-1',
                toolName: 'leetName',
            },
            {
                args: { firstName: 'Caleb', lastName: 'Ouellette' },
                toolCallId: 'tool-call-2',
                toolName: 'leetName',
            },
            {
                args: '{ "firstName": "Paul", "lastName": "Laskowski" }',
                toolCallId: 'tool-call-3',
                toolName: 'leetName',
            },
            {
                args: { firstName: 'Byron', lastName: 'Bischoff' },
                toolCallId: 'tool-call-4',
                toolName: 'leetName',
            },
            {
                args: { firstName: 'Jon', lastName: 'Borchardt' },
                toolCallId: 'tool-call-5',
                toolName: 'leetName',
            },
        ],
    },
    decorators: [
        (Story) => {
            const mockThread = createMockThread({
                id: 'thread',
                messages: [
                    createMockMessage({
                        id: 'tool-call-response-1',
                        role: 'tool_call_result',
                        content: '74yl0r bl4n70n',
                        toolCalls: [
                            {
                                toolCallId: 'tool-call-1',
                                args: { firstName: 'Taylor', lastName: 'Blanton' },
                                toolName: 'leetName',
                            },
                        ],
                    }),
                    createMockMessage({
                        id: 'tool-call-response-2',
                        role: 'tool_call_result',

                        toolCalls: [
                            {
                                args: { firstName: 'Caleb', lastName: 'Ouellette' },
                                toolCallId: 'tool-call-2',
                                toolName: 'leetName',
                            },
                        ],
                        content: 'c4l3b 0u3ll3773',
                    }),
                    createMockMessage({
                        id: 'tool-call-response-3',
                        role: 'tool_call_result',

                        toolCalls: [
                            {
                                args: '{ "firstName": "Paul", "lastName": "Laskowski" }',
                                toolCallId: 'tool-call-3',
                                toolName: 'leetName',
                            },
                        ],
                        content: 'p4ul l4sk0wski',
                    }),
                    createMockMessage({
                        id: 'tool-call-response-4',
                        role: 'tool_call_result',
                        toolCalls: [
                            {
                                args: { firstName: 'Byron', lastName: 'Bischoff' },
                                toolCallId: 'tool-call-4',
                                toolName: 'leetName',
                            },
                        ],
                        content: 'byr0n bisch0ff',
                    }),
                    createMockMessage({
                        id: 'tool-call-response-5',
                        role: 'tool_call_result',
                        toolCalls: [
                            {
                                args: { firstName: 'Jon', lastName: 'Borchardt' },
                                toolCallId: 'tool-call-5',
                                toolName: 'leetName',
                            },
                        ],
                        content: 'j0n b0rch4rd7',
                    }),
                ],
            });

            storyQueryClient.setQueryData(threadOptions(mockThread.id).queryKey, mockThread);

            return (
                <QueryClientProvider client={storyQueryClient}>
                    <Story />
                </QueryClientProvider>
            );
        },
    ],
};
