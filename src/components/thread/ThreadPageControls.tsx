import PlusIcon from '@mui/icons-material/Add';
import { ButtonGroup, Card, Stack } from '@mui/material';
import { useMatch } from 'react-router-dom';

import { useAppContext } from '@/AppContext';
import { links } from '@/Links';
import { biggerContainerQuery, smallerContainerQuery } from '@/utils/container-query-utils';

import { useDesktopOrUp } from '../dolma/shared';
import { AttributionButton } from './attribution/AttributionButton';
import { DeleteThreadButton } from './DeleteThreadButton';
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
    const selectedThreadRootId = useAppContext((state) => state.selectedThreadRootId);
    const isNotDesktop = !useDesktopOrUp();

    if (!selectedThreadRootId) {
        return <></>;
    }

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
                {isNotDesktop && <ParameterButton />}
                {isNotDesktop && <AttributionButton />}
            </ButtonGroup>
        </>
    );
};

export const ThreadPageControls = (): JSX.Element => {
    return (
        <Card
            component={Stack}
            direction="row"
            gap={2}
            sx={(theme) => ({
                padding: 2,
                backgroundColor: 'transparent',
                [smallerContainerQuery(theme)]: {
                    border: 0,
                    backgroundColor: 'transparent',
                    padding: 0,
                    borderRadius: 'unset',
                },
            })}>
            <ThreadButtonGroup />
        </Card>
    );
};
