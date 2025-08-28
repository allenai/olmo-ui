import type { Meta, StoryObj } from '@storybook/react-vite';

import { ParameterSlider } from './ParameterSlider';

const meta = {
    title: 'molecule/ParameterSlider',
    component: ParameterSlider,
} satisfies Meta<typeof ParameterSlider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        label: 'Slider',
        dialogContent: 'In the dialog',
        dialogTitle: 'Dialog title',
        id: 'slider',
    },
};
