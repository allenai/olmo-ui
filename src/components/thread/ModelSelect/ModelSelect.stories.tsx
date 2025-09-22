import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { fakeModelsResponse } from '@/mocks/handlers/modelHandlers';

import { ModelSelect } from './ModelSelect';

const meta = {
    component: ModelSelect,
    args: {
        models: fakeModelsResponse,
        onModelChange: fn(),
    },
} satisfies Meta<typeof ModelSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
