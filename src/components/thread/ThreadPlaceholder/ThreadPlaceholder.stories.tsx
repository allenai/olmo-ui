import type { Meta, StoryObj } from '@storybook/react-vite';

import { withMockQueryContext } from '@/utils/storybook/withMockQueryContext';
import { withMockReactQuery } from '@/utils/storybook/withReactQuery';
import { createMockModel } from '@/utils/test/createMockModel';

import { getPromptTemplatesQueryOptions } from '../promptTemplates/usePromptTemplates';
import { ThreadPlaceholder } from './ThreadPlaceholder';

const toolModel = createMockModel('with-tools', {
    canCallTools: true,
});

const nonToolModel = createMockModel('without-tools', {
    canCallTools: false,
});

const toolCallModelContext = {
    canCallTools: true,
    isToolCallingEnabled: true,
    getThreadViewModel: () => toolModel,
};

const noToolCallModelContext = {
    canCallTools: false,
    getThreadViewModel: () => nonToolModel,
};

const promptTemplatesMockData = {
    queryKey: getPromptTemplatesQueryOptions.queryKey,
    data: [],
};

const meta = {
    title: 'organism/ThreadPlaceholder',
    component: ThreadPlaceholder,
} satisfies Meta<typeof ThreadPlaceholder>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PlaceholderWithTools: Story = {
    decorators: [withMockQueryContext, withMockReactQuery],
    parameters: {
        queryContext: toolCallModelContext,
        mockData: [promptTemplatesMockData],
    },
};

export const PlaceholderWithoutTools: Story = {
    decorators: [withMockQueryContext, withMockReactQuery],
    parameters: {
        queryContext: noToolCallModelContext,
        mockData: [promptTemplatesMockData],
    },
};
