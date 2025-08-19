import { Meta, StoryObj } from '@storybook/react';
import { useDragAndDrop } from 'react-aria-components';
import { useListData } from 'react-stately';
import { withRouter } from 'storybook-addon-remix-react-router';

import { SchemaResponseModel } from '@/api/playgroundApi/playgroundApiSchema';

import { ModelConfigurationList } from './ModelConfigurationList';
import { ModelConfigurationListItem } from './ModelConfigurationListItem';

const mockModels: SchemaResponseModel[] = [
    {
        availability: 'internal',
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
        canCallTools: false,
        canThink: false,
    },
    {
        availability: 'internal',
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
        canCallTools: false,
        canThink: false,
    },
    {
        availability: 'public',
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
        canCallTools: false,
        canThink: false,
    },
];

const meta: Meta<typeof ModelConfigurationList> = {
    title: 'Components/ModelConfigurationList',
    component: ModelConfigurationList,
    subcomponents: { ModelConfigurationListItem },
    decorators: [withRouter],
    parameters: {
        reactRouter: {
            routePath: '/admin/models/:modelId',
            routeParams: { modelId: 'test-model-5' },
        },
    },
};

export default meta;

type Story = StoryObj<typeof ModelConfigurationList>;

export const Default: Story = {
    render: () => <ModelConfigurationList items={mockModels} />,
};

export const WithReordering: Story = {
    render: () => {
        const list = useListData({
            initialItems: mockModels,
            getKey: (item) => item.id,
        });

        const { dragAndDropHooks } = useDragAndDrop({
            getItems: (keys) =>
                [...keys].map((key) => {
                    // Something's gone terribly wrong if the list doesn't have an item with its key
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    return { 'text/plain': list.getItem(key)!.name };
                }),
            onReorder(e) {
                if (e.target.dropPosition === 'before') {
                    list.moveBefore(e.target.key, e.keys);
                } else if (e.target.dropPosition === 'after') {
                    list.moveAfter(e.target.key, e.keys);
                }
            },
        });

        return <ModelConfigurationList items={list.items} dragAndDropHooks={dragAndDropHooks} />;
    },
};
