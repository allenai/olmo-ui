import { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import { FileSizeInput } from './FileSizeInput';

const meta: Meta<typeof FileSizeInput> = {
    title: 'Components/FileSizeInput',
    component: FileSizeInput,
    args: { onChange: fn(), name: 'test-file-size' },
};

export default meta;

type Story = StoryObj<typeof FileSizeInput>;

export const NoDefaultValue: Story = {};

export const FifteenKBytes: Story = {
    args: {
        value: 15360,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await expect(canvas.getByLabelText('File Size')).toHaveValue(15);
        await expect(canvas.getByLabelText('Unit')).toHaveTextContent('KiB');
    },
};

export const Default20MiB: Story = {
    args: {
        value: '20 MiB',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await expect(canvas.getByLabelText('File Size')).toHaveValue(20);
        await expect(canvas.getByLabelText('Unit')).toHaveTextContent('MiB');
    },
};

export const FillsIn15KiB: Story = {
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);

        await userEvent.type(canvas.getByLabelText('File Size'), '15');

        await waitFor(async () => {
            await expect(args.onChange).toHaveBeenCalledWith('15 KiB');
        });
    },
};
