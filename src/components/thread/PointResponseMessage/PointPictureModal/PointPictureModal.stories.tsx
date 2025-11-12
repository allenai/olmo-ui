import type { Meta, StoryObj } from '@storybook/react-vite';

import { PointPictureModal } from './PointPictureModal';

const meta = {
    component: PointPictureModal,
} satisfies Meta<typeof PointPictureModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        open: true,
        closeModal: () => {},
        children: <div>Picture</div>,
    },
};
