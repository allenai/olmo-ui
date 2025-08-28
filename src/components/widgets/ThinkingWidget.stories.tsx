import { Meta, StoryObj } from '@storybook/react-vite';

import { ThinkingWidget } from './ThinkingWidget';

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

const meta: Meta<typeof ThinkingWidget> = {
    title: 'Widgets/Thinking Widget',
    component: ThinkingWidget,
    args: {
        defaultExpanded: true,
        children: lipsum,
    },
};

export default meta;

type Story = StoryObj<typeof ThinkingWidget>;

export const Default: Story = {
    args: {},
};

export const ThinkingConstrainedHeight: Story = {
    args: {
        style: { maxHeight: '300px' },
    },
};
