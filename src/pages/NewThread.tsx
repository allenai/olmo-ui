import {
    Button,
    ButtonGroup,
    ButtonProps,
    Card,
    CardContent,
    IconButton,
    Stack,
    Typography,
    alpha,
} from '@mui/material';

import { FormContainer, TextFieldElement } from 'react-hook-form-mui';

import PlusIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import GearIcon from '@mui/icons-material/Settings';

import { DesktopLayoutBreakpoint } from '../constants';

interface ResponsiveButtonProps extends Omit<ButtonProps, 'sx' | 'children'> {
    title: string;
}

const ResponsiveButton = ({ title, startIcon, ...props }: Omit<ButtonProps, 'sx'>): JSX.Element => {
    return (
        <>
            <Button
                {...props}
                startIcon={startIcon}
                sx={{
                    display: { xs: 'none', [DesktopLayoutBreakpoint]: 'inline-flex' },
                }}>
                {title}
            </Button>
            <Button
                {...props}
                aria-label={title}
                sx={{ display: { xs: 'inline-flex', [DesktopLayoutBreakpoint]: 'none' } }}>
                {startIcon}
            </Button>
        </>
    );
};

export const NewThreadPage = () => {
    return (
        <Stack gap={4} sx={{ containerName: 'thread-page', containerType: 'inline-size' }}>
            <Card
                variant="outlined"
                component={Stack}
                direction="row"
                gap={2}
                padding={2}
                sx={(theme) => ({
                    borderColor: alpha(theme.palette.primary.main, 0.5),

                    // display: 'none',
                    [`@container (min-width: ${theme.breakpoints.values.md}px)`]: {
                        display: 'inline-flex',
                    },
                })}>
                <Typography
                    variant="h5"
                    component="h2"
                    margin={0}
                    marginInlineEnd="auto"
                    color={(theme) => theme.palette.primary.main}>
                    Thread
                </Typography>
                <Button variant="outlined" startIcon={<PlusIcon />}>
                    New Thread
                </Button>
                <Button variant="outlined" startIcon={<GearIcon />}>
                    Parameters
                </Button>
                <Button variant="outlined" startIcon={<HistoryIcon />}>
                    History
                </Button>
            </Card>

            {/* <ButtonGroup variant="outlined">
                <ResponsiveButton startIcon={<PlusIcon />}>New Thread</ResponsiveButton>
                <ResponsiveButton startIcon={<GearIcon />}>Parameters</ResponsiveButton>
                <ResponsiveButton startIcon={<HistoryIcon />}>History</ResponsiveButton>
            </ButtonGroup> */}

            <Card raised elevation={1}>
                <CardContent>
                    <FormContainer>
                        <Stack gap={1} alignItems="flex-start">
                            <TextFieldElement
                                name="content"
                                label="Prompt"
                                placeholder="Enter your prompt here"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                fullWidth
                                multiline
                            />
                            <Button type="submit" variant="contained">
                                Submit
                            </Button>
                        </Stack>
                    </FormContainer>
                </CardContent>
            </Card>
        </Stack>
    );
};
