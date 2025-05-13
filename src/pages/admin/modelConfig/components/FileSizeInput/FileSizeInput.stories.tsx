import { Meta, StoryObj } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';

import { FileSizeInput } from './FileSizeInput';

const meta: Meta<typeof FileSizeInput> = {
    title: 'Components/FileSizeInput',
    component: FileSizeInput,
};

export default meta;

type Story = StoryObj<typeof FileSizeInput>;

export const Default: Story = {
    render: () => {
        const methods = useForm({
            defaultValues: {
                fileSize: { amount: 512, unit: 'kib' },
            },
        });

        return (
            <FormProvider {...methods}>
                <form>
                    <FileSizeInput />
                </form>
            </FormProvider>
        );
    },
};
