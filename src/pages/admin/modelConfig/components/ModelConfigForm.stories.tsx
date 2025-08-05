import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { withRouter } from 'storybook-addon-remix-react-router';

import { withReactHookForm } from '@/utils/storybook/withReactHookForm';

import { ModelConfigForm } from './ModelConfigForm';

const meta = {
    component: ModelConfigForm,
    decorators: [
        withRouter, // The form has Links in it, which end up using useNavigate
        withReactHookForm,
    ],
} satisfies Meta<typeof ModelConfigForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { onSubmit: fn() } };
