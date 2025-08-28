import type { Meta, StoryObj } from '@storybook/react-vite';

import { threadOptions } from '@/api/playgroundApi/thread';
import { withMockQueryContext } from '@/utils/storybook/withMockQueryContext';
import { withMockThreadView } from '@/utils/storybook/withMockThreadView';
import { withMockReactQuery } from '@/utils/storybook/withReactQuery';
import { createMockMessage, createMockThread } from '@/utils/test/createMockModel';

import AllToolCalls from './AllToolCalls';

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
                    toolSource: 'internal',
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
                    toolSource: 'internal',
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
                    toolSource: 'internal',
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
                    toolSource: 'internal',
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
                    toolSource: 'internal',
                },
            ],
            content: 'j0n b0rch4rd7',
        }),
        // Intentionally skipping `tool-call-6`
        // leaving that as "pending"
        createMockMessage({
            id: 'tool-call-response-7',
            role: 'tool_call_result',
            toolCalls: [
                {
                    args: { city: 'Seattle' },
                    toolCallId: 'tool-call-7',
                    toolName: 'getWeather',
                    toolSource: 'user_defined',
                },
            ],
            content: 'rainy',
        }),
    ],
});

const meta = {
    component: AllToolCalls,
    decorators: [withMockReactQuery, withMockQueryContext, withMockThreadView],
    parameters: {
        mockData: [{ queryKey: threadOptions(mockThread.id).queryKey, data: mockThread }],
    },
} satisfies Meta<typeof AllToolCalls>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        threadId: 'thread',
        toolCalls: [
            {
                args: '{ "firstName": "Taylor", "lastName": "Blanton" }',
                toolCallId: 'tool-call-1',
                toolName: 'leetName',
                toolSource: 'internal',
            },
            {
                args: { firstName: 'Caleb', lastName: 'Ouellette' },
                toolCallId: 'tool-call-2',
                toolName: 'leetName',
                toolSource: 'internal',
            },
            {
                args: '{ "firstName": "Paul", "lastName": "Laskowski" }',
                toolCallId: 'tool-call-3',
                toolName: 'leetName',
                toolSource: 'internal',
            },
            {
                args: { firstName: 'Byron', lastName: 'Bischoff' },
                toolCallId: 'tool-call-4',
                toolName: 'leetName',
                toolSource: 'internal',
            },
            {
                args: { firstName: 'Jon', lastName: 'Borchardt' },
                toolCallId: 'tool-call-5',
                toolName: 'leetName',
                toolSource: 'internal',
            },
            {
                args: { city: 'Seattle' },
                toolCallId: 'tool-call-6',
                toolName: 'getWeather',
                toolSource: 'user_defined',
            },
            {
                args: { city: 'Seattle' },
                toolCallId: 'tool-call-7',
                toolName: 'getWeather',
                toolSource: 'user_defined',
            },
        ],
    },
};
