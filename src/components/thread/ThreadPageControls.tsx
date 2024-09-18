import PlusIcon from '@mui/icons-material/Add';
import { alpha, ButtonGroup, Card, Stack, Typography } from '@mui/material';
import { useMatch } from 'react-router-dom';

import { useAppContext } from '@/AppContext';
import { useFeatureToggles } from '@/FeatureToggleContext';
import { links } from '@/Links';
import { biggerContainerQuery, smallerContainerQuery } from '@/utils/container-query-utils';

import { AttributionButton } from './attribution/AttributionButton';
import { DeleteThreadButton } from './DeleteThreadButton';
import { HistoryButton } from './history/HistoryButton';
import { ParameterButton } from './parameter/ParameterButton';
import { ResponsiveButton } from './ResponsiveButton';
import { ShareThreadButton } from './ShareThreadButton';

const NewThreadButton = () => {
    const playgroundRoute = useMatch({
        path: links.playground,
    });

    return (
        <ResponsiveButton
            startIcon={<PlusIcon />}
            title="New Thread"
            smallerVariant="outlined"
            biggerVariant="outlined"
            href={links.playground}
            disabled={playgroundRoute?.pathname === links.playground}
        />
    );
};

const ThreadButtonGroup = (): JSX.Element => {
    const featureToggles = useFeatureToggles();
    const selectedThreadRootId = useAppContext((state) => state.selectedThreadRootId);

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
                <NewThreadButton />
                <DeleteThreadButton />
                <ShareThreadButton />
                {!selectedThreadRootId && <ParameterButton />}
                {!selectedThreadRootId && <HistoryButton />}
                {featureToggles.attribution && !selectedThreadRootId && <AttributionButton />}
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
                <NewThreadButton />
                <DeleteThreadButton />
                <ShareThreadButton />
                {!selectedThreadRootId && <ParameterButton />}
                {!selectedThreadRootId && <HistoryButton />}
                {featureToggles.attribution && !selectedThreadRootId && <AttributionButton />}
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

            <ThreadButtonGroup />
        </Card>
    );
};
