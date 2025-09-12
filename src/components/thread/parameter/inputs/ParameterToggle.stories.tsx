import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor } from 'storybook/test';

import { ParameterToggle } from './ParameterToggle';

const meta = {
    title: 'parameters/ParameterToggle',
    component: ParameterToggle,
    args: {
        label: 'Toggle',
        value: true,
        dialogContent: 'In the dialog',
        dialogTitle: 'Dialog title',
        disableEditButton: false,
        disableToggle: false,
        id: 'toggle',
        onToggleChange: fn(),
        onEditClick: fn(),
    },
    decorators: [
        // The parameters drawer has a special grid setup. Make sure we stay up to date with it if we change it.
        (Story) => (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto' }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof ParameterToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    play: async ({ canvas, userEvent, args }) => {
        const checkboxInput = canvas.getByLabelText('Toggle', {
            selector: 'input[type="checkbox"]',
        });

        await userEvent.click(checkboxInput);
        await waitFor(() => expect(args.onToggleChange).toHaveBeenCalled(), {
            // The value is debounced to 800ms in this component
            timeout: 900,
        });
    },
};
