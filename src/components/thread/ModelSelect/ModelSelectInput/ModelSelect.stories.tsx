import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { fakeModelsResponse } from '@/mocks/handlers/modelHandlers';

import { ModelSelect } from './ModelSelect';

const meta = {
    title: 'organism/Model Select',
    component: ModelSelect,
    args: {
        models: fakeModelsResponse,
        onModelChange: fn(),
        defaultOpen: true,
        selectedModelId: fakeModelsResponse[0].id,
    },
    parameters: {
        controls: {
            exclude: ['id', 'onModelChange', 'defaultOpen'],
        },
    },
} satisfies Meta<typeof ModelSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
