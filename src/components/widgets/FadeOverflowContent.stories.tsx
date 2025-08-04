import { Meta, StoryObj } from '@storybook/react';

import { FadeOverflowContent } from './FadeOverflowContent';

const lipsum = `
    lipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
    ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
    sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
    est laborum.
    lipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
    ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
    sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
    est laborum.
`;

const meta: Meta<typeof FadeOverflowContent> = {
    title: 'Widgets/FadeOverflowContent',
    component: FadeOverflowContent,
    args: {
        children: lipsum,
    },
};

export default meta;

type Story = StoryObj<typeof FadeOverflowContent>;

export const Default: Story = {
    args: {},
};

export const SizeConstrained: Story = {
    args: {
        // children: lipsum,
        style: {
            height: '100px',
        },
    },
};
