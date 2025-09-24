import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { clipToMinMax } from '@/utils/clipToMinMax';

import { SliderWithInput } from './SliderWithInput';

const meta = {
    title: 'components/SliderWithInput',
    component: SliderWithInput,
    args: {
        name: 'slider-with-input',
        label: 'Slider with input',
        minValue: 0,
        maxValue: 500,
        step: 1,
        value: 100,
        onChange: fn(),
    },
} satisfies Meta<typeof SliderWithInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithState: Story = {
    render: (args) => {
        const [value, setValue] = useState(50);
        return <SliderWithInput {...args} value={value} onChange={setValue} />;
    },
};

export const ControllingAnotherSlidersMaxValue: Story = {
    render: (args) => {
        const [value, setValue] = useState(500);
        const [maxValue, setMaxValue] = useState(1000);
        const [minValue, setMinValue] = useState(0);

        return (
            <div>
                <SliderWithInput
                    {...args}
                    value={value}
                    maxValue={maxValue}
                    minValue={minValue}
                    onChange={setValue}
                />
                <br />
                <SliderWithInput
                    name="max-value"
                    label="Max Value"
                    minValue={500}
                    maxValue={1000}
                    step={10}
                    value={maxValue}
                    onChange={(newMaxValue) => {
                        setMaxValue(newMaxValue);
                        setValue((prevValue) => clipToMinMax(prevValue, minValue, newMaxValue));
                    }}
                />
                <SliderWithInput
                    name="min-value"
                    label="Min Value"
                    minValue={0}
                    maxValue={500}
                    step={10}
                    value={minValue}
                    onChange={(newMinValue) => {
                        setMinValue(newMinValue);
                        setValue((prevValue) => clipToMinMax(prevValue, newMinValue, maxValue));
                    }}
                />
            </div>
        );
    },
};
