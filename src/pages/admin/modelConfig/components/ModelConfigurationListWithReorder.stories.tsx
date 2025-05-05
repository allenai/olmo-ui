import { Meta, StoryObj } from '@storybook/react';

import { SchemaResponseModel } from '@/api/playgroundApi/playgroundApiSchema';

import { ModelConfigurationList } from './ModelConfigurationList';
import { ModelConfigurationListItem } from './ModelConfigurationListItem';
import { ModelConfigurationListWithReorder } from './ModelConfigurationListWithReorder';

const mockModels: SchemaResponseModel[] = [
    {
        availableTime: null,
        createdTime: '2025-04-25T18:16:49.831683+00:00',
        defaultSystemPrompt: null,
        deprecationTime: null,
        description: 'A 405B parameter model that is a fine-tuned version of Llama 2.',
        familyId: 'tulu',
        familyName: 'Tülu',
        host: 'inferd',
        id: 'tulu3-405b',
        internal: true,
        modelIdOnHost: 'csc_01jjqp4s2x3hq6e05j3a0h3f96',
        modelType: 'chat',
        name: 'Llama Tülu 3 405B-test2',
        order: 10,
        promptType: 'text_only',
        updatedTime: '2025-04-25T20:16:09.543846+00:00',
    },
    {
        availableTime: null,
        createdTime: '2025-04-25T20:25:13.122286+00:00',
        defaultSystemPrompt: null,
        deprecationTime: null,
        description: 'foo',
        familyId: 'tulu',
        familyName: 'Tülu',
        host: 'inferd',
        id: 'test-model-5',
        internal: true,
        modelIdOnHost: 'csc_01jjqp4s2x3hq6e05j3a0h3f96',
        modelType: 'chat',
        name: 'Llama Tülu 3 405B-test22',
        order: 160,
        promptType: 'text_only',
        updatedTime: '2025-04-25T21:15:10.861378+00:00',
    },
    {
        availableTime: null,
        createdTime: '2025-04-25T21:26:41.187139+00:00',
        defaultSystemPrompt: null,
        deprecationTime: null,
        description: 'This model is made for testing',
        familyId: null,
        familyName: null,
        host: 'inferd',
        id: 'test-model-6',
        internal: true,
        modelIdOnHost: 'test-model-id',
        modelType: 'chat',
        name: 'model made for testing',
        order: 210,
        promptType: 'text_only',
        updatedTime: '2025-04-25T21:26:41.187139+00:00',
    },
];
const meta: Meta<typeof ModelConfigurationList> = {
    title: 'Components/ModelConfigurationListWithReorder',
    component: ModelConfigurationListWithReorder,
    subcomponents: { ModelConfigurationListItem },
};

export default meta;

type Story = StoryObj<typeof ModelConfigurationListWithReorder>;

export const Default: Story = {
    render: () => <ModelConfigurationListWithReorder items={mockModels} />,
};
