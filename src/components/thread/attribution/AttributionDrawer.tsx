import { Stack, Typography } from '@mui/material';
import { KeyboardEventHandler } from 'react';

import { useAppContext } from '@/AppContext';
import { useCloseDrawerOnNavigation } from '@/utils/useClosingDrawerOnNavigation-utils';

import { ResponsiveDrawer } from '../../ResponsiveDrawer';
import { AttributionDocumentCard } from './AttributionDocumentCard';

export const AttributionDrawerDocumentList = (): JSX.Element => {
    const documents = useAppContext((state) => state.attribution.documents);

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
                <Stack
                    sx={{ backgroundColor: (theme) => theme.palette.background.default, zIndex: 1 }}
                    direction="column"
                    gap={2}
                    paddingInline={2}
                    paddingBlock={2}>
                    <Typography variant="h4" margin={0}>
                        Text matches from training data
                    </Typography>
                    <Typography>
                        Select a document from this list to highlight which parts of the
                        model&apos;s response have an exact text match in the training data.
                    </Typography>
                </Stack>
            }>
            <Stack marginInline={2} direction="column" gap={2} paddingBottom={2}>
                <AttributionDrawerDocumentList />
            </Stack>
        </ResponsiveDrawer>
    );
};
