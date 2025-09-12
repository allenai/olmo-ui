import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor } from 'storybook/test';

import { ParameterSlider } from './ParameterSlider';

const meta = {
    title: 'parameters/ParameterSlider',
    component: ParameterSlider,
    args: {
        label: 'Slider',
        dialogContent: 'In the dialog',
        dialogTitle: 'Dialog title',
        id: 'slider',
        onChange: fn(),
    },
    decorators: [
        // The parameters drawer has a special grid setup. Make sure we stay up to date with it if we change it.
        (Story) => (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto' }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof ParameterSlider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    play: async ({ canvas, userEvent, args }) => {
        const numberInput = canvas.getByLabelText('Slider', {
            selector: 'input[type="number"]',
        });

        await userEvent.type(numberInput, '42');
        await waitFor(() => expect(args.onChange).toHaveBeenCalled(), {
            // The value is debounced to 800ms in this component
            timeout: 900,
        });
    },
};
