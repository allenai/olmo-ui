import { ButtonGroup, Card, Stack, Typography, alpha } from '@mui/material';

import PlusIcon from '@mui/icons-material/Add';

import { biggerContainerQuery, smallerContainerQuery } from '@/utils/container-query-utils';
import { HistoryButton } from './history/HistoryButton';
import { ResponsiveButton } from './ResponsiveButton';
import { ParameterButton } from './parameter/ParameterButton';

const ThreadButtons = (): JSX.Element => {
    return (
        <>
            {/* Wide screens */}
            <Stack
                direction="row"
                gap={2}
                sx={(theme) => ({
                    [smallerContainerQuery(theme)]: {
                        display: 'none',
                    },
                })}>
                <ResponsiveButton
                    startIcon={<PlusIcon />}
                    title="New Thread"
                    smallerVariant="outlined"
                    biggerVariant="contained"
                />
                <ParameterButton />
                <HistoryButton />
            </Stack>

            {/* Small screens */}
            <ButtonGroup
                size="large"
                variant="outlined"
                sx={(theme) => ({
                    [biggerContainerQuery(theme)]: {
                        display: 'none',
                    },
                })}>
                <ResponsiveButton
                    startIcon={<PlusIcon />}
                    title="New Thread"
                    smallerVariant="outlined"
                    biggerVariant="contained"
                />
                <ParameterButton />
                <HistoryButton />
            </ButtonGroup>
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

            <ThreadButtons />
        </Card>
    );
};
