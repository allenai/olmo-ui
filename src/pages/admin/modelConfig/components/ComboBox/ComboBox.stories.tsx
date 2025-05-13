import { Meta, Story } from '@storybook/react';

import { ComboBox } from './ComboBox';

type Item = { id: string; name: string };

const meta: Meta<typeof ComboBox> = {
    title: 'Components/ComboBox',
    component: ComboBox,
};

export default meta;

const items: Item[] = [
    { id: '1', name: 'Aardvark' },
    { id: '2', name: 'Cat' },
    { id: '3', name: 'Dog' },
    { id: '4', name: 'Kangaroo' },
    { id: '5', name: 'Panda' },
    { id: '6', name: 'Snake' },
];

export const Default: Story<typeof ComboBox> = {
    args: {
        label: 'Select an animal',
        items,
        itemToKey: (item: Item) => item.id,
        itemToLabel: (item: Item) => item.name,
    },
};
