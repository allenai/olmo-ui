import CloseIcon from '@mui/icons-material/Close';
import {
    Box,
    Card,
    CardContent,
    Divider,
    IconButton,
    ListSubheader,
    Stack,
    Typography,
} from '@mui/material';
import { KeyboardEventHandler } from 'react';

import { useAppContext } from '@/AppContext';
import { RemoteState } from '@/contexts/util';
import { documentsForMessageSelector } from '@/slices/AttributionSlice';
import { useCloseDrawerOnNavigation } from '@/utils/useClosingDrawerOnNavigation-utils';

import { ResponsiveDrawer } from '../../ResponsiveDrawer';
import {
    AttributionDocumentCard,
    AttributionDocumentCardSkeleton,
} from './AttributionDocumentCard';

const NoDocumentsCard = (): JSX.Element => {
    const isThereASelectedThread = useAppContext((state) => Boolean(state.selectedThreadRootId));

    const message = isThereASelectedThread ? (
        <>
            There are no documents that can be attributed to this response. This will happen often
            on short responses.
        </>
    ) : (
        <>Start a new thread or select an existing one to see response attributions.</>
    );

    return (
        <Card>
            <CardContent>{message}</CardContent>
        </Card>
    );
};

export const AttributionDrawerDocumentList = (): JSX.Element => {
    const documents = useAppContext(documentsForMessageSelector);
    const attributionDocumentLoadingState = useAppContext(
        (state) => state.attribution.loadingState
    );

    if (
        Object.values(documents).length === 0 &&
        attributionDocumentLoadingState === RemoteState.Loading
    ) {
        return (
            <>
                <AttributionDocumentCardSkeleton />
                <AttributionDocumentCardSkeleton />
                <AttributionDocumentCardSkeleton />
                <AttributionDocumentCardSkeleton />
                <AttributionDocumentCardSkeleton />
            </>
        );
    }

    if (
        Object.values(documents).length === 0 &&
        attributionDocumentLoadingState === RemoteState.Error
    ) {
        return (
            <Card>
                <CardContent>
                    Something went wrong when getting documents that can be attributed to this
                    response. Please try another response.
                </CardContent>
            </Card>
        );
    }

    if (Object.values(documents).length === 0) {
        return <NoDocumentsCard />;
    }

    return (
        <>
            {Object.values(documents).map((document) => (
                <AttributionDocumentCard
                    key={document.index}
                    documentIndex={document.index}
                    title={document.title}
                    text={document.text}
                    source={document.source}
                />
            ))}
        </>
    );
};

export const ATTRIBUTION_DRAWER_ID = 'attribution';

export const AttributionDrawer = () => {
    const closeDrawer = useAppContext((state) => state.closeDrawer);
    const isDrawerOpen = useAppContext(
        (state) => state.currentOpenDrawer === ATTRIBUTION_DRAWER_ID
    );

    const handleDrawerClose = () => {
        closeDrawer(ATTRIBUTION_DRAWER_ID);
    };

    useCloseDrawerOnNavigation({
        handleDrawerClose,
    });

    const onKeyDownEscapeHandler: KeyboardEventHandler = (
        event: React.KeyboardEvent<HTMLDivElement>
    ) => {
        if (event.key === 'Escape') {
            handleDrawerClose();
        }
    };

    return (
        <ResponsiveDrawer
            open={isDrawerOpen}
            onClose={handleDrawerClose}
            onKeyDownHandler={onKeyDownEscapeHandler}
            anchor="right"
            desktopDrawerVariant="persistent"
            desktopDrawerSx={{ gridArea: 'side-drawer' }}
            heading={
                <Box
                    sx={{
                        position: 'sticky',
                        top: 0,
                        backgroundColor: 'inherit',
                        zIndex: 1,
                    }}>
                    <Stack
                        justifyContent="space-between"
                        direction="row"
                        gap={2}
                        alignItems="center">
                        <ListSubheader sx={{ paddingBlock: 2, backgroundColor: 'transparent' }}>
                            <Typography variant="h5" margin={0} color="primary">
                                Attribution
                            </Typography>
                        </ListSubheader>
                        <IconButton
                            onClick={handleDrawerClose}
                            sx={{ color: 'inherit' }}
                            aria-label="close drawer">
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                    <Divider />
                </Box>
            }>
            <Stack marginInline={2} direction="column" gap={2} paddingBlock={2}>
                <Typography>
                    Select a document from this list to highlight which parts of the model’s
                    response have an exact text match in the training data
                </Typography>
                <AttributionDrawerDocumentList />
            </Stack>
        </ResponsiveDrawer>
    );
};
