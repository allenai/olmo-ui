import { getTheme } from '@allenai/varnish2/theme';
import { ThemeProvider } from '@mui/material/styles';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormProvider, useForm } from 'react-hook-form';

import { uiRefreshOlmoTheme } from '../../../olmoTheme';
import { ExpandableTextArea } from './ExpandableTextArea';

const theme = getTheme(uiRefreshOlmoTheme);

const meta: Meta<typeof ExpandableTextArea> = {
    component: ExpandableTextArea,
    title: 'Components/ExpandableTextArea',
    decorators: [
        (Story) => {
            const formContext = useForm({
                defaultValues: {
                    exampleName: 'This is an example of starting text in the text area.',
                },
            });

            return (
                <ThemeProvider theme={theme}>
                    <FormProvider {...formContext}>
                        <form>
                            <Story />
                        </form>
                    </FormProvider>
                </ThemeProvider>
            );
        },
    ],
};

export default meta;

type Story = StoryObj<typeof ExpandableTextArea>;

export const Primary: Story = {
    args: {
        label: 'Example Label',
        name: 'exampleName',
    },
};
