import type { SelectChangeEvent } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { useArgs } from 'storybook/preview-api';
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
    decorators: [
        (Story, ctx) => {
            // Adapted from https://sandroroth.com/blog/storybook-controlled-components/#controlled-story
            const [_args, setArgs] = useArgs<typeof ctx.args>();

            const onModelChange = (event: SelectChangeEvent, child: ReactNode) => {
                ctx.args.onModelChange?.(event, child);

                if (ctx.args.selectedModelId !== undefined) {
                    setArgs({ selectedModelId: event.target.value });
                }
            };

            return <Story args={{ ...ctx.args, onModelChange }} />;
        },
    ],
} satisfies Meta<typeof ModelSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
