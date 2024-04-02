import { ButtonGroup, Card, Stack, Typography, alpha } from '@mui/material';

import PlusIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import GearIcon from '@mui/icons-material/SettingsOutlined';

import { ResponsiveButton } from './ResponsiveButton';
import { smallerContainerQuery, biggerContainerQuery } from '@/utils/container-query-utils';

const ThreadButtons = (): JSX.Element => {
    return (
        <>
            <ResponsiveButton
                startIcon={<PlusIcon />}
                title="New Thread"
                smallerVariant="outlined"
                biggerVariant="contained"
            />
            <ResponsiveButton startIcon={<GearIcon />} title="Parameters" variant="outlined" />
            <ResponsiveButton startIcon={<HistoryIcon />} title="History" variant="outlined" />
        </>
    );
};

export const ThreadPageControls = (): JSX.Element => {
    return (
        <Card
            variant="outlined"
            component={Stack}
            direction="row"
            gap={2}
            sx={(theme) => ({
                borderColor: alpha(theme.palette.primary.main, 0.5),
                padding: 2,

                [smallerContainerQuery(theme)]: {
                    border: 0,
                    backgroundColor: 'transparent',
                    padding: 0,
                    borderRadius: 'unset',
                },
            })}>
            <Typography
                variant="h5"
                component="h2"
                margin={0}
                marginInlineEnd="auto"
                color={(theme) => theme.palette.primary.main}
                sx={(theme) => ({
                    [smallerContainerQuery(theme)]: {
                        display: 'none',
                    },
                })}>
                Thread
            </Typography>

            <Stack
                direction="row"
                gap={2}
                sx={(theme) => ({
                    [smallerContainerQuery(theme)]: {
                        display: 'none',
                    },
                })}>
                <ThreadButtons />
            </Stack>

            <ButtonGroup
                variant="outlined"
                sx={(theme) => ({
                    [biggerContainerQuery(theme)]: {
                        display: 'none',
                    },
                })}>
                <ThreadButtons />
            </ButtonGroup>
        </Card>
    );
};
